import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { downloadBlob } from '../lib/report-api'
import { ReportService } from '../services/report.service'
import type { ReportDomain, ReportExportFormat, ReportFilterSet } from '../types/reports.types'
import { isReportFilterValid } from '../validation/report-filter.schema'
import { reportKeys } from './report-keys'
import { useReportFilterStore } from './useReportFilterStore'

function useDomainFilters(domain: ReportDomain): ReportFilterSet {
  return useReportFilterStore((state) => state.filtersByDomain[domain])
}

export function useTransactionReport(enabled = true) {
  const filters = useDomainFilters('transactions')
  const valid = isReportFilterValid(filters)

  return useQuery({
    queryKey: reportKeys.list('transactions', filters),
    queryFn: () => ReportService.listTransactions(filters),
    enabled: enabled && valid,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })
}

export function useTripReport(enabled = true) {
  const filters = useDomainFilters('trips')
  const valid = isReportFilterValid(filters)

  return useQuery({
    queryKey: reportKeys.list('trips', filters),
    queryFn: () => ReportService.listTrips(filters),
    enabled: enabled && valid,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })
}

export function useExpenseReport(enabled = true) {
  const filters = useDomainFilters('expenses')
  const valid = isReportFilterValid(filters)

  return useQuery({
    queryKey: reportKeys.list('expenses', filters),
    queryFn: () => ReportService.listExpenses(filters),
    enabled: enabled && valid,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })
}

export function usePayrollReport(enabled = true) {
  const filters = useDomainFilters('payroll')
  const valid = isReportFilterValid(filters)

  return useQuery({
    queryKey: reportKeys.list('payroll', filters),
    queryFn: () => ReportService.listPayroll(filters),
    enabled: enabled && valid,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })
}

export function useAttendanceReport(enabled = true) {
  const filters = useDomainFilters('attendance')
  const valid = isReportFilterValid(filters)

  return useQuery({
    queryKey: reportKeys.list('attendance', filters),
    queryFn: () => ReportService.listAttendance(filters),
    enabled: enabled && valid,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })
}

export function useReportExport(domain: ReportDomain) {
  const filters = useDomainFilters(domain)

  return useMutation({
    mutationFn: (format: ReportExportFormat) => ReportService.export(domain, filters, format),
    onSuccess: (result) => {
      downloadBlob(result.blob, result.filename)
      toast.success('Report downloaded')
    },
    onError: () => {
      toast.error('Failed to export report')
    },
  })
}
