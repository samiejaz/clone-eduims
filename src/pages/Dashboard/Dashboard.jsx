import React, { useEffect, useState } from "react"

import { MOVEABLE_COMPNENTS_NAMES } from "../../utils/enums"

import { InfoCardsContainer } from "../Leads/LeadsDashboard/LeadsDashboard"
import { FormColumn, FormRow } from "../../components/Layout/LayoutComponents"
import { useRoutesData } from "../../context/RoutesContext"

import { Link } from "react-router-dom"
import CustomerIcon from "../../assets/new.png"
import InvoiceIcon from "../../assets/invoice.png"
import LeadsDashboardIcon from "../../assets/speedometer.png"
import LedgerIcon from "../../assets/payment.png"
import NewLeadEntryIcon from "../../assets/leading.png"
import ReceiptIcon from "../../assets/receipt.png"

const componentMapping = {
  InfoCardsContainer,
}

function DynamicComponent({ componentName }) {
  const Component = componentMapping[componentName]
  return <Component />
}

function Dashboard() {
  document.title = "Dashboard"
  const [dynamicComponent, setDynamicComponent] = useState("")

  useEffect(() => {
    function getDynamicallyCreatedComponent() {
      const dynamicComponent = localStorage.getItem("dynamic-component")
      if (dynamicComponent) {
        setDynamicComponent(dynamicComponent)
      }
    }
    getDynamicallyCreatedComponent()
  }, [localStorage.getItem("dynamic-component")])

  return (
    <div className="flex flex-column gap-1 mt-4">
      <div className="w-full">
        <div className="flex align-items-center justify-content-between">
          <h1 className="text-2xl">Dashboard</h1>
        </div>
        <hr />
        <LinksContainer />
        {dynamicComponent !== "" && (
          <>
            <DynamicComponent
              componentName={MOVEABLE_COMPNENTS_NAMES.LEADS_DASHBOARD_CARDS}
            />
          </>
        )}
      </div>
    </div>
  )
}

const LinkCard = ({ item, icon, textColor, backGroundColor }) => {
  return (
    <>
      {item?.menuKey && (
        <>
          <Link to={item?.routeUrl}>
            <div
              className="flex align-items-center justify-content-center flex-col p-5 rounded scaleOnHover"
              style={{
                minHeight: "10rem",
                maxHeight: "10rem",
                background: backGroundColor,
              }}
            >
              <div className="text-center flex align-items-center flex-column  gap-3 ">
                <div>
                  <img
                    src={icon}
                    alt="Dashboard Cards"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <div>
                  <p
                    className="fw-bold"
                    style={{
                      color: textColor,
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    {item?.menuName}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </>
      )}
    </>
  )
}

const LinksContainer = () => {
  const { originalRoutes } = useRoutesData()
  return (
    <FormRow>
      {originalRoutes.find((item) => item.menuKey === "mnuCustomers")
        ?.menuKey && (
        <>
          <FormColumn xl={2} lg={4} md={4}>
            <LinkCard
              item={originalRoutes.find(
                (item) => item.menuKey === "mnuCustomers"
              )}
              icon={CustomerIcon}
              backGroundColor={"#ECF2FF"}
              textColor={"#5D87FF"}
            />
          </FormColumn>
        </>
      )}
      {originalRoutes.find((item) => item.menuKey === "mnuNewCustomerInvoice")
        ?.menuKey && (
        <>
          <FormColumn xl={2} lg={4} md={4}>
            <LinkCard
              item={originalRoutes.find(
                (item) => item.menuKey === "mnuNewCustomerInvoice"
              )}
              icon={InvoiceIcon}
              backGroundColor={"#EAF6FF"}
              textColor={"#49BEFF"}
            />
          </FormColumn>
        </>
      )}
      {originalRoutes.find((item) => item.menuKey === "mnuLeadsDashboard")
        ?.menuKey && (
        <>
          <FormColumn xl={2} lg={4} md={4}>
            <LinkCard
              item={originalRoutes.find(
                (item) => item.menuKey === "mnuLeadsDashboard"
              )}
              icon={LeadsDashboardIcon}
              backGroundColor={"#FDEDE8"}
              textColor={"#FA8B6E"}
            />
          </FormColumn>
        </>
      )}
      {originalRoutes.find((item) => item.menuKey === "mnuLeadIntroduction")
        ?.menuKey && (
        <>
          <FormColumn xl={2} lg={4} md={4}>
            <LinkCard
              item={originalRoutes.find(
                (item) => item.menuKey === "mnuLeadIntroduction"
              )}
              icon={NewLeadEntryIcon}
              backGroundColor={"#FEF5E5"}
              textColor={"#FFAE1F"}
            />
          </FormColumn>
        </>
      )}
      {originalRoutes.find((item) => item.menuKey === "mnuRecieptVoucher")
        ?.menuKey && (
        <>
          <FormColumn xl={2} lg={4} md={4}>
            <LinkCard
              item={originalRoutes.find(
                (item) => item.menuKey === "mnuRecieptVoucher"
              )}
              icon={ReceiptIcon}
              backGroundColor={"#fce1c7"}
              textColor={"#E67E22"}
            />
          </FormColumn>
        </>
      )}
      {originalRoutes.find((item) => item.menuKey === "mnuAccountLedgerReport")
        ?.menuKey && (
        <>
          <FormColumn xl={2} lg={4} md={4}>
            <LinkCard
              item={originalRoutes.find(
                (item) => item.menuKey === "mnuAccountLedgerReport"
              )}
              icon={LedgerIcon}
              backGroundColor={"#E6FFFA"}
              textColor={"#13DEB9"}
            />
          </FormColumn>
        </>
      )}
    </FormRow>
  )
}
export default Dashboard
