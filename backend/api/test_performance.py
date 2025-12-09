"""
Pruebas básicas para verificar que las funcionalidades principales sigan funcionando
después de las optimizaciones de rendimiento e índices.
"""
from django.test import TestCase
from django.contrib.auth.models import User
from products.models import Product, Category
from cart.models import Cart, CartItem
from orders.models import Order, OrderItem
from decimal import Decimal


class PerformanceImprovementsTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.category = Category.objects.create(name="Electronics", description="Electronic items")
        self.product = Product.objects.create(
            name="Smartphone",
            description="Latest smartphone",
            price=Decimal('599.99'),
            category=self.category,
            stock=10
        )

    def test_product_filters_still_work(self):
        """Test que los filtros en ProductListView siguen funcionando correctamente"""
        # Probar filtro por categoría
        products_by_category = Product.objects.filter(category=self.category)
        self.assertEqual(products_by_category.count(), 1)
        
        # Probar filtro por disponibilidad (stock > 0)
        available_products = Product.objects.filter(stock__gt=0)
        self.assertEqual(available_products.count(), 1)
        
        # Probar filtro por disponibilidad (stock = 0)
        unavailable_products = Product.objects.filter(stock=0)
        self.assertEqual(unavailable_products.count(), 0)

    def test_cart_optimized_methods(self):
        """Test que los métodos optimizados de Cart funcionan correctamente"""
        cart, created = Cart.objects.get_or_create(user=self.user)
        cart_item = CartItem.objects.create(
            cart=cart,
            product=self.product,
            quantity=2
        )
        
        # Test métodos optimizados
        total_items = cart.get_total_items()
        total_cost = cart.get_total_cost()
        
        self.assertEqual(total_items, 2)
        self.assertEqual(total_cost, Decimal('1199.98'))  # 2 * 599.99

    def test_indexes_exist(self):
        """Test que las mejoras en índices no rompen la funcionalidad"""
        # Probar que las búsquedas por campos indexados funcionan
        indexed_product = Product.objects.filter(name="Smartphone").first()
        self.assertIsNotNone(indexed_product)
        
        indexed_cart = Cart.objects.filter(user=self.user).first()
        self.assertIsNotNone(indexed_cart)

    def test_order_with_prefetch_related(self):
        """Test que las consultas con prefetch_related funcionan"""
        order = Order.objects.create(
            user=self.user,
            total_amount=Decimal('599.99'),
            shipping_address='123 Test St',
            billing_address='123 Test St'
        )
        
        order_item = OrderItem.objects.create(
            order=order,
            product=self.product,
            quantity=1,
            price=Decimal('599.99')
        )
        
        # Probar prefetch_related
        order_with_items = Order.objects.prefetch_related('items__product').get(id=order.id)
        self.assertEqual(order_with_items.items.count(), 1)
        self.assertEqual(order_with_items.items.first().product.name, "Smartphone")