import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import { useEmployeeOptions } from '@/features/employees/hooks/useEmployeeOptions'

interface TransactionEmployeePickerProps {
  selectedIds: string[]
  disabled?: boolean
  onChange: (ids: string[]) => void
}

export function TransactionEmployeePicker({
  selectedIds,
  disabled = false,
  onChange,
}: TransactionEmployeePickerProps) {
  const employeeOptions = useEmployeeOptions()

  if (employeeOptions.isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full rounded-md" />
        ))}
      </div>
    )
  }

  if (employeeOptions.isError) {
    return (
      <p className="text-destructive text-sm" role="alert">
        Could not load employees. Please refresh and try again.
      </p>
    )
  }

  const options = employeeOptions.data ?? []

  if (options.length === 0) {
    return (
      <p className="text-muted-foreground rounded-md border border-dashed p-4 text-sm">
        No active employees found. Add employees under Organization before creating a transaction.
      </p>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((option) => {
        const checked = selectedIds.includes(option.value)
        return (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-2 rounded-md border p-2"
          >
            <Checkbox
              checked={checked}
              disabled={disabled}
              onChange={(event) => {
                const next = event.target.checked
                  ? [...selectedIds, option.value]
                  : selectedIds.filter((id) => id !== option.value)
                onChange(next)
              }}
            />
            <span className="text-sm">{option.label}</span>
          </label>
        )
      })}
    </div>
  )
}
