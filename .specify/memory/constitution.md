<!--
Sync Impact Report
==================
Version change: 1.2.0 → 2.0.0
Modified principles:
  - IV. URL-Based Routing — route map now mirrors the approved backend roadmap
  - VIII. API Layer — example services aligned to roadmap modules
  - XXIII. Future Scalability — module list replaced with approved roadmap modules
  - XXXIV. Empty States — example updated to a roadmap-aligned module
Added sections:
  - Frontend Roadmap (maps frontend specs to backend modules)
Removed sections:
  - References to deprecated generic junkshop modules (Suppliers, Customers,
    Inventory, Materials, Categories, Pricing, Sales, Purchases)
Templates:
  - .specify/templates/plan-template.md ✅ consistent
  - .specify/templates/spec-template.md ✅ consistent
  - .specify/templates/tasks-template.md ✅ consistent
  - .specify/templates/checklist-template.md — no changes required
Rationale for MAJOR bump: Backward-incompatible redefinition of the product module
scope (roadmap) that governs all future specifications.
Follow-up TODOs: None
-->

# Scrappy Web Constitution

## Purpose

Scrappy Web is the administrative web application for the Scrappy Junkshop Management
System.

The application communicates exclusively with the Scrappy Backend through REST APIs.
The frontend MUST remain completely independent from the backend to support future
mobile applications, third-party integrations, and multiple deployment targets.

## Frontend Roadmap

The frontend delivery roadmap is authoritative. Specification 001 is the dedicated
project initialization phase. Every specification after 001 MUST mirror the approved
Scrappy Backend module roadmap. Frontend specification numbering is independent from
the backend but maps directly to backend modules beginning with Specification 002.

| Frontend Spec | Title                               | Backend Module          |
| ------------- | ----------------------------------- | ----------------------- |
| 001           | Project Setup (Frontend Foundation) | — (initialization only) |
| 002           | Company & Identity Foundation       | Backend P001            |
| 003           | Organization Management             | Backend P002            |
| 004           | Workforce Management                | Backend P003            |
| 005           | Transaction Management Foundation   | Backend P004            |
| 006           | Transaction Settlement Workflow     | Backend P005            |
| 007           | Trip Management                     | Backend P006            |
| 008           | Expense Management                  | Backend P007            |
| 009           | Analytics                           | Backend P008            |
| 010           | Reports                             | Backend P009            |
| 011           | Activity Logs                       | Backend P010            |

Rules:

- Specification 001 MUST NOT implement business functionality; it establishes the
  foundation only.
- All specifications after 001 MUST correspond to an approved backend module in this
  roadmap. New product modules MUST NOT be introduced outside this roadmap without a
  constitution amendment.
- Deprecated generic junkshop modules (Suppliers, Customers, Inventory, Materials,
  Categories, Pricing, Sales, Purchases) are NOT part of the approved scope and MUST
  NOT appear in specifications, routes, services, or UI.

## Technology Stack

### Core

- React 19+
- TypeScript (Strict Mode)
- Vite
- Tailwind CSS v4

### Routing

- React Router (Data Router using `createBrowserRouter`)

### Data Fetching

- TanStack Query

### HTTP Client

- Axios

### Global State

- Zustand

### Forms

- React Hook Form
- Zod

### Icons

- Lucide React

### Code Quality

- ESLint
- Prettier
- Husky
- lint-staged

## Core Principles

### I. API First

The frontend MUST never communicate directly with the database.

All communication MUST occur through the Scrappy Backend REST API.

Components MUST never call Axios directly. All requests MUST pass through centralized
service classes.

**Rationale**: Backend independence enables multiple clients, consistent business
rules, and a single source of truth for data access.

### II. Strict Type Safety

TypeScript Strict Mode is mandatory.

Rules:

- MUST NOT use `any`
- MUST prefer interfaces and reusable types
- Runtime validation MUST use Zod
- Shared types MUST be centralized

**Rationale**: Compile-time and runtime type safety prevent integration defects and
reduce refactoring risk.

### III. Feature-Based Architecture

The project MUST be organized by feature instead of file type.

```text
src/
├── app/
├── assets/
├── components/
│   └── ui/
├── features/
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
```

Every feature MUST own its own pages, components, hooks, services, validation, and
types.

**Rationale**: Feature boundaries improve discoverability, ownership, and parallel
development.

### IV. URL-Based Routing

Every major screen MUST have its own URL.

The application MUST use React Router's Data Router (`createBrowserRouter`).

Example route map:

```text
/
├── login
├── dashboard
├── company
├── organizations
├── workforce
├── transactions
├── transactions/settlements
├── trips
├── expenses
├── analytics
├── reports
├── activity-logs
├── users
├── roles
├── settings
└── profile
```

Rules:

- Browser Back and Forward buttons MUST always work
- Pages MUST be bookmarkable and shareable
- Deep linking is required
- Nested layouts MUST be used
- MUST NOT implement navigation using component state alone

**Rationale**: URL-based navigation supports usability, testing, and shareable
application state.

### V. Layout Architecture

Layouts MUST separate application sections:

```text
AuthLayout

DashboardLayout
    Sidebar
    Header
    Breadcrumbs
    Page Content
```

Only page content MUST change during navigation.

**Rationale**: Consistent chrome reduces layout duplication and improves perceived
performance.

### VI. Component Philosophy

Components MUST be small, reusable, stateless, and composable.

Business logic MUST live in hooks and services. Components are responsible only for
rendering UI.

**Rationale**: Separation of concerns keeps UI testable and logic reusable.

### VII. State Management

**TanStack Query** — use for API requests, server cache, pagination, infinite
scrolling, mutations, and optimistic updates.

**Zustand** — use only for client state (authentication, sidebar, theme, user
preferences, temporary UI state).

MUST NOT duplicate server state inside Zustand.

**Rationale**: A single server-state cache avoids stale data and synchronization bugs.

### VIII. API Layer

All API communication MUST live inside `services/`.

Example:

```text
services/
├── api.ts
├── auth.service.ts
├── user.service.ts
└── company.service.ts
```

MUST NOT call Axios inside components. Use `UserService.getUsers()`, not
`axios.get(...)`.

**Rationale**: Centralized services enable interceptors, error handling, and
consistent API contracts.

### IX. Forms

All forms MUST use React Hook Form with Zod validation.

MUST NOT manually validate forms.

**Rationale**: Declarative validation reduces bugs and keeps schemas reusable.

### X. UI Components

Reusable UI components MUST live in `components/ui/` (Button, Input, Card, Modal,
Dialog, Badge, Table, Pagination, Select, Drawer, Skeleton, Spinner).

Feature-specific components MUST remain inside their feature.

**Rationale**: A shared UI kit enforces design consistency and speeds feature work.

### XI. Styling

Tailwind CSS is the primary styling solution.

Rules:

- MUST NOT use inline styles
- MUST NOT add additional CSS frameworks
- MUST prefer utility classes
- MUST build reusable UI primitives
- MUST maintain consistent spacing and typography

**Rationale**: Utility-first styling keeps the design system consistent and
maintainable.

### XII. Loading States

Every page MUST support loading, empty, success, and error states.

Skeleton loaders are preferred. MUST NOT display blank screens.

**Rationale**: Explicit UI states improve perceived reliability and user trust.

### XIII. Error Handling

API failures MUST be handled gracefully with friendly messages.

Unexpected errors MUST be logged centrally. MUST NOT expose backend exception messages
to users.

**Rationale**: User-facing errors must be safe and actionable; internals stay opaque.

### XIV. Authentication

JWT authentication is required with access token, refresh token, automatic token
refresh, protected routes, and automatic logout for invalid sessions.

**Rationale**: Secure session management protects administrative data and operations.

### XV. Accessibility

MUST use semantic HTML. Every input MUST have a label. Keyboard navigation MUST work.
Buttons MUST be accessible. Dialogs MUST support focus trapping.

**Rationale**: Accessibility is a non-negotiable quality requirement for enterprise
software.

### XVI. Performance

Requirements:

- Lazy-loaded pages
- Route-based code splitting
- Memoize expensive computations
- Avoid unnecessary re-renders
- Optimize images
- Virtualize large tables when needed

**Rationale**: Administrative apps must remain responsive at scale.

### XVII. File Naming

| Artifact   | Convention              | Example             |
| ---------- | ----------------------- | ------------------- |
| Components | PascalCase              | `UserTable.tsx`     |
| Hooks      | camelCase with `use`    | `useUsers.ts`       |
| Services   | kebab with `.service`   | `user.service.ts`   |
| Validation | kebab with `.schema`    | `user.schema.ts`    |
| Types      | kebab with `.types`     | `user.types.ts`     |
| Constants  | kebab with `.constants` | `user.constants.ts` |

**Rationale**: Predictable naming accelerates navigation for humans and AI assistants.

### XVIII. Import Rules

MUST use path aliases (e.g., `@/components/ui/Button`). MUST avoid deep relative
imports.

**Rationale**: Aliases reduce brittle import paths during refactors.

### XIX. Testing Readiness

Architecture MUST support unit testing, integration testing, and future end-to-end
testing. Business logic MUST remain isolated and testable.

**Rationale**: Testable boundaries reduce regression cost as the application grows.

### XX. Security

MUST NOT store secrets in the frontend. MUST NOT trust frontend validation alone.
MUST sanitize user input. MUST use HTTPS APIs. MUST store authentication tokens
securely.

**Rationale**: The client is an untrusted environment; defense in depth is mandatory.

### XXI. Design Philosophy

The application MUST feel like a modern enterprise SaaS platform: clean, professional,
fast, responsive, consistent, minimal, and mobile-friendly.

**Rationale**: Administrative tools must inspire confidence and efficiency.

### XXII. Documentation

Every feature specification MUST include:

- Purpose
- Requirements
- Acceptance Criteria
- API Dependencies
- UI States
- Validation Rules
- Error Scenarios

**Rationale**: Complete specs reduce ambiguity before implementation begins.

### XXIII. Future Scalability

The architecture MUST support the approved roadmap modules without restructuring
(Company & Identity, Organization Management, Workforce Management, Transaction
Management, Transaction Settlement, Trip Management, Expense Management, Analytics,
Reports, Activity Logs) plus cross-cutting sections (Dashboard, Users, Roles,
Permissions, Settings, Profile). See the Frontend Roadmap section for the authoritative
specification-to-module mapping.

**Rationale**: Modular growth aligned to the backend roadmap avoids costly rewrites and
keeps frontend and backend scope synchronized.

### XXIV. AI-Friendly Codebase

The codebase MUST be optimized for AI-assisted development:

- Clear feature boundaries
- Explicit naming
- Predictable folder structure
- Small files
- Readable code
- Minimal abstraction
- Consistent conventions

**Rationale**: Structured conventions improve velocity for both human and AI
contributors.

### XXV. Code Standards

- DRY (Don't Repeat Yourself)
- SOLID where appropriate
- Composition over inheritance
- Avoid prop drilling
- Keep functions small and focused
- Prefer custom hooks over duplicated logic
- Keep pages thin by delegating business logic to hooks and services

**Rationale**: Disciplined code quality sustains long-term maintainability.

### XXVI. API Contract

The frontend SHOULD consume the backend's OpenAPI (Swagger) specification whenever
available. Generate API types and clients from the OpenAPI contract to keep request
and response models synchronized with the backend. MUST avoid manually duplicating
backend models.

**Rationale**: Contract-driven types prevent drift between frontend and backend.

### XXVII. Responsive-First Design

Scrappy Web MUST be fully responsive and provide an excellent user experience across
desktop, tablet, and mobile devices.

**Supported breakpoints**:

- Mobile (320px+)
- Tablet (768px+)
- Laptop (1024px+)
- Desktop (1280px+)
- Large Desktop (1536px+)

**Layout principles**:

- Mobile-first development is required
- Every page MUST adapt gracefully to different screen sizes
- MUST avoid horizontal scrolling unless displaying large data tables
- MUST maintain consistent spacing and alignment across all breakpoints

**Navigation**:

| Viewport | Requirements                                              |
| -------- | --------------------------------------------------------- |
| Desktop  | Permanent sidebar; top navigation bar                     |
| Tablet   | Collapsible sidebar; responsive header                    |
| Mobile   | Drawer navigation; sticky header; touch-friendly controls |

**Tables**:

Large datasets MUST remain usable on smaller screens using one or more of:

- Horizontal scrolling
- Responsive column visibility
- Card-based layouts
- Expandable rows
- Mobile-optimized detail views

Tables MUST NOT overflow or break the layout.

**Forms**:

- MUST stack fields vertically on smaller screens
- MUST use responsive grids on larger screens
- MUST provide touch-friendly input sizes
- MUST keep labels and validation messages readable

**Cards and grids**:

MUST use responsive grid layouts (e.g., mobile: 1 column; tablet: 2 columns; desktop:
3–4 columns; large desktop: auto-fit based on available space).

**Modals and drawers**:

- Desktop: centered dialogs
- Mobile: bottom sheets or full-screen dialogs where appropriate

**Typography**:

Typography MUST scale appropriately across breakpoints while maintaining readability
and visual hierarchy.

**Images and media**:

- Images MUST scale responsively
- MUST use optimized assets
- MUST prevent layout shifts

**Accessibility**:

Touch targets SHOULD be at least 44×44 pixels. Interactive elements MUST remain
accessible across all device sizes.

**Performance**:

MUST avoid rendering unnecessary desktop-only components on mobile devices.
MUST lazy-load heavy modules and media when appropriate.

**Quality requirement**:

Every feature MUST be tested and verified on mobile, tablet, and desktop. No feature
is considered complete until it functions correctly and provides a polished experience
on all supported screen sizes.

**Rationale**: Administrative workflows are used in the field and at the desk;
responsive design is a core product requirement, not an enhancement.

### XXVIII. AI-Generated UI Standards

The project is designed to leverage AI-assisted UI generation tools (e.g., UI UX Pro
Max, Claude, Cursor, Copilot) while maintaining a consistent, production-quality
design system.

AI-generated code MUST conform to this constitution before being accepted.

Requirements:

- MUST maintain the existing project architecture
- MUST follow the feature-based folder structure
- MUST reuse shared UI components whenever possible
- MUST NOT introduce duplicate component implementations
- MUST NOT add unnecessary dependencies without approval
- Generated components MUST be responsive, accessible, and type-safe
- MUST favor readability over clever abstractions

**Rationale**: AI accelerates delivery only when output adheres to established
architecture and design system constraints.

### XXIX. Design System First

Before creating new UI components, MUST check whether an existing component can be
reused.

Preferred hierarchy:

1. `components/ui`
2. Shared feature components
3. Create a new reusable component
4. Create a feature-specific component only when necessary

MUST NOT duplicate buttons, dialogs, cards, or form controls.

**Rationale**: A single design system prevents visual drift and reduces maintenance.

### XXX. Enterprise SaaS Design Language

The interface MUST resemble modern SaaS platforms such as Linear, Vercel, GitHub,
Notion, and Stripe.

Characteristics:

- Clean, spacious, minimal, and professional
- High information density without clutter
- Soft shadows and rounded corners
- Consistent spacing and clear typography
- Excellent visual hierarchy

MUST avoid outdated enterprise styles.

**Rationale**: A modern visual language builds user trust and improves task efficiency.
(See also Principle XXI.)

### XXXI. Responsive-First Development

Every generated page MUST be fully responsive. MUST design for mobile, tablet, laptop,
desktop, and large desktop. MUST NOT create desktop-only layouts.

MUST use responsive Tailwind utilities throughout the application.

(See Principle XXVII for breakpoints, navigation patterns, and responsive table/form
requirements.)

**Rationale**: AI-generated layouts often default to desktop; explicit responsive
requirements prevent incomplete implementations.

### XXXII. Standard Page Layout

Every page MUST follow a consistent structure:

**Page Header**

- Title
- Description
- Breadcrumbs
- Primary actions

**Content**

- Search
- Filters
- Statistics (when applicable)
- Main content
- Pagination

This structure MUST remain consistent across all modules.

**Rationale**: Predictable page anatomy reduces cognitive load across modules.

### XXXIII. Modern Loading Experience

MUST NOT display blank pages while data loads.

Preferred loading states:

- Skeleton loaders
- Placeholder cards
- Placeholder tables
- Progressive rendering

MUST avoid global spinners unless absolutely necessary.

(See also Principle XII.)

**Rationale**: Skeleton loaders preserve layout stability and improve perceived
performance.

### XXXIV. Empty States

Every feature MUST include meaningful empty states.

Each empty state MUST contain:

- Illustration or icon
- Clear explanation
- Primary action
- Helpful guidance

Example: "No organizations found" with "Create your first organization to begin
managing your company structure."

**Rationale**: Empty states guide users toward their first successful action.

### XXXV. Animation Guidelines

Animations MUST enhance usability, not distract.

Preferred interactions:

- Fade, slide, and scale
- Hover and button press feedback
- Drawer and modal transitions

Animations SHOULD generally complete within 150–250ms. MUST avoid excessive motion.

**Rationale**: Subtle motion provides feedback without slowing power users.

### XXXVI. Data Table Standards

All CRUD modules SHOULD use a standardized data table supporting:

- Sorting, searching, filtering, and pagination
- Row selection and bulk actions
- Column visibility
- Sticky headers
- Responsive behavior (per Principle XXVII)

MUST NOT create custom tables unless a unique use case requires it.

**Rationale**: Consistent table behavior across modules reduces learning curve and
bugs.

### XXXVII. Form Standards

All forms MUST:

- Use React Hook Form with Zod validation (see Principle IX)
- Display inline validation
- Show loading states during submission
- Disable submission while processing
- Highlight invalid fields
- Automatically focus the first validation error

**Rationale**: Consistent form UX reduces submission errors and support burden.

### XXXVIII. Dashboard Standards

Dashboards MUST include:

- KPI cards
- Recent activity
- Charts
- Quick actions
- Notifications
- Status indicators

MUST avoid empty whitespace. MUST present important information above the fold.

**Rationale**: Dashboards must surface actionable information immediately.

### XXXIX. Visual Consistency

MUST maintain consistent usage of:

- Border radius, shadows, colors, and typography
- Button styles, icons, and form controls
- Cards, dialogs, tables, and spacing

The application MUST appear as a single cohesive product.

**Rationale**: Visual consistency signals product maturity and quality.

### XL. Production Quality Requirement

Every generated UI MUST satisfy the following checklist before completion:

- Responsive
- Accessible
- Type-safe
- Reusable
- Dark mode compatible
- Loading state implemented
- Error state implemented
- Empty state implemented
- Mobile-friendly
- Keyboard accessible
- Production-ready

**Rationale**: AI-generated UI requires explicit quality gates before merge.

## Constitution Goal

Every feature added to Scrappy Web MUST be maintainable, scalable, type-safe,
accessible, responsive, reusable, testable, performant, and production-ready while
following modern React, TypeScript, and enterprise frontend best practices.

The architecture MUST enable rapid feature development while remaining easy to
understand for both human developers and AI coding assistants.

## Governance

This constitution supersedes ad-hoc conventions for Scrappy Web development.

**Amendment procedure**:

1. Propose changes with rationale and version bump type (MAJOR / MINOR / PATCH)
2. Update `.specify/memory/constitution.md` and propagate to dependent templates
3. Record changes in the Sync Impact Report HTML comment at the top of this file

**Versioning policy**:

- MAJOR: Backward-incompatible governance or principle removals/redefinitions
- MINOR: New principles/sections or materially expanded guidance
- PATCH: Clarifications, wording, typo fixes, non-semantic refinements

**Compliance review**:

- All feature plans MUST pass the Constitution Check gate in `plan-template.md`
- All pull requests MUST verify compliance with applicable principles
- Complexity violations MUST be documented in the plan's Complexity Tracking table
- Feature specs MUST satisfy Principle XXII documentation requirements
- AI-generated and hand-written UI MUST satisfy Principle XL production quality checklist
- Every specification after 001 MUST map to an approved module in the Frontend Roadmap;
  specifications that introduce modules outside the roadmap MUST NOT be accepted

**Version**: 2.0.0 | **Ratified**: 2026-07-07 | **Last Amended**: 2026-07-07
