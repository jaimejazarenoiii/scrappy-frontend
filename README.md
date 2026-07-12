# Scrappy

Administrative web application for scrap trading operations.

## Prerequisites

- Node.js 20+
- pnpm 9+

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

## Setup

```bash
pnpm install
cp .env.example .env
pnpm dev
```

## Scripts

| Command          | Description              |
| ---------------- | ------------------------ |
| `pnpm dev`       | Start development server |
| `pnpm build`     | Production build         |
| `pnpm preview`   | Preview production build |
| `pnpm lint`      | Run ESLint               |
| `pnpm typecheck` | Run TypeScript check     |
| `pnpm format`    | Format with Prettier     |

## Architecture

Feature-based React 19 + TypeScript (strict) + Vite application.

- `src/app/` — providers, router, layouts, guards, pages
- `src/components/ui/` — shadcn/ui primitives
- `src/components/common/` — shared composites
- `src/components/feedback/` — loading, empty, error states
- `src/features/` — business modules (future specs)
- `src/services/` — API service classes
- `src/store/` — Zustand client state
- `src/lib/` — axios, query client, utilities

See [`.specify/memory/constitution.md`](.specify/memory/constitution.md) for governance.

## Environment

| Variable            | Description                                                                  | Default                        |
| ------------------- | ---------------------------------------------------------------------------- | ------------------------------ |
| `VITE_API_BASE_URL` | Backend API base URL                                                         | `http://localhost:3000/api/v1` |
| `VITE_APP_URL`      | Public site origin for Open Graph / Twitter share images (no trailing slash) | `http://localhost:5173`        |

Brand assets live in `public/brand/` (`favicon.ico`, `scrappy-og-banner.png`, logo icons).

## Validation

See [`specs/001-initialize-scrappy-web/quickstart.md`](specs/001-initialize-scrappy-web/quickstart.md).
