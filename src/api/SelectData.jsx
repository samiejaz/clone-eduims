import axios from "axios";

const apiUrl = import.meta.env.VITE_APP_API_URL;

export async function fetchAllBusinessUnitsForSelect() {
  const { data } = await axios.post(apiUrl + "/Select/SelectBusinessUnit");
  return data.data || [];
}

export async function fetchAllProductCategoriesForSelect() {
  const { data } = await axios.post(apiUrl + "/Select/SelectProductCategory");
  return data.data;
}

export async function fetchAllServicesCategoriesForSelect() {
  const { data } = await axios.post(apiUrl + "/Select/SelectServiceCategory");
  return data.data || [];
}

export async function fetchAllOldCustomersForSelect() {
  const { data } = await axios.post(apiUrl + "/Select/SelectCustomers");
  return data.data || [];
}
export async function fetchAllSessionsForSelect() {
  const { data } = await axios.post(apiUrl + "/Select/SelectSessionInfo");
  console.log(data);
  return data.data || [];
}

export async function fetchAllCustomerAccountsForSelect(CustomerID) {
  if (CustomerID === undefined) {
    CustomerID = 0;
  }
  const { data } = await axios.post(
    apiUrl + "/Select/GetCustomerAccounts?CustomerID=" + CustomerID
  );
  return data.data || [];
}
export async function fetchAllProductsForSelect(BusinessUnitID) {
  let whereClause = "";
  if (BusinessUnitID !== undefined) {
    whereClause = "?BusinessUnitID=" + BusinessUnitID;
  }
  const { data } = await axios.post(
    apiUrl + "/Select/SelectProducts" + whereClause
  );
  return data.data || [];
}
export async function fetchAllCustomerBranchesData(AccountID) {
  let whereClause = "";

  if (AccountID !== undefined) {
    whereClause = "?AccountID=" + AccountID;
  }
  const { data } = await axios.post(
    apiUrl + "/Select/SelectCustomerBranches" + whereClause
  );

  return data.data || [];
}
export async function fetchAllServicesForSelect(BusinessUnitID) {
  let whereClause = "";
  if (BusinessUnitID !== 0) {
    whereClause = "?BusinessUnitID=" + BusinessUnitID;
  }
  const { data } = await axios.post(
    apiUrl + "/Select/SelectServices" + whereClause
  );
  return data.data || [];
}

export async function fetchAllActivationCustomersForSelect(CustomerID = 0) {
  let whereClause;
  if (CustomerID === undefined || CustomerID === 0) {
    whereClause = "?CustomerID=" + 0;
  } else {
    whereClause = "?CustomerID=" + CustomerID;
  }
  const { data } = await axios.post(
    apiUrl + "/Select/GetClientDataFromActDb" + whereClause
  );
  return data.data;
}
export async function fetchAllSoftwareCustomersForSelect(CustomerID = 0) {
  let whereClause;
  if (CustomerID === undefined || CustomerID === 0) {
    whereClause = "?CustomerID=" + 0;
  } else {
    whereClause = "?CustomerID=" + CustomerID;
  }

  const { data } = await axios.post(
    apiUrl + "/Select/GetClientDataFromsoftDb" + whereClause
  );
  return data.data;
}
export async function fetchAllSelectDescripitons(InvoiceType = "") {
  let whereClause;

  if (InvoiceType === "") {
    whereClause = "";
  } else {
    whereClause = "?InvoiceType=" + InvoiceType;
  }
  const { data } = await axios.post(
    apiUrl + "/Select/SelectInvoiceDescription"
  );
  return data.data.map((i) => i.Description);
}
export async function fetchAllCustomersBranch() {
  const { data } = await axios.post(apiUrl + "/Branch/SelectBranch");
  return data.data || [];
}
export async function fetchAllCustomerInvoices(CustomerID) {
  let whereClause;
  if (CustomerID === undefined || CustomerID === 0) {
    whereClause = "";
  } else {
    whereClause = "?CustomerID=" + CustomerID;
  }
  const { data } = await axios.post(
    apiUrl + "/data_ReceiptVoucher/SelectCustomerInvoices" + whereClause
  );
  return data.data || [];
}
export async function fetchAllInvoiceInstallmetns(CustomerID, AccountID) {
  let whereClause;
  if (
    (CustomerID === undefined || CustomerID === 0) &&
    (AccountID === undefined || AccountID === 0)
  ) {
    whereClause = "";
  } else {
    whereClause = `?CustomerID=${CustomerID}&AccountID=${AccountID}`;
  }
  const { data } = await axios.post(
    apiUrl + "/data_ReceiptVoucher/SelectCustomerInstallments" + whereClause
  );
  return data.data || [];
}

export async function fetchAllBankAccountsForSelect() {
  const { data } = await axios.post(apiUrl + "/Select/SelectBankAccounts");
  return data.data || [];
}

export async function fetchAllCountriesForSelect() {
  const { data } = await axios.post(apiUrl + "/Select/SelectCountry");
  return data.data || [];
}

export async function fetchAllTehsilsForSelect(CountryID = 0) {
  if (CountryID === 0 || CountryID === undefined) {
    return [];
  } else {
    const { data } = await axios.post(
      apiUrl + "/Select/SelectTehsil?CountryID=" + CountryID
    );
    return data.data || [];
  }
}

export async function fetchAllBusinessTypesForSelect() {
  const { data } = await axios.post(apiUrl + "/Select/SelectBusinessType");
  return data.data || [];
}
export async function fetchAllBusinessNatureForSelect(forAutoComplete = false) {
  const { data } = await axios.post(apiUrl + "/Select/SelectBusinessNature");
  if (forAutoComplete) {
    let newArr = data.data.map((item) => item.BusinessNatureTitle);
    return newArr || [];
  } else {
    return data.data || [];
  }
}

export async function fetchAllLeadSourcesForSelect() {
  const { data } = await axios.post(apiUrl + "/Select/SelectLeadSource");
  return data.data || [];
}
export async function fetchAllBusinessSegmentsForSelect() {
  const { data } = await axios.post(apiUrl + "/Select/SelectBusinessSegment");
  return data.data || [];
}
export async function fetchAllDepartmentsForSelect() {
  const { data } = await axios.post(apiUrl + "/Select/SelectDepartment");
  return data.data || [];
}
export async function fetchAllUsersForSelect() {
  const { data } = await axios.post(apiUrl + "/Select/SelectUsers");
  return data.data || [];
}
