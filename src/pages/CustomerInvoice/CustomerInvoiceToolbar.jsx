import React from "react";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";

export default function ButtonToolBar({
  printLoading = false,
  saveLoading = false,
  deleteDisable = false,
  saveDisable = false,
  cancelDisable = false,
  addNewDisable = false,
  editDisable = false,
  printDisable = false,
  showPrint = false,
  utilityContent = [],
  handleCancel = () => {},
  handleDelete = () => {},
  handleAddNew = () => {},
  handleEdit = () => {},
  handlePrint = () => {},
  handleSave = () => {},
  handleGoBack = () => {},
  saveLabel = "Save",
  viewLabel = "View",
  editLabel = "Edit",
  cancelLabel = "Cancel",
  deleteLabel = "Delete",
  GoBackLabel = "",
  showDelete = true,
}) {
  const startContent = (
    <Button
      icon="pi pi-arrow-left"
      tooltip={GoBackLabel}
      className="p-button-text"
      onClick={() => {
        handleGoBack();
      }}
    />
  );
  const centerContent = (
    <React.Fragment>
      <Button
        label={cancelLabel}
        icon="pi pi-times"
        className="rounded"
        type="button"
        severity="secondary"
        disabled={cancelDisable}
        onClick={() => handleCancel()}
        style={{ marginRight: "2px" }}
      />
      <Button
        label="Add New"
        icon="pi pi-plus"
        className="rounded"
        type="button"
        disabled={addNewDisable}
        onClick={() => handleAddNew()}
        style={{ marginRight: "2px" }}
      />
      <Button
        label={editLabel}
        icon="pi pi-pencil"
        type="button"
        severity="warning"
        className="p-button-success rounded"
        disabled={editDisable}
        onClick={() => handleEdit()}
        style={{ marginRight: "2px" }}
      />
      {showDelete && (
        <>
          <Button
            label={deleteLabel}
            icon="pi pi-trash"
            type="button"
            severity="danger"
            disabled={deleteDisable}
            onClick={() => handleDelete()}
            style={{ marginRight: "2px" }}
            className="p-button-success rounded"
          />
        </>
      )}
      <Button
        label={saveLabel}
        icon="pi pi-check"
        type="submit"
        severity="success"
        disabled={saveDisable}
        onClick={handleSave}
        loading={saveLoading}
        className="p-button-success rounded"
        loadingIcon="pi pi-spin pi-cog"
      />
      {showPrint ? (
        <>
          <i className="pi pi-bars p-toolbar-separator mr-2" />

          <Button
            label={printLoading ? "Loading..." : "Print"}
            icon="pi pi-print"
            className="rounded"
            type="button"
            severity="help"
            disabled={printDisable}
            loading={printLoading}
            loadingIcon="pi pi-spin pi-print"
            onClick={() => handlePrint()}
          />
        </>
      ) : (
        <></>
      )}
      {utilityContent}
    </React.Fragment>
  );

  return (
    <Toolbar
      start={startContent}
      center={centerContent}
      pt={{
        root: {
          style: {
            background: "none",
            padding: "0",
            border: "none",
          },
        },
      }}
    />
  );
}
