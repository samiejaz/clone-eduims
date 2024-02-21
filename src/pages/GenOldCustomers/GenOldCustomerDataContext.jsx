import { useState } from "react";
import { createContext } from "react";

export const GenOldCustomerDataContext = createContext();

export const GenOldCustomerDataProivder = ({ children }) => {
  const [OldCustomerID, setOldCustomerID] = useState(0);
  const [isEnable, setIsEnable] = useState(true);

  return (
    <GenOldCustomerDataContext.Provider
      value={{ OldCustomerID, setOldCustomerID, isEnable, setIsEnable }}
    >
      {children}
    </GenOldCustomerDataContext.Provider>
  );
};
