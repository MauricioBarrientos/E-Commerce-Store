from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from products.models import Product, Category
from .models import Cart, CartItem


class CartAPITest(APITestCase):
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

    def test_add_to_cart(self):
        """Test adding item to cart"""
        url = reverse('add-to-cart')
        data = {
            'product_id': self.product.id,
            'quantity': 2
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Check cart has the item
        cart_url = reverse('cart-detail')
        cart_response = self.client.get(cart_url)
        self.assertEqual(cart_response.status_code, status.HTTP_200_OK)
        self.assertEqual(cart_response.data['total_items'], 2)
        self.assertEqual(cart_response.data['total_cost'], 1199.98)

    def test_update_cart_item(self):
        """Test updating cart item quantity"""
        # First add item to cart
        cart = Cart.objects.get(user=self.user)
        cart_item = CartItem.objects.create(cart=cart, product=self.product, quantity=1)
        
        url = reverse('update-cart-item', kwargs={'item_id': cart_item.id})
        data = {'quantity': 3}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['quantity'], 3)

    def test_remove_from_cart(self):
        """Test removing item from cart"""
        # First add item to cart
        cart = Cart.objects.get(user=self.user)
        cart_item = CartItem.objects.create(cart=cart, product=self.product, quantity=1)
        
        url = reverse('remove-from-cart', kwargs={'item_id': cart_item.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Check item is removed
        cart_url = reverse('cart-detail')
        cart_response = self.client.get(cart_url)
        self.assertEqual(cart_response.data['total_items'], 0)