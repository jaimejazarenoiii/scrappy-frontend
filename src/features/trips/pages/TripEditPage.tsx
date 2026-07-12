import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { ErrorState } from '@/components/feedback/ErrorState'
import { PageSkeleton } from '@/components/feedback/PageSkeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { NormalizedApiError } from '@/lib/axios'
import { buildRoute } from '@/constants/routes'
import { blankToUndefined } from '@/utils/form-values'

import { TripForm } from '../components/TripForm'
import { useTrip } from '../hooks/useTrip'
import { useUpdateTrip } from '../hooks/useTripMutations'
import { isDraftStatus } from '../lib/trip-workflow'
import type { TripFormValues } from '../validation/trip.schema'

function toDatetimeLocalValue(iso: string | null | undefined): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const offset = date.getTimezoneOffset()
  const local = new Date(date.getTime() - offset * 60000)
  return local.toISOString().slice(0, 16)
}

function datetimeLocalToIso(value: string): string {
  return new Date(value).toISOString()
}

export default function TripEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const tripQuery = useTrip(id)
  const updateTrip = useUpdateTrip(id ?? '')
  const [apiError, setApiError] = useState<NormalizedApiError | null>(null)

  useEffect(() => {
    document.title = 'Edit trip | Scrappy'
  }, [])

  if (tripQuery.isLoading) {
    return <PageSkeleton />
  }

  if (tripQuery.isError || !tripQuery.data) {
    return (
      <PageContainer maxWidth="lg">
        <ErrorState
          title="Trip not found"
          description="This trip may have been removed or you may not have access."
        />
      </PageContainer>
    )
  }

  const trip = tripQuery.data

  if (!isDraftStatus(trip.status)) {
    return (
      <PageContainer maxWidth="lg">
        <div className="space-y-4">
          <ErrorState
            title="Trip cannot be edited"
            description="Only draft trips can be edited. Return to the trip detail page."
          />
          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                void navigate(buildRoute.tripDetail(trip.id))
              }}
            >
              View trip
            </Button>
          </div>
        </div>
      </PageContainer>
    )
  }

  function handleSubmit(values: TripFormValues) {
    setApiError(null)
    updateTrip.mutate(
      {
        origin: values.origin.trim(),
        destination: values.destination.trim(),
        scheduledStart: datetimeLocalToIso(values.scheduledStart),
        vehicleId: values.vehicleId,
        notes: blankToUndefined(values.notes),
      },
      {
        onSuccess: () => {
          void navigate(buildRoute.tripDetail(trip.id))
        },
        onError: (error) => {
          setApiError(error)
        },
      },
    )
  }

  const title = trip.tripNumber ?? `${trip.origin} → ${trip.destination}`

  return (
    <PageContainer maxWidth="lg">
      <div className="space-y-6">
        <PageHeader title={`Edit ${title}`} description="Update draft trip details." />
        <Card>
          <CardContent className="pt-6">
            <TripForm
              mode="edit"
              isSubmitting={updateTrip.isPending}
              apiError={apiError}
              defaultValues={{
                origin: trip.origin,
                destination: trip.destination,
                scheduledStart: toDatetimeLocalValue(trip.scheduledStart),
                vehicleId: trip.vehicleId ?? trip.vehicle?.id ?? '',
                notes: trip.notes ?? '',
              }}
              onCancel={() => {
                void navigate(buildRoute.tripDetail(trip.id))
              }}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
