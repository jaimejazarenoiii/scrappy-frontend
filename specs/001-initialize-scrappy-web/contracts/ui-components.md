# UI Component Contracts

**Feature**: 001-initialize-scrappy-web
**Version**: 1.0.0

Contracts define the public API surface for shared components. Implementations MUST NOT
break these interfaces without a spec amendment.

---

## PageHeader

**Path**: `@/components/common/PageHeader`

| Prop          | Type        | Required | Description                  |
| ------------- | ----------- | -------- | ---------------------------- |
| `title`       | `string`    | Yes      | Page title (h1)              |
| `description` | `string`    | No       | Subtitle text                |
| `breadcrumbs` | `ReactNode` | No       | Breadcrumb slot              |
| `actions`     | `ReactNode` | No       | Right-aligned action buttons |

**Accessibility**: Renders semantic `<header>` with single `<h1>`.

---

## PageContainer

**Path**: `@/components/common/PageContainer`

| Prop        | Type                                     | Required | Default  | Description        |
| ----------- | ---------------------------------------- | -------- | -------- | ------------------ |
| `children`  | `ReactNode`                              | Yes      | —        | Page content       |
| `className` | `string`                                 | No       | —        | Additional classes |
| `maxWidth`  | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | No       | `'full'` | Content max width  |

**Responsive**: Full width on mobile; constrained padding `p-4 md:p-6 lg:p-8`.

---

## EmptyState

**Path**: `@/components/feedback/EmptyState`

| Prop          | Type         | Required | Description       |
| ------------- | ------------ | -------- | ----------------- |
| `icon`        | `LucideIcon` | No       | Illustration icon |
| `title`       | `string`     | Yes      | Primary message   |
| `description` | `string`     | No       | Guidance text     |
| `action`      | `ReactNode`  | No       | CTA button slot   |

---

## ErrorFallback

**Path**: `@/components/feedback/ErrorFallback`

| Prop         | Type         | Required | Description                      |
| ------------ | ------------ | -------- | -------------------------------- |
| `error`      | `Error`      | No       | Caught error (not shown to user) |
| `resetError` | `() => void` | No       | Recovery callback                |

**Behavior**: Display generic friendly message. Log error to console in dev only.
MUST NOT expose stack traces.

---

## DataTable (Foundation)

**Path**: `@/components/common/DataTable`

| Prop           | Type             | Required | Description                       |
| -------------- | ---------------- | -------- | --------------------------------- |
| `columns`      | `ColumnDef<T>[]` | Yes      | TanStack Table column definitions |
| `data`         | `T[]`            | Yes      | Row data                          |
| `isLoading`    | `boolean`        | No       | Show skeleton rows                |
| `emptyMessage` | `string`         | No       | Empty state text                  |

**Responsive**: Horizontal scroll on mobile; sticky header on desktop. Column visibility
API reserved for future specs.

---

## LoadingOverlay

**Path**: `@/components/feedback/LoadingOverlay`

| Prop        | Type        | Required | Default | Description             |
| ----------- | ----------- | -------- | ------- | ----------------------- |
| `isLoading` | `boolean`   | Yes      | —       | Visibility              |
| `children`  | `ReactNode` | Yes      | —       | Content beneath overlay |

---

## shadcn/ui Primitives

Installed in `@/components/ui/`. Standard shadcn prop interfaces apply. MUST NOT fork
primitive APIs — extend via composition in `common/` or `feedback/`.

Required primitives this phase: `button`, `card`, `input`, `textarea`, `select`, `dialog`,
`drawer`, `dropdown-menu`, `badge`, `skeleton`, `separator`, `sheet`, `tooltip`.
