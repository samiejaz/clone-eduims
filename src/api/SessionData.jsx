import axios from "axios"
import { format, parseISO } from "date-fns"
import { toast } from "react-toastify"
import { decryptID, encryptID } from "../utils/crypto"

const apiUrl = import.meta.env.VITE_APP_API_URL

const CONTROLLER = "EduIMS"
const POSTMEHTOD = "SessionInsertUpdate"

export async function fetchAllSessions(LoginUserID) {
  const { data } = await axios.post(
    apiUrl + "/EduIMS/GetSessionWhere?LoginUserID=" + LoginUserID
  )

  let newData = data.data.map((item) => {
    return {
      SessionID: item.SessionID,
      SessionTitle: item.SessionTitle,
      SessionOpeningDate: format(
        parseISO(item.SessionOpeningDate),
        "dd-MMM-yyyy"
      ),
      SessionClosingDate: format(
        parseISO(item.SessionClosingDate),
        "dd-MMM-yyyy"
      ),
    }
  })

  return newData
}

export async function fetchSessionById(SessionID = 0, LoginUserID) {
  SessionID = decryptID(SessionID)

  if (SessionID !== 0) {
    try {
      const { data } = await axios.post(
        apiUrl +
          `/EduIMS/GetSessionWhere?SessionID=${SessionID}&LoginUserID=${LoginUserID}`
      )
      return data.data
    } catch (error) {}
  } else {
    return []
  }
}

export async function deleteSessionByID({ SessionID, LoginUserID }) {
  SessionID = decryptID(SessionID)
  const { data } = await axios.post(
    apiUrl +
      `/EduIMS/SessionDelete?SessionID=${SessionID}&LoginUserID=${LoginUserID}`
  )
  if (data.success === true) {
    toast.success("Session deleted successfully!")
  } else {
    toast.error(data.message, {
      autoClose: false,
    })
  }
}

export async function addNewSession({ formData, userID, SessionID = 0 }) {
  try {
    let DataToSend = {
      SessionTitle: formData.SessionTitle,
      SessionOpeningDate: formData.SessionOpeningDate,
      SessionClosingDate: formData.SessionClosingDate,
      InActive: formData.InActive === true ? 1 : 0,
      EntryUserID: userID,
    }

    SessionID = SessionID === 0 ? 0 : decryptID(SessionID)
    if (SessionID === 0 || SessionID === undefined) {
      DataToSend.SessionID = 0
    } else {
      DataToSend.SessionID = SessionID
    }

    const { data } = await axios.post(
      apiUrl + `/${CONTROLLER}/${POSTMEHTOD}`,
      DataToSend
    )

    if (data.success === true) {
      if (SessionID !== 0) {
        toast.success("Business Type updated successfully!")
      } else {
        toast.success("Business Type created successfully!")
      }
      return { success: true, RecordID: encryptID(data?.SessionID) }
    } else {
      toast.error(data.message, {
        autoClose: false,
      })
      return { success: false, RecordID: encryptID(SessionID) }
    }
  } catch (e) {
    toast.error(e.message, {
      autoClose: false,
    })
  }
}
