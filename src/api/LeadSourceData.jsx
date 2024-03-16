import axios from "axios";
import { decryptID, encryptID } from "../utils/crypto";
import { ShowErrorToast, ShowSuccessToast } from "../utils/CommonFunctions";

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
  try {
    if (LeadSourceID !== undefined) {
      LeadSourceID = decryptID(LeadSourceID);
      const { data } = await axios.post(
        `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?LeadSourceID=${LeadSourceID}&LoginUserID=${LoginUserID}`
      );
      return data.data ?? [];
    } else {
      return [];
    }
  } catch (e) {
    ShowErrorToast("Fetch::" + e.message);
  }
}
// URL: /EduIMS/LeadSourceDelete?LeadSourceID=??&LoginUserID=??
export async function deleteLeadSourceByID({ LeadSourceID, LoginUserID }) {
  try {
    LeadSourceID = decryptID(LeadSourceID);
    const { data } = await axios.post(
      `${apiUrl}/${CONTROLLER}/${DELETEMETHOD}?LeadSourceID=${LeadSourceID}&LoginUserID=${LoginUserID}`
    );

    if (data.success === true) {
      ShowSuccessToast("LeadSource sucessfully deleted!");
      return true;
    } else {
      ShowErrorToast(data.message);
      return false;
    }
  } catch (e) {
    ShowErrorToast("Delete::" + e.message);
  }
}

export async function addNewLeadSource({ formData, userID, LeadSourceID = 0 }) {
  try {
    let DataToSend = {
      LeadSourceTitle: formData.LeadSourceTitle,
      InActive: formData.InActive === true ? 1 : 0,
      EntryUserID: userID,
    };

    LeadSourceID = LeadSourceID === 0 ? 0 : decryptID(LeadSourceID);
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
        ShowSuccessToast("Lead Source updated successfully!");
      } else {
        ShowSuccessToast("Lead Source created successfully!");
      }
      return { success: true, RecordID: encryptID(data?.LeadSourceID) };
    } else {
      ShowErrorToast(data.message);
      return { success: false, RecordID: LeadSourceID };
    }
  } catch (e) {
    ShowErrorToast(e.message);
  }
}
