import { ChevronDown } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'

import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PERMISSIONS } from '@/constants/permissions'
import { PermissionGate } from '@/features/authorization/components/PermissionGate'
import { usePermissions } from '@/features/authorization/hooks/usePermissions'
import { useIsDesktop } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import type { NormalizedApiError } from '@/lib/axios'

import { TripLoadEditableTable } from './TripLoadEditableTable'
import { TripLoadEmptyState } from './TripLoadEmptyState'
import { TripLoadItemDialog } from './TripLoadItemDialog'
import { TripLoadProgressTable } from './TripLoadProgressTable'
import { hasTripLoadAlertRows } from '../lib/trip-load-eligibility'
import { TripLoadSectionSkeleton } from './TripLoadSectionSkeleton'
import { TripLoadSummaryCard } from './TripLoadSummaryCard'
import { TripLoadToolbar } from './TripLoadToolbar'
import { useTripLoad, useTripLoadProgress } from '../hooks/useTripLoad'
import {
  useAddTripLoadItem,
  useDeleteTripLoadItem,
  useUpdateTripLoadItem,
} from '../hooks/useTripLoadMutations'
import {
  isTripLoadEditable,
  shouldShowProgressView,
  shouldShowTripLoadSection,
} from '../lib/trip-load-eligibility'
import { isStartedStatus } from '../lib/trip-workflow'
import type { TripDetail } from '../types/trip.types'
import type { TripLoadItem } from '../types/trip-load.types'
import type { TripLoadItemFormValues } from '../validation/trip-load-item.schema'

interface TripLoadSectionProps {
  trip: TripDetail
}

interface TripLoadResponsiveShellProps {
  title: string
  defaultExpanded: boolean
  children: ReactNode
  toolbar?: ReactNode
}

function TripLoadResponsiveShell({
  title,
  defaultExpanded,
  children,
  toolbar,
}: TripLoadResponsiveShellProps) {
  const isDesktop = useIsDesktop()
  const [expanded, setExpanded] = useState(defaultExpanded)

  useEffect(() => {
    if (defaultExpanded) {
      setExpanded(true)
    }
  }, [defaultExpanded])

  if (isDesktop) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>{title}</CardTitle>
          {toolbar}
        </CardHeader>
        <CardContent className="space-y-6">{children}</CardContent>
      </Card>
    )
  }

  return (
    <details
      open={expanded}
      className="group bg-card rounded-lg border"
      onToggle={(event) => {
        setExpanded(event.currentTarget.open)
      }}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 [&::-webkit-details-marker]:hidden">
        <span className="font-semibold">{title}</span>
        <div className="flex items-center gap-2">
          {toolbar}
          <ChevronDown className="text-muted-foreground size-4 transition-transform group-open:rotate-180" />
        </div>
      </summary>
      <div className={cn('space-y-6 border-t px-4 pt-4 pb-4')}>{children}</div>
    </details>
  )
}

export function TripLoadSection({ trip }: TripLoadSectionProps) {
  if (!shouldShowTripLoadSection(trip)) {
    return null
  }

  return <TripLoadSectionContent trip={trip} />
}

function TripLoadSectionContent({ trip }: TripLoadSectionProps) {
  const { has } = usePermissions()
  const showProgress = shouldShowProgressView(trip)
  const editable = isTripLoadEditable(trip)
  const canManage = has(PERMISSIONS.trips.loadManage) && editable

  const loadQuery = useTripLoad(trip.id, !showProgress)
  const progressQuery = useTripLoadProgress(trip.id, showProgress)

  const addItem = useAddTripLoadItem(trip.id)
  const deleteItem = useDeleteTripLoadItem(trip.id)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<TripLoadItem | null>(null)
  const [itemToDelete, setItemToDelete] = useState<TripLoadItem | null>(null)
  const [dialogError, setDialogError] = useState<NormalizedApiError | null>(null)

  const updateItem = useUpdateTripLoadItem(trip.id, editingItem?.id ?? '')

  const isLoading = showProgress ? progressQuery.isLoading : loadQuery.isLoading
  const isError = showProgress ? progressQuery.isError : loadQuery.isError
  const refetch = showProgress ? progressQuery.refetch : loadQuery.refetch

  const progressRows = progressQuery.data?.rows ?? []
  const loadItems = loadQuery.data?.items ?? []
  const summary = loadQuery.data?.summary
  const autoExpand = showProgress && hasTripLoadAlertRows(progressRows)

  const isMutating = addItem.isPending || updateItem.isPending || deleteItem.isPending

  function openAddDialog() {
    setEditingItem(null)
    setDialogError(null)
    setDialogOpen(true)
  }

  function openEditDialog(item: TripLoadItem) {
    setEditingItem(item)
    setDialogError(null)
    setDialogOpen(true)
  }

  function handleDialogSubmit(values: TripLoadItemFormValues) {
    setDialogError(null)

    if (editingItem) {
      updateItem.mutate(
        {
          materialName: values.materialName.trim(),
          quantity: values.quantity,
          unit: values.unit,
          notes: values.notes?.trim() ? values.notes.trim() : null,
        },
        {
          onSuccess: () => {
            setDialogOpen(false)
            setEditingItem(null)
          },
          onError: (error) => {
            setDialogError(error)
          },
        },
      )
      return
    }

    addItem.mutate(
      {
        materialName: values.materialName.trim(),
        quantity: values.quantity,
        unit: values.unit,
        notes: values.notes?.trim() ? values.notes.trim() : null,
      },
      {
        onSuccess: () => {
          setDialogOpen(false)
        },
        onError: (error) => {
          setDialogError(error)
        },
      },
    )
  }

  const toolbar =
    canManage && !showProgress ? (
      <PermissionGate permission={PERMISSIONS.trips.loadManage}>
        <TripLoadToolbar onAddItem={openAddDialog} disabled={isMutating} />
      </PermissionGate>
    ) : null

  let body: ReactNode

  if (isLoading) {
    body = <TripLoadSectionSkeleton />
  } else if (isError) {
    body = (
      <div className="space-y-3">
        <ErrorState title="Could not load trip load" description="Please try again." />
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              void refetch()
            }}
          >
            Retry
          </Button>
        </div>
      </div>
    )
  } else if (showProgress) {
    body =
      progressRows.length === 0 ? (
        <TripLoadEmptyState editable={false} readOnlyStarted={isStartedStatus(trip.status)} />
      ) : (
        <TripLoadProgressTable rows={progressRows} />
      )
  } else {
    body = (
      <>
        {summary ? <TripLoadSummaryCard summary={summary} /> : null}
        {loadItems.length === 0 ? (
          <TripLoadEmptyState
            editable={canManage}
            onAddItem={canManage ? openAddDialog : undefined}
          />
        ) : (
          <TripLoadEditableTable
            items={loadItems}
            canManage={canManage}
            isMutating={isMutating}
            onEdit={openEditDialog}
            onRemove={setItemToDelete}
          />
        )}
      </>
    )
  }

  return (
    <>
      <TripLoadResponsiveShell title="Trip load" defaultExpanded={autoExpand} toolbar={toolbar}>
        {body}
      </TripLoadResponsiveShell>

      <TripLoadItemDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) {
            setEditingItem(null)
            setDialogError(null)
          }
        }}
        item={editingItem}
        isSubmitting={addItem.isPending || updateItem.isPending}
        apiError={dialogError}
        onSubmit={handleDialogSubmit}
      />

      <ConfirmDialog
        open={Boolean(itemToDelete)}
        onOpenChange={(open) => {
          if (!open) setItemToDelete(null)
        }}
        title="Remove load item?"
        description="This material line will be removed from the trip load plan."
        confirmLabel="Remove"
        variant="destructive"
        isLoading={deleteItem.isPending}
        onConfirm={() => {
          if (!itemToDelete) return
          void deleteItem.mutateAsync(itemToDelete.id, {
            onSuccess: () => {
              setItemToDelete(null)
            },
          })
        }}
      />
    </>
  )
}
