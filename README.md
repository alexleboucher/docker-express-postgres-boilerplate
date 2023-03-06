<h1 align="center">Docker Express Postgres Auth Boilerplate</h1>

<p align="center">
  <a href="https://stackshare.io/alexleboucher/docker-express-postgres-auth">
    <img src="https://img.shields.io/badge/tech-stack-0690fa.svg?style=flat" alt="StackShare" />
  </a>
</p>

<p align="center">
  <b>A really simple boilerplate to build a REST API with authentication written in TypeScript and using Docker, Express, TypeORM and Passport</b></br>
  <sub>Made by <a href="https://github.com/w3tecch">Alex Le Boucher</a></sub>
</p>

<br />

## Overview

The main goal of this boilerplate is to setup an Express REST API and add common features like Docker containerization, database connection, authentication with session, error handling, etc.

Try it out and give me your opinion on what you would like to see integrated.

## Features

- **Docker containerization** to easily run your code anywhere and don't have to install tools like PostgreSQL on your computer.
- **Simple Authentication** with [Passport](https://www.passportjs.org/).
- **Authentication session** thanks to [express-session](https://github.com/expressjs/session) and [connect-pg-simple](https://github.com/voxpelli/node-connect-pg-simple)
- **Simplified Database Query** managed by [TypeORM](https://github.com/typeorm/typeorm).
- **Simple but clear Structure** with different layers like routes, controllers, entities, utils, middlewares, config, etc.
- **Object-oriented database model** with [TypeORM](https://github.com/typeorm/typeorm) entities.
- **Exception Handling** using [http-errors](https://github.com/jshttp/http-errors).
- **Basic Security Features** with [Helmet](https://helmetjs.github.io/), [cors](https://github.com/expressjs/cors).
- **Configurated Code Linter** with [ESLint](https://eslint.org/) and common rules.
- **Helpful logger** with [morgan](https://github.com/expressjs/morgan)
- **A lot of other features** mainly integrated by [TypeORM](https://github.com/typeorm/typeorm) like [Entity listener and subscribers](https://typeorm.io/listeners-and-subscribers), [migrations](https://typeorm.io/migrations) or [transactions](https://typeorm.io/transactions)

## Table of Contents

- [Getting Started](#getting-started)
- [Scripts and Tasks](#scripts-and-tasks)
- [Debugger in VSCode](#debugger-in-vscode)
- [API Routes](#-api-routes)
- [Project Structure](#-project-structure)
- [Logging](#-logging)
- [Event Dispatching](#-event-dispatching)
- [Seeding](#-seeding)
- [GraphQL](#-graph-q-l)
- [Docker](#-docker)
- [Further Documentations](#-further-documentations)
- [Related Projects](#-related-projects)
- [License](#-license)

## Getting Started

### Step 1: Set up the Development Environment

You need to set up your development environment before you can do anything.

#### Install [Node.js and NPM](https://nodejs.org/en/download/)

- on OSX use [homebrew](http://brew.sh) `brew install node`
- on Windows use [chocolatey](https://chocolatey.org/) `choco install nodejs`

#### Install yarn globally

```bash
yarn global add yarn
```

#### Install [Docker Desktop](https://www.docker.com/products/docker-desktop/).

- Install Docker Desktop
- Run Docker Desktop

### Step 2: Clone the project

```bash
git clone https://github.com/jsynowiec/node-typescript-boilerplate
cd node-typescript-boilerplate
yarn
```

### Step 3: Copy .env.example file

```bash
cp .env.example .env
```

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

## Scripts

All script are defined in the `package-scripts.js` file, but the most important ones are listed here.

### Install

- Install all dependencies with `yarn install`

### Linting

- Run code quality analysis using `yarn lint`. This runs ESLint and display warning and errors.
- You can also use `yarn lint:fix` to run ESLint and fix fixable warning and errors.

### Docker

- Run `yarn docker:up` to start the containers defined in `docker-compose.yml`. It automatically opens a shell in the `api` container. In this shell, you can run other scrips like `yarn dev` or run TypeORM migrations, etc.
- Run `docker:down` to stop the running containers.
- Run `docker:shell` to open a shell in `api` container
- Run `docker:build` to build an image of your API.

### Running in dev mode

- Run `yarn dev` to start [nodemon](https://www.npmjs.com/package/nodemon) with ts-node, to serve the app.
- Buy default, the server will be running on `http://0.0.0.0:8000` (or `http://localhost:8000`).

## API Routes

The route prefix is `/api` by default, but you can change this in the .env file.
The swagger and the monitor route can be altered in the `.env` file.

| Route           | Description |
| --------------- | ----------- |
| **/api/health** | Show `Server is up!` |
| **/api/users**  | Example entity endpoint |
| **/api/pets**   | Example entity endpoint |

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

## ❯ Logging

To log HTTP requests, we use the express middleware [morgan](https://github.com/expressjs/morgan).
You can easily configurate it by passing an other [predifined format](https://github.com/expressjs/morgan#predefined-formats) as parameter in `src/config/express.ts`

Example:
```typescript
app.use(morgan('short'));
```

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

## License

[MIT](/LICENSE)
