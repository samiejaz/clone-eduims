import { MENU_KEYS, ROUTE_URLS } from "../../../utils/enums"
import { Route, Routes } from "react-router-dom"
import LeadsDashboard from "./LeadsDashboard"
import LeadUserDashboard from "./LeadsUserDashboard"
import SingleFormRightsWrapper from "../../../components/Wrappers/SingleFormRightsWrapper"

export default function LeadsDashboardWrapper() {
  return (
    <Routes>
      <Route
        path={ROUTE_URLS.LEADS.LEADS_DASHBOARD + "/*"}
        element={
          <SingleFormRightsWrapper
            FormComponent={LeadsDashboard}
            menuKey={MENU_KEYS.LEADS.LEADS_DASHBOARD_KEY}
          />
        }
      />
      <Route
        path={ROUTE_URLS.LEADS.LEADS_USER_DASHBOARD + "/*"}
        element={
          <SingleFormRightsWrapper
            FormComponent={LeadUserDashboard}
            menuKey={MENU_KEYS.LEADS.LEADS_USER_DASHBOARD_KEY}
          />
        }
      />
    </Routes>
  )
}
