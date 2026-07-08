# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript (Strict Mode) on React 19+ with Vite

**Primary Dependencies**: React Router (Data Router), TanStack Query, Axios, Zustand, React Hook Form, Zod, Tailwind CSS v4, Lucide React

**Storage**: N/A (frontend only; all persistence via Scrappy Backend REST API)

**Testing**: Unit and integration tests; E2E tests when explicitly scoped

**Target Platform**: Modern browsers (mobile-first responsive web: 320px–1536px+)

**Project Type**: Administrative web application (Scrappy frontend)

**Performance Goals**: Lazy-loaded routes, route-based code splitting, responsive interactions on admin workflows

**Constraints**: No direct database access; no Axios in components; no server state in Zustand; no `any` types

**Scale/Scope**: Enterprise junkshop management modules (junkshops, suppliers, inventory, users, reports, etc.)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Verify compliance with `.specify/memory/constitution.md` before proceeding:

- [ ] **API First (I, VIII)**: All data access via `services/`; no Axios in components; no direct DB access
- [ ] **Type Safety (II, IX)**: Strict TypeScript; Zod schemas for runtime validation; no `any`
- [ ] **Feature Architecture (III, XVII, XVIII)**: Work lives under `src/features/` with correct naming and `@/` imports
- [ ] **Routing (IV, V)**: Every major screen has a URL; uses `createBrowserRouter` with nested layouts
- [ ] **State (VII)**: TanStack Query for server state; Zustand for client-only state only
- [ ] **UI & Styling (VI, X, XI, XII, XXIX–XXXIV, XXXIX)**: Reuse `components/ui/`; Tailwind only; skeleton loading; meaningful empty states; visual consistency
- [ ] **Auth & Security (XIV, XX)**: JWT flow with protected routes; no secrets; sanitized input
- [ ] **Accessibility (XV, XL)**: Semantic HTML, labels, keyboard navigation, dialog focus trapping, 44×44px touch targets
- [ ] **Responsive Design (XXVII, XXXI)**: Mobile-first layouts; responsive Tailwind utilities; verified on mobile, tablet, desktop
- [ ] **Page & Table Standards (XXXII, XXXVI)**: Standard page header/content structure; shared data table for CRUD modules
- [ ] **Forms & Dashboards (XXXVII, XXXVIII)**: React Hook Form + Zod with inline validation; dashboard KPIs above the fold
- [ ] **AI UI Standards (XXVIII, XL)**: No duplicate components; no unapproved dependencies; production quality checklist complete
- [ ] **Performance (XVI, XXXV)**: Lazy routes, code splitting; animations 150–250ms; no excessive motion
- [ ] **API Contract (XXVI)**: OpenAPI types/clients used when available; no manual model duplication
- [ ] **Documentation (XXII)**: Spec includes purpose, requirements, acceptance criteria, API deps, UI states, validation, errors

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/
├── app/
├── assets/
├── components/
│   └── ui/
├── features/
│   └── [feature-name]/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       ├── validation/
│       └── types/
├── hooks/
├── layouts/
├── lib/
├── routes/
├── services/
├── store/
├── styles/
├── types/
├── utils/
└── main.tsx

tests/
├── integration/
└── unit/
```

**Structure Decision**: Feature-based Scrappy layout per constitution Principle
III. Each feature owns its pages, components, hooks, services, validation, and types.
Shared UI primitives live in `components/ui/`; cross-cutting API clients in
`services/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
