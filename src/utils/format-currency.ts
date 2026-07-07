export function formatCurrency(amount: number, currency = 'PHP', locale = 'en-PH'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}
