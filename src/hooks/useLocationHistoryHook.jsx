import { useLocation } from "react-router-dom"

export default function useLocationHistory() {
  const location = useLocation()
  const path = location.pathname
  const store = window.localStorage
  let url = ""
  let prevUrl = ""

  url = store.getItem("url")
  store.setItem("prevUrl", url)
  store.setItem("url", path)

  url = store.getItem("url")
  prevUrl = store.getItem("prevUrl")

  return { url, prevUrl }
}
