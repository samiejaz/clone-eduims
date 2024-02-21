import React, { useState } from "react";
import CustomerInvoiceIntallmentsModal from "../components/Modals/CustomerInvoiceInstallmetnsModal";

const useCustomerInvoiceInstallmentHook = (
  installmentsFieldArray,
  method,
  isEnable
) => {
  const [visible, setVisible] = useState(false);
  const handleClose = () => {
    setVisible(false);
    method.setValue("installments", []);
  };
  const handleOpen = () => setVisible(true);
  return {
    handleClose,
    handleOpen,
    render: (
      <>
        <CustomerInvoiceIntallmentsModal
          visible={visible}
          setVisible={setVisible}
          handleClose={handleClose}
          installmentsFieldArray={installmentsFieldArray}
          method={method}
          isEnable={isEnable}
        />
      </>
    ),
  };
};

export default useCustomerInvoiceInstallmentHook;
