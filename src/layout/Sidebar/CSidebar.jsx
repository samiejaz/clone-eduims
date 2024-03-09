import React, { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";
import { MENU_KEYS, ROUTE_URLS } from "../../utils/enums";
import signalRConnectionManager from "../../services/SignalRService";
import { Toast } from "primereact/toast";
import { AppConfigurationContext } from "../../context/AppConfigurationContext";
import { AuthContext } from "../../context/AuthContext";
import { confirmDialog } from "primereact/confirmdialog";
import { finalFilteredRoutes } from "../../utils/routes";
import { UserRightsContext } from "../../context/UserRightContext";

const CSidebar = ({ sideBarRef }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const toastRef = useRef(null);
  const { pageTitles } = useContext(AppConfigurationContext);

  useEffect(() => {
    async function configurationSetup() {
      let isSidebarOpen = localStorage.getItem("isSidebarOpen");
      if (isSidebarOpen) {
        sideBarRef.current.className = "c-sidebar";
      }
    }
    configurationSetup();

    return () => {
      localStorage.removeItem("isSidebarOpen");
    };
  }, []);

  function toggleSubmenu(e) {
    let parent = e.target.parentNode.parentNode;
    parent.classList.toggle("c-showMenu");
  }

  return (
    <>
      <div ref={sideBarRef} className={`c-sidebar c-close`}>
        <div className="c-logo-details">
          <span className="c-logo_name" style={{ marginLeft: "30px" }}>
            EDUIMS
          </span>
        </div>
        <ul className="c-nav-links">
          <li>
            <Link to={"/"}>
              <i className="pi pi-home"></i>
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

          <SubSidebar />

          <li>
            <div className="c-profile-details">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div className="c-profile_name" style={{ marginLeft: "5px" }}>
                    {user?.username}
                  </div>
                  <div className="c-job" style={{ marginLeft: "5px" }}>
                    Development
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
  );
};

export default CSidebar;

const NotificationHandler = ({ toast }) => {
  const connection = signalRConnectionManager.getConnection();

  useEffect(() => {
    if (connection?.state === "connected") {
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
        });
      });
      connection.on("ReceiveAllNotification", (message) => {
        toast.current.show(message);
      });
    }

    return () => {
      connection?.off("ReceiveNotification");
      connection?.off("ReceiveAllNotification");
    };
  }, [connection]);

  return null;
};

export const SignOut = () => {
  const { logoutUser } = useContext(AuthContext);

  const confirmLogout = () => {
    confirmDialog({
      message: "Are you sure you want to logout?",
      header: "Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      position: "top",
      accept: () => logoutUser(),
      reject: () => {},
    });
  };

  return (
    <>
      <i className="pi pi-sign-out" onClick={confirmLogout}></i>
    </>
  );
};

const SubSidebar = () => {
  const { routesWithUserRights } = useContext(UserRightsContext);

  return (
    <>
      {routesWithUserRights.map((route) => (
        <MenuGroup
          key={route.menuGroupName}
          menuGroupName={route.menuGroupName}
          subItems={route.subItems}
          icon={route.icon}
          hideMenuGroup={route?.hideMenuGroup}
        />
      ))}
    </>
  );
};

const MenuGroup = ({
  menuGroupName,
  subItems,
  icon,
  hideMenuGroup = false,
}) => {
  function toggleSubmenu(e) {
    let parent = e.target.parentNode.parentNode;
    parent.classList.toggle("c-showMenu");
  }
  return (
    <>
      {!hideMenuGroup && (
        <>
          <li className="">
            <div className="c-iocn-link">
              <Link to={ROUTE_URLS.LEADS.LEADS_DASHBOARD}>
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
                <Link
                  className="c-link_name"
                  to={ROUTE_URLS.LEADS.LEADS_DASHBOARD}
                >
                  {menuGroupName}
                </Link>
              </li>
              {subItems.length > 0 &&
                subItems.map((item) => (
                  <>
                    <MenuItem
                      key={item.menuKey}
                      name={item.name}
                      route={item.route}
                      showDividerOnTop={item?.showDividerOnTop}
                      hideMenuItem={item.ShowForm}
                      showForm={item.ShowForm}
                    />
                  </>
                ))}
            </ul>
          </li>
        </>
      )}
    </>
  );
};

const MenuItem = ({
  route,
  name,
  showDividerOnTop = false,
  hideMenuItem = true,
  showForm = true,
}) => {
  return (
    <>
      {hideMenuItem && (
        <>
          {showDividerOnTop ? (
            <>
              <hr style={{ color: "white", padding: "0", margin: "0" }} />
              <li>
                <Link to={route}>{name}</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to={route}>{name}</Link>
              </li>
            </>
          )}
        </>
      )}
    </>
  );
};
