import axios from "axios";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const CONTROLLER = "EduIMS";
const WHEREMETHOD = "GetInvoiceDescriptionWhere";
const DELETEMETHOD = "InvoiceDescriptionDelete";

// URL: /EduIMS/GetCustomerBranchWhere?LoginUserID=??
export async function fetchAllInvoiceDeafultDescriptions(LoginUserID) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?LoginUserID=${LoginUserID}`
  );
  return data.data ?? [];
}

// URL: /EduIMS/GetCustomerBranchWhere?CustomerBranchID=??&LoginUserID=??
export async function fetchInvoiceDeafultDescriptionById(
  CustomerBranchID,
  LoginUserID
) {
  try {
    const { data } = await axios.post(
      `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?DescriptionID=${CustomerBranchID}&LoginUserID=${LoginUserID}`
    );
    return data;
  } catch (error) {}
}
// URL: /EduIMS/CustomerBranchDelete?CustomerBranchID=??&LoginUserID=??
export async function deleteInvoiceDeafultDescriptionsByID(
  invoiceDefaultDescription
) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/${DELETEMETHOD}?DescriptionID=${invoiceDefaultDescription.DescriptionID}&LoginUserID=${invoiceDefaultDescription.LoginUserID}`
  );

  if (data.success === true) {
    toast.success("Description sucessfully deleted!");
    return true;
  } else {
    toast.error(data.message);
    return false;
  }
}
