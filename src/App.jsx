import { Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import SignUp from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import GenNewCustomerView from "./pages/CustomerEntry/CustomerEntryView";
import {
  AppConfiguration,
  CustomerInvoice,
  CompanyInfo,
  ReceiptVoucher,
  GenCustomerEntry,
} from "./pages";
import { CustomerInvoiceFormMaster } from "./pages/CustomerInvoice/CustomerInvoice";
import {
  BusinessUnitDetail,
  BusinessUnitForm,
} from "./pages/BusinessUnits/BusinessUnits";

import { ReceiptEntryForm } from "./pages/RecieptEntry/RecieptEntry";
import { CountryDetail, CountryForm } from "./pages/Country/Country";
import { useUserData } from "./context/AuthContext";
import { TehsilDetail, TehsilForm } from "./pages/Tehsil/Tehsil";
import {
  BusinessNatureDetail,
  BusinessNatureForm,
} from "./pages/BusinessNature/BusinessNature";
import {
  BusinessSegmentDetail,
  BusinessSegmentForm,
} from "./pages/BusinessSegment/BusinessSegment";
import { ROUTE_URLS } from "./utils/enums";
import {
  BusinessTypeDetail,
  BusinessTypeForm,
} from "./pages/BusinessType/BusinessType";
import {
  DepartmentDetail,
  DepartmentForm,
} from "./pages/Departments/Department";
import {
  LeadSourceDetail,
  LeadSourceForm,
} from "./pages/LeadSource/LeadSource";
import {
  LeadIntroductionDetail,
  LeadIntroductionForm,
} from "./pages/LeadsIntroduction/LeadsIntroduction";
import { UserDetail, UserForm } from "./pages/GenUsers/Users";
import signalRConnectionManager from "./services/SignalRService";
import LeadsIntroductionViewer, {
  LeadsIntroductionViewerDetail,
} from "./pages/LeadsIntroductionViewer/LeadsIntroductionViewer";
import LeadsDashboard from "./pages/Leads/LeadsDashboard/LeadsDashboard";
import { SessionDetail, SessionForm } from "./pages/SessionInfo/SessionInfo";
import {
  DebitNoteEntry,
  DebitNoteEntryForm,
} from "./pages/DebitNote/DebitNode";
import {
  CreditNoteEntry,
  CreditNoteEntryForm,
} from "./pages/CreditNote/CreditNote";
import {
  NewCustomerInvoiceEntry,
  NewCustomerInvoiceEntryForm,
} from "./pages/CustomerInvoice/NewCustomerInvoice";
import {
  BankAccountForm,
  BankAccountDetail,
} from "./pages/BankAccountOpening/BankAccountOpening";
import {
  GenOldCustomerDetail,
  GenOldCustomerForm,
} from "./pages/GenOldCustomers/GenOldCustomerEntry";
import {
  ProductCategoryDetail,
  ProductCategoryForm,
} from "./pages/ProductCategory/ProductCategory";
import {
  ProductInfoDetail,
  ProductInfoForm,
} from "./pages/ProductInfo/ProductInfo";
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

          <Route
            path={ROUTE_URLS.CUSTOMERS.CUSTOMER_ENTRY}
            element={<GenCustomerEntry />}
          />
          <Route
            path={`${ROUTE_URLS.CUSTOMERS.CUSTOMER_ENTRY}/:CustomerID`}
            element={<GenNewCustomerView />}
          />

          <Route
            path={`${ROUTE_URLS.ACCOUNTS.CUSTOMER_INVOICE}`}
            element={<CustomerInvoice />}
          />
          <Route
            path={`${ROUTE_URLS.GENERAL.BUSINESS_UNITS}`}
            element={<BusinessUnitDetail />}
          />
          <Route
            path={`${`${ROUTE_URLS.GENERAL.BUSINESS_UNITS}`}/:BusinessUnitID`}
            element={<BusinessUnitForm mode={"view"} />}
          />
          <Route
            path={`${`${ROUTE_URLS.GENERAL.BUSINESS_UNITS}`}/edit/:BusinessUnitID`}
            element={<BusinessUnitForm mode={"edit"} />}
          />
          <Route
            path={`${ROUTE_URLS.GENERAL.BUSINESS_UNITS}/new`}
            element={<BusinessUnitForm mode={"new"} />}
          />
          {/* Receipt Routes */}
          <Route
            path={`${ROUTE_URLS.ACCOUNTS.RECIEPT_VOUCHER_ROUTE}`}
            element={<ReceiptVoucher />}
          />
          <Route
            path={`${ROUTE_URLS.ACCOUNTS.RECIEPT_VOUCHER_ROUTE}/:ReceiptVoucherID`}
            element={<ReceiptEntryForm mode={"view"} />}
          />
          <Route
            path={`${ROUTE_URLS.ACCOUNTS.RECIEPT_VOUCHER_ROUTE}/edit/:ReceiptVoucherID`}
            element={<ReceiptEntryForm mode={"edit"} />}
          />
          <Route
            path={`${ROUTE_URLS.ACCOUNTS.RECIEPT_VOUCHER_ROUTE}/new`}
            element={<ReceiptEntryForm mode={"new"} />}
          />

          <Route
            path={`${ROUTE_URLS.ACCOUNTS.CUSTOMER_INVOICE}/:CustomerInvoiceID`}
            element={<CustomerInvoiceFormMaster mode={"view"} />}
          />
          <Route
            path={`${ROUTE_URLS.ACCOUNTS.CUSTOMER_INVOICE}/edit/:CustomerInvoiceID`}
            element={<CustomerInvoiceFormMaster mode={"edit"} />}
          />
          <Route
            path={`${ROUTE_URLS.ACCOUNTS.CUSTOMER_INVOICE}/new`}
            element={<CustomerInvoiceFormMaster mode={"new"} />}
          />

          <Route
            path={`${ROUTE_URLS.GENERAL.COMPANY_INFO_ROUTE}`}
            element={<CompanyInfo />}
          />
          <Route
            path={`${ROUTE_URLS.UTILITIES.APP_CONFIGURATION_ROUTE}`}
            element={<AppConfiguration />}
          />

          {/* Country */}
          <Route
            path={`${ROUTE_URLS.COUNTRY_ROUTE}`}
            element={<CountryDetail />}
          />
          <Route
            path={`${ROUTE_URLS.COUNTRY_ROUTE}/:CountryID`}
            element={<CountryForm mode={"view"} />}
          />
          <Route
            path={`${ROUTE_URLS.COUNTRY_ROUTE}/edit/:CountryID`}
            element={<CountryForm mode={"edit"} />}
          />
          <Route
            path={`${ROUTE_URLS.COUNTRY_ROUTE}/new`}
            element={<CountryForm mode={"new"} />}
          />
          {/* Country END */}
          {/* Tehsil */}
          <Route
            path={`${ROUTE_URLS.TEHSIL_ROUTE}`}
            element={<TehsilDetail />}
          />
          <Route
            path={`${ROUTE_URLS.TEHSIL_ROUTE}/:TehsilID`}
            element={<TehsilForm mode={"view"} />}
          />
          <Route
            path={`${ROUTE_URLS.TEHSIL_ROUTE}/edit/:TehsilID`}
            element={<TehsilForm mode={"edit"} />}
          />
          <Route
            path={`${ROUTE_URLS.TEHSIL_ROUTE}/new`}
            element={<TehsilForm mode={"new"} />}
          />
          {/* Tehsil END */}
          {/* Business Nature */}
          <Route
            path={`${ROUTE_URLS.BUSINESS_NATURE_ROUTE}`}
            element={<BusinessNatureDetail />}
          />
          <Route
            path={`${ROUTE_URLS.BUSINESS_NATURE_ROUTE}/:BusinessNatureID`}
            element={<BusinessNatureForm mode={"view"} />}
          />
          <Route
            path={`${ROUTE_URLS.BUSINESS_NATURE_ROUTE}/edit/:BusinessNatureID`}
            element={<BusinessNatureForm mode={"edit"} />}
          />
          <Route
            path={`${ROUTE_URLS.BUSINESS_NATURE_ROUTE}/new`}
            element={<BusinessNatureForm mode={"new"} />}
          />
          {/* Business Nature END */}
          {/* Business Nature */}
          <Route
            path={`${ROUTE_URLS.BUSINESS_SEGMENT_ROUTE}`}
            element={<BusinessSegmentDetail />}
          />
          <Route
            path={`${ROUTE_URLS.BUSINESS_SEGMENT_ROUTE}/:BusinessSegmentID`}
            element={<BusinessSegmentForm mode={"view"} />}
          />
          <Route
            path={`${ROUTE_URLS.BUSINESS_SEGMENT_ROUTE}/edit/:BusinessSegmentID`}
            element={<BusinessSegmentForm mode={"edit"} />}
          />
          <Route
            path={`${ROUTE_URLS.BUSINESS_SEGMENT_ROUTE}/new`}
            element={<BusinessSegmentForm mode={"new"} />}
          />
          {/* Business Nature END */}
          {/* Business Type */}
          <Route
            path={ROUTE_URLS.BUSINESS_TYPE}
            element={<BusinessTypeDetail />}
          />
          <Route
            path={`${ROUTE_URLS.BUSINESS_TYPE}/:BusinessTypeID`}
            element={<BusinessTypeForm mode={"view"} />}
          />
          <Route
            path={`${ROUTE_URLS.BUSINESS_TYPE}/edit/:BusinessTypeID`}
            element={<BusinessTypeForm mode={"edit"} />}
          />
          <Route
            path={`${ROUTE_URLS.BUSINESS_TYPE}/new`}
            element={<BusinessTypeForm mode={"new"} />}
          />
          {/* Business Type END */}
          {/* Department */}
          <Route path={ROUTE_URLS.DEPARTMENT} element={<DepartmentDetail />} />
          <Route
            path={`${ROUTE_URLS.DEPARTMENT}/:DepartmentID`}
            element={<DepartmentForm mode={"view"} />}
          />
          <Route
            path={`${ROUTE_URLS.DEPARTMENT}/edit/:DepartmentID`}
            element={<DepartmentForm mode={"edit"} />}
          />
          <Route
            path={`${ROUTE_URLS.DEPARTMENT}/new`}
            element={<DepartmentForm mode={"new"} />}
          />
          {/* Department END */}
          {/* Department */}
          <Route
            path={ROUTE_URLS.LEED_SOURCE_ROUTE}
            element={<LeadSourceDetail />}
          />
          <Route
            path={`${ROUTE_URLS.LEED_SOURCE_ROUTE}/:LeadSourceID`}
            element={<LeadSourceForm mode={"view"} />}
          />
          <Route
            path={`${ROUTE_URLS.LEED_SOURCE_ROUTE}/edit/:LeadSourceID`}
            element={<LeadSourceForm mode={"edit"} />}
          />
          <Route
            path={`${ROUTE_URLS.LEED_SOURCE_ROUTE}/new`}
            element={<LeadSourceForm mode={"new"} />}
          />
          {/* Department END */}
          {/* Leads Introduction */}
          <Route
            path={ROUTE_URLS.LEAD_INTRODUCTION_ROUTE}
            element={<LeadIntroductionDetail />}
          />
          <Route
            path={`${ROUTE_URLS.LEAD_INTRODUCTION_ROUTE}/:LeadIntroductionID`}
            element={<LeadIntroductionForm mode={"view"} />}
          />
          <Route
            path={`${ROUTE_URLS.LEAD_INTRODUCTION_ROUTE}/edit/:LeadIntroductionID`}
            element={<LeadIntroductionForm mode={"edit"} />}
          />
          <Route
            path={`${ROUTE_URLS.LEAD_INTRODUCTION_ROUTE}/new`}
            element={<LeadIntroductionForm mode={"new"} />}
          />
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
          {/* Leads Introduction END */}
          {/* Users */}
          <Route path={ROUTE_URLS.USER_ROUTE} element={<UserDetail />} />
          <Route
            path={`${ROUTE_URLS.USER_ROUTE}/:UserID`}
            element={<UserForm mode={"view"} />}
          />
          <Route
            path={`${ROUTE_URLS.USER_ROUTE}/edit/:UserID`}
            element={<UserForm mode={"edit"} />}
          />
          <Route
            path={`${ROUTE_URLS.USER_ROUTE}/new`}
            element={<UserForm mode={"new"} />}
          />
          {/* User END */}
          {/* Session */}
          <Route
            path={ROUTE_URLS.GENERAL.SESSION_INFO}
            element={<SessionDetail />}
          />
          <Route
            path={`${ROUTE_URLS.GENERAL.SESSION_INFO}/:SessionID`}
            element={<SessionForm mode={"view"} />}
          />
          <Route
            path={`${ROUTE_URLS.GENERAL.SESSION_INFO}/edit/:SessionID`}
            element={<SessionForm mode={"edit"} />}
          />
          <Route
            path={`${ROUTE_URLS.GENERAL.SESSION_INFO}/new`}
            element={<SessionForm mode={"new"} />}
          />
          {/* Session END */}
          {/* Debit Note */}
          <Route
            path={ROUTE_URLS.ACCOUNTS.DEBIT_NODE_ROUTE}
            element={<DebitNoteEntry />}
          />
          <Route
            path={`${ROUTE_URLS.ACCOUNTS.DEBIT_NODE_ROUTE}/:DebitNoteID`}
            element={<DebitNoteEntryForm mode={"view"} />}
          />
          <Route
            path={`${ROUTE_URLS.ACCOUNTS.DEBIT_NODE_ROUTE}/edit/:DebitNoteID`}
            element={<DebitNoteEntryForm mode={"edit"} />}
          />
          <Route
            path={`${ROUTE_URLS.ACCOUNTS.DEBIT_NODE_ROUTE}/new`}
            element={<DebitNoteEntryForm mode={"new"} />}
          />
          {/* Debit Note END */}
          {/* Debit Note */}
          <Route
            path={ROUTE_URLS.ACCOUNTS.CREDIT_NODE_ROUTE}
            element={<CreditNoteEntry />}
          />
          <Route
            path={`${ROUTE_URLS.ACCOUNTS.CREDIT_NODE_ROUTE}/:CreditNoteID`}
            element={<CreditNoteEntryForm mode={"view"} />}
          />
          <Route
            path={`${ROUTE_URLS.ACCOUNTS.CREDIT_NODE_ROUTE}/edit/:CreditNoteID`}
            element={<CreditNoteEntryForm mode={"edit"} />}
          />
          <Route
            path={`${ROUTE_URLS.ACCOUNTS.CREDIT_NODE_ROUTE}/new`}
            element={<CreditNoteEntryForm mode={"new"} />}
          />
          {/* Debit Note END */}
          {/* New Customer Invoice Note */}
          <Route
            path={ROUTE_URLS.ACCOUNTS.NEW_CUSTOMER_INVOICE}
            element={<NewCustomerInvoiceEntry />}
          />
          <Route
            path={`${ROUTE_URLS.ACCOUNTS.NEW_CUSTOMER_INVOICE}/:CustomerInvoiceID`}
            element={<NewCustomerInvoiceEntryForm mode={"view"} />}
          />
          <Route
            path={`${ROUTE_URLS.ACCOUNTS.NEW_CUSTOMER_INVOICE}/edit/:CustomerInvoiceID`}
            element={<NewCustomerInvoiceEntryForm mode={"edit"} />}
          />
          <Route
            path={`${ROUTE_URLS.ACCOUNTS.NEW_CUSTOMER_INVOICE}/new`}
            element={<NewCustomerInvoiceEntryForm mode={"new"} />}
          />
          {/* New Customer Invoice END */}
          {/* New Customer Invoice Note */}
          <Route
            path={ROUTE_URLS.ACCOUNTS.BANK_ACCOUNT_OPENING}
            element={<BankAccountDetail />}
          />
          <Route
            path={`${ROUTE_URLS.ACCOUNTS.BANK_ACCOUNT_OPENING}/:BankAccountID`}
            element={<BankAccountForm mode={"view"} />}
          />
          <Route
            path={`${ROUTE_URLS.ACCOUNTS.BANK_ACCOUNT_OPENING}/edit/:BankAccountID`}
            element={<BankAccountForm mode={"edit"} />}
          />
          <Route
            path={`${ROUTE_URLS.ACCOUNTS.BANK_ACCOUNT_OPENING}/new`}
            element={<BankAccountForm mode={"new"} />}
          />
          {/* New Customer Invoice END */}
          {/*  Old Customer */}
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
          {/* Old Customer END */}
          {/*  Old Customer */}
          <Route
            path={ROUTE_URLS.UTILITIES.PRODUCT_CATEGORY_ROUTE}
            element={<ProductCategoryDetail />}
          />
          <Route
            path={`${ROUTE_URLS.UTILITIES.PRODUCT_CATEGORY_ROUTE}/:ProductCategoryID`}
            element={<ProductCategoryForm mode={"view"} />}
          />
          <Route
            path={`${ROUTE_URLS.UTILITIES.PRODUCT_CATEGORY_ROUTE}/edit/:ProductCategoryID`}
            element={<ProductCategoryForm mode={"edit"} />}
          />
          <Route
            path={`${ROUTE_URLS.UTILITIES.PRODUCT_CATEGORY_ROUTE}/new`}
            element={<ProductCategoryForm mode={"new"} />}
          />
          {/* Old Customer END */}
          {/*  Old Customer */}
          <Route
            path={ROUTE_URLS.UTILITIES.PRODUCT_INFO_ROUTE}
            element={<ProductInfoDetail />}
          />
          <Route
            path={`${ROUTE_URLS.UTILITIES.PRODUCT_INFO_ROUTE}/:ProductInfoID`}
            element={<ProductInfoForm mode={"view"} />}
          />
          <Route
            path={`${ROUTE_URLS.UTILITIES.PRODUCT_INFO_ROUTE}/edit/:ProductInfoID`}
            element={<ProductInfoForm mode={"edit"} />}
          />
          <Route
            path={`${ROUTE_URLS.UTILITIES.PRODUCT_INFO_ROUTE}/new`}
            element={<ProductInfoForm mode={"new"} />}
          />
          {/* Old Customer END */}
          {/* Leads */}
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
