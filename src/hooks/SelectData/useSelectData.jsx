import { useQuery } from "@tanstack/react-query";
import {
  fetchAllActivationCustomersForSelect,
  fetchAllBankAccountsForSelect,
  fetchAllBusinessNatureForSelect,
  fetchAllBusinessSegmentsForSelect,
  fetchAllBusinessTypesForSelect,
  fetchAllBusinessUnitsForSelect,
  fetchAllCountriesForSelect,
  fetchAllCustomerAccountsForSelect,
  fetchAllCustomersBranch,
  fetchAllDepartmentsForSelect,
  fetchAllInvoiceInstallmetns,
  fetchAllLeadSourcesForSelect,
  fetchAllOldCustomersForSelect,
  fetchAllProductCategoriesForSelect,
  fetchAllProductsForSelect,
  fetchAllServicesForSelect,
  fetchAllSessionsForSelect,
  fetchAllSoftwareCustomersForSelect,
  fetchAllTehsilsForSelect,
  fetchAllUsersForSelect,
} from "../../api/SelectData";
import { QUERY_KEYS, SELECT_QUERY_KEYS } from "../../utils/enums";

// Activation Customers
export function useActivationClientsSelectData(OldCustomerID = 0) {
  const activationClients = useQuery({
    queryKey: ["activationClients", OldCustomerID],
    queryFn: () => fetchAllActivationCustomersForSelect(OldCustomerID),
    initialData: [],
  });
  return activationClients;
}

// Software Mgt. Customers
export function useSoftwareClientsSelectData(OldCustomerID = 0) {
  const softwareClients = useQuery({
    queryKey: ["softwareClients", OldCustomerID],
    queryFn: () => fetchAllSoftwareCustomersForSelect(OldCustomerID),
    initialData: [],
  });
  return softwareClients;
}
// All Customers
export function useOldCustomerSelectData() {
  const oldCustomers = useQuery({
    queryKey: ["oldcustomers"],
    queryFn: () => fetchAllOldCustomersForSelect(),
    initialData: [],
  });
  return oldCustomers;
}

// All Customer Branches
export function useAllCustomersBranchSelectData() {
  const customersBranch = useQuery({
    queryKey: ["customersBranch"],
    queryFn: () => fetchAllCustomersBranch(),
    initialData: [],
  });
  return customersBranch;
}

// Customer Accounts
export function useCustomerLedgersSelectData(CustomerID = 0) {
  const CustomerAccounts = useQuery({
    queryKey: ["customerAccounts", CustomerID],
    queryFn: () => fetchAllCustomerAccountsForSelect(CustomerID),
    enabled: CustomerID !== 0,
    initialData: [],
  });
  return CustomerAccounts;
}
// All Sessions
export function useSessionSelectData() {
  const sessionSelectData = useQuery({
    queryKey: [SELECT_QUERY_KEYS.SESSION_SELECT_QUERY_KEY],
    queryFn: fetchAllSessionsForSelect,
    staleTime: 24 * 1000 * 60 * 60,
  });

  return sessionSelectData;
}

// All Business Units
export function useBusinessUnitsSelectData() {
  const businessSelectData = useQuery({
    queryKey: ["businessUnits"],
    queryFn: () => fetchAllBusinessUnitsForSelect(),
    initialData: [],
  });
  return businessSelectData;
}

// All Products
export function useProductsInfoSelectData(BusinessUnitID = 0) {
  const productsInfoSelectData = useQuery({
    queryKey: ["productsInfo", BusinessUnitID],
    queryFn: () => fetchAllProductsForSelect(BusinessUnitID),
    initialData: [],
  });
  return productsInfoSelectData;
}

// All Product Categories
export function useProductsCategoriesSelectData() {
  const productCategories = useQuery({
    queryKey: ["productCategories"],
    queryFn: () => fetchAllProductCategoriesForSelect(),
    initialData: [],
  });

  return productCategories;
}

// All Services
export function useServicesInfoSelectData(BusinessUnitID = 0) {
  const servicesInfoSelectData = useQuery({
    queryKey: ["servicesInfo", BusinessUnitID],
    queryFn: () => fetchAllServicesForSelect(BusinessUnitID),
    initialData: [],
  });
  return servicesInfoSelectData;
}

// All Invoices
export function useCustomerInvoicesSelectData(CustomerID = 0) {
  // const customerInvoicesSelectData = useQuery({
  //   queryKey: ["customerInvoices", CustomerID],
  //   queryFn: () => fetchAllCustomerInvoices(CustomerID),
  //   initialData: [],
  // });
  return [];
}
// All Invoices
export function useCustomerInvoiceInstallments(CustomerID = 0, AccountID = 0) {
  const customerInvoiceInstallmentsSelectData = useQuery({
    queryKey: ["customerLedgers", CustomerID, AccountID],
    queryFn: () => fetchAllInvoiceInstallmetns(CustomerID, AccountID),
    initialData: [],
  });
  return customerInvoiceInstallmentsSelectData;
}

// Bank Accounts
export function useBankAccountsSelectData() {
  const data = useQuery({
    queryKey: ["bankAccounts"],
    queryFn: () => fetchAllBankAccountsForSelect(),
    initialData: [],
  });
  return data;
}

// Countries
export function useAllCountiesSelectData() {
  const data = useQuery({
    queryKey: [SELECT_QUERY_KEYS.COUNTRIES_SELECT_QUERY_KEY],
    queryFn: () => fetchAllCountriesForSelect(),
    initialData: [],
  });
  return data;
}

// Tehsils
export function useAllTehsilsSelectData(CountryID = 0) {
  const bankAccountsSelectData = useQuery({
    queryKey: [SELECT_QUERY_KEYS.TEHSIL_SELECT_QUERY_KEY, CountryID],
    queryFn: () => fetchAllTehsilsForSelect(CountryID),
    enabled: CountryID !== 0,
    initialData: [],
  });
  return bankAccountsSelectData;
}

// Business Types
export function useAllBusinessTypesSelectData() {
  const data = useQuery({
    queryKey: [SELECT_QUERY_KEYS.BUSINESS_TYPES_SELECT_QUERY_KEY],
    queryFn: () => fetchAllBusinessTypesForSelect(),
    initialData: [],
  });
  return data;
}

// Business Natures
export function useAllBusinessNatureSelectData(forAutoComplete = false) {
  const data = useQuery({
    queryKey: [SELECT_QUERY_KEYS.BUSINESS_NATURE_SELECT_QUERY_KEY],
    queryFn: () => fetchAllBusinessNatureForSelect(forAutoComplete),
    initialData: [],
  });
  return data;
}

// Business Segments
export function useAllBusinessSegmentsSelectData() {
  const data = useQuery({
    queryKey: [SELECT_QUERY_KEYS.BUSINESS_SEGMENTS_SELECT_QUERY_KEY],
    queryFn: () => fetchAllBusinessSegmentsForSelect(),
    initialData: [],
  });
  return data;
}

// Lead Sources
export function useAllLeadsSouceSelectData() {
  const data = useQuery({
    queryKey: [SELECT_QUERY_KEYS.LEAD_SOURCE_SELECT_QUERY_KEY],
    queryFn: () => fetchAllLeadSourcesForSelect(),
    initialData: [],
  });
  return data;
}

// Departments
export function useAllDepartmentsSelectData() {
  const data = useQuery({
    queryKey: [SELECT_QUERY_KEYS.DEPARTMENT_SELECT_QUERY_KEY],
    queryFn: () => fetchAllDepartmentsForSelect(),
    initialData: [],
  });
  return data;
}

// Users
export function useAllUsersSelectData() {
  const data = useQuery({
    queryKey: [SELECT_QUERY_KEYS.USERS_SELECT_QUERY_KEY],
    queryFn: () => fetchAllUsersForSelect(),
    initialData: [],
  });
  return data;
}
