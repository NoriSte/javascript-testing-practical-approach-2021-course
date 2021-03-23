import { useEffect, useRef } from 'react'

const usePreviousValue = <T>(value: T): T | undefined => {
  const prevValue = useRef<T | undefined>()

  useEffect(() => {
    prevValue.current = value

    return () => {
      prevValue.current = undefined
    }
  })

  return prevValue.current
}
export default usePreviousValue
