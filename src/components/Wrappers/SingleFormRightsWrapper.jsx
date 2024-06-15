import React, { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Routes, Route } from "react-router-dom"
import { useUserData } from "../../context/AuthContext"
import { checkForUserRightsAsync } from "../../api/MenusData"
import AccessDeniedPage from "../AccessDeniedPage"

function SingleFormRightsWrapper({ menuKey, FormComponent }) {
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
            <Route index element={<FormComponent userRights={userRights} />} />
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

export default SingleFormRightsWrapper
