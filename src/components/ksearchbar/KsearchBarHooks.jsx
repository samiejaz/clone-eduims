import { useState, useEffect, useRef } from "react"

export const useListNavigation = (initialIndex, itemsLength) => {
  const [index, setIndex] = useState(initialIndex)
  const listRef = useRef(null)
  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      setIndex((prevIndex) => prevIndex + 1)
    } else if (event.key === "ArrowUp") {
      setIndex((prevIndex) => Math.max(prevIndex - 1, 0))
    }
  }

  useEffect(() => {
    const listElement = listRef.current
    if (listElement) {
      listElement.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      if (listElement) {
        listElement.removeEventListener("keydown", handleKeyDown)
      }
    }
  }, [itemsLength, listRef])

  return { handleKeyDown, listRef }
}

export function useKeydown(callback, key) {
  const keys = Array.isArray(key) ? key : [key]

  const handleKeydown = (event) => {
    if (keys.includes(event.key)) {
      callback(event)
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown)

    return () => {
      window.removeEventListener("keydown", handleKeydown)
    }
  }, [keys, callback])
}

export function FocusableDiv({ children, onKeyDown, className }) {
  const divRef = useRef(null)

  useEffect(() => {
    const div = divRef.current
    div.addEventListener("keydown", onKeyDown)

    return () => {
      div.removeEventListener("keydown", onKeyDown)
    }
  }, [onKeyDown])

  return (
    <div ref={divRef} className={className} tabIndex="0">
      {children}
    </div>
  )
}

// Custom hook to listen for changes in localStorage
export const useLocalStorageListener = (key, callback) => {
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key) {
        callback(e.newValue)
      }
    }

    // Add event listener
    window.addEventListener("storage", handleStorageChange)

    // Cleanup: remove event listener
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [key, callback]) // Dependencies: key and callback
}

export const useCtrlKeyDown = (callback, key) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === key) {
        event.preventDefault()
        callback()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [key, callback])
}

export const useClickOutside = (callback, ref) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref, callback])
}
