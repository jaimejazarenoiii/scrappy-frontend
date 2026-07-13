import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router'

import { AuthGuard } from '@/app/guards/AuthGuard'
import { PermissionGuard } from '@/app/guards/PermissionGuard'
import { AppShell } from '@/app/layouts/AppShell'
import { AuthLayout } from '@/app/layouts/AuthLayout'
import { DashboardLayout } from '@/app/layouts/DashboardLayout'
import { ErrorFallback } from '@/components/feedback/ErrorFallback'
import { PERMISSIONS } from '@/constants/permissions'
import { ROUTES } from '@/constants/routes'

const DashboardPage = lazy(() => import('@/app/pages/DashboardPage'))
const LoginPage = lazy(() => import('@/app/pages/LoginPage'))
const NotFoundPage = lazy(() => import('@/app/pages/NotFoundPage'))
const ComingSoonPage = lazy(() => import('@/app/pages/ComingSoonPage'))
const ForbiddenPage = lazy(() => import('@/app/pages/ForbiddenPage'))

const CompanyPage = lazy(() => import('@/features/company/pages/CompanyPage'))

const EmployeesListPage = lazy(() => import('@/features/employees/pages/EmployeesListPage'))
const EmployeeCreatePage = lazy(() => import('@/features/employees/pages/EmployeeCreatePage'))
const EmployeeDetailPage = lazy(() => import('@/features/employees/pages/EmployeeDetailPage'))
const EmployeeEditPage = lazy(() => import('@/features/employees/pages/EmployeeEditPage'))

const BranchesListPage = lazy(() => import('@/features/branches/pages/BranchesListPage'))
const BranchCreatePage = lazy(() => import('@/features/branches/pages/BranchCreatePage'))
const BranchDetailPage = lazy(() => import('@/features/branches/pages/BranchDetailPage'))
const BranchEditPage = lazy(() => import('@/features/branches/pages/BranchEditPage'))

const WarehousesListPage = lazy(() => import('@/features/warehouses/pages/WarehousesListPage'))
const WarehouseCreatePage = lazy(() => import('@/features/warehouses/pages/WarehouseCreatePage'))
const WarehouseDetailPage = lazy(() => import('@/features/warehouses/pages/WarehouseDetailPage'))
const WarehouseEditPage = lazy(() => import('@/features/warehouses/pages/WarehouseEditPage'))

const VehiclesListPage = lazy(() => import('@/features/vehicles/pages/VehiclesListPage'))
const VehicleCreatePage = lazy(() => import('@/features/vehicles/pages/VehicleCreatePage'))
const VehicleDetailPage = lazy(() => import('@/features/vehicles/pages/VehicleDetailPage'))
const VehicleEditPage = lazy(() => import('@/features/vehicles/pages/VehicleEditPage'))

const AttendanceDashboardPage = lazy(
  () => import('@/features/attendance/pages/AttendanceDashboardPage'),
)
const AttendanceDetailPage = lazy(() => import('@/features/attendance/pages/AttendanceDetailPage'))

const LeaveListPage = lazy(() => import('@/features/leave/pages/LeaveListPage'))
const LeaveCreatePage = lazy(() => import('@/features/leave/pages/LeaveCreatePage'))
const LeaveDetailPage = lazy(() => import('@/features/leave/pages/LeaveDetailPage'))
const LeaveEditPage = lazy(() => import('@/features/leave/pages/LeaveEditPage'))

const CashAdvancesListPage = lazy(
  () => import('@/features/cash-advances/pages/CashAdvancesListPage'),
)
const CashAdvanceCreatePage = lazy(
  () => import('@/features/cash-advances/pages/CashAdvanceCreatePage'),
)
const CashAdvanceDetailPage = lazy(
  () => import('@/features/cash-advances/pages/CashAdvanceDetailPage'),
)
const CashAdvanceEditPage = lazy(() => import('@/features/cash-advances/pages/CashAdvanceEditPage'))

const PayrollListPage = lazy(() => import('@/features/payroll/pages/PayrollListPage'))
const PayrollDetailPage = lazy(() => import('@/features/payroll/pages/PayrollDetailPage'))

const TransactionsDashboardPage = lazy(
  () => import('@/features/transactions/pages/TransactionsDashboardPage'),
)
const TransactionDetailPage = lazy(
  () => import('@/features/transactions/pages/TransactionDetailPage'),
)
const TransactionCreatePage = lazy(
  () => import('@/features/transactions/pages/TransactionCreatePage'),
)
const TransactionDraftsPage = lazy(
  () => import('@/features/transactions/pages/TransactionDraftsPage'),
)
const TransactionEditPage = lazy(() => import('@/features/transactions/pages/TransactionEditPage'))
const TransactionSettlementPage = lazy(
  () => import('@/features/transactions/pages/TransactionSettlementPage'),
)
const TransactionReceiptPage = lazy(
  () => import('@/features/transactions/pages/TransactionReceiptPage'),
)

const TripsDashboardPage = lazy(() => import('@/features/trips/pages/TripsDashboardPage'))
const TripCreatePage = lazy(() => import('@/features/trips/pages/TripCreatePage'))
const TripDetailPage = lazy(() => import('@/features/trips/pages/TripDetailPage'))
const TripEditPage = lazy(() => import('@/features/trips/pages/TripEditPage'))

const ExpensesDashboardPage = lazy(() => import('@/features/expenses/pages/ExpensesDashboardPage'))
const ExpenseCreatePage = lazy(() => import('@/features/expenses/pages/ExpenseCreatePage'))
const ExpenseDetailPage = lazy(() => import('@/features/expenses/pages/ExpenseDetailPage'))
const ExpenseEditPage = lazy(() => import('@/features/expenses/pages/ExpenseEditPage'))

const AnalyticsDashboardPage = lazy(
  () => import('@/features/analytics/pages/AnalyticsDashboardPage'),
)

const ReportsHubPage = lazy(() => import('@/features/reports/pages/ReportsHubPage'))
const TransactionReportsPage = lazy(() => import('@/features/reports/pages/TransactionReportsPage'))
const TripReportsPage = lazy(() => import('@/features/reports/pages/TripReportsPage'))
const ExpenseReportsPage = lazy(() => import('@/features/reports/pages/ExpenseReportsPage'))
const PayrollReportsPage = lazy(() => import('@/features/reports/pages/PayrollReportsPage'))
const AttendanceReportsPage = lazy(() => import('@/features/reports/pages/AttendanceReportsPage'))
const LandingPage = lazy(() => import('@/features/landing/pages/LandingPage'))

export const router = createBrowserRouter([
  {
    path: ROUTES.home,
    element: <AppShell />,
    errorElement: <ErrorFallback />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: ROUTES.login,
            element: <LoginPage />,
          },
        ],
      },
      {
        element: <AuthGuard />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              {
                path: ROUTES.dashboard,
                element: <DashboardPage />,
              },
              {
                path: ROUTES.comingSoon,
                element: <ComingSoonPage />,
              },
              {
                path: ROUTES.forbidden,
                element: <ForbiddenPage />,
              },
              {
                element: <PermissionGuard permissions={[PERMISSIONS.company.view]} />,
                children: [
                  {
                    path: ROUTES.company,
                    element: <CompanyPage />,
                  },
                ],
              },
              {
                element: <PermissionGuard permissions={[PERMISSIONS.user.view]} />,
                children: [
                  {
                    path: ROUTES.users,
                    element: <ComingSoonPage />,
                  },
                  {
                    path: ROUTES.userNew,
                    element: <ComingSoonPage />,
                  },
                  {
                    path: ROUTES.userDetail,
                    element: <ComingSoonPage />,
                  },
                  {
                    path: ROUTES.userEdit,
                    element: <ComingSoonPage />,
                  },
                ],
              },
              {
                element: <PermissionGuard permissions={[PERMISSIONS.employee.view]} />,
                children: [
                  {
                    path: ROUTES.employees,
                    element: <EmployeesListPage />,
                  },
                  {
                    path: ROUTES.employeeNew,
                    element: <EmployeeCreatePage />,
                  },
                  {
                    path: ROUTES.employeeDetail,
                    element: <EmployeeDetailPage />,
                  },
                  {
                    path: ROUTES.employeeEdit,
                    element: <EmployeeEditPage />,
                  },
                ],
              },
              {
                element: <PermissionGuard permissions={[PERMISSIONS.branch.view]} />,
                children: [
                  {
                    path: ROUTES.branches,
                    element: <BranchesListPage />,
                  },
                  {
                    path: ROUTES.branchDetail,
                    element: <BranchDetailPage />,
                  },
                ],
              },
              {
                element: <PermissionGuard permissions={[PERMISSIONS.branch.create]} />,
                children: [
                  {
                    path: ROUTES.branchNew,
                    element: <BranchCreatePage />,
                  },
                ],
              },
              {
                element: <PermissionGuard permissions={[PERMISSIONS.branch.update]} />,
                children: [
                  {
                    path: ROUTES.branchEdit,
                    element: <BranchEditPage />,
                  },
                ],
              },
              {
                element: <PermissionGuard permissions={[PERMISSIONS.warehouse.view]} />,
                children: [
                  {
                    path: ROUTES.warehouses,
                    element: <WarehousesListPage />,
                  },
                  {
                    path: ROUTES.warehouseDetail,
                    element: <WarehouseDetailPage />,
                  },
                ],
              },
              {
                element: <PermissionGuard permissions={[PERMISSIONS.warehouse.create]} />,
                children: [
                  {
                    path: ROUTES.warehouseNew,
                    element: <WarehouseCreatePage />,
                  },
                ],
              },
              {
                element: <PermissionGuard permissions={[PERMISSIONS.warehouse.update]} />,
                children: [
                  {
                    path: ROUTES.warehouseEdit,
                    element: <WarehouseEditPage />,
                  },
                ],
              },
              {
                element: <PermissionGuard permissions={[PERMISSIONS.vehicle.view]} />,
                children: [
                  {
                    path: ROUTES.vehicles,
                    element: <VehiclesListPage />,
                  },
                  {
                    path: ROUTES.vehicleDetail,
                    element: <VehicleDetailPage />,
                  },
                ],
              },
              {
                element: <PermissionGuard permissions={[PERMISSIONS.vehicle.create]} />,
                children: [
                  {
                    path: ROUTES.vehicleNew,
                    element: <VehicleCreatePage />,
                  },
                ],
              },
              {
                element: <PermissionGuard permissions={[PERMISSIONS.vehicle.update]} />,
                children: [
                  {
                    path: ROUTES.vehicleEdit,
                    element: <VehicleEditPage />,
                  },
                ],
              },
              {
                element: <PermissionGuard permissions={[PERMISSIONS.attendance.view]} />,
                children: [
                  {
                    path: ROUTES.attendance,
                    element: <AttendanceDashboardPage />,
                  },
                  {
                    path: ROUTES.attendanceDetail,
                    element: <AttendanceDetailPage />,
                  },
                ],
              },
              {
                element: <PermissionGuard permissions={[PERMISSIONS.leave.view]} />,
                children: [
                  {
                    path: ROUTES.leave,
                    element: <LeaveListPage />,
                  },
                  {
                    path: ROUTES.leaveDetail,
                    element: <LeaveDetailPage />,
                  },
                ],
              },
              {
                element: <PermissionGuard permissions={[PERMISSIONS.leave.create]} />,
                children: [
                  {
                    path: ROUTES.leaveNew,
                    element: <LeaveCreatePage />,
                  },
                ],
              },
              {
                element: <PermissionGuard permissions={[PERMISSIONS.leave.update]} />,
                children: [
                  {
                    path: ROUTES.leaveEdit,
                    element: <LeaveEditPage />,
                  },
                ],
              },
              {
                element: <PermissionGuard permissions={[PERMISSIONS.cashAdvance.view]} />,
                children: [
                  {
                    path: ROUTES.cashAdvances,
                    element: <CashAdvancesListPage />,
                  },
                  {
                    path: ROUTES.cashAdvanceDetail,
                    element: <CashAdvanceDetailPage />,
                  },
                ],
              },
              {
                element: <PermissionGuard permissions={[PERMISSIONS.cashAdvance.create]} />,
                children: [
                  {
                    path: ROUTES.cashAdvanceNew,
                    element: <CashAdvanceCreatePage />,
                  },
                ],
              },
              {
                element: <PermissionGuard permissions={[PERMISSIONS.cashAdvance.update]} />,
                children: [
                  {
                    path: ROUTES.cashAdvanceEdit,
                    element: <CashAdvanceEditPage />,
                  },
                ],
              },
              {
                element: <PermissionGuard permissions={[PERMISSIONS.payroll.view]} />,
                children: [
                  {
                    path: ROUTES.payroll,
                    element: <PayrollListPage />,
                  },
                  {
                    path: ROUTES.payrollDetail,
                    element: <PayrollDetailPage />,
                  },
                ],
              },
              {
                element: <PermissionGuard permissions={[PERMISSIONS.transactions.view]} />,
                children: [
                  {
                    path: ROUTES.transactions,
                    element: <TransactionsDashboardPage />,
                  },
                  {
                    path: ROUTES.transactionsDrafts,
                    element: <TransactionDraftsPage />,
                  },
                  {
                    path: ROUTES.transactionDetail,
                    element: <TransactionDetailPage />,
                  },
                  {
                    path: ROUTES.transactionSettlement,
                    element: <TransactionSettlementPage />,
                  },
                  {
                    path: ROUTES.transactionReceipt,
                    element: <TransactionReceiptPage />,
                  },
                ],
              },
              {
                element: <PermissionGuard permissions={[PERMISSIONS.transactions.create]} />,
                children: [
                  {
                    path: ROUTES.transactionNew,
                    element: <TransactionCreatePage />,
                  },
                ],
              },
              {
                element: <PermissionGuard permissions={[PERMISSIONS.transactions.update]} />,
                children: [
                  {
                    path: ROUTES.transactionEdit,
                    element: <TransactionEditPage />,
                  },
                ],
              },
              {
                element: <PermissionGuard permissions={[PERMISSIONS.trips.view]} />,
                children: [
                  {
                    path: ROUTES.trips,
                    element: <TripsDashboardPage />,
                  },
                  {
                    path: ROUTES.tripDetail,
                    element: <TripDetailPage />,
                  },
                ],
              },
              {
                element: <PermissionGuard permissions={[PERMISSIONS.trips.create]} />,
                children: [
                  {
                    path: ROUTES.tripsNew,
                    element: <TripCreatePage />,
                  },
                ],
              },
              {
                element: <PermissionGuard permissions={[PERMISSIONS.trips.update]} />,
                children: [
                  {
                    path: ROUTES.tripEdit,
                    element: <TripEditPage />,
                  },
                ],
              },
              {
                element: <PermissionGuard permissions={[PERMISSIONS.expenses.view]} />,
                children: [
                  {
                    path: ROUTES.expenses,
                    element: <ExpensesDashboardPage />,
                  },
                  {
                    path: ROUTES.expenseDetail,
                    element: <ExpenseDetailPage />,
                  },
                ],
              },
              {
                element: <PermissionGuard permissions={[PERMISSIONS.expenses.create]} />,
                children: [
                  {
                    path: ROUTES.expensesNew,
                    element: <ExpenseCreatePage />,
                  },
                ],
              },
              {
                element: <PermissionGuard permissions={[PERMISSIONS.expenses.update]} />,
                children: [
                  {
                    path: ROUTES.expenseEdit,
                    element: <ExpenseEditPage />,
                  },
                ],
              },
              {
                element: <PermissionGuard permissions={[PERMISSIONS.analytics.view]} />,
                children: [
                  {
                    path: ROUTES.analytics,
                    element: <Navigate to={ROUTES.analyticsDashboard} replace />,
                  },
                  {
                    path: ROUTES.analyticsDashboard,
                    element: <AnalyticsDashboardPage />,
                  },
                ],
              },
              {
                element: <PermissionGuard permissions={[PERMISSIONS.reports.view]} />,
                children: [
                  {
                    path: ROUTES.reports,
                    element: <ReportsHubPage />,
                  },
                  {
                    path: ROUTES.reportsTransactions,
                    element: <TransactionReportsPage />,
                  },
                  {
                    path: ROUTES.reportsTrips,
                    element: <TripReportsPage />,
                  },
                  {
                    path: ROUTES.reportsExpenses,
                    element: <ExpenseReportsPage />,
                  },
                  {
                    path: ROUTES.reportsPayroll,
                    element: <PayrollReportsPage />,
                  },
                  {
                    path: ROUTES.reportsAttendance,
                    element: <AttendanceReportsPage />,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
