import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import type { NormalizedApiError } from '@/lib/axios'
import { buildRoute, ROUTES } from '@/constants/routes'
import { blankToUndefined } from '@/utils/form-values'

import { WarehouseForm } from '../components/WarehouseForm'
import { useCreateWarehouse } from '../hooks/useWarehouseMutations'
import type { WarehouseFormValues } from '../validation/warehouse.schema'

export default function WarehouseCreatePage() {
  const navigate = useNavigate()
  const createWarehouse = useCreateWarehouse()
  const [apiError, setApiError] = useState<NormalizedApiError | null>(null)

  useEffect(() => {
    document.title = 'New warehouse | Scrappy Web'
  }, [])

  function handleSubmit(values: WarehouseFormValues) {
    setApiError(null)
    createWarehouse.mutate(
      {
        name: values.name,
        address: blankToUndefined(values.address),
        contactNumber: blankToUndefined(values.contactNumber),
        status: values.status,
        branchId: blankToUndefined(values.branchId),
      },
      {
        onSuccess: (warehouse) => {
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
        <PageHeader title="New warehouse" description="Add a new warehouse location." />
        <Card>
          <CardContent className="pt-6">
            <WarehouseForm
              mode="create"
              isSubmitting={createWarehouse.isPending}
              apiError={apiError}
              onCancel={() => {
                void navigate(ROUTES.warehouses)
              }}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
