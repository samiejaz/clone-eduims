import axios from "axios"
import { ShowErrorToast, ShowSuccessToast } from "../utils/CommonFunctions"
import {
  convertRouteGroupsToSingleRoutes,
  convertToSingleRoutesWithUserRights,
  initAuthorizedMenus,
} from "../utils/routes"
import { decryptID, encryptID } from "../utils/crypto"

const apiUrl = import.meta.env.VITE_APP_API_URL

export async function GetAllMenus({ LoginUserID }) {
  try {
    if (LoginUserID) {
      let url = apiUrl + `/data_Menus/GetAllMenus?LoginUserID=${LoginUserID}`
      const { data } = await axios.post(url)
      if (data.success) {
        const groupedRoutes = initAuthorizedMenus(data.dt)
        return groupedRoutes
      }
    } else {
      return []
    }
  } catch (e) {
    ShowErrorToast(e.message)
    return []
  }
}

export async function AddMenus({ LoginUserID, rotuesData }) {
  try {
    let DetailTable = convertRouteGroupsToSingleRoutes(rotuesData)

    let DataToSend = {
      EntryUserID: LoginUserID,
      MenusDetail: JSON.stringify(DetailTable),
    }

    let url = apiUrl + `/data_Menus/GetAllMenus?LoginUserID=${LoginUserID}`
    const { data } = await axios.post(url, JSON.stringify(DataToSend))

    if (data.success) {
      ShowSuccessToast("Inserted Routes Sucessfully!")
      return { sucess: true }
    } else {
      return { sucess: false }
    }
  } catch (err) {
    ShowErrorToast(err.message)
    return { sucess: false }
  }
}

export async function addNewUserRole({ formData, userID, RoleID = 0 }) {
  try {
    const singleRoutesDetail = convertToSingleRoutesWithUserRights(
      formData.UserRightsDetail
    )

    let DataToSend = {
      RoleTitle: formData.RoleTitle,
      RoleDetail: JSON.stringify(singleRoutesDetail),
      EntryUserID: userID,
    }
    RoleID = RoleID === 0 ? 0 : decryptID(RoleID)
    if (RoleID === 0 || RoleID === undefined) {
      DataToSend.RoleID = 0
    } else {
      DataToSend.RoleID = +RoleID
    }
    let url = apiUrl + "/gen_UserRole/UserRoleInsertUpdate"
    const { data } = await axios.post(url, DataToSend)
    if (data.success === true) {
      if (RoleID !== 0) {
        ShowSuccessToast("Role updated successfully!")
      } else {
        ShowSuccessToast("Role created successfully!")
      }
      return { success: true, RecordID: encryptID(data?.RoleID) }
    } else {
      ShowErrorToast(data.message)
      return { success: false, RecordID: encryptID(RoleID) }
    }
  } catch (e) {
    ShowErrorToast(e.message)
  }
}

export async function fetchAllUserRoless(LoginUserID) {
  const { data } = await axios.post(
    `${apiUrl}/gen_UserRole/GetUserRolesWhere?LoginUserID=${LoginUserID}&RoleID=0`
  )
  return data.Master ?? []
}

export async function fetchUserRolesById({ RoleID, LoginUserID }) {
  RoleID = decryptID(RoleID)
  if (RoleID !== undefined || RoleID !== 0) {
    const { data } = await axios.post(
      `${apiUrl}/gen_UserRole/GetUserRolesWhere?RoleID=${RoleID}&LoginUserID=${LoginUserID}`
    )
    return data ?? []
  } else {
    return []
  }
}

export async function checkForUserRightsAsync({ MenuKey, LoginUserID }) {
  try {
    if (MenuKey !== null || MenuKey !== "") {
      const { data } = await axios.post(
        `${apiUrl}/gen_UserRole/GetUserRightsForForm?MenuKey=${MenuKey}&LoginUserID=${LoginUserID}`
      )
      if (data.success) {
        let UpdatedData = data.data.map((role) => {
          return {
            RoleDelete: role.RoleDelete === "True",
            RolePrint: role.RolePrint === "True",
            RoleNew: role.RoleNew === "True",
            RoleEdit: role.RoleEdit === "True",
            ShowForm: role.ShowForm === "True",
          }
        })
        return UpdatedData
      }
    } else {
      return [
        {
          RoleDelete: false,
          RolePrint: false,
          RoleNew: false,
          RoleEdit: false,
          ShowForm: false,
        },
      ]
    }
  } catch (err) {
    ShowErrorToast(err.message)
    return [
      {
        RoleDelete: false,
        RolePrint: false,
        RoleNew: false,
        RoleEdit: false,
        ShowForm: false,
      },
    ]
  }
}

export async function deleteUserRoleByID({ RoleID, LoginUserID }) {
  try {
    RoleID = decryptID(RoleID)

    const { data } = await axios.post(
      `${apiUrl}/gen_UserRole/UserRoleDelete?RoleID=${RoleID}&LoginUserID=${LoginUserID}`
    )

    if (data.success === true) {
      ShowSuccessToast("Role sucessfully deleted!")
      return true
    } else {
      ShowErrorToast(data.message)
      return false
    }
  } catch (e) {
    ShowErrorToast(e.message)
  }
}
