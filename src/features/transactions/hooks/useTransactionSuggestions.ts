import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { TransactionService } from '../services/transaction.service'
import type { MaterialSuggestion, PriceSuggestion } from '../types/transaction.types'

export const transactionSuggestionsKeys = {
  material: (q: string) => ['transactions', 'suggestions', 'materials', q] as const,
  price: (materialName: string) => ['transactions', 'suggestions', 'prices', materialName] as const,
}

export function useMaterialSuggestions(q?: string, limit = 10) {
  const query = q?.trim()
  return useQuery({
    queryKey: query
      ? transactionSuggestionsKeys.material(query)
      : transactionSuggestionsKeys.material(''),
    enabled: Boolean(query),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    queryFn: () => TransactionService.materialSuggestions(query, limit),
  })
}

export function usePriceSuggestions(materialName?: string, limit = 10) {
  const query = materialName?.trim()
  return useQuery({
    queryKey: query
      ? transactionSuggestionsKeys.price(query)
      : transactionSuggestionsKeys.price(''),
    enabled: Boolean(query),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    queryFn: () => {
      if (!query) throw new Error('Missing materialName')
      return TransactionService.priceSuggestions(query, limit)
    },
  })
}

export type { MaterialSuggestion, PriceSuggestion }
