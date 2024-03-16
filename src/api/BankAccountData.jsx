import axios from "axios";
import { toast } from "react-toastify";
import { TOAST_CONTAINER_IDS } from "../utils/enums";
import { ShowErrorToast, ShowSuccessToast } from "../utils/CommonFunctions";
import { decryptID, encryptID } from "../utils/crypto";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const CONTROLLER = "EduIMS";
const WHEREMETHOD = "GetBankAccountWhere";
const DELETEMETHOD = "BankAccountDelete";
const POSTMEHTOD = "BankAccountInsertUpdate";

// URL: /EduIMS/GetBankAccountWhere?BankAccountID=??
export async function fetchAllBankAccounts(LoginUserID) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?LoginUserID=${LoginUserID}`
  );
  return data.data ?? [];
}

// URL: /EduIMS/GetCustomerBranchWhere?BankAccountID=??&LoginUserID=??
export async function fetchBankAccountById(BankAccountID, LoginUserID) {
  try {
    BankAccountID = decryptID(BankAccountID);
    if (BankAccountID !== null) {
      const { data } = await axios.post(
        `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?BankAccountID=${BankAccountID}&LoginUserID=${LoginUserID}`
      );
      return data.data;
    } else {
      return [];
    }
  } catch (e) {
    ShowErrorToast("Fetch::" + e.message);
  }
}

// URL: /EduIMS/BankAccountDelete?BankAccountID=??&LoginUserID=??
export async function deleteBankAccountByID({ BankAccountID, LoginUserID }) {
  try {
    BankAccountID = decryptID(BankAccountID);
    const { data } = await axios.post(
      `${apiUrl}/${CONTROLLER}/${DELETEMETHOD}?BankAccountID=${BankAccountID}&LoginUserID=${LoginUserID}`
    );

    if (data.success === true) {
      ShowSuccessToast("Bank account deleted successfully!");
    } else {
      ShowErrorToast(data.message);
    }
  } catch (e) {
    ShowErrorToast("Delete::" + e.message);
  }
}

export async function addNewBankAccount({
  formData,
  userID,
  BankAccountID = 0,
}) {
  try {
    let DataToSend = {
      BankAccountTitle: formData.BankAccountTitle,
      BankTitle: formData.BankTitle,
      BranchName: formData.BranchName || "",
      BranchCode: formData.BranchCode || "",
      AccountNo: formData.AccountNo || "",
      IbanNo: formData.IbanNo || "",
      InActive: formData.InActive ? 1 : 0,
      EntryUserID: userID,
    };

    BankAccountID = BankAccountID === 0 ? 0 : decryptID(BankAccountID);
    if (BankAccountID === 0 || BankAccountID === undefined) {
      DataToSend.BankAccountID = 0;
    } else {
      DataToSend.BankAccountID = BankAccountID;
    }

    const { data } = await axios.post(
      apiUrl + `/${CONTROLLER}/${POSTMEHTOD}`,
      DataToSend
    );

    if (data.success === true) {
      if (BankAccountID !== 0) {
        ShowSuccessToast("Bank Account updated successfully!");
      } else {
        ShowSuccessToast("Bank Account created successfully!");
      }
      return { success: true, RecordID: encryptID(data?.BankAccountID) };
    } else {
      ShowErrorToast(data.message);
      return { success: false, RecordID: BankAccountID };
    }
  } catch (error) {
    ShowErrorToast("Insert::" + error.message);
  }
}
