import React, { useEffect, useState } from "react";
import AccessDenied from "../images/accessDenied.png";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { CustomSpinner } from "../components/CustomSpinner";

const AccessDeniedPage = () => {
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowImage(true);
    }, 1000);
  }, []);

  return (
    <div
      className="flex align-items-center justify-content-center mt-5 flex-column"
      style={{ height: "75vh" }}
    >
      {showImage ? (
        <>
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
        </>
      ) : (
        <>
          <CustomSpinner />
        </>
      )}
    </div>
  );
};

export default AccessDeniedPage;
