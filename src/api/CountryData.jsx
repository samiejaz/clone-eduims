import axios from "axios"
import { toast } from "react-toastify"
import { decryptID, encryptID } from "../utils/crypto"

const apiUrl = import.meta.env.VITE_APP_API_URL

const CONTROLLER = "gen_Country"
const WHEREMETHOD = "GetCountryWhere"
const DELETEMETHOD = "CountryDelete"

// URL: /gen_Country/GetCountryWhere?LoginUserID=??
export async function fetchAllCountries(LoginUserID) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?LoginUserID=${LoginUserID}`
  )
  return data.data ?? []
}

// URL: /gen_Country/GetCountryWhere?CountryID=??&LoginUserID=??
export async function fetchCountryById(CountryID, LoginUserID) {
  CountryID = decryptID(CountryID)
  if (CountryID === undefined || CountryID === 0) {
    return []
  } else {
    const { data } = await axios.post(
      `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?CountryID=${CountryID}&LoginUserID=${LoginUserID}`
    )
    return data.data ?? []
  }
}
// URL: /gen_Country/CountryDelete?CountryID=??&LoginUserID=??
export async function deleteCountryByID({ CountryID, LoginUserID }) {
  CountryID = decryptID(CountryID)
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/${DELETEMETHOD}?CountryID=${CountryID}&LoginUserID=${LoginUserID}`
  )

  if (data.success === true) {
    toast.success("Country sucessfully deleted!")
    return true
  } else {
    toast.error(data.message, {
      autoClose: false,
    })
    return false
  }
}

export async function addNewCountry({ formData, userID, CountryID = 0 }) {
  try {
    let DataToSend = {
      CountryTitle: formData.CountryTitle,
      InActive: formData.InActive === true ? 1 : 0,
      EntryUserID: userID,
    }
    CountryID = CountryID === 0 ? 0 : decryptID(CountryID)
    if (CountryID === 0 || CountryID === undefined) {
      DataToSend.CountryID = 0
    } else {
      DataToSend.CountryID = CountryID
    }

    const { data } = await axios.post(
      apiUrl + `/${CONTROLLER}/CountryInsertUpdate`,
      DataToSend
    )

    if (data.success === true) {
      if (CountryID !== 0) {
        toast.success("Country updated successfully!")
      } else {
        toast.success("Country created successfully!")
      }
      return { success: true, RecordID: encryptID(data?.CountryID) }
    } else {
      toast.error(data.message, {
        autoClose: false,
      })
      return { success: false, RecordID: encryptID(CountryID) }
    }
  } catch (e) {
    toast.error(e.message, {
      autoClose: false,
    })
  }
}
