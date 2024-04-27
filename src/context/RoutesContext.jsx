import { createContext, useContext, useState } from "react"

export const RoutesContext = createContext()

export const RoutesProivder = ({ children }) => {
  const [authorizedRoutes, setAuthorizedRoutes] = useState([])
  const [filteredRoutes, setFilteredRoutes] = useState([])

  return (
    <RoutesContext.Provider
      value={{
        filteredRoutes,
        setFilteredRoutes,
        authorizedRoutes,
        setAuthorizedRoutes,
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
  } = useContext(RoutesContext)

  return {
    filteredRoutes,
    setFilteredRoutes,
    authorizedRoutes,
    setAuthorizedRoutes,
  }
}
