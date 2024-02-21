import axios from "axios";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const CONTROLLER = "gen_BusinessType";
const WHEREMETHOD = "GetBusinessTypeWhere";
const DELETEMETHOD = "BusinessTypeDelete";
const POSTMEHTOD = "BusinessTypeInsertUpdate";

// URL: /gen_BusinessType/GetBusinessTypeWhere?LoginUserID=??
export async function fetchAllBusinessTypes(LoginUserID) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?LoginUserID=${LoginUserID}`
  );
  return data.data ?? [];
}

// URL: /gen_BusinessType/GetBusinessTypeWhere?BusinessTypeID=??&LoginUserID=??
export async function fetchBusinessTypeById(BusinessTypeID = 0, LoginUserID) {
  if (BusinessTypeID !== undefined || BusinessTypeID !== 0) {
    const { data } = await axios.post(
      `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?BusinessTypeID=${BusinessTypeID}&LoginUserID=${LoginUserID}`
    );
    return data.data ?? [];
  } else {
    return [];
  }
}
// URL: /gen_BusinessType/BusinessTypeDelete?BusinessTypeID=??&LoginUserID=??
export async function deleteBusinessTypeByID(serviceInfo) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/${DELETEMETHOD}?BusinessTypeID=${serviceInfo.BusinessTypeID}&LoginUserID=${serviceInfo.LoginUserID}`
  );

  if (data.success === true) {
    toast.success("Business Type sucessfully deleted!");
    return true;
  } else {
    toast.error(data.message, {
      autoClose: false,
    });
    return false;
  }
}
// URL: /gen_BusinessType/BusinessTypeInsertUpdate
export async function addNewBusinessType({
  formData,
  userID,
  BusinessTypeID = 0,
}) {
  let DataToSend = {
    BusinessTypeTitle: formData.BusinessTypeTitle,
    InActive: formData.InActive === true ? 1 : 0,
    EntryUserID: userID,
  };

  if (BusinessTypeID === 0 || BusinessTypeID === undefined) {
    DataToSend.BusinessTypeID = 0;
  } else {
    DataToSend.BusinessTypeID = BusinessTypeID;
  }

  const { data } = await axios.post(
    apiUrl + `/${CONTROLLER}/${POSTMEHTOD}`,
    DataToSend
  );

  if (data.success === true) {
    if (BusinessTypeID !== 0) {
      toast.success("Business Type updated successfully!");
    } else {
      toast.success("Business Type created successfully!");
    }
    return { success: true, RecordID: data?.BusinessTypeID };
  } else {
    toast.error(data.message, {
      autoClose: false,
    });
    return { success: false, RecordID: BusinessTypeID };
  }
}
