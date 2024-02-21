import axios from "axios";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_APP_API_URL;

export async function fetchAllNewCustomers(LoginUserID) {
  try {
    const { data } = await axios.post(
      apiUrl + "/EduIMS/GetNewCustomerWhere?LoginUserID=" + LoginUserID
    );
    return data.data ?? [];
  } catch (error) {
    toast.error(error.message, {
      autoClose: false,
    });
  }
}
export async function fetchNewCustomerById(CustomerID, LoginUserID) {
  try {
    const { data } = await axios.post(
      `${apiUrl}/EduIMS/GetNewCustomerWhere?CustomerID=${CustomerID}&LoginUserID=${LoginUserID}`
    );
    return data;
  } catch (error) {
    toast.error(error.message, {
      autoClose: false,
    });
  }
}

export async function deleteNewCustomerByID(newCustomer) {
  const { data } = await axios.post(
    `${apiUrl}/EduIMS/NewCustomerDelete?CustomerID=${newCustomer.CustomerID}&LoginUserID=${newCustomer.LoginUserID}`
  );
  if (data.success === true) {
    toast.success("Customer sucessfully deleted!", {
      autoClose: 1500,
    });
    return true;
  } else {
    toast.error(data.message, {
      autoClose: false,
    });
    return false;
  }
}
