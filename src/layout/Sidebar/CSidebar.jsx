import React, { useContext, useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import "./sidebar.css"

import signalRConnectionManager from "../../services/SignalRService"
import { Toast } from "primereact/toast"
import { AuthContext } from "../../context/AuthContext"
import { InputText } from "primereact/inputtext"

import { useRoutesData } from "../../context/RoutesContext"
import { useCheckDeviceHook } from "../../hooks/hooks"
import { displayYesNoDialog } from "../../utils/helpers"
import { LayoutDashboard } from "lucide-react"
import { SEVERITIES } from "../../utils/CONSTANTS"

const CSidebar = ({ sideBarRef, searchInputRef }) => {
  const user = JSON.parse(localStorage.getItem("user"))
  const toastRef = useRef(null)

  const { isMobileScreen } = useCheckDeviceHook()

  // useEffect(() => {
  //   async function configurationSetup() {
  //     let isSidebarOpen = localStorage.getItem("isSidebarOpen")
  //     if (isSidebarOpen) {
  //       sideBarRef.current.className = "c-sidebar"
  //     }
  //   }
  //   configurationSetup()

  //   return () => {
  //     localStorage.removeItem("isSidebarOpen")
  //   }
  // }, [])

  function closeMobieSidebar() {
    if (isMobileScreen) {
      sideBarRef.current?.classList.add("hidden")
    }
  }

  return (
    <>
      <div
        ref={sideBarRef}
        className={`${isMobileScreen ? "hidden" : "c-sidebar c-close"}`}
      >
        <div className="c-logo-details flex align-items-center justify-content-between">
          <span className="c-logo_name" style={{ marginLeft: "30px" }}>
            EDUIMS
          </span>
          <span className="c-logo_name block lg:hidden md:hidden xl:hidden">
            <i className="pi pi-times" onClick={closeMobieSidebar}></i>
          </span>
        </div>
        <SearchBar searchInputRef={searchInputRef} />

        <ul className="c-nav-links">
          <li className="flex justify-content-start gap-5">
            <Link to={"/"}>
              <i>
                <LayoutDashboard className="text-white " />
              </i>
              <span className="c-link_name">Dashboard</span>
            </Link>
            <ul className="c-sub-menu c-blank">
              <li>
                <Link className="c-link_name" to={"/"}>
                  Dashboard
                </Link>
              </li>
            </ul>
          </li>

          <SubSidebar closeMobieSidebar={closeMobieSidebar} />

          <li>
            <div className="c-profile-details">
              <div className="flex align-content-center justify-content-between w-full">
                <div className="ml-2">
                  <div className="c-profile_name" style={{ marginLeft: "5px" }}>
                    {user?.username}
                  </div>
                </div>
                <SignOut />
              </div>
            </div>
          </li>
        </ul>
      </div>
      <NotificationHandler toast={toastRef} />
      <Toast ref={toastRef} position="top-right" />
    </>
  )
}

export default CSidebar

const NotificationHandler = ({ toast }) => {
  const connection = signalRConnectionManager.getConnection()

  useEffect(() => {
    connection.on("ReceiveNotification", (message, route) => {
      toast.current.show({
        severity: "success",
        summary: message,
        sticky: true,
        content: (props) => (
          <div
            className="flex flex-column"
            style={{ flex: "1", justifyContent: "start" }}
          >
            <Link
              to={route}
              style={{ alignSelf: "start", color: "#1ea97c" }}
              onClick={() => toast.current.clear()}
            >
              <div
                className="font-medium text-lg my-3 text-900 text-green-700"
                style={{}}
              >
                {props.message.summary}
              </div>
            </Link>
          </div>
        ),
      })
    })
    connection.on("ReceiveAllNotification", (message) => {
      toast.current.show(message)
    })

    return () => {
      connection?.off("ReceiveNotification")
      connection?.off("ReceiveAllNotification")
    }
  }, [connection])

  return null
}

export const SignOut = () => {
  const { logoutUser } = useContext(AuthContext)

  const confirmLogout = () => {
    displayYesNoDialog({
      message: "Are you sure you want to logout?",
      header: "Confirmation",
      accept: () => logoutUser(),
      reject: () => null,
      icon: <i className="pi pi-info-circle text-5xl"></i>,
      severity: SEVERITIES.DANGER,
    })
  }

  return (
    <>
      <i
        className="pi pi-sign-out"
        onClick={confirmLogout}
        style={{ width: "50px", minWidth: "50px" }}
      ></i>
    </>
  )
}

const SubSidebar = ({ closeMobieSidebar }) => {
  const { filteredRoutes } = useRoutesData()
  return (
    <>
      {filteredRoutes &&
        filteredRoutes.map((route) => (
          <MenuGroup
            key={route.menuGroupKey}
            menuGroupName={route.menuGroupName}
            subItems={route.subItems}
            icon={route.icon}
            hideMenuGroup={!route?.hideMenuGroup}
            closeMobieSidebar={closeMobieSidebar}
          />
        ))}
    </>
  )
}

const MenuGroup = ({
  menuGroupName,
  subItems,
  icon,
  hideMenuGroup = false,
  closeMobieSidebar,
}) => {
  function toggleSubmenu(e) {
    let parent = e.target.parentNode.parentNode
    parent.classList.toggle("c-showMenu")
  }
  return (
    <>
      {!hideMenuGroup && (
        <li>
          <div className="c-iocn-link">
            <Link to={"#"}>
              <i className={`pi ${icon}`}></i>
              <span className="c-link_name">{menuGroupName}</span>
            </Link>
            <i
              className="pi pi-chevron-down c-arrow"
              onClick={toggleSubmenu}
            ></i>
          </div>
          <ul className="c-sub-menu" key={menuGroupName}>
            <li>
              <Link className="c-link_name" to={"#"}>
                {menuGroupName}
              </Link>
            </li>
            {subItems.length > 0 &&
              subItems.map((item) => (
                <MenuItem
                  key={item.menuKey}
                  name={item.name}
                  route={item.route}
                  showDividerOnTop={item?.showDividerOnTop}
                  hideMenuItem={item.ShowForm}
                  showForm={item.ShowForm}
                  closeMobieSidebar={closeMobieSidebar}
                />
              ))}
          </ul>
        </li>
      )}
    </>
  )
}

const MenuItem = ({
  route,
  name,
  showDividerOnTop = false,
  hideMenuItem = true,
  showForm = true,
  closeMobieSidebar,
}) => {
  return (
    <>
      {hideMenuItem && (
        <>
          {showDividerOnTop ? (
            <>
              <hr style={{ color: "white", padding: "0", margin: "0" }} />
              <li onClick={closeMobieSidebar}>
                <Link to={route}>{name}</Link>
              </li>
            </>
          ) : (
            <>
              <li onClick={closeMobieSidebar}>
                <Link to={route}>{name}</Link>
              </li>
            </>
          )}
        </>
      )}
    </>
  )
}

const SearchBar = ({ searchInputRef }) => {
  const [searchText, setSearchText] = useState("")

  const { authorizedRoutes, setFilteredRoutes } = useRoutesData()
  const filterRoutes = () => {
    if (!searchText) return authorizedRoutes

    return authorizedRoutes
      .map((group) => ({
        ...group,
        subItems: group.subItems.filter((subItem) =>
          subItem.name
            .toLowerCase()
            .replaceAll(" ", "")
            .includes(searchText.toLowerCase().replaceAll(" ", ""))
        ),
      }))
      .filter((group) => group.subItems.length > 0)
  }

  useEffect(() => {
    setFilteredRoutes(filterRoutes())
  }, [searchText, authorizedRoutes])

  return (
    <>
      <div className="text-center c-close" id="routeSearchContainer">
        <InputText
          ref={searchInputRef}
          prefix="pi pi-cog"
          placeholder="Ctrl + k to search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
    </>
  )
}
