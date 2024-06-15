import React, { useEffect, useState } from "react"
import { Route, Routes, useNavigate } from "react-router-dom"
import { ROUTE_URLS } from "../../utils/enums"
import { SyncRoutesPage } from "./index"
import { useKeyCombinationHook } from "../../hooks/hooks"
import { ShowErrorToast } from "../../utils/CommonFunctions"

const AdminPageWrapper = ({ children }) => {
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showField, setShowField] = useState(false)
  const navigate = useNavigate()

  const correctPassword = "correctPassword"

  const handlePasswordSubmit = () => {
    if (password === correctPassword) {
      setIsAuthenticated(true)
      navigate(ROUTE_URLS.ADMIN.SYNC_ROUTES, { replace: true })
    } else {
      alert("Incorrect password")
    }
  }

  useKeyCombinationHook(handlePasswordSubmit, "g", true)
  useKeyCombinationHook(() => setShowField(true), "s", true)

  return (
    <div>
      {!isAuthenticated ? (
        <>
          {showField && (
            <div className="flex align-items-center justify-content-center min-h-screen">
              <input
                type="password"
                className="p-inputtext"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}
        </>
      ) : (
        children
      )}
    </div>
  )
}

const AdminPages = () => {
  return (
    <Routes>
      <Route
        path={ROUTE_URLS.ADMIN.SYNC_ROUTES.replaceAll("/admin", "")}
        element={
          <AdminPageWrapper>
            <SyncRoutesPage />
          </AdminPageWrapper>
        }
      />
    </Routes>
  )
}

export default AdminPages
