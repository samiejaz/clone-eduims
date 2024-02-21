import axios from "axios";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const CONTROLLER = "EduIMS";
const WHEREMETHOD = "GetCustomerBranchWhere";
const DELETEMETHOD = "CustomerBranchDelete";

// URL: /EduIMS/GetCustomerBranchWhere?LoginUserID=??
export async function fetchAllCustomerBranches(LoginUserID) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?LoginUserID=${LoginUserID}`
  );
  return data.data ?? [];
}

// URL: /EduIMS/GetCustomerBranchWhere?CustomerBranchID=??&LoginUserID=??
export async function fetchCustomerBranchById(CustomerBranchID, LoginUserID) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?CustomerBranchID=${CustomerBranchID}&LoginUserID=${LoginUserID}`
  );
  return data.data ?? [];
}
// URL: /EduIMS/CustomerBranchDelete?CustomerBranchID=??&LoginUserID=??
export async function deleteCustomerBranchByID(serviceInfo) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/${DELETEMETHOD}?CustomerBranchID=${serviceInfo.CustomerBranchID}&LoginUserID=${serviceInfo.LoginUserID}`
  );

  if (data.success === true) {
    toast.success("Branch sucessfully deleted!");
    return true;
  } else {
    toast.error(data.message);
    return false;
  }
}
