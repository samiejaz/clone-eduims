import { Form, Row, Col, Spinner } from "react-bootstrap";
import { Button } from "primereact/button";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import CustomerInvoiceDetailTable from "./CustomerInvoiceDetailTable";
import React, { useContext, useEffect, useRef, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { AppConfigurationContext } from "../../context/AppConfigurationContext";
import { CustomerEntryForm } from "../../components/CustomerEntryFormComponent";
import CustomerInvoiceHeader from "./CustomerInvoiceHeader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllBusinessUnitsForSelect,
  fetchAllCustomerAccountsForSelect,
  fetchAllCustomerBranchesData,
  fetchAllOldCustomersForSelect,
  fetchAllProductsForSelect,
  fetchAllServicesForSelect,
  fetchAllSessionsForSelect,
} from "../../api/SelectData";
import {
  CustomerInvoiceDataContext,
  CustomerInvoiceDataProivder,
  InvoiceDataContext,
  InvoiceDataProivder,
} from "./CustomerInvoiceDataContext";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import useEditModal from "../../hooks/useEditModalHook";
import useDeleteModal from "../../hooks/useDeleteModalHook";
import {
  deleteCustomerInvoiceByID,
  fetchAllCustomerInvoices,
  fetchCustomerInvoiceById,
  fetchMaxInvoiceNo,
  fetchMaxSessionBasedVoucherNo,
} from "../../api/CustomerInvoiceData";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ActionButtons from "../../components/ActionButtons";
import { parseISO } from "date-fns";
import { CustomSpinner } from "../../components/CustomSpinner";
import {
  useBusinessUnitsSelectData,
  useCustomerLedgersSelectData,
  useOldCustomerSelectData,
  useProductsInfoSelectData,
  useServicesInfoSelectData,
} from "../../hooks/SelectData/useSelectData";
import { CustomerInvoiceInstallmentForm } from "../../components/CustomerInoivceInstallmentsComponent";
import { useNavigate, useParams } from "react-router-dom";
import ButtonToolBar from "./CustomerInvoiceToolbar";
import TextInput from "../../components/Forms/TextInput";
import CDropdown from "../../components/Forms/CDropdown";
import { QUERY_KEYS, ROUTE_URLS } from "../../utils/enums";

let parentRoute = ROUTE_URLS.ACCOUNTS.CUSTOMER_INVOICE;
let editRoute = `${parentRoute}/edit/`;
let newRoute = `${parentRoute}/new`;
let cashDetailColor = "#22C55E";
let onlineDetailColor = "#F59E0B";
let chequeDetailColor = "#3B82F6";
let ddDetailColor = "#8f48d2";
let queryKey = QUERY_KEYS.CUSTOMER_INVOICE_QUERY_KEY;

const apiUrl = import.meta.env.VITE_APP_API_URL;

function CustomerInvoice() {
  const { pageTitles } = useContext(AppConfigurationContext);
  document.title = "Customer Invoice";
  return (
    <>
      <CustomerInvoiceDataProivder>
        <CustomerInvoiceSearch />
      </CustomerInvoiceDataProivder>
    </>
  );
}

function CustomerInvoiceSearch() {
  const queryClient = useQueryClient();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    InvoiceTitle: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
    },
    InvoiceNo: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
    },
    CustomerName: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
    },
    AccountTitle: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
    },
    TotalNetAmount: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
    },
  });

  const {
    render: EditModal,
    handleShow: handleEditShow,
    handleClose: handleEditClose,
    setIdToEdit,
  } = useEditModal(handleEdit);

  const {
    render: DeleteModal,
    handleShow: handleDeleteShow,
    handleClose: handleDeleteClose,
    setIdToDelete,
  } = useDeleteModal(handleDelete);

  const { setIsEnable, setCustomerInvoiceID } = useContext(
    CustomerInvoiceDataContext
  );

  const {
    data: CustomerInvoices,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["customerInvoices"],
    queryFn: () => fetchAllCustomerInvoices(user.userID),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCustomerInvoiceByID,
    onSuccess: (success) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      }
    },
  });

  function handleEdit(CustomerInvoiceID) {
    navigate(parentRoute + "/edit/" + CustomerInvoiceID);
    handleEditClose();
    setIdToEdit(0);
  }
  function handleDelete(CustomerInvoiceID) {
    deleteMutation.mutate({
      CustomerInvoiceID,
      LoginUserID: user.userID,
    });
    handleDeleteClose();
    setIdToDelete(0);
    setCustomerInvoiceID(null);
  }
  function handleView(CustomerInvoiceID) {
    navigate(parentRoute + "/" + CustomerInvoiceID);
  }

  return (
    <>
      {isFetching || isLoading ? (
        <>
          <div className="d-flex align-content-center justify-content-center h-100 w-100 m-auto">
            <Spinner
              animation="border"
              size="lg"
              role="status"
              aria-hidden="true"
            />
          </div>
        </>
      ) : (
        <div className="mt-5">
          <div className="d-flex text-dark mb-4 ">
            <h3 className="text-center my-auto">Customer Invoice Entry</h3>

            <div className="text-end my-auto" style={{ marginLeft: "10px" }}>
              <Button
                label="Add New Customer Invoice"
                icon="pi pi-plus"
                type="button"
                className="rounded"
                onClick={() => navigate(`${parentRoute}/new`)}
              />
            </div>
          </div>

          <DataTable
            showGridlines
            value={CustomerInvoices}
            dataKey="CustomerInvoiceID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage="No invoices found!"
            filters={filters}
            filterDisplay="row"
            resizableColumns
            size="small"
            selectionMode="single"
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column
              body={(rowData) =>
                ActionButtons(
                  rowData.CustomerInvoiceID,
                  handleDeleteShow,
                  handleEditShow,
                  handleView
                )
              }
              header="Actions"
              resizeable={false}
              style={{ minWidth: "7rem", maxWidth: "7rem", width: "7rem" }}
            ></Column>
            <Column
              field="SessionBasedVoucherNo"
              filter
              filterPlaceholder="Search by invoice no"
              sortable
              header="Invoice No"
            ></Column>
            <Column
              field="InvoiceNo"
              filter
              filterPlaceholder="Search by ref no"
              sortable
              header="Ref No"
            ></Column>
            <Column
              field="InvoiceTitle"
              filter
              filterPlaceholder="Search by invoice title"
              sortable
              header="Invoice Title"
            ></Column>
            <Column
              field="CustomerName"
              filter
              filterPlaceholder="Search by customer name"
              sortable
              header="Customer Name"
            ></Column>
            <Column
              field="AccountTitle"
              filter
              filterPlaceholder="Search by customer ledger"
              sortable
              header="Ledger"
            ></Column>
            <Column field="EntryDate" sortable header="Entry Date"></Column>
            <Column
              field="TotalNetAmount"
              filter
              filterPlaceholder="Search by net amount"
              sortable
              header="Total Net Amount"
            ></Column>
          </DataTable>
          {EditModal}
          {DeleteModal}
        </div>
      )}
    </>
  );
}

export function CustomerInvoiceFormMaster({ pageTitles, mode }) {
  return (
    <InvoiceDataProivder>
      <CustomerInvoiceForm pageTitles={pageTitles} mode={mode} />
    </InvoiceDataProivder>
  );
}
let renderCount = 0;
function CustomerInvoiceForm({ pageTitles, mode }) {
  renderCount++;
  const queryClient = useQueryClient();
  const [CustomerID, setCustomerID] = useState(0);
  const [AccountID, setAccountID] = useState(0);
  const [CustomerInvoice, setCustomerInvoice] = useState([]);
  const [CustomerInvoiceID, setCustomerInvoiceID] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);
  const { BusinessUnitID } = useContext(InvoiceDataContext);
  const { user } = useContext(AuthContext);
  const [isEnable, setIsEnable] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    function pageSetup() {
      if (mode === "view") {
        setIsEnable(false);
        setCustomerInvoiceID(params?.CustomerInvoiceID);
      }
      if (mode === "edit") {
        setIsEnable(true);
        setCustomerInvoiceID(params?.CustomerInvoiceID);
      }
      if (mode === "new") {
        method.reset();
        invoiceHeaderForm.reset();
        setCustomerInvoice([]);
        setCustomerInvoiceID(0);
        setIsEnable(true);
        method.setValue("Session", 1);
      }
    }

    pageSetup();
  }, [mode]);

  const { data: sessionSelectData } = useQuery({
    queryKey: ["sessionsData"],
    queryFn: () => fetchAllSessionsForSelect(),
    initialData: [],
  });

  const customerSelectData = useOldCustomerSelectData();
  const CustomerAccounts = useCustomerLedgersSelectData(CustomerID);
  const businessSelectData = useBusinessUnitsSelectData();
  const productsInfoSelectData = useProductsInfoSelectData(BusinessUnitID);
  const servicesInfoSelectData = useServicesInfoSelectData(BusinessUnitID);
  const typesOptions = [
    { label: pageTitles?.product || "Product", value: "Product" },
    { label: "Service", value: "Service" },
  ];

  const { data: customerBranchSelectData } = useQuery({
    queryKey: ["customerBranches", AccountID],
    queryFn: () => fetchAllCustomerBranchesData(AccountID),
    enabled: AccountID !== 0,
    initialData: [],
  });

  useEffect(() => {
    async function fetchCustomerInvoice() {
      if (
        CustomerInvoiceID !== undefined &&
        CustomerInvoiceID !== null &&
        CustomerInvoiceID !== 0
      ) {
        setIsLoading(true);
        const data = await fetchCustomerInvoiceById(
          CustomerInvoiceID,
          user.userID
        );

        if (!data) {
          toast.error("Network Error Occured!");
        }

        if (data.success === true) {
          setCustomerInvoice(data);
          setIsLoading(false);
          setAccountID(data?.Master[0].AccountID);
          setCustomerID(data?.Master[0].CustomerID);
        } else {
          method.reset();
          setCustomerInvoice([]);
          toast.error("No Data Found!", {
            autoClose: 1500,
          });
          setIsEnable(true);
        }
      } else {
        setCustomerInvoice([]);
        setTimeout(() => {
          method.reset();
          setIsEnable(true);
        }, 200);
      }
    }

    if (CustomerInvoiceID !== 0) {
      fetchCustomerInvoice();
    }
  }, [CustomerInvoiceID]);

  const invoiceHeaderForm = useForm({
    defaultValues: {
      InvoiceType: [],
      BusinessUnit: [],
      CustomerBranch: [],
      ProductInfo: [],
      ServiceInfo: [],
      Qty: 1,
      Rate: 0,
      CGS: 0,
      Discount: 0,
      Amount: 0,
      NetAmount: 0,
      DetailDescription: "",
    },
  });
  const method = useForm({
    defaultValues: {
      Customer: [],
      CustomerLedgers: [],
      Description: "",
      Total_Rate: 0,
      Total_CGS: 0,
      Total_Discount: 0,
      Total_Amount: 0,
      InvoiceTitle: "",
      detail: [],
      installments: [],
    },
  });

  const { appendAllRows, fields, appendSingleRow, removeAllRows, render } =
    useCustomerInvoiceDetail(
      method.control,
      isEnable,
      customerBranchSelectData,
      typesOptions,
      pageTitles,
      method.setValue,
      businessSelectData.data
    );
  const installmentsFieldArray = useFieldArray({
    control: method.control,
    name: "installments",
  });

  const customerInvoiceMutation = useMutation({
    mutationFn: async (formData) => {
      if (formData?.detail.length === 0) {
        toast.error("Please add atleast 1 item!", {
          position: "top-left",
        });
      } else {
        let InvoiceDetail = formData?.detail?.map((item, index) => {
          return {
            RowID: index + 1,
            InvoiceType: item.InvoiceType,
            BusinessUnitID: item.BusinessUnit,
            BranchID: item.CustomerBranch,
            ProductToInvoiceID: item.ProductInfo,
            ServiceToInvoiceID:
              item.ServiceInfo?.length === 0 ? null : item.ServiceInfo,
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
        // else {
        //   InstallmentDetail = [
        //     {
        //       InstallmentRowID: 0,
        //       InstallmentDueDate: formData.DueDate ?? new Date(),
        //       InstallmentAmount: formData.Total_Amount,
        //     },
        //   ];
        // }

        let DataToSend = {
          SessionID: formData?.Session,
          InvoiceNo: formData?.InvoiceNo,
          InvoiceDate: formData?.InvoiceDate || new Date(),
          InvoiceDueDate: formData?.DueDate || new Date(),
          CustomerID: formData?.Customer,
          AccountID: formData?.CustomerLedgers,
          BusinessUnitID: formData?.BusinessUnitID,
          InvoiceTitle: formData?.InvoiceTitle,
          Description: formData?.Description,
          EntryUserID: user.userID,
          TotalRate: formData?.Total_Rate,
          TotalCGS: formData?.Total_CGS,
          TotalDiscount: formData?.Total_Discount,
          TotalNetAmount: formData?.Total_Amount,
          InvoiceDetail: JSON.stringify(InvoiceDetail),
        };

        if (InstallmentDetail.length > 0) {
          DataToSend.InvoiceInstallmentDetail =
            JSON.stringify(InstallmentDetail);
        }

        // if (
        //   CustomerInvoice?.length !== 0 &&
        //   CustomerInvoice?.Master[0]?.CustomerInvoiceID !== undefined
        // ) {
        //   DataToSend.CustomerInvoiceID =
        //     CustomerInvoice?.Master[0]?.CustomerInvoiceID;
        // } else {
        //   DataToSend.CustomerInvoiceID = 0;
        // }

        const { data } = await axios.post(
          apiUrl + `/CustomerInvoice/CustomerInvoiceInsertUpdate`,
          DataToSend
        );

        if (data.success === true) {
          queryClient.invalidateQueries({ queryKey: ["customerInvoices"] });
          if (CustomerInvoiceID !== 0) {
            toast.success("Invoice updated successfully!");
            navigate(`${parentRoute}/${CustomerInvoiceID}`);
          } else {
            toast.success("Invoice created successfully!");
            navigate(`${parentRoute}/${data?.CustomerInvoiceID}`);
          }
        } else {
          toast.error(data.message);
        }
      }
    },
    onError: (err) => {},
  });

  useEffect(() => {
    if (CustomerInvoiceID !== 0 && CustomerInvoice?.Master) {
      // Master Values
      method.setValue("InvoiceTitle", CustomerInvoice?.Master[0]?.InvoiceTitle);
      method.setValue("InvoiceNo", CustomerInvoice?.Master[0]?.InvoiceNo);
      method.setValue(
        "BusinessUnitID",
        CustomerInvoice?.Master[0]?.BusinessUnitID
      );
      method.setValue(
        "SessionBasedInvoiceNo",
        CustomerInvoice?.Master[0]?.SessionBasedVoucherNo
      );
      method.setValue("Customer", CustomerInvoice?.Master[0]?.CustomerID);
      method.setValue("Session", CustomerInvoice?.Master[0]?.SessionID);
      method.setValue("CustomerLedgers", CustomerInvoice?.Master[0]?.AccountID);
      method.setValue("Description", CustomerInvoice?.Master[0]?.Description);
      method.setValue(
        "InoviceDate",
        parseISO(CustomerInvoice?.Master[0]?.InvoiceDate)
      );
      method.setValue(
        "DueDate",
        parseISO(CustomerInvoice?.Master[0]?.InvoiceDueDate)
      );

      method.setValue(
        "Total_Amount",
        CustomerInvoice?.Master[0]?.TotalNetAmount
      );
      method.setValue("Total_CGS", CustomerInvoice?.Master[0]?.TotalCGS);
      method.setValue(
        "Total_Discount",
        CustomerInvoice?.Master[0]?.TotalDiscount
      );
      method.setValue("Total_Rate", CustomerInvoice?.Master[0]?.TotalRate);

      // Detail Values
      method.setValue(
        "installments",
        CustomerInvoice?.InstallmentDetail.map((item, index) => {
          return {
            IDate: parseISO(item.DueDate),
            Amount: item.Amount,
          };
        })
      );
      appendAllRows(CustomerInvoice?.Detail);
    }
  }, [CustomerInvoiceID, CustomerInvoice]);

  function handleEdit() {
    navigate(`${parentRoute}/edit/${CustomerInvoiceID}`);
  }

  function handleAddNew() {
    navigate(`${parentRoute}/new`);
    method.setValue("InvoiceDate", new Date());
    method.setValue("DueDate", new Date());
    method.setValue("Session", sessionSelectData[0] ?? 1);
  }

  function handleCancel() {
    if (mode === "new") {
      navigate(parentRoute);
    } else if (mode === "edit") {
      navigate(`${parentRoute}/${CustomerInvoiceID}`);
    }
  }

  function handleDelete() {
    // deleteMutation.mutate({
    //   SessionID,
    //   LoginUserID: user.userID,
    // });
  }

  async function handleOpenPdfInNewTab(InvoiceID) {
    setPrintLoading(true);
    const { data } = await axios.post(
      `http://192.168.9.110:90/api/Reports/InvoicePrint?CustomerInvoiceID=${InvoiceID}&Export=p`
    );

    const win = window.open("");
    let html = "";

    html += "<html>";
    html += '<body style="margin:0!important">';
    html +=
      '<embed width="100%" height="100%" src="data:application/pdf;base64,' +
      data +
      '" type="application/pdf" />';
    html += "</body>";
    html += "</html>";
    setPrintLoading(false);
    setTimeout(() => {
      win.document.write(html);
    }, 0);
  }

  function onSubmit(data) {
    customerInvoiceMutation.mutate(data);
  }
  return (
    <div>
      {isLoading ? (
        <>
          <CustomSpinner />
        </>
      ) : (
        <>
          {renderCount}
          <div className="mt-4">
            <ButtonToolBar
              editDisable={mode !== "view"}
              cancelDisable={mode === "view"}
              addNewDisable={mode === "edit" || mode === "new"}
              deleteDisable={mode === "edit" || mode === "new"}
              saveDisable={mode === "view"}
              saveLabel={mode === "edit" ? "Update" : "Save"}
              saveLoading={customerInvoiceMutation.isPending}
              showPrint={true}
              printLoading={printLoading}
              printDisable={mode === "new" || mode === "edit"}
              handlePrint={() => handleOpenPdfInNewTab(CustomerInvoiceID)}
              handleGoBack={() => navigate(parentRoute)}
              handleEdit={() => handleEdit()}
              handleCancel={() => {
                handleCancel();
              }}
              handleAddNew={() => {
                handleAddNew();
              }}
              handleSave={() => method.handleSubmit(onSubmit)()}
              GoBackLabel="Customer Invoices"
            />
          </div>

          <form id="parenForm" className="mt-4">
            <Row>
              <Form.Group as={Col}>
                <Form.Label>
                  Session
                  <span className="text-danger fw-bold ">*</span>
                </Form.Label>

                <div>
                  <CDropdown
                    control={method.control}
                    name={`Session`}
                    optionLabel="SessionTitle"
                    optionValue="SessionID"
                    placeholder="Select a session"
                    options={sessionSelectData}
                    disabled={!isEnable}
                    required={true}
                    focusOptions={() => method.setFocus("InvoiceTitle")}
                  />
                </div>
              </Form.Group>
              <FormProvider {...method}>
                <BusinessUnitDependantFields mode={mode} />
              </FormProvider>
              <Form.Group as={Col}>
                <Form.Label>Invoice Date</Form.Label>
                <div>
                  <Controller
                    control={method.control}
                    name="InoviceDate"
                    render={({ field }) => (
                      <ReactDatePicker
                        disabled={mode === "view"}
                        placeholderText="Select date"
                        onChange={(date) => field.onChange(date)}
                        selected={field.value || new Date()}
                        dateFormat={"dd-MMM-yyyy"}
                        className={!isEnable ? "disabled-field" : "binput"}
                      />
                    )}
                  />
                </div>
              </Form.Group>
              <Form.Group as={Col} controlId="DueDate">
                <Form.Label>
                  DueDate
                  <CustomerInvoiceInstallmentForm
                    method={method}
                    installmentsFieldArray={installmentsFieldArray}
                    isEnable={isEnable}
                  />
                </Form.Label>

                <div>
                  <Controller
                    control={method.control}
                    name="DueDate"
                    render={({ field }) => (
                      <ReactDatePicker
                        disabled={!isEnable}
                        placeholderText="Select due date"
                        onChange={(date) => field.onChange(date)}
                        selected={field.value || new Date()}
                        dateFormat={"dd-MMM-yyyy"}
                        className={!isEnable ? "disabled-field" : "binput"}
                      />
                    )}
                  />
                </div>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} controlId="InvoiceTitle">
                <Form.Label>Invoice Title</Form.Label>
                <div>
                  <TextInput
                    control={method.control}
                    ID={"InvoiceTitle"}
                    isEnable={isEnable}
                    focusOptions={() => method.setFocus("Customer")}
                  />
                </div>
              </Form.Group>

              <Form.Group as={Col} controlId="Customer">
                <Form.Label>
                  Customer Name
                  <span className="text-danger fw-bold ">*</span>
                  {isEnable && (
                    <>
                      <CustomerEntryForm IconButton={true} />
                    </>
                  )}
                </Form.Label>

                <div>
                  <CDropdown
                    control={method.control}
                    name={`Customer`}
                    optionLabel="CustomerName"
                    optionValue="CustomerID"
                    placeholder="Select a customer"
                    options={customerSelectData.data}
                    disabled={!isEnable}
                    required={true}
                    filter={true}
                    onChange={(e) => {
                      setCustomerID(e.value);
                      removeAllRows();
                    }}
                    focusOptions={() => method.setFocus("CustomerLedgers")}
                  />
                </div>
              </Form.Group>
              <Form.Group as={Col} controlId="CustomerLedgers">
                <Form.Label>
                  Customer Ledgers
                  <span className="text-danger fw-bold ">*</span>
                </Form.Label>

                <div>
                  <CDropdown
                    control={method.control}
                    name={`CustomerLedgers`}
                    optionLabel="AccountTitle"
                    optionValue="AccountID"
                    placeholder="Select a ledger"
                    options={CustomerAccounts.data}
                    disabled={!isEnable}
                    required={true}
                    onChange={(e) => {
                      setAccountID(e.value);
                      removeAllRows();
                    }}
                    focusOptions={() => method.setFocus("Description")}
                  />
                </div>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} controlId="Description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as={"textarea"}
                  rows={1}
                  disabled={!isEnable}
                  className="form-control"
                  {...method.register("Description")}
                />
              </Form.Group>
            </Row>
          </form>

          {isEnable && (
            <div
              style={{
                padding: "1rem",
                borderRadius: "6px",
              }}
              className="bg-light shadow-sm mt-2"
            >
              <FormProvider {...invoiceHeaderForm}>
                <CustomerInvoiceHeader
                  businessSelectData={businessSelectData.data}
                  productsInfoSelectData={productsInfoSelectData.data}
                  servicesInfoSelectData={servicesInfoSelectData.data}
                  customerBranchSelectData={customerBranchSelectData}
                  typesOption={typesOptions}
                  append={appendSingleRow}
                  fields={fields}
                  pageTitles={pageTitles}
                />
              </FormProvider>
            </div>
          )}

          <>
            <Row>
              <FormProvider {...method}>{render}</FormProvider>
            </Row>
          </>
        </>
      )}
    </div>
  );
}

export default CustomerInvoice;

function useCustomerInvoiceDetail(
  control,
  isEnable,
  customerBranchSelectData,
  typesOptions,
  pageTitles,
  setValue,
  businessSelectData
) {
  async function filteredProductsBasedOnRow(SelectedBusinessUnitID, index) {
    const data = await fetchAllProductsForSelect(SelectedBusinessUnitID);
    setValue(`detail.${index}.products`, JSON.stringify(data));
  }
  async function filteredServicesBasedOnRow(selectedOption, index) {
    const data = await fetchAllServicesForSelect(selectedOption);
    setValue(`detail.${index}.services`, JSON.stringify(data));
  }

  const useInvoiceDetailArray = useFieldArray({
    control: control,
    name: "detail",
  });

  function appendAllRows(data) {
    setValue(
      "detail",
      data?.map((invoice, index) => {
        return {
          InvoiceType: invoice.InvoiceTypeTitle,
          ProductInfo: invoice.ProductToInvoiceID,
          ServiceInfo: invoice.ServiceToInvoiceID,
          CustomerBranch: invoice.BranchID,
          BusinessUnit: invoice.BusinessUnitID,
          Qty: invoice.Quantity,
          ...invoice,
        };
      })
    );
    if (data.length > 0) {
      data.forEach((item, index) => {
        filteredProductsBasedOnRow(item.BusinessUnitID, index);
        filteredServicesBasedOnRow(item.BusinessUnitID, index);
      });
    }
  }

  function appendSingleRow(data) {
    useInvoiceDetailArray.append(data);
  }

  function removeAllRows() {
    useInvoiceDetailArray.remove();
  }

  function removeSingleRow(index) {
    useInvoiceDetailArray.remove(index);
  }

  return {
    fields: useInvoiceDetailArray.fields,
    appendAllRows,
    appendSingleRow,
    newRowIndex: useInvoiceDetailArray.fields.length + 1,
    removeAllRows,
    removeSingleRow,
    render: (
      <>
        <CustomerInvoiceDetailTable
          typesOption={typesOptions}
          pageTitles={pageTitles}
          fields={useInvoiceDetailArray.fields}
          append={useInvoiceDetailArray.append}
          remove={useInvoiceDetailArray.remove}
          isEnable={isEnable}
          customerBranchSelectData={customerBranchSelectData}
          businessSelectData={businessSelectData}
        />
      </>
    ),
  };
}

function BusinessUnitDependantFields({ mode }) {
  const [BusinessUnitID, setBusinessUnitID] = useState(0);

  const { data: BusinessUnitSelectData } = useQuery({
    queryKey: [QUERY_KEYS.BUSINESS_UNIT_QUERY_KEY],
    queryFn: fetchAllBusinessUnitsForSelect,
    initialData: [],
    enabled: mode !== "",
  });

  useEffect(() => {
    if (BusinessUnitSelectData.length > 0) {
      method.setValue(
        "BusinessUnitID",
        BusinessUnitSelectData[0].BusinessUnitID
      );
      setBusinessUnitID(BusinessUnitSelectData[0].BusinessUnitID);
    }
  }, [BusinessUnitSelectData]);

  useEffect(() => {
    async function fetchInvoiceAndRefNo() {
      if (mode !== "view") {
        try {
          if (BusinessUnitID !== 0) {
            const { data } = await axios.post(
              apiUrl +
                `/CustomerInvoice/GetInvoiceNo?BusinessUnitID=${BusinessUnitID}`
            );

            if (data.data.length > 0) {
              method.setValue("InvoiceNo", data.data[0].InvoiceNo);
              method.setValue(
                "SessionBasedInvoiceNo",
                data.data[0].SessionBasedVoucherNo
              );
            }
          }
        } catch (e) {
          toast.error(e.message);
        }
      }
    }
    fetchInvoiceAndRefNo();
  }, [BusinessUnitID, mode]);

  const method = useFormContext();

  return (
    <>
      <Form.Group as={Col}>
        <Form.Label>
          Business Unit
          <span className="text-danger fw-bold ">*</span>
        </Form.Label>

        <div>
          <CDropdown
            control={method.control}
            name={`BusinessUnitID`}
            optionLabel="BusinessUnitName"
            optionValue="BusinessUnitID"
            placeholder="Select a business unit"
            options={BusinessUnitSelectData}
            disabled={mode === "view"}
            required={true}
            focusOptions={() => method.setFocus("InvoiceTitle")}
            onChange={(e) => {
              setBusinessUnitID(e.value);
            }}
          />
        </div>
      </Form.Group>
      <Form.Group as={Col}>
        <Form.Label>Invoice No</Form.Label>
        <Form.Control
          type="text"
          size="sm"
          {...method.register("SessionBasedInvoiceNo")}
          disabled
        />
      </Form.Group>
      <Form.Group as={Col}>
        <Form.Label>Ref No</Form.Label>
        <div>
          <Form.Control
            type="text"
            size="sm"
            {...method.register("InvoiceNo")}
            disabled
          />
        </div>
      </Form.Group>
    </>
  );
}

function CustomerDependentFields({ mode }) {
  const [CustomerID, setCustomerID] = useState(0);

  const { data: customerSelectData } = useQuery({
    queryKey: [QUERY_KEYS.ALL_CUSTOMER_QUERY_KEY],
    queryFn: fetchAllOldCustomersForSelect,
    initialData: [],
  });

  const { data: CustomerAccounts } = useQuery({
    queryKey: [QUERY_KEYS.CUSTOMER_ACCOUNTS_QUERY_KEY, CustomerID],
    queryFn: () => fetchAllCustomerAccountsForSelect(CustomerID),
    initialData: [],
  });

  const method = useFormContext();

  return (
    <>
      <Form.Group as={Col} controlId="Customer">
        <Form.Label>
          Customer Name
          <span className="text-danger fw-bold ">*</span>
          {mode !== "view" && (
            <>
              <CustomerEntryForm IconButton={true} />
            </>
          )}
        </Form.Label>

        <div>
          <CDropdown
            control={method.control}
            name={`Customer`}
            optionLabel="CustomerName"
            optionValue="CustomerID"
            placeholder="Select a customer"
            options={customerSelectData}
            disabled={mode === "view"}
            required={true}
            filter={true}
            onChange={(e) => {
              setCustomerID(e.value);
              // removeAllRows();
            }}
            focusOptions={() => method.setFocus("CustomerLedgers")}
          />
        </div>
      </Form.Group>
      <Form.Group as={Col} controlId="CustomerLedgers">
        <Form.Label>
          Customer Ledgers
          <span className="text-danger fw-bold ">*</span>
        </Form.Label>

        <div>
          <CDropdown
            control={method.control}
            name={`CustomerLedgers`}
            optionLabel="AccountTitle"
            optionValue="AccountID"
            placeholder="Select a ledger"
            options={CustomerAccounts}
            disabled={mode === "view"}
            required={true}
            onChange={(e) => {
              setAccountID(e.value);
              // removeAllRows();
            }}
            focusOptions={() => method.setFocus("Description")}
          />
        </div>
      </Form.Group>
    </>
  );
}
