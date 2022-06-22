# Myapp
Example of nodejs backend with express.

## Running with Docker
```bash
// Crear imagen con docker
docker build -t myapp .

// Crear contenedor a partir de una imagen con docker en el puerto 3000
docker run -dp 3000:3000 myapp
```

## Run with docker-compose with docker ECS

```bash
# Docker ECS
docker context create ecs myecscontext
docker context ls
docker context use myecscontext

# Actualizar imagen
docker compose up
docker compose down

# Crear imagen con docker --context myecscontext
docker-compose up -d --build
docker-compose up -d --build --context myecscontext
docker-compose up --context myecscontext

# Ver registros de aplicaciones
docker compose logs
docker compose --project-name PROJECT logs
docker compose --file /path/to/docker-compose.yaml logs

# Imágenes privadas de Docker
docker secret create dockerhubAccessToken token.json
```

## Running with Docker for AWS ECR
```bash
// Ejemplo #1
docker login --username "alexqds" --password "gR#rB6q,?2mL/tL"
docker tag myapp:latest alexqds/myapp
docker push alexqds/myapp

// Ejemplo #2
docker build -t workflows/api .

// Publico
docker tag myapp:latest 073746111526.dkr.ecr.us-east-1.amazonaws.com/workflows/api:latest
docker push public.ecr.aws/k7u9o2o3/workflows/api:latest

// Privado
docker build -t workflows/api .
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 073746111526.dkr.ecr.us-east-1.amazonaws.com
aws ecr get-login-password --region us-east-1 | docker login --username "alexqds" --password-stdin 073746111526.dkr.ecr.us-east-1.amazonaws.com
docker tag myapp:latest 073746111526.dkr.ecr.us-east-1.amazonaws.com/workflows/api:latest
docker push 073746111526.dkr.ecr.us-east-1.amazonaws.com/workflows/api:latest

```

