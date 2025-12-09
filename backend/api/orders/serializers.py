from rest_framework import serializers
from .models import Order, OrderItem
from products.serializers import ProductListSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    product_details = ProductListSerializer(source='product', read_only=True)
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_details', 'quantity', 'price', 'total_price']
        extra_kwargs = {
            'product': {'write_only': True}
        }


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    total_amount = serializers.ReadOnlyField()

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'status', 'items', 'total_amount', 
            'shipping_address', 'billing_address', 'created_at', 
            'updated_at', 'shipping_cost', 'tax'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at', 'total_amount']


class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = [
            'id', 'status', 'items', 'total_amount', 
            'shipping_address', 'billing_address', 
            'shipping_cost', 'tax', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'status', 'total_amount', 'created_at', 'updated_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        user = self.context['request'].user
        order = Order.objects.create(user=user, **validated_data)

        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)

        return order