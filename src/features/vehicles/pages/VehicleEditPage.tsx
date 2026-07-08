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

import { VehicleForm } from '../components/VehicleForm'
import { useVehicle } from '../hooks/useVehicle'
import { useUpdateVehicle } from '../hooks/useVehicleMutations'
import type { VehicleFormValues } from '../validation/vehicle.schema'

export default function VehicleEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const vehicleQuery = useVehicle(id)
  const updateVehicle = useUpdateVehicle(id ?? '')
  const [apiError, setApiError] = useState<NormalizedApiError | null>(null)

  useEffect(() => {
    document.title = 'Edit vehicle | Scrappy'
  }, [])

  if (vehicleQuery.isLoading) {
    return <PageSkeleton />
  }

  if (vehicleQuery.isError || !vehicleQuery.data) {
    return (
      <PageContainer maxWidth="lg">
        <ErrorState
          title="Vehicle not found"
          description="This vehicle may have been removed or you may not have access."
        />
      </PageContainer>
    )
  }

  const vehicle = vehicleQuery.data

  function handleSubmit(values: VehicleFormValues) {
    setApiError(null)
    updateVehicle.mutate(
      {
        plateNumber: values.plateNumber,
        description: blankToUndefined(values.description),
        vehicleType: blankToUndefined(values.vehicleType),
        status: values.status,
        branchId: blankToUndefined(values.branchId),
        warehouseId: blankToUndefined(values.warehouseId),
      },
      {
        onSuccess: () => {
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
        <PageHeader title={`Edit ${vehicle.plateNumber}`} description="Update vehicle details." />
        <Card>
          <CardContent className="pt-6">
            <VehicleForm
              mode="edit"
              isSubmitting={updateVehicle.isPending}
              apiError={apiError}
              defaultValues={{
                plateNumber: vehicle.plateNumber,
                description: vehicle.description ?? '',
                vehicleType: vehicle.vehicleType ?? '',
                status: vehicle.status,
                branchId: vehicle.branchId ?? '',
                warehouseId: vehicle.warehouseId ?? '',
              }}
              onCancel={() => {
                void navigate(buildRoute.vehicleDetail(vehicle.id))
              }}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
