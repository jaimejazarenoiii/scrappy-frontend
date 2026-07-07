import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router'

import { AuthGuard } from '@/app/guards/AuthGuard'
import { AuthLayout } from '@/app/layouts/AuthLayout'
import { DashboardLayout } from '@/app/layouts/DashboardLayout'
import { ErrorFallback } from '@/components/feedback/ErrorFallback'
import { ROUTES } from '@/constants/routes'

const DashboardPage = lazy(() => import('@/app/pages/DashboardPage'))
const LoginPage = lazy(() => import('@/app/pages/LoginPage'))
const NotFoundPage = lazy(() => import('@/app/pages/NotFoundPage'))
const ComingSoonPage = lazy(() => import('@/app/pages/ComingSoonPage'))

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
