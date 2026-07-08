import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'

import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { ErrorState } from '@/components/feedback/ErrorState'
import { PageSkeleton } from '@/components/feedback/PageSkeleton'
import { Card, CardContent } from '@/components/ui/card'
import { buildRoute } from '@/constants/routes'
import { blankToUndefined } from '@/utils/form-values'
import { formatEmployeeName } from '../lib/employee-display'
import { EmployeeForm } from '../components/EmployeeForm'
import { useEmployee } from '../hooks/useEmployee'
import { useUpdateEmployee } from '../hooks/useEmployeeMutations'

export default function EmployeeEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const employeeQuery = useEmployee(id)
  const updateEmployee = useUpdateEmployee(id ?? '')

  useEffect(() => {
    document.title = 'Edit employee | Scrappy Web'
  }, [])

  if (employeeQuery.isLoading) {
    return <PageSkeleton />
  }

  if (employeeQuery.isError || !employeeQuery.data) {
    return (
      <PageContainer maxWidth="lg">
        <ErrorState
          title="Employee not found"
          description="This employee may have been removed or you may not have access."
        />
      </PageContainer>
    )
  }

  const employee = employeeQuery.data
  const displayName = formatEmployeeName(employee)

  return (
    <PageContainer maxWidth="lg">
      <div className="space-y-6">
        <PageHeader title={`Edit ${displayName}`} description="Update workforce record details." />
        <Card>
          <CardContent className="pt-6">
            <EmployeeForm
              mode="edit"
              isSubmitting={updateEmployee.isPending}
              defaultValues={{
                firstName: employee.firstName,
                middleName: employee.middleName ?? '',
                lastName: employee.lastName,
                suffix: employee.suffix ?? '',
                employeeNumber: employee.employeeNumber ?? '',
                contactNumber: employee.contactNumber ?? '',
                weeklySalary: employee.weeklySalary,
                linkUserId: employee.userId ?? '',
              }}
              onCancel={() => {
                void navigate(buildRoute.employeeDetail(employee.id))
              }}
              onSubmit={(values) => {
                updateEmployee.mutate(
                  {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    middleName: blankToUndefined(values.middleName),
                    suffix: blankToUndefined(values.suffix),
                    employeeNumber: blankToUndefined(values.employeeNumber),
                    contactNumber: blankToUndefined(values.contactNumber),
                    weeklySalary: values.weeklySalary,
                    linkUserId: blankToUndefined(values.linkUserId),
                  },
                  {
                    onSuccess: () => {
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
