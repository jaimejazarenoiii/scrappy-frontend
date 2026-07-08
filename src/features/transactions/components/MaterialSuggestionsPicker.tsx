import { useEffect, useMemo, useState } from 'react'

import { Input } from '@/components/ui/input'
import { debounce } from '@/utils/debounce'

import { useMaterialSuggestions } from '../hooks/useTransactionSuggestions'

interface MaterialSuggestionsPickerProps {
  id?: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
}

export function MaterialSuggestionsPicker({
  id = 'materialName',
  value,
  onChange,
  disabled = false,
  placeholder = 'Search materials…',
}: MaterialSuggestionsPickerProps) {
  const [query, setQuery] = useState(value)
  const [debouncedQuery, setDebouncedQuery] = useState(value)

  const debouncedSetQuery = useMemo(
    () =>
      debounce((next: string) => {
        setDebouncedQuery(next)
      }, 300),
    [],
  )

  useEffect(() => {
    setQuery(value)
    setDebouncedQuery(value)
  }, [value])

  const suggestionsQuery = useMaterialSuggestions(debouncedQuery)

  return (
    <div className="space-y-2">
      <Input
        id={id}
        value={query}
        disabled={disabled}
        placeholder={placeholder}
        list={`${id}-suggestions`}
        onChange={(event) => {
          const next = event.target.value
          setQuery(next)
          onChange(next)
          debouncedSetQuery(next)
        }}
      />
      <datalist id={`${id}-suggestions`}>
        {(suggestionsQuery.data ?? []).map((suggestion) => (
          <option key={suggestion.materialName} value={suggestion.materialName} />
        ))}
      </datalist>
    </div>
  )
}
