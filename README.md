# Insta Full Stack

An Instagram-style social feed built as a TypeScript monorepo. Users can sign up, log in, upload photos, browse a feed, and like posts — with end-to-end type safety from the database to the UI.

**Deploy:** UI on Vercel, NestJS + Postgres on Render, photos on S3/R2. Full steps: [DEPLOY.md](./DEPLOY.md).

## Project structure

```
insta-full-stack/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # NestJS backend
└── packages/
    ├── trpc/         # Shared Zod schemas + AppRouter types
    ├── ui/           # Shared React components
    ├── eslint-config/
    └── typescript-config/
```

---

## Frontend — `apps/web`

The web app is a **Next.js** client that talks to the API through tRPC and Better Auth session cookies.

### Core

| Tool | Purpose |
|------|---------|
| [Next.js 16](https://nextjs.org) | React framework with App Router |
| [React 19](https://react.dev) | UI library |
| [TypeScript](https://www.typescriptlang.org) | Static typing |

### Styling & UI

| Tool | Purpose |
|------|---------|
| [Tailwind CSS v4](https://tailwindcss.com) | Utility-first CSS |
| [@tailwindcss/postcss](https://tailwindcss.com) | PostCSS integration for Tailwind v4 |
| [shadcn/ui](https://ui.shadcn.com) | Component library (base-nova style) |
| [@base-ui/react](https://base-ui.com) | Headless UI primitives |
| [@radix-ui/react-slot](https://www.radix-ui.com) | Composable component slots |
| [class-variance-authority](https://cva.style) | Variant-based component styling |
| [clsx](https://github.com/lukeed/clsx) + [tailwind-merge](https://github.com/dcastil/tailwind-merge) | Conditional and merged class names |
| [lucide-react](https://lucide.dev) | Icons |
| [tw-animate-css](https://github.com/Wombosvideo/tw-animate-css) | Tailwind animation utilities |
| [next-themes](https://github.com/pacocoursey/next-themes) | Light / dark mode |

### Data & API

| Tool | Purpose |
|------|---------|
| [tRPC](https://trpc.io) (`@trpc/react-query`) | Type-safe API client |
| [TanStack Query](https://tanstack.com/query) | Server-state caching and mutations |
| [@repo/trpc](packages/trpc) | Shared schemas and `AppRouter` types |
| [Zod](https://zod.dev) | Runtime validation (forms + shared schemas) |

### Auth

| Tool | Purpose |
|------|---------|
| [Better Auth](https://www.better-auth.com) | Client SDK and session cookies |
| Next.js middleware | Protects routes; redirects to `/login` |

### Forms

| Tool | Purpose |
|------|---------|
| [React Hook Form](https://react-hook-form.com) | Form state management |
| [@hookform/resolvers](https://github.com/react-hook-form/resolvers) | Zod resolver for form validation |

### Dev tooling

| Tool | Purpose |
|------|---------|
| [ESLint](https://eslint.org) | Linting (`@repo/eslint-config`) |
| `@repo/ui` | Shared components from the monorepo |

### Frontend scripts

```bash
pnpm dev --filter web      # http://localhost:3000
pnpm build --filter web
pnpm lint --filter web
pnpm check-types --filter web
```

---

## Backend — `apps/api`

The API is a **NestJS** server exposing tRPC procedures, REST upload endpoints, and Better Auth routes.

### Core

| Tool | Purpose |
|------|---------|
| [NestJS 11](https://nestjs.com) | API server framework |
| [Express](https://expressjs.com) (`@nestjs/platform-express`) | HTTP adapter |
| [TypeScript](https://www.typescriptlang.org) | Static typing |
| [RxJS](https://rxjs.dev) | Reactive utilities (NestJS dependency) |

### API layer

| Tool | Purpose |
|------|---------|
| [tRPC](https://trpc.io) (`@trpc/server`) | Type-safe RPC procedures |
| [nestjs-trpc](https://github.com/KevinEdry/nestjs-trpc) | tRPC routers as NestJS modules/decorators |
| [@repo/trpc](packages/trpc) | Shared Zod schemas for inputs/outputs |
| [Zod](https://zod.dev) | Procedure input/output validation |

### Auth

| Tool | Purpose |
|------|---------|
| [Better Auth](https://www.better-auth.com) | Authentication library |
| [@thallesp/nestjs-better-auth](https://github.com/thallesp/nestjs-better-auth) | NestJS integration (guards, session API) |
| tRPC auth middleware | Attaches `user` and `session` to request context |

### Database

| Tool | Purpose |
|------|---------|
| [PostgreSQL](https://www.postgresql.org) | Primary database |
| [Drizzle ORM](https://orm.drizzle.team) | Type-safe queries and relations |
| [drizzle-kit](https://orm.drizzle.team/kit-docs/overview) | Migrations and Drizzle Studio |
| [pg](https://node-postgres.com) | Postgres driver |
| [@nestjs/config](https://docs.nestjs.com/techniques/configuration) | Environment variable loading |

### File uploads

| Tool | Purpose |
|------|---------|
| [Multer](https://github.com/expressjs/multer) | Multipart file handling |
| Local storage provider | Saves images to `/uploads` (S3 planned) |
| [uuid](https://github.com/uuidjs/uuid) | Unique filenames |

### Testing & dev tooling

| Tool | Purpose |
|------|---------|
| [Jest](https://jestjs.io) | Unit and e2e tests |
| [Supertest](https://github.com/ladjs/supertest) | HTTP assertions in e2e tests |
| [ESLint](https://eslint.org) + [Prettier](https://prettier.io) | Linting and formatting |

### Backend scripts

```bash
pnpm dev --filter api       # http://localhost:3001
pnpm build --filter api
pnpm --filter api db:generate   # create migration after schema change
pnpm --filter api db:migrate    # apply migrations
pnpm --filter api db:studio     # open Drizzle Studio
pnpm --filter api auth:generate # regenerate Better Auth schema
pnpm --filter api test
```

---

## Monorepo tooling

| Tool | Purpose |
|------|---------|
| [pnpm](https://pnpm.io) | Package manager and workspaces |
| [Turborepo](https://turbo.build) | Parallel dev/build across apps |
| [Prettier](https://prettier.io) | Code formatting |
| `@repo/typescript-config` | Shared TypeScript configs |
| `@repo/eslint-config` | Shared ESLint configs |

---

## Features

- Email/password sign-up and login
- Protected routes (middleware redirects unauthenticated users)
- Photo feed with likes (optimistic UI updates)
- Create posts with image upload
- Avatar upload from the sidebar
- Light / dark theme toggle

---

## Getting started

### Prerequisites

- Node.js 18+
- pnpm 9
- PostgreSQL 16+

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start PostgreSQL

```bash
docker run -d \
  --name insta-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=insta \
  -p 5432:5432 \
  postgres:16
```

### 3. Environment variables

**API** — `apps/api/.env` (copy from `.env.example`):

```bash
PORT=3001
WEB_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/insta
DATABASE_SSL=false
BETTER_AUTH_SECRET=<openssl rand -base64 32>
BETTER_AUTH_URL=http://localhost:3001
STORAGE_TYPE=local
```

**Web** — `apps/web/.env.local`:

```bash
API_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Migrate the database

```bash
pnpm --filter api db:migrate
```

### 5. Run both apps

```bash
pnpm dev
```

| App | URL |
|-----|-----|
| Web | http://localhost:3000 |
| API | http://localhost:3001 |

---

## How frontend and backend connect

```
Browser (Next.js :3000)
    │
    ├── /api/trpc/*  ──rewrite──►  NestJS tRPC      (:3001/api/trpc)
    ├── /api/auth/*  ──rewrite──►  Better Auth      (:3001/api/auth)
    └── /uploads/*   ──direct───►  NestJS static    (:3001/uploads)
```

Shared types flow through `@repo/trpc`: Zod schemas defined once are used by NestJS routers (validation) and the React client (TypeScript inference).

---

## Root scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start web + api in watch mode |
| `pnpm build` | Build all apps and packages |
| `pnpm lint` | Lint everything |
| `pnpm check-types` | Type-check everything |
| `pnpm format` | Run Prettier |

## License

Private — UNLICENSED
# insta-full-stack-trpc
