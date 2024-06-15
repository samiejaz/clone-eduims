import { Outlet } from "react-router-dom"

import CSidebar from "./Sidebar/CSidebar"
import { useContext, useEffect, useRef } from "react"

import useKeyCombination from "../hooks/useKeyCombinationHook"
import useUserProfile from "../hooks/useUserProfile"
import { useCheckDeviceHook } from "../hooks/hooks"
import { useThemeProvider } from "../context/ThemeContext"
import { PrimeReactContext } from "primereact/api"

function RootLayout() {
  const sidebarRef = useRef()
  const searchInputRef = useRef()

  const { isMobileScreen } = useCheckDeviceHook()

  useKeyCombination(
    () => {
      toggleSideBar(true)
    },
    "k",
    true
  )

  function toggleSideBar(openSideBarOnly = false) {
    if (!openSideBarOnly) {
      if (sidebarRef.current.className.includes("c-close")) {
        sidebarRef.current.className = "c-sidebar"
        searchInputRef.current?.focus()
        localStorage.setItem("isSidebarOpen", true)
      } else {
        sidebarRef.current.className = "c-sidebar c-close"
        localStorage.removeItem("isSidebarOpen")
      }
    } else {
      if (sidebarRef.current.className.includes("c-close")) {
        sidebarRef.current.className = "c-sidebar"
        searchInputRef.current?.focus()
        localStorage.setItem("isSidebarOpen", true)
      } else {
        searchInputRef.current?.focus()
      }
    }
  }

  function handleMobileToggleSidebar() {
    sidebarRef.current.className = "c-sidebar a-sidebar"
  }

  return (
    <>
      <div>
        <CSidebar
          sideBarRef={sidebarRef}
          searchInputRef={searchInputRef}
        ></CSidebar>

        <section className={`${isMobileScreen ? "w-full" : "c-home-section"}`}>
          <div className="c-home-content">
            <Header
              toggleSidebar={toggleSideBar}
              handleMobileToggleSidebar={handleMobileToggleSidebar}
            />
          </div>
          <div className="px-3 mt-4">
            <Outlet />
          </div>
        </section>
      </div>
    </>
  )
}

function Header({ toggleSidebar, handleMobileToggleSidebar }) {
  const { isMobileScreen } = useCheckDeviceHook()
  const { handleShowProfile, render } = useUserProfile()
  const { setTheme, theme } = useThemeProvider()

  const { changeTheme } = useContext(PrimeReactContext)

  const changeMyTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    changeTheme(`lara-${theme}-green`, `lara-${newTheme}-green`, "app-theme")
    localStorage.setItem("activeTheme", theme)
  }

  // useEffect(() => {
  //   const activeTheme = localStorage.getItem("activeTheme")
  //   if (activeTheme) {
  //     console.log("Active", activeTheme)
  //     setTheme(activeTheme)
  //     changeMyTheme(activeTheme)
  //   }
  // }, [])

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
        className="mt-4 px-4 lg:px-0 xl:px-0 md:px-0"
      >
        {!isMobileScreen ? (
          <>
            <i
              className="pi pi-bars hoverIcon"
              onClick={() => {
                toggleSidebar()
              }}
            ></i>
          </>
        ) : (
          <i
            className="pi pi-bars hoverIcon"
            onClick={() => {
              handleMobileToggleSidebar()
            }}
          ></i>
        )}
        <div className="flex align-items-center gap-4">
          <i
            className="pi pi-user hoverIcon"
            onClick={() => {
              handleShowProfile()
            }}
          ></i>
          <i
            className={`pi pi-${theme === "dark" ? "sun" : "moon"} hoverIcon`}
            onClick={() => {
              setTheme((prev) => (prev === "light" ? "dark" : "light"))
              changeMyTheme()
            }}
          ></i>
        </div>
      </div>
      {render}
    </>
  )
}

export default RootLayout
