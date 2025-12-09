from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Order
from .serializers import OrderSerializer, OrderCreateSerializer
from cart.models import Cart


class OrderListView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.prefetch_related('items__product').filter(user=self.request.user)

    def perform_create(self, serializer):
        # Crear orden desde el carrito actual del usuario
        cart = Cart.objects.prefetch_related('items__product').filter(user=self.request.user).first()
        if cart and cart.items.exists():
            # Calcular total_amount basado en los items del carrito
            total = sum(item.total_price for item in cart.items.all())
            order = serializer.save(user=self.request.user, total_amount=total)

            # Crear OrderItems desde los CartItems
            for cart_item in cart.items.all():
                order.items.create(
                    product=cart_item.product,
                    quantity=cart_item.quantity,
                    price=cart_item.product.price
                )

            # Vaciar el carrito después de crear la orden
            cart.items.all().delete()
        else:
            # Si no hay carrito, crear orden vacía o devolver error
            serializer.save(user=self.request.user, total_amount=0)


class OrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.prefetch_related('items__product').filter(user=self.request.user)


@api_view(['POST'])
def create_order_from_cart(request):
    """
    Endpoint para crear una orden directamente desde el carrito
    """
    cart = get_object_or_404(Cart, user=request.user)
    
    if not cart.items.exists():
        return Response(
            {'error': 'Cart is empty'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Calcular total
    total_amount = sum(item.total_price for item in cart.items.all())
    
    # Obtener direcciones del request o usar valores por defecto
    shipping_address = request.data.get('shipping_address', 'Not specified')
    billing_address = request.data.get('billing_address', shipping_address)
    
    # Crear la orden
    order = Order.objects.create(
        user=request.user,
        total_amount=total_amount,
        shipping_address=shipping_address,
        billing_address=billing_address
    )
    
    # Crear los OrderItems
    for cart_item in cart.items.all():
        order.items.create(
            product=cart_item.product,
            quantity=cart_item.quantity,
            price=cart_item.product.price
        )
    
    # Vaciar el carrito
    cart.items.all().delete()
    
    serializer = OrderSerializer(order)
    return Response(serializer.data, status=status.HTTP_201_CREATED)