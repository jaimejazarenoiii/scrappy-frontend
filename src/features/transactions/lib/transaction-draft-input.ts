import type { UpdateTransactionInput } from '../types/transaction.types'
import type { TransactionDraftValues } from '../validation/transaction.schema'

/** Maps draft form values to a PATCH payload compatible with Backend P004. */
export function toUpdateTransactionInput(values: TransactionDraftValues): UpdateTransactionInput {
  return {
    direction: values.direction,
    partyName: values.partyName,
    partyContactNumber: values.partyContactNumber?.trim()
      ? values.partyContactNumber.trim()
      : undefined,
    transactionDate: values.transactionDate?.trim() ? values.transactionDate.trim() : undefined,
    locationType: values.locationType,
    branchId:
      values.locationType === 'BRANCH' && values.branchId?.trim() ? values.branchId : undefined,
    warehouseId:
      values.locationType === 'WAREHOUSE' && values.warehouseId?.trim()
        ? values.warehouseId
        : undefined,
    outsideLocationName:
      values.locationType === 'OUTSIDE' && values.outsideLocationName?.trim()
        ? values.outsideLocationName
        : undefined,
    outsideAddress:
      values.locationType === 'OUTSIDE' && values.outsideAddress?.trim()
        ? values.outsideAddress
        : undefined,
    tripId:
      values.locationType === 'TRIP' && values.tripId?.trim() ? values.tripId.trim() : undefined,
    notes: values.notes?.trim() ? values.notes : undefined,
    assignedEmployeeIds: values.assignedEmployeeIds,
  }
}

export function hasUpdatePayload(input: UpdateTransactionInput): boolean {
  return Object.keys(input).length > 0
}
