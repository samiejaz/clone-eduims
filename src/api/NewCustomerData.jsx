import axios from "axios"
import { toast } from "react-toastify"
import { ShowErrorToast } from "../utils/CommonFunctions"

import { apiUrl } from "../../public/COSTANTS"

export async function fetchAllNewCustomers(LoginUserID) {
  try {
    const { data } = await axios.post(
      apiUrl + "/EduIMS/GetNewCustomerWhere?LoginUserID=" + LoginUserID
    )
    return data.data ?? []
  } catch (error) {
    toast.error(error.message, {
      autoClose: false,
    })
  }
}
export async function fetchNewCustomerById(CustomerID, LoginUserID) {
  try {
    const { data } = await axios.post(
      `${apiUrl}/EduIMS/GetNewCustomerWhere?CustomerID=${CustomerID}&LoginUserID=${LoginUserID}`
    )
    return data
  } catch (error) {
    toast.error(error.message, {
      autoClose: false,
    })
  }
}

export async function deleteNewCustomerByID(newCustomer) {
  try {
    const { data } = await axios.post(
      `${apiUrl}/EduIMS/NewCustomerDelete?CustomerID=${newCustomer.CustomerID}&LoginUserID=${newCustomer.LoginUserID}`
    )
    if (data.success === true) {
      toast.success("Customer sucessfully deleted!", {
        autoClose: 1500,
      })
      return true
    } else {
      toast.error(data.message, {
        autoClose: false,
      })
      return false
    }
  } catch (err) {
    ShowErrorToast(err.message)
  }
}
