import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { checkForUserRightsAsync } from "../../api/MenusData"
import AccessDeniedPage from "../AccessDeniedPage"
import { useUserData } from "../../context/AuthContext"

export default function ReportRightsWrapper({ menuKey, ReportComponent }) {
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
      {userRights.length > 0 && userRights[0].ShowForm ? (
        <ReportComponent userRights={userRights} />
      ) : (
        <AccessDeniedPage />
      )}
    </>
  )
}
