# Macro-Tracker API Server
This module contains the backend server, a Node.js based REST API that communicates with a MySQL database.

## MySQL Database Dependency
This API needs to connect to a MySQL database in order to work properly.

### Setting up a database with docker
If you don't already have a MySQL database to use, you can quickly spin one up using docker.
```
docker run --name mysql-database -p 3306:3306 -e MYSQL_ROOT_PASSWORD=password -d mysql:latest
```

This will create a new container named `mysql-database` running an instance of MySQL. This MySQL instance will have a default `root` user that uses the password specified by `MYSQL_ROOT_PASSWORD`.

### Configuring the API server
To configure the API server to connect to your database, you can copy the template from `.env.default` to a new `.env` file and fill in the values. For example:
```shell
DB_HOST=192.168.1.100
DB_USER=root
DB_PASS=password
```

After configuring the database, you can run the API server (see [Running with Node](#running-with-node) / [Running with docker](#running-with-docker)).

## Running with Node
The recommended way to run this project for development is with node. To do so, run the following command:
```
npm start
```

This will spin up a development server on port `:3001` of your local machine.

## Running with Docker
The recommended way to deploy this project is with docker. To run with docker, first build the image with:
```
docker build -t macro-api-server .
```

The image can then be run with:
```
docker container run <EXTERNAL_PORT>:3001 -d macro-api-server
```

For example, running `docker container run -p 3001:3001 -d macro-api-server` will allow the REST API to be accessed at `localhost:3001`.

**Note:** The current docker configuration doesn't make use of  volumes for source code, so the `macro-api-server` image will have to be rebuilt in order to pick up any source code changes. If you're a developer working on the project, consider [running the project with node](#running-with-node) to instantly pick up on source code changes.