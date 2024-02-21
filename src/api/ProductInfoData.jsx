import axios from "axios";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_APP_API_URL;

export async function fetchAllProducts(LoginUserID) {
  const { data } = await axios.post(
    apiUrl + "/EduIMS/GetProductInfoWhere?LoginUserID=" + LoginUserID
  );
  return data.data ?? [];
}

export async function fetchProductInfoByID(ProductInfoID = 0, LoginUserID) {
  if (ProductInfoID !== null || ProductInfoID !== 0) {
    try {
      const { data } = await axios.post(
        apiUrl +
          `/EduIMS/GetProductInfoWhere?ProductInfoID=${ProductInfoID}&LoginUserID=${LoginUserID}`
      );
      return data;
    } catch (error) {}
  }
}

export async function deleteProductInfoByID(productInfo) {
  const { data } = await axios.post(
    apiUrl +
      `/EduIMS/ProductInfoDelete?ProductInfoID=${productInfo.ProductInfoID}&LoginUserID=${productInfo.LoginUserID}`
  );
  if (data.success === true) {
    toast.success("Product sucessfully deleted!");
    return true;
  } else {
    toast.error(data.message, {
      autoClose: false,
    });
    return false;
  }
}

export async function addNewProductInfo({
  formData,
  userID,
  ProductInfoID = 0,
  selectedBusinessUnits = [],
}) {
  try {
    let selectedBusinessUnitIDs;
    if (selectedBusinessUnits?.length === 0) {
      selectedBusinessUnitIDs = { RowID: 0, BusinessUnitID: null };
    } else {
      selectedBusinessUnitIDs = selectedBusinessUnits?.map((b, i) => {
        return { RowID: i + 1, BusinessUnitID: b.BusinessUnitID };
      });
    }

    const DataToSend = {
      ProductInfoID: 0,
      ProductInfoTitle: formData.ProductInfoTitle,
      ProductCategoryID: formData.ProductCategoryID,
      BusinessUnitIDs: JSON.stringify(selectedBusinessUnitIDs),
      InActive: formData.InActive ? 1 : 0,
      EntryUserID: userID,
    };

    if (ProductInfoID === 0 || ProductInfoID === undefined) {
      DataToSend.ProductInfoID = 0;
    } else {
      DataToSend.ProductInfoID = ProductInfoID;
    }

    const { data } = await axios.post(
      apiUrl + `/EduIMS/ProductInfoInsertUpdate`,
      DataToSend
    );
    console.log(data);

    if (data.success === true) {
      if (ProductInfoID !== 0) {
        toast.success("Product updated successfully!");
      } else {
        toast.success("Product created successfully!");
      }
      return { success: true, RecordID: data?.ProductInfoID };
    } else {
      toast.error(data.message, {
        autoClose: false,
      });
      return { success: false, RecordID: ProductInfoID };
    }
  } catch (e) {
    toast.error(e.message, {
      autoClose: false,
    });
  }
}
