from django.urls import path
from . import views

urlpatterns = [
    path('products/import/', views.import_products_from_api, name='import-products'),
    path('products/featured/', views.featured_products, name='featured-products'),
    path('products/category/<slug:category_slug>/', views.product_by_category, name='products-by-category'),
    path('products/', views.ProductListView.as_view(), name='product-list'),
    path('products/<slug:slug>/', views.ProductDetailView.as_view(), name='product-detail'),
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    path('categories/<slug:slug>/', views.CategoryDetailView.as_view(), name='category-detail'),
]