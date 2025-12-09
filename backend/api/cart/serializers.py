from rest_framework import serializers
from .models import Cart, CartItem
from products.serializers import ProductListSerializer


class CartItemSerializer(serializers.ModelSerializer):
    product_details = ProductListSerializer(source='product', read_only=True)
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_details', 'quantity', 'added_at', 'total_price']
        extra_kwargs = {
            'product': {'write_only': True}
        }


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.SerializerMethodField()
    total_cost = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_items', 'total_cost', 'created_at', 'updated_at']

    def get_total_items(self, obj):
        return obj.get_total_items()

    def get_total_cost(self, obj):
        return obj.get_total_cost()