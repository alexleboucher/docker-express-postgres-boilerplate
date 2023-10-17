<p align="center">
  <img src="./repo-image.png" alt="docker-express-postgres-boilerplate" width="80%" />
</p>
<h1 align="center">Docker Express Postgres Boilerplate</h1>

<p align="center">
  <a href="https://github.com/alexleboucher/docker-express-postgres-boilerplate/actions/workflows/main.yml">
    <img src="https://github.com/alexleboucher/docker-express-postgres-boilerplate/actions/workflows/main.yml/badge.svg?event=push"/>
  </a>
  <a href="https://codecov.io/gh/alexleboucher/docker-express-postgres-boilerplate" >
    <img src="https://codecov.io/gh/alexleboucher/docker-express-postgres-boilerplate/branch/main/graph/badge.svg?token=FQQ4Z3G1EO"/>
  </a>
  <a href="https://snyk.io/test/github/alexleboucher/docker-express-postgres-boilerplate">
    <img src="https://snyk.io/test/github/alexleboucher/docker-express-postgres-boilerplate/badge.svg"/>
  </a>
  <a href="https://stackshare.io/alexleboucher/docker-express-postgres-boilerplate">
    <img src="https://img.shields.io/badge/tech-stack-0690fa.svg?style=flat" alt="StackShare" />
  </a>
</p>

<p align="center">
  <b>A really simple boilerplate to build a REST API with authentication written in TypeScript and using Docker, Express, TypeORM and Passport</b></br>
  <sub>Made with ❤️ by <a href="https://github.com/alexleboucher">Alex Le Boucher</a> and <a href="https://github.com/alexleboucher/docker-express-postgres-boilerplate/graphs/contributors">contributors</a></sub>
</p>

<br />

---

## Overview

The main goal of this boilerplate is to setup an Express REST API and add common features like Docker containerization, database connection, authentication, error handling, etc.

Some basic routes for authentication and user creation are already implemented. They can be used to quickly start your project. More info about what is already implemented [here](#existing-routes).

End-to-end tests are already implemented. The code coverage is 100%.

Packages are frequently upgraded. You can easily see the packages version status [here](https://docs.google.com/spreadsheets/d/1vIeh02Y_SNqVuoQYIxjEXZTnDHQHr5ctQAk2EgS84KQ/edit?usp=share_link).

⭐ If you like it, please leave a star, it helps me a lot! ⭐

---

## Features

- **Docker containerization** to easily run your code anywhere and don't have to install tools like PostgreSQL on your computer.
- **Authentication** with [Passport](https://www.passportjs.org/).
- **Authentication session** thanks to [express-session](https://github.com/expressjs/session) and [connect-pg-simple](https://github.com/voxpelli/node-connect-pg-simple).
- **Simplified Database Query** managed by [TypeORM](https://github.com/typeorm/typeorm).
- **Simple but clear Structure** with different layers like routes, controllers, entities, utils, middlewares, config, etc.
- **Object-oriented database model** with [TypeORM](https://github.com/typeorm/typeorm) entities.
- **Integrated Testing Tool** with [Jest](https://jestjs.io/fr/docs/getting-started).
- **E2E API Testing** thanks to [Supertest](https://github.com/ladjs/supertest).
- **Tests utils** already implemented to simplify tests creation.
- **Routes protection** with custom middlewares.
- **Exception Handling** using [http-errors](https://github.com/jshttp/http-errors).
- **Basic Security Features** with [Helmet](https://helmetjs.github.io/) and [cors](https://github.com/expressjs/cors).
- **Configurated Code Linter** with [ESLint](https://eslint.org/) and common rules.
- **Helpful logger** with [morgan](https://github.com/expressjs/morgan).
- **Migration generation** based on entity changes thanks to [TypeORM](https://github.com/typeorm/typeorm).
- **Validation utils** thanks to [Validator](https://github.com/validatorjs/validator.js).
- **Transactions control** with [TypeORM](https://github.com/typeorm/typeorm).
- **Entity events** with [TypeORM subscribers](https://typeorm.io/listeners-and-subscribers#what-is-a-subscriber).

---

## Table of Contents

- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [API Routes](#api-routes)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Authentication](#authentication)
- [Migrations](#migrations)
- [Subscribers](#subscribers)
- [E2E Tests](#e2e-tests)
- [Logging](#logging)
- [Existing routes](#existing-routes)
- [Common Errors](#common-errors)
- [Clean Github Templates and Workflows](#clean-github-templates-and-workflows)
- [Upcoming Features](#upcoming-features)
- [Further Documentations](#further-documentations)
- [Contributing](#contributing)
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
rm -rf .git # Windows: rd /s /q .git
yarn install
```

`rm -rf .git` (or `rd /s /q .git` on Windows) deletes the git info of the branch like history.

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

To create the `user` database table, you must run the migration.
Run `yarn migration:run` to run the migration and create the table.

### Step 7 (optional): Clean Github templates and workflows

The project contains Github templates and workflows. If you don't want to keep them, you can easily delete them by following this [section](#clean-github-templates-and-workflows).

---

## Scripts

⚠️ Except Docker scripts, all the scripts must be executed in the `api` container shell.


### • Docker

- Run `yarn docker:up` to start the containers defined in `docker-compose.yml`. It automatically opens a shell in the `api` container. In this shell, you can run other scrips like `yarn dev`.
- Run `docker:down` to stop the running containers.
- Run `docker:shell` to open a shell in `api` container.
- Run `docker:build` to build an image of your API.

### • Install

- Install all dependencies with `yarn install`.

### • Running in dev mode

- Run `yarn dev` to start [nodemon](https://www.npmjs.com/package/nodemon) with ts-node, to serve the app.
- By default, the server will be running on `http://0.0.0.0:8000` (or `http://localhost:8000`).

### • Build

- Run `yarn build` to build the project. The compiled files will be placed in `build/`.
- Run `yarn start` to run compiled project.
- Run `yarn type-check` to run type checking.

### • Migrations
- Run `yarn migration:run` to run non-executed migrations.
- Run `yarn migration:generate MigrationName` to generate a migration based on entities changes.
- Run `yarn migration:create MigrationName` to create a empty migration.
- Run `yarn migration:revert` to revert the last migration. If you want to revert multiple migrations, you can run this command several times.

### • Linting
- Run code quality analysis using `yarn lint`. This runs ESLint and displays warning and errors.
- You can also use `yarn lint:fix` to run ESLint and fix fixable warning and errors.

### • Tests
- Run tests using `yarn test`.
- Run tests with coverage using `yarn test:coverage`.

---

## API Routes

The route prefix is `/api` by default, but you can change this in the .env file.

| Route                       | Method | Description |
| --------------------------- | ------ | ----------- |
| **/api/health**             | GET    | Show `Server is up!` |
| **/api/users**              | POST   | Create a user |
| **/api/auth/login**         | POST   | Log a user |
| **/api/auth/logout**        | POST   | Logout logged user |
| **/api/auth/authenticated** | GET    | Return authentication status |

---

## Project Structure

| Name                                        | Description |
| ------------------------------------------- | ----------- |
| **__tests__/**                              | Tests |
| **__tests__/e2e/**                          | End-to-end tests |
| **__tests__/utils/**                        | Tests utils |
| **@types/**                                 | Global types definitions |
| **build/**                                  | Compiled source files will be placed here |
| **coverage/**                               | Jest coverage results will be placed here |
| **src/**                                    | Source files |
| **src/config/**                             | Configuration files |
| **src/controllers/**                        | REST API Controllers |
| **src/controllers/[feature]/index.ts**      | Functions for feature routes |
| **src/controllers/[feature]/validators.ts** | Validation functions for feature routes |
| **src/entities/**                           | TypeORM entities |
| **src/middlewares/**                        | Middlewares |
| **src/migrations/**                         | Migrations files |
| **src/routes/**                             | REST API Routes |
| **src/routes/[feature].ts**                 | Feature routes |
| **src/subscribers/**                        | Entity subscribers |
| **src/types/**                              | Typescript types |
| **src/utils/**                              | Utils functions |
| **src/data-source.ts**                      | TypeORM data source |
| **src/index.ts**                            | REST API entry point |

---

## Environment Variables

| Name                | Description | Optional | Default value |
| ------------------- | ----------- | -------- | ------------- |
| NODE_ENV            |  Used to state whether an environment is a production, development, test environment, etc. | ✔️ | 
| HOST                | Server host | ✔️ | 0.0.0.0 |
| PORT                | Server host port | ❌ |
| DB_USER             | Database username | ❌ |
| DB_HOST             | Database host | ❌ |
| DB_NAME             | Database name | ❌ |
| DB_PASSWORD         | Database password | ❌ |
| DB_PORT             | Database host port | ❌ |
| DB_HOST_PORT        | Database mapped port. On the machine that use Docker, the database will be accessible on this port | ❌ |
| CORS_ORIGIN_ALLOWED | List of CORS allowed origins | ✔️ |
| API_ROUTES_PREFIX   | The API routes prefix. Is set to `/api`, all the routes are accessible by querying `/api/...`   | ✔️ |
| TEST_DB_HOST        | Test database host | ❌
| TEST_DB_NAME        | Test database name | ❌
| TEST_DB_HOST_PORT   | Test database mapped port. On the machine that use Docker, the test database will be accessible on this port | ❌

---

## Authentication

`Passport.js` is used to handle authentication. This is a flexible and modular authentication middleware that allows you to easily add new authentication strategies like login with Facebook, Google, Github, etc.

The `Passport` configuration and functions are located in `src/config/passport.ts`.

The `serializeUser` defines what data are saved in request session, generally we save the user id.
The `deserializeUser` allows getting the whole user object and assigning it in `req.user`, so you can easily get the authenticated user with `req.user`. You don't need to explicitly call `deserializeUser` before calling `req.user`.

You can find the Passport docs [here](https://www.passportjs.org/).

To protect a route, you can use auth middlewares located in `src/middlewares/auth.ts`.

To check if a user is authenticated before accessing a route, use `isAuthenticated`:
```typescript
router.route('/logout').post(isAuthenticated, AuthController.logout);
```

To check if a user is not authenticated before accessing a route, use `isUnauthenticated`:
```typescript
router.route('/login').post(isUnauthenticated, AuthController.login);
```

---

## Migrations

Thanks to TypeORM, you can easily manage your migrations. The executed migrations are stored in a table which allows TypeORM to know which migrations must be executed but also to revert migrations if you need.

⚠️ The migrations scripts must be executed in the `api` container shell.

### Create a migration

To create a migration, run `yarn migration:create MigrationName`. It will create an empty migration in `src/migrations`. The migration file have two functions : `up` and `down`. `up` is executed when you run the migration. `down` is executed when you revert the migration.

### Generate a migration

To generate a migration based on entities' changes, run `yarn migration:generate MigrationName`, it will create a migration in `src/migrations`. The migration is automatically generated based on your entities compared to your actual database.

For example, you can try by adding a property `firstName` in the `User` entity:
```typescript
@Column({ nullable: false, length: 20 })
firstName!: string;
```
Then, run `yarn migration:generate AddFirstNameInUser`, it will automatically generate a migration to create the new column.

### Run migrations

To run the migrations that have not been executed yet, run `yarn migration:run`.

### Revert a migration

You can revert the last executed migration by running `yarn migration:revert`. If you want to revert multiple migrations, you can run this command several times.

---

## Subscribers

Subscribers allow us to listen entity events like insert, update, delete, etc and execute a method before or after the event. They are defined in `src/subscribers`.

By default, a subscriber listens to all the entities but it's a good practice to listen to one entity by subscriber. To do that, use the function `listenTo()` and return the entity you want to listen with this subscriber.

The subscribers functions take 1 parameter called `event`. In this object, you can find several properties like the concerned entity, the connection object, the query runner or the manager. 

If you need to query the database in a subscriber function, use the event manager or event query runner. Otherwise, it will not include the data not commited yet.

The subscribers functions can be `async`.

You can find more info about subscribers [here](https://typeorm.io/listeners-and-subscribers#what-is-a-subscriber).

---

## E2E Tests

### Tests overview
End-to-end testing is a methodology used to test the functionality and performance of an application under product-like circumstances and data to replicate live settings. The goal is to simulate what a real user scenario looks like from start to finish.

In this project, [Jest](https://jestjs.io/docs/getting-started) and [supertest](https://github.com/ladjs/supertest) are used for the E2E tests.

They are located in `__tests__/e2e/`.

The actual coverage is 100%.

### Commands
You can run the tests by running `yarn test` in the `api` container shell.

If you want to see the tests' coverage, you can run `yarn test:coverage`.

If you want to run only one test file, you can add the name or path of the file after the command. For example, use `yarn test auth` to run only the auth tests.

### How to create new tests
To create new tests, you can add tests in an existing test file or create a new test file.

Before all your tests, you need to create the test server:
```typescript
let server: Server;

beforeAll(async() => {
    server = await createTestServer();
});
```

And after all your tests, you must close the database connection and the test server:
```typescript
afterAll(async () => {
    await closeDatabase();
    server.close();
})
```

Then, you can create a test suite by using `describe` function.

It is strongly recommended to clean the database after each test to prevent data issues and duplicates:
```typescript
afterEach(async () => {
    await clearDatabase();
});
```

Then, you can create a test by using `test` function.

To test a route, you need to use `supertest`: 
```typescript
const res = await request(server).get('/api/auth/authenticated');
```
To test a route as an authenticated user, use the `createAuthenticatedAgent` function:
```typescript
const { agent } = await createAuthenticatedAgent(server);
const res = await agent.get('/api/auth/authenticated');
```
Agents allow maintaining a session between multiple requests.

To check values, you must use `expect` function:
```typescript
expect(res.statusCode).toEqual(200);
```

You can find more info about `Jest` [here](https://jestjs.io/docs/getting-started).

You can find more info about `supertest` [here](https://github.com/ladjs/supertest).

### Tests utils
Some utils have been created to easily create new tests. They are located in `__tests__/utils/`.

#### `createTestServer` (`testHelpers.ts`)
This function creates a test server. You can change the port, prevent the database connection or override Express.

#### `closeDatabase` (`testHelpers.ts`)
This function closes the database connection.

#### `clearDatabase` (`testHelpers.ts`)
This function clears the database data.

#### `createAuthenticatedAgent` (`testHelpers.ts`)
This function creates an authenticated agent. Agents allow maintaining a session between multiple requests. You can customize agent user information.

#### `createTestUser` (`userHelpers.ts`)
This function creates a user and inserts it in the database. You can customize the user information.

---

## Logging

To log HTTP requests, we use the express middleware [morgan](https://github.com/expressjs/morgan).
You can easily configure it by passing a [predifined format](https://github.com/expressjs/morgan#predefined-formats) as parameter in `src/config/express.ts`.

Example:
```typescript
app.use(morgan('short'));
```

---

## Existing Routes

Some basic routes are already implemented. Feel free to use, update or delete them at your conveniance.

You can create a user by using the POST route `/api/users`. The query body must contain a username, an email and a password. The username must contain at least 5 characters, the email must be valid and the password must contain at least 8 characters. The user's password is encrypted.

You can login by using the POST route `/api/auth/login`. The query body must contain a login and a password. The login can be the email or the username of the user.<br/>
You can access this route only if you are unauthenticated.

You can logout with the POST route `/api/auth/logout`. You can access this route only if you are authenticated.

You can get your authentication status by using the GET route `/api/auth/authenticated`. If you're authenticated, it will send `You are authenticated` as response. Otherwise, it will send `You are not authenticated`.

---

## Common Errors

If you encounter an error when running `yarn docker:up`, make sure Docker Desktop is running.

If you encounter an error when running a script, make sure you ran the script in the `api` container shell.

---

## Clean Github Templates and Workflows

### Templates

If you don't want to keep the issue templates, you can delete the folder `ISSUE_TEMPLATE` in `.github` folder. 

If you don't want to keep the Pull Request template, you can delete the file `pull_request_template.md` in `.github` folder. 

### Workflows

There are 3 workflows:
1. The workflow `pull-request` concerns the pull requests. It checks linting, build, runs E2E tests and sends the coverage to [Codecov](https://about.codecov.io/). If you don't want to keep it, you can delete the file `pull-request.yml` in the folder `workflows` in `.github`.

2. The workflow `main-tests` is triggered when code is merged or pushed on main. It runs the E2E tests and sends the coverage to [Codecov](https://about.codecov.io/). It has coverage for the main branch. If you don't want to keep it, you can delete the file `merge-main.yml` in the folder `workflows`.

If you want to keep the tests on pull request but don't want to use Codecov, you can delete `merge-main.yml` and only delete the 4 last lines in `pull-request.yml`. You can also delete `codecov.yml`. Its only goal is to fail the Pull Request tests if the code coverage is not 100%.<br>
But if you want to use CodeCov, the only thing you need to do is set your `CODECOV_TOKEN` in you github secrets.

3. The workflow `main` is triggered when something is merged or pulled on main. It builds the project and its primary goal is to check if main is building. If you don't want to keep it, you can delete the file `main.yml` in the folder `workflows`.

### Github files

This repository contains `CONTRIBUTING`, `CODE_OF_CONDUCT` and `LICENSE` files, you can delete them too.

---

## Upcoming Features

You can see the upcoming or in progress features [here](https://github.com/users/alexleboucher/projects/1/views/1).

---

## Further Documentations

| Name & Link                       | Description                       |
| --------------------------------- | --------------------------------- |
| [Express](https://expressjs.com/) | Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. |
| [TypeORM](http://typeorm.io/#/) | TypeORM is highly influenced by other ORMs, such as Hibernate, Doctrine and Entity Framework. |
| [Passport](https://www.passportjs.org/) | Passport is authentication middleware for Node.js. Extremely flexible and modular, Passport can be unobtrusively dropped in to any Express-based web application. |
| [Docker](https://www.docker.com/) | Docker is a platform designed to help developers build, share, and run modern applications. We handle the tedious setup, so you can focus on the code. |
| [PostgreSQL](https://www.postgresql.org/) | PostgreSQL is a powerful, open source object-relational database system with over 35 years of active development that has earned it a strong reputation for reliability, feature robustness, and performance. |
| [TypeScript](https://www.typescriptlang.org/) | TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale. |
| [validator](https://github.com/validatorjs/validator.js/) | A library of string validators and sanitizers. |
| [Jest](https://jestjs.io/fr/docs/getting-started/) | Jest is a Testing Framework with a focus on simplicity. |
| [supertest](https://github.com/ladjs/supertest/) | A library that allows developers and testers to test the APIs. |
| [Helmet](https://helmetjs.github.io/) | Helmet helps you secure your Express apps by setting various HTTP headers. |
| [cors](https://github.com/expressjs/cors) | CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options. |
| [ESLint](https://eslint.org/docs/latest/use/getting-started) | ESLint is a tool for identifying and reporting on patterns found in code, with the goal of making code more consistent and avoiding bugs. |

---

## Contributing

Anyone and everyone is welcome to [contribute](CONTRIBUTING.md).

If you want to propose new features, fix a bug or improve the README, don't hesitate to open a pull request. If your changes concern new feature or bugfix, please open an issue before.

However, if you decide to get involved, please take a moment to review the
[guidelines](CONTRIBUTING.md).

---

## License

[MIT](/LICENSE)
