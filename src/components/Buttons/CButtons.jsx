import React from "react"
import { Button } from "primereact/button"

export const CIconButton = ({
  onClick,
  icon = "pi pi-eye",
  severity = "secondary",
  disabled = false,
  tooltip = "",
  toolTipPostion = "right",
  style = {},
  ...options
}) => {
  let defaultStyles = {
    padding: "1px 0px",
    fontSize: "small",
    width: "30px",
    height: "2rem",
    border: "none",
  }

  let newStyles = {
    ...defaultStyles,
    ...style,
  }

  return (
    <>
      <Button
        icon={icon}
        rounded
        outlined
        severity={severity}
        style={newStyles}
        onClick={onClick}
        disabled={disabled}
        tooltip={tooltip}
        tooltipOptions={{
          position: toolTipPostion,
        }}
        {...options}
      />
    </>
  )
}
