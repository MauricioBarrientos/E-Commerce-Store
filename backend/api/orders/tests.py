from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from products.models import Product, Category
from cart.models import Cart, CartItem
from .models import Order


class OrderAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.client.force_authenticate(user=self.user)
        
        self.category = Category.objects.create(name="Electronics", description="Electronic items")
        self.product = Product.objects.create(
            name="Smartphone",
            description="Latest smartphone",
            price=599.99,
            category=self.category,
            stock=10
        )

    def test_create_order_from_cart(self):
        """Test creating order from cart"""
        # Add items to cart first
        cart, created = Cart.objects.get_or_create(user=self.user)
        CartItem.objects.create(cart=cart, product=self.product, quantity=2)
        
        url = reverse('create-order-from-cart')
        data = {
            'shipping_address': '123 Main St, City, Country',
            'billing_address': '123 Main St, City, Country'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Order.objects.count(), 1)
        order = Order.objects.first()
        self.assertEqual(order.user, self.user)
        self.assertEqual(order.total_amount, 1199.98)  # 2 * 599.99

    def test_get_user_orders(self):
        """Test retrieving user's orders"""
        # Create an order first
        order = Order.objects.create(
            user=self.user,
            total_amount=1199.98,
            shipping_address='123 Main St, City, Country',
            billing_address='123 Main St, City, Country'
        )
        
        url = reverse('order-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['id'], order.id)