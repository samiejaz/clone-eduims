import React from "react";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import useKeyCombination from "../../hooks/useKeyCombinationHook";
import { confirmDialog } from "primereact/confirmdialog";

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
  showDeleteButton = true,
  showSaveButton = true,
  showCancelButton = true,
  showAddNewButton = true,
  showEditButton = true,
  mode = "new",
}) {
  useKeyCombination(() => {
    if (mode === "edit" || mode === "new") {
      handleSave();
    }
  }, "s");

  useKeyCombination(() => {
    if (mode === "view") {
      confirmDialog({
        message: "Are you sure you delete this record?",
        header: "Confirmation",
        icon: "pi pi-info-circle",
        defaultFocus: "reject",
        acceptClassName: "p-button-danger",
        position: "top",
        accept: () => handleDelete(),
        reject: () => {},
      });
    }
  }, "d");

  useKeyCombination(() => {
    if (mode === "view") {
      handleEdit();
    }
  }, "e");

  useKeyCombination(() => {
    if (mode !== "view") {
      handleCancel();
    }
  }, "c");

  useKeyCombination(() => {
    if (mode !== "new") {
      handleAddNew();
    }
  }, "n");

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
      <div className="w-full flex gap-1 flex-wrap">
        <Button
          label={cancelLabel}
          icon="pi pi-times"
          className="rounded"
          type="button"
          severity="secondary"
          disabled={cancelDisable ? true : mode === "view"}
          onClick={() => handleCancel()}
          pt={{
            label: {
              className: "hidden md:block lg:block",
            },
          }}
        />
        {showAddNewButton ? (
          <>
            <Button
              label="Add New"
              icon="pi pi-plus"
              className="rounded"
              type="button"
              disabled={
                addNewDisable ? true : mode === "edit" || mode === "new"
              }
              onClick={() => handleAddNew()}
              pt={{
                label: {
                  className: "hidden md:block lg:block",
                },
                root: {
                  className: "bg-blue",
                },
              }}
            />
          </>
        ) : null}
        {showEditButton ? (
          <>
            <Button
              label={editLabel}
              icon="pi pi-pencil"
              type="button"
              severity="warning"
              className="p-button-success rounded"
              disabled={editDisable ? true : mode !== "view" ? true : false}
              onClick={() => handleEdit()}
              pt={{
                label: {
                  className: "hidden md:block lg:block",
                },
              }}
            />
          </>
        ) : null}
        {showDelete && (
          <>
            <Button
              label={deleteLabel}
              icon="pi pi-trash"
              type="button"
              severity="danger"
              disabled={
                deleteDisable ? true : mode === "edit" || mode === "new"
              }
              onClick={() => {
                confirmDialog({
                  message: "Are you sure you delete this record?",
                  header: "Confirmation",
                  icon: "pi pi-info-circle",
                  defaultFocus: "reject",
                  acceptClassName: "p-button-danger",
                  position: "top",
                  accept: () => handleDelete(),
                  reject: () => {},
                });
              }}
              className="p-button-success rounded"
              pt={{
                label: {
                  className: "hidden md:block lg:block",
                },
              }}
            />
          </>
        )}
        {showSaveButton ? (
          <>
            <Button
              label={
                saveLabel !== "Save"
                  ? saveLabel
                  : mode === "edit"
                  ? "Update"
                  : "Save"
              }
              icon="pi pi-check"
              type="submit"
              severity="success"
              disabled={saveDisable ? true : mode === "view"}
              onClick={handleSave}
              loading={saveLoading}
              className="p-button-success rounded"
              loadingIcon="pi pi-spin pi-cog"
              pt={{
                label: {
                  className: "hidden md:block lg:block",
                },
              }}
            />
          </>
        ) : null}

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
              pt={{
                label: {
                  className: "hidden md:block lg:block",
                },
              }}
            />
          </>
        ) : (
          <></>
        )}
        {utilityContent}
      </div>
    </React.Fragment>
  );

  return (
    <>
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
    </>
  );
}
