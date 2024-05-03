import axios from "axios"
import { toast } from "react-toastify"
import { decryptID, encryptID } from "../utils/crypto"
import { ShowErrorToast, ShowSuccessToast } from "../utils/CommonFunctions"

import { apiUrl } from "../../public/COSTANTS"

const CONTROLLER = "data_LeadIntroduction"
const WHEREMETHOD = "GetLeadIntroductionWhere"
const DELETEMETHOD = "LeadIntroductionDelete"
const POSTMEHTOD = "LeadIntroductionInsertUpdate"

// URL: /data_LeadIntroduction/GetLeadIntroductionWhere?LoginUserID=??
export async function fetchAllLeadIntroductions(LoginUserID) {
  try {
    const { data } = await axios.post(
      `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?LoginUserID=${LoginUserID}`
    )

    return data.data ?? []
  } catch (err) {
    ShowErrorToast(err.message)
    return []
  }
}

// URL: /data_LeadIntroduction/GetLeadIntroductionWhere?LeadIntroductionID=??&LoginUserID=??
export async function fetchLeadIntroductionById(
  LeadIntroductionID = 0,
  LoginUserID
) {
  if (LeadIntroductionID !== undefined || LeadIntroductionID !== 0) {
    LeadIntroductionID = decryptID(LeadIntroductionID)
    const { data } = await axios.post(
      `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?LeadIntroductionID=${LeadIntroductionID}&LoginUserID=${LoginUserID}`
    )
    return data.data ?? []
  } else {
    return []
  }
}
// URL: /data_LeadIntroduction/LeadIntroductionDelete?LeadIntroductionID=??&LoginUserID=??
export async function deleteLeadIntroductionByID({
  LeadIntroductionID,
  LoginUserID,
}) {
  try {
    LeadIntroductionID = decryptID(LeadIntroductionID)
    const { data } = await axios.post(
      `${apiUrl}/${CONTROLLER}/${DELETEMETHOD}?LeadIntroductionID=${LeadIntroductionID}&LoginUserID=${LoginUserID}`
    )

    if (data.success === true) {
      ShowSuccessToast("Lead sucessfully deleted!")
      return true
    } else {
      ShowErrorToast(data.message)
      return false
    }
  } catch (e) {
    ShowErrorToast(e.message)
  }
}
// URL: /data_LeadIntroduction/LeadIntroductionInsertUpdate
export async function addNewLeadIntroduction({
  formData,
  userID,
  LeadIntroductionID = 0,
}) {
  try {
    let DataToSend = {
      CompanyName: formData.CompanyName,
      CountryID: formData.CountryID,
      TehsilID: formData.TehsilID,
      BusinessTypeID: formData.BusinessTypeID,
      BusinessNature: formData.BusinessNatureID,
      CompanyAddress: formData.CompanyAddress,
      CompanyWebsite: formData.CompanyWebsite,
      ContactPersonName: formData.ContactPersonName,
      ContactPersonEmail: formData.ContactPersonEmail,
      RequirementDetails: formData.RequirementDetails,
      LeadSourceID: formData.LeadSourceID,
      InActive: formData.InActive === true ? 1 : 0,
      EntryUserID: userID,
    }
    DataToSend.ContactPersonMobileNo = formData.ContactPersonMobileNo

    DataToSend.ContactPersonWhatsAppNo = formData.ContactPersonWhatsAppNo

    LeadIntroductionID =
      LeadIntroductionID === 0 ? 0 : decryptID(LeadIntroductionID)
    if (LeadIntroductionID === 0 || LeadIntroductionID === undefined) {
      DataToSend.LeadIntroductionID = 0
    } else {
      DataToSend.LeadIntroductionID = LeadIntroductionID
    }

    const { data } = await axios.post(
      apiUrl + `/${CONTROLLER}/${POSTMEHTOD}`,
      DataToSend
    )
    if (data.success === true) {
      if (LeadIntroductionID !== 0) {
        ShowSuccessToast("Lead updated successfully!")
      } else {
        ShowSuccessToast("Lead created successfully!")
      }
      return { success: true, RecordID: encryptID(data?.LeadIntroductionID) }
    } else {
      ShowErrorToast(data.message)
      return { success: false, RecordID: LeadIntroductionID }
    }
  } catch (e) {
    ShowErrorToast(e.message)
  }
}

export async function addLeadIntroductionOnAction({
  from,
  formData,
  userID,
  LeadIntroductionID,
  LeadIntroductionDetailID = 0,
  fileData,
  file,
}) {
  try {
    let Status = ""

    let newFormData = new FormData()
    if (from === "Forward") {
      newFormData.append(
        "UserID",
        formData.UserID === undefined || formData.UserID === null
          ? ""
          : formData.UserID
      )
      newFormData.append("MeetingPlace", formData.MeetingPlace)
      newFormData.append(
        "DepartmentID",
        formData.DepartmentID === undefined ? "" : formData.DepartmentID
      )
      newFormData.append("MeetingTime", formData.MeetingTime.toUTCString())
      newFormData.append("RecommendedProductID", formData.ProductInfoID)
      newFormData.append("Description", formData.Description ?? "")
      Status = "Forwarded"
    } else if (from === "Quoted" || from === "Finalized") {
      if (file && file.length > 0) {
        newFormData.append("AttachmentFile", file[0])
      } else {
        newFormData.append(
          "AttachmentFile",
          formData?.AttachmentFile !== undefined ? formData?.AttachmentFile : ""
        )
      }
      newFormData.append("Amount", parseFloat(0 + formData.Amount))
      newFormData.append("Description", formData.Description ?? "")

      Status = from === "Quoted" ? "Quoted" : "Finalized"
    } else if (from === "Closed") {
      newFormData.append("Amount", parseFloat(0 + formData.Amount))
      newFormData.append("Description", formData.Description ?? "")
      Status = "Closed"
    } else if (from === "MeetingDone") {
      newFormData.append("MeetingTime", formData.MeetingTime.toUTCString())
      newFormData.append("RecommendedProductID", formData.ProductInfoID)
      newFormData.append("Description", formData.Description ?? "")
      Status = "Meeting Done"
    } else if (from === "Pending") {
      newFormData.append("Description", formData.Description ?? "")
      Status = "Pending"
    } else if (from === "Acknowledged") {
      Status = "Acknowledged"
    }
    LeadIntroductionDetailID =
      LeadIntroductionDetailID === 0 ? 0 : decryptID(LeadIntroductionDetailID)
    if (LeadIntroductionDetailID !== 0) {
      newFormData.append("LeadIntroductionDetailID", LeadIntroductionDetailID)
    } else {
      newFormData.append("LeadIntroductionDetailID", 0)
    }
    newFormData.append("EntryUserID", +userID)
    LeadIntroductionID =
      LeadIntroductionID === 0 ? 0 : decryptID(LeadIntroductionID)

    newFormData.append("LeadIntroductionID", LeadIntroductionID)
    newFormData.append("Status", Status)

    const { data } = await axios.post(
      apiUrl + `/${CONTROLLER}/LeadIntroductionOnAction`,
      newFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )

    if (data.success === true) {
      return { success: true }
    } else {
      ShowErrorToast(data.message, {
        autoClose: false,
      })
      return { success: false }
    }
  } catch (error) {
    ShowErrorToast(error.message, {
      autoClose: false,
    })
  }
}

export async function fetchAllDemonstrationLeadsData({ UserID, DepartmentID }) {
  if (UserID && DepartmentID) {
    const { data } = await axios.post(
      `${apiUrl}/UserLeadDashboard/GetLeadIntroductionWhereForUser?LoginUserID=${UserID}&DepartmentID=${DepartmentID}`
    )
    return data.data ?? []
  } else {
    return []
  }
}

export async function fetchDemonstrationLeadsDataByID({
  UserID,
  DepartmentID,
  LeadIntroductionDetailID = 0,
}) {
  if (LeadIntroductionDetailID !== 0) {
    const { data } = await axios.post(
      `${apiUrl}/UserLeadDashboard/GetLeadIntroductionWhereForUser?LoginUserID=${UserID}&DepartmentID=${DepartmentID}&LeadIntroductionDetailID=${LeadIntroductionDetailID}`
    )

    return data.data ?? []
  } else {
    return []
  }
}

export async function getLeadsFile(filename) {
  try {
    if (filename) {
      const { data } = await axios.get(
        `${apiUrl}/data_LeadIntroduction/DownloadLeadProposal?filename=${filename}`,
        { responseType: "blob" }
      )
      const file = new File([data], filename, { type: data?.type })

      return file
    } else {
      return { name: null }
    }
  } catch (err) {
    ShowErrorToast(err.message, {
      autoClose: false,
    })
    return { name: null }
  }
}
