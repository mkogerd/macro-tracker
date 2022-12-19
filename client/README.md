# Macro-Tracker Web Client
This module contains the frontend client code and the web server responsible for delivering it.

## Compatibility
This project requires node v17+ to run.

## Configuration
To configure the frontend client to connect to the supporting backend API, copy the template from `.env.default` to a new `.env` file and fill in the specified values. For example:
```shell
REACT_APP_API_HOST=localhost
REACT_APP_API_PORT=3001
```

## Running with Node
The recommended way to run this project for development is with node. To do so, run the following command:
```
npm start
```

This will spin up a development server on port `:3000` of your local machine.

## Running with Docker
The recommended way to deploy this project is with docker. To run with docker, first build the image with:
```
docker build -t macro-web-client .
```

The image can then be run with:
```
docker container run <EXTERNAL_PORT>:3000 -d macro-web-client
```

For example, running `docker container run -p 3000:3000 -d macro-web-client` will allow the web-client to be accessed at `localhost:3000`.

**Note:** The current docker configuration doesn't make use of  volumes for source code, so the `macro-web-client` image will have to be rebuilt in order to pick up any source code changes. If you're a developer working on the project, consider [running the project with node](#running-with-node) to instantly pick up on source code changes.