import { useEffect } from 'react'
import { useNavigate } from 'react-router'

import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { buildRoute, ROUTES } from '@/constants/routes'
import { blankToUndefined } from '@/utils/form-values'
import { EmployeeForm } from '../components/EmployeeForm'
import { useCreateEmployee } from '../hooks/useEmployeeMutations'

export default function EmployeeCreatePage() {
  const navigate = useNavigate()
  const createEmployee = useCreateEmployee()

  useEffect(() => {
    document.title = 'New employee | Scrappy Web'
  }, [])

  return (
    <PageContainer maxWidth="lg">
      <div className="space-y-6">
        <PageHeader title="New employee" description="Add a new workforce record." />
        <Card>
          <CardContent className="pt-6">
            <EmployeeForm
              mode="create"
              isSubmitting={createEmployee.isPending}
              onCancel={() => {
                void navigate(ROUTES.employees)
              }}
              onSubmit={(values) => {
                createEmployee.mutate(
                  {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    middleName: blankToUndefined(values.middleName),
                    suffix: blankToUndefined(values.suffix),
                    employeeNumber: blankToUndefined(values.employeeNumber),
                    contactNumber: blankToUndefined(values.contactNumber),
                    weeklySalary: values.weeklySalary,
                  },
                  {
                    onSuccess: (employee) => {
                      void navigate(buildRoute.employeeDetail(employee.id))
                    },
                  },
                )
              }}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
