# hegel-server

This is the backend service of **Hegel Blogging Platform**.

## Installation

```bash
yarn
```

## Database Setup

Make sure that [docker](https://www.docker.com/get-started) is installed on your computer.

```bash
yarn db:up
```

The PostgreSQL will listen to port 5432 by default.

## Database Reset

```bash
yarn db:down
yarn db:up
```

## Running the app

```bash
yarn start:dev
```

Nest CLI will run the app on watch mode.
