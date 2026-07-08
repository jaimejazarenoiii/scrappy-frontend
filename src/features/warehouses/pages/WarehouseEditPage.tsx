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

import { WarehouseForm } from '../components/WarehouseForm'
import { useWarehouse } from '../hooks/useWarehouse'
import { useUpdateWarehouse } from '../hooks/useWarehouseMutations'
import type { WarehouseFormValues } from '../validation/warehouse.schema'

export default function WarehouseEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const warehouseQuery = useWarehouse(id)
  const updateWarehouse = useUpdateWarehouse(id ?? '')
  const [apiError, setApiError] = useState<NormalizedApiError | null>(null)

  useEffect(() => {
    document.title = 'Edit warehouse | Scrappy'
  }, [])

  if (warehouseQuery.isLoading) {
    return <PageSkeleton />
  }

  if (warehouseQuery.isError || !warehouseQuery.data) {
    return (
      <PageContainer maxWidth="lg">
        <ErrorState
          title="Warehouse not found"
          description="This warehouse may have been removed or you may not have access."
        />
      </PageContainer>
    )
  }

  const warehouse = warehouseQuery.data

  function handleSubmit(values: WarehouseFormValues) {
    setApiError(null)
    updateWarehouse.mutate(
      {
        name: values.name,
        address: blankToUndefined(values.address),
        contactNumber: blankToUndefined(values.contactNumber),
        status: values.status,
        branchId: blankToUndefined(values.branchId),
      },
      {
        onSuccess: () => {
          void navigate(buildRoute.warehouseDetail(warehouse.id))
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
        <PageHeader title={`Edit ${warehouse.name}`} description="Update warehouse details." />
        <Card>
          <CardContent className="pt-6">
            <WarehouseForm
              mode="edit"
              isSubmitting={updateWarehouse.isPending}
              apiError={apiError}
              defaultValues={{
                name: warehouse.name,
                address: warehouse.address ?? '',
                contactNumber: warehouse.contactNumber ?? '',
                status: warehouse.status,
                branchId: warehouse.branchId ?? '',
              }}
              onCancel={() => {
                void navigate(buildRoute.warehouseDetail(warehouse.id))
              }}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
