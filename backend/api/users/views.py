from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .serializers import UserSerializer, UserRegistrationSerializer


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'  # Permitir login con email en lugar de username

    def validate(self, attrs):
        # Cambiamos el campo 'email' a 'username' para que funcione con el sistema de autenticación
        email = attrs.get('email')
        password = attrs.get('password')

        # Buscamos el usuario por email
        try:
            user = User.objects.get(email=email)
            username = user.username
        except User.DoesNotExist:
            username = None

        if username:
            attrs['username'] = username
            # Ahora autenticamos con el username real
            user = authenticate(request=self.context.get('request'),
                                username=username, password=password)
            if user:
                refresh = RefreshToken.for_user(user)

                return {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            else:
                # Credenciales incorrectas
                self.fail('no_active_account', code='no_active_account',
                         message='No active account found with the given credentials')
        else:
            # Usuario no encontrado con el email
            self.fail('no_active_account', code='no_active_account',
                     message='No active account found with the given credentials')


class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer


class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_object(self):
        # Devuelve el usuario autenticado actualmente
        return self.request.user


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Endpoint para registrar nuevos usuarios
    """
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def logout_user(request):
    """
    Endpoint para cerrar sesión
    """
    try:
        refresh_token = request.data.get("refresh_token")
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        return Response(status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response(status=status.HTTP_400_BAD_REQUEST)