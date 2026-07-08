import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import type { NormalizedApiError } from '@/lib/axios'
import { buildRoute, ROUTES } from '@/constants/routes'
import { blankToUndefined } from '@/utils/form-values'

import { VehicleForm } from '../components/VehicleForm'
import { useCreateVehicle } from '../hooks/useVehicleMutations'
import type { VehicleFormValues } from '../validation/vehicle.schema'

export default function VehicleCreatePage() {
  const navigate = useNavigate()
  const createVehicle = useCreateVehicle()
  const [apiError, setApiError] = useState<NormalizedApiError | null>(null)

  useEffect(() => {
    document.title = 'New vehicle | Scrappy'
  }, [])

  function handleSubmit(values: VehicleFormValues) {
    setApiError(null)
    createVehicle.mutate(
      {
        plateNumber: values.plateNumber,
        description: blankToUndefined(values.description),
        vehicleType: blankToUndefined(values.vehicleType),
        status: values.status,
        branchId: blankToUndefined(values.branchId),
        warehouseId: blankToUndefined(values.warehouseId),
      },
      {
        onSuccess: (vehicle) => {
          void navigate(buildRoute.vehicleDetail(vehicle.id))
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
        <PageHeader title="New vehicle" description="Add a new fleet vehicle." />
        <Card>
          <CardContent className="pt-6">
            <VehicleForm
              mode="create"
              isSubmitting={createVehicle.isPending}
              apiError={apiError}
              onCancel={() => {
                void navigate(ROUTES.vehicles)
              }}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
