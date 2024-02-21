import { Dialog } from "primereact/dialog";
import { useState } from "react";
import CustomerAccountEntry from "../CustomerEntryModal/CustomerAccountsEntry";
import { Button } from "primereact/button";
import { useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";

export function useCustomerAccountEntryModal(CustomerID) {
  const queryClient = useQueryClient();
  const [visible, setVisible] = useState(false);
  // const customerAccountsForm = useForm();
  return {
    setVisible,
    render: (
      <>
        <Dialog
          header={"Customer Ledger Entry"}
          visible={visible}
          maximizable
          style={{ width: "70vw", height: "60vh" }}
          onHide={() => {
            setVisible(false);
            queryClient.invalidateQueries({ queryKey: ["customerAccounts"] });
          }}
        >
          {/* <FormProvider {...customerAccountsForm}> */}
          <CustomerAccountEntry CustomerID={CustomerID} />
          {/* </FormProvider> */}
        </Dialog>
      </>
    ),
  };
}

export function CustomerAccountEntryModal({ CustomerID }) {
  const { setVisible, render } = useCustomerAccountEntryModal(CustomerID);

  return (
    <>
      <Button
        tooltip="Add new ledger"
        icon="pi pi-plus"
        severity="success"
        size="small"
        className="rounded-2"
        type="button"
        onClick={() => setVisible(true)}
        style={{
          padding: "1px 0px",
          fontSize: "small",
          width: "30px",
          marginLeft: "10px",
          marginBottom: "10px",
        }}
      />
      <div>{render}</div>
    </>
  );
}
