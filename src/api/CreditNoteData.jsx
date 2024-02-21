import axios from "axios";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const CONTROLLER = "data_CreditNote";
const WHEREMETHOD = "GetCreditNoteWhere";
const DELETEMETHOD = "CreditNoteDelete";
const POSTMETHOD = "CreditNoteInsertUpdate";
// URL: /data_CreditNote/GetCreditNoteWhere?LoginUserID=??
export async function fetchAllCreditNotees(LoginUserID) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/GetCreditNoteData?LoginUserID=${LoginUserID}`
  );

  return data.data ?? [];
}

// URL: /data_CreditNote/GetCreditNoteWhere?CreditNoteID=??&LoginUserID=??
export async function fetchCreditNoteById(CreditNoteID, LoginUserID) {
  if (CreditNoteID === undefined || CreditNoteID === 0) {
    return [];
  } else {
    try {
      const { data } = await axios.post(
        `${apiUrl}/${CONTROLLER}/GetCreditNoteWhere?CreditNoteID=${CreditNoteID}&LoginUserID=${LoginUserID}`
      );
      return data ?? [];
    } catch (error) {
      toast.error(error.message, {
        autoClose: false,
      });
    }
  }
}
// URL: /data_CreditNote/CreditNoteDelete?CreditNoteID=??&LoginUserID=??
export async function deleteCreditNoteByID({ CreditNoteID, LoginUserID }) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/${DELETEMETHOD}?CreditNoteID=${CreditNoteID}&LoginUserID=${LoginUserID}`
  );

  if (data.success === true) {
    toast.success("Credit Note sucessfully deleted!");
    return true;
  } else {
    toast.error(data.message, {
      autoClose: false,
    });
    return false;
  }
}
//
export async function fetchMonthlyMaxCreditNoteNo(BusinesssUnitID) {
  try {
    const { data } = await axios.post(
      `${apiUrl}/${CONTROLLER}/GetCreditNoteNo?BusinesssUnitID=${BusinesssUnitID}`
    );
    return data;
  } catch (error) {
    toast.error(error, {
      autoClose: false,
    });
  }
}

//
export async function addNewCreditNote({ formData, userID, CreditNoteID = 0 }) {
  if (formData.CreditNoteDetail.length > 0) {
    try {
      let CreditNoteDetail = formData.CreditNoteDetail.map((item, index) => {
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
        CreditNoteDetail: JSON.stringify(CreditNoteDetail),
      };

      if (
        CreditNoteID === 0 ||
        CreditNoteID === undefined ||
        CreditNoteID === null
      ) {
        DataToSend.CreditNoteID = 0;
      } else {
        DataToSend.CreditNoteID = CreditNoteID;
      }

      const { data } = await axios.post(
        apiUrl + `/${CONTROLLER}/${POSTMETHOD}`,
        DataToSend
      );

      if (data.success === true) {
        if (CreditNoteID !== 0) {
          toast.success("Credit Note updated successfully!");
        } else {
          toast.success("Credit Note created successfully!");
        }
        return { success: true, RecordID: data?.CreditNoteID };
      } else {
        toast.error(data.message);
        return { success: false, RecordID: CreditNoteID };
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
