import { createContext, useCallback, useEffect, useState } from "react"
import {
  authorizedRoutes,
  initRoutesWithUserRights,
  routes,
} from "../utils/routes"

export const UserRightsContext = createContext()

export const UserRightsProivder = ({ children }) => {
  const [routesWithUserRights, setRoutesWithUserRights] = useState([])
  const [filteredRoutes, setFilteredRoutes] = useState([])

  useEffect(() => {
    /* This will be an api call for getting department or user rights */
    const allRoutesWithUserRights = initRoutesWithUserRights()
    setRoutesWithUserRights(allRoutesWithUserRights)
  }, [routes])

  /* When all routes with rights will be saved */
  const checkForUserRights = useCallback(
    ({ MenuKey, MenuGroupKey }) => {
      let ShowForm = false

      if (MenuKey && authorizedRoutes[0] === "allowAll") {
        ShowForm = true
      } else {
        for (let i = 0; i < authorizedRoutes.length; i++) {
          if (authorizedRoutes[i] === MenuKey) {
            ShowForm = true
            break
          }
        }
      }

      let routePermissions = null
      for (let i = 0; i < routesWithUserRights.length; i++) {
        const group = routesWithUserRights[i]
        if (group.menuGroupKey === MenuGroupKey) {
          for (let j = 0; j < group.subItems.length; j++) {
            const subItem = group.subItems[j]
            if (subItem.menuKey === MenuKey) {
              routePermissions = {
                RoleDelete: subItem.RoleDelete,
                RoleEdit: subItem.RoleEdit,
                RoleNew: subItem.RoleNew,
                RolePrint: subItem.RolePrint,
                ShowForm: subItem.ShowForm,
              }
              break
            }
          }
          if (routePermissions) break
        }
      }

      return routePermissions
    },
    [routesWithUserRights, authorizedRoutes]
  )

  return (
    <UserRightsContext.Provider
      value={{
        routesWithUserRights,
        setRoutesWithUserRights,
        checkForUserRights,
        filteredRoutes,
        setFilteredRoutes,
      }}
    >
      {children}
    </UserRightsContext.Provider>
  )
}
