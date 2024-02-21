import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useRef, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { LeadIntroductionDetail } from "../../LeadsIntroduction/LeadsIntroduction";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { QUERY_KEYS } from "../../../utils/enums";
import CDatePicker from "../../../components/Forms/CDatePicker";
import { Calendar } from "primereact/calendar";
import { formatDateToMMDDYYYY } from "../../../utils/CommonFunctions";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "primereact/badge";
const apiUrl = import.meta.env.VITE_APP_API_URL;

function LeadsDashboard() {
  document.title = "Leads Dashboard";

  const [visible, setVisible] = useState(false);
  const toastBC = useRef(null);
  const navigate = useNavigate();

  const clear = () => {
    toastBC.current.clear();
    navigate("/");
    setVisible(false);
  };

  const confirm = () => {
    if (!visible) {
      setVisible(true);
      toastBC.current.clear();
      toastBC.current.show({
        severity: "success",
        summary: "Can you send me the report?",
        sticky: true,

        content: (props) => (
          <div
            className="flex flex-column align-items-left"
            style={{ flex: "1" }}
          >
            <div className="flex align-items-center gap-2">
              {/* <Avatar image="/images/avatar/amyelsner.png" shape="circle" /> */}
              <span className="font-bold text-900">Amy Elsner</span>
            </div>
            <div className="font-medium text-lg my-3 text-900">
              {props.message.summary}
            </div>
            <Button
              className="p-button-sm flex"
              label="Reply"
              severity="success"
              onClick={clear}
            ></Button>
          </div>
        ),
      });
    }
  };

  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
      className="mt-4"
    >
      <div className="border-0">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3>Leads Dashboard</h3>
            <Toast ref={toastBC} position="top-right" onRemove={clear} />
            <Button onClick={confirm} label="Confirm" />
            <div style={{ width: "25%" }}>
              <div>
                <Calendar
                  dateFormat="dd/mm/yy"
                  style={{ width: "100%" }}
                  hourFormat="12"
                  inputStyle={{ textAlign: "center" }}
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.value);
                  }}
                />
              </div>
            </div>
          </div>
          <hr />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.5rem",
              // flexWrap: "wrap",
            }}
          >
            <InfoCardsContainer
              selectedDate={formatDateToMMDDYYYY(selectedDate)}
            />
          </div>
        </div>
      </div>
      <div className="card p-3 border-0 shadow-sm">
        <div>
          <LeadIntroductionDetail ShowMetaDeta={false} Rows={5} />
        </div>
      </div>
    </div>
  );
}

export default LeadsDashboard;

let lightSuccessColor = "#A0E6BA";
let darkSuccessColor = "#1DA750";

function InfoCardsContainer({ selectedDate }) {
  const { data } = useQuery({
    queryKey: [QUERY_KEYS.LEADS_CARD_DATA, selectedDate],
    queryFn: async () => {
      const { data } = await axios.post(
        apiUrl +
          `/data_LeadIntroduction/GetLeadIntroductionDashboardCounter?LoginUserID=1&DateTo=${selectedDate}`
      );

      return data.data || [];
    },
    initialData: [],
  });

  return (
    <>
      {data.length > 0 && (
        <>
          <CCard
            Status={"New Lead"}
            Value={data[0].NewLeadStatusCount}
            Icon={"pi pi-plus"}
            BackGroundColor="#C7EEEA"
            ForeGroundColor="#14B8A6"
          />
          <CCard
            Status={"Forwarded"}
            Value={data[0].ForwardedStatusCount}
            Icon={"pi pi-send"}
          />
          <CCard
            Status={"Quoted"}
            Value={data[0].QuotedStatusCount}
            Icon={"pi pi-dollar"}
            BackGroundColor="#A0E6BA"
            ForeGroundColor="#136C34"
          />
          <CCard
            Status={"Finalized"}
            Value={data[0].FinalizedStatusCount}
            Icon={"pi pi-check"}
            BackGroundColor="#DADAFC"
            ForeGroundColor="#8183F4"
          />
          <CCard
            Status={"Closed"}
            Value={data[0].ClosedStatusCount}
            Icon={"pi pi-times"}
            BackGroundColor="#FFD0CE"
            ForeGroundColor="#FF3D32"
          />
          <CCard
            Status={"Acknowledged"}
            Value={data[0].AcknowledgedStatusCount}
            Icon={"pi pi-user"}
          />
        </>
      )}
    </>
  );
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
            <span style={{ color: "#22C55E" }}>23 new</span> since last week
          </p>
        </div>
      </div>
    </>
  );
}
