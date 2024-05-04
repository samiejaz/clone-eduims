import axios from "axios"
import { decryptID, encryptID } from "../utils/crypto"
import {
  ShowErrorToast,
  ShowSuccessToast,
  formatDateWithSymbol,
} from "../utils/CommonFunctions"

import { apiUrl } from "../../public/COSTANTS"

const CONTROLLER = "data_DebitNote"
const WHEREMETHOD = "GetDebitNoteWhere"
const DELETEMETHOD = "DebitNoteDelete"
const POSTMETHOD = "DebitNoteInsertUpdate"
// URL: /data_DebitNote/GetDebitNoteWhere?LoginUserID=??
export async function fetchAllDebitNotees(LoginUserID) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/GetDebitNoteData?LoginUserID=${LoginUserID}`
  )

  return data.data ?? []
}

// URL: /data_DebitNote/GetDebitNoteWhere?DebitNoteID=??&LoginUserID=??
export async function fetchDebitNoteById(DebitNoteID, LoginUserID) {
  DebitNoteID = decryptID(DebitNoteID)
  if (DebitNoteID === undefined || DebitNoteID === 0) {
    return []
  } else {
    try {
      const { data } = await axios.post(
        `${apiUrl}/${CONTROLLER}/GetDebitNoteWhere?DebitNoteID=${DebitNoteID}&LoginUserID=${LoginUserID}`
      )
      return data ?? []
    } catch (error) {
      ShowErrorToast(error.message)
    }
  }
}
// URL: /data_DebitNote/DebitNoteDelete?DebitNoteID=??&LoginUserID=??
export async function deleteDebitNoteByID({ DebitNoteID, LoginUserID }) {
  DebitNoteID = decryptID(DebitNoteID)
  try {
    const { data } = await axios.post(
      `${apiUrl}/${CONTROLLER}/${DELETEMETHOD}?DebitNoteID=${DebitNoteID}&LoginUserID=${LoginUserID}`
    )

    if (data.success === true) {
      ShowSuccessToast("Debit note sucessfully deleted!")
      return true
    } else {
      ShowErrorToast(data.message)
      return false
    }
  } catch (err) {
    ShowErrorToast(err.message)
  }
}
//
export async function fetchMonthlyMaxDebitNoteNo(BusinesssUnitID) {
  try {
    const { data } = await axios.post(
      `${apiUrl}/${CONTROLLER}/GetDebitNoteNo?BusinesssUnitID=${BusinesssUnitID}`
    )
    return data
  } catch (error) {
    ShowErrorToast(error)
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
        }
      })

      let DataToSend = {
        SessionID: formData.SessionID,
        BusinessUnitID: formData.BusinessUnitID,
        VoucherNo: formData.VoucherNo,
        VoucherDate:
          formatDateWithSymbol(formData.VoucherDate) ??
          formatDateWithSymbol(new Date()),
        ReceiptMode: formData.ReceiptMode,
        DocumentNo: formData.DocumentNo,
        CustomerID: formData.Customer,
        AccountID: formData.CustomerLedgers,
        TotalNetAmount: formData.TotalNetAmount,
        Description: formData.Description,
        EntryUserID: userID,
        DebitNoteDetail: JSON.stringify(DebitNoteDetail),
      }

      DebitNoteID = decryptID(DebitNoteID)
      if (DebitNoteID === 0 || DebitNoteID === undefined) {
        DataToSend.DebitNoteID = 0
      } else {
        DataToSend.DebitNoteID = DebitNoteID
      }

      const { data } = await axios.post(
        apiUrl + `/${CONTROLLER}/${POSTMETHOD}`,
        DataToSend
      )

      if (data.success === true) {
        if (DebitNoteID !== 0) {
          ShowSuccessToast("Debit Note updated successfully!")
        } else {
          ShowSuccessToast("Debit Note created successfully!")
        }
        return { success: true, RecordID: encryptID(data?.DebitNoteID) }
      } else {
        ShowErrorToast(data.message, {})
        return { success: false, RecordID: DebitNoteID }
      }
    } catch (error) {
      ShowErrorToast(error.message)
    }
  } else {
    ShowErrorToast("Please add atleast 1 row!")
  }
}
