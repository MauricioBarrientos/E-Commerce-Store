from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from products.models import Product


class CartDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = CartSerializer

    def get_object(self):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        # Prefetch items to optimize the serializer
        cart = Cart.objects.prefetch_related('items__product').get(id=cart.id)
        return cart


@api_view(['POST'])
def add_to_cart(request):
    """
    Endpoint para añadir productos al carrito
    """
    product_id = request.data.get('product_id')
    quantity = int(request.data.get('quantity', 1))
    
    if not product_id:
        return Response({'error': 'Product ID is required'}, status=status.HTTP_400_BAD_REQUEST)

    product = get_object_or_404(Product, id=product_id)
    cart, created = Cart.objects.get_or_create(user=request.user)
    
    cart_item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=product,
        defaults={'quantity': quantity}
    )
    
    if not created:
        cart_item.quantity += quantity
        cart_item.save()
        
    serializer = CartItemSerializer(cart_item)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['PUT'])
def update_cart_item(request, item_id):
    """
    Endpoint para actualizar la cantidad de un producto en el carrito
    """
    cart_item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
    quantity = int(request.data.get('quantity', 1))
    
    if quantity <= 0:
        cart_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    cart_item.quantity = quantity
    cart_item.save()
    
    serializer = CartItemSerializer(cart_item)
    return Response(serializer.data)


@api_view(['DELETE'])
def remove_from_cart(request, item_id):
    """
    Endpoint para eliminar un producto del carrito
    """
    cart_item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
    cart_item.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['DELETE'])
def clear_cart(request):
    """
    Endpoint para vaciar todo el carrito
    """
    cart = get_object_or_404(Cart, user=request.user)
    cart.items.all().delete()
    return Response(status=status.HTTP_204_NO_CONTENT)