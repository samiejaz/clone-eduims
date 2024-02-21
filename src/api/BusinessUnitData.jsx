import axios from "axios";
import { toast } from "react-toastify";
import { convertBase64StringToFile } from "../utils/CommonFunctions";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const CONTROLLER = "EduIMS";
const WHEREMETHOD = "GetBusinessUnitWhere";
const DELETEMETHOD = "BusinessUnitsDelete";
const POSTMEHTOD = "BusinessUnitsInsertUpdate";

// URL: /gen_BusinessUnit/GetBusinessUnitWhere?LoginUserID=??
export async function fetchAllBusinessUnits(LoginUserID) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?LoginUserID=${LoginUserID}`
  );
  return data.data ?? [];
}

// URL: /gen_BusinessUnit/GetBusinessUnitWhere?BusinessUnitID=??&LoginUserID=??
export async function fetchBusinessUnitById(BusinessUnitID = 0, LoginUserID) {
  if (BusinessUnitID !== undefined || BusinessUnitID !== 0) {
    const { data } = await axios.post(
      `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?BusinessUnitID=${BusinessUnitID}&LoginUserID=${LoginUserID}`
    );
    return data.data ?? [];
  } else {
    return [];
  }
}
// URL: /gen_BusinessUnit/BusinessUnitDelete?BusinessUnitID=??&LoginUserID=??
export async function deleteBusinessUnitByID(serviceInfo) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/${DELETEMETHOD}?BusinessUnitID=${serviceInfo.BusinessUnitID}&LoginUserID=${serviceInfo.LoginUserID}`
  );

  if (data.success === true) {
    toast.success("Business Unit sucessfully deleted!");
    return true;
  } else {
    toast.error(data.message, {
      autoClose: false,
    });
    return false;
  }
}
// URL: /gen_BusinessUnit/BusinessUnitInsertUpdate
export async function addNewBusinessUnit({
  formData,
  userID,
  BusinessUnitID = 0,
  BusinessUnitLogo,
}) {
  try {
    let newFormData = new FormData();
    newFormData.append("BusinessUnitName", formData.BusinessUnitName);
    newFormData.append("Address", formData.Address || "");
    newFormData.append("LandlineNo", formData.LandlineNo || "");
    newFormData.append("MobileNo", formData.MobileNo || "");
    newFormData.append("Email", formData.Email || "");
    newFormData.append("Website", formData.Website || "");
    newFormData.append(
      "AuthorityPersonName",
      formData.AuthorityPersonName || ""
    );
    newFormData.append("AuthorityPersonNo", formData.AuthorityPersonNo || "");
    newFormData.append(
      "AuthorityPersonEmail",
      formData.AuthorityPersonEmail || ""
    );
    newFormData.append("NTNno", formData.NTNno || "");
    newFormData.append("STRNo", formData.STRNo || "");
    newFormData.append("Description", formData.Description || "");
    newFormData.append("EntryUserID", userID);
    newFormData.append("Inactive", formData.InActive === false ? 0 : 1);
    if (BusinessUnitLogo !== "" || BusinessUnitLogo !== undefined) {
      let businessUnitFile = convertBase64StringToFile(BusinessUnitLogo, true);
      newFormData.append("image", businessUnitFile);
    }

    const { r, g, b } = formData.PrimaryColor;
    newFormData.append("RedColor", r);
    newFormData.append("GreenColor", g);
    newFormData.append("BlueColor", b);

    if (+BusinessUnitID === 0 || +BusinessUnitID === undefined) {
      newFormData.append("BusinessUnitID", 0);
    } else {
      newFormData.append("BusinessUnitID", +BusinessUnitID);
    }

    const { data } = await axios.post(
      apiUrl + `/${CONTROLLER}/${POSTMEHTOD}`,
      newFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (data.success === true) {
      if (+BusinessUnitID !== 0) {
        toast.success("Business Unit updated successfully!");
      } else {
        toast.success("Business Unit created successfully!");
      }
      return { success: true, RecordID: data?.BusinessUnitID };
    } else {
      toast.error(data.message, {
        autoClose: false,
      });
      return { success: false, RecordID: BusinessUnitID };
    }
  } catch (err) {}
}
