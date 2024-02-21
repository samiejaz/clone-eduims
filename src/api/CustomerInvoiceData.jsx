import axios from "axios";
import { toast } from "react-toastify";
import { format, parseISO } from "date-fns";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const CONTROLLER = "CustomerInvoice";
const WHEREMETHOD = "GetCustomerInvoiceWhere";
const DELETEMETHOD = "CustomerInvoiceDelete";

// URL: /CustomerInvoice/GetCustomerInvoicesData?LoginUserID=??
export async function fetchAllCustomerInvoices(LoginUserID) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/GetCustomerInvoicesData?LoginUserID=${LoginUserID}`
  );
  let newData = data.data.map((item) => {
    return {
      CustomerInvoiceID: item.CustomerInvoiceID,
      InvoiceNo: item.InvoiceNo,
      SessionBasedVoucherNo: item.SessionBasedVoucherNo,
      InvoiceTitle: item.InvoiceTitle,
      CustomerName: item.CustomerName,
      AccountTitle: item.AccountTitle,
      EntryDate: format(parseISO(item.EntryDate), "dd-MMM-yyyy"),
      TotalNetAmount: item.TotalNetAmount,
    };
  });
  return newData ?? [];
}

// URL: /EduIMS/GetCustomerInvoiceWhere?CustomerInvoiceID=??&LoginUserID=??
export async function fetchCustomerInvoiceById(CustomerInvoiceID, LoginUserID) {
  try {
    const { data } = await axios.post(
      `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?CustomerInvoiceID=${CustomerInvoiceID}&LoginUserID=${LoginUserID}`
    );
    return data;
  } catch (error) {}
}

export async function fetchMaxInvoiceNo(LoginUserID) {
  try {
    const { data } = await axios.post(
      `${apiUrl}/${CONTROLLER}/GetInvoiceNo?LoginUserID=${LoginUserID}`
    );
    return data;
  } catch (error) {
    toast.error(error, {
      autoClose: false,
    });
  }
}
export async function fetchMaxSessionBasedVoucherNo(LoginUserID) {
  try {
    const { data } = await axios.post(
      `${apiUrl}/${CONTROLLER}/GetSessionBasedInvoiceNo?LoginUserID=${LoginUserID}`
    );
    return data;
  } catch (error) {
    toast.error(error, {
      autoClose: false,
    });
  }
}
// URL: /CustomerInvoice/CustomerInvoiceDelete?CustomerInvoiceID=??&LoginUserID=??
export async function deleteCustomerInvoiceByID({
  CustomerInvoiceID,
  LoginUserID,
}) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/${DELETEMETHOD}?CustomerInvoiceID=${CustomerInvoiceID}&LoginUserID=${LoginUserID}`
  );

  if (data.success === true) {
    toast.success("Invoice sucessfully deleted!");
    return true;
  } else {
    toast.error(data.message, {
      autoClose: false,
    });
    return false;
  }
}

export async function addNewCustomerInvoice({
  formData,
  userID,
  CustomerInvoiceID = 0,
}) {
  try {
    let InvoiceDetail = formData?.CustomerInvoiceDetail?.map((item, index) => {
      return {
        RowID: index + 1,
        InvoiceType: item.InvoiceType,
        BusinessUnitID: item.BusinessUnitID,
        BranchID: item.CustomerBranch,
        ProductToInvoiceID: item.ProductInfoID,
        ServiceToInvoiceID:
          item.ServiceInfoID === undefined ? null : item.ServiceInfoID,
        Quantity: item.Qty,
        Rate: item.Rate,
        CGS: item.CGS,
        Amount: item.Amount,
        Discount: item.Discount,
        NetAmount: item.NetAmount,
        DetailDescription: item.DetailDescription,
        IsFree: item.IsFree ? 1 : 0,
      };
    });

    let InstallmentDetail = [];
    if (formData?.installments.length > 0) {
      InstallmentDetail = formData?.installments?.map((item, index) => {
        return {
          InstallmentRowID: index + 1,
          InstallmentDueDate: item.IDate ?? new Date(),
          InstallmentAmount: item.Amount,
        };
      });
    }

    let DataToSend = {
      SessionID: formData?.SessionID,
      InvoiceNo: formData?.VoucherNo,
      SessionBasedVoucherNo: formData?.SessionBasedVoucherNo,
      InvoiceDate: formData?.InvoiceDate || new Date(),
      InvoiceDueDate: formData?.DueDate || new Date(),
      CustomerID: formData?.Customer,
      AccountID: formData?.CustomerLedgers,
      BusinessUnitID: formData?.BusinessUnitID,
      InvoiceTitle: formData?.InvoiceTitle,
      Description: formData?.Description,
      TotalRate: formData?.TotalRate,
      TotalCGS: formData?.TotalAmount,
      TotalDiscount: formData?.TotalDiscount,
      TotalNetAmount: formData?.TotalNetAmount,
      DocumentNo: formData?.DocumentNo,
      EntryUserID: userID,
      InvoiceDetail: JSON.stringify(InvoiceDetail),
    };

    if (InstallmentDetail.length > 0) {
      DataToSend.InvoiceInstallmentDetail = JSON.stringify(InstallmentDetail);
    }

    if (
      CustomerInvoiceID !== 0 ||
      CustomerInvoiceID !== undefined ||
      CustomerInvoiceID !== null
    ) {
      DataToSend.CustomerInvoiceID = CustomerInvoiceID;
    } else {
      DataToSend.CustomerInvoiceID = 0;
    }

    const { data } = await axios.post(
      apiUrl + `/CustomerInvoice/CustomerInvoiceInsertUpdate`,
      DataToSend
    );

    if (data.success === true) {
      if (CustomerInvoiceID !== 0) {
        toast.success("Business Type updated successfully!");
      } else {
        toast.success("Business Type created successfully!");
      }
      return { success: true, RecordID: data?.CustomerInvoiceID };
    } else {
      toast.error(data.message);
      return { success: false, RecordID: CustomerInvoiceID };
    }
  } catch (e) {
    toast.error(e.message);
  }
}
export async function fetchMonthlyMaxCustomerInvoiceNo(BusinessUnitID) {
  if (BusinessUnitID !== 0) {
    try {
      const { data } = await axios.post(
        `${apiUrl}/${CONTROLLER}/GetInvoiceNo?BusinessUnitID=${BusinessUnitID}`
      );
      return data.data;
    } catch (error) {
      toast.error(error.message, {
        autoClose: false,
      });
    }
  } else {
    return [];
  }
}
