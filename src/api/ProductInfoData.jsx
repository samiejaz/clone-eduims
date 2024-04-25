import axios from "axios"
import { toast } from "react-toastify"
import { ShowErrorToast, ShowSuccessToast } from "../utils/CommonFunctions"
import { decryptID, encryptID } from "../utils/crypto"

const apiUrl = import.meta.env.VITE_APP_API_URL

export async function fetchAllProducts(LoginUserID) {
  const { data } = await axios.post(
    apiUrl + "/EduIMS/GetProductInfoWhere?LoginUserID=" + LoginUserID
  )
  return data.data ?? []
}

export async function fetchProductInfoByID(ProductInfoID, LoginUserID) {
  if (ProductInfoID !== undefined) {
    try {
      ProductInfoID = decryptID(ProductInfoID)
      const { data } = await axios.post(
        apiUrl +
          `/EduIMS/GetProductInfoWhere?ProductInfoID=${ProductInfoID}&LoginUserID=${LoginUserID}`
      )
      return data
    } catch (error) {
      ShowErrorToast("Fetch::" + error.message)
    }
  }
}

export async function deleteProductInfoByID({ ProductInfoID, LoginUserID }) {
  try {
    if (ProductInfoID !== undefined) {
      ProductInfoID = decryptID(ProductInfoID)
      const { data } = await axios.post(
        apiUrl +
          `/EduIMS/ProductInfoDelete?ProductInfoID=${ProductInfoID}&LoginUserID=${LoginUserID}`
      )
      if (data.success === true) {
        ShowSuccessToast("Product sucessfully deleted!")
        return true
      } else {
        ShowErrorToast(data.message)
        return false
      }
    }
  } catch (e) {
    ShowErrorToast("Delete::" + e.message)
  }
}

export async function addNewProductInfo({
  formData,
  userID,
  ProductInfoID = 0,
  selectedBusinessUnits = [],
}) {
  try {
    let selectedBusinessUnitIDs
    if (selectedBusinessUnits?.length === 0) {
      selectedBusinessUnitIDs = { RowID: 0, BusinessUnitID: null }
    } else {
      selectedBusinessUnitIDs = selectedBusinessUnits?.map((b, i) => {
        return { RowID: i + 1, BusinessUnitID: b.BusinessUnitID }
      })
    }

    const DataToSend = {
      ProductInfoID: 0,
      ProductInfoTitle: formData.ProductInfoTitle,
      ProductCategoryID: formData.ProductCategoryID,
      BusinessUnitIDs: JSON.stringify(selectedBusinessUnitIDs),
      InActive: formData.InActive ? 1 : 0,
      EntryUserID: userID,
    }

    ProductInfoID = ProductInfoID === 0 ? 0 : decryptID(ProductInfoID)
    if (ProductInfoID === 0 || ProductInfoID === undefined) {
      DataToSend.ProductInfoID = 0
    } else {
      DataToSend.ProductInfoID = ProductInfoID
    }

    const { data } = await axios.post(
      apiUrl + `/EduIMS/ProductInfoInsertUpdate`,
      DataToSend
    )

    if (data.success === true) {
      if (ProductInfoID !== 0) {
        ShowSuccessToast("Product updated successfully!")
      } else {
        ShowSuccessToast("Product created successfully!")
      }
      return { success: true, RecordID: encryptID(data?.ProductInfoID) }
    } else {
      ShowErrorToast(data.message)
      return { success: false, RecordID: ProductInfoID }
    }
  } catch (e) {
    ShowErrorToast("Insert::" + e.message)
  }
}
