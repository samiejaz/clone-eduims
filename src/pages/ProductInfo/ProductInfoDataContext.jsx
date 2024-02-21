import { useState } from "react";
import { createContext } from "react";

export const ProductInfoDataContext = createContext();

export const ProductInfoDataProivder = ({ children }) => {
  const [ProductInfoID, setProductInfoID] = useState(0);
  const [isEnable, setIsEnable] = useState(true);
  return (
    <ProductInfoDataContext.Provider
      value={{ ProductInfoID, setProductInfoID, isEnable, setIsEnable }}
    >
      {children}
    </ProductInfoDataContext.Provider>
  );
};
