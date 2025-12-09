from django.db import models
from django.contrib.auth.models import User
from products.models import Product
from decimal import Decimal


class Order(models.Model):
    ORDER_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders', db_index=True)
    status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default='pending', db_index=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, db_index=True)
    shipping_address = models.TextField()
    billing_address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))

    def __str__(self):
        return f"Order {self.id} - {self.user.username}"

    class Meta:
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['created_at', 'status']),
            models.Index(fields=['user', 'created_at']),
        ]


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items', db_index=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, db_index=True)
    quantity = models.PositiveIntegerField(db_index=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, db_index=True)  # Precio en el momento de la compra

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

    @property
    def total_price(self):
        return self.quantity * self.price

    class Meta:
        indexes = [
            models.Index(fields=['order', 'product']),
        ]