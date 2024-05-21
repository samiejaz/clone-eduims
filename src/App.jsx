import { Route, Routes } from "react-router-dom"
import ProtectedRoutes from "./components/ProtectedRoutes"
import { useEffect } from "react"
import { ToastContainer } from "react-toastify"
import SignUp from "./pages/LoginPage"
import Dashboard from "./pages/Dashboard/Dashboard"
import {
  AppConfiguration,
  CompanyInfo,
  BankAccountOpening,
  Country,
  Tehsil,
  Businessunit,
  BusinessNature,
  BusinessSegment,
  Session,
  Users,
  Departments,
  CustomerInvoice,
  ReceiptVoucher,
  CreditNote,
  DebitNote,
  ProductCategory,
  Product,
  LeadIntroduction,
  LeadSource,
  UserRights,
  Customers,
  OldCustomers,
  BusinessType,
} from "./pages"

import { ROUTE_URLS } from "./utils/enums"

import signalRConnectionManager from "./services/SignalRService"

import { ConfirmDialog } from "primereact/confirmdialog"
// import { KSearchBar } from "./components/components"
import { useUserData } from "./context/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { GetAllMenus } from "./api/MenusData"
import { useRoutesData } from "./context/RoutesContext"
import Reports from "./pages/Reports/reports"
import LeadsDashboardWrapper from "./pages/Leads/LeadsDashboard/LeadsDashboardWrapper"
import AdminPages from "./pages/Admin/AdminPages"
const App = () => {
  useEffect(() => {
    signalRConnectionManager.startConnection()
  }, [])

  return (
    <>
      <InitMenuNames />
      <Routes>
        <Route path="auth" element={<SignUp />} />
        <Route path="/" element={<ProtectedRoutes />}>
          <Route index element={<Dashboard />} />
          <Route
            path={ROUTE_URLS.GENERAL.APP_CONFIGURATION_ROUTE + "/*"}
            element={<AppConfiguration />}
          />

          {/* General Routes */}
          <Route path={`${ROUTE_URLS.COUNTRY_ROUTE}/*`} element={<Country />} />
          <Route path={`${ROUTE_URLS.TEHSIL_ROUTE}/*`} element={<Tehsil />} />
          <Route
            path={`${ROUTE_URLS.GENERAL.BUSINESS_UNITS}/*`}
            element={<Businessunit />}
          />
          <Route
            path={`${ROUTE_URLS.BUSINESS_NATURE_ROUTE}/*`}
            element={<BusinessNature />}
          />
          <Route
            path={`${ROUTE_URLS.BUSINESS_TYPE}/*`}
            element={<BusinessType />}
          />
          <Route
            path={`${ROUTE_URLS.BUSINESS_SEGMENT_ROUTE}/*`}
            element={<BusinessSegment />}
          />
          <Route
            path={`${ROUTE_URLS.GENERAL.SESSION_INFO}/*`}
            element={<Session />}
          />
          {/* General Routes END*/}
          {/* Users Routes*/}

          <Route path={`${ROUTE_URLS.USER_ROUTE}/*`} element={<Users />} />
          <Route
            path={`${ROUTE_URLS.DEPARTMENT}/*`}
            element={<Departments />}
          />
          <Route
            path={`${ROUTE_URLS.CUSTOMERS.CUSTOMER_ENTRY}/*`}
            element={<Customers />}
          />
          <Route
            path={`${ROUTE_URLS.CUSTOMERS.OLD_CUSTOMER_ENTRY}/*`}
            element={<OldCustomers />}
          />

          {/* Users Routes END*/}

          {/* Lead Routes */}
          <Route
            path={`${ROUTE_URLS.LEAD_INTRODUCTION_ROUTE}/*`}
            element={<LeadIntroduction />}
          />
          <Route
            path={`${ROUTE_URLS.LEED_SOURCE_ROUTE}/*`}
            element={<LeadSource />}
          />
          {/* Lead Routes END */}

          {/* Account Routes*/}
          <Route
            path={`${ROUTE_URLS.ACCOUNTS.BANK_ACCOUNT_OPENING}/*`}
            element={<BankAccountOpening />}
          />
          <Route
            path={`${ROUTE_URLS.ACCOUNTS.NEW_CUSTOMER_INVOICE}/*`}
            element={<CustomerInvoice />}
          />
          <Route
            path={`${ROUTE_URLS.ACCOUNTS.RECIEPT_VOUCHER_ROUTE}/*`}
            element={<ReceiptVoucher />}
          />
          <Route
            path={`${ROUTE_URLS.ACCOUNTS.CREDIT_NODE_ROUTE}/*`}
            element={<CreditNote />}
          />
          <Route
            path={`${ROUTE_URLS.ACCOUNTS.DEBIT_NODE_ROUTE}/*`}
            element={<DebitNote />}
          />
          {/* Account Routes END*/}

          {/* Utils Routes */}
          <Route
            path={`${ROUTE_URLS.UTILITIES.PRODUCT_CATEGORY_ROUTE}/*`}
            element={<ProductCategory />}
          />
          <Route
            path={`${ROUTE_URLS.UTILITIES.PRODUCT_INFO_ROUTE}/*`}
            element={<Product />}
          />

          {/* Utils Routes END */}

          {/* Configuration Routes*/}
          <Route
            path={`${ROUTE_URLS.CONFIGURATION.USER_RIGHTS_ROUTE}/*`}
            element={<UserRights />}
          />
          {/* Configuration Routes END */}

          <Route
            path={`${ROUTE_URLS.GENERAL.COMPANY_INFO_ROUTE}/*`}
            element={<CompanyInfo />}
          />

          <Route path="/*" element={<LeadsDashboardWrapper />} />
          {/* Leads End */}

          {/* Reports */}
          <Route path={`/reports/*`} element={<Reports />} />

          {/* Admin */}
          <Route path={`/admin/*`} element={<AdminPages />} />

          {/* Reports End */}
        </Route>
      </Routes>
      <ConfirmDialog
        id="EditDeleteDialog"
        draggable={false}
        style={{ width: "30vw" }}
        pt={{
          acceptButton: {
            root: {
              className: "rounded",
            },
          },
          rejectButton: {
            root: {
              className: "rounded p-button-secondary",
            },
          },
        }}
      />
      <ToastContainer
        position="top-center"
        pauseOnHover={false}
        theme="light"
        closeOnClick
        autoClose={1500}
        containerId={"autoClose"}
      />
    </>
  )
}

// function LeadsViewerRoutes() {
//   return (
//     <Routes>
//       <Route index element={<LeadsIntroductionViewer />} />
//       <Route
//         path={`:Type/:LeadIntroductionDetailID`}
//         element={<LeadsIntroductionViewerDetail />}
//       />
//       <Route path={`:LeadIntroductionID`} element={<LeadsComments />} />
//       <Route
//             path={`${ROUTE_URLS.GENERAL.LEADS_INTROUDCTION_VIEWER_ROUTE}/:LeadIntroductionID`}
//             element={<LeadsIntroductionViewer />}
//           />
//           <Route
//             path={`${ROUTE_URLS.GENERAL.LEADS_INTROUDCTION_DETAIL_VIEWER_ROUTE}/:LeadIntroductionID/:Type/:LeadIntroductionDetailID`}
//             element={<LeadsIntroductionViewerDetail />}
//           />
//           <Route
//             path={`${ROUTE_URLS.GENERAL.LEADS_INTROUDCTION_COMMENT_ROUTE}/:LeadIntroductionID`}
//             element={<LeadsComments />}
//           />
//     </Routes>
//   )
// }

export default App

export function InitMenuNames() {
  const user = useUserData()
  const { setAuthorizedRoutes, setOriginalRoutes } = useRoutesData()

  const { data: AllowedMenus } = useQuery({
    queryKey: ["allowRoutes", user?.userID],
    queryFn: () => GetAllMenus({ LoginUserID: user?.userID }),
    enabled: user != null,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  })

  useEffect(() => {
    if (AllowedMenus) {
      setAuthorizedRoutes(AllowedMenus.groupedRoutes)
      setOriginalRoutes(AllowedMenus.orignalRoutes)
    }
  }, [AllowedMenus])

  return null
}
