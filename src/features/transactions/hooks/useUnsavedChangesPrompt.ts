import { useEffect } from 'react'
import { useBlocker } from 'react-router'

/**
 * Blocks in-app navigation and tab close when there are unsaved changes.
 * Returns a React Router blocker; render a confirm dialog when `blocker.state === 'blocked'`.
 */
export function useUnsavedChangesPrompt(shouldWarn: boolean) {
  useEffect(() => {
    if (!shouldWarn) return

    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault()
    }

    window.addEventListener('beforeunload', handler)
    return () => {
      window.removeEventListener('beforeunload', handler)
    }
  }, [shouldWarn])

  return useBlocker(
    ({ currentLocation, nextLocation }) =>
      shouldWarn && currentLocation.pathname !== nextLocation.pathname,
  )
}
