# Route & Layout Contracts

**Feature**: 001-initialize-scrappy-web
**Version**: 1.0.0

---

## Route Table

| Path           | Component               | Layout            | Lazy | Guard              | Document Title                |
| -------------- | ----------------------- | ----------------- | ---- | ------------------ | ----------------------------- |
| `/`            | Redirect → `/dashboard` | —                 | No   | —                  | —                             |
| `/login`       | `LoginPage`             | `AuthLayout`      | Yes  | —                  | Sign In \| Scrappy Web        |
| `/dashboard`   | `DashboardPage`         | `DashboardLayout` | Yes  | `AuthGuard` (stub) | Dashboard \| Scrappy Web      |
| `/coming-soon` | `ComingSoonPage`        | `DashboardLayout` | Yes  | `AuthGuard` (stub) | Coming Soon \| Scrappy Web    |
| `*`            | `NotFoundPage`          | —                 | Yes  | —                  | Page Not Found \| Scrappy Web |

---

## Layout Contract

### AuthLayout

**Purpose**: Authentication pages (login, future register/forgot-password)

**Structure**:

```text
┌─────────────────────────────────────┐
│         Centered container          │
│  ┌───────────────────────────────┐  │
│  │         {Outlet}              │  │
│  │    (max-w-md card shell)      │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

**Rules**:

- No sidebar or dashboard header
- Responsive: full-width padding on mobile, centered card on desktop
- Background: subtle gradient or muted bg per UI UX Pro Max

### DashboardLayout

**Purpose**: All authenticated application pages

**Structure**:

```text
┌──────────┬──────────────────────────────────┐
│          │  Header (sticky)                 │
│ Sidebar  ├──────────────────────────────────┤
│          │  Breadcrumb placeholder          │
│          ├──────────────────────────────────┤
│          │  {Outlet} — main content         │
│          ├──────────────────────────────────┤
│          │  Footer placeholder              │
└──────────┴──────────────────────────────────┘
```

**Responsive sidebar**:

| Viewport   | Sidebar behavior                                  |
| ---------- | ------------------------------------------------- |
| ≥ 1280px   | Permanent, full width (256px)                     |
| 768–1279px | Collapsible to icon rail (64px)                   |
| < 768px    | Hidden; accessible via header menu → Sheet drawer |

**Persistence**: Layout component MUST NOT remount on child route changes.

---

## AuthGuard Contract (Stub)

**Path**: `@/app/guards/AuthGuard`

**Phase 001 behavior**:

```tsx
// Renders children unconditionally
export function AuthGuard() {
  return <Outlet />
}
```

**Phase 002 extension** (Specification 002 — Company & Identity Foundation):

- Read `isAuthenticated` from `auth.store`
- Redirect unauthenticated users to `/login`
- Preserve `location` state for post-login redirect
- Enforce tenant isolation once company context is available

---

## Router Factory Contract

**Path**: `@/app/router/index.tsx`

**Export**: `router: ReturnType<typeof createBrowserRouter>`

**Requirements**:

- MUST use `createBrowserRouter` (not `<BrowserRouter>`)
- MUST define `errorElement` on root and layout routes
- MUST use `React.lazy()` for all page components
- MUST wrap lazy routes in `<Suspense fallback={<PageSkeleton />}>`

---

## Navigation Config Contract

**Path**: `@/constants/navigation.ts`

**Export**: `navigationItems: NavigationItem[]`

**Rules**:

- Single source of truth for sidebar links
- Unimplemented features link to `/coming-soon` or use `disabled: true`
- Icons from `lucide-react` only
- Future specs add items without restructuring — append to array or add children
