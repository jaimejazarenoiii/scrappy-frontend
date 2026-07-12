import { Pencil } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'

import { DescriptionItem, DescriptionList } from '@/components/common/DescriptionList'
import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { ErrorState } from '@/components/feedback/ErrorState'
import { PageSkeleton } from '@/components/feedback/PageSkeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PERMISSIONS } from '@/constants/permissions'
import { buildRoute, ROUTES } from '@/constants/routes'
import { PermissionGate } from '@/features/authorization/components/PermissionGate'
import { formatDate } from '@/utils/format-date'

import { TripMembersPanel } from '../components/TripMembersPanel'
import { TripOdometerSummary } from '../components/TripOdometerSummary'
import { TripRouteSummary } from '../components/TripRouteSummary'
import { TripStatusBadge } from '../components/TripStatusBadge'
import { TripTransactionsPanel } from '../components/TripTransactionsPanel'
import { TripVehiclePanel } from '../components/TripVehiclePanel'
import { TripWorkflowActions } from '../components/TripWorkflowActions'
import { TripWorkflowTimeline } from '../components/TripWorkflowTimeline'
import { useTrip } from '../hooks/useTrip'
import { useTripTimeline } from '../hooks/useTripTimeline'
import { isDraftStatus } from '../lib/trip-workflow'

function tripTitle(trip: {
  tripNumber: string | null
  origin: string
  destination: string
}): string {
  return trip.tripNumber ?? `${trip.origin} → ${trip.destination}`
}

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const tripQuery = useTrip(id)
  const timelineQuery = useTripTimeline(id, tripQuery.data)

  useEffect(() => {
    document.title = 'Trip details | Scrappy'
  }, [])

  if (tripQuery.isLoading) {
    return <PageSkeleton />
  }

  if (tripQuery.isError || !tripQuery.data) {
    return (
      <PageContainer maxWidth="lg">
        <div className="space-y-4">
          <ErrorState
            title="Trip not found"
            description="This trip may have been removed or you may not have access."
          />
          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                void navigate(ROUTES.trips)
              }}
            >
              Back to trips
            </Button>
          </div>
        </div>
      </PageContainer>
    )
  }

  const trip = tripQuery.data

  return (
    <PageContainer maxWidth="lg">
      <div className="space-y-6">
        <PageHeader
          title={tripTitle(trip)}
          description={`${trip.origin} → ${trip.destination}`}
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <TripWorkflowActions trip={trip} />
              <PermissionGate permission={PERMISSIONS.trips.update}>
                {isDraftStatus(trip.status) ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      void navigate(buildRoute.tripEdit(trip.id))
                    }}
                  >
                    <Pencil className="size-4" />
                    Edit
                  </Button>
                ) : null}
              </PermissionGate>
            </div>
          }
        />

        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <DescriptionList>
              <DescriptionItem label="Status">
                <TripStatusBadge status={trip.status} />
              </DescriptionItem>
              <DescriptionItem label="Created">{formatDate(trip.createdAt)}</DescriptionItem>
              <DescriptionItem label="Last updated">{formatDate(trip.updatedAt)}</DescriptionItem>
              {trip.notes ? <DescriptionItem label="Notes">{trip.notes}</DescriptionItem> : null}
              {trip.cancellationReason ? (
                <DescriptionItem label="Cancellation reason">
                  {trip.cancellationReason}
                </DescriptionItem>
              ) : null}
            </DescriptionList>

            <TripRouteSummary trip={trip} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Odometer</CardTitle>
          </CardHeader>
          <CardContent>
            <TripOdometerSummary trip={trip} />
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <TripMembersPanel trip={trip} />
          <TripVehiclePanel trip={trip} />
        </div>

        <TripTransactionsPanel trip={trip} />

        <Card>
          <CardHeader>
            <CardTitle>History</CardTitle>
          </CardHeader>
          <CardContent>
            <TripWorkflowTimeline
              events={timelineQuery.events}
              isLoading={timelineQuery.isLoading}
              isError={timelineQuery.isError}
              onRetry={() => {
                void timelineQuery.refetch()
              }}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
