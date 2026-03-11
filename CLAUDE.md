# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**parzie-commerce** is a personal e-commerce platform for selling used items across multiple categories. It is a monorepo with three packages:

| Package | Path | Purpose |
|---|---|---|
| `@parzie-commerce/frontend` | `frontend/` | Angular 21 SPA with Angular Material |
| `@parzie-commerce/backend` | `backend/` | Node.js + Express REST API |
| `@parzie-commerce/shared` | `shared/` | TypeScript types shared between frontend and backend |

## Commands

### Root (run both services)
```sh
npm run dev          # starts backend (port 3000) + frontend (port 4200) concurrently
npm install          # installs all workspace dependencies
```

### Frontend (`frontend/`)
```sh
npm run dev          # ng serve — http://localhost:4200
npm run build        # production build
npm run test         # vitest
ng generate component features/<name>/<name> --standalone  # new feature component
```

### Backend (`backend/`)
```sh
npm run dev          # tsx watch — http://localhost:3000
npm run build        # tsc compile to dist/
npm run test         # vitest run
npm run db:generate  # drizzle-kit generate migrations
npm run db:migrate   # apply migrations to PostgreSQL
npm run seed         # seed the database with sample data
```

## Architecture

### Shared Types (`shared/src/`)
All domain models are defined once in `shared/` and imported by both frontend and backend via relative path (`../../../shared/src/index`). Key types: `Product`, `User`, `CartItem`, `PaginatedResponse<T>`, `ApiResponse<T>`.

The shared package has **no build step** — it is imported via direct relative path with TypeScript source.

### Frontend Architecture
- **Standalone components** — no NgModules; every component is standalone.
- **State via Signals** — services expose `signal()` and `computed()` for reactive state. No NgRx. `AuthService` and `CartService` are the primary signal-based state containers.
- **Lazy routing** — all feature routes use `loadComponent()` for code splitting (`app.routes.ts`).
- **HTTP** — `ProductService` uses `HttpClient` via `inject()`.
- **Route params as inputs** — `withComponentInputBinding()` is enabled; route params bind directly to `@Input()` properties.
- **Control flow** — use Angular 17+ `@if` / `@for` / `@switch` — never `*ngIf` / `*ngFor`.
- **Feature structure** — each feature lives in `src/app/features/<name>/`. Cross-feature code goes in `src/app/core/` (services, layout, guards) or `src/app/shared/` (reusable UI components, pipes, directives).

### Frontend Feature Map
| Route | Feature folder | Status |
|---|---|---|
| `/` | `features/catalog` | stub |
| `/product/:id` | `features/product-detail` | stub |
| `/cart` | `features/cart` | future |
| `/checkout` | `features/checkout` | future |
| `/auth/login` | `features/auth` | future |
| `/auth/register` | `features/auth` | future |
| `/admin` | `features/admin` | future |

### Backend Architecture
- **Express 5** with TypeScript, compiled via `tsx` in dev.
- **PostgreSQL** via **Drizzle ORM** (`drizzle-orm/node-postgres`).
- **Drizzle schema** lives in `backend/src/db/schema.ts`. Run `npm run db:generate` to create migrations, `npm run db:migrate` to apply them.
- **REST endpoints**: `GET/POST /api/products`, `GET /api/products/:id`, `GET /api/health`.
- Auth is not yet implemented. Add JWT + bcrypt before any real use.

## Data Model Notes

- **Prices are stored in cents** (integer) in the database. Always divide by 100 before displaying to users.
- **No `rootDir`** in `backend/tsconfig.json` — this is intentional so TypeScript can resolve imports from `../../../shared/src/`.

## Design System

The app uses Angular Material M3 with a custom warm/editorial theme:

- **Fonts**: `DM Serif Display` (headings/display) + `DM Sans` (body) — defined in `styles.scss`
- **Design tokens**: CSS variables prefixed `--parzie-*` defined in `styles.scss`
- **Accent color**: `#c0622b` (burnt orange)
- **Background**: `#faf9f7` (warm off-white)
- **Theme palette**: `mat.$orange-palette` as primary

When building UI, follow the `frontend-design` skill guidelines (`.agents/skills/frontend-design/SKILL.md`): choose a bold aesthetic direction, use the established `--parzie-*` tokens, apply `DM Serif Display` for display headings (`.parzie-display` utility class), and avoid generic layouts.

## Key Conventions

- Feature components go in `features/<name>/` as standalone components.
- Services are `providedIn: 'root'` and inject dependencies with `inject()` (not constructor injection).
- Reactive state uses `signal()` / `computed()` — avoid `BehaviorSubject` for new code.
- Angular Material components must be imported individually in each standalone component's `imports` array.
- Use `@if` / `@for` control flow blocks — never `*ngIf` / `*ngFor` directives.
