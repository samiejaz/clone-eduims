import useCustomerEntryHook from "../hooks/useCustomerEntryHook";
import { Button as PrimeButton } from "primereact/button";

export function CustomerEntryForm({ IconButton = false }) {
  const { render, setVisible } = useCustomerEntryHook();

  return (
    <>
      {IconButton ? (
        <>
          <PrimeButton
            tooltip="Add new customer"
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
            }}
          />
        </>
      ) : (
        <>
          <PrimeButton
            onClick={() => setVisible(true)}
            severity="info"
            icon="pi pi-plus"
            label="Add New"
            className="rounded-5"
            type="button"
            style={{
              padding: "0.3rem 1.25rem",
              marginLeft: "25px",
              fontSize: ".8em",
            }}
          />
        </>
      )}
      {render}
    </>
  );
}
