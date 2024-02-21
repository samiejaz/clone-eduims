import React from "react";
import { Button } from "primereact/button";

export const CIconButton = ({
  onClick,
  icon = "pi pi-eye",
  severity = "secondary",
  disabled = false,
  tooltip = "",
  toolTipPostion = "right",
  ...options
}) => {
  return (
    <>
      <Button
        icon={icon}
        rounded
        outlined
        severity={severity}
        style={{
          padding: "1px 0px",
          fontSize: "small",
          width: "30px",
          height: "2rem",
          border: "none",
        }}
        onClick={onClick}
        disabled={disabled}
        tooltip={tooltip}
        tooltipOptions={{
          position: toolTipPostion,
        }}
        {...options}
      />
    </>
  );
};
