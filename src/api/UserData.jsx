import axios from "axios";
import {
  ShowErrorToast,
  ShowSuccessToast,
  convertBase64StringToFile,
} from "../utils/CommonFunctions";
import { TOAST_CONTAINER_IDS } from "../utils/enums";
import { decryptID, encryptID } from "../utils/crypto";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const CONTROLLER = "EduIMS";
const WHEREMETHOD = "GetAllUsers";
const DELETEMETHOD = "UserDelete";
const POSTMEHTOD = "UsersInsertUpdate";

// URL: /gen_User/GetUserWhere?LoginUserID=??
export async function fetchAllUsers(LoginUserID) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?LoginUserID=${LoginUserID}`
  );
  return data.data ?? [];
}

// URL: /gen_User/GetUserWhere?UserID=??&LoginUserID=??
export async function fetchUserById(UserID = 0, LoginUserID) {
  UserID = decryptID(UserID);
  if (UserID !== undefined || UserID !== 0) {
    const { data } = await axios.post(
      `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?UserID=${UserID}&LoginUserID=${LoginUserID}`
    );
    return data.data ?? [];
  } else {
    return [];
  }
}
// URL: /gen_User/UserDelete?UserID=??&LoginUserID=??
export async function deleteUserByID({ UserID, LoginUserID }) {
  try {
    UserID = decryptID(UserID);
    ShowErrorToast(UserID + "-" + LoginUserID);
    ShowErrorToast(
      `${apiUrl}/${CONTROLLER}/${DELETEMETHOD}?UserID=${UserID}&LoginUserID=${LoginUserID}`
    );
    const { data } = await axios.post(
      `${apiUrl}/${CONTROLLER}/${DELETEMETHOD}?UserID=${UserID}&LoginUserID=${LoginUserID}`
    );

    if (data.success === true) {
      ShowSuccessToast("User sucessfully deleted!");
      return true;
    } else {
      ShowErrorToast(data.message);
      return false;
    }
  } catch (e) {
    ShowErrorToast(e.message);
  }
}
// URL: /gen_User/UserInsertUpdate
export async function addNewUser({ formData, userID, UserID = 0, UserImage }) {
  const user = JSON.parse(localStorage.getItem("user"));
  try {
    let newFormData = new FormData();
    newFormData.append("FirstName", formData.FirstName);
    newFormData.append("LastName", formData.LastName);
    newFormData.append("DepartmentID", formData.DepartmentID);
    newFormData.append("Email", formData.Email);
    newFormData.append("Username", formData.UserName);
    newFormData.append("Password", formData.Password);
    newFormData.append("Inactive", formData.InActive === false ? 0 : 1);
    newFormData.append("EntryUserID", userID);
    if (UserImage !== "") {
      let userImageFile = convertBase64StringToFile(UserImage, true);
      newFormData.append("image", userImageFile);
    }
    UserID = UserID === 0 ? 0 : decryptID(UserID);
    if (UserID === 0 || UserID === undefined) {
      newFormData.append("LoginUserID", 0);
    } else {
      newFormData.append("LoginUserID", UserID);
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
      if (+UserID !== 0) {
        if (UserID === user.userID) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              userID: UserID,
              username: formData.FirstName + " " + formData.LastName,
              image: UserImage,
            })
          );
        }
        ShowSuccessToast("User updated successfully!", {
          containerId: TOAST_CONTAINER_IDS.AUTO_CLOSE,
        });
      } else {
        ShowSuccessToast("User created successfully!", {
          containerId: TOAST_CONTAINER_IDS.AUTO_CLOSE,
        });
      }
      return { success: true, RecordID: encryptID(data?.LoginUserID) };
    } else {
      ShowErrorToast(data.message);
      return { success: false, RecordID: encryptID(UserID) };
    }
  } catch (err) {
    ShowErrorToast(err.message);
  }
}
