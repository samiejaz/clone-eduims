import { Outlet } from "react-router-dom";
import { Navbar } from "react-bootstrap";
import Logo from "../images/logo.png";
import User from "../images/profilelogo.png";
import CSidebar from "./Sidebar/CSidebar";
import { useRef } from "react";
import NotificationOverlay from "../components/OverlayPanel/NotificationOverlay";
import useKeyCombination from "../hooks/useKeyCombinationHook";

function RootLayout() {
  const sidebarRef = useRef();
  const searchInputRef = useRef();

  useKeyCombination(
    () => {
      toggleSideBar(true);
    },
    "k",
    true
  );

  function toggleSideBar(openSideBarOnly = false) {
    if (!openSideBarOnly) {
      if (sidebarRef.current.className.includes("c-close")) {
        sidebarRef.current.className = "c-sidebar";
        searchInputRef.current?.focus();
        localStorage.setItem("isSidebarOpen", true);
      } else {
        sidebarRef.current.className = "c-sidebar c-close";
        localStorage.removeItem("isSidebarOpen");
      }
    } else {
      if (sidebarRef.current.className.includes("c-close")) {
        sidebarRef.current.className = "c-sidebar";
        searchInputRef.current?.focus();
        localStorage.setItem("isSidebarOpen", true);
      } else {
        searchInputRef.current?.focus();
      }
    }
  }

  return (
    <>
      <div>
        <CSidebar
          sideBarRef={sidebarRef}
          searchInputRef={searchInputRef}
        ></CSidebar>

        <section className="c-home-section">
          <div className="c-home-content">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
              className="mt-4"
            >
              <i
                className="pi pi-bars hoverIcon"
                onClick={() => {
                  toggleSideBar();
                }}
              ></i>
              <NotificationOverlay />
            </div>
          </div>
          <div className="px-3 mt-4">
            <Outlet />
          </div>
        </section>
      </div>
    </>
  );
}

function LogoImage() {
  return (
    <>
      <Navbar.Brand>
        <img
          alt="EDU IMS Logo"
          src={Logo}
          width="130"
          height="30"
          className="d-inline-block align-top"
        />
      </Navbar.Brand>
    </>
  );
}

function UserImage() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      {user ? (
        <>
          {/* <Avatar
            image={"data:image/png;base64," + user.image}
            size="large"
            shape="circle"
          /> */}
          {/* <img  
            alt="User Profile"
            src={"data:image/png;base64," + user.image}
            width="40"
            height="40"
            className="d-inline-block align-top rounded-5"
          /> */}
        </>
      ) : (
        <>
          <img
            alt="User Profile"
            src={User}
            width="40"
            height="40"
            className="d-inline-block align-top rounded-5"
          />
        </>
      )}
    </>
  );
}

export default RootLayout;
