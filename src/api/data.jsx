import axios from "axios";

const apiUrl = import.meta.env.VITE_APP_API_URL;

export async function fetchAllCountries() {
  try {
    const { data } = await axios.post(apiUrl + "/EduIMS/GetCountriesIMS");

    return data.data;
  } catch (error) {}
}
export async function fetchAllProvinces() {
  try {
    const { data } = await axios.post(apiUrl + "/EduIMS/GetProvincesIMS");

    return data.data;
  } catch (error) {}
}

export async function fetchAllCities() {
  try {
    const { data } = await axios.post(apiUrl + "/EduIMS/GetCitiesIMS");

    return data;
  } catch (error) {}
}

export async function getImg(LoginUserID) {
  const { data } = await axios.post(
    apiUrl + "/EduIMS/GetDBMultiImage?LoginUserID=1"
  );

  return data;
}
