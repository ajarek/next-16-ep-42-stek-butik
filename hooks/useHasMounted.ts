import { useSyncExternalStore } from "react"

const emptySubscribe = () => () => {}

/**
 * Custom hook that returns true after client-side hydration completes.
 * Uses useSyncExternalStore to avoid synchronous setState inside useEffect,
 * preventing cascading re-renders and React Compiler / ESLint warnings.
 */
export function useHasMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,  // Client snapshot
    () => false  // Server snapshot
  )
}
