import axios from "axios";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const CONTROLLER = "data_LeadIntroduction";
const WHEREMETHOD = "GetLeadIntroductionWhere";
const DELETEMETHOD = "LeadIntroductionDelete";
const POSTMEHTOD = "LeadIntroductionInsertUpdate";

// URL: /data_LeadIntroduction/GetLeadIntroductionWhere?LoginUserID=??
export async function fetchAllLeadIntroductions(LoginUserID) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?LoginUserID=${LoginUserID}`
  );

  return data.data ?? [];
}

// URL: /data_LeadIntroduction/GetLeadIntroductionWhere?LeadIntroductionID=??&LoginUserID=??
export async function fetchLeadIntroductionById(
  LeadIntroductionID = 0,
  LoginUserID
) {
  if (LeadIntroductionID !== undefined || LeadIntroductionID !== 0) {
    const { data } = await axios.post(
      `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?LeadIntroductionID=${LeadIntroductionID}&LoginUserID=${LoginUserID}`
    );
    return data.data ?? [];
  } else {
    return [];
  }
}
// URL: /data_LeadIntroduction/LeadIntroductionDelete?LeadIntroductionID=??&LoginUserID=??
export async function deleteLeadIntroductionByID(serviceInfo) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/${DELETEMETHOD}?LeadIntroductionID=${serviceInfo.LeadIntroductionID}&LoginUserID=${serviceInfo.LoginUserID}`
  );

  if (data.success === true) {
    toast.success("Lead sucessfully deleted!");
    return true;
  } else {
    toast.error(data.message, {
      autoClose: false,
    });
    return false;
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
      CompanyAddress: formData.CompanyAddress,
      CompanyWebsite: formData.CompanyWebsite,
      BusinessNature: formData.BusinessNatureID,
      ContactPersonName: formData.ContactPersonName,
      ContactPersonEmail: formData.ContactPersonEmail,
      RequirementDetails: formData.RequirementDetails,
      LeadSourceID: formData.LeadSourceID,
      InActive: formData.InActive === true ? 1 : 0,
      EntryUserID: userID,
    };
    DataToSend.ContactPersonMobileNo =
      formData.ContactPersonMobileNo.replaceAll("-", "");
    if (formData?.IsWANumberSameAsMobile) {
      DataToSend.ContactPersonWhatsAppNo =
        formData.ContactPersonWhatsAppNo[0].replaceAll("-", "");
    } else {
      DataToSend.ContactPersonWhatsAppNo =
        formData.ContactPersonWhatsAppNo.replaceAll("-", "");
    }
    if (LeadIntroductionID === 0 || LeadIntroductionID === undefined) {
      DataToSend.LeadIntroductionID = 0;
    } else {
      DataToSend.LeadIntroductionID = LeadIntroductionID;
    }

    const { data } = await axios.post(
      apiUrl + `/${CONTROLLER}/${POSTMEHTOD}`,
      DataToSend
    );
    if (data.success === true) {
      if (LeadIntroductionID !== 0) {
        toast.success("Lead updated successfully!");
      } else {
        toast.success("Lead created successfully!");
      }
      return { success: true, RecordID: data?.LeadIntroductionID };
    } else {
      toast.error(data.message, {
        autoClose: false,
      });
      return { success: false, RecordID: LeadIntroductionID };
    }
  } catch (e) {
    toast.error(e.message, {
      autoClose: false,
    });
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
    let Status = "";

    let newFormData = new FormData();
    if (from === "Forward") {
      newFormData.append(
        "UserID",
        formData.UserID === undefined || formData.UserID === null
          ? ""
          : formData.UserID
      );
      newFormData.append("MeetingPlace", formData.MeetingPlace);
      newFormData.append(
        "DepartmentID",
        formData.DepartmentID === undefined ? "" : formData.DepartmentID
      );
      newFormData.append("MeetingTime", formData.MeetingTime.toUTCString());
      newFormData.append("RecommendedProductID", formData.ProductInfoID);
      newFormData.append("Description", formData.Description ?? "");
      Status = "Forwarded";
    } else if (from === "Quoted" || from === "Finalized") {
      if (file) {
        newFormData.append("AttachmentFile", file);
      } else {
        newFormData.append(
          "AttachmentFile",
          formData?.AttachmentFile !== undefined
            ? formData?.AttachmentFile[0]
            : ""
        );
      }
      newFormData.append("Amount", formData.Amount ?? 1900);
      newFormData.append("Description", formData.Description);
      if (fileData) {
        newFormData.append("FileType", formData.Description);
        newFormData.append("FileName", formData.FileName);
        newFormData.append("FilePath", formData.FilePath);
        newFormData.append("FullFilePath", formData.FullFilePath);
      }
      Status = from === "Quoted" ? "Quoted" : "Finalized";
    } else if (from === "Closed") {
      newFormData.append("Amount", formData.Amount ?? 100);
      newFormData.append("Description", formData.Description);
      Status = "Closed";
    } else if (from === "MeetingDone") {
      newFormData.append("MeetingTime", formData.MeetingTime.toUTCString());
      newFormData.append("RecommendedProductID", formData.ProductInfoID);
      newFormData.append("Description", formData.Description ?? "");
      Status = "Meeting Done";
    } else if (from === "Pending") {
      newFormData.append("Description", formData.Description ?? "");
      Status = "Pending";
    } else if (from === "Acknowledged") {
      Status = "Acknowledged";
    }

    if (LeadIntroductionDetailID !== 0) {
      newFormData.append("LeadIntroductionDetailID", LeadIntroductionDetailID);
    } else {
      newFormData.append("LeadIntroductionDetailID", 0);
    }
    newFormData.append("EntryUserID", +userID);
    newFormData.append("LeadIntroductionID", LeadIntroductionID);
    newFormData.append("Status", Status);

    const { data } = await axios.post(
      apiUrl + `/${CONTROLLER}/LeadIntroductionOnAction`,
      newFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (data.success === true) {
      return { success: true };
    } else {
      toast.error(data.message, {
        autoClose: false,
      });
      return { success: false };
    }
  } catch (error) {
    toast.error(error.message, {
      autoClose: false,
    });
  }
}

export async function fetchAllDemonstrationLeadsData({ UserID, DepartmentID }) {
  const { data } = await axios.post(
    `${apiUrl}/UserLeadDashboard/GetLeadIntroductionWhereForUser?LoginUserID=${UserID}&DepartmentID=${DepartmentID}`
  );

  return data.data ?? [];
}

export async function fetchDemonstrationLeadsDataByID({
  UserID,
  DepartmentID,
  LeadIntroductionDetailID = 0,
}) {
  if (LeadIntroductionDetailID !== 0) {
    const { data } = await axios.post(
      `${apiUrl}/UserLeadDashboard/GetLeadIntroductionWhereForUser?LoginUserID=${UserID}&DepartmentID=${DepartmentID}&LeadIntroductionDetailID=${LeadIntroductionDetailID}`
    );

    return data.data ?? [];
  } else {
    return [];
  }
}
