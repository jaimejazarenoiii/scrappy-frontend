import { Tag } from 'lucide-react'

import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { FormField } from '@/components/common/FormField'
import { Select } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

import { useExpenseCategories } from '../hooks/useExpenseCategories'

interface ExpenseCategorySelectProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  error?: string
}

export function ExpenseCategorySelect({
  value,
  onChange,
  disabled = false,
  error,
}: ExpenseCategorySelectProps) {
  const categoriesQuery = useExpenseCategories()

  if (categoriesQuery.isLoading) {
    return (
      <FormField label="Category" htmlFor="category" required>
        <Skeleton className="h-10 w-full" />
      </FormField>
    )
  }

  if (categoriesQuery.isError) {
    return (
      <div className="space-y-3">
        <ErrorState description="Could not load expense categories. Please try again." />
        <button
          type="button"
          className="text-primary text-sm underline"
          onClick={() => {
            void categoriesQuery.refetch()
          }}
        >
          Retry
        </button>
      </div>
    )
  }

  const categories = categoriesQuery.data ?? []

  if (categories.length === 0) {
    return (
      <EmptyState
        icon={Tag}
        title="No categories available"
        description="Expense categories must be configured on the backend before you can record expenses."
      />
    )
  }

  const sorted = [...categories].sort((a, b) => a.localeCompare(b))

  return (
    <FormField label="Category" htmlFor="category" error={error} required>
      <Select
        id="category"
        value={value}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        onChange={(event) => {
          onChange(event.target.value)
        }}
      >
        <option value="">Select category</option>
        {sorted.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </Select>
    </FormField>
  )
}
