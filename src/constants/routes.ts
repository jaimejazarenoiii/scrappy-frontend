export const ROUTES = {
  home: '/',
  login: '/login',
  dashboard: '/dashboard',
  comingSoon: '/coming-soon',
  forbidden: '/403',
  company: '/company',
  users: '/users',
  userNew: '/users/new',
  userDetail: '/users/:id',
  userEdit: '/users/:id/edit',
  employees: '/employees',
  employeeNew: '/employees/new',
  employeeDetail: '/employees/:id',
  employeeEdit: '/employees/:id/edit',
} as const

export const buildRoute = {
  userDetail: (id: string) => `/users/${id}`,
  userEdit: (id: string) => `/users/${id}/edit`,
  employeeDetail: (id: string) => `/employees/${id}`,
  employeeEdit: (id: string) => `/employees/${id}/edit`,
} as const
