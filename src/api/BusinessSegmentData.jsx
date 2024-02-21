import axios from "axios";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const CONTROLLER = "gen_BusinessSegment";
const WHEREMETHOD = "GetBusinessSegmentWhere";
const DELETEMETHOD = "BusinessSegmentDelete";
const POSTMEHTOD = "BusinessSegmentInsertUpdate";

// URL: /EduIMS/GetBusinessSegmentWhere?LoginUserID=??
export async function fetchAllBusinessSegments(LoginUserID) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?LoginUserID=${LoginUserID}`
  );
  return data.data ?? [];
}

// URL: /EduIMS/GetBusinessSegmentWhere?BusinessSegmentID=??&LoginUserID=??
export async function fetchBusinessSegmentById(BusinessSegmentID, LoginUserID) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?BusinessSegmentID=${BusinessSegmentID}&LoginUserID=${LoginUserID}`
  );
  return data.data ?? [];
}
// URL: /EduIMS/BusinessSegmentDelete?BusinessSegmentID=??&LoginUserID=??
export async function deleteBusinessSegmentByID({
  BusinessSegmentID,
  LoginUserID,
}) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/${DELETEMETHOD}?BusinessSegmentID=${BusinessSegmentID}&LoginUserID=${LoginUserID}`
  );

  if (data.success === true) {
    toast.success("Businness Segment sucessfully deleted!");
    return true;
  } else {
    toast.error(data.message, {
      autoClose: false,
    });
    return false;
  }
}

export async function addNewBusinessSegment({
  formData,
  userID,
  BusinessSegmentID = 0,
}) {
  let DataToSend = {
    BusinessSegmentTitle: formData.BusinessSegmentTitle,
    InActive: formData.InActive === true ? 1 : 0,
    EntryUserID: userID,
  };

  if (BusinessSegmentID === 0 || BusinessSegmentID === undefined) {
    DataToSend.BusinessSegmentID = 0;
  } else {
    DataToSend.BusinessSegmentID = BusinessSegmentID;
  }

  const { data } = await axios.post(
    apiUrl + `/${CONTROLLER}/${POSTMEHTOD}`,
    DataToSend
  );

  if (data.success === true) {
    if (BusinessSegmentID !== 0) {
      toast.success("Business Segment updated successfully!");
    } else {
      toast.success("Business Segment created successfully!");
    }
    return { success: true, RecordID: data?.BusinessSegmentID };
  } else {
    toast.error(data.message, {
      autoClose: false,
    });
    return { success: false, RecordID: BusinessSegmentID };
  }
}
