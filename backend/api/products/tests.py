from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Product, Category


class ProductModelTest(TestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Electronics", description="Electronic items")
        self.product = Product.objects.create(
            name="Smartphone",
            description="Latest smartphone",
            price=599.99,
            category=self.category,
            stock=10
        )

    def test_product_creation(self):
        """Test product is created correctly"""
        self.assertEqual(self.product.name, "Smartphone")
        self.assertEqual(self.product.category.name, "Electronics")
        self.assertTrue(self.product.available)
        
    def test_product_slug_creation(self):
        """Test slug is automatically created"""
        self.assertEqual(self.product.slug, "smartphone")


class ProductAPITest(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Electronics", description="Electronic items")
        self.product = Product.objects.create(
            name="Smartphone",
            description="Latest smartphone",
            price=599.99,
            category=self.category,
            stock=10
        )
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.client.force_authenticate(user=self.user)

    def test_get_products_list(self):
        """Test retrieving list of products"""
        url = reverse('product-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_get_product_detail(self):
        """Test retrieving a single product"""
        url = reverse('product-detail', kwargs={'slug': self.product.slug})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Smartphone')

    def test_create_product(self):
        """Test creating a new product"""
        url = reverse('product-list')
        data = {
            'name': 'Laptop',
            'description': 'Gaming laptop',
            'price': 1299.99,
            'category': self.category.id,
            'stock': 5
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Product.objects.count(), 2)
        self.assertEqual(response.data['name'], 'Laptop')