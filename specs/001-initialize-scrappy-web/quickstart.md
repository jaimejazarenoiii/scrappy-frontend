# Quickstart: Initialize Scrappy Web

**Feature**: 001-initialize-scrappy-web
**Date**: 2026-07-07

Validation guide to confirm the foundation is production-ready. Run after all
implementation phases complete.

---

## Prerequisites

- Node.js 20+ (LTS recommended)
- pnpm 9+ (project package manager — do not use npm or yarn)
- Modern browser (Chrome, Firefox, Safari, Edge)

**Enable pnpm** (if needed): `corepack enable && corepack prepare pnpm@latest --activate`

---

## Setup

```bash
# Clone and enter repository
cd scrappy-frontend

# Install dependencies
pnpm install

# Copy environment config
cp .env.example .env

# Start development server
pnpm dev
```

**Expected**: Dev server starts (default `http://localhost:5173`). No console errors.

---

## Build Validation

```bash
pnpm typecheck   # or: pnpm exec tsc --noEmit
pnpm lint
pnpm build
pnpm preview
```

| Command     | Expected Outcome                                   |
| ----------- | -------------------------------------------------- |
| `typecheck` | Zero TypeScript errors                             |
| `lint`      | Zero ESLint errors                                 |
| `build`     | Build succeeds; `dist/` created                    |
| `preview`   | Production build serves on `http://localhost:4173` |

---

## Route Validation

With dev or preview server running, verify each route:

| #   | Action                           | Expected Result                                                                    |
| --- | -------------------------------- | ---------------------------------------------------------------------------------- |
| 1   | Navigate to `/`                  | Redirects to `/dashboard`                                                          |
| 2   | Navigate to `/dashboard`         | Dashboard layout with sidebar, header, breadcrumb placeholder, welcome empty state |
| 3   | Navigate to `/login`             | Auth layout; centered card shell; no sidebar                                       |
| 4   | Navigate to `/nonexistent-page`  | 404 page with link back to dashboard                                               |
| 5   | Click browser Back               | Returns to previous page correctly                                                 |
| 6   | Click browser Forward            | Advances correctly                                                                 |
| 7   | Bookmark `/dashboard` and reload | Page loads directly                                                                |

---

## Responsive Validation

Use browser DevTools device emulation:

| Viewport      | Width  | Sidebar                        | Header                    |
| ------------- | ------ | ------------------------------ | ------------------------- |
| Mobile        | 320px  | Hidden; open via menu → drawer | Sticky; hamburger visible |
| Mobile        | 375px  | Drawer navigation works        | Touch targets ≥ 44px      |
| Tablet        | 768px  | Collapsible sidebar            | Responsive header         |
| Laptop        | 1024px | Sidebar visible                | Full header               |
| Desktop       | 1280px | Permanent sidebar (256px)      | Full header + breadcrumbs |
| Large Desktop | 1536px | Permanent sidebar              | No horizontal overflow    |

**Pass criteria**: No horizontal scrollbar on any page (except intentional table scroll in
future specs). All navigation reachable on mobile.

---

## Theme Validation

| #   | Action                                     | Expected Result                                      |
| --- | ------------------------------------------ | ---------------------------------------------------- |
| 1   | Set theme to Light (via dev test or store) | Light background, dark text                          |
| 2   | Set theme to Dark                          | Dark background, light text; all components readable |
| 3   | Set theme to System                        | Matches OS preference                                |
| 4   | Change OS theme while in System mode       | App updates without reload                           |
| 5   | Reload page                                | Theme preference persists                            |

---

## Provider Validation

| #   | Check                                | Expected Result                   |
| --- | ------------------------------------ | --------------------------------- |
| 1   | Open React Query Devtools (dev mode) | Devtools panel visible            |
| 2   | Build production (`pnpm build`)      | No devtools in bundle             |
| 3   | Trigger test toast                   | Sonner toast appears, theme-aware |
| 4   | Inspect Network tab on load          | No API requests made              |

---

## Error Handling Validation

| #   | Action                                            | Expected Result                                     |
| --- | ------------------------------------------------- | --------------------------------------------------- |
| 1   | Visit unknown URL                                 | Friendly 404 page; no blank screen                  |
| 2   | Trigger component error (dev test route or throw) | ErrorFallback renders; no stack trace shown to user |
| 3   | Navigate between lazy routes                      | PageSkeleton shown during load; no blank flash      |

---

## Accessibility Validation

| #   | Check                                 | Expected Result                         |
| --- | ------------------------------------- | --------------------------------------- |
| 1   | Tab through dashboard                 | Logical focus order; visible focus ring |
| 2   | Open mobile drawer                    | Focus trapped inside drawer             |
| 3   | Close drawer with Escape              | Drawer closes; focus returns to trigger |
| 4   | Inspect form controls (Input, Select) | Associated labels present               |
| 5   | Verify dialog (if testable)           | Focus trap; Escape closes               |

---

## Shared Components Validation

Confirm these import paths resolve and render:

```text
@/components/ui/button
@/components/ui/card
@/components/ui/input
@/components/common/PageHeader
@/components/common/PageContainer
@/components/feedback/EmptyState
@/components/feedback/ErrorFallback
@/components/feedback/PageSkeleton
```

Dashboard placeholder MUST use `PageHeader` + `EmptyState`.

---

## Code Quality Validation

| #   | Check                                    | Expected Result                       |
| --- | ---------------------------------------- | ------------------------------------- |
| 1   | `grep -r "axios" src/features src/pages` | No direct axios imports in components |
| 2   | `grep -r ": any" src/`                   | No `any` types                        |
| 3   | Make a test commit with lint error       | Husky blocks commit                   |
| 4   | Make a test commit with format issue     | lint-staged auto-fixes                |

---

## Production Quality Checklist (Principle XL)

- [ ] Responsive — all breakpoints verified
- [ ] Accessible — keyboard and focus checks pass
- [ ] Type-safe — `tsc --noEmit` passes
- [ ] Reusable — components in `components/ui/` and `common/`
- [ ] Dark mode compatible — theme validation passes
- [ ] Loading states — skeleton on lazy routes
- [ ] Error states — ErrorFallback and 404 work
- [ ] Empty states — dashboard welcome state visible
- [ ] Mobile-friendly — drawer navigation works
- [ ] Keyboard accessible — tab order verified
- [ ] Production-ready — build + lint + typecheck pass

---

## Specification 002 Readiness

Confirm these exist before starting Specification 002 — Company & Identity Foundation
(Backend P001):

- [ ] `src/app/guards/AuthGuard.tsx` (stub)
- [ ] `src/store/auth.store.ts` (token stubs, tenant-isolation ready)
- [ ] `src/lib/axios.ts` (interceptor stubs)
- [ ] `src/services/` directory scaffolded
- [ ] `/login` route with `AuthLayout`
- [ ] React Hook Form + Zod installed
- [ ] Toast provider for error feedback
- [ ] Data-driven navigation ready to receive Company & Identity sections

---

## Troubleshooting

| Issue                      | Resolution                                                             |
| -------------------------- | ---------------------------------------------------------------------- |
| Theme flash on load        | Verify inline script in `index.html` reads `localStorage`              |
| Tailwind styles missing    | Check `@tailwindcss/vite` plugin in `vite.config.ts`                   |
| `@/` import errors         | Verify `paths` in `tsconfig` and `resolve.alias` in Vite               |
| Husky hooks not running    | Run `pnpm exec husky init` and verify `.husky/pre-commit`              |
| shadcn components fail     | Re-run `pnpm dlx shadcn@latest init` with Tailwind v4                  |
| Wrong package manager used | Delete `node_modules` and `package-lock.json`; run `pnpm install` only |

---

## References

- [spec.md](./spec.md) — Feature requirements
- [plan.md](./plan.md) — Implementation phases
- [data-model.md](./data-model.md) — Store and type shapes
- [contracts/](./contracts/) — Component and infrastructure contracts
- [Constitution](../../.specify/memory/constitution.md) — Project governance
