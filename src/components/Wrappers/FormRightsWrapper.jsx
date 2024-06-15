import React, { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Routes, Route } from "react-router-dom"
import { useUserData } from "../../context/AuthContext"
import { checkForUserRightsAsync } from "../../api/MenusData"
import AccessDeniedPage from "../AccessDeniedPage"

function FormRightsWrapper({
  menuKey,
  DetailComponent,
  FormComponent,
  identity,
}) {
  const [userRights, setUserRights] = useState([])

  const user = useUserData()

  const { data: rights } = useQuery({
    queryKey: ["formRights", menuKey],
    queryFn: () =>
      checkForUserRightsAsync({
        MenuKey: menuKey,
        LoginUserID: user?.userID,
      }),
    initialData: [],
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (rights) {
      setUserRights(rights)
    }
  }, [rights])

  return (
    <>
      <Routes>
        {userRights.length > 0 && userRights[0].ShowForm ? (
          <>
            <Route
              index
              element={<DetailComponent userRights={userRights} />}
            />
            <Route
              path={`:${identity}`}
              element={
                <FormComponent
                  key={`${menuKey}ViewRoute`}
                  mode={"view"}
                  userRights={userRights}
                />
              }
            />
            <Route
              path={`edit/:${identity}`}
              element={
                <>
                  {userRights[0].RoleEdit ? (
                    <>
                      <FormComponent
                        key={`${menuKey}EditRoute`}
                        mode={"edit"}
                        userRights={userRights}
                      />
                    </>
                  ) : (
                    <AccessDeniedPage />
                  )}
                </>
              }
            />
            <Route
              path={`new`}
              element={
                <>
                  {userRights[0].RoleNew ? (
                    <>
                      <FormComponent
                        key={`${menuKey}NewRoute `}
                        mode={"new"}
                        userRights={userRights}
                      />
                    </>
                  ) : (
                    <AccessDeniedPage />
                  )}
                </>
              }
            />
          </>
        ) : (
          <Route
            path="*"
            element={
              <>
                <AccessDeniedPage />
              </>
            }
          />
        )}
      </Routes>
    </>
  )
}

export default FormRightsWrapper
