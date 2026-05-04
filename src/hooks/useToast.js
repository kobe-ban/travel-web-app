import { useState, useCallback, useEffect, useRef } from 'react'

export function useToast() {
  const [toast, setToast] = useState(null)
  const timerRef = useRef(null)

  const showToast = useCallback((message, type = 'success') => {
    clearTimeout(timerRef.current)
    setToast({ message, type })
    timerRef.current = setTimeout(() => setToast(null), 4500)
  }, [])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  return { toast, showToast, clearToast: () => setToast(null) }
}
