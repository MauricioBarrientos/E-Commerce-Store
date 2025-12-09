from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status


class UserAPITest(APITestCase):
    def setUp(self):
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'password': 'testpassword123',
            'password_confirm': 'testpassword123'
        }

    def test_user_registration(self):
        """Test user registration endpoint"""
        url = reverse('user-register')
        response = self.client.post(url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(response.data['user']['username'], 'testuser')

    def test_user_profile_access(self):
        """Test user profile access after authentication"""
        user = User.objects.create_user(username='testuser', password='testpass')
        self.client.force_authenticate(user=user)
        
        url = reverse('user-profile')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')