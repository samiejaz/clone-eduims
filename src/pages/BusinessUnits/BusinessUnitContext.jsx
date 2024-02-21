import { useState } from "react";
import { createContext } from "react";

export const BusinessUnitDataContext = createContext();

export const BusinessUnitDataProivder = ({ children }) => {
  const [BusinessUnitID, setBusinessUnitID] = useState(0);
  const [isEnable, setIsEnable] = useState(true);
  return (
    <BusinessUnitDataContext.Provider
      value={{ BusinessUnitID, setBusinessUnitID, isEnable, setIsEnable }}
    >
      {children}
    </BusinessUnitDataContext.Provider>
  );
};
