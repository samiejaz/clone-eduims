import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { Button } from "primereact/button";
import { useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AppConfigurationContext } from "../../context/AppConfigurationContext";
import AllCustomersBranchEntry from "../CustomerEntryModal/AllCustomersBranchEntry";

export function useAllCustomersBranchEntryModal(CustomerID) {
  const queryClient = useQueryClient();
  const { pageTitles } = useContext(AppConfigurationContext);
  const [visible, setVisible] = useState(false);
  return {
    setVisible,
    render: (
      <>
        <Dialog
          header={`${pageTitles?.branch || "Customer Branch"} Entry`}
          visible={visible}
          maximizable
          style={{ width: "70vw", height: "60vh" }}
          onHide={() => {
            setVisible(false);
            queryClient.invalidateQueries({
              queryKey: ["customersBranch"],
            });
          }}
        >
          <AllCustomersBranchEntry CustomerID={CustomerID} />
        </Dialog>
      </>
    ),
  };
}

export function AllCustomersBranchEntryModal({ CustomerID, pageTitles }) {
  const { setVisible, render } = useAllCustomersBranchEntryModal(CustomerID);

  return (
    <>
      <Button
        tooltip={`Add new ${pageTitles?.branch || "Customer Branch"}`}
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
