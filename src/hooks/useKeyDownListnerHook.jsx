import { useEffect } from "react"

export default function useKeyDown(callback, keys, condition) {
  const onKeyDown = (event) => {
    const wasAnyKeyPressed = keys.some((key) => event.key === key)
    if (wasAnyKeyPressed && condition) {
      event.preventDefault()
      callback()
    }
  }

  useEffect(() => {
    if (condition) {
      document.addEventListener("keydown", onKeyDown)
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [onKeyDown, condition])
}
