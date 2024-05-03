import React, { useRef } from "react"
import { LeadIntroductionDetail } from "../../LeadsIntroduction/LeadsIntroduction"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import {
  MENU_KEYS,
  MOVEABLE_COMPNENTS_NAMES,
  QUERY_KEYS,
  ROUTE_URLS,
} from "../../../utils/enums"
import { formatDateToMMDDYYYY } from "../../../utils/CommonFunctions"
import { checkForUserRights } from "../../../utils/routes"
import { ContextMenu } from "primereact/contextmenu"
import {
  FormRow,
  FormColumn,
} from "../../../components/Layout/LayoutComponents"
import { useUserData } from "../../../context/AuthContext"
import { Button } from "primereact/button"
import { useNavigate } from "react-router-dom"
const apiUrl = import.meta.env.VITE_APP_API_URL

export function LeadsDashboard() {
  document.title = "Leads Dashboard"
  const navigate = useNavigate()
  return (
    <div className="flex flex-column gap-1 mt-4">
      <div className="w-full">
        <div className="flex align-items-center justify-content-start gap-2">
          <h1 className="text-2xl">Leads Dashboard</h1>
          <Button
            label="Add New Lead Introduction"
            icon="pi pi-plus"
            type="button"
            className="rounded"
            onClick={() =>
              navigate(ROUTE_URLS.LEAD_INTRODUCTION_ROUTE + "/new")
            }
          />
        </div>
        <hr />
        <InfoCardsContainer
          componentLocation="LeadsDashboard"
          selectedDate={formatDateToMMDDYYYY(new Date())}
        />
      </div>
      <div className="w-full">
        <LeadIntroductionDetail
          ShowMetaDeta={false}
          Rows={5}
          userRights={checkForUserRights({
            MenuName: MENU_KEYS.LEADS.LEAD_INTRODUCTION_FORM_KEY,
          })}
        />
      </div>
    </div>
  )
}

export default LeadsDashboard

export function InfoCardsContainer({
  componentLocation = "",
  selectedDate = new Date().toISOString(),
}) {
  const user = useUserData()

  const { data } = useQuery({
    queryKey: [QUERY_KEYS.LEADS_CARD_DATA],
    queryFn: async () => {
      const url =
        apiUrl +
        `/data_LeadIntroduction/GetLeadIntroductionDashboardCounter?LoginUserID=${user.userID}&DateTo=${selectedDate}`
      const { data } = await axios.post(url)

      return data.data || []
    },
    initialData: [],
  })

  const cmRef = useRef()
  const onRightClick = (event) => {
    if (cmRef.current) {
      cmRef.current.show(event)
    }
  }

  const items = [
    {
      label: `${
        componentLocation === "LeadsDashboard" ? "Move to" : "Remove from"
      } Main Dashboard`,
      icon: `${
        componentLocation === "LeadsDashboard" ? "pi pi-send" : "pi pi-times"
      }`,
      command: () => {
        setOrRemoveItemFromLocalStorage()
      },
    },
  ]

  function setOrRemoveItemFromLocalStorage() {
    if (componentLocation === "LeadsDashboard") {
      localStorage.setItem(
        "dynamic-component",
        MOVEABLE_COMPNENTS_NAMES.LEADS_DASHBOARD_CARDS
      )
    } else {
      localStorage.removeItem(
        "dynamic-component",
        MOVEABLE_COMPNENTS_NAMES.LEADS_DASHBOARD_CARDS
      )
    }
  }

  return (
    <>
      {data.length > 0 && (
        <div ref={cmRef} onContextMenu={(e) => onRightClick(e)}>
          <FormRow>
            <FormColumn xl={2} lg={4} md={4}>
              <CCard
                Status={"New Lead"}
                Value={data[0].NewLeadStatusCount}
                Icon={"pi pi-plus"}
                BackGroundColor="#C7EEEA"
                ForeGroundColor="#14B8A6"
              />
            </FormColumn>

            <FormColumn xl={2} lg={4} md={4}>
              <CCard
                Status={"Forwarded"}
                Value={data[0].ForwardedStatusCount}
                Icon={"pi pi-send"}
              />
            </FormColumn>
            <FormColumn xl={2} lg={4} md={4}>
              <CCard
                Status={"Quoted"}
                Value={data[0].QuotedStatusCount}
                Icon={"pi pi-dollar"}
                BackGroundColor="#A0E6BA"
                ForeGroundColor="#136C34"
              />
            </FormColumn>
            <FormColumn xl={2} lg={4} md={4}>
              <CCard
                Status={"Finalized"}
                Value={data[0].FinalizedStatusCount}
                Icon={"pi pi-check"}
                BackGroundColor="#DADAFC"
                ForeGroundColor="#8183F4"
              />
            </FormColumn>
            <FormColumn xl={2} lg={4} md={4}>
              <CCard
                Status={"Closed"}
                Value={data[0].ClosedStatusCount}
                Icon={"pi pi-times"}
                BackGroundColor="#FFD0CE"
                ForeGroundColor="#FF3D32"
              />
            </FormColumn>
            <FormColumn xl={2} lg={4} md={4}>
              <CCard
                Status={"Acknowledged"}
                Value={data[0].AcknowledgedStatusCount}
                Icon={"pi pi-user"}
              />
            </FormColumn>
          </FormRow>
        </div>
      )}

      <ContextMenu
        ref={cmRef}
        model={items}
        onHide={() => {}}
        pt={{
          menu: {
            className: "m-0",
          },
        }}
      />
    </>
  )
}

export function CCard({
  Status,
  Value,
  Icon,
  BackGroundColor = "#D0E1FD",
  ForeGroundColor = "#4482F6",
}) {
  return (
    <>
      <div
        style={{
          padding: "1rem 1.5rem",
          display: "flex",
          border: "1px solid #e9ecef",
          borderRadius: "6px",
          flexDirection: "column",
          backgroundColor: "#fff",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <p>{Status}</p>
          <div
            style={{
              background: BackGroundColor,
              padding: ".3em 0.5em",
              borderRadius: "4px",
            }}
          >
            <span style={{ color: ForeGroundColor }} className={Icon}></span>
          </div>
        </div>
        <div>
          <p style={{ fontWeight: "bold" }}>{Value}</p>
        </div>
        <div>
          <p style={{ fontSize: "0.9rem" }}>
            <span style={{ color: "#22C55E" }}>{Value} new</span> since last
            week
          </p>
        </div>
      </div>
    </>
  )
}
