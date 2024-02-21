import { useState } from "react";
import { createContext } from "react";

export const ProductCategoryDataContext = createContext();

export const ProductCategoryDataProivder = ({ children }) => {
  const [ProductCategoryID, setProductCategoryID] = useState(0);
  const [isEnable, setIsEnable] = useState(true);
  return (
    <ProductCategoryDataContext.Provider
      value={{ ProductCategoryID, setProductCategoryID, isEnable, setIsEnable }}
    >
      {children}
    </ProductCategoryDataContext.Provider>
  );
};
