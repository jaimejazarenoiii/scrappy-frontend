import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { PERMISSIONS } from '@/constants/permissions'
import { PermissionGate } from '@/features/authorization/components/PermissionGate'
import { useTripLoadSettings } from '@/features/trips/hooks/useTripLoad'
import { useUpdateTripLoadSettings } from '@/features/trips/hooks/useTripLoadMutations'

export function TripLoadCompanySettingsCard() {
  const settingsQuery = useTripLoadSettings()
  const updateSettings = useUpdateTripLoadSettings()

  return (
    <PermissionGate anyOf={[PERMISSIONS.trips.loadManage, PERMISSIONS.trips.update]}>
      <Card>
        <CardHeader>
          <CardTitle>Trip load defaults</CardTitle>
          <CardDescription>
            Default overselling behavior when a trip load is enabled without an explicit setting.
            You can still override per trip from Trip Load.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {settingsQuery.isLoading ? (
            <Skeleton className="h-6 w-64" />
          ) : settingsQuery.isError ? (
            <p className="text-muted-foreground text-sm">Could not load trip load settings.</p>
          ) : (
            <label className="flex cursor-pointer items-start gap-3">
              <Checkbox
                checked={settingsQuery.data?.defaultStrictLoadValidation === true}
                disabled={updateSettings.isPending}
                onChange={(event) => {
                  updateSettings.mutate({
                    defaultStrictLoadValidation: event.target.checked,
                  })
                }}
              />
              <span className="space-y-1">
                <span className="block font-medium">Block overselling by default</span>
                <span className="text-muted-foreground block text-sm">
                  When on, outbound sales that exceed loaded quantities are rejected. When off, they
                  succeed with warnings.
                </span>
              </span>
            </label>
          )}
        </CardContent>
      </Card>
    </PermissionGate>
  )
}
