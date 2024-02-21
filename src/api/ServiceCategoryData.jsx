import axios from "axios";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_APP_API_URL;

export async function fetchAllServiceCategories(LoginUserID) {
  const { data } = await axios.post(
    apiUrl + "/EduIMS/GetServiceCategoryWhere?LoginUserID=" + LoginUserID
  );
  return data.data;
}

export async function fetchServiceCategoryById(ServiceCategoryID, LoginUserID) {
  try {
    const { data } = await axios.post(
      apiUrl +
        `/EduIMS/GetServiceCategoryWhere?ServiceCategoryID=${ServiceCategoryID}&LoginUserID=${LoginUserID}`
    );
    return data;
  } catch (error) {}
}

export async function deleteServiceCategory(serviceCategory) {
  const { data } = await axios.post(
    apiUrl +
      `/EduIMS/ServiceCategoryDelete?ServiceCategoryID=${serviceCategory.ServiceCategoryID}&LoginUserID=${serviceCategory.LoginUserID}`
  );
  if (data.success === true) {
    toast.success("Service category sucessfully deleted!");
    return true;
  } else {
    toast.error(data.message);
    return false;
  }
}
