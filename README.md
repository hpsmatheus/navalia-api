## Backend Challenge API

Tech Stack: [Node.js](https://nodejs.org/en/docs/), [Typescript](https://www.typescriptlang.org/docs/), [Nest.js](https://docs.nestjs.com/), [PostgreSQL](https://www.postgresql.org/docs/), [TypeORM](https://typeorm.io/)

## Requirements

- Node v16.13.2 or higher
- Docker compose (optional)

## Run Application Locally

```bash
$ git clone
```

```bash
$ npm install
```

```bash
$ docker compose up

this will start postgres and adminer on local containers
adminer is lighwheight DBMS that runs on browser

alternatively you can set up your own local postgres database
```

```bash
-> access adminer on your localhost:8080

* server: db
* username: pgsql
* password: pgsql
* leave the database field empty
(you may change these values on docker-compose.yml following your preferences)

-> create a database with the name of your preference and leave it empty
```

```bash
-> create a .env file on project root following .env.example model and fill
the placeholders with the same values above
```

```bash
$ npm run start:dev

this will execute all pending migrations in the database
```

## API Docs

[Swagger] http://localhost:3000/api-docs

Typings with suffix `.dto.ts`, `.entity.ts` or `.response.ts` are automatically set to be read by swagger. This config is `nest-cli.json` file following
[Nest.js standards](https://docs.nestjs.com/openapi/cli-plugin#using-the-cli-plugin)

## Tests: unit and integration

```bash
# run all tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Linter and formatting

```bash
# find problems
$ npm run lint

# find and fix problems automatically
$ npm run lint:fix

# format code
$ npm run format
```

## Architecture design

1. The endpoints are organized following Nest.js standard structure of _Modulues, Controllers and Services_. The entry point module is the `app.module` that imports the other needed modules to make the endpoints available. This structure wraps all the endpoint dependencies inside a module and applies the singleton design pattern
   when creating objects (done by nest.js in the background).

2. The `src/core` folder contains shareable resources that are used throughout the application and are not related to a specific functional requirement.

## Error handling and logging

Errors are handled by a global nest interceptor created in `src/core/request-interceptor/request.interceptor.ts` and configured in `src/main.ts`. This interceptor catches any error thrown in the application and makes sure that is going to be returned in a standard format.

This same interceptor is also responsible for logging operation start, end and error with relevant data.

## Input validation

All the input typings carry its own validations using [class-validator](https://www.npmjs.com/package/class-validator) decorators. The validations are triggered by a global nest.js validation pipe created in `src/core/api-validation-pipe.ts` and configured in `src/main`.

## Caching

Currently the cart is stored in nest.js cache and has a TTL of 24 hours.

## Migrations

When starting the application for the first time, migrations to create and populate products will execute automatically.
