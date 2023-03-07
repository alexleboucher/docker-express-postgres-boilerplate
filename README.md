<h1 align="center">Docker Express Postgres Auth Boilerplate</h1>

<p align="center">
  <a href="https://stackshare.io/alexleboucher/docker-express-postgres-boilerplate">
    <img src="https://img.shields.io/badge/tech-stack-0690fa.svg?style=flat" alt="StackShare" />
  </a>
</p>

<p align="center">
  <b>A really simple boilerplate to build a REST API with authentication written in TypeScript and using Docker, Express, TypeORM and Passport</b></br>
  <sub>Made by <a href="https://github.com/alexleboucher">Alex Le Boucher</a></sub>
</p>

<br />

---

## Overview

The main goal of this boilerplate is to setup an Express REST API and add common features like Docker containerization, database connection, authentication with session, error handling, etc.

Try it out and give me your opinion on what you would like to see integrated.

---

## Features

- **Docker containerization** to easily run your code anywhere and don't have to install tools like PostgreSQL on your computer.
- **Simple Authentication** with [Passport](https://www.passportjs.org/).
- **Authentication session** thanks to [express-session](https://github.com/expressjs/session) and [connect-pg-simple](https://github.com/voxpelli/node-connect-pg-simple)
- **Simplified Database Query** managed by [TypeORM](https://github.com/typeorm/typeorm).
- **Simple but clear Structure** with different layers like routes, controllers, entities, utils, middlewares, config, etc.
- **Object-oriented database model** with [TypeORM](https://github.com/typeorm/typeorm) entities.
- **Exception Handling** using [http-errors](https://github.com/jshttp/http-errors).
- **Basic Security Features** with [Helmet](https://helmetjs.github.io/) and [cors](https://github.com/expressjs/cors).
- **Configurated Code Linter** with [ESLint](https://eslint.org/) and common rules.
- **Helpful logger** with [morgan](https://github.com/expressjs/morgan)
- **Migration generation** based on entity changes thanks to [TypeORM](https://github.com/typeorm/typeorm)
- **A lot of other features** mainly integrated by [TypeORM](https://github.com/typeorm/typeorm) like [Entity listener and subscribers](https://typeorm.io/listeners-and-subscribers) or [transactions](https://typeorm.io/transactions)

---

## Table of Contents

- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [API Routes](#api-routes)
- [Project Structure](#project-structure)
- [Database Migrations](#database-migrations)
- [Logging](#logging)
- [Common errors](#common-errors)
- [Further Documentations](#further-documentations)
- [License](#license)

---

## Getting Started

### Step 1: Set up the Development Environment

You need to set up your development environment before you can do anything.

#### Install [Node.js and NPM](https://nodejs.org/en/download/)

- on OSX use [homebrew](http://brew.sh) `brew install node`
- on Windows use [chocolatey](https://chocolatey.org/) `choco install nodejs`

#### Install yarn globally

```bash
npm install --global yarn
```

#### Install [Docker Desktop](https://www.docker.com/products/docker-desktop/).

- Install Docker Desktop
- Run Docker Desktop

### Step 2: Clone the project

```bash
git clone https://github.com/alexleboucher/docker-express-postgres-boilerplate
cd docker-express-postgres-boilerplate
yarn
```

### Step 3: Copy .env.example file

- on OSX run `cp .env.example .env`
- on Windows run `copy .env.example .env`

### Step 4: Run the server

```bash
yarn docker:up
yarn dev
```

> This starts a local server using `nodemon`, which will watch for any file changes and will restart the server according to these changes.
> The server will be running on `http://0.0.0.0:8000` (or `http://localhost:8000`).

### Step 5: Test the server

To test the server, you can query `http://localhost:8000/api/health` using [Postman](https://www.postman.com/) or just copy it in the address bar in your browser.
If the server is running, you should receive `Server is up!` as response.

### Step 6: Create the user database table

To create the User database table, you must run the migration.
Run `yarn migration:run` to run the migration and create the table.

---

## Scripts

⚠️ Except Docker scripts, all the scripts must be executed in the `api` container shell.


### Docker

- Run `yarn docker:up` to start the containers defined in `docker-compose.yml`. It automatically opens a shell in the `api` container. In this shell, you can run other scrips like `yarn dev` or run TypeORM migrations, etc.
- Run `docker:down` to stop the running containers.
- Run `docker:shell` to open a shell in `api` container
- Run `docker:build` to build an image of your API.

### Install

- Install all dependencies with `yarn install`.

### Running in dev mode

- Run `yarn dev` to start [nodemon](https://www.npmjs.com/package/nodemon) with ts-node, to serve the app.
- By default, the server will be running on `http://0.0.0.0:8000` (or `http://localhost:8000`).

### Migrations
- Run `yarn migration:run` to run non-executed migrations.
- Run `yarn migration:generate MigrationName` to generate a migration based on entities changes.
- Run `yarn migration:create MigrationName` to create a empty migration.
- Run `yarn migration:revert` to revert the last migration. If you want to revert multiple migrations, you can run this command several times.

### Linting

- Run code quality analysis using `yarn lint`. This runs ESLint and display warning and errors.
- You can also use `yarn lint:fix` to run ESLint and fix fixable warning and errors.

---

## API Routes

The route prefix is `/api` by default, but you can change this in the .env file.
The swagger and the monitor route can be altered in the `.env` file.

| Route           | Description |
| --------------- | ----------- |
| **/api/health** | Show `Server is up!` |
| **/api/users**  | Example entity endpoint |
| **/api/pets**   | Example entity endpoint |

---

## Project Structure

| Name                                        | Description |
| ------------------------------------------- | ----------- |
| **.vscode/**                                | VSCode tasks, launch configuration and some other settings |
| **@types/**                                 | Golbal types definitions |
| **build/**                                  | Compiled source files will be placed here |
| **src/**                                    | Source files |
| **src/controllers/**                        | REST API Controllers |
| **src/controllers/[feature]/index.ts**      | Validation functions for feature routes |
| **src/controllers/[feature]/validators.ts** | Validation functions for feature routes |
| **src/entities/**                           | TypeORM entities |
| **src/middlewares/**                        | Middlewares like error handler |
| **src/routes/**                             | REST API Routes |
| **src/routes/[feature].ts**                 | Feature routes |
| **src/types/**                              | Typescript types |
| **src/utils/**                              | Utils functions |
| **src/data-source.ts**                      | TypeORM data source |
| **src/index.ts**                            | REST API entry point |
| **.dockerignore**                           | Docker ignore file |
| **.env.example**                            | Environment variables example file |
| **.eslintrc.json**                          | ESLint configuration file |
| **.gitignore**                              | Git ignore file |
| **docker-compose.yml**                      | Docker Compose configuration file |
| **Dockerfile**                              | Dockerfile configuration |
| **LICENSE**                                 | License file |
| **package.json**                            | Package configuration file |
| **tsconfig.json**                           | Typescript configuration file |
| **yarn.lock**                               | Package lock file |

---

## Database Migrations

Thanks to TypeORM, you can easily manage your migrations. The executed migrations are stored in a table, it allows TypeORM to know which migrations must be executed but also to revert migrations if you need.

⚠️ The migrations script must be executed in the `api` container shell.

### Create a migration

To create a migration, run `yarn migration:create MigrationName`, it will create an empty migration in `src/migrations`. The migration file have two functions : `up` and `down`. `up` is executed when you run the migration. `down` is executed when you revert the migration.

### Generate a migration

To generate a migration based on entities changes, run `yarn migration:generate MigrationName`, it will create a migration in `src/migrations`. The migration is automatically generated based on your entities compared to your actual database.

You can try by adding a property `firstName` in the `User` entity :
```typescript
@Column({ nullable: false, length: 20 })
firstName!: string;
```
Then, run `yarn migration:generate AddFirstNameInUser`, it will automatically generate a migration to create the new column.

### Run migrations

To run the migrations that have not been executed yet, run `yarn migration:run`.

### Revert a migration

You can revert the last migration by running `yarn migration:revert`. If you want to revert multiple migrations, you can run this command several times.

---

## Logging

To log HTTP requests, we use the express middleware [morgan](https://github.com/expressjs/morgan).
You can easily configurate it by passing an other [predifined format](https://github.com/expressjs/morgan#predefined-formats) as parameter in `src/config/express.ts`

Example:
```typescript
app.use(morgan('short'));
```

---

## Common errors

If you encounter an error when running `yarn docker:up`, make sure you launched Docker Desktop.

If you encounter an error when running a script, make sure you are in `api` container shell.

---

## Further Documentations

| Name & Link                       | Description                       |
| --------------------------------- | --------------------------------- |
| [Express](https://expressjs.com/) | Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. |
| [TypeORM](http://typeorm.io/#/) | TypeORM is highly influenced by other ORMs, such as Hibernate, Doctrine and Entity Framework. |
| [Helmet](https://helmetjs.github.io/) | Helmet helps you secure your Express apps by setting various HTTP headers. It’s not a silver bullet, but it can help! |
| [Passport](https://www.passportjs.org/) | Passport is authentication middleware for Node.js. Extremely flexible and modular, Passport can be unobtrusively dropped in to any Express-based web application. |
| [Docker](https://www.docker.com/) | Docker is a platform designed to help developers build, share, and run modern applications. We handle the tedious setup, so you can focus on the code. |
| [cors](https://github.com/expressjs/cors) | CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options. |
| [PostgreSQL](https://www.postgresql.org/) | PostgreSQL is a powerful, open source object-relational database system with over 35 years of active development that has earned it a strong reputation for reliability, feature robustness, and performance. |
| [TypeScript](https://www.typescriptlang.org/) | TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale. |

---

## License

[MIT](/LICENSE)
