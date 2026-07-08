import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { NormalizedApiError } from '@/lib/axios'

import { AttendanceService } from '../services/attendance.service'
import type {
  Attendance,
  AttendanceCorrectionInput,
  AttendanceNoteInput,
} from '../types/attendance.types'
import { attendanceKeys } from './useAttendances'

function handleMutationError(
  error: NormalizedApiError,
  queryClient: ReturnType<typeof useQueryClient>,
  fallback: string,
) {
  if (error.code === 'LIFECYCLE_CONFLICT' || error.code === 'BUSINESS_RULE_VIOLATION') {
    toast.error(error.message || fallback)
    void queryClient.invalidateQueries({ queryKey: attendanceKeys.all })
    return
  }
  toast.error(error.message || fallback)
}

export function useTimeInAttendance() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input?: AttendanceNoteInput) => AttendanceService.timeIn(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: attendanceKeys.all })
      toast.success('Time in recorded')
    },
    onError: (error: NormalizedApiError) => {
      handleMutationError(error, queryClient, 'Could not record time in')
    },
  })
}

export function useTimeOutAttendance() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input?: AttendanceNoteInput) => AttendanceService.timeOut(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: attendanceKeys.all })
      toast.success('Time out recorded')
    },
    onError: (error: NormalizedApiError) => {
      handleMutationError(error, queryClient, 'Could not record time out')
    },
  })
}

export function useCorrectAttendance(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: AttendanceCorrectionInput) => AttendanceService.correct(id, input),
    onSuccess: (attendance: Attendance) => {
      queryClient.setQueryData(attendanceKeys.detail(id), attendance)
      void queryClient.invalidateQueries({ queryKey: attendanceKeys.all })
      toast.success('Attendance updated')
    },
    onError: (error: NormalizedApiError) => {
      handleMutationError(error, queryClient, 'Could not update attendance')
    },
  })
}
