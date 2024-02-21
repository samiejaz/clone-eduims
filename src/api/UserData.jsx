import axios from "axios";
import { toast } from "react-toastify";
import { convertBase64StringToFile } from "../utils/CommonFunctions";
import { TOAST_CONTAINER_IDS } from "../utils/enums";

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
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/${DELETEMETHOD}?UserID=${UserID}&LoginUserID=${LoginUserID}`
  );

  if (data.success === true) {
    toast.success("User sucessfully deleted!");
    return true;
  } else {
    toast.error(data.message, {
      autoClose: false,
    });
    return false;
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

    if (+UserID === 0 || +UserID === undefined) {
      newFormData.append("LoginUserID", 0);
    } else {
      newFormData.append("LoginUserID", +UserID);
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
        if (+UserID === user.userID) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              userID: UserID,
              username: formData.FirstName + " " + formData.LastName,
              image: UserImage,
            })
          );
        }
        toast.success("User updated successfully!", {
          containerId: TOAST_CONTAINER_IDS.AUTO_CLOSE,
        });
      } else {
        toast.success("User created successfully!", {
          containerId: TOAST_CONTAINER_IDS.AUTO_CLOSE,
        });
      }
      return { success: true, RecordID: data?.LoginUserID };
    } else {
      toast.error(data.message, {
        autoClose: false,
      });
      return { success: false, RecordID: UserID };
    }
  } catch (err) {}
}
