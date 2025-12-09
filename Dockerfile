FROM python:3.11-slim

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivo de dependencias
COPY ./backend/api/requirements.txt /app/requirements.txt

# Instalar dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Instalar paquete para verificar si postgresql está listo
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

# Copiar código fuente
COPY ./backend/api /app/

# Hacer el script ejecutable
RUN chmod +x /app/wait-for-db.sh

# Crear usuario no root para mayor seguridad
RUN adduser --disabled-password --gecos '' appuser
RUN chown -R appuser:appuser /app
USER appuser

# Exponer puerto
EXPOSE 8000

# Comando por defecto
CMD ["sh", "-c", "/app/wait-for-db.sh"]