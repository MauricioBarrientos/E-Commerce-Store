from django.urls import path
from . import views

urlpatterns = [
    path('profile/', views.UserDetailView.as_view(), name='user-profile'),
    path('register/', views.register_user, name='user-register'),
    path('logout/', views.logout_user, name='user-logout'),
]