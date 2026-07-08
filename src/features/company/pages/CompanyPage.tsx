import { useEffect } from 'react'

import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { ErrorState } from '@/components/feedback/ErrorState'
import { PageSkeleton } from '@/components/feedback/PageSkeleton'
import { Badge } from '@/components/ui/badge'
import { PERMISSIONS } from '@/constants/permissions'
import { usePermissions } from '@/features/authorization/hooks/usePermissions'
import { blankToUndefined } from '@/utils/form-values'
import { CompanyForm } from '../components/CompanyForm'
import { useCompany, useUpdateCompany } from '../hooks/useCompany'

export default function CompanyPage() {
  const companyQuery = useCompany()
  const updateCompany = useUpdateCompany()
  const { has } = usePermissions()
  const canEdit = has(PERMISSIONS.company.update)

  useEffect(() => {
    document.title = 'Company | Scrappy'
  }, [])

  if (companyQuery.isLoading) {
    return <PageSkeleton />
  }

  if (companyQuery.isError || !companyQuery.data) {
    return (
      <PageContainer maxWidth="lg">
        <ErrorState description="We couldn't load your company information. Please try again." />
      </PageContainer>
    )
  }

  const company = companyQuery.data

  return (
    <PageContainer maxWidth="lg">
      <div className="space-y-6">
        <PageHeader
          title="Company"
          description="View and manage your company profile."
          actions={!canEdit ? <Badge variant="secondary">Read only</Badge> : null}
        />
        <CompanyForm
          company={company}
          canEdit={canEdit}
          isSubmitting={updateCompany.isPending}
          onSubmit={(values) => {
            updateCompany.mutate({
              name: values.name,
              email: blankToUndefined(values.email),
              contactNumber: blankToUndefined(values.contactNumber),
              address: blankToUndefined(values.address),
            })
          }}
        />
      </div>
    </PageContainer>
  )
}
