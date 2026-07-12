# API Endpoints: Expense Management (Spec 008)

Consumed through `src/features/expenses/services/expense.service.ts`.

**Base path**: `/api/v1` (via `VITE_API_BASE_URL`).

## Implementation status (aligned with Scrappy API Reference)

| Capability              | Endpoint                     | Status                                     |
| ----------------------- | ---------------------------- | ------------------------------------------ |
| Expense **report** list | `GET /reports/expenses`      | **Live** — Owner/Manager; Employee **403** |
| Expense CRUD            | `GET/POST/PATCH /expenses`   | **Not in API** — enable when P007 ships    |
| Categories              | `GET /expenses/categories`   | Planned with P007                          |
| Attachments             | `/expenses/{id}/attachments` | Planned with P007                          |
| Analytics               | `GET /analytics/expenses`    | Live but zeros until expense module        |

**Short-term frontend**: List page uses `GET /reports/expenses` only. Set `VITE_EXPENSE_MODULE_CRUD_ENABLED=true` when P007 CRUD is available.

## Expense report — `GET /reports/expenses`

**Roles**: OWNER, MANAGER. **Employee** receives **403**.

### Required query parameters

| Param  | Type    | Notes                                                    |
| ------ | ------- | -------------------------------------------------------- |
| `from` | ISO8601 | Required — start of reporting window                     |
| `to`   | ISO8601 | Required — end of reporting window; max **366-day** span |

Frontend converts date inputs (`YYYY-MM-DD`) to ISO8601 start/end of UTC day.

### Optional query parameters

| Param             | Type    | Notes                                                |
| ----------------- | ------- | ---------------------------------------------------- |
| `page`            | integer | Default `1`                                          |
| `limit`           | integer | Default `20`, max `100`                              |
| `sortBy`          | string  | Allowlisted per Swagger; frontend defaults to `date` |
| `sortOrder`       | enum    | `asc` \| `desc`                                      |
| `search`          | string  | Min **2** characters when provided                   |
| `branchId`        | uuid    | Tenant-scoped filter                                 |
| `warehouseId`     | uuid    | Tenant-scoped filter                                 |
| `vehicleId`       | uuid    | Tenant-scoped filter                                 |
| `employeeId`      | uuid    | Tenant-scoped filter                                 |
| `tripId`          | uuid    | Trip/expense filter                                  |
| `includeArchived` | boolean | Default `false`                                      |

### Response

Paginated `data` array of expense report rows. Each row uses **`date`** (not `expenseDate`).

`meta` may include `appliedCriteria` and `generatedAt` in addition to pagination fields.

**Note**: Report may return **empty** until Backend P007 expense module is live.

### Export (out of scope for Spec 008 UI)

`GET /reports/expenses/export` — `format=csv|xlsx|pdf`, same filters as list.

## Future P007 CRUD (when `VITE_EXPENSE_MODULE_CRUD_ENABLED=true`)

| Method             | Endpoint                                           | Notes                      |
| ------------------ | -------------------------------------------------- | -------------------------- |
| `list`             | `GET /expenses`                                    | Paginated operational list |
| `get`              | `GET /expenses/{expenseId}`                        | Detail                     |
| `create`           | `POST /expenses`                                   | Create                     |
| `update`           | `PATCH /expenses/{expenseId}`                      | Update                     |
| `delete`           | `DELETE /expenses/{expenseId}`                     | If supported               |
| `archive`          | `POST /expenses/{expenseId}/archive`               | If supported               |
| `listCategories`   | `GET /expenses/categories`                         | Category pickers           |
| `listAttachments`  | `GET /expenses/{id}/attachments`                   | Receipt gallery            |
| `uploadAttachment` | `POST /expenses/{id}/attachments`                  | Multipart `file`           |
| `deleteAttachment` | `DELETE /expenses/{id}/attachments/{attachmentId}` | Remove receipt             |

## Error contract

| HTTP | `error.code`         | Frontend handling                            |
| ---- | -------------------- | -------------------------------------------- |
| 400  | `VALIDATION_ERROR`   | Date range, search length, filter validation |
| 401  | `UNAUTHENTICATED`    | Session refresh / logout                     |
| 403  | `FORBIDDEN`          | Employee or missing permission — hide nav    |
| 404  | `RESOURCE_NOT_FOUND` | Detail not found (CRUD phase)                |
| 422  | —                    | Export row limit exceeded                    |

## Permission keys (frontend)

| Key                | Maps to                                                 |
| ------------------ | ------------------------------------------------------- |
| `expenses.view`    | `GET /reports/expenses` (Owner/Manager in `session.ts`) |
| `expenses.create`  | Future `POST /expenses`                                 |
| `expenses.update`  | Future `PATCH /expenses` + attachments                  |
| `expenses.delete`  | Future `DELETE /expenses`                               |
| `expenses.archive` | Future archive endpoint                                 |

## Out of scope

- `GET /analytics/expenses` (Spec 009)
- `GET /reports/expenses/export` (future export UI)
- Activity logs (Spec 011)
