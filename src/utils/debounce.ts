export function debounce<T extends (...args: never[]) => void>(fn: T, ms: number) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  const debounced = (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      fn(...args)
    }, ms)
  }

  debounced.cancel = () => {
    if (timeoutId) clearTimeout(timeoutId)
  }

  return debounced
}
