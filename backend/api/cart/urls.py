from django.urls import path
from . import views

urlpatterns = [
    path('cart/', views.CartDetailView.as_view(), name='cart-detail'),
    path('cart/add/', views.add_to_cart, name='add-to-cart'),
    path('cart/item/<int:item_id>/update/', views.update_cart_item, name='update-cart-item'),
    path('cart/item/<int:item_id>/remove/', views.remove_from_cart, name='remove-from-cart'),
    path('cart/clear/', views.clear_cart, name='clear-cart'),
]