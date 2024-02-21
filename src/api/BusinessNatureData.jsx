import axios from "axios";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const CONTROLLER = "gen_BusinessNature";
const WHEREMETHOD = "GetBusinessNatureWhere";
const DELETEMETHOD = "BusinessNatureDelete";
const POSTMETHOD = "BusinessNatureInsertUpdate";

// URL: /EduIMS/GetBusinessNatureWhere?LoginUserID=??
export async function fetchAllBusinessNatures(LoginUserID) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?LoginUserID=${LoginUserID}`
  );
  return data.data ?? [];
}

// URL: /EduIMS/GetBusinessNatureWhere?BusinessNatureID=??&LoginUserID=??
export async function fetchBusinessNatureById(
  BusinessNatureID = 0,
  LoginUserID
) {
  if (BusinessNatureID !== 0) {
    const { data } = await axios.post(
      `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?BusinessNatureID=${BusinessNatureID}&LoginUserID=${LoginUserID}`
    );
    return data.data ?? [];
  } else {
    return [];
  }
}
// URL: /EduIMS/BusinessNatureDelete?BusinessNatureID=??&LoginUserID=??
export async function deleteBusinessNatureByID({
  BusinessNatureID,
  LoginUserID,
}) {
  if (BusinessNatureID !== 0) {
    const { data } = await axios.post(
      `${apiUrl}/${CONTROLLER}/${DELETEMETHOD}?BusinessNatureID=${BusinessNatureID}&LoginUserID=${LoginUserID}`
    );

    if (data.success === true) {
      toast.success("Business Nature sucessfully deleted!");
      return true;
    } else {
      toast.error(data.message, {
        autoClose: false,
      });
      return false;
    }
  }
}

export async function addNewBusinessNature({
  formData,
  userID,
  BusinessNatureID = 0,
}) {
  let DataToSend = {
    BusinessNatureTitle: formData.BusinessNatureTitle,
    InActive: formData.InActive === true ? 1 : 0,
    EntryUserID: userID,
  };

  if (BusinessNatureID === 0 || BusinessNatureID === undefined) {
    DataToSend.BusinessNatureID = 0;
  } else {
    DataToSend.BusinessNatureID = BusinessNatureID;
  }

  const { data } = await axios.post(
    apiUrl + `/${CONTROLLER}/${POSTMETHOD}`,
    DataToSend
  );

  if (data.success === true) {
    if (BusinessNatureID !== 0) {
      toast.success("Business Nature updated successfully!");
    } else {
      toast.success("Business Nature created successfully!");
    }
    return { success: true, RecordID: data?.BusinessNatureID };
  } else {
    toast.error(data.message, {
      autoClose: false,
    });
    return { success: false, RecordID: BusinessNatureID };
  }
}
