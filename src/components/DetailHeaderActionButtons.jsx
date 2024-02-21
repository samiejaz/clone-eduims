import { Button } from "primereact/button";
import React from "react";

const DetailHeaderActionButtons = ({ handleAdd, handleClear }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <Button
        label="Add"
        severity="success"
        type="button"
        style={{
          borderRadius: "16px",
          padding: "0.3rem 0.7rem",
          fontSize: ".9em",
        }}
        onClick={handleAdd}
      />
      <Button
        label="Clear"
        severity="danger"
        type="button"
        style={{
          borderRadius: "16px",
          padding: "0.3rem 0.7rem",
          fontSize: ".9em",
        }}
        onClick={handleClear}
      />
    </div>
  );
};

export default DetailHeaderActionButtons;
