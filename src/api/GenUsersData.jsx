import axios from "axios"

import { apiUrl } from "../../public/COSTANTS"

export async function fetchAllUsers(LoginUserID) {
  try {
    const { data } = await axios.post(
      apiUrl + `/EduIMS/GetAllUsers?LoginUserID=${LoginUserID}`
    )
    return data.data ?? []
  } catch (error) {}
}

export async function deleteUser(user) {
  await axios.post(
    apiUrl +
      `/EduIMS/UsersDelete?UserID=${user.UserID}&LoginUserID=${user.LoginUserID}`
  )
}

export async function fetchOldUserById(UserID, LoginUserID) {
  try {
    const { data } = await axios.post(
      apiUrl + `/EduIMS/GetAllUsers?UserID=${UserID}&LoginUserID=${LoginUserID}`
    )
    return data
  } catch (error) {}
}
