import axios from "axios";
import { useEffect, useState } from "react";
import { createContext } from "react";

const apiUrl = import.meta.env.VITE_APP_API_URL;
export const AppConfigurationContext = createContext();

export const AppConfigurationProivder = ({ children }) => {
  const [pageTitles, setPageTitles] = useState({
    product: null,
    branch: null,
  });
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    async function fetchCompanyInfo() {
      const { data } = await axios.post(
        `${apiUrl}/EduIMS/GetConfigInfo?LoginUserID=${user.userID}`
      );
      if (data.success === true) {
        setPageTitles({
          product: data?.data[0]?.ProductTitle,
          branch: data?.data[0]?.CustomerBranchTitle,
        });
      }
    }

    fetchCompanyInfo();
  }, []);

  return (
    <AppConfigurationContext.Provider value={{ pageTitles, setPageTitles }}>
      {children}
    </AppConfigurationContext.Provider>
  );
};
