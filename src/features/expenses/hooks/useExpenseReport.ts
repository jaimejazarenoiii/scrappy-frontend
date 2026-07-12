/**
 * @deprecated Spec 010 — prefer `@/features/reports/hooks/useReportQueries`.
 * Reports module owns GET /reports/expenses.
 */
export { useExpenseReport } from '@/features/reports/hooks/useReportQueries'

export { defaultExpenseReportRange, isExpenseReportRangeValid } from '../lib/expense-report-api'
