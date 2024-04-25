import axios from "axios"
import { toast } from "react-toastify"
import { ShowErrorToast, ShowSuccessToast } from "../utils/CommonFunctions"
import { decryptID, encryptID } from "../utils/crypto"

const apiUrl = import.meta.env.VITE_APP_API_URL
const CONTROLLER = "EduIMS"
const POSTMEHTOD = "ProductCategoryInsertUpdate"

export async function fetchAllProductCategories(
  LoginUserID,
  ProductType = "Product"
) {
  const { data } = await axios.post(
    apiUrl + "/EduIMS/GetProductCategoryWhere?LoginUserID=" + LoginUserID
  )
  let newData = data.data.map((product) => {
    return {
      ProductType:
        product.ProductType === "Product" ? ProductType : product.ProductType,
      ProductCategoryID: product.ProductCategoryID,
      InActive: product.InActive,
      ProductCategoryTitle: product.ProductCategoryTitle,
    }
  })

  return newData
}

export async function fetchProductCategoryById(ProductCategoryID, LoginUserID) {
  if (ProductCategoryID !== undefined) {
    try {
      ProductCategoryID = decryptID(ProductCategoryID)
      const { data } = await axios.post(
        apiUrl +
          `/EduIMS/GetProductCategoryWhere?ProductCategoryID=${ProductCategoryID}&LoginUserID=${LoginUserID}`
      )
      return data.data
    } catch (error) {
      ShowErrorToast(error.message)
    }
  } else {
    return []
  }
}

export async function deleteProductCategoryByID({
  ProductCategoryID,
  LoginUserID,
}) {
  try {
    ProductCategoryID = decryptID(ProductCategoryID)
    const { data } = await axios.post(
      apiUrl +
        `/EduIMS/ProductCategoryDelete?ProductCategoryID=${ProductCategoryID}&LoginUserID=${LoginUserID}`
    )
    if (data.success === true) {
      ShowSuccessToast("Product category sucessfully deleted!")
      return true
    } else {
      ShowErrorToast(data.message)
      return false
    }
  } catch (e) {
    ShowErrorToast(e.message)
  }
}

export async function addNewProductCategory({
  formData,
  userID,
  ProductCategoryID = 0,
}) {
  try {
    let DataToSend = {
      ProductCategoryID: 0,
      ProductCategoryTitle: formData.ProductCategoryTitle,
      ProductType: formData.ProductType,
      InActive: formData.InActive ? 1 : 0,
      EntryUserID: userID,
    }

    ProductCategoryID =
      ProductCategoryID === 0 ? 0 : decryptID(ProductCategoryID)
    if (ProductCategoryID === 0 || ProductCategoryID === undefined) {
      DataToSend.ProductCategoryID = 0
    } else {
      DataToSend.ProductCategoryID = ProductCategoryID
    }

    const { data } = await axios.post(
      apiUrl + `/${CONTROLLER}/${POSTMEHTOD}`,
      DataToSend
    )

    if (data.success === true) {
      if (ProductCategoryID !== 0) {
        ShowSuccessToast("Product Category updated successfully!")
      } else {
        ShowSuccessToast("Product Category created successfully!")
      }
      return { success: true, RecordID: encryptID(data?.ProductCategoryID) }
    } else {
      ShowErrorToast(data.message)
      return { success: false, RecordID: ProductCategoryID }
    }
  } catch (e) {
    ShowErrorToast(e.message)
  }
}
