# Descripción

# Correr en dev

1. Clonar el repositorio
2. Crear una copia del ```.template.env``` y renombrar a ```.env``` y cambiar las variables de entorno
3. Instalar dependencias ```pnpm install```
4. Levantar la base de datos ```docker-compose up -d```
5. Levantar la base de datos ```pnpx prisma migrate dev```
6. Enviar cambios en la base de datos sin afectar la data ```pnpx prisma db push```
6. Ejecutar el proyecto ```pnpm dev```