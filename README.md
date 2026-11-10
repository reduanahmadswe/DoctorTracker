# Doctor Tracker

## Description

Doctor Tracker is a secure admin web application for managing doctors and their patients. An authenticated administrator can add doctors, search and filter them by name, specialization, hospital and creation date, open a doctor to see and manage their patients, and work with every patient on a dedicated page with search, condition, doctor and date filters. A dashboard turns the data into totals, patients per doctor, a per-day activity trend and a condition breakdown. It is built for speed and clarity: a Next.js client with a calm clinical interface, a standalone Express REST API, and MongoDB with compound, text and covered indexes plus aggregation pipelines, so lists, search, filters, pagination and charts stay fast as the data grows.

## Setup Guide

### Prerequisites

- **Node.js 20 or newer** (the repository pins 20 in `.nvmrc`; `nvm use` picks it up) and npm 10+
- **MongoDB 6 or newer**, either a local instance (`mongodb://127.0.0.1:27017`) or a free MongoDB Atlas cluster
- Git

### 1. Clone and install

```bash
git clone https://github.com/reduanahmadswe/DoctorTracker.git
cd DoctorTracker
npm install
```

The repository is an npm workspace with two separate apps: `client/` (Next.js) and `server/` (Express). One `npm install` at the root installs both.

### 2. Configure the environment

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env.local
```

On Windows PowerShell use `Copy-Item` instead of `cp`.

**`server/.env`**

| Variable | Required | Description |
| --- | --- | --- |
| `NODE_ENV` | no | `development` (default), `production` or `test`. In `production` the auth cookie is marked `Secure` and error responses hide internals. |
| `PORT` | no | Port of the API. Defaults to `5000`. |
| `MONGODB_URI` | yes | MongoDB connection string, for example `mongodb://127.0.0.1:27017/doctor-tracker` or an Atlas `mongodb+srv://...` URI. |
| `JWT_SECRET` | yes | Secret that signs login tokens, at least 32 characters. Generate one with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`. Never commit it. |
| `JWT_EXPIRES_IN` | no | Lifetime of a login, such as `12h`, `1d` or `7d`. Defaults to `1d` and also sets the cookie lifetime. |
| `CLIENT_ORIGIN` | yes | Origin of the client app, for example `http://localhost:3000`. It is the only origin CORS allows. |
| `SEED_ADMIN_EMAIL` | yes | Email of the admin account created by the seed script. |
| `SEED_ADMIN_PASSWORD` | yes | Password of that admin account (at least 8 characters). |

The server validates these at startup and exits with a clear message if one is missing or invalid.

**`client/.env.local`**

| Variable | Required | Description |
| --- | --- | --- |
| `API_URL` | yes | Base URL of the Express API, for example `http://localhost:5000`. Next.js forwards `/api/*` requests to it, so the browser only ever talks to the client origin. |
| `NEXT_PUBLIC_DEMO_EMAIL` | no | Together with the next variable, shows a demo login box with a one-click fill button on the sign-in page. Leave both out in production. |
| `NEXT_PUBLIC_DEMO_PASSWORD` | no | Must match `SEED_ADMIN_PASSWORD` if you use the demo box. |

### 3. Create the admin account

```bash
npm run seed:admin
```

This creates the admin from `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`. It is safe to run again: an existing admin is left untouched. There is no public sign-up page, so this is the only way to create an account.

Optionally add realistic demo data (12 doctors and about 100 patients spread over the last five months). It refuses to run in production and skips itself if doctors already exist:

```bash
npm run seed:demo
```

### 4. Run the apps

Open two terminals in the project root:

```bash
npm run dev:server
```

```bash
npm run dev:client
```

Then open <http://localhost:3000> and sign in with the values you set for `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`. With the unchanged example files that is `admin@example.com` and `change-me-please`; change them before using the app for anything real.

### Useful commands

| Command | What it does |
| --- | --- |
| `npm run lint` | Lints both apps |
| `npm run typecheck` | Type-checks both apps (TypeScript strict) |
| `npm run build` | Builds both apps for production |
| `npm run start --workspace server` | Runs the built API (`node dist/server.js`) |
| `npm run start --workspace client` | Runs the built Next.js app |

## System Architecture

```mermaid
flowchart LR
  Browser["Browser<br/>(React, TanStack Query)"]
  Client["Next.js client :3000<br/>App Router, proxy.ts"]
  API["Express REST API :5000<br/>/api/v1"]
  DB[("MongoDB<br/>Mongoose")]

  Browser -->|"pages, assets"| Client
  Browser -->|"fetch /api/v1/* with cookie"| Client
  Client -->|"rewrite /api/* to API_URL"| API
  API -->|"queries, aggregations"| DB
```

### Request flow

1. The browser loads pages from the Next.js client. Every data request is a relative `fetch("/api/v1/...")` to the **client origin**.
2. A rewrite in `client/next.config.ts` forwards `/api/*` to the Express server (`API_URL`). To the browser the API is same-origin, so the auth cookie is first-party and no cross-site cookie or CORS handling is needed in practice. Express still allows only `CLIENT_ORIGIN` through CORS.
3. Express runs a fixed pipeline: `helmet`, CORS, a 10 KB JSON body limit, `cookie-parser`, NoSQL-operator sanitizing, `hpp`, a per-IP rate limit, then the router. Each route is `route → controller → service → Mongoose model`; the controller only reads validated input and shapes the response, the service holds the query logic.
4. Every request is validated with zod before it reaches a service. Errors go through one handler and always have the same shape: `{ success: false, message, errors? }`; successes are `{ success: true, data, meta? }`.

### Authentication flow

1. `POST /api/v1/auth/login` checks the credentials (bcrypt, cost 12; the same generic error for an unknown email and a wrong password) and sets a signed JWT in an **httpOnly, SameSite=Lax cookie** named `token` (`Secure` in production). The login route is limited to 5 failed attempts per 15 minutes per IP.
2. `client/src/proxy.ts` (Next.js 16's middleware) redirects visitors without a `token` cookie to `/login?next=...`, and sends signed-in visitors away from `/login`. This is only an optimistic check on cookie presence.
3. The real check happens on the server: the dashboard layout asks `GET /auth/me` through TanStack Query and shows nothing until it succeeds. The `authenticate` middleware verifies the JWT and loads the user; `authorize("admin")` guards every non-auth route (401 when not signed in, 403 for a wrong role).
4. A 401 anywhere clears the stale cookie through `POST /auth/logout` and sends the user to `/login`. Logout clears the cookie and the query cache.

### REST API

| Method and path | Purpose |
| --- | --- |
| `POST /auth/login`, `POST /auth/logout`, `GET /auth/me` | Session |
| `POST /doctors`, `GET /doctors`, `GET /doctors/filters`, `GET /doctors/:id` | Create, list (search, specialization, hospital, date range, pagination), filter options, details |
| `GET /doctors/:id/patients`, `POST /doctors/:id/patients`, `DELETE /doctors/:id/patients/:patientId` | A doctor's patients |
| `GET /patients`, `PATCH /patients/:id`, `DELETE /patients/:id` | Patients page (search, condition, doctor, date range, pagination), edit, delete |
| `GET /dashboard/stats` | Totals, patients per doctor, patients by condition and per-day counts, in one response |
| `GET /health` | Liveness check |

All paths are under `/api/v1` and every route except `/auth/login`, `/auth/logout` and `/health` requires an authenticated admin.

### Folder structure

```text
.
├── client/                      Next.js (App Router, TypeScript, Tailwind)
│   └── src/
│       ├── app/                 routes: (auth)/login, (dashboard)/{dashboard,doctors,doctors/[id],patients}
│       ├── components/ui/       design-system components (Button, Table, Modal, Combobox, ...)
│       ├── components/layout/   Sidebar, Topbar, MobileNav, PageHeader
│       ├── features/            auth, doctors, patients, dashboard (api calls, hooks, components)
│       ├── lib/                 api-client, query-client, URL list state, formatting, constants
│       ├── types/               shared API response types
│       └── proxy.ts             optimistic route protection
├── server/                      Express (TypeScript)
│   └── src/
│       ├── config/              env.ts (zod-validated), db.ts (Mongoose connection)
│       ├── middlewares/         authenticate, authorize, validate, rate limiters, error handling
│       ├── modules/             auth, doctors, patients, dashboard (routes, controller, service, schemas, model)
│       ├── routes/              mounts /api/v1
│       ├── scripts/             seedAdmin, seedDemo
│       ├── utils/               ApiError, response helpers, pagination, date ranges, shared validators
│       ├── app.ts               Express app (no listen)
│       └── server.ts            connects the database, listens, shuts down gracefully
└── package.json                 npm workspaces and root scripts
```
