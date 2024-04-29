export const ROUTE_URLS = {
  BUSINESS_TYPE: "/general/businesstype",
  DEPARTMENT: "/general/department",
  COUNTRY_ROUTE: "/general/country",
  TEHSIL_ROUTE: "/general/tehsil",
  BUSINESS_NATURE_ROUTE: "/general/businessnature",
  BUSINESS_SEGMENT_ROUTE: "/general/businesssegment",
  LEED_SOURCE_ROUTE: "/general/leadsource",
  LEAD_INTRODUCTION_ROUTE: "/general/leadintroduction",
  USER_ROUTE: "/general/users",
  DASHBOARD: "/dashboard",
  CUSTOMERS: {
    CUSTOMER_ENTRY: "/customer/customerentry",
    OLD_CUSTOMER_ENTRY: "/customer/oldcustomerentry",
    CUSTOMER_INVOICE: "/customer/customerinvoice",
    RECIEPT_VOUCHER_ROUTE: "/customer/reciepts",
  },
  GENERAL: {
    BUSINESS_UNITS: "/general/businessunits",
    SESSION_INFO: "/general/sessioninfo",
    PRODUCT_CATEGORY_ROUTE: "/general/productcategory",
    PRODUCT_INFO_ROUTE: "/general/productinfo",
    COMPANY_INFO_ROUTE: "/general/companyinfo",
    LEADS_INTROUDCTION_VIEWER_ROUTE: "/general/leadintroduction/leadsview",
    LEADS_INTROUDCTION_DETAIL_VIEWER_ROUTE:
      "/general/leadintroduction/leadsview/detail",
    LEADS_INTROUDCTION_COMMENT_ROUTE: "/general/leadintroduction/leadcomments",
    APP_CONFIGURATION_ROUTE: "/utilities/appconfiguration",
  },
  UTILITIES: {
    PRODUCT_CATEGORY_ROUTE: "/utilities/productcategory",
    PRODUCT_INFO_ROUTE: "/utilities/productinfo",
    INVOICE_DESCRIPTIONS: "/utilities/invoicedescription",
  },
  ACCOUNTS: {
    BANK_ACCOUNT_OPENING: "/accounts/bankaccountopening",
    CUSTOMER_INVOICE: "/customer/customerinvoice",
    RECIEPT_VOUCHER_ROUTE: "/customer/reciepts",
    DEBIT_NODE_ROUTE: "/customer/debitnote",
    CREDIT_NODE_ROUTE: "/customer/creditnote",
    NEW_CUSTOMER_INVOICE: "/customer/newcustomerinvoice",
  },
  LEADS: {
    LEADS_DASHBOARD: "/leads/dashboard",
    LEED_SOURCE_ROUTE: "/leads/leadsource",
    LEAD_INTRODUCTION_ROUTE: "/leads/leadintroduction",
    LEADS_USER_DASHBOARD: "/leads/userdashboard",
  },
  CONFIGURATION: {
    USER_RIGHTS_ROUTE: "/configuration/userrights",
  },
  REPORTS: {
    ACCOUNT_LEDGER_REPORT_ROUTE: "/reports/accountledger",
  },
}

export const QUERY_KEYS = {
  BUSINESS_TYPE_QUERY_KEY: "businessTypes",
  BUSINESS_UNIT_QUERY_KEY: "businessUnits",
  DEPARTMENT_QUERY_KEY: "departments",
  COUNTRIES_QUERY_KEY: "countries",
  TEHSIL_QUERY_KEY: "tehsils",
  BUSINESS_NATURE_QUERY_KEY: "businessNature",
  BUSINESS_SEGMENT_QUERY_KEY: "businessSegments",
  LEED_SOURCE_QUERY_KEY: "leadSources",
  LEAD_INTRODUCTION_QUERY_KEY: "leadIntroduction",
  LEADS_CARD_DATA: "leadsCardData",
  LEADS_DEMO_DATA: "leadsDemoData",
  SESSION_INFO_QUERY_KEY: "sessions",
  RECEIPT_VOUCHER_INFO_QUERY_KEY: "receiptVouchers",
  DEBIT_NODE_QUERY_KEY: "debitNotes",
  CREDIT_NODE_QUERY_KEY: "creditNotes",
  CUSTOMER_INVOICE_QUERY_KEY: "customerInvoices",
  BANK_ACCOUNTS_QUERY_KEY: "bankAccountOpenings",
  OLD_CUSTOMERS_QUERY_KEY: "oldcustomers",
  PRODUCT_CATEGORIES_QUERY_KEY: "productCategories",
  PRODUCT_INFO_QUERY_KEY: "productsInfo",
  USER_ROLES_QUERY_KEY: "userRoles",
  // Select
  ALL_CUSTOMER_QUERY_KEY: "oldcustomers",
  CUSTOMER_ACCOUNTS_QUERY_KEY: "customerAccounts",
}

export const SELECT_QUERY_KEYS = {
  COUNTRIES_SELECT_QUERY_KEY: "countriesSelect",
  BUSINESS_TYPES_SELECT_QUERY_KEY: "businessTypesSelect",
  BUSINESS_NATURE_SELECT_QUERY_KEY: "businessNatureSelect",
  BUSINESS_SEGMENTS_SELECT_QUERY_KEY: "businessSegmentSelect",
  TEHSIL_SELECT_QUERY_KEY: "tehsilsSelect",
  LEAD_SOURCE_SELECT_QUERY_KEY: "leadSourcesSelect",
  DEPARTMENT_SELECT_QUERY_KEY: "departmentsSelect",
  USERS_SELECT_QUERY_KEY: "usersSelect",
  SESSION_SELECT_QUERY_KEY: "sessionsSelect",
  BANKS_SELECT_QUERY_KEY: "bankAccountsSelect",
  CUSTOMER_BRANCHES_SELECT_QUERY_KEY: "customerBranchesSelect",
  PRODUCTS_INFO_SELECT_QUERY_KEY: "productsInfoSelect",
  SERVICES_SELECT_QUERY_KEY: "servicesInfoSelect",
  BUSINESS_UNIT_SELECT_QUERY_KEY: "businessUnitsSelect",
  ACTIVATION_CLIENTS_SELECT_QUERY_KEY: "activationClientsSelect",
  SOFTWARE_CLIENTS_SELECT_QUERY_KEY: "softwareClientsSelect",
  PRODUCT_CATEGORIES_SELECT_QUERY_KEY: "productCategoriesSelect",
  USER_ROLES_SELECT_QUERY_KEY: "userRolesSelect",
}

export const REPORTS_QUERY_KEYS = {
  ACCOUNT_LEDGER_QUERY_KEY: "accountLedgerReport",
}

export const TOAST_CONTAINER_IDS = {
  CLOSE_ON_CLICK: "closeOnClick",
  AUTO_CLOSE: "autoClose",
}

export const MENU_KEYS = {
  GENERAL: {
    GROUP_NAME: "General",
    GROUP_KEY: "mnuGeneral",
    COUNTRY_FORM_KEY: "mnuCountry",
    TEHSIL_FORM_KEY: "mnuTehsil",
    COMPANY_INFO_FORM_KEY: "mnuCompanyInfo",
    BUSINESS_UNIT_FORM_KEY: "mnuBusinessUnit",
    BUSINESS_NATURE_FORM_KEY: "mnuBusinessNature",
    BUSINESS_TYPE_FORM_KEY: "mnuBusinessType",
    BUSINESS_SEGMENT_FORM_KEY: "mnuBusinessSegment",
    SESSION_INFO_FORM_KEY: "mnuSessionInfo",
  },
  USERS: {
    GROUP_NAME: "Users",
    GROUP_KEY: "mnuUsers",
    USERS_FORM_KEY: "mnuUsers",
    DEPARTMENTS_FORM_KEY: "mnuDepartments",
    CUSTOMERS_FORM_KEY: "mnuCustomers",
    OLD_CUSTOMERS_FORM_KEY: "mnuOldCustomers",
  },
  ACCOUNTS: {
    GROUP_NAME: "Accounts",
    GROUP_KEY: "mnuAccounts",
    BANK_ACCOUNTS_FORM_KEY: "mnuBankAccounts",
    RECIEPT_VOUCHER_FORM_KEY: "mnuRecieptVoucher",
    DEBIT_NOTE_FORM_KEY: "mnuDebitNote",
    CREDIT_NOTE_FORM_KEY: "mnuCreditNote",
    CUSTOMER_INVOICE_FORM_KEY: "mnuNewCustomerInvoice",
  },
  LEADS: {
    GROUP_NAME: "Leads",
    GROUP_KEY: "mnuLeads",
    LEADS_FORM_KEY: "mnuLeads",
    LEAD_SOURCE_FORM_KEY: "mnuLeadSource",
    LEAD_INTRODUCTION_FORM_KEY: "mnuLeadIntroduction",
    LEADS_DASHBOARD_KEY: "mnuLeadsDashboard",
    LEADS_USER_DASHBOARD_KEY: "mnuLeadsUserDashboard",
  },
  UTILITIES: {
    GROUP_NAME: "Utilities",
    GROUP_KEY: "mnuUtitities",
    APP_CONFIGURATION_FORM_KEY: "mnuAppConfiguration",
    PRODUCT_CATEGORIES_FORM_KEY: "mnuProductCategories",
    PRODUCT_INFO_FORM_KEY: "mnuProductInfo",
    INVOICE_DESCRIPTIONS_FORM_KEY: "mnuInvoiceDescriptions",
  },
  CONFIGURATION: {
    GROUP_NAME: "Configuration",
    GROUP_KEY: "mnuConfiguration",
    USER_RIGHTS_ROUTE: "mnuUserRights",
  },
  REPORTS: {
    GROUP_NAME: "Reports",
    GROUP_KEY: "mnuReports",
    ACCOUNT_LEDGER_REPORT_FORM_KEY: "mnuAccountLedgerReport",
  },
}

export const MOVEABLE_COMPNENTS_NAMES = {
  LEADS_DASHBOARD_CARDS: "InfoCardsContainer",
}
