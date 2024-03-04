import { Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import SignUp from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import GenNewCustomerView from "./pages/CustomerEntry/CustomerEntryView";
import {
  AppConfiguration,
  CompanyInfo,
  GenCustomerEntry,
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
} from "./pages";

import { ROUTE_URLS } from "./utils/enums";
import { BusinessType } from "./pages/BusinessType/BusinessType";

import signalRConnectionManager from "./services/SignalRService";
import LeadsIntroductionViewer, {
  LeadsIntroductionViewerDetail,
} from "./pages/LeadsIntroductionViewer/LeadsIntroductionViewer";
import LeadsDashboard from "./pages/Leads/LeadsDashboard/LeadsDashboard";

import {
  GenOldCustomerDetail,
  GenOldCustomerForm,
} from "./pages/GenOldCustomers/GenOldCustomerEntry";

import LeadsComments from "./pages/LeadsIntroduction/LeadsComments";
import { ConfirmDialog } from "primereact/confirmdialog";

const App = () => {
  useEffect(() => {
    signalRConnectionManager.startConnection();
  }, []);

  return (
    <>
      <Routes>
        <Route path="auth" element={<SignUp />} />
        <Route path="/" element={<ProtectedRoutes />}>
          <Route index element={<Dashboard />} />
          <Route
            path={ROUTE_URLS.GENERAL.APP_CONFIGURATION_ROUTE}
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
            path={`${ROUTE_URLS.CONFIGURATION.USER_RIGHTS_ROUTE}`}
            element={<UserRights />}
          />
          {/* Configuration Routes END */}

          <Route
            path={ROUTE_URLS.CUSTOMERS.CUSTOMER_ENTRY}
            element={<GenCustomerEntry />}
          />
          <Route
            path={`${ROUTE_URLS.CUSTOMERS.CUSTOMER_ENTRY}/:CustomerID`}
            element={<GenNewCustomerView />}
          />

          <Route
            path={`${ROUTE_URLS.GENERAL.COMPANY_INFO_ROUTE}`}
            element={<CompanyInfo />}
          />
          <Route
            path={`${ROUTE_URLS.UTILITIES.APP_CONFIGURATION_ROUTE}`}
            element={<AppConfiguration />}
          />

          {/* TODO  */}
          <Route
            path={`${ROUTE_URLS.GENERAL.LEADS_INTROUDCTION_VIEWER_ROUTE}/:LeadIntroductionID`}
            element={<LeadsIntroductionViewer />}
          />
          <Route
            path={`${ROUTE_URLS.GENERAL.LEADS_INTROUDCTION_DETAIL_VIEWER_ROUTE}/:LeadIntroductionID/:Type/:LeadIntroductionDetailID`}
            element={<LeadsIntroductionViewerDetail />}
          />
          <Route
            path={`${ROUTE_URLS.GENERAL.LEADS_INTROUDCTION_COMMENT_ROUTE}/:LeadIntroductionID`}
            element={<LeadsComments />}
          />

          <Route
            path={ROUTE_URLS.CUSTOMERS.OLD_CUSTOMER_ENTRY}
            element={<GenOldCustomerDetail />}
          />
          <Route
            path={`${ROUTE_URLS.CUSTOMERS.OLD_CUSTOMER_ENTRY}/:CustomerID`}
            element={<GenOldCustomerForm mode={"view"} />}
          />
          <Route
            path={`${ROUTE_URLS.CUSTOMERS.OLD_CUSTOMER_ENTRY}/edit/:CustomerID`}
            element={<GenOldCustomerForm mode={"edit"} />}
          />
          <Route
            path={`${ROUTE_URLS.CUSTOMERS.OLD_CUSTOMER_ENTRY}/new`}
            element={<GenOldCustomerForm mode={"new"} />}
          />

          <Route
            path={`${ROUTE_URLS.LEADS.LEADS_DASHBOARD}`}
            element={<LeadsDashboard />}
          />
          {/* Leads End */}
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
              className: "rounded",
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
  );
};

export default App;
