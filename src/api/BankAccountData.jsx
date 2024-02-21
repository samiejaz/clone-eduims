import axios from "axios";
import { toast } from "react-toastify";
import { TOAST_CONTAINER_IDS } from "../utils/enums";

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
  if (+BankAccountID !== null) {
    try {
      const { data } = await axios.post(
        `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?BankAccountID=${BankAccountID}&LoginUserID=${LoginUserID}`
      );
      return data.data;
    } catch (error) {}
  } else {
    return [];
  }
}

// URL: /EduIMS/BankAccountDelete?BankAccountID=??&LoginUserID=??
export async function deleteBankAccountByID(bankAccount) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/${DELETEMETHOD}?BankAccountID=${bankAccount.BankAccountID}&LoginUserID=${bankAccount.LoginUserID}`
  );

  if (data.success === true) {
    toast.success("Bank account deleted successfully!", {
      containerId: TOAST_CONTAINER_IDS.AUTO_CLOSE,
    });
  } else {
    toast.error(data.message, {
      containerId: TOAST_CONTAINER_IDS.CLOSE_ON_CLICK,
      autoClose: false,
    });
  }
}

export async function addNewBankAccount({
  formData,
  userID,
  BankAccountID = 0,
}) {
  debugger;
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
        toast.success("Bank Account updated successfully!", {
          containerId: "autoClose",
        });
      } else {
        toast.success("Bank Account created successfully!", {
          containerId: TOAST_CONTAINER_IDS.AUTO_CLOSE,
        });
      }
      return { success: true, RecordID: data?.BankAccountID };
    } else {
      toast.error(data.message, {
        containerId: TOAST_CONTAINER_IDS.CLOSE_ON_CLICK,
        autoClose: false,
      });
      return { success: false, RecordID: BankAccountID };
    }
  } catch (error) {
    toast.error(error.message);
  }
}
