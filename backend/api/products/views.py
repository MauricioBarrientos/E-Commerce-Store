import requests
from django.core.files.base import ContentFile
from urllib.parse import urlparse
from django.db import transaction
import os
from rest_framework import generics, filters, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product, Category
from .serializers import ProductSerializer, ProductListSerializer, CategorySerializer


class ProductListView(generics.ListCreateAPIView):
    serializer_class = ProductListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_active']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'updated_at']
    ordering = ['-created_at']

    def get_permissions(self):
        # Permitir acceso público a la lista de productos
        if self.request.method == 'GET':
            return []
        # Requerir autenticación para crear productos
        else:
            return [IsAuthenticated()]

    def get_queryset(self):
        queryset = Product.objects.select_related('category')

        # Manejar el filtro de disponibilidad (stock > 0)
        available = self.request.query_params.get('available', None)
        if available is not None:
            if available.lower() in ['true', '1', 'yes']:
                queryset = queryset.filter(stock__gt=0)
            else:
                queryset = queryset.filter(stock=0)

        return queryset


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.select_related('category')
    serializer_class = ProductSerializer
    lookup_field = 'slug'

    def get_permissions(self):
        # Permitir acceso público a detalles del producto
        if self.request.method == 'GET':
            return []
        # Requerir autenticación para editar/eliminar productos
        else:
            return [IsAuthenticated()]


class CategoryListView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        # Permitir acceso público a la lista de categorías
        if self.request.method == 'GET':
            return []
        # Requerir autenticación para crear categorías
        else:
            return [IsAuthenticated()]


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'

    def get_permissions(self):
        # Permitir acceso público a detalles de categoría
        if self.request.method == 'GET':
            return []
        # Requerir autenticación para editar/eliminar categorías
        else:
            return [IsAuthenticated()]


@api_view(['GET'])
def product_by_category(request, category_slug):
    """
    Endpoint para obtener productos por categoría
    """
    try:
        category = Category.objects.get(slug=category_slug)
        products = Product.objects.filter(category=category, is_active=True)
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)
    except Category.DoesNotExist:
        return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def featured_products(request):
    """
    Endpoint para obtener productos destacados (ej. con mayor stock o más recientes)
    """
    products = Product.objects.filter(is_active=True, stock__gt=0)[:10]  # Últimos 10 productos activos
    serializer = ProductListSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def import_products_from_api(request):
    """
    Endpoint para importar productos desde una API externa (por ejemplo, Fake Store API)
    """
    try:
        # URL de la API externa - en producción esto podría venir de una configuración
        api_url = request.data.get('api_url', 'https://fakestoreapi.com/products')

        # Realizar la solicitud a la API externa
        response = requests.get(api_url)
        response.raise_for_status()

        external_products = response.json()

        imported_count = 0

        for external_product in external_products:
            # Mapear categorías
            category_name = external_product.get('category', 'General')

            # Definir imágenes por defecto según la categoría
            default_images = {
                "men's clothing": "categories/mens_clothing_default.jpg",
                "women's clothing": "categories/womens_clothing_default.jpg",
                "electronics": "categories/electronics_default.jpg",
                "jewelery": "categories/jewelry_default.jpg",
            }

            category, created = Category.objects.get_or_create(
                name=category_name,
                defaults={
                    'description': f'Productos de {category_name}',
                    'image': default_images.get(category_name.lower(), '')  # Imagen por defecto según categoría
                }
            )

            # Si la categoría ya existía pero no tiene imagen, actualizamos con la imagen por defecto
            if not created and not category.image:
                category.image = default_images.get(category_name.lower(), '')
                category.save()

            # Verificar si el producto ya existe (basado en el título)
            product_name = external_product.get('title', '')
            product_description = external_product.get('description', '')
            product_price = float(external_product.get('price', 0))
            product_image_url = external_product.get('image', '')

            # Verificar si ya existe un producto con el mismo nombre
            existing_product = Product.objects.filter(name=product_name).first()
            if existing_product:
                # Actualizar el producto existente
                existing_product.description = product_description
                existing_product.price = product_price
                existing_product.category = category
                if product_image_url and not existing_product.image:
                    # Si el producto no tiene imagen y la API externa sí provee una
                    try:
                        image_response = requests.get(product_image_url)
                        if image_response.status_code == 200:
                            # Obtener el nombre del archivo de la URL
                            parsed_url = urlparse(product_image_url)
                            filename = os.path.basename(parsed_url.path)
                            if not filename or '.' not in filename:
                                # Si no hay extensión, asumimos que es una imagen jpg
                                filename = f"{existing_product.slug or existing_product.id}.jpg"

                            # Guardar la imagen
                            image_content = ContentFile(image_response.content)
                            existing_product.image.save(filename, image_content, save=True)
                    except Exception:
                        # Si hay un error al descargar la imagen, simplemente continuamos
                        pass
                else:
                    existing_product.save()
            else:
                # Crear nuevo producto
                new_product = Product(
                    name=product_name,
                    description=product_description,
                    price=product_price,
                    category=category,
                    stock=10,  # Establecer stock inicial
                )

                # Descargar y guardar la imagen si está disponible
                if product_image_url:
                    try:
                        image_response = requests.get(product_image_url)
                        if image_response.status_code == 200:
                            # Obtener el nombre del archivo de la URL
                            parsed_url = urlparse(product_image_url)
                            filename = os.path.basename(parsed_url.path)
                            if not filename or '.' not in filename:
                                # Si no hay extensión, asumimos que es una imagen jpg
                                filename = f"{new_product.name.replace(' ', '_')[:50]}.jpg"

                            # Guardar la imagen
                            image_content = ContentFile(image_response.content)
                            new_product.image.save(filename, image_content, save=False)

                    except Exception:
                        # Si hay un error al descargar la imagen, continuamos sin imagen
                        pass

                new_product.save()
                imported_count += 1

        return Response({
            'message': f'Importación completada exitosamente',
            'imported_count': len(external_products)
        }, status=status.HTTP_201_CREATED)

    except requests.exceptions.RequestException as e:
        return Response({
            'error': f'Error al conectarse con la API externa: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except Exception as e:
        return Response({
            'error': f'Error durante la importación: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)