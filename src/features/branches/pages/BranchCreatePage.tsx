import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import type { NormalizedApiError } from '@/lib/axios'
import { buildRoute, ROUTES } from '@/constants/routes'
import { blankToUndefined } from '@/utils/form-values'

import { BranchForm } from '../components/BranchForm'
import { useCreateBranch } from '../hooks/useBranchMutations'
import type { BranchFormValues } from '../validation/branch.schema'

export default function BranchCreatePage() {
  const navigate = useNavigate()
  const createBranch = useCreateBranch()
  const [apiError, setApiError] = useState<NormalizedApiError | null>(null)

  useEffect(() => {
    document.title = 'New branch | Scrappy Web'
  }, [])

  function handleSubmit(values: BranchFormValues) {
    setApiError(null)
    createBranch.mutate(
      {
        name: values.name,
        address: blankToUndefined(values.address),
        contactNumber: blankToUndefined(values.contactNumber),
        status: values.status,
      },
      {
        onSuccess: (branch) => {
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
        <PageHeader title="New branch" description="Add a new branch location." />
        <Card>
          <CardContent className="pt-6">
            <BranchForm
              mode="create"
              isSubmitting={createBranch.isPending}
              apiError={apiError}
              onCancel={() => {
                void navigate(ROUTES.branches)
              }}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
