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
