<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Running the Application with Docker Compose
To start the application, run:

This command will:
```bash
docker-compose up --build
```

This command will:

* Build the Node.js API service using the provided Dockerfile.
* Pull the Redis image from Docker Hub.
* Start both the Redis and API services.
* 
### Stopping the Application
To stop the running containers, use:

```bash
docker-compose down
```

This command will stop and remove the containers defined in your docker-compose.yml file.



## Access the Application


Swagger Documentation: http://localhost:80/api
