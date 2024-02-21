import axios from "axios";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const CONTROLLER = "gen_LeadSource";
const WHEREMETHOD = "GetLeadSourceWhere";
const DELETEMETHOD = "LeadSourceDelete";
const POSTMETHOD = "LeadSourceInsertUpdate";

// URL: /EduIMS/GetLeadSourceWhere?LoginUserID=??
export async function fetchAllLeadSources(LoginUserID) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?LoginUserID=${LoginUserID}`
  );
  return data.data ?? [];
}

// URL: /EduIMS/GetLeadSourceWhere?LeadSourceID=??&LoginUserID=??
export async function fetchLeadSourceById(LeadSourceID, LoginUserID) {
  if (LeadSourceID !== undefined) {
    const { data } = await axios.post(
      `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?LeadSourceID=${LeadSourceID}&LoginUserID=${LoginUserID}`
    );
    return data.data ?? [];
  } else {
    return [];
  }
}
// URL: /EduIMS/LeadSourceDelete?LeadSourceID=??&LoginUserID=??
export async function deleteLeadSourceByID({ LeadSourceID, LoginUserID }) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/${DELETEMETHOD}?LeadSourceID=${LeadSourceID}&LoginUserID=${LoginUserID}`
  );

  if (data.success === true) {
    toast.success("LeadSource sucessfully deleted!");
    return true;
  } else {
    toast.error(data.message, {
      autoClose: false,
    });
    return false;
  }
}

export async function addNewLeadSource({ formData, userID, LeadSourceID = 0 }) {
  let DataToSend = {
    LeadSourceTitle: formData.LeadSourceTitle,
    InActive: formData.InActive === true ? 1 : 0,
    EntryUserID: userID,
  };

  if (LeadSourceID === 0 || LeadSourceID === undefined) {
    DataToSend.LeadSourceID = 0;
  } else {
    DataToSend.LeadSourceID = LeadSourceID;
  }

  const { data } = await axios.post(
    apiUrl + `/${CONTROLLER}/${POSTMETHOD}`,
    DataToSend
  );

  if (data.success === true) {
    if (LeadSourceID !== 0) {
      toast.success("Lead Source updated successfully!");
    } else {
      toast.success("Lead Source created successfully!");
    }
    return { success: true, RecordID: data?.LeadSourceID };
  } else {
    toast.error(data.message, {
      autoClose: false,
    });
    return { success: false, RecordID: LeadSourceID };
  }
}
