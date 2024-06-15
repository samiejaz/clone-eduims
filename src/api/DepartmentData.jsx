import axios from "axios"
import { decryptID, encryptID } from "../utils/crypto"
import { ShowErrorToast, ShowSuccessToast } from "../utils/CommonFunctions"

const apiUrl = import.meta.env.VITE_APP_API_URL

const CONTROLLER = "EduIMS"
const WHEREMETHOD = "GetDepartmentWhere"
const DELETEMETHOD = "DepartmentDelete"

// URL: /EduIMS/GetDepartmentWhere?LoginUserID=??
export async function fetchAllDepartments(LoginUserID) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?LoginUserID=${LoginUserID}`
  )
  return data.data ?? []
}

// URL: /EduIMS/GetDepartmentWhere?DepartmentID=??&LoginUserID=??
export async function fetchDepartmentById(
  DepartmentID = undefined,
  LoginUserID
) {
  try {
    DepartmentID = decryptID(DepartmentID)

    if (DepartmentID !== 0) {
      const { data } = await axios.post(
        `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?DepartmentID=${DepartmentID}&LoginUserID=${LoginUserID}`
      )
      return data.data ?? []
    } else {
      return []
    }
  } catch (e) {
    ShowErrorToast("Fetch::" + e.message)
  }
}
// URL: /EduIMS/DepartmentDelete?DepartmentID=??&LoginUserID=??
export async function deleteDepartmentByID({ DepartmentID, LoginUserID }) {
  try {
    DepartmentID = decryptID(DepartmentID)
    const { data } = await axios.post(
      `${apiUrl}/${CONTROLLER}/${DELETEMETHOD}?DepartmentID=${DepartmentID}&LoginUserID=${LoginUserID}`
    )

    if (data.success === true) {
      ShowSuccessToast("Department sucessfully deleted!")
      return true
    } else {
      ShowErrorToast(data.message)
      return false
    }
  } catch (e) {
    ShowErrorToast("Delete::" + e.message)
  }
}

export async function addNewDepartment({ formData, userID, DepartmentID = 0 }) {
  try {
    let DataToSend = {
      DepartmentName: formData.DepartmentName,
      InActive: formData.InActive === true ? 1 : 0,
      EntryUserID: userID,
    }
    DepartmentID = DepartmentID === 0 ? 0 : decryptID(DepartmentID)
    if (DepartmentID === 0 || DepartmentID === undefined) {
      DataToSend.DepartmentID = 0
    } else {
      DataToSend.DepartmentID = DepartmentID
    }

    const { data } = await axios.post(
      apiUrl + `/${CONTROLLER}/DepartmentsInsertUpdate`,
      DataToSend
    )

    if (data.success === true) {
      if (DepartmentID !== 0) {
        ShowSuccessToast("Department updated successfully!")
      } else {
        ShowSuccessToast("Department created successfully!")
      }
      return { success: true, RecordID: encryptID(data?.DepartmentID) }
    } else {
      ShowErrorToast(data.message)
      return { success: false, RecordID: DepartmentID }
    }
  } catch (e) {
    ShowErrorToast("Insert::" + e.message)
  }
}
