import axios from "axios";
import { ShowErrorToast, ShowSuccessToast } from "../utils/CommonFunctions";
import { decryptID, encryptID } from "../utils/crypto";

const apiUrl = import.meta.env.VITE_APP_API_URL;

export async function fetchAllGenOldCustomers(LoginUserID) {
  try {
    const { data } = await axios.post(
      apiUrl + "/EduIMS/GetOldCustomersWhere?LoginUserID=" + LoginUserID
    );

    return data.data ?? [];
  } catch (error) {
    ShowErrorToast("FetchAll::" + error.message);
  }
}
export async function fetchGenOldCustomerById(CustomerID, LoginUserID) {
  try {
    CustomerID = decryptID(CustomerID);
    if (CustomerID !== 0) {
      try {
        const { data } = await axios.post(
          `${apiUrl}/EduIMS/GetOldCustomersWhere?CustomerID=${CustomerID}&LoginUserID=${LoginUserID}`
        );
        return data;
      } catch (error) {
        ShowErrorToast(error.message);
      }
    } else {
      return [];
    }
  } catch (e) {
    ShowErrorToast("Fetch::" + error.message);
  }
}

export async function deleteGenOldCustomerByID(OldCustomerID) {
  try {
    const { data } = await axios.post(
      apiUrl + "/EduIMS/CustomerDelete?CustomerID=" + OldCustomerID
    );
    if (data.success === true) {
      ShowSuccessToast("Customer successfully deleted!");
    } else {
      ShowErrorToast(data.message);
    }
  } catch (e) {
    ShowErrorToast("Delete::" + e.message);
  }
}

export async function addNewGenOldCustomer({
  formData,
  userID,
  CustomerID = 0,
}) {
  try {
    let DataToSend = {
      ActivationDbID: formData?.ActivationDbID,
      SoftwareMgtDbID: formData?.SoftwareMgtDbID,
      CustomerName: formData.CustomerName,
      EntryUserID: userID,
    };

    CustomerID = CustomerID === 0 ? 0 : decryptID(CustomerID);
    if (CustomerID === 0 || CustomerID === undefined) {
      DataToSend.CustomerID = 0;
    } else {
      DataToSend.CustomerID = CustomerID;
    }

    const { data } = await axios.post(
      apiUrl + "/EduIMS/OldCustomerInsert",
      DataToSend
    );

    if (data.success === true) {
      if (CustomerID !== 0) {
        ShowSuccessToast("Customer updated successfully!");
      } else {
        ShowSuccessToast("Customer created successfully!");
      }
      return { success: true, RecordID: encryptID(data?.CustomerID) };
    } else {
      ShowErrorToast(data.message);
      return { success: false, RecordID: encryptID(CustomerID) };
    }
  } catch (error) {
    ShowErrorToast(error.message);
  }
}
