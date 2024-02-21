import axios from "axios";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const CONTROLLER = "data_DebitNote";
const WHEREMETHOD = "GetDebitNoteWhere";
const DELETEMETHOD = "DebitNoteDelete";
const POSTMETHOD = "DebitNoteInsertUpdate";
// URL: /data_DebitNote/GetDebitNoteWhere?LoginUserID=??
export async function fetchAllDebitNotees(LoginUserID) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/GetDebitNoteData?LoginUserID=${LoginUserID}`
  );

  return data.data ?? [];
}

// URL: /data_DebitNote/GetDebitNoteWhere?DebitNoteID=??&LoginUserID=??
export async function fetchDebitNoteById(DebitNoteID, LoginUserID) {
  if (DebitNoteID === undefined || DebitNoteID === 0) {
    return [];
  } else {
    try {
      const { data } = await axios.post(
        `${apiUrl}/${CONTROLLER}/GetDebitNoteWhere?DebitNoteID=${DebitNoteID}&LoginUserID=${LoginUserID}`
      );
      return data ?? [];
    } catch (error) {
      toast.error(error.message, {
        autoClose: false,
      });
    }
  }
}
// URL: /data_DebitNote/DebitNoteDelete?DebitNoteID=??&LoginUserID=??
export async function deleteDebitNoteByID(serviceInfo) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/${DELETEMETHOD}?DebitNoteID=${serviceInfo.DebitNoteID}&LoginUserID=${serviceInfo.LoginUserID}`
  );

  if (data.success === true) {
    toast.success("Branch sucessfully deleted!");
    return true;
  } else {
    toast.error(data.message, {
      autoClose: false,
    });
    return false;
  }
}
//
export async function fetchMonthlyMaxDebitNoteNo(BusinesssUnitID) {
  try {
    const { data } = await axios.post(
      `${apiUrl}/${CONTROLLER}/GetDebitNoteNo?BusinesssUnitID=${BusinesssUnitID}`
    );
    return data;
  } catch (error) {
    toast.error(error, {
      autoClose: false,
    });
  }
}

//
export async function addNewDebitNote({ formData, userID, DebitNoteID = 0 }) {
  if (formData.DebitNoteDetail.length > 0) {
    try {
      let DebitNoteDetail = formData.DebitNoteDetail.map((item, index) => {
        return {
          RowID: index + 1,
          DetailBusinessUnitID: item.BusinessUnitID,
          Amount: parseFloat(0 + item.Amount),
          DetailDescription: item.Description,
        };
      });

      let DataToSend = {
        SessionID: formData.SessionID,
        BusinessUnitID: formData.BusinessUnitID,
        VoucherNo: formData.VoucherNo,
        VoucherDate: formData.VoucherDate,
        ReceiptMode: formData.ReceiptMode,
        DocumentNo: formData.DocumentNo,
        CustomerID: formData.Customer,
        AccountID: formData.CustomerLedgers,
        TotalNetAmount: formData.TotalNetAmount,
        Description: formData.Description,
        EntryUserID: userID,
        DebitNoteDetail: JSON.stringify(DebitNoteDetail),
      };

      if (
        DebitNoteID === 0 ||
        DebitNoteID === undefined ||
        DebitNoteID === null
      ) {
        DataToSend.DebitNoteID = 0;
      } else {
        DataToSend.DebitNoteID = DebitNoteID;
      }

      const { data } = await axios.post(
        apiUrl + `/${CONTROLLER}/${POSTMETHOD}`,
        DataToSend
      );

      if (data.success === true) {
        if (DebitNoteID !== 0) {
          toast.success("Debit Note updated successfully!");
        } else {
          toast.success("Debit Note created successfully!");
        }
        return { success: true, RecordID: data?.DebitNoteID };
      } else {
        toast.error(data.message, {
          autoClose: false,
        });
        return { success: false, RecordID: DebitNoteID };
      }
    } catch (error) {
      toast.error(error.message, {
        autoClose: false,
      });
    }
  } else {
    toast.error("Please add atleast 1 row!");
  }
}
