# Implementation Plan: Initialize Scrappy Web

**Branch**: `001-initialize-scrappy-web` | **Date**: 2026-07-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-initialize-scrappy-web/spec.md`

**Note**: Foundation-only phase. No authentication logic, business logic, CRUD, or API
endpoints. Prepares the project for Specification 002 — Company & Identity Foundation
(Backend P001) without architectural refactoring. The application shell is generic and
extensible; no placeholder implementations for future business modules are introduced.

## Summary

Initialize Scrappy Web as a production-ready React 19 application using Vite, TypeScript
(strict), Tailwind CSS v4, and shadcn/ui. Establish feature-based folder architecture,
data router with nested layouts, responsive dashboard shell, theme/query/state/API
foundations, shared UI primitives, error/loading patterns, and development tooling.

Design reference: **UI UX Pro Max** for modern SaaS quality (Linear, Vercel, GitHub,
Stripe, Notion aesthetic). All UI MUST be responsive-first, accessible, dark-mode
compatible, and constitution-compliant.

## Technical Context

**Language/Version**: TypeScript 5.x (Strict Mode) on React 19 with Vite 6+

**Primary Dependencies**:

| Category      | Package                                                        |
| ------------- | -------------------------------------------------------------- |
| Core          | react, react-dom                                               |
| Routing       | react-router (Data Router / `createBrowserRouter`)             |
| Server state  | @tanstack/react-query, @tanstack/react-query-devtools          |
| Client state  | zustand                                                        |
| HTTP          | axios                                                          |
| Forms         | react-hook-form, @hookform/resolvers, zod                      |
| Styling       | tailwindcss v4, clsx, tailwind-merge, class-variance-authority |
| UI            | shadcn/ui primitives, lucide-react                             |
| Tables        | @tanstack/react-table                                          |
| Notifications | sonner                                                         |
| Animation     | motion (framer-motion successor)                               |

**Storage**: N/A — client-only; `localStorage` for theme preference persistence only

**Testing**: Manual validation via quickstart.md; automated tests optional in this phase

**Target Platform**: Modern browsers, mobile-first responsive (320px–1536px+)

**Project Type**: Administrative web application foundation (Scrappy Web)

**Performance Goals**: Route lazy loading, code splitting, tree shaking, production build
< 500KB initial JS gzip (target, not blocking)

**Constraints**:

- No login logic, CRUD, API endpoints, or backend communication
- No Axios calls from components — `lib/axios.ts` + `services/` only
- No server state in Zustand
- No `any` types
- shadcn/ui components live in `components/ui/`

**Scale/Scope**: Application shell with 4 routes, 2 layouts, ~20 shared UI primitives,
3 Zustand stores (structure only), centralized Axios instance

**Package Manager**: pnpm 9+ (use `pnpm` for all install, run, and CLI commands; commit `pnpm-lock.yaml`)

## Constitution Check

_GATE: Passed before Phase 0. Re-checked after Phase 1 design — all gates satisfied or
explicitly deferred to Specification 002 (Company & Identity Foundation)._

| Gate                                             | Status      | Notes                                                                    |
| ------------------------------------------------ | ----------- | ------------------------------------------------------------------------ |
| API First (I, VIII)                              | ✅ Pass     | Axios in `lib/axios.ts`; `services/` directory ready; no component calls |
| Type Safety (II, IX)                             | ✅ Pass     | Strict TS; Zod installed; no `any`                                       |
| Feature Architecture (III, XVII, XVIII)          | ✅ Pass     | Feature-based tree; `@/` aliases                                         |
| Routing (IV, V)                                  | ✅ Pass     | `createBrowserRouter`, nested layouts, lazy routes                       |
| State (VII)                                      | ✅ Pass     | TanStack Query for server; Zustand for client only                       |
| UI & Styling (VI, X, XI, XII, XXIX–XXXIV, XXXIX) | ✅ Pass     | shadcn/ui in `components/ui/`; skeletons; empty states                   |
| Auth & Security (XIV, XX)                        | ⏳ Deferred | Route guard **structure** only; JWT logic in Spec 002                    |
| Accessibility (XV, XL)                           | ✅ Pass     | WCAG-friendly shadcn primitives; focus management                        |
| Responsive Design (XXVII, XXXI)                  | ✅ Pass     | Mobile-first; sidebar drawer/collapse/permanent                          |
| Page & Table Standards (XXXII, XXXVI)            | ✅ Pass     | PageHeader/PageContainer; DataTable foundation                           |
| Forms & Dashboards (XXXVII, XXXVIII)             | ⏳ Partial  | RHF + Zod installed; no forms yet; dashboard placeholder only            |
| AI UI Standards (XXVIII, XL)                     | ✅ Pass     | UI UX Pro Max reference; production checklist in quickstart              |
| Performance (XVI, XXXV)                          | ✅ Pass     | Lazy routes; Motion 150–250ms transitions                                |
| API Contract (XXVI)                              | N/A         | No backend integration in this phase                                     |
| Documentation (XXII)                             | ✅ Pass     | spec.md complete with all mandatory sections                             |

**Post-design re-check**: No unjustified violations. Auth and form UX gates deferred by
spec scope (FR-015), not by architecture gaps.

## Project Structure

### Documentation (this feature)

```text
specs/001-initialize-scrappy-web/
├── spec.md
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/           # Phase 1
└── tasks.md             # Phase 2 (/speckit-tasks — not yet created)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── providers/
│   │   ├── AppProviders.tsx
│   │   ├── ThemeProvider.tsx
│   │   ├── QueryProvider.tsx
│   │   └── ToastProvider.tsx
│   ├── router/
│   │   ├── index.tsx
│   │   ├── routes.tsx
│   │   └── route-guards.ts      # structure only
│   ├── layouts/
│   │   ├── AuthLayout.tsx
│   │   └── DashboardLayout.tsx
│   ├── guards/
│   │   └── AuthGuard.tsx        # passthrough stub for Spec 002
│   └── App.tsx
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
├── components/
│   ├── ui/                      # shadcn/ui primitives
│   ├── common/
│   │   ├── PageHeader.tsx
│   │   ├── PageContainer.tsx
│   │   ├── SearchInput.tsx
│   │   └── DataTable.tsx        # TanStack Table foundation
│   └── feedback/
│       ├── EmptyState.tsx
│       ├── ErrorState.tsx
│       ├── ErrorFallback.tsx
│       ├── LoadingOverlay.tsx
│       └── PageSkeleton.tsx
├── features/                    # empty — future features
├── hooks/
│   ├── useMediaQuery.ts
│   └── useTheme.ts
├── lib/
│   ├── axios.ts
│   ├── query-client.ts
│   └── utils.ts                 # cn(), etc.
├── services/                    # empty — future service classes
├── store/
│   ├── auth.store.ts            # structure only
│   ├── theme.store.ts
│   └── ui.store.ts
├── styles/
│   ├── globals.css
│   └── tokens.css               # design tokens
├── types/
│   ├── navigation.types.ts
│   └── theme.types.ts
├── utils/
│   ├── format-date.ts
│   ├── format-currency.ts
│   └── debounce.ts
├── constants/
│   ├── navigation.ts
│   └── routes.ts
├── routes/                      # lazy page re-exports if needed
└── main.tsx

public/
├── favicon.ico
└── index.html

.env.example
.eslintrc / eslint.config.js
.prettierrc
components.json                  # shadcn config
tsconfig.json
tsconfig.app.json
vite.config.ts
pnpm-lock.yaml
```

**Package manager**: pnpm only — commit `pnpm-lock.yaml`; do not use npm or yarn.

**Structure Decision**: Constitution Principle III with spec-defined `app/` subtree for
providers, router, layouts, and guards. shadcn/ui in `components/ui/`; domain-agnostic
composites in `components/common/` and `components/feedback/`. Features directory empty
until Spec 002+.

## Complexity Tracking

No constitution violations requiring justification. Auth guard and API interceptors are
structural stubs only.

---

## Implementation Phases

### Phase 1 — Project Bootstrap & Development Tooling

**Objective**: Create a buildable Vite + React 19 + TypeScript (strict) project with
quality tooling and path aliases.

**Scope**:

- Vite project scaffolding
- TypeScript strict configuration
- ESLint + Prettier
- Husky + lint-staged
- `@/` path aliases
- `.env.example` with `VITE_API_BASE_URL`
- pnpm scripts: `dev`, `build`, `preview`, `lint`, `typecheck`, `format`
- `packageManager` field in `package.json` pinning pnpm version

**Tasks**:

| ID    | Task                                                                         | Parallel |
| ----- | ---------------------------------------------------------------------------- | -------- |
| P1-T1 | `pnpm create vite` — React + TypeScript template                             | —        |
| P1-T2 | Enable `strict: true` and all strict flags in `tsconfig.app.json`            | P1-T1    |
| P1-T3 | Configure `@/` alias in `vite.config.ts` and `tsconfig` paths                | P1-T1    |
| P1-T4 | Install and configure ESLint (typescript-eslint, react-hooks, react-refresh) | P1-T1    |
| P1-T5 | Install and configure Prettier with ESLint integration                       | P1-T4    |
| P1-T6 | Configure Husky + lint-staged (lint + format on staged files)                | P1-T5    |
| P1-T7 | Create `.env.example` and document env vars                                  | P1-T1    |
| P1-T8 | Create root folder structure per Project Structure above                     | P1-T3    |

**Dependencies**: None (first phase)

**Deliverables**: Buildable project; lint/format/hooks operational; folder skeleton

**Validation**:

- `pnpm build` succeeds
- `pnpm lint` passes
- `pnpm typecheck` passes
- Pre-commit hook runs on test commit

**Risks**:

| Risk                               | Mitigation                                      |
| ---------------------------------- | ----------------------------------------------- |
| React 19 peer dependency conflicts | Pin compatible versions; verify on install      |
| ESLint flat config vs legacy       | Use ESLint 9 flat config matching Vite template |

**Exit Criteria**: SC-001, SC-002 partially met — project builds and lints with zero errors

**Parallel opportunities**: P1-T2, P1-T3, P1-T4, P1-T7, P1-T8 after P1-T1

---

### Phase 2 — Styling & Design System Foundation

**Objective**: Configure Tailwind CSS v4, design tokens, global styles, typography, and
shadcn/ui with UI UX Pro Max–aligned SaaS aesthetic.

**Scope**:

- Tailwind CSS v4 + Vite plugin
- Design tokens (colors, radius, shadows, spacing, typography)
- Light/dark CSS variables
- Global styles and font loading
- shadcn/ui init and base configuration
- Motion animation defaults (150–250ms)

**Tasks**:

| ID    | Task                                                                                                           | Parallel |
| ----- | -------------------------------------------------------------------------------------------------------------- | -------- |
| P2-T1 | Install Tailwind CSS v4 with `@tailwindcss/vite` plugin                                                        | —        |
| P2-T2 | Create `styles/tokens.css` — color palette, radius, shadows per UI UX Pro Max                                  | P2-T1    |
| P2-T3 | Create `styles/globals.css` — base layer, typography scale, focus rings                                        | P2-T2    |
| P2-T4 | Initialize shadcn/ui via `pnpm dlx shadcn@latest init` (`components.json`, CSS variables, `lib/utils.ts` cn()) | P2-T3    |
| P2-T5 | Install Motion; define transition presets in constants or tokens                                               | P2-T1    |
| P2-T6 | Install Lucide React; configure default icon size/stroke                                                       | P2-T4    |
| P2-T7 | Verify light/dark CSS variable pairs render correctly                                                          | P2-T4    |

**Dependencies**: Phase 1 complete

**Deliverables**: Tailwind v4 working; shadcn/ui configured; design tokens file; globals

**Validation**:

- Tailwind utilities apply in a test component
- shadcn Button renders in light and dark mode
- Typography and spacing match token definitions

**Risks**:

| Risk                                    | Mitigation                                |
| --------------------------------------- | ----------------------------------------- |
| Tailwind v4 breaking changes vs v3 docs | Follow v4 official Vite integration guide |
| shadcn/ui Tailwind v4 compatibility     | Use latest shadcn CLI init for v4         |

**Exit Criteria**: Visual foundation ready; shadcn/ui functional per acceptance criteria

**Parallel opportunities**: P2-T2, P2-T5, P2-T6 after P2-T1

---

### Phase 3 — App Providers & Core Libraries

**Objective**: Wire application-level providers and shared library modules.

**Scope**:

- ThemeProvider (light / dark / system)
- QueryProvider + QueryClient defaults
- ToastProvider (Sonner)
- AppProviders composition
- `lib/query-client.ts`, `lib/utils.ts`
- Utility functions: `formatDate`, `formatCurrency`, `debounce`
- Type definitions for theme and navigation

**Tasks**:

| ID    | Task                                                                           | Parallel     |
| ----- | ------------------------------------------------------------------------------ | ------------ |
| P3-T1 | Create `lib/query-client.ts` — staleTime, retry, refetchOnWindowFocus defaults | —            |
| P3-T2 | Create `QueryProvider` with devtools (dev only)                                | P3-T1        |
| P3-T3 | Create `theme.store.ts` + `ThemeProvider` — light/dark/system + localStorage   | —            |
| P3-T4 | Create `hooks/useTheme.ts` and `hooks/useMediaQuery.ts`                        | P3-T3        |
| P3-T5 | Create `ToastProvider` wrapping Sonner with theme-aware styling                | P3-T3        |
| P3-T6 | Compose `AppProviders.tsx` (Theme → Query → Toast)                             | P3-T2, P3-T5 |
| P3-T7 | Create `utils/format-date.ts`, `format-currency.ts`, `debounce.ts`             | —            |
| P3-T8 | Create `types/theme.types.ts`, `types/navigation.types.ts`                     | —            |

**Dependencies**: Phase 2 complete

**Deliverables**: Provider stack; query client; theme switching logic; utilities

**Validation**:

- Theme switches light → dark → system without reload
- React Query Devtools visible in dev mode only
- Toast renders on manual trigger test

**Risks**:

| Risk                                | Mitigation                                                      |
| ----------------------------------- | --------------------------------------------------------------- |
| Flash of wrong theme on load        | Apply theme class in `index.html` inline script or early effect |
| Query devtools in production bundle | Dynamic import gated by `import.meta.env.DEV`                   |

**Exit Criteria**: SC-005 met — theme modes work; providers ready for router integration

**Parallel opportunities**: P3-T1/T3/T7/T8 in parallel; P3-T6 after providers ready

---

### Phase 4 — Routing, Layouts & Navigation

**Objective**: Configure React Router Data Router with nested layouts, lazy-loaded routes,
navigation config, and route guard foundation.

**Scope**:

- `createBrowserRouter` with nested `AuthLayout` and `DashboardLayout`
- Routes: `/` (redirect), `/login`, `/dashboard`, catch-all `404`
- Lazy-loaded page components via `React.lazy` + `Suspense`
- Navigation config with placeholder module links
- Responsive sidebar (permanent / collapsible / drawer)
- `AuthGuard` passthrough stub
- Route error boundaries

**Tasks**:

| ID     | Task                                                                                      | Parallel    |
| ------ | ----------------------------------------------------------------------------------------- | ----------- |
| P4-T1  | Create `constants/routes.ts` and `constants/navigation.ts`                                | —           |
| P4-T2  | Create `AuthLayout.tsx` — centered card shell, no sidebar                                 | —           |
| P4-T3  | Create `DashboardLayout.tsx` — sidebar, header, breadcrumb, footer slots                  | —           |
| P4-T4  | Create responsive `Sidebar` component (desktop permanent, tablet collapse, mobile drawer) | P4-T3       |
| P4-T5  | Create `Header`, `Breadcrumb` placeholder, `Footer` placeholder components                | P4-T3       |
| P4-T6  | Create placeholder pages: `LoginPage`, `DashboardPage`, `NotFoundPage`                    | —           |
| P4-T7  | Configure `routes.tsx` with lazy imports and nested layout routes                         | P4-T2–P4-T6 |
| P4-T8  | Create `AuthGuard.tsx` passthrough (renders `<Outlet />`; Spec 002 adds logic)            | P4-T7       |
| P4-T9  | Wire `RouterProvider` in `App.tsx`; root `/` redirects to `/dashboard`                    | P4-T7       |
| P4-T10 | Add `PageSkeleton` as Suspense fallback for lazy routes                                   | P4-T7       |

**Dependencies**: Phase 3 complete (providers wrap router)

**Deliverables**: Working navigation shell; 4 routes; responsive sidebar; guard stub

**Validation**:

- All routes reachable and bookmarkable (SC-003)
- Browser back/forward works
- Sidebar behavior correct at 320px, 768px, 1280px+ (SC-004)
- Unimplemented nav links route to placeholder or coming-soon without errors

**Risks**:

| Risk                            | Mitigation                                                 |
| ------------------------------- | ---------------------------------------------------------- |
| Layout remount on navigation    | Use nested routes with layout parent, not per-page layouts |
| Mobile drawer focus trap issues | Use shadcn Sheet/Drawer with built-in focus management     |

**Exit Criteria**: FR-002, FR-003, FR-004, FR-013 met; layout persistent during navigation

**Parallel opportunities**: P4-T1/T2/T6 parallel; P4-T4/T5 after P4-T3

---

### Phase 5 — State Management & HTTP Layer

**Objective**: Establish Zustand stores (structure only) and centralized Axios client with
interceptors — no API endpoints.

**Scope**:

- `auth.store.ts` — token fields and setter stubs, no login logic
- `ui.store.ts` — sidebar open/collapsed, mobile drawer state
- `theme.store.ts` (if not fully in Phase 3, consolidate here)
- `lib/axios.ts` — base URL, timeout, request/response interceptors
- Empty `services/` directory with `.gitkeep` or README

**Tasks**:

| ID    | Task                                                                                     | Parallel     |
| ----- | ---------------------------------------------------------------------------------------- | ------------ |
| P5-T1 | Create `lib/axios.ts` — instance, `VITE_API_BASE_URL`, 30s timeout                       | —            |
| P5-T2 | Add request interceptor stub (attach token placeholder for Spec 002)                     | P5-T1        |
| P5-T3 | Add response interceptor stub (401 handler placeholder, error normalization)             | P5-T1        |
| P5-T4 | Create `auth.store.ts` — `accessToken`, `refreshToken`, `setTokens`, `clearTokens` stubs | —            |
| P5-T5 | Create `ui.store.ts` — `sidebarCollapsed`, `mobileNavOpen`, toggle actions               | —            |
| P5-T6 | Connect `ui.store` to Sidebar/Drawer components                                          | P5-T5, P4-T4 |
| P5-T7 | Scaffold `services/` directory; document service class pattern in comment                | —            |
| P5-T8 | Install React Hook Form, Zod, `@hookform/resolvers` (no forms yet)                       | —            |

**Dependencies**: Phase 4 complete (ui store connects to sidebar)

**Deliverables**: Axios client; 3 Zustand stores; services scaffold; form libs installed

**Validation**:

- Axios instance exports correctly; no network calls on app load
- Stores readable via React DevTools / Zustand devtools
- No server state duplicated in Zustand

**Risks**:

| Risk                              | Mitigation                                               |
| --------------------------------- | -------------------------------------------------------- |
| Developers calling axios directly | ESLint rule or code review; document in services/ README |
| Token interceptor premature logic | Stub with TODO comments for Spec 002                     |

**Exit Criteria**: FR-006, FR-007, FR-008 met; Spec 002 can add auth logic without restructure

**Parallel opportunities**: P5-T1/T4/T5/T7/T8 in parallel

---

### Phase 6 — Shared UI Components

**Objective**: Install shadcn/ui primitives and build composite common/feedback components
following UI UX Pro Max and constitution design system hierarchy.

**Scope**:

- shadcn/ui primitives: button, card, input, textarea, select, dialog, drawer, dropdown-menu, badge, skeleton, separator, sheet, tooltip
- Common: PageHeader, PageContainer, SearchInput, DataTable foundation
- Feedback: EmptyState, ErrorState, ErrorFallback, LoadingOverlay, PageSkeleton
- Global ErrorBoundary component

**Tasks**:

| ID     | Task                                                                          | Parallel    |
| ------ | ----------------------------------------------------------------------------- | ----------- |
| P6-T1  | Add shadcn/ui primitives via `pnpm dlx shadcn@latest add` (batch install)     | —           |
| P6-T2  | Create `PageHeader.tsx` — title, description, breadcrumbs slot, actions slot  | P6-T1       |
| P6-T3  | Create `PageContainer.tsx` — max-width, padding, responsive                   | P6-T1       |
| P6-T4  | Create `SearchInput.tsx` — icon + input composite                             | P6-T1       |
| P6-T5  | Create `DataTable.tsx` — TanStack Table foundation (columns API, no data yet) | P6-T1       |
| P6-T6  | Create `EmptyState.tsx` — icon, title, description, CTA slot                  | P6-T1       |
| P6-T7  | Create `ErrorState.tsx` and `ErrorFallback.tsx`                               | P6-T1       |
| P6-T8  | Create `LoadingOverlay.tsx` and enhance `PageSkeleton.tsx`                    | P6-T1       |
| P6-T9  | Create `ErrorBoundary.tsx` class component wrapping ErrorFallback             | P6-T7       |
| P6-T10 | Apply UI UX Pro Max spacing, shadows, radius to all composites                | P6-T2–P6-T9 |

**Dependencies**: Phase 2 (styling) and Phase 4 (layouts use components)

**Deliverables**: Full shared component library per FR-009

**Validation**:

- Each component renders in Storybook-free manual test page or dashboard placeholder
- Components work in light and dark mode
- Dialog/Drawer keyboard accessible with focus trap
- Touch targets ≥ 44px on interactive elements

**Risks**:

| Risk                                    | Mitigation                                           |
| --------------------------------------- | ---------------------------------------------------- |
| Duplicate button/dialog implementations | Constitution XXIX — audit; only `components/ui/`     |
| shadcn component version drift          | Lock versions in components.json; batch install once |

**Exit Criteria**: FR-009, FR-014 met; shared primitives importable via `@/components/`

**Parallel opportunities**: P6-T2 through P6-T9 after P6-T1

---

### Phase 7 — Pages, Error Handling & Loading Experience

**Objective**: Implement placeholder pages with full UI states, wire error boundary, 404
page, and loading patterns.

**Scope**:

- Dashboard placeholder with PageHeader, welcome EmptyState, PageSkeleton loading
- Login shell with AuthLayout card placeholder
- 404 page with navigation home
- Global ErrorBoundary in provider tree
- Route-level error elements

**Tasks**:

| ID    | Task                                                                       | Parallel |
| ----- | -------------------------------------------------------------------------- | -------- |
| P7-T1 | Implement `DashboardPage` — PageHeader + welcome EmptyState content        | —        |
| P7-T2 | Implement `LoginPage` — auth card shell, "Sign In" placeholder, no form    | —        |
| P7-T3 | Implement `NotFoundPage` — friendly message + link to dashboard            | —        |
| P7-T4 | Wrap app in `ErrorBoundary`; add route `errorElement`                      | —        |
| P7-T5 | Add Suspense boundaries with PageSkeleton at layout and route levels       | —        |
| P7-T6 | Add `index.html` noscript fallback message                                 | —        |
| P7-T7 | Create coming-soon placeholder route/component for unimplemented nav links | —        |

**Dependencies**: Phases 4 and 6 complete

**Deliverables**: All pages with loading/empty/error states; 404; error boundary

**Validation**:

- Navigate to `/unknown` → 404 with recovery link
- Simulate render error → ErrorFallback displays
- Lazy route transition shows skeleton, not blank screen
- Dashboard shows welcome empty state per spec

**Risks**:

| Risk                                      | Mitigation                                               |
| ----------------------------------------- | -------------------------------------------------------- |
| Error boundary doesn't catch async errors | Document limitation; Query error boundaries in Spec 002+ |
| Over-nested Suspense causing layout flash | Single Suspense at route level with layout outside       |

**Exit Criteria**: FR-010, FR-011 met; User Stories 2 and 5 acceptance scenarios pass

**Parallel opportunities**: P7-T1/T2/T3/T6/T7 in parallel

---

### Phase 8 — Performance, Accessibility & Final Validation

**Objective**: Verify production build, performance optimizations, accessibility, and full
quickstart validation. Confirm Spec 002 readiness.

**Scope**:

- Verify lazy loading and code splitting in build output
- Tree shaking validation
- Accessibility audit (keyboard, focus, semantic HTML, ARIA)
- Responsive verification all breakpoints
- Production quality checklist (Principle XL)
- README with setup instructions

**Tasks**:

| ID    | Task                                                                        | Parallel |
| ----- | --------------------------------------------------------------------------- | -------- |
| P8-T1 | Analyze `dist/` chunks — confirm route-based splitting                      | —        |
| P8-T2 | Run `pnpm build && pnpm preview` — smoke test all routes                    | —        |
| P8-T3 | Responsive test: 320, 768, 1024, 1280, 1536px viewports                     | P8-T2    |
| P8-T4 | Keyboard navigation audit — tab order, focus visible, dialog trap           | P8-T2    |
| P8-T5 | Dark mode audit — all pages and components                                  | P8-T2    |
| P8-T6 | Run full quickstart.md validation checklist                                 | P8-T2    |
| P8-T7 | Write project README — install, dev, build, env vars, architecture overview | —        |
| P8-T8 | Final lint + typecheck + build — zero errors                                | P8-T7    |

**Dependencies**: All prior phases complete

**Deliverables**: Production-ready foundation; README; validated quickstart

**Validation**: All acceptance criteria from spec; all SC-001 through SC-006

**Risks**:

| Risk                                      | Mitigation                                           |
| ----------------------------------------- | ---------------------------------------------------- |
| Large bundle from Motion + TanStack Table | Lazy import table; tree-shake unused Motion features |
| Missing README blocks SC-001              | README is explicit deliverable                       |

**Exit Criteria**: All spec acceptance criteria met; ready for `/speckit-tasks` and Spec 002

**Parallel opportunities**: P8-T3/T4/T5 after P8-T2

---

## Phase Dependency Graph

```text
Phase 1 (Bootstrap)
    ↓
Phase 2 (Styling)
    ↓
Phase 3 (Providers) ─────────────────┐
    ↓                                │
Phase 4 (Routing & Layouts)          │
    ↓                                │
Phase 5 (State & HTTP) ←─────────────┘
    ↓
Phase 6 (Shared UI) — may start composables after Phase 2, full wire in Phase 7
    ↓
Phase 7 (Pages & Errors)
    ↓
Phase 8 (Validation & Polish)
```

**Maximum parallelism**: After Phase 1, Phases 2 and partial Phase 6 shadcn primitives can
overlap. After Phase 3, Phase 5 store/axios work can parallel Phase 4 layout components.

## Specification 002 Readiness Checklist

After Phase 8, the following MUST exist for Specification 002 — Company & Identity
Foundation (Backend P001) without refactoring:

- [ ] `AuthLayout` and `AuthGuard` stub wired in router
- [ ] `auth.store.ts` with token field stubs (tenant-isolation ready)
- [ ] Axios request interceptor stub for Bearer token attachment
- [ ] Axios response interceptor stub for 401 refresh flow
- [ ] `services/` scaffolded so `auth.service.ts`, `company.service.ts`, and
      `user.service.ts` can be added without moving files
- [ ] React Hook Form + Zod installed
- [ ] Login route at `/login` with shell page
- [ ] Form UI primitives (Input, Button, Label, Select) in `components/ui/`
- [ ] Toast provider for auth/identity error feedback
- [ ] Data-driven navigation ready to receive Company & Identity sections

## Artifacts

| Artifact              | Path                                                   | Status   |
| --------------------- | ------------------------------------------------------ | -------- |
| Research              | [research.md](./research.md)                           | Complete |
| Data Model            | [data-model.md](./data-model.md)                       | Complete |
| Contracts             | [contracts/](./contracts/)                             | Complete |
| Quickstart            | [quickstart.md](./quickstart.md)                       | Complete |
| Implementation Prompt | [implementation-prompt.md](./implementation-prompt.md) | Complete |
| Tasks                 | [tasks.md](./tasks.md)                                 | Complete |
