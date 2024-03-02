import React, { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";
import { ROUTE_URLS } from "../../utils/enums";
import signalRConnectionManager from "../../services/SignalRService";
import { Toast } from "primereact/toast";
import { AppConfigurationContext } from "../../context/AppConfigurationContext";

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
          {/* General */}
          <li className="">
            <div className="c-iocn-link">
              <a href="#">
                <i className="pi pi-list"></i>
                <span className="c-link_name">General</span>
              </a>
              <i
                className="pi pi-chevron-down c-arrow"
                onClick={toggleSubmenu}
              ></i>
            </div>
            <ul className="c-sub-menu">
              <li>
                <a className="c-link_name" href="#">
                  General
                </a>
              </li>
              <li>
                <Link to={ROUTE_URLS.COUNTRY_ROUTE}>Country</Link>
              </li>
              <li>
                <Link to={ROUTE_URLS.TEHSIL_ROUTE}>Tehsil</Link>
              </li>
              <hr style={{ color: "white", padding: "0", margin: "0" }} />
              <li>
                <Link to={ROUTE_URLS.GENERAL.COMPANY_INFO_ROUTE}>
                  Company Info
                </Link>
              </li>
              <li>
                <Link to={ROUTE_URLS.GENERAL.BUSINESS_UNITS}>
                  Business Unit
                </Link>
              </li>
              <li>
                <Link to={ROUTE_URLS.BUSINESS_NATURE_ROUTE}>
                  Business Nature
                </Link>
              </li>
              <li>
                <Link to={ROUTE_URLS.BUSINESS_TYPE}>Business Type</Link>
              </li>
              <li>
                <Link to={ROUTE_URLS.BUSINESS_SEGMENT_ROUTE}>
                  Business Segments
                </Link>
              </li>
              <hr style={{ color: "white", padding: "0", margin: "0" }} />

              <li>
                <Link to={ROUTE_URLS.GENERAL.SESSION_INFO}>Session Info</Link>
              </li>
            </ul>
          </li>

          {/* Customers */}
          <li className="">
            <div className="c-iocn-link">
              <a href="#">
                <i className="pi pi-users"></i>
                <span className="c-link_name">Users</span>
              </a>
              <i
                className="pi pi-chevron-down c-arrow"
                onClick={toggleSubmenu}
              ></i>
            </div>
            <ul className="c-sub-menu">
              <li>
                <a className="c-link_name" href="#">
                  Users
                </a>
              </li>
              <li>
                <Link to={ROUTE_URLS.USER_ROUTE}>Users</Link>
              </li>
              <li>
                <Link to={ROUTE_URLS.DEPARTMENT}>Departments</Link>
              </li>
              <hr style={{ color: "white", padding: "0", margin: "0" }} />
              <li>
                <Link to={ROUTE_URLS.CUSTOMERS.CUSTOMER_ENTRY}>
                  Customer Entry
                </Link>
              </li>
              <li>
                <Link to={ROUTE_URLS.CUSTOMERS.OLD_CUSTOMER_ENTRY}>
                  Old Customer Entry
                </Link>
              </li>
            </ul>
          </li>

          {/* Accounts */}
          <li className="">
            <div className="c-iocn-link">
              <a href="#">
                <i className="pi pi-dollar"></i>
                <span className="c-link_name">Accounts</span>
              </a>
              <i
                className="pi pi-chevron-down c-arrow"
                onClick={toggleSubmenu}
              ></i>
            </div>
            <ul className="c-sub-menu">
              <li>
                <a className="c-link_name" href="#">
                  Accounts
                </a>
              </li>
              <li>
                <Link to={ROUTE_URLS.ACCOUNTS.BANK_ACCOUNT_OPENING}>
                  Bank Account Opening
                </Link>
              </li>
              <hr style={{ color: "white", padding: "0", margin: "0" }} />
              <li>
                <Link to={ROUTE_URLS.ACCOUNTS.CUSTOMER_INVOICE}>
                  Customer Invoice
                </Link>
              </li>
              <li>
                <Link to={ROUTE_URLS.ACCOUNTS.RECIEPT_VOUCHER_ROUTE}>
                  Receipt Voucher
                </Link>
              </li>
              <hr style={{ color: "white", padding: "0", margin: "0" }} />
              <li>
                <Link to={ROUTE_URLS.ACCOUNTS.DEBIT_NODE_ROUTE}>
                  Debit Note
                </Link>
              </li>
              <li>
                <Link to={ROUTE_URLS.ACCOUNTS.CREDIT_NODE_ROUTE}>
                  Credit Note
                </Link>
              </li>
              <li>
                <Link to={ROUTE_URLS.ACCOUNTS.NEW_CUSTOMER_INVOICE}>
                  New Customer Invoice
                </Link>
              </li>
            </ul>
          </li>

          {/* Utilities */}
          <li className="">
            <div className="c-iocn-link">
              <a href="#">
                <i className="pi pi-cog"></i>
                <span className="c-link_name">Utilities</span>
              </a>
              <i
                className="pi pi-chevron-down c-arrow"
                onClick={toggleSubmenu}
              ></i>
            </div>
            <ul className="c-sub-menu">
              <li>
                <a className="c-link_name" href="#">
                  Utilities
                </a>
              </li>
              <li>
                <Link to={ROUTE_URLS.GENERAL.APP_CONFIGURATION_ROUTE}>
                  App Configuration
                </Link>
              </li>
              <li>
                <Link to={ROUTE_URLS.UTILITIES.PRODUCT_CATEGORY_ROUTE}>
                  {pageTitles?.product || "Product"} Category
                </Link>
              </li>
              <li>
                <Link to={ROUTE_URLS.UTILITIES.PRODUCT_INFO_ROUTE}>
                  {pageTitles?.product || "Product"} Info
                </Link>
              </li>
              <li>
                <Link to={ROUTE_URLS.UTILITIES.INVOICE_DESCRIPTIONS}>
                  Invoice Descriptions
                </Link>
              </li>
            </ul>
          </li>
          {/* Lead Dashboard */}
          <li className="">
            <div className="c-iocn-link">
              <Link to={ROUTE_URLS.LEADS.LEADS_DASHBOARD}>
                <i className="pi pi-phone"></i>
                <span className="c-link_name">Leads</span>
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
                  Leads Dashboard
                </Link>
              </li>
              <li>
                <Link to={ROUTE_URLS.LEED_SOURCE_ROUTE}>Leads Source</Link>
              </li>
              <li>
                <Link to={ROUTE_URLS.LEAD_INTRODUCTION_ROUTE}>
                  Leads Introduction
                </Link>
              </li>
            </ul>
          </li>

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
                    {user.username}
                  </div>
                  <div className="c-job" style={{ marginLeft: "5px" }}>
                    Development
                  </div>
                </div>
                <i className="pi pi-sign-out"></i>
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

    return () => {
      connection.off("ReceiveNotification");
      connection.off("ReceiveAllNotification");
    };
  }, [connection]);

  return null;
};
