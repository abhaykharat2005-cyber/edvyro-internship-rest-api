# Abhiraj — Internship REST API

**EdVyro · Full Stack Development · Task 2**

A distinct implementation of the internship-record API reference, built with Node.js, Express, SQLite, Zod, Helmet, CORS, Vitest and Supertest. It provides persistent CRUD operations, server-side validation, pagination, filtering, consistent JSON errors, seed records and automated tests.

## Requirements
- Node.js 18 or newer
- npm

## Setup
```bash
npm install
cp .env.example .env
npm start
```
On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp`. The API starts at `http://localhost:4000`; the SQLite database is created and seeded automatically.

Development: `npm run dev`
Tests: `npm test`

## Endpoints
- `GET /api/health`
- `GET /api/internships?page=1&limit=10&domain=Web%20Development&search=React`
- `GET /api/internships/:id`
- `POST /api/internships`
- `PATCH /api/internships/:id`
- `DELETE /api/internships/:id`

See [docs/API.md](docs/API.md) for request examples and response formats.

## Project structure
```text
src/        application, routes, controllers, services, validation, database
 data/      SQLite database (generated on first run), schema and seed reference
 docs/      API documentation
 tests/     automated API tests
```

## Notes
- SQL statements use parameterized queries.
- Do not commit `.env` or `node_modules`.
- This is a separate implementation for Abhiraj, not a fork or a copy of the reference repository. Verify the tests locally with `npm install` followed by `npm test`.
