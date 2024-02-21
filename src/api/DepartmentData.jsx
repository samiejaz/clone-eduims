import axios from "axios";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const CONTROLLER = "EduIMS";
const WHEREMETHOD = "GetDepartmentWhere";
const DELETEMETHOD = "DepartmentDelete";

// URL: /EduIMS/GetDepartmentWhere?LoginUserID=??
export async function fetchAllDepartments(LoginUserID) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?LoginUserID=${LoginUserID}`
  );
  return data.data ?? [];
}

// URL: /EduIMS/GetDepartmentWhere?DepartmentID=??&LoginUserID=??
export async function fetchDepartmentById(DepartmentID, LoginUserID) {
  if (DepartmentID !== undefined) {
    const { data } = await axios.post(
      `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?DepartmentID=${DepartmentID}&LoginUserID=${LoginUserID}`
    );
    return data.data ?? [];
  } else {
    return [];
  }
}
// URL: /EduIMS/DepartmentDelete?DepartmentID=??&LoginUserID=??
export async function deleteDepartmentByID({ DepartmentID, LoginUserID }) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/${DELETEMETHOD}?DepartmentID=${DepartmentID}&LoginUserID=${LoginUserID}`
  );

  if (data.success === true) {
    toast.success("Department sucessfully deleted!");
    return true;
  } else {
    toast.error(data.message, {
      autoClose: false,
    });
    return false;
  }
}

export async function addNewDepartment({ formData, userID, DepartmentID = 0 }) {
  try {
    let DataToSend = {
      DepartmentName: formData.DepartmentName,
      InActive: formData.InActive === true ? 1 : 0,
      EntryUserID: userID,
    };

    if (DepartmentID === 0 || DepartmentID === undefined) {
      DataToSend.DepartmentID = 0;
    } else {
      DataToSend.DepartmentID = DepartmentID;
    }

    const { data } = await axios.post(
      apiUrl + `/${CONTROLLER}/DepartmentsInsertUpdate`,
      DataToSend
    );

    if (data.success === true) {
      if (DepartmentID !== 0) {
        toast.success("Department updated successfully!");
      } else {
        toast.success("Department created successfully!");
      }
      return { success: true, RecordID: data?.DepartmentID };
    } else {
      toast.error(data.message, {
        autoClose: false,
      });
      return { success: false, RecordID: DepartmentID };
    }
  } catch (e) {
    toast.error(e.message, {
      autoClose: false,
    });
  }
}
