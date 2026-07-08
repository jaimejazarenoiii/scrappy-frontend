import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router'

import { AuthGuard } from '@/app/guards/AuthGuard'
import { PermissionGuard } from '@/app/guards/PermissionGuard'
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

export const router = createBrowserRouter([
  {
    path: ROUTES.home,
    errorElement: <ErrorFallback />,
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.dashboard} replace />,
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
