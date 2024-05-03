import React, { useEffect, useState } from "react"

import { MOVEABLE_COMPNENTS_NAMES } from "../../utils/enums"

import { InfoCardsContainer } from "../Leads/LeadsDashboard/LeadsDashboard"
import { FormColumn, FormRow } from "../../components/Layout/LayoutComponents"
import { useRoutesData } from "../../context/RoutesContext"
import {
  CircleDollarSign,
  LayoutDashboard,
  Plus,
  Receipt,
  ReceiptText,
  User,
} from "lucide-react"
import { Link } from "react-router-dom"
// import CustomerIcon from "../../images/CustomerEntry"
// import InoivceIcon from "../../images/Invoice"
// import LeadsDashboardIcon from "../../images/LeadsDashboard"
// import LedgerIcon from "../../images/Ledger"
//import NewLeadEntryIcon from "../../images/"
//import ReceiptIcon from "../../images/profilelog.png"

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

const LinkCard = ({ item, icon }) => {
  return (
    <>
      {item?.menuKey && (
        <>
          <Link to={item?.routeUrl}>
            <div
              className="flex align-items-center justify-content-center flex-col p-5 rounded shadow bg-royal-blue"
              style={{ minHeight: "10rem" }}
            >
              <div className="text-center">
                {icon}
                <p className="fw-bold" style={{ color: "inherit" }}>
                  {item?.menuName}
                </p>
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
              icon={<User />}
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
              icon={<Receipt />}
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
              icon={<LayoutDashboard />}
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
              icon={<Plus />}
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
              icon={<ReceiptText />}
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
              icon={<CircleDollarSign />}
            />
          </FormColumn>
        </>
      )}
    </FormRow>
  )
}
export default Dashboard
