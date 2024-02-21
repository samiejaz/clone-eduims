import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import React, { useRef } from "react";
import { CCard } from "../../pages/Leads/LeadsDashboard/LeadsDashboard";
import { Badge } from "primereact/badge";

const NotificationOverlay = () => {
  const op = useRef(null);

  return (
    <>
      <i
        className="pi pi-bell p-overlay-badge"
        style={{ fontSize: "1.5rem" }}
        onClick={(e) => op.current.toggle(e)}
      >
        <Badge value="2"></Badge>
      </i>

      <OverlayPanel
        ref={op}
        closeOnEscape
        dismissable={false}
        id="hide-scrollbar"
        style={{
          minWidth: "60vw",
          maxHeight: "50vh",
          overflowY: "scroll",
          overflowX: "hidden",
          padding: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            gap: ".5rem",
          }}
        >
          <CCard
            Status={"Finalized"}
            Value={"19000"}
            Icon={"pi pi-check"}
            BackGroundColor="#DADAFC"
            ForeGroundColor="#8183F4"
          />
          <CCard
            Status={"Finalized"}
            Value={"19000"}
            Icon={"pi pi-check"}
            BackGroundColor="#DADAFC"
            ForeGroundColor="#8183F4"
          />
          <CCard
            Status={"Finalized"}
            Value={"19000"}
            Icon={"pi pi-check"}
            BackGroundColor="#DADAFC"
            ForeGroundColor="#8183F4"
          />
          <CCard
            Status={"Finalized"}
            Value={"19000"}
            Icon={"pi pi-check"}
            BackGroundColor="#DADAFC"
            ForeGroundColor="#8183F4"
          />
          <CCard
            Status={"Finalized"}
            Value={"19000"}
            Icon={"pi pi-check"}
            BackGroundColor="#DADAFC"
            ForeGroundColor="#8183F4"
          />
          <CCard
            Status={"Finalized"}
            Value={"19000"}
            Icon={"pi pi-check"}
            BackGroundColor="#DADAFC"
            ForeGroundColor="#8183F4"
          />
          <CCard
            Status={"Finalized"}
            Value={"19000"}
            Icon={"pi pi-check"}
            BackGroundColor="#DADAFC"
            ForeGroundColor="#8183F4"
          />
          <CCard
            Status={"Finalized"}
            Value={"19000"}
            Icon={"pi pi-check"}
            BackGroundColor="#DADAFC"
            ForeGroundColor="#8183F4"
          />
          <CCard
            Status={"Finalized"}
            Value={"19000"}
            Icon={"pi pi-check"}
            BackGroundColor="#DADAFC"
            ForeGroundColor="#8183F4"
          />
          <CCard
            Status={"Finalized"}
            Value={"19000"}
            Icon={"pi pi-check"}
            BackGroundColor="#DADAFC"
            ForeGroundColor="#8183F4"
          />
          <CCard
            Status={"Finalized"}
            Value={"19000"}
            Icon={"pi pi-check"}
            BackGroundColor="#DADAFC"
            ForeGroundColor="#8183F4"
          />
          <CCard
            Status={"Finalized"}
            Value={"19000"}
            Icon={"pi pi-check"}
            BackGroundColor="#DADAFC"
            ForeGroundColor="#8183F4"
          />
          <CCard
            Status={"Finalized"}
            Value={"19000"}
            Icon={"pi pi-check"}
            BackGroundColor="#DADAFC"
            ForeGroundColor="#8183F4"
          />
          <CCard
            Status={"Finalized"}
            Value={"19000"}
            Icon={"pi pi-check"}
            BackGroundColor="#DADAFC"
            ForeGroundColor="#8183F4"
          />
          <CCard
            Status={"Finalized"}
            Value={"19000"}
            Icon={"pi pi-check"}
            BackGroundColor="#DADAFC"
            ForeGroundColor="#8183F4"
          />
        </div>
      </OverlayPanel>
    </>
  );
};

export default NotificationOverlay;
