import { Button as PrimeButton } from "primereact/button";
import useCustomerInvoiceInstallmentHook from "../hooks/useCustomerInvoiceInstallmentHook";

export function CustomerInvoiceInstallmentForm({
  method,
  installmentsFieldArray,
  isEnable,
}) {
  const { render, handleOpen } = useCustomerInvoiceInstallmentHook(
    installmentsFieldArray,
    method,
    isEnable
  );

  return (
    <>
      <>
        <PrimeButton
          tooltip="Create installment"
          icon="pi pi-money-bill"
          severity="info"
          size="small"
          className="rounded-2"
          type="button"
          onClick={() => handleOpen()}
          style={{
            padding: "1px 0px",
            fontSize: "small",
            width: "30px",
            marginLeft: "10px",
          }}
        />
      </>

      {render}
    </>
  );
}
