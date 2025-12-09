from rest_framework import serializers
from .models import Product, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'image', 'slug', 'created_at', 'updated_at']
        read_only_fields = ['slug', 'created_at', 'updated_at']


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'category', 
            'category_name', 'stock', 'image', 'is_active', 
            'created_at', 'updated_at', 'slug', 'available'
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at', 'available']


class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'price', 'category',
            'category_name', 'stock', 'image', 'is_active', 'available', 'slug'
        ]