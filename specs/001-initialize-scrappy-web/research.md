# Research: Initialize Scrappy

**Feature**: 001-initialize-scrappy-web
**Date**: 2026-07-07
**Status**: Complete — all technical context resolved

## R-001: React 19 + Vite Project Scaffolding

**Decision**: Use `pnpm create vite` with `react-ts` template; upgrade to React 19.

**Rationale**: Vite is the constitution-mandated build tool. Official template provides
optimal HMR and tree shaking. React 19 is required per spec and constitution. pnpm is
the project package manager for fast, disk-efficient installs and strict dependency resolution.

**Alternatives considered**:

| Alternative | Rejected because                                            |
| ----------- | ----------------------------------------------------------- |
| Next.js     | Constitution specifies Vite; SSR not required for admin SPA |
| CRA         | Deprecated; slower builds                                   |
| Remix       | Adds server framework complexity not in scope               |

---

## R-002: Tailwind CSS v4 Integration

**Decision**: Use Tailwind CSS v4 with `@tailwindcss/vite` plugin and CSS-first
configuration (`@import "tailwindcss"` in `globals.css`).

**Rationale**: Constitution mandates Tailwind v4. Vite plugin is the official integration
path for v4, eliminating PostCSS config complexity.

**Alternatives considered**:

| Alternative       | Rejected because                                      |
| ----------------- | ----------------------------------------------------- |
| Tailwind v3       | Constitution requires v4                              |
| CSS Modules       | Constitution Principle XI — Tailwind only             |
| Styled Components | Adds dependency; conflicts with utility-first mandate |

---

## R-003: shadcn/ui as Component Foundation

**Decision**: Initialize shadcn/ui with Tailwind v4-compatible CLI; components live in
`src/components/ui/`.

**Rationale**: Spec explicitly requires shadcn/ui. Aligns with constitution Principle X
(shared UI in `components/ui/`) and Principle XXIX (design system first). Components are
copy-paste owned — no black-box dependency, AI-friendly.

**Alternatives considered**:

| Alternative         | Rejected because                                          |
| ------------------- | --------------------------------------------------------- |
| MUI / Chakra        | Heavy bundle; harder to customize to SaaS aesthetic       |
| Radix only          | shadcn/ui is Radix + Tailwind styled; faster foundation   |
| Custom from scratch | Violates time-to-foundation; duplicates shadcn primitives |

---

## R-004: React Router Data Router

**Decision**: Use `createBrowserRouter` + `RouterProvider` with nested route objects and
layout routes.

**Rationale**: Constitution Principle IV mandates Data Router. Nested layouts enable
persistent sidebar (Principle V). `errorElement` and `lazy()` integrate natively.

**Alternatives considered**:

| Alternative            | Rejected because                             |
| ---------------------- | -------------------------------------------- |
| TanStack Router        | Not in constitution stack                    |
| Declarative `<Routes>` | Constitution explicitly requires Data Router |
| State-based navigation | Violates Principle IV                        |

---

## R-005: Zustand vs Redux for Client State

**Decision**: Zustand with separate stores (`auth`, `theme`, `ui`).

**Rationale**: Constitution Principle VII mandates Zustand for client state. Minimal
boilerplate, TypeScript-friendly, suitable for sidebar and theme toggles.

**Alternatives considered**:

| Alternative        | Rejected because                               |
| ------------------ | ---------------------------------------------- |
| Redux Toolkit      | Constitution mandates Zustand                  |
| React Context only | Poor performance for frequent UI state updates |
| Jotai              | Not in approved stack                          |

---

## R-006: TanStack Query Configuration

**Decision**: Default `staleTime: 5 * 60 * 1000` (5 min), `retry: 1`, devtools in dev
only via dynamic import.

**Rationale**: Admin apps benefit from cached server data. Conservative retry avoids
hammering backend. No queries defined in this phase — configuration only.

**Alternatives considered**:

| Alternative            | Rejected because                     |
| ---------------------- | ------------------------------------ |
| SWR                    | Constitution mandates TanStack Query |
| Raw useEffect fetching | Violates architecture; no caching    |

---

## R-007: Axios Client Architecture

**Decision**: Single instance in `lib/axios.ts`; all future API calls through `services/*.service.ts`.

**Rationale**: Constitution Principles I and VIII. Interceptor stubs prepare Spec 002
token attachment and 401 refresh without implementing logic now.

**Alternatives considered**:

| Alternative       | Rejected because                  |
| ----------------- | --------------------------------- |
| fetch API         | Constitution mandates Axios       |
| Axios per service | Loses shared interceptor behavior |

---

## R-008: Theme Implementation

**Decision**: CSS class strategy (`dark` on `<html>`) with Zustand `theme.store` +
`localStorage` persistence. Support `light`, `dark`, `system` modes.

**Rationale**: shadcn/ui default pattern. System mode uses `matchMedia('(prefers-color-scheme)')`.
Inline script in `index.html` prevents flash of wrong theme.

**Alternatives considered**:

| Alternative                       | Rejected because                            |
| --------------------------------- | ------------------------------------------- |
| CSS `prefers-color-scheme` only   | Cannot support explicit light/dark override |
| Theme context without persistence | Poor UX on reload                           |

---

## R-009: Responsive Sidebar Pattern

**Decision**: Three behaviors driven by `useMediaQuery` + `ui.store`:

| Breakpoint          | Behavior                                  |
| ------------------- | ----------------------------------------- |
| ≥ 1280px (desktop)  | Permanent sidebar                         |
| 768–1279px (tablet) | Collapsible sidebar (icon-only collapsed) |
| < 768px (mobile)    | Sheet/drawer overlay                      |

**Rationale**: Matches constitution Principle XXVII and spec acceptance scenarios. shadcn
Sheet component provides accessible drawer with focus trap.

**Alternatives considered**:

| Alternative                    | Rejected because                               |
| ------------------------------ | ---------------------------------------------- |
| Single hamburger for all sizes | Violates desktop permanent sidebar requirement |
| Separate mobile app            | Out of scope; responsive web required          |

---

## R-010: Animation Library

**Decision**: Use `motion` package (Framer Motion successor) with 150–250ms transition
presets for drawer, modal, and page transitions.

**Rationale**: Spec requires Motion. Constitution Principle XXXV caps animation duration.
Motion integrates with React and respects `prefers-reduced-motion`.

**Alternatives considered**:

| Alternative          | Rejected because             |
| -------------------- | ---------------------------- |
| CSS transitions only | Spec explicitly lists Motion |
| react-spring         | Not in spec stack            |

---

## R-011: UI UX Pro Max Design Reference

**Decision**: Apply UI UX Pro Max recommendations for spacing (4/8px grid), typography
scale, neutral color palette with single accent, soft shadows (`shadow-sm`/`shadow-md`),
and `rounded-lg`/`rounded-xl` radius.

**Rationale**: User planning requirements mandate UI UX Pro Max as primary design reference.
Aligns with constitution Principles XXX (SaaS design language) and XXVIII (AI-generated UI).

**Alternatives considered**:

| Alternative                     | Rejected because                      |
| ------------------------------- | ------------------------------------- |
| Default shadcn theme unmodified | User requires UI UX Pro Max alignment |
| Custom design from scratch      | Slower; risks inconsistency           |

---

## R-012: Route Guard Foundation

**Decision**: `AuthGuard` component renders `<Outlet />` unconditionally in this phase.
File and router wiring exist; logic added in Spec 002.

**Rationale**: FR-015 prohibits authentication logic. Structural stub ensures Spec 002
does not require router refactoring.

**Alternatives considered**:

| Alternative             | Rejected because                       |
| ----------------------- | -------------------------------------- |
| No guard until Spec 002 | Would require router restructure later |
| Full JWT guard now      | Violates spec scope                    |

---

## R-013: Environment Configuration

**Decision**: `VITE_API_BASE_URL` in `.env.example` defaulting to `http://localhost:3000/api`.

**Rationale**: Vite exposes only `VITE_` prefixed vars to client. Placeholder URL ready
for Spec 002 without hardcoding in source.

**Alternatives considered**:

| Alternative         | Rejected because                   |
| ------------------- | ---------------------------------- |
| Hardcoded base URL  | Not environment-portable           |
| Runtime config JSON | Over-engineering for current phase |

---

## R-014: Package Manager (pnpm)

**Decision**: Use pnpm 9+ as the sole package manager. Pin version via `packageManager`
field in `package.json`. Commit `pnpm-lock.yaml`.

**Rationale**: Team standard; faster installs and strict `node_modules` layout. Avoids
lockfile conflicts from mixed npm/yarn usage.

**Alternatives considered**:

| Alternative | Rejected because                                  |
| ----------- | ------------------------------------------------- |
| npm         | Not team standard; user specified pnpm            |
| yarn        | Not team standard; mixed lockfiles cause CI drift |
| bun         | Not in constitution or spec stack                 |
