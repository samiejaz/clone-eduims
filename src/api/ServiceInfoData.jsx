import axios from "axios";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_APP_API_URL;

export async function fetchAllServices(LoginUserID) {
  const { data } = await axios.post(
    apiUrl + "/EduIMS/GetServicesInfoWhere?LoginUserID=" + LoginUserID
  );
  return data.data ?? [];
}

export async function fetchServiceById(ServicesInfoID, LoginUserID) {
  try {
    const { data } = await axios.post(
      apiUrl +
        `/EduIMS/GetServicesInfoWhere?ServicesInfoID=${ServicesInfoID}&LoginUserID=${LoginUserID}`
    );
    return data;
  } catch (error) {}
}

export async function deleteServiceByID(serviceInfo) {
  const { data } = await axios.post(
    apiUrl +
      `/EduIMS/ServicesInfoDelete?ServicesInfoID=${serviceInfo.ServicesInfoID}&LoginUserID=${serviceInfo.LoginUserID}`
  );
  if (data.success === true) {
    toast.success("Service sucessfully deleted!");
    return true;
  } else {
    toast.error(data.message);
    return false;
  }
}
