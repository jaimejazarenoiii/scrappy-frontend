import { useCallback } from 'react'

import { formatRecordEmployeeLabel, type WorkforceEmployeeRecord } from '../lib/employee-display'
import { useEmployeeLabelMap } from './useEmployeeLabelMap'

export function useFormatRecordEmployee() {
  const labelMap = useEmployeeLabelMap()

  return useCallback(
    (record: WorkforceEmployeeRecord) => formatRecordEmployeeLabel(record, labelMap),
    [labelMap],
  )
}
