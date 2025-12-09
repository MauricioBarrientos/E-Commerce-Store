#!/bin/bash

# Función para verificar si PostgreSQL está listo
wait_for_db() {
    echo "Esperando a que PostgreSQL esté listo..."
    until pg_isready -h db -p 5432 -U ecommerce_user
    do
        echo "Esperando a la base de datos... (revisando cada 2 segundos)"
        sleep 2
    done
    echo "¡La base de datos PostgreSQL está lista!"
}

# Esperar a que la base de datos esté lista
wait_for_db

# Ejecutar migraciones
echo "Ejecutando migraciones..."
python manage.py migrate

# Iniciar el servidor
echo "Iniciando el servidor web..."
exec python manage.py runserver 0.0.0.0:8000