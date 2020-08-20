## ATGIS Backend Node Server

Nodejs with typeScript Boilerplate

## ATGIS Documentation

Documentation contains all ATGIS API ENDPOINTS.

     - BASE URL : host/api
       - /ATGIS
            - /code
            - /geocode
            - /elevate
            - /autocode

[LINK TO DOC](https://**.com) # SOON

## Dependencies

- NodeJS 10
- Typescript 3.5.3
- Express ^4.\*
- Express-async-errors
- TypeORM
- PostgreSQL 11.X || mongoose : ^5.\*
- Axios
- Jsonwebtoken
- Crypto
- Jest

- cors : "^2.8.5"
- class-transformer : "^0.2.3"
- class-validator : "^0.10.0"
- config : "^3.2.2"
- winston : "^3.2.1"

## Installation

```
 yarn install

 npm install

```

## RUN APP

```

yarn start

npm start

npm run-script docker

```

## RUN TESTS

```
yarn test
```

## DOCKERIZATION

    # Requirements
        - Docker
        - Docker-compose

    # Guide
      - git clone {{ Repo }}
      - npm install
      - npm run-script docker

      // Backend API will listening on Port 4000
        - change port in docker-compose.yml from 4000 to whatever else

      // Postgres will listening on Port 11543
        - connect with user postgres pwd postgres db test

## SEED DATA

# change the data in src/SEED/data

# WITHIN DOCKER

     - after build the docker
        - docker exec -it backend_server_1 yarn seed

# WITHOUT DOCKER

     - yarn seed
