import { createContext, useContext, useState } from "react"

export const RoutesContext = createContext()

export const RoutesProivder = ({ children }) => {
  const [authorizedRoutes, setAuthorizedRoutes] = useState([])
  const [filteredRoutes, setFilteredRoutes] = useState([])
  const [originalRoutes, setOriginalRoutes] = useState([])

  return (
    <RoutesContext.Provider
      value={{
        filteredRoutes,
        setFilteredRoutes,
        authorizedRoutes,
        setAuthorizedRoutes,
        originalRoutes,
        setOriginalRoutes,
      }}
    >
      {children}
    </RoutesContext.Provider>
  )
}

export function useRoutesData() {
  const {
    filteredRoutes,
    setFilteredRoutes,
    authorizedRoutes,
    setAuthorizedRoutes,
    originalRoutes,
    setOriginalRoutes,
  } = useContext(RoutesContext)

  return {
    filteredRoutes,
    setFilteredRoutes,
    authorizedRoutes,
    setAuthorizedRoutes,
    originalRoutes,
    setOriginalRoutes,
  }
}
