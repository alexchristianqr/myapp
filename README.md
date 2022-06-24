# Myapp
Example of nodejs backend with express.

## Running with Docker
```bash
# Crear imagen con docker
docker build -t myapp .

# Crear contenedor a partir de una imagen con docker en el puerto 3000
docker run -dp 3000:3000 myapp

# Crear imagen con docker
docker-compose up -d --build

# Secuencia de comandos ECR de AWS
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 073746111526.dkr.ecr.us-east-1.amazonaws.com
docker build -t vuenodejs .
docker tag vuenodejs:latest 073746111526.dkr.ecr.us-east-1.amazonaws.com/vuenodejs:latest
docker push 073746111526.dkr.ecr.us-east-1.amazonaws.com/vuenodejs:latest
```