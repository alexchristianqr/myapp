# Myapp
Example of nodejs backend with express.

## Running with docker - nestjs
```bash
# Carpeta root
cd myapp/nestjs

# Crear imagen con docker
docker build -t myapp .

# Crear contenedor a partir de una imagen
docker run -dp 80:3000 myapp # para appnestjs

# Crear imagen y contenedor con docker-compose
docker-compose up -d --build
```

## Running with docker - vuejs
```bash
# Carpeta root
cd myapp/vuejs

# Crear imagen con docker
docker build -t myapp .

# Crear contenedor a partir de una imagen
docker run -dp 80:80 myapp # para appvuejs

# Crear imagen y contenedor con docker-compose
docker-compose up -d --build
```
