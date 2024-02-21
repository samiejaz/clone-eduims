import { useState } from "react";
import { createContext } from "react";

export const CustomerInvoiceDataContext = createContext();

export const CustomerInvoiceDataProivder = ({ children }) => {
  const [CustomerInvoiceID, setCustomerInvoiceID] = useState(0);
  const [isEnable, setIsEnable] = useState(true);

  return (
    <CustomerInvoiceDataContext.Provider
      value={{
        CustomerInvoiceID,
        setCustomerInvoiceID,
        isEnable,
        setIsEnable,
      }}
    >
      {children}
    </CustomerInvoiceDataContext.Provider>
  );
};

export const InvoiceDataContext = createContext();

export const InvoiceDataProivder = ({ children }) => {
  const [BusinessUnitID, setBusinessUnitID] = useState(0);

  return (
    <InvoiceDataContext.Provider
      value={{
        BusinessUnitID,
        setBusinessUnitID,
      }}
    >
      {children}
    </InvoiceDataContext.Provider>
  );
};
