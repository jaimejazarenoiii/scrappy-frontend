# Implementation Prompt: Initialize Scrappy Web (Specification 001)

**Branch**: `001-initialize-scrappy-web` | **Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

This prompt governs the AI implementation of Specification 001. It is authoritative for
what the AI may and may not build during the project initialization phase.

---

## Objective

Implement **only** the Scrappy Web frontend foundation. The result must be a
production-ready application shell that is immediately ready to begin **Specification 002
— Company & Identity Foundation (Backend P001)** without any architectural refactoring.

The application shell MUST be generic and extensible. Do **not** introduce placeholder
implementations for future business modules.

---

## Scope — Build ONLY the Foundation

Produce all of the following:

- **Production-ready architecture** — feature-based folder structure per the constitution
- **Responsive layouts** — `AuthLayout` and `DashboardLayout` (sidebar, header,
  breadcrumb placeholder, main content, footer placeholder)
- **Shared UI components** — reusable primitives in `components/ui/` and composite
  helpers (PageHeader, PageContainer, EmptyState, ErrorState, Skeletons, DataTable
  foundation)
- **Routing foundation** — `createBrowserRouter` with `/`, `/login`, `/dashboard`,
  `/coming-soon`, and a catch-all 404; lazy-loaded routes; nested layouts;
  `AuthGuard` passthrough stub
- **Theme support** — light, dark, and system themes with a theme provider and store
- **API infrastructure** — `lib/axios.ts` with request/response interceptor stubs,
  base URL from env, timeout, centralized error normalization; `services/` scaffolded
- **State management** — Zustand stores (`auth.store`, `theme.store`, `ui.store`) as
  structure/stubs only; TanStack Query client + provider (+ devtools in development)
- **Error handling** — global error boundary, error fallback, 404 page
- **Loading infrastructure** — skeleton components, loading overlay, page loading
  placeholder
- **Development tooling** — ESLint, Prettier, Husky, lint-staged, `@/` path aliases,
  TypeScript strict mode

---

## Explicitly OUT OF SCOPE — Do NOT Build

- Login/authentication logic (only the `/login` shell page and structural stubs)
- CRUD pages of any kind
- Dashboards with real KPIs, charts, or live data (dashboard is a placeholder only)
- API endpoint calls or backend integration
- Any business module UI or logic — including Company & Identity, Organization
  Management, Workforce, Transactions, Settlements, Trips, Expenses, Analytics,
  Reports, Activity Logs (these belong to Specifications 002–011)
- Deprecated generic junkshop modules (Suppliers, Customers, Inventory, Materials,
  Categories, Pricing, Sales, Purchases) — these are NOT in scope for any specification

Navigation may show disabled / "coming soon" placeholders, but they MUST NOT link to
implemented business pages.

---

## Identity Readiness (Structure Only)

Prepare the shell so Specification 002 can add Company, Authentication, Authorization,
Users, Employees, and Tenant Isolation without restructuring:

- `auth.store` exposes token fields and stub actions (tenant-isolation ready)
- Axios request interceptor stub attaches a Bearer token when present
- Axios response interceptor stub is ready for a 401 refresh flow
- `services/` is scaffolded so `auth.service.ts`, `company.service.ts`, and
  `user.service.ts` can be added by dropping in files
- `AuthGuard` renders `<Outlet />` now; guard logic is added in Specification 002
- Data-driven navigation config can receive Company & Identity sections

Do not implement any of this behavior now — only the structure.

---

## UI Requirement — UI UX Pro Max

All interfaces, layouts, reusable components, interactions, spacing, typography,
responsiveness, animations, and design decisions MUST follow the **UI UX Pro Max**
design system and best practices.

- Resemble modern enterprise SaaS products: Linear, Vercel, GitHub, Stripe, Notion,
  and Claude
- Fully responsive across Mobile, Tablet, Laptop, Desktop, and Large Desktop
- Accessible (WCAG-friendly, keyboard navigable, focus management)
- Light and dark mode compatible
- Subtle, purposeful animations (typically 150–250ms)
- Consistent and production-ready throughout

---

## Constraints

- **Package manager**: pnpm only. Use `pnpm install` and `pnpm <script>`. Commit
  `pnpm-lock.yaml`; never commit `package-lock.json` or `yarn.lock`.
- Follow every applicable principle in the Scrappy Web Constitution.
- No `any`; TypeScript strict mode; runtime validation via Zod where forms exist.

---

## Definition of Done

- `pnpm build`, `pnpm typecheck` (or `tsc --noEmit`), and `pnpm lint` all pass with
  zero errors.
- All initial routes are reachable, bookmarkable, and support browser back/forward.
- Dashboard layout renders correctly at 320px, 768px, and 1280px+ with no horizontal
  overflow.
- Theme switches correctly between light, dark, and system.
- The Specification 002 Readiness Checklist in [plan.md](./plan.md) is fully satisfied.
- No business functionality exists anywhere in the codebase.
