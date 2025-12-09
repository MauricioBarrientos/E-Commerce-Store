# API REST para E-commerce

Backend robusto desarrollado con Django REST Framework y PostgreSQL, dockerizado para un despliegue sencillo.

## Características

- API RESTful completa para e-commerce
- Autenticación JWT
- Gestión de productos, categorías, usuarios y órdenes
- Carrito de compras funcional
- Documentación interactiva con Swagger
- Pruebas unitarias incluidas
- Docker y docker-compose para despliegue sencillo

## Requisitos

- Docker
- Docker Compose

## Instalación y uso

### Clonar el repositorio

```bash
git clone https://github.com/MauricioBarrientos/E-Commerce-Store
cd ecommerce_api
```

### Levantar los servicios con Docker Compose

```bash
docker-compose up --build
```

Esto iniciará los servicios de Django y PostgreSQL. La API estará disponible en `http://localhost:8000`.

### Crear superusuario (opcional)

Para acceder al panel de administración de Django:

```bash
docker-compose exec web python manage.py createsuperuser
```

### Acceder a la documentación de la API

La documentación interactiva de la API está disponible en:
`http://localhost:8000/swagger/`

## Estructura del proyecto

```
ecommerce_api/
├── Dockerfile
├── docker-compose.yml
├── backend/
│   └── api/
│       ├── ecommerce_api/
│       ├── products/
│       ├── users/
│       ├── cart/
│       └── orders/
└── db_data/
```

## Aplicaciones

- `products`: Gestión de productos y categorías
- `users`: Autenticación y perfiles de usuario
- `cart`: Carrito de compras
- `orders`: Gestión de órdenes

## Endpoints API

### Autenticación

- `POST /api/token/` - Obtener token JWT
- `POST /api/token/refresh/` - Refrescar token JWT
- `POST /api/register/` - Registro de usuario
- `POST /api-auth/login/` - Iniciar sesión
- `POST /api-auth/logout/` - Cerrar sesión
- `GET /api/profile/` - Obtener perfil de usuario

### Productos

- `GET /api/products/` - Lista de productos
- `POST /api/products/` - Crear producto (admin)
- `GET /api/products/{slug}/` - Detalles de producto
- `PUT/PATCH /api/products/{slug}/` - Actualizar producto (admin)
- `DELETE /api/products/{slug}/` - Eliminar producto (admin)

### Categorías

- `GET /api/categories/` - Lista de categorías
- `POST /api/categories/` - Crear categoría (admin)
- `GET /api/categories/{slug}/` - Detalles de categoría

### Carrito de compras

- `GET /api/cart/` - Obtener carrito del usuario
- `POST /api/cart/add/` - Añadir producto al carrito
- `PUT /api/cart/item/{id}/update/` - Actualizar cantidad en carrito
- `DELETE /api/cart/item/{id}/remove/` - Remover producto del carrito
- `DELETE /api/cart/clear/` - Vaciar carrito

### Órdenes

- `GET /api/orders/` - Lista de órdenes del usuario
- `POST /api/orders/` - Crear orden
- `GET /api/orders/{id}/` - Detalles de orden
- `POST /api/orders/create-from-cart/` - Crear orden desde carrito

## Variables de entorno

El proyecto utiliza las siguientes variables de entorno:

- `DEBUG` - Modo debug (por defecto: 1)
- `SECRET_KEY` - Clave secreta de Django
- `POSTGRES_DB` - Nombre de la base de datos (por defecto: ecommerce_db)
- `POSTGRES_USER` - Usuario de la base de datos (por defecto: ecommerce_user)
- `POSTGRES_PASSWORD` - Contraseña de la base de datos (por defecto: ecommerce_password)
- `DB_HOST` - Host de la base de datos (por defecto: db)
- `DB_PORT` - Puerto de la base de datos (por defecto: 5432)

## Frontend

El frontend está desarrollado en React con las siguientes características:

- Componentes de navegación y producto
- Sistema de autenticación integrado
- Carrito de compras funcional
- Vista de detalle de producto
- Rutas protegidas

## Pruebas

Para ejecutar las pruebas:

```bash
docker-compose exec web python manage.py test
```

## Contribución

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Haz push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la licencia MIT.

## Mejoras de Rendimiento

- Índices agregados a campos frecuentemente consultados
- Uso de select_related y prefetch_related para optimizar consultas
- Métodos optimizados para cálculo de totales en el carrito
- Filtrado eficiente en vistas de productos