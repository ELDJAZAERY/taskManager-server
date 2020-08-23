## Candidate - EL DJAZAERY 
## KPMG - task manager


## Dependencies

- NodeJS 10
- Typescript 3.5.3
- Express ^4.\*
- Express-async-errors
- TypeORM
- PostgreSQL 11.X
- Axios
- JsonWebToken
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

    # Script
      - git clone {{ Repo }}
      - npm install
      - npm run-script docker

## SEED DATA

# change the data in src/SEED/data

# WITHIN DOCKER

     - after build the docker
        - docker exec -it img-name yarn seed

# WITHOUT DOCKER

     - yarn seed
