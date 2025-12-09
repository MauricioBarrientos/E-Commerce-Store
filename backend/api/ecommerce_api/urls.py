from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from rest_framework_simplejwt.views import TokenRefreshView
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from users.views import EmailTokenObtainPairView
from django.conf import settings
from django.conf.urls.static import static


schema_view = get_schema_view(
   openapi.Info(
      title="E-commerce API",
      default_version='v1',
      description="API para e-commerce desarrollada con Django REST Framework",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@ecommerce.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('api/token/', EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include('products.urls')),
    path('api/', include('users.urls')),
    path('api/', include('cart.urls')),
    path('api/', include('orders.urls')),
    path('swagger/', schema_view.with_ui(
        'swagger',
        cache_timeout=0
    ), name='schema-swagger-ui'),
]

# Servir archivos multimedia durante el desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)