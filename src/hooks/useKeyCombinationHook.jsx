import { useEffect } from "react"

const useKeyCombination = (callback, keyCombination, useCtrlKey = false) => {
  useEffect(() => {
    if (useCtrlKey) {
      const handleKeyDown = (event) => {
        if (event.ctrlKey && event.key === keyCombination) {
          event.preventDefault()
          callback()
        }
      }

      document.addEventListener("keydown", handleKeyDown)

      return () => {
        document.removeEventListener("keydown", handleKeyDown)
      }
    } else {
      const handleKeyDown = (event) => {
        if (event.altKey && event.key === keyCombination) {
          event.preventDefault()
          callback()
        }
      }

      document.addEventListener("keydown", handleKeyDown)

      return () => {
        document.removeEventListener("keydown", handleKeyDown)
      }
    }
  }, [callback, keyCombination])
}

export default useKeyCombination
