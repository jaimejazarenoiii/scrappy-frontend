# Provider & Infrastructure Contracts

**Feature**: 001-initialize-scrappy-web
**Version**: 1.0.0

---

## AppProviders Composition Order

**Path**: `@/app/providers/AppProviders.tsx`

**Nesting order** (outermost → innermost):

```text
ThemeProvider
  └── QueryProvider
        └── ToastProvider
              └── {children}
```

RouterProvider wraps inside App in `App.tsx` (sibling concern, not inside theme).

---

## ThemeProvider Contract

| Export          | Type                     | Description                                |
| --------------- | ------------------------ | ------------------------------------------ |
| `ThemeProvider` | `React.FC<{ children }>` | Applies `light`/`dark` class on `<html>`   |
| `useTheme`      | hook                     | Returns `{ mode, setMode, resolvedTheme }` |

**Modes**: `'light' | 'dark' | 'system'`

**Persistence key**: `scrappy-theme` in `localStorage`

---

## QueryProvider Contract

| Export          | Type                     | Description                          |
| --------------- | ------------------------ | ------------------------------------ |
| `QueryProvider` | `React.FC<{ children }>` | Wraps `QueryClientProvider`          |
| `queryClient`   | `QueryClient`            | Singleton from `lib/query-client.ts` |

**Devtools**: `@tanstack/react-query-devtools` — render only when `import.meta.env.DEV`

---

## ToastProvider Contract

| Export          | Type                     | Description                  |
| --------------- | ------------------------ | ---------------------------- |
| `ToastProvider` | `React.FC<{ children }>` | Renders Sonner `<Toaster />` |

**Configuration**:

- Position: `bottom-right` (desktop), `top-center` (mobile)
- Theme: sync with `resolvedTheme`
- Duration: 4000ms default

---

## Axios Client Contract

**Path**: `@/lib/axios.ts`

| Export      | Type            | Description          |
| ----------- | --------------- | -------------------- |
| `apiClient` | `AxiosInstance` | Configured singleton |

**Configuration**:

| Setting   | Value                                    |
| --------- | ---------------------------------------- |
| `baseURL` | `import.meta.env.VITE_API_BASE_URL`      |
| `timeout` | `30000`                                  |
| `headers` | `{ 'Content-Type': 'application/json' }` |

**Request interceptor** (stub):

1. Read `accessToken` from `useAuthStore.getState()`
2. If token exists, set `Authorization: Bearer {token}`
3. No token → proceed without header

**Response interceptor** (stub):

1. On error, normalize to `ApiError` shape
2. On 401, placeholder for refresh flow (Spec 002)
3. Reject with normalized error

**Rule**: Components and pages MUST NOT import `apiClient` directly. Only `services/` may
import it (enforced by convention and code review in this phase).

---

## Zustand Store Contracts

### auth.store

```typescript
interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  setTokens: (access: string, refresh: string) => void
  clearTokens: () => void
}
```

### theme.store

```typescript
type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeState {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
}
```

### ui.store

```typescript
interface UIState {
  sidebarCollapsed: boolean
  mobileNavOpen: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  openMobileNav: () => void
  closeMobileNav: () => void
  toggleMobileNav: () => void
}
```

---

## Utility Contracts

| Function         | Path                      | Signature                                           |
| ---------------- | ------------------------- | --------------------------------------------------- |
| `cn`             | `@/lib/utils`             | `(...inputs: ClassValue[]) => string`               |
| `formatDate`     | `@/utils/format-date`     | `(date: Date \| string, format?: string) => string` |
| `formatCurrency` | `@/utils/format-currency` | `(amount: number, currency?: string) => string`     |
| `debounce`       | `@/utils/debounce`        | `<T>(fn: T, ms: number) => T`                       |

---

## Environment Variables

| Variable            | Required | Default                     | Description          |
| ------------------- | -------- | --------------------------- | -------------------- |
| `VITE_API_BASE_URL` | No       | `http://localhost:3000/api` | Backend API base URL |

Exposed via `import.meta.env.VITE_API_BASE_URL` only. Document in `.env.example`.
