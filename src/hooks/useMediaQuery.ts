import { useEffect, useState } from 'react'

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const media = window.matchMedia(query)
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }
    setMatches(media.matches)
    media.addEventListener('change', listener)
    return () => {
      media.removeEventListener('change', listener)
    }
  }, [query])

  return matches
}

export function useIsMobile() {
  return useMediaQuery('(max-width: 767px)')
}

export function useIsTablet() {
  return useMediaQuery('(min-width: 768px) and (max-width: 1279px)')
}

export function useIsDesktop() {
  return useMediaQuery('(min-width: 1280px)')
}
