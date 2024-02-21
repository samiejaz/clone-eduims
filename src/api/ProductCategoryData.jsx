import axios from "axios";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_APP_API_URL;
const CONTROLLER = "EduIMS";
const POSTMEHTOD = "ProductCategoryInsertUpdate";

export async function fetchAllProductCategories(
  LoginUserID,
  ProductType = "Product"
) {
  const { data } = await axios.post(
    apiUrl + "/EduIMS/GetProductCategoryWhere?LoginUserID=" + LoginUserID
  );
  let newData = data.data.map((product) => {
    return {
      ProductType:
        product.ProductType === "Product" ? ProductType : product.ProductType,
      ProductCategoryID: product.ProductCategoryID,
      InActive: product.InActive,
      ProductCategoryTitle: product.ProductCategoryTitle,
    };
  });

  return newData;
}

export async function fetchProductCategoryById(ProductCategoryID, LoginUserID) {
  if (
    ProductCategoryID !== 0 ||
    ProductCategoryID !== undefined ||
    ProductCategoryID !== null
  ) {
    try {
      const { data } = await axios.post(
        apiUrl +
          `/EduIMS/GetProductCategoryWhere?ProductCategoryID=${ProductCategoryID}&LoginUserID=${LoginUserID}`
      );
      return data.data;
    } catch (error) {}
  } else {
    return [];
  }
}

export async function deleteProductCategoryByID(productCategory) {
  const { data } = await axios.post(
    apiUrl +
      `/EduIMS/ProductCategoryDelete?ProductCategoryID=${productCategory.ProductCategoryID}&LoginUserID=${productCategory.LoginUserID}`
  );
  if (data.success === true) {
    toast.success("Product category sucessfully deleted!");
    return true;
  } else {
    toast.error(data.message, {
      autoClose: false,
    });
    return false;
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
    };

    if (ProductCategoryID === 0 || ProductCategoryID === undefined) {
      DataToSend.ProductCategoryID = 0;
    } else {
      DataToSend.ProductCategoryID = ProductCategoryID;
    }

    const { data } = await axios.post(
      apiUrl + `/${CONTROLLER}/${POSTMEHTOD}`,
      DataToSend
    );

    if (data.success === true) {
      if (ProductCategoryID !== 0) {
        toast.success("Product Category updated successfully!");
      } else {
        toast.success("Product Category created successfully!");
      }
      return { success: true, RecordID: data?.ProductCategoryID };
    } else {
      toast.error(data.message, {
        autoClose: false,
      });
      return { success: false, RecordID: ProductCategoryID };
    }
  } catch (e) {
    toast.error(e.message, {
      autoClose: false,
    });
  }
}
