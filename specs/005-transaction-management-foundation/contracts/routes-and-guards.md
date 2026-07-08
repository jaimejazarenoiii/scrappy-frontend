# Routes and Guards: Transaction Management Foundation (Spec 005)

This document describes protected routes and how the frontend should apply the existing authorization infrastructure (Spec 002).

## Protected Routes

All Transaction Management routes must be protected using the existing `PermissionGuard`/authorization mechanism.

### Transactions Dashboard/List

- **Route**: `/transactions`
- **Guard**: `PermissionGuard` (requires the module “view/list” permission key)
- **Notes**:
  - route provides dashboard and/or list content
  - list must support search, filtering, sorting, and pagination

### Create Transaction Draft

- **Route**: `/transactions/new`
- **Guard**: `PermissionGuard` (requires the module “create draft” permission key)
- **Notes**:
  - initialize inbound/outbound selection in the draft editor
  - must not implement payment/settlement actions

### Drafts List / Resume Draft

- **Route**: `/transactions/drafts`
- **Guard**: `PermissionGuard` (requires “view drafts” permission key)
- **Notes**:
  - lists draft transactions based on backend status
  - provides “Continue Draft” affordance

### Transaction Details

- **Route**: `/transactions/:id`
- **Guard**: `PermissionGuard` (requires “view details” permission key)
- **Notes**:
  - show supported fields and relationship data
  - draft edit actions are only shown when the transaction is a draft and the backend allows it

### Edit Transaction Draft

- **Route**: `/transactions/:id/edit`
- **Guard**: `PermissionGuard` (requires “update draft” permission key)
- **Notes**:
  - binds draft form and supports auto-save + draft indicator
  - items/photos editing is enabled only in draft mode

## Action Visibility (PermissionGate)

- Use `PermissionGate` for action buttons inside pages (create/edit/resume/item/photo operations).
- Action visibility must be permission-driven and status-driven:
  - permissions determine whether the user can do the action
  - transaction status determines whether the action is applicable
- Out-of-scope workflows must not have UI affordances in this specification.

## Permission Key Reconciliation

The exact permission key strings must be reconciled against Backend P004 permission payloads. The implementation must extend `src/constants/permissions.ts` additively and match backend keys exactly.
