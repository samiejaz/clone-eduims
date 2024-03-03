import React from "react";
import AccessDenied from "../images/accessDenied.png";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";

const AccessDeniedPage = () => {
  return (
    <div
      className="flex align-items-center justify-content-center mt-5 flex-column"
      style={{ height: "75vh" }}
    >
      <img
        src={AccessDenied}
        alt="Access Denied"
        style={{
          display: "block",
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
          margin: "auto",
        }}
      />
      <Link to="/">
        <Button
          type="button"
          severity="primary"
          icon="pi pi-home"
          label="Back To Home"
          className="rounded"
        />
      </Link>
    </div>
  );
};

export default AccessDeniedPage;
