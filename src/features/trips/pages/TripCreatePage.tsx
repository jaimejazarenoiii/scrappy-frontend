import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import type { NormalizedApiError } from '@/lib/axios'
import { buildRoute, ROUTES } from '@/constants/routes'
import { blankToUndefined } from '@/utils/form-values'

import { TripForm } from '../components/TripForm'
import { useCreateTrip } from '../hooks/useTripMutations'
import type { TripFormValues } from '../validation/trip.schema'

function datetimeLocalToIso(value: string): string {
  return new Date(value).toISOString()
}

export default function TripCreatePage() {
  const navigate = useNavigate()
  const createTrip = useCreateTrip()
  const [apiError, setApiError] = useState<NormalizedApiError | null>(null)

  useEffect(() => {
    document.title = 'New trip | Scrappy'
  }, [])

  function handleSubmit(values: TripFormValues) {
    setApiError(null)

    const members = (values.members ?? []).filter((member) => member.employeeId)

    createTrip.mutate(
      {
        vehicleId: values.vehicleId,
        origin: values.origin.trim(),
        destination: values.destination.trim(),
        scheduledStart: datetimeLocalToIso(values.scheduledStart),
        notes: blankToUndefined(values.notes),
        members: members.length > 0 ? members : undefined,
        prepareTripLoad: values.prepareTripLoad,
      },
      {
        onSuccess: (trip) => {
          void navigate(buildRoute.tripDetail(trip.id))
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
        <PageHeader
          title="New trip"
          description="Create a draft trip with vehicle, route, and optional crew."
        />
        <Card>
          <CardContent className="pt-6">
            <TripForm
              mode="create"
              isSubmitting={createTrip.isPending}
              apiError={apiError}
              onCancel={() => {
                void navigate(ROUTES.trips)
              }}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
