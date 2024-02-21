import axios from "axios";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_APP_API_URL;

export async function fetchAllGenOldCustomers(LoginUserID) {
  try {
    const { data } = await axios.post(
      apiUrl + "/EduIMS/GetOldCustomersWhere?LoginUserID=" + LoginUserID
    );

    return data.data ?? [];
  } catch (error) {
    toast.error(error.message, {
      autoClose: false,
    });
  }
}
export async function fetchGenOldCustomerById(CustomerID = 0, LoginUserID) {
  if (CustomerID !== null || CustomerID !== undefined || CustomerID !== 0) {
    try {
      const { data } = await axios.post(
        `${apiUrl}/EduIMS/GetOldCustomersWhere?CustomerID=${CustomerID}&LoginUserID=${LoginUserID}`
      );
      return data;
    } catch (error) {
      toast.error(error.message, {
        autoClose: false,
      });
    }
  } else {
    return [];
  }
}

export async function deleteGenOldCustomerByID(oldCustomer) {
  await axios.post(
    apiUrl + "/EduIMS/CustomerDelete?CustomerID=" + oldCustomer.OldCustomerID
  );
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
        toast.success("Customer updated successfully!");
      } else {
        toast.success("Customer created successfully!");
      }
      return { success: true, RecordID: data?.CustomerID };
    } else {
      toast.error(data.message, {
        autoClose: false,
      });
      return { success: false, RecordID: CustomerID };
    }
  } catch (error) {
    toast.error(error.message, {
      autoClose: false,
    });
  }
}
