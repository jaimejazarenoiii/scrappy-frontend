---
description: 'Task list for Initialize Scrappy foundation'
---

# Tasks: Initialize Scrappy

**Input**: Design documents from `specs/001-initialize-scrappy-web/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not requested — manual validation via quickstart.md only

**Organization**: Tasks grouped by user story for independent implementation and testing

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Maps to spec.md user stories (US1–US5)
- All tasks include exact file paths

## Path Conventions

- Application root: repository root (`src/`, `public/`, config files)
- Shared UI: `src/components/ui/` (shadcn), `src/components/common/`, `src/components/feedback/`
- App shell: `src/app/` (providers, router, layouts, guards)
- See plan.md for full tree

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Scaffold Vite + React 19 + TypeScript project with quality tooling and folder architecture

**Independent Test**: `pnpm install && pnpm dev` starts without errors; folder skeleton exists

- [x] T001 Initialize Vite React TypeScript project at repository root via `pnpm create vite`
- [x] T002 Upgrade and pin React 19 and react-dom 19 in `package.json`
- [x] T003 Enable TypeScript strict mode and strict flags in `tsconfig.json` and `tsconfig.app.json`
- [x] T004 Configure `@/` path alias in `vite.config.ts` resolve.alias
- [x] T005 Configure `@/*` paths mapping in `tsconfig.json` and `tsconfig.app.json`
- [x] T006 [P] Create feature-based folder skeleton per plan.md under `src/` (app, assets, components, features, hooks, lib, services, store, styles, types, utils, constants)
- [x] T007 [P] Create placeholder directories `src/assets/images/`, `src/assets/icons/`, `src/assets/fonts/`
- [x] T008 [P] Create empty `src/features/.gitkeep` for future feature modules
- [x] T009 Install and configure ESLint 9 flat config in `eslint.config.js` with typescript-eslint, react-hooks, react-refresh
- [x] T010 [P] Install and configure Prettier in `.prettierrc` with eslint-config-prettier integration
- [x] T011 Configure Husky via `pnpm exec husky init` and pre-commit hook in `.husky/pre-commit` running lint-staged
- [x] T012 Configure lint-staged in `package.json` for `*.{ts,tsx}` eslint and prettier on staged files
- [x] T013 Add package scripts `dev`, `build`, `preview`, `lint`, `typecheck`, `format` in `package.json` and set `packageManager` field for pnpm
- [x] T014 [P] Create `.env.example` with `VITE_API_BASE_URL=http://localhost:3000/api`
- [x] T015 [P] Create `.gitignore` entries for `node_modules`, `dist`, `.env`, `.env.local` (commit `pnpm-lock.yaml`)

**Checkpoint**: Project scaffolds; strict TS and path aliases configured

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Styling system, design tokens, shadcn/ui init, core providers, and shared libraries — MUST complete before user story phases

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T016 Install Tailwind CSS v4 and `@tailwindcss/vite` plugin; wire plugin in `vite.config.ts`
- [x] T017 Create design tokens in `src/styles/tokens.css` (colors, radius, shadows, spacing per UI UX Pro Max)
- [x] T018 Create global styles in `src/styles/globals.css` with `@import "tailwindcss"`, typography scale, and focus ring utilities
- [x] T019 Import `src/styles/globals.css` in `src/main.tsx`
- [x] T020 Initialize shadcn/ui via `pnpm dlx shadcn@latest init` and `components.json` at repository root targeting `src/components/ui` and `src/lib/utils.ts`
- [x] T021 Implement `cn()` utility in `src/lib/utils.ts` using clsx and tailwind-merge
- [x] T022 [P] Install clsx, tailwind-merge, class-variance-authority utility dependencies
- [x] T023 [P] Install and configure Lucide React as default icon set
- [x] T024 [P] Install Motion package; create animation presets constant in `src/constants/animations.ts` (150–250ms)
- [x] T025 Create `src/types/theme.types.ts` with `ThemeMode` and `ResolvedTheme` types per data-model.md
- [x] T026 [P] Create `src/types/navigation.types.ts` with `NavigationItem` interface per data-model.md
- [x] T027 [P] Create `src/types/api.types.ts` with `ApiError` and `ApiResponse<T>` foundation types
- [x] T028 Create `src/lib/query-client.ts` with staleTime, gcTime, retry, and refetchOnWindowFocus defaults per data-model.md
- [x] T029 Create `src/store/theme.store.ts` with mode state and setMode action per contracts/providers-and-infrastructure.md
- [x] T030 Create `src/app/providers/ThemeProvider.tsx` applying light/dark class on `document.documentElement` with localStorage key `scrappy-theme`
- [x] T031 Add anti-FOUC inline theme script in `index.html` reading `scrappy-theme` from localStorage
- [x] T032 Create `src/hooks/useTheme.ts` exposing mode, setMode, and resolvedTheme from theme store
- [x] T033 [P] Create `src/hooks/useMediaQuery.ts` for responsive breakpoint detection (mobile, tablet, desktop)
- [x] T034 Create `src/app/providers/QueryProvider.tsx` wrapping QueryClientProvider with dev-only dynamic React Query Devtools import
- [x] T035 Install Sonner; create `src/app/providers/ToastProvider.tsx` with theme-aware Toaster (bottom-right desktop, top-center mobile)
- [x] T036 Compose provider stack in `src/app/providers/AppProviders.tsx` (ThemeProvider → QueryProvider → ToastProvider)
- [x] T037 [P] Create `src/utils/format-date.ts` with `formatDate(date, format?)` function
- [x] T038 [P] Create `src/utils/format-currency.ts` with `formatCurrency(amount, currency?)` function
- [x] T039 [P] Create `src/utils/debounce.ts` with generic debounce utility
- [x] T040 Install core runtime dependencies: react-router, @tanstack/react-query, @tanstack/react-query-devtools, zustand, axios, sonner, @tanstack/react-table

**Checkpoint**: Styling, tokens, providers, types, and utilities ready — application can mount

---

## Phase 3: User Story 1 — Developer Bootstraps the Project (Priority: P1) 🎯 MVP

**Goal**: Developer can clone, install, build, lint, and run the application locally with zero errors

**Independent Test**: `pnpm install && pnpm typecheck && pnpm lint && pnpm build && pnpm dev` — app loads in browser

### Implementation for User Story 1

- [x] T041 [US1] Create `src/app/App.tsx` rendering AppProviders and RouterProvider placeholder
- [x] T042 [US1] Wire `src/main.tsx` to render App inside StrictMode with globals.css imported
- [x] T043 [US1] Create minimal `public/favicon.ico` and verify `index.html` has correct root div and meta viewport
- [x] T044 [US1] Add noscript fallback message in `index.html` for graceful degradation when JS is disabled
- [x] T045 [US1] Verify `pnpm typecheck` passes with zero errors across `src/`
- [x] T046 [US1] Verify `pnpm lint` passes with zero errors
- [x] T047 [US1] Verify `pnpm build` produces `dist/` without errors
- [x] T048 [US1] Verify `pnpm dev` serves application at localhost without console errors

**Checkpoint**: User Story 1 complete — project bootstraps successfully (SC-001, SC-002 partial)

---

## Phase 4: User Story 2 — Developer Navigates the Application Shell (Priority: P1)

**Goal**: Navigate `/`, `/login`, `/dashboard`, and 404 with correct layouts, lazy loading, and browser history support

**Independent Test**: All routes reachable, bookmarkable; back/forward works; layouts persist during child navigation

### Implementation for User Story 2

- [x] T049 [P] [US2] Create route constants in `src/constants/routes.ts` per contracts/routes-and-layouts.md
- [x] T050 [P] [US2] Create data-driven navigation config in `src/constants/navigation.ts` with an active Dashboard item and disabled/"coming soon" placeholders for roadmap sections (no links to business pages)
- [x] T051 [US2] Create `src/app/layouts/AuthLayout.tsx` with centered card shell and Outlet (no sidebar)
- [x] T052 [US2] Create `src/app/layouts/DashboardLayout.tsx` with sidebar, header, breadcrumb, footer slots and Outlet
- [x] T053 [P] [US2] Create `src/components/common/Header.tsx` with sticky header and mobile menu trigger placeholder
- [x] T054 [P] [US2] Create `src/components/common/Breadcrumb.tsx` as placeholder breadcrumb component
- [x] T055 [P] [US2] Create `src/components/common/Footer.tsx` as placeholder footer component
- [x] T056 [US2] Create `src/components/common/Sidebar.tsx` with navigation items from `src/constants/navigation.ts`
- [x] T057 [P] [US2] Create lazy `src/app/pages/LoginPage.tsx` shell (no form logic)
- [x] T058 [P] [US2] Create lazy `src/app/pages/DashboardPage.tsx` placeholder (content refined in US5)
- [x] T059 [P] [US2] Create lazy `src/app/pages/NotFoundPage.tsx` with friendly message (refined in US5)
- [x] T060 [P] [US2] Create lazy `src/app/pages/ComingSoonPage.tsx` for unimplemented nav links
- [x] T061 [US2] Create `src/app/guards/AuthGuard.tsx` passthrough stub rendering `<Outlet />` per contracts
- [x] T062 [US2] Define nested routes in `src/app/router/routes.tsx` with AuthLayout, DashboardLayout, lazy pages, and index redirect `/` → `/dashboard`
- [x] T063 [US2] Export `createBrowserRouter` instance in `src/app/router/index.tsx` with root and layout errorElement placeholders
- [x] T064 [US2] Wire RouterProvider in `src/app/App.tsx` using router from `src/app/router/index.tsx`
- [x] T065 [US2] Add React.lazy dynamic imports and Suspense with PageSkeleton fallback for all page routes in `src/app/router/routes.tsx`
- [x] T066 [US2] Set document titles per route (Sign In, Dashboard, Page Not Found) in page components or route handles

**Checkpoint**: User Story 2 complete — all routes work with correct layouts (SC-003)

---

## Phase 5: User Story 3 — Responsive Layout Adapts Across Devices (Priority: P2)

**Goal**: Dashboard shell adapts sidebar/navigation for mobile drawer, tablet collapsible, desktop permanent

**Independent Test**: Verify layout at 320px, 768px, and 1280px+ without horizontal overflow

### Implementation for User Story 3

- [x] T067 [US3] Create `src/store/ui.store.ts` with sidebarCollapsed, mobileNavOpen, and toggle actions per data-model.md
- [x] T068 [US3] Connect `src/store/ui.store.ts` to `src/components/common/Sidebar.tsx` for collapsed and open states
- [x] T069 [US3] Implement desktop (≥1280px) permanent sidebar (256px) in `src/components/common/Sidebar.tsx`
- [x] T070 [US3] Implement tablet (768–1279px) collapsible icon-rail sidebar in `src/components/common/Sidebar.tsx`
- [x] T071 [US3] Implement mobile (<768px) drawer navigation using shadcn Sheet in `src/components/common/Sidebar.tsx`
- [x] T072 [US3] Wire mobile menu trigger in `src/components/common/Header.tsx` to `ui.store` openMobileNav/closeMobileNav
- [x] T073 [US3] Apply sticky header behavior and touch-friendly control sizes (min 44×44px) in `src/components/common/Header.tsx`
- [x] T074 [US3] Ensure `src/app/layouts/DashboardLayout.tsx` uses responsive padding and prevents horizontal overflow at 320px
- [x] T075 [US3] Apply Motion drawer transition (150–250ms) to mobile Sheet open/close in `src/components/common/Sidebar.tsx`
- [x] T076 [US3] Verify AuthLayout responsive behavior — full-width mobile padding, centered max-w-md card on desktop in `src/app/layouts/AuthLayout.tsx`

**Checkpoint**: User Story 3 complete — responsive sidebar verified (SC-004)

---

## Phase 6: User Story 4 — Foundation Supports Future Feature Development (Priority: P2)

**Goal**: API client, query provider, Zustand stores, and shared UI primitives exist without business logic or live API calls

**Independent Test**: Inspect `lib/axios.ts`, `store/`, `services/`, `components/ui/` — all foundations present; no network requests on load

### Implementation for User Story 4

- [x] T077 [P] [US4] Create `src/lib/axios.ts` apiClient with baseURL from `import.meta.env.VITE_API_BASE_URL`, 30s timeout, JSON headers
- [x] T078 [US4] Add request interceptor stub in `src/lib/axios.ts` reading accessToken from `src/store/auth.store.ts` (Bearer placeholder for Spec 002)
- [x] T079 [US4] Add response interceptor stub in `src/lib/axios.ts` normalizing errors to `ApiError` and 401 placeholder handler
- [x] T080 [P] [US4] Create `src/store/auth.store.ts` with accessToken, refreshToken, isAuthenticated, setTokens, clearTokens stubs
- [x] T081 [P] [US4] Scaffold `src/services/` directory with `src/services/README.md` documenting service class pattern (no Axios in components)
- [x] T082 [P] [US4] Install react-hook-form, @hookform/resolvers, and zod (no forms implemented yet)
- [x] T083 [US4] Add shadcn/ui primitives via `pnpm dlx shadcn@latest add` into `src/components/ui/`: button, card, input, textarea, select, dialog, drawer, dropdown-menu, badge, skeleton, separator, sheet, tooltip
- [x] T084 [P] [US4] Create `src/components/common/PageHeader.tsx` per contracts/ui-components.md (title, description, breadcrumbs, actions slots)
- [x] T085 [P] [US4] Create `src/components/common/PageContainer.tsx` with responsive padding and maxWidth variants
- [x] T086 [P] [US4] Create `src/components/common/SearchInput.tsx` with Lucide search icon and shadcn Input
- [x] T087 [US4] Create `src/components/common/DataTable.tsx` TanStack Table foundation with columns API, isLoading, and emptyMessage props
- [x] T088 [P] [US4] Create `src/components/feedback/EmptyState.tsx` per contracts/ui-components.md
- [x] T089 [P] [US4] Create `src/components/feedback/ErrorState.tsx` for inline error display
- [x] T090 [P] [US4] Create `src/components/feedback/ErrorFallback.tsx` with friendly message and optional resetError (no stack traces)
- [x] T091 [P] [US4] Create `src/components/feedback/LoadingOverlay.tsx` per contracts/ui-components.md
- [x] T092 [P] [US4] Create `src/components/feedback/PageSkeleton.tsx` with placeholder cards and layout skeleton
- [x] T093 [US4] Apply UI UX Pro Max spacing, soft shadows, and rounded corners across `src/components/common/` and `src/components/feedback/` composites
- [x] T094 [US4] Verify no axios imports exist outside `src/lib/axios.ts` and `src/services/` via codebase search
- [x] T095 [US4] Verify application makes zero network API requests on initial load in browser Network tab

**Checkpoint**: User Story 4 complete — Spec 002 foundations in place (SC-006 partial)

---

## Phase 7: User Story 5 — Errors Are Handled Gracefully (Priority: P3)

**Goal**: 404 page, global error boundary, loading skeletons on route transitions — no blank screens

**Independent Test**: Visit `/unknown` for 404; trigger render error for ErrorFallback; navigate lazy routes and see skeleton

### Implementation for User Story 5

- [x] T096 [US5] Create `src/components/feedback/ErrorBoundary.tsx` class component wrapping ErrorFallback per React error boundary pattern
- [x] T097 [US5] Wrap application tree with ErrorBoundary in `src/app/App.tsx` inside providers
- [x] T098 [US5] Add route-level `errorElement` using ErrorFallback in `src/app/router/routes.tsx` for root and layout routes
- [x] T099 [US5] Implement full `src/app/pages/NotFoundPage.tsx` with "Page Not Found" message and Link to `/dashboard`
- [x] T100 [US5] Implement `src/app/pages/DashboardPage.tsx` with PageHeader, PageContainer, and welcome EmptyState per spec empty state design
- [x] T101 [US5] Implement `src/app/pages/LoginPage.tsx` with AuthLayout card shell, "Sign In" title placeholder, no form fields
- [x] T102 [US5] Implement `src/app/pages/ComingSoonPage.tsx` with EmptyState for unimplemented navigation modules
- [x] T103 [US5] Wire `/coming-soon` route in `src/app/router/routes.tsx` for placeholder navigation links from `src/constants/navigation.ts`
- [x] T104 [US5] Ensure Suspense fallback uses `src/components/feedback/PageSkeleton.tsx` on all lazy routes in `src/app/router/routes.tsx`
- [x] T105 [US5] Verify lazy route transitions show skeleton instead of blank screen when throttling network in DevTools

**Checkpoint**: User Story 5 complete — error and loading patterns work (FR-010, FR-011)

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Performance validation, accessibility audit, documentation, and production quality checklist

- [x] T106 [P] Verify route-based code splitting in `dist/assets/` chunks after `pnpm build`
- [x] T107 Run `pnpm build && pnpm preview` smoke test for all routes per `specs/001-initialize-scrappy-web/quickstart.md`
- [x] T108 [P] Responsive verification at 320px, 768px, 1024px, 1280px, 1536px viewports per quickstart.md
- [x] T109 [P] Keyboard navigation audit — tab order, visible focus rings, drawer focus trap, dialog Escape close
- [x] T110 [P] Dark mode audit across all pages and shared components in light, dark, and system modes
- [x] T111 [P] Verify skeleton loaders and meaningful empty states on dashboard per Principles XXXIII and XXXIV
- [x] T112 [P] Production quality checklist (Principle XL) — complete all items in `specs/001-initialize-scrappy-web/quickstart.md`
- [x] T113 [P] Design system audit — confirm no duplicate Button/Dialog/Card outside `src/components/ui/` per Principle XXIX
- [x] T114 Write project `README.md` with pnpm install, dev, build, env vars, folder architecture, and link to constitution
- [x] T115 Verify Specification 002 (Company & Identity Foundation) readiness checklist in `specs/001-initialize-scrappy-web/plan.md` (AuthGuard, auth.store, axios stubs, /login shell, RHF+Zod, toast, data-driven navigation)
- [x] T116 Final gate — `pnpm typecheck && pnpm lint && pnpm build` all pass with zero errors

---

## Dependencies & Execution Order

### Phase Dependencies

```text
Phase 1 (Setup)
    ↓
Phase 2 (Foundational) — BLOCKS all user stories
    ↓
Phase 3 (US1 Bootstrap) — validates Phase 1–2
    ↓
Phase 4 (US2 Navigation) — requires providers from Phase 2
    ↓
Phase 5 (US3 Responsive) — requires US2 layouts and Sidebar
    ↓
Phase 6 (US4 Foundations) — axios/stores can start after Phase 2; full UI wire after US2
    ↓
Phase 7 (US5 Errors) — requires US4 shared components and US2 routes
    ↓
Phase 8 (Polish) — requires all phases complete
```

### User Story Dependencies

| Story    | Depends On                 | Can Start After                                                 |
| -------- | -------------------------- | --------------------------------------------------------------- |
| US1 (P1) | Phase 1–2                  | Phase 2 complete                                                |
| US2 (P1) | US1, Phase 2               | Phase 3 complete                                                |
| US3 (P2) | US2 Sidebar/Layout         | Phase 4 T056 complete                                           |
| US4 (P2) | Phase 2                    | Phase 2 complete (parallel with US2/US3 for lib/store/ui tasks) |
| US5 (P3) | US2 routes, US4 components | Phase 6 T092 complete                                           |

### Within Each User Story

- Constants and types before components
- Layout components before pages
- Stores before connecting to Sidebar
- Shared feedback components before page implementations (US5)
- Story checkpoint validation before next priority story

### Parallel Opportunities

**Phase 1**: T006, T007, T008, T010, T014, T015 after T001

**Phase 2**: T022–T024, T026–T027, T037–T039 in parallel; T034–T035 after T029–T028

**Phase 4 (US2)**: T049–T050, T053–T055, T057–T060 in parallel

**Phase 6 (US4)**: T077, T080–T082, T084–T086, T088–T092 in parallel after T083

**Phase 8**: T108–T113 in parallel after T107

---

## Parallel Example: User Story 4

```bash
# Launch API and store foundations together:
Task T077: "Create src/lib/axios.ts apiClient..."
Task T080: "Create src/store/auth.store.ts..."
Task T081: "Scaffold src/services/ directory..."

# Launch composite components together (after shadcn primitives T083):
Task T084: "Create src/components/common/PageHeader.tsx..."
Task T085: "Create src/components/common/PageContainer.tsx..."
Task T088: "Create src/components/feedback/EmptyState.tsx..."
Task T092: "Create src/components/feedback/PageSkeleton.tsx..."
```

---

## Parallel Example: User Story 2

```bash
# Launch route constants and lazy pages together:
Task T049: "Create src/constants/routes.ts..."
Task T057: "Create lazy src/app/pages/LoginPage.tsx..."
Task T058: "Create lazy src/app/pages/DashboardPage.tsx..."
Task T059: "Create lazy src/app/pages/NotFoundPage.tsx..."

# Launch layout chrome components together:
Task T053: "Create src/components/common/Header.tsx..."
Task T054: "Create src/components/common/Breadcrumb.tsx..."
Task T055: "Create src/components/common/Footer.tsx..."
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: `pnpm typecheck && pnpm lint && pnpm build && pnpm dev`
5. Demo: Application mounts with providers; no routes required for minimal MVP

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 → Validate bootstrap → **MVP checkpoint**
3. Add US2 → Validate routing and layouts → **Navigable shell**
4. Add US3 → Validate responsive → **Mobile-ready shell**
5. Add US4 → Validate stores and UI library → **Spec 002-ready infrastructure**
6. Add US5 → Validate errors and loading → **Production UX patterns**
7. Polish → Full quickstart validation → **Feature complete**

### Recommended Execution Order (Single Developer)

Execute phases sequentially 1 → 8. Within phases, run `[P]` tasks in parallel batches.

### Parallel Team Strategy

| Developer         | Focus                                                 |
| ----------------- | ----------------------------------------------------- |
| A                 | Phase 1–2 (Setup + Foundational)                      |
| B (after Phase 2) | US2 routing + US3 responsive (layouts, Sidebar)       |
| C (after Phase 2) | US4 axios, stores, shadcn primitives                  |
| All               | US5 pages + Phase 8 polish after US4 components merge |

---

## Task Summary

| Phase             | Story | Task Range    | Count   |
| ----------------- | ----- | ------------- | ------- |
| 1 Setup           | —     | T001–T015     | 15      |
| 2 Foundational    | —     | T016–T040     | 25      |
| 3 US1 Bootstrap   | US1   | T041–T048     | 8       |
| 4 US2 Navigation  | US2   | T049–T066     | 18      |
| 5 US3 Responsive  | US3   | T067–T076     | 10      |
| 6 US4 Foundations | US4   | T077–T095     | 19      |
| 7 US5 Errors      | US5   | T096–T105     | 10      |
| 8 Polish          | —     | T106–T116     | 11      |
| **Total**         |       | **T001–T116** | **116** |

_Note: US5 tasks are T096–T105 (10 tasks)._

---

## Notes

- Do NOT implement login logic, JWT refresh, API endpoint calls, or CRUD pages (FR-015)
- All API access in future specs goes through `src/services/*.service.ts` importing `src/lib/axios.ts`
- Use UI UX Pro Max as primary design reference for all visual decisions
- Validate each checkpoint before proceeding to the next user story
- Run `specs/001-initialize-scrappy-web/quickstart.md` as final acceptance gate
- Commit after each phase or logical task group
