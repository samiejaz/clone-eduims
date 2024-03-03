import React, { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";
import { ROUTE_URLS } from "../../utils/enums";
import signalRConnectionManager from "../../services/SignalRService";
import { Toast } from "primereact/toast";
import { AppConfigurationContext } from "../../context/AppConfigurationContext";
import { AuthContext } from "../../context/AuthContext";
import { confirmDialog } from "primereact/confirmdialog";
import { Phone } from "lucide-react";

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

const routes = [
  {
    menuGroupName: "General",
    icon: "pi pi-home",
    subItems: [
      {
        name: "Country",
        route: ROUTE_URLS.COUNTRY_ROUTE,
      },
      {
        name: "Tehsil",
        route: ROUTE_URLS.TEHSIL_ROUTE,
      },
      {
        name: "Company Info",
        route: ROUTE_URLS.GENERAL.COMPANY_INFO_ROUTE,
        showDividerOnTop: true,
      },
      {
        name: "Business Unit",
        route: ROUTE_URLS.GENERAL.BUSINESS_UNITS,
      },
      {
        name: "Business Nature",
        route: ROUTE_URLS.BUSINESS_NATURE_ROUTE,
      },
      {
        name: "Business Type",
        route: ROUTE_URLS.BUSINESS_TYPE,
      },
      {
        name: "Business Segments",
        route: ROUTE_URLS.BUSINESS_SEGMENT_ROUTE,
      },
      {
        name: "Session Info",
        route: ROUTE_URLS.GENERAL.SESSION_INFO,
        showDividerOnTop: true,
      },
    ],
  },
  ,
  {
    menuGroupName: "Users",
    icon: "pi pi-users",

    subItems: [
      {
        name: "Users",
        route: ROUTE_URLS.USER_ROUTE,
      },
      {
        name: "Departments",
        route: ROUTE_URLS.DEPARTMENT,
      },
      {
        name: "Customer Entry",
        route: ROUTE_URLS.CUSTOMERS.CUSTOMER_ENTRY,
        showDividerOnTop: true,
      },
      {
        name: "Old Customer Entry",
        route: ROUTE_URLS.CUSTOMERS.OLD_CUSTOMER_ENTRY,
      },
    ],
  },
  {
    menuGroupName: "Accounts",
    icon: "pi pi-dollar",
    subItems: [
      {
        name: "Bank Account Opening",
        route: ROUTE_URLS.ACCOUNTS.BANK_ACCOUNT_OPENING,
      },
      {
        name: "Customer Invoice",
        route: ROUTE_URLS.ACCOUNTS.NEW_CUSTOMER_INVOICE,
        showDividerOnTop: true,
      },
      {
        name: "Receipt Voucher",
        route: ROUTE_URLS.ACCOUNTS.RECIEPT_VOUCHER_ROUTE,
      },
      {
        name: "Debit Note",
        route: ROUTE_URLS.ACCOUNTS.DEBIT_NODE_ROUTE,
        showDividerOnTop: true,
      },
      {
        name: "Credit Note",
        route: ROUTE_URLS.ACCOUNTS.CREDIT_NODE_ROUTE,
      },
    ],
  },

  {
    menuGroupName: "Utilities",
    icon: "pi pi-cog",

    subItems: [
      {
        name: "App Configuration",
        route: ROUTE_URLS.GENERAL.APP_CONFIGURATION_ROUTE,
      },
      {
        name: "Product Category",
        route: ROUTE_URLS.UTILITIES.PRODUCT_CATEGORY_ROUTE,
      },
      {
        name: "Product Info",
        route: ROUTE_URLS.UTILITIES.PRODUCT_INFO_ROUTE,
      },
    ],
  },
  {
    menuGroupName: "Leads",
    icon: "pi pi-phone",
    subItems: [
      {
        name: "Leads Introduction",
        route: ROUTE_URLS.LEAD_INTRODUCTION_ROUTE,
      },
      {
        name: "Leads Source",
        route: ROUTE_URLS.LEED_SOURCE_ROUTE,
      },
    ],
  },
];

const SubSidebar = () => {
  return (
    <>
      {routes.map((route) => (
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
            <ul className="c-sub-menu">
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
                      key={item.route}
                      name={item.name}
                      route={item.route}
                      showDividerOnTop={item?.showDividerOnTop}
                      hideMenuItem={item?.hideMenuItem}
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
  hideMenuItem = false,
}) => {
  return (
    <>
      {!hideMenuItem && (
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
