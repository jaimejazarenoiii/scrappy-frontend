import type { TransactionItem } from '../types/transaction.types'

export function itemGroupKey(
  item: Pick<TransactionItem, 'materialName' | 'unit' | 'price'>,
): string {
  return `${item.materialName.trim().toLowerCase()}|${item.unit}|${String(item.price)}`
}

export interface TransactionItemGroup {
  key: string
  primaryItem: TransactionItem
  items: TransactionItem[]
  materialName: string
  unit: TransactionItem['unit']
  price: number
  totalWeight: number
  totalAmount: number
}

/** Groups matching material, unit, and price into one row with combined quantity. */
export function groupTransactionItems(items: TransactionItem[]): TransactionItemGroup[] {
  const groups = new Map<string, TransactionItemGroup>()

  for (const item of items) {
    const key = itemGroupKey(item)
    const existing = groups.get(key)

    if (!existing) {
      groups.set(key, {
        key,
        primaryItem: item,
        items: [item],
        materialName: item.materialName,
        unit: item.unit,
        price: item.price,
        totalWeight: item.weight,
        totalAmount: item.total,
      })
      continue
    }

    existing.items.push(item)
    existing.totalWeight += item.weight
    existing.totalAmount += item.total
  }

  return Array.from(groups.values())
}
