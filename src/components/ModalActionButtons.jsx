import { Button } from "primereact/button";
import React from "react";

const ModalActionButtons = ({
  disable = false,
  handleCancelClick,
  handleSaveClick,
  saveLabel = "Save",
  cancelLabel = "Cancel",
}) => {
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button
          label={cancelLabel}
          onClick={() => {
            handleCancelClick();
          }}
          severity="danger"
          type="button"
          className=" text-center"
          style={{ padding: ".8em" }}
          disabled={disable}
          outlined
        />

        <Button
          label={saveLabel}
          type={"button"}
          onClick={() => handleSaveClick()}
          className="p-button-p text-center"
          style={{ marginLeft: "4px", padding: ".8em" }}
          disabled={disable}
          severity="info"
        />
      </div>
    </>
  );
};

export default ModalActionButtons;
