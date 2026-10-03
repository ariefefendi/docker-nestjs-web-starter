# NestJS MVC Docker Starter Kit

A **NestJS + TypeORM + MySQL** web starter kit that runs entirely in Docker, with a Laravel-style MVC structure: server-side **Nunjucks** views (the equivalent of Blade), a **Knockout MVVM + DataTables** frontend, session-based authentication, seeders, and phpMyAdmin.

Just run `docker compose up`. No need to install Node.js or MySQL on your machine.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration (.env)](#configuration-env)
- [Service URLs](#service-urls)
- [Dummy Users](#dummy-users)
- [Routes](#routes)
- [Adding a New Module](#adding-a-new-module)
- [Common Docker Commands](#common-docker-commands)
- [Running Multiple Projects](#running-multiple-projects)
- [Important Notes](#important-notes)
- [Troubleshooting](#troubleshooting)

## Features

- Clean MVC structure: `models`, `controllers`, `services`, `middleware`, `views`, `helpers`.
- Session authentication (login/logout) with **bcrypt** password hashing.
- **Role-based views**: pages are selected based on the user's role (`admin`, `manager`, `staff`).
- A complete CRUD example module (**Units**): server-side DataTables, validation, UUIDs, short reference IDs, and **soft delete**.
- `ValidatorService` with Laravel-style rule syntax (`required|max:20|unique:...`).
- Seeders (users + units data) that are safe to run repeatedly.
- `/health` endpoint that checks the application and the database connection.
- Hot reload during development (`nest start --watch`).
- Database tables are created automatically from the models (TypeORM `synchronize`) when `APP_ENV=local`.

## Tech Stack

| Component | Technology                                             |
| --------- | ------------------------------------------------------ |
| Backend   | NestJS 11, TypeScript, Express                         |
| ORM       | TypeORM 0.3                                            |
| Database  | MySQL 8.0 (+ phpMyAdmin)                               |
| Views     | Nunjucks                                               |
| Frontend  | Bootstrap 5, jQuery, DataTables, Knockout.js (via CDN) |
| Auth      | express-session, bcryptjs                              |
| Runtime   | Node.js 22 (`node:22-bookworm-slim` image)             |
| Container | Docker Compose                                         |

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine + Docker Compose v2)
- Internet access on the first start (to download images, run `npm install`, and load frontend libraries from CDNs)

## Project Structure

```
.
├── .env                  # Environment configuration
├── .dockerignore
├── Dockerfile            # Node.js image + project template
├── docker-compose.yml    # Services: app, MySQL, phpMyAdmin
├── entrypoint.sh         # Copies the template to src/, then runs npm install
├── rebuild.bat           # Clean rebuild (Windows)
├── seed_users.sql        # Dummy users (alternative to the seeder, via phpMyAdmin)
├── seed_units.sql        # Dummy units (alternative to the seeder, via phpMyAdmin)
└── template/             # Project template (copied to src/ on first start)
    ├── package.json
    ├── nest-cli.json
    ├── tsconfig*.json
    ├── public/           # Static files  -> /public/*
    ├── views/            # Nunjucks templates
    │   ├── template_admin.njk       # Layout (STUB, replace with your own)
    │   ├── auth/login.njk
    │   └── master_data/UnitsView.njk
    └── src/
        ├── main.ts                  # Entry point (session, views, static files, seeder)
        ├── app.module.ts            # Registers controllers, services, models, middleware
        ├── config/                  # env, database, view
        ├── controllers/             # Auth, Home, Health, master_data/Units
        ├── middleware/              # AuthMiddleware
        ├── models/                  # Users, master_data/Units
        ├── services/                # Auth, RoleView, Validator, Uuid, ShortId
        ├── database/seeders/        # Database, Users, Units seeders
        └── helpers/request.ts       # all() and input()
```

After the first start, a **`src/`** folder appears in the project root. It is a copy of `template/` and becomes **your working code** (it is mounted into the container as `/app`).

## Getting Started

1. **Prepare the project folder.** Copy the entire contents of this starter kit into your new project folder.

2. **Edit `.env`.** At a minimum, change `APP_KEY` to a long random string. Change the `HOST_*` ports if they conflict with other projects.

3. **Enable the seeder for the first start.** Set `SEED=true` in `.env` so the admin user and units data are created automatically.

4. **Run it.**

   ```bash
   docker compose up -d --build
   ```

   On Windows you can also run `rebuild.bat` (clean rebuild without cache).

5. **Watch the startup.** The first start takes a few minutes (it creates `src/` and runs `npm install`).

   ```bash
   docker compose logs -f app
   ```

   The app is ready when the log shows `Ready for Development`.

6. **Open the app:** <http://localhost:8200/login> (the port follows `HOST_APP_PORT`).
   Log in with `admin@example.com` / `password`.

7. **Disable the seeder.** Once the data is in place, set `SEED=false` in `.env`, then restart:

   ```bash
   docker compose up -d
   ```

## Configuration (.env)

| Variable            | Default (in `.env`) | Description                                                                                                                      |
| ------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `APP_NAME`          | `Nest Web App`      | Application name (page title).                                                                                                   |
| `APP_ENV`           | `local`             | `local` = tables are synchronized automatically and views are not cached. **Any other value disables automatic table creation.** |
| `APP_DEBUG`         | `true`              | Debug flag.                                                                                                                      |
| `APP_KEY`           | `change-me-to-...`  | Session secret. **Must be changed** to a long random string.                                                                     |
| `APP_PORT`          | `8000`              | Application port **inside** the container.                                                                                       |
| `NODE_ENV`          | `development`       | Node mode.                                                                                                                       |
| `NEST_PROJECT_NAME` | `nest-api`          | Package name in `package.json` (used during the first scaffold).                                                                 |
| `HOST_APP_PORT`     | `8200`              | Application port on the host machine.                                                                                            |
| `HOST_DB_PORT`      | `3109`              | MySQL port on the host machine.                                                                                                  |
| `HOST_PMA_PORT`     | `9192`              | phpMyAdmin port on the host machine.                                                                                             |
| `DB_HOST`           | `kazuya-mysql`      | Name of the MySQL **service** in Docker (not `127.0.0.1`).                                                                       |
| `DB_PORT`           | `3306`              | MySQL port inside the Docker network.                                                                                            |
| `DB_DATABASE`       | `db_nest`           | Database name.                                                                                                                   |
| `DB_USERNAME`       | `kazuya`            | Application database user.                                                                                                       |
| `DB_PASSWORD`       | `secret`            | Application database user password.                                                                                              |
| `DB_ROOT_PASSWORD`  | `root`              | MySQL root password (also used by phpMyAdmin).                                                                                   |
| `SEED`              | `false`             | `true` = run the seeders when the app starts.                                                                                    |
| `ADMIN_EMAIL`       | `admin@example.com` | Email of the admin user created by the seeder.                                                                                   |
| `ADMIN_PASSWORD`    | `password`          | Password of the admin user created by the seeder.                                                                                |

> Changes to `.env` require a container restart to take effect: `docker compose up -d`.

## Service URLs

| Service                 | URL (default)                                       |
| ----------------------- | --------------------------------------------------- |
| Application             | <http://localhost:8200/login>                       |
| Units page              | <http://localhost:8200/admin/units>                 |
| Health check            | <http://localhost:8200/health>                      |
| phpMyAdmin              | <http://localhost:9192>                             |
| MySQL (external client) | `127.0.0.1:3109`, user `kazuya` / password `secret` |

The ports above follow the `HOST_*` values in `.env`.

## Dummy Users

The password for all users is **`password`**.

| Email             | Name          | Role    | URL after login  |
| ----------------- | ------------- | ------- | ---------------- |
| admin@example.com | Administrator | admin   | `/admin/units`   |
| budi@example.com  | Budi Santoso  | manager | `/manager/units` |
| dewi@example.com  | Dewi Lestari  | manager | `/manager/units` |
| siti@example.com  | Siti Rahayu   | staff   | `/staff/units`   |
| andi@example.com  | Andi Pratama  | staff   | `/staff/units`   |
| rudi@example.com  | Rudi Hartono  | staff   | `/staff/units`   |

How to load them:

- **Via the seeder:** set `SEED=true`. The seeder only creates the admin user (per `ADMIN_EMAIL`) and the units data.
- **Via SQL:** open phpMyAdmin → select the database → **SQL** tab → paste the contents of `seed_users.sql` (all users above) and/or `seed_units.sql`. Safe to run repeatedly (`INSERT IGNORE`).

> Change all passwords and `APP_KEY` before using this outside of development.

## Routes

### General

| Method | URL       | Description                                  |
| ------ | --------- | -------------------------------------------- |
| GET    | `/`       | Redirects to `/{role}/units`, or to `/login` |
| GET    | `/login`  | Login form                                   |
| POST   | `/login`  | Process login                                |
| POST   | `/logout` | Log out and destroy the session              |
| GET    | `/health` | Application and database status (JSON)       |

### Master Data: Units

Every route is available both with a role prefix (`/{role}/units/...`) and without one (`/units/...`), and **requires login** (`AuthMiddleware`).

| Method | URL                           | Description                                  |
| ------ | ----------------------------- | -------------------------------------------- |
| GET    | `/{role}/units`               | Units page                                   |
| POST   | `/{role}/units/getDataAll`    | Server-side DataTables data (search, paging) |
| GET    | `/{role}/units/getDataSelect` | Fetch a single record by `reference`         |
| POST   | `/{role}/units/insert`        | Create a record                              |
| POST   | `/{role}/units/update`        | Update a record                              |
| DELETE | `/{role}/units/delete`        | Delete a record (**soft delete**)            |

Unauthenticated requests: pages are redirected to `/login`, while AJAX/non-GET requests receive a `401` JSON response.

Failed validation returns `422`:

```json
{
  "result": "VALIDATION_ERROR",
  "errors": { "code": ["The code field is required."] }
}
```

## Adding a New Module

Use the **Units** module as a reference. For example, to create a `categories` module:

1. **Model**: create `src/models/master_data/categories.model.ts` (copy the `units.model.ts` pattern).
2. **Controller**: create `src/controllers/master_data/categories.controller.ts` (copy the `units.controller.ts` pattern).
3. **View**: create `src/views/master_data/CategoriesView.njk`. View selection is handled by `RoleViewService`:
   - `views/<role>/<folder>/<View>.njk` (role-specific, if it exists)
   - `views/<folder>/<View>.njk` (default)
4. **Register** it in `src/app.module.ts`:

   ```ts
   TypeOrmModule.forFeature([Units, Users, Categories]),
   // ...
   controllers: [HomeController, AuthController, HealthController, UnitsController, CategoriesController],
   ```

5. **Protect it with login** (optional) by adding the controller to the middleware:

   ```ts
   consumer
     .apply(AuthMiddleware)
     .forRoutes(UnitsController, CategoriesController)
   ```

The table is created automatically when the app restarts (`APP_ENV=local`).

## Common Docker Commands

```bash
# Start / build
docker compose up -d --build

# View application logs
docker compose logs -f app

# Stop (data is kept)
docker compose down

# Restart the app only (e.g. after changing .env)
docker compose restart app

# Open a shell inside the app container
docker compose exec app bash

# Install a new npm package
docker compose exec app npm install package-name

# Full reset: remove containers + all volumes (the database is lost!)
docker compose down -v
```

After `down -v`, empty the `src/` folder if you want to scaffold again from `template/`.

## Running Multiple Projects

If you run several projects from this starter kit, make the following unique to avoid conflicts:

- The `container_name` of each service in `docker-compose.yml` (`kazuya-nest`, `kazuya-mysql-nest`, `kazuya-phpmyadmin-nest`).
- Volume names (`db_data_nest`, `nest_node_modules`, `nest_npm_cache`) and the network name (`kazuya-net`).
- The host ports `HOST_APP_PORT`, `HOST_DB_PORT`, and `HOST_PMA_PORT` in `.env`.

If you rename the MySQL service (`kazuya-mysql`), also update `DB_HOST` in `.env` and `PMA_HOST` on the phpMyAdmin service.

## Important Notes

- **`template/` vs `src/`.** `template/` is copied to `src/` only if `src/package.json` does not exist yet. After that, **edit code directly in `src/`**. Changing `template/` does not affect an existing `src/`, and updating the image requires `--build`.
- **`synchronize` is for development only.** In production, use TypeORM migrations and set `APP_ENV` to something other than `local`.
- **Sessions use MemoryStore** (the `express-session` default): sessions are lost when the app restarts and it is not suitable for production. Replace it with an external store (Redis/database) in production.
- **The role in the URL is not validated.** The `/{role}` prefix only selects the view. `AuthMiddleware` only checks that the user is logged in, not that their role matches. Add your own role/permission checks if you need them.
- **`template_admin.njk` is only a stub layout** that loads Bootstrap, jQuery, DataTables, and Knockout from CDNs. Replace it with your own layout; make sure the global `model` object and `alert_InValidField()` remain available, because `UnitsView` depends on them.
- **Do not commit `.env`** to a public repository. Add it to `.gitignore`.

## Troubleshooting

| Problem                                           | Solution                                                                                                              |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Port already in use (`port is already allocated`) | Change `HOST_APP_PORT`, `HOST_DB_PORT`, or `HOST_PMA_PORT` in `.env`.                                                 |
| App cannot connect to the database                | Make sure `DB_HOST` matches the MySQL service name in `docker-compose.yml`. Check `docker compose logs kazuya-mysql`. |
| Login fails after `SEED=true`                     | Check the `app` logs for seeder errors, or paste `seed_users.sql` through phpMyAdmin.                                 |
| Tables are not created                            | Make sure `APP_ENV=local`.                                                                                            |
| `entrypoint.sh: bad interpreter` / `\r` error     | The file has CRLF line endings. The Dockerfile strips them automatically; run `docker compose up -d --build`.         |
| Hot reload does not work on Windows/macOS         | Polling is already enabled (`CHOKIDAR_USEPOLLING`). Make sure the project folder is on a drive shared with Docker.    |
| Page looks broken / unstyled                      | Frontend libraries are loaded from CDNs; make sure you have internet access.                                          |
| Changes in `template/` do not appear              | `src/` already exists. Edit in `src/`, or delete `src/` and rebuild to scaffold again.                                |

---

## Credits

**Gin MVVM Docker Starter Kit**

Developed by: **Arif Efendi**

Copyright © 2021–2026 Arif Efendi
