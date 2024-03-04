import axios from "axios";
import { toast } from "react-toastify";
import { TOAST_CONTAINER_IDS } from "../utils/enums";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const CONTROLLER = "EduIMS";
const WHEREMETHOD = "GetBankAccountWhere";
const DELETEMETHOD = "BankAccountDelete";
const POSTMEHTOD = "BankAccountInsertUpdate";

export async function addNewSession({ formData, userID }) {
  try {
    let DataToSend = {
      SessionTitle: formData.SessionTitle,
      SessionOpeningDate: formData.SessionOpeningDate,
      SessionClosingDate: formData.SessionClosingDate,
      InActive: formData.InActive === true ? 1 : 0,
      EntryUserID: userID,
    };

    if (SessionID === 0 || SessionID === undefined) {
      DataToSend.SessionID = 0;
    } else {
      DataToSend.SessionID = SessionID;
    }

    const { data } = await axios.post(
      apiUrl + `/${CONTROLLER}/${POSTMEHTOD}`,
      DataToSend
    );

    if (data.success === true) {
      if (SessionID !== 0) {
        toast.success("Business Type updated successfully!");
      } else {
        toast.success("Business Type created successfully!");
      }
      return { success: true, RecordID: data?.SessionID };
    } else {
      toast.error(data.message, {
        autoClose: false,
      });
      return { success: false, RecordID: SessionID };
    }
  } catch (e) {
    toast.error(e.message, {
      autoClose: false,
    });
  }
}
