import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { ErrorState } from '@/components/feedback/ErrorState'
import { PageSkeleton } from '@/components/feedback/PageSkeleton'
import { Card, CardContent } from '@/components/ui/card'
import type { NormalizedApiError } from '@/lib/axios'
import { buildRoute } from '@/constants/routes'
import { blankToUndefined } from '@/utils/form-values'

import { BranchForm } from '../components/BranchForm'
import { useBranch } from '../hooks/useBranch'
import { useUpdateBranch } from '../hooks/useBranchMutations'
import type { BranchFormValues } from '../validation/branch.schema'

export default function BranchEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const branchQuery = useBranch(id)
  const updateBranch = useUpdateBranch(id ?? '')
  const [apiError, setApiError] = useState<NormalizedApiError | null>(null)

  useEffect(() => {
    document.title = 'Edit branch | Scrappy'
  }, [])

  if (branchQuery.isLoading) {
    return <PageSkeleton />
  }

  if (branchQuery.isError || !branchQuery.data) {
    return (
      <PageContainer maxWidth="lg">
        <ErrorState
          title="Branch not found"
          description="This branch may have been removed or you may not have access."
        />
      </PageContainer>
    )
  }

  const branch = branchQuery.data

  function handleSubmit(values: BranchFormValues) {
    setApiError(null)
    updateBranch.mutate(
      {
        name: values.name,
        address: blankToUndefined(values.address),
        contactNumber: blankToUndefined(values.contactNumber),
        status: values.status,
      },
      {
        onSuccess: () => {
          void navigate(buildRoute.branchDetail(branch.id))
        },
        onError: (error) => {
          setApiError(error)
        },
      },
    )
  }

  return (
    <PageContainer maxWidth="lg">
      <div className="space-y-6">
        <PageHeader title={`Edit ${branch.name}`} description="Update branch details." />
        <Card>
          <CardContent className="pt-6">
            <BranchForm
              mode="edit"
              isSubmitting={updateBranch.isPending}
              apiError={apiError}
              defaultValues={{
                name: branch.name,
                address: branch.address ?? '',
                contactNumber: branch.contactNumber ?? '',
                status: branch.status,
              }}
              onCancel={() => {
                void navigate(buildRoute.branchDetail(branch.id))
              }}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
