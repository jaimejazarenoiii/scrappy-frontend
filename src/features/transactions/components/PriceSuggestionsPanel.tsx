import { formatDate } from '@/utils/format-date'

import { usePriceSuggestions } from '../hooks/useTransactionSuggestions'

interface PriceSuggestionsPanelProps {
  materialName?: string
  onSelectPrice?: (price: number) => void
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount)
}

/** Renders backend-provided price suggestions only — never computes prices on the frontend. */
export function PriceSuggestionsPanel({ materialName, onSelectPrice }: PriceSuggestionsPanelProps) {
  const suggestionsQuery = usePriceSuggestions(materialName)
  const suggestions = suggestionsQuery.data ?? []

  if (!materialName?.trim()) {
    return (
      <p className="text-muted-foreground text-sm">Enter a material to see suggested prices.</p>
    )
  }

  if (suggestionsQuery.isLoading) {
    return <p className="text-muted-foreground text-sm">Loading price suggestions…</p>
  }

  if (suggestions.length === 0) {
    return <p className="text-muted-foreground text-sm">No price suggestions for this material.</p>
  }

  return (
    <ul className="space-y-2" aria-label="Price suggestions">
      {suggestions.map((suggestion) => (
        <li key={`${String(suggestion.price)}-${suggestion.lastUsedAt}`}>
          <button
            type="button"
            className="hover:bg-muted flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors"
            onClick={() => {
              onSelectPrice?.(suggestion.price)
            }}
          >
            <span className="font-medium">{formatCurrency(suggestion.price)}</span>
            <span className="text-muted-foreground text-xs">
              Last used {formatDate(suggestion.lastUsedAt)}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}
