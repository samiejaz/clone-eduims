import { Row, Form, Col, Spinner, Table } from "react-bootstrap";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { toast } from "react-toastify";
import {
  useForm,
  useFieldArray,
  useFormContext,
  FormProvider,
  useWatch,
  Controller,
} from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ActionButtons from "../../components/ActionButtons";
import { FilterMatchMode } from "primereact/api";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

import TextInput from "../../components/Forms/TextInput";
import NumberInput from "../../components/Forms/NumberInput";

import DetailHeaderActionButtons from "../../components/DetailHeaderActionButtons";
import CDropdown from "../../components/Forms/CDropdown";
import { DevTool } from "@hookform/devtools";
import {
  addNewCustomerInvoice,
  deleteCustomerInvoiceByID,
  fetchMonthlyMaxCustomerInvoiceNo,
  fetchCustomerInvoiceById,
  fetchAllCustomerInvoices,
} from "../../api/CustomerInvoiceData";
import ButtonToolBar from "../CustomerInvoice/CustomerInvoiceToolbar";

import { QUERY_KEYS, ROUTE_URLS, SELECT_QUERY_KEYS } from "../../utils/enums";
import {
  fetchAllBusinessUnitsForSelect,
  fetchAllCustomerAccountsForSelect,
  fetchAllCustomerBranchesData,
  fetchAllOldCustomersForSelect,
  fetchAllProductsForSelect,
  fetchAllServicesForSelect,
  fetchAllSessionsForSelect,
} from "../../api/SelectData";
import CDatePicker from "../../components/Forms/CDatePicker";
import CSwitchInput from "../../components/Forms/CSwitchInput";
import { useUserData } from "../../context/AuthContext";
import { CustomerEntryForm } from "../../components/CustomerEntryFormComponent";
import { PrintReportInNewTab } from "../../utils/CommonFunctions";
import { classNames } from "primereact/utils";
import { InputSwitch } from "primereact/inputswitch";
import NewCustomerInvoiceIntallmentsModal from "../../components/Modals/NewCustomerInvoiceInstallmentModal";
import { CustomSpinner } from "../../components/CustomSpinner";
import { AppConfigurationContext } from "../../context/AppConfigurationContext";
import useConfirmationModal from "../../hooks/useConfirmationModalHook";

let parentRoute = ROUTE_URLS.ACCOUNTS.NEW_CUSTOMER_INVOICE;
let editRoute = `${parentRoute}/edit/`;
let newRoute = `${parentRoute}/new`;
let onlineDetailColor = "#365abd";
let queryKey = QUERY_KEYS.CUSTOMER_INVOICE_QUERY_KEY;

export function NewCustomerInvoiceEntry() {
  document.title = "Reciept Vouchers";
  return (
    <div className="mt-5">
      <NewCustomerInvoiceEntrySearch />
    </div>
  );
}

function NewCustomerInvoiceEntrySearch() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { showDeleteDialog, showEditDialog } = useConfirmationModal({
    handleDelete,
    handleEdit,
  });

  const [filters, setFilters] = useState({
    SessionBasedVoucherNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
    InvoiceNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
    CustomerName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    AccountTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
    CustomerInvoiceMode: { value: null, matchMode: FilterMatchMode.CONTAINS },
    TotalNetAmount: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const user = useUserData();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey],
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

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  function handleDelete(id) {
    deleteMutation.mutate({ CustomerInvoiceID: id, LoginUserID: user.userID });
  }

  function handleEdit(id) {
    navigate(editRoute + id);
  }

  function handleView(id) {
    navigate(parentRoute + "/" + id);
  }

  return (
    <>
      {isLoading || isFetching ? (
        <>
          <CustomSpinner />
        </>
      ) : (
        <>
          <div className="d-flex text-dark  mb-4 ">
            <h2 className="text-center my-auto">Customer Invoices</h2>
            <div className="text-end my-auto" style={{ marginLeft: "10px" }}>
              <Button
                label="Add New Customer Invoice"
                icon="pi pi-plus"
                type="button"
                className="rounded"
                onClick={() => navigate(newRoute)}
              />
            </div>
          </div>
          <DataTable
            showGridlines
            value={data}
            dataKey="CustomerInvoiceID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage="No CustomerInvoices found!"
            filters={filters}
            filterDisplay="row"
            resizableColumns
            size="small"
            selectionMode="single"
            style={{ background: "red" }}
            className={"thead"}
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column
              body={(rowData) =>
                ActionButtons(
                  rowData.CustomerInvoiceID,
                  () => showDeleteDialog(rowData.CustomerInvoiceID),
                  () => showEditDialog(rowData.CustomerInvoiceID),
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
        </>
      )}
    </>
  );
}

const defaultValues = {
  SesionID: "",
  BusinessUnitID: "",
  VoucherNo: "",
  DocumentNo: "",
  InvoiceTitle: "",
  SessionBasedVoucherNo: "",
  VoucherDate: new Date(),
  VoucherDueDate: new Date(),
  Description: "",
  Customer: "",
  CustomerLedgers: "",
  CustomerInvoiceDetail: [],
  installments: [],
};

export function NewCustomerInvoiceEntryForm({ mode }) {
  document.title = "Customer Invoice";
  const queryClient = useQueryClient();
  const { CustomerInvoiceID } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Ref
  const detailTableRef = useRef();
  const customerCompRef = useRef();
  const customerBranchRef = useRef();
  const invoiceInstallmentRef = useRef();
  // Form
  const method = useForm({
    defaultValues,
  });

  const { data: CustomerInvoiceData } = useQuery({
    queryKey: [
      QUERY_KEYS.CUSTOMER_INVOICE_QUERY_KEY,
      {
        CustomerInvoiceID: +CustomerInvoiceID,
      },
    ],
    queryFn: () => fetchCustomerInvoiceById(CustomerInvoiceID, user.userID),
    enabled: CustomerInvoiceID !== undefined,
    initialData: [],
  });

  const { data: BusinessUnitSelectData } = useQuery({
    queryKey: [SELECT_QUERY_KEYS.BUSINESS_UNIT_SELECT_QUERY_KEY],
    queryFn: fetchAllBusinessUnitsForSelect,
    initialData: [],
    enabled: mode !== "",
  });

  const CustomerInvoiceMutation = useMutation({
    mutationFn: addNewCustomerInvoice,
    onSuccess: ({ success, RecordID }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        navigate(`${parentRoute}/${RecordID}`);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCustomerInvoiceByID,
    onSuccess: (success) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      }
    },
  });

  useEffect(() => {
    if (
      +CustomerInvoiceID !== null &&
      CustomerInvoiceData?.Master?.length > 0
    ) {
      //   // Setting Values
      method.setValue("SessionID", CustomerInvoiceData?.Master[0]?.SessionID);
      method.setValue(
        "BusinessUnitID",
        CustomerInvoiceData?.Master[0]?.BusinessUnitID
      );
      method.setValue("Customer", CustomerInvoiceData?.Master[0]?.CustomerID);
      method.setValue("VoucherNo", CustomerInvoiceData?.Master[0]?.InvoiceNo);
      method.setValue(
        "SessionBasedVoucherNo",
        CustomerInvoiceData?.Master[0]?.InvoiceNo1
      );
      method.setValue(
        "VoucherDate",
        new Date(CustomerInvoiceData?.Master[0]?.InvoiceDate)
      );
      method.setValue(
        "VoucherDueDate",
        new Date(CustomerInvoiceData?.Master[0]?.InvoiceDueDate)
      );
      customerCompRef.current?.setCustomerID(
        CustomerInvoiceData?.Master[0]?.CustomerID
      );
      method.setValue(
        "CustomerLedgers",
        CustomerInvoiceData?.Master[0]?.AccountID
      );
      method.setValue(
        "DocumentNo",
        CustomerInvoiceData?.Master[0]?.DocumentNo ?? undefined
      );
      method.setValue(
        "InvoiceTitle",
        CustomerInvoiceData?.Master[0]?.InvoiceTitle
      );
      method.setValue(
        "Description",
        CustomerInvoiceData?.Master[0]?.MasterDescription ?? undefined
      );
      method.setValue(
        "CustomerInvoiceDetail",
        CustomerInvoiceData.Detail?.map((invoice, item) => {
          return {
            InvoiceType: invoice.InvoiceTypeTitle,
            ProductInfoID: invoice.ProductToInvoiceID,
            ServiceInfoID: invoice.ServiceToInvoiceID,
            CustomerBranch: invoice.BranchID,
            BusinessUnitID: invoice.BusinessUnitID,
            Qty: invoice.Quantity,
            ...invoice,
          };
        })
      );
      method.setValue(
        "installments",
        CustomerInvoiceData?.InstallmentDetail.map((item, index) => {
          return {
            IDate: new Date(item.DueDate),
            Amount: item.Amount,
          };
        })
      );
      method.setValue("TotalAmount", CustomerInvoiceData?.Master[0]?.TotalCGS);
      method.setValue(
        "TotalNetAmount",
        CustomerInvoiceData?.Master[0]?.TotalNetAmount
      );
      method.setValue(
        "TotalDiscount",
        CustomerInvoiceData?.Master[0]?.TotalDiscount
      );
      method.setValue("TotalRate", CustomerInvoiceData?.Master[0]?.TotalRate);
    }
  }, [+CustomerInvoiceID, CustomerInvoiceData]);

  function handleEdit() {
    navigate(`${editRoute}${CustomerInvoiceID}`);
  }

  function handleAddNew() {
    method.reset();
    navigate(newRoute);
  }

  function handleCancel() {
    if (mode === "new") {
      navigate(parentRoute);
    } else if (mode === "edit") {
      navigate(`${parentRoute}/${CustomerInvoiceID}`);
    }
  }

  function handleDelete() {
    deleteMutation.mutate({
      CustomerInvoiceID: CustomerInvoiceID,
      LoginUserID: user.userID,
    });
    navigate(parentRoute);
  }

  function onSubmit(data) {
    if (data?.CustomerInvoiceDetail.length > 0) {
      CustomerInvoiceMutation.mutate({
        formData: data,
        userID: user.userID,
        CustomerInvoiceID: CustomerInvoiceID,
      });
    } else {
      toast.error("Please add atleast 1 row!");
    }
  }

  return (
    <>
      {isLoading ? (
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
        <>
          <CustomerBranchDataProvider>
            <div className="mt-4">
              <ButtonToolBar
                editDisable={mode !== "view"}
                cancelDisable={mode === "view"}
                addNewDisable={mode === "edit" || mode === "new"}
                deleteDisable={mode === "edit" || mode === "new"}
                saveDisable={mode === "view"}
                saveLabel={mode === "edit" ? "Update" : "Save"}
                handleGoBack={() => navigate(parentRoute)}
                handleEdit={() => handleEdit()}
                handleCancel={() => {
                  handleCancel();
                }}
                handleAddNew={() => {
                  handleAddNew();
                }}
                handleSave={() => method.handleSubmit(onSubmit)()}
                GoBackLabel="CustomerInvoices"
                saveLoading={CustomerInvoiceMutation.isPending}
                handleDelete={handleDelete}
                showPrint={true}
                handlePrint={() =>
                  PrintReportInNewTab(
                    `InvoicePrint?CustomerInvoiceID=${CustomerInvoiceID}`
                  )
                }
                printDisable={mode !== "view"}
              />
            </div>
            <form id="CustomerInvoice" className="mt-4">
              <FormProvider {...method}>
                <Row>
                  <SessionSelect mode={mode} />
                  <BusinessUnitDependantFields mode={mode} />
                </Row>
                <Row>
                  <Form.Group as={Col} className="col-2">
                    <Form.Label>Invoice Date</Form.Label>
                    <div>
                      <CDatePicker
                        control={method.control}
                        name="VoucherDate"
                        disabled={mode === "view"}
                      />
                    </div>
                  </Form.Group>
                  <Form.Group as={Col} className="col-2">
                    <Form.Label>
                      Invoice Due Date
                      <Button
                        tooltip="Installments"
                        icon="pi pi-money-bill"
                        severity="primary"
                        size="small"
                        className="rounded-2"
                        type="button"
                        onClick={() =>
                          invoiceInstallmentRef.current?.openDialog(true)
                        }
                        style={{
                          padding: "1px 0px",
                          fontSize: "small",
                          width: "30px",
                          marginLeft: "10px",
                        }}
                      />
                    </Form.Label>
                    <div>
                      <CDatePicker
                        control={method.control}
                        name="VoucherDueDate"
                        disabled={mode === "view"}
                      />
                    </div>
                  </Form.Group>

                  <CustomerDependentFields
                    mode={mode}
                    removeAllRows={detailTableRef.current?.removeAllRows}
                    ref={customerCompRef}
                  />
                </Row>
                <Row>
                  <Form.Group as={Col} controlId="InvoiceTitle">
                    <Form.Label>Invoice Title</Form.Label>
                    <div>
                      <TextInput
                        control={method.control}
                        ID={"InvoiceTitle"}
                        isEnable={mode !== "view"}
                        focusOptions={() => method.setFocus("Description")}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    controlId="Description"
                    className="col-9"
                  >
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as={"textarea"}
                      rows={1}
                      disabled={mode === "view"}
                      className="form-control"
                      style={{
                        padding: "0.3rem 0.4rem",
                        fontSize: "0.8em",
                      }}
                      {...method.register("Description")}
                    />
                  </Form.Group>
                </Row>
              </FormProvider>
            </form>
            {mode !== "view" && (
              <>
                <div className="card p-2 bg-light mt-2 ">
                  <CustomerInvoiceDetailHeaderForm
                    appendSingleRow={detailTableRef.current?.appendSingleRow}
                    customerBranchRef={customerBranchRef}
                  />
                </div>
              </>
            )}

            <FormProvider {...method}>
              <CustomerInvoiceDetailTable
                mode={mode}
                BusinessUnitSelectData={BusinessUnitSelectData}
                CustomerBranchSelectData={[]}
                ref={detailTableRef}
              />
            </FormProvider>
            <hr />
            <FormProvider {...method}>
              <CustomerInvoiceDetailTotal />
            </FormProvider>
            <Row>
              <Form.Group as={Col}>
                <Form.Label>Total Amount</Form.Label>

                <Form.Control
                  type="number"
                  {...method.register("TotalRate")}
                  disabled
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Total CGS</Form.Label>

                <Form.Control
                  type="number"
                  {...method.register("TotalAmount")}
                  disabled
                />
              </Form.Group>{" "}
              <Form.Group as={Col}>
                <Form.Label>Total Discount</Form.Label>

                <Form.Control
                  type="number"
                  {...method.register("TotalDiscount")}
                  disabled
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Total Net Amount</Form.Label>

                <Form.Control
                  type="number"
                  {...method.register("TotalNetAmount")}
                  disabled
                />
              </Form.Group>
            </Row>
            <FormProvider {...method}>
              <NewCustomerInvoiceIntallmentsModal
                mode={mode}
                ref={invoiceInstallmentRef}
              />
            </FormProvider>
          </CustomerBranchDataProvider>
        </>
      )}
    </>
  );
}

// New Master Fields
function SessionSelect({ mode }) {
  const { data } = useQuery({
    queryKey: [SELECT_QUERY_KEYS.SESSION_SELECT_QUERY_KEY],
    queryFn: fetchAllSessionsForSelect,
    initialData: [],
  });

  const method = useFormContext();

  useEffect(() => {
    if (data.length > 0 && mode === "new") {
      method.setValue("SessionID", data[0]?.SessionID);
    }
  }, [data, mode]);

  return (
    <>
      <Form.Group className="col-xl-3" as={Col}>
        <Form.Label style={{ fontSize: "14px", fontWeight: "bold" }}>
          Session
          <span className="text-danger fw-bold ">*</span>
        </Form.Label>
        <div>
          <CDropdown
            control={method.control}
            name={`SessionID`}
            optionLabel="SessionTitle"
            optionValue="SessionID"
            placeholder="Select a session"
            options={data}
            required={true}
            filter={false}
            disabled={mode === "view"}
            focusOptions={() => method.setFocus("BusinessUnitID")}
          />
        </div>
      </Form.Group>
    </>
  );
}

const CustomerDependentFields = React.forwardRef(
  ({ mode, removeAllRows }, ref) => {
    const { setAccountID } = useContext(CustomerBranchDataContext);
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

    React.useImperativeHandle(ref, () => ({
      setCustomerID,
    }));

    const method = useFormContext();

    return (
      <>
        <Form.Group as={Col}>
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
              name={"Customer"}
              optionLabel="CustomerName"
              optionValue="CustomerID"
              placeholder="Select a customer"
              options={customerSelectData}
              disabled={mode === "view"}
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
        <Form.Group as={Col}>
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
              filter={true}
              onChange={(e) => {
                setAccountID(e.value);
                removeAllRows();
              }}
              focusOptions={() => method.setFocus("CustomerInvoiceMode")}
            />
          </div>
        </Form.Group>
      </>
    );
  }
);

function BusinessUnitDependantFields({ mode }) {
  const [BusinesssUnitID, setBusinessUnitID] = useState(0);

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
    async function fetchCustomerInvoiceNo() {
      const data = await fetchMonthlyMaxCustomerInvoiceNo(BusinesssUnitID);
      method.setValue("BusinessUnitID", BusinesssUnitID);
      method.setValue("VoucherNo", data[0]?.InvoiceNo);
      method.setValue("SessionBasedVoucherNo", data[0]?.SessionBasedVoucherNo);
    }

    if (BusinesssUnitID !== 0 && mode === "new") {
      fetchCustomerInvoiceNo();
    }
  }, [BusinesssUnitID, mode]);

  const method = useFormContext();

  return (
    <>
      <Form.Group as={Col} className="col-3">
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
            focusOptions={() => method.setFocus("Customer")}
            onChange={(e) => {
              setBusinessUnitID(e.value);
            }}
          />
        </div>
      </Form.Group>
      <Form.Group as={Col} className="col-2">
        <Form.Label>CustomerInvoice No(Monthly)</Form.Label>

        <div>
          <TextInput
            control={method.control}
            ID={"VoucherNo"}
            isEnable={false}
          />
        </div>
      </Form.Group>
      <Form.Group as={Col} className="col-2">
        <Form.Label>CustomerInvoice No(Yearly)</Form.Label>

        <div>
          <TextInput
            control={method.control}
            ID={"SessionBasedVoucherNo"}
            isEnable={false}
          />
        </div>
      </Form.Group>
      <Form.Group as={Col} className="col-2">
        <Form.Label>Document No</Form.Label>
        <div>
          <TextInput
            control={method.control}
            ID={"DocumentNo"}
            isEnable={mode !== "view"}
          />
        </div>
      </Form.Group>
    </>
  );
}

// New Detail Header Form
function CustomerInvoiceDetailHeaderForm({
  appendSingleRow,
  customerBranchRef,
}) {
  const invoiceTypeRef = useRef();
  const { pageTitles } = useContext(AppConfigurationContext);

  const method = useForm({
    defaultValues: {
      InvoiceType: "",
      BusinessUnitID: "",
      ProductInfoID: "",
      ServiceInfoID: "",
      BalanceAmount: "",
      Amount: 0,
      Qty: 0,
      Rate: 0,
      IsFree: false,
      CGS: 0,
      Discount: 0,
      NetAmount: 0,
      Description: "",
      CustomerBranch: "",
    },
  });

  function onSubmit(data) {
    appendSingleRow(data);
    method.reset();
  }

  const typesOptions = [
    { label: `${pageTitles?.product || "Product"}`, value: "Product" },
    { label: "Service", value: "Service" },
  ];

  return (
    <>
      <form>
        <Row>
          <Form.Group as={Col} controlId="InvoiceType">
            <Form.Label>Invoice Type</Form.Label>
            <span className="text-danger fw-bold ">*</span>

            <div>
              <CDropdown
                control={method.control}
                name={`InvoiceType`}
                placeholder="Select a type"
                options={typesOptions}
                required={true}
                focusOptions={() => method.setFocus("BusinessUnit")}
                onChange={(e) => {
                  invoiceTypeRef.current?.setInvoiceType(e.value);
                }}
              />
            </div>
          </Form.Group>
          <FormProvider {...method}>
            <DetailHeaderBusinessUnitDependents ref={invoiceTypeRef} />
          </FormProvider>
        </Row>
        <Row>
          <FormProvider {...method}>
            <BranchSelectField ref={customerBranchRef} />
          </FormProvider>
          <Form.Group as={Col} className="col-1">
            <Form.Label>Qty</Form.Label>
            <NumberInput
              id={"Qty"}
              control={method.control}
              onChange={(e) => {
                const rate = method.getValues(["Rate"]);
                method.setValue("Amount", e.value * rate);
                const amount = method.getValues(["Amount"]);
                const discount = method.getValues(["Discount"]);
                method.setValue("NetAmount", amount - discount);
              }}
              inputClassName="form-control"
              useGrouping={false}
              enterKeyOptions={() => method.setFocus("Rate")}
            />
          </Form.Group>
          <Form.Group as={Col} className="col-2">
            <Form.Label>Rate</Form.Label>
            <NumberInput
              id={"Rate"}
              control={method.control}
              onChange={(e) => {
                const qty = method.getValues(["Qty"]);
                method.setValue("Amount", e.value * qty);
                const disc = method.getValues(["Discount"]);
                method.setValue("NetAmount", e.value * qty - disc);
              }}
              mode="decimal"
              maxFractionDigits={2}
              inputClassName="form-control"
              useGrouping={false}
              disabled={method.watch("IsFree")}
              enterKeyOptions={() => method.setFocus("CGS")}
            />
          </Form.Group>
          <Form.Group as={Col} className="col-1">
            <Form.Label>CGS</Form.Label>
            <NumberInput
              id={"CGS"}
              control={method.control}
              mode="decimal"
              maxFractionDigits={2}
              inputClassName="form-control"
              useGrouping={false}
              enterKeyOptions={() => method.setFocus("Discount")}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="Amount" className="col-2">
            <Form.Label>Amount</Form.Label>
            <NumberInput
              id={"Amount"}
              control={method.control}
              mode="decimal"
              maxFractionDigits={2}
              inputClassName="form-control"
              useGrouping={false}
              disabled={true}
            />
          </Form.Group>
          <Form.Group as={Col} className="col-1">
            <Form.Label>Discount</Form.Label>
            <NumberInput
              id={"Discount"}
              control={method.control}
              onChange={(e) => {
                const amount = method.getValues(["Amount"]);
                method.setValue("NetAmount", amount - e.value);
              }}
              mode="decimal"
              maxFractionDigits={2}
              inputClassName="form-control"
              useGrouping={false}
              disabled={method.watch("IsFree")}
              enterKeyOptions={() => method.setFocus("DetailDescription")}
            />
          </Form.Group>
          <Form.Group as={Col} className="col-2">
            <Form.Label>Net Amount</Form.Label>
            <NumberInput
              id={"NetAmount"}
              control={method.control}
              mode="decimal"
              maxFractionDigits={2}
              inputClassName="form-control"
              useGrouping={false}
              disabled={true}
            />
          </Form.Group>
        </Row>
        <Row>
          <Form.Group as={Col} className="col-9">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as={"textarea"}
              rows={1}
              className="form-control"
              style={{
                padding: "0.3rem 0.4rem",
                fontSize: "0.8em",
              }}
              {...method.register("DetailDescription")}
            />
          </Form.Group>
          <Form.Group as={Col} className="col-1">
            <Form.Label>Is Free</Form.Label>
            <div>
              <CSwitchInput
                control={method.control}
                name={"IsFree"}
                onChange={(e) => {
                  if (e.value) {
                    method.setValue("Rate", 0);
                    method.setValue("Amount", 0);
                    method.setValue("Discount", 0);
                    method.setValue("NetAmount", 0);
                  }
                }}
              />
            </div>
          </Form.Group>

          <Form.Group className="col-2" as={Col} controlId="Actions">
            <Form.Label></Form.Label>
            <DetailHeaderActionButtons
              handleAdd={() => method.handleSubmit(onSubmit)()}
              handleClear={() => method.reset()}
            />
          </Form.Group>
        </Row>
        <DevTool control={method.control} />
      </form>
    </>
  );
}

const DetailHeaderBusinessUnitDependents = React.forwardRef((props, ref) => {
  const [InvoiceType, setInvoiceType] = useState();
  const [BusinessUnitID, setBusinessUnitID] = useState(0);

  const { pageTitles } = useContext(AppConfigurationContext);

  const { data: BusinessUnitSelectData } = useQuery({
    queryKey: [SELECT_QUERY_KEYS.BUSINESS_UNIT_SELECT_QUERY_KEY],
    queryFn: fetchAllBusinessUnitsForSelect,
    initialData: [],
  });
  const { data: ProductsInfoSelectData } = useQuery({
    queryKey: [
      SELECT_QUERY_KEYS.PRODUCTS_INFO_SELECT_QUERY_KEY,
      BusinessUnitID,
    ],
    queryFn: () => fetchAllProductsForSelect(BusinessUnitID),
    initialData: [],
  });
  const { data: ServicesInfoSelectData } = useQuery({
    queryKey: [SELECT_QUERY_KEYS.SERVICES_SELECT_QUERY_KEY, BusinessUnitID],
    queryFn: () => fetchAllServicesForSelect(BusinessUnitID),
    initialData: [],
  });

  React.useImperativeHandle(ref, () => ({
    setInvoiceType,
  }));

  const method = useFormContext();

  return (
    <>
      <Form.Group as={Col} className="col-3">
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
            required={true}
            focusOptions={() => method.setFocus("Customer")}
            onChange={(e) => {
              setBusinessUnitID(e.value);
              method.resetField("ProductInfoID");
              method.resetField("ServiceInfoID");
            }}
          />
        </div>
      </Form.Group>
      <Form.Group as={Col} className="col-3">
        <Form.Label>{pageTitles?.product || "Product"}</Form.Label>
        <span className="text-danger fw-bold ">*</span>
        <div>
          <CDropdown
            control={method.control}
            name={`ProductInfoID`}
            optionLabel="ProductInfoTitle"
            optionValue="ProductInfoID"
            placeholder={`Select a ${
              pageTitles?.product?.toLowerCase() || "product"
            }`}
            options={ProductsInfoSelectData}
            required={true}
            filter={true}
            focusOptions={() => method.setFocus("ServiceInfo")}
          />
        </div>
      </Form.Group>
      <Form.Group as={Col} className="col-3">
        <Form.Label>
          {InvoiceType === "Product"
            ? `${pageTitles?.product || "Product"} to Invoice`
            : "Service to Invoice"}{" "}
        </Form.Label>

        <div>
          <CDropdown
            control={method.control}
            name={`ServiceInfoID`}
            optionLabel="ProductInfoTitle"
            optionValue="ProductInfoID"
            placeholder={`Select a service`}
            options={ServicesInfoSelectData}
            filter={true}
            disabled={InvoiceType === "Product"}
            focusOptions={() => method.setFocus("Qty")}
          />
        </div>
        {/* <span className="text-danger">{errors?.ServiceInfo?.message}</span> */}
      </Form.Group>
    </>
  );
});

const CustomerInvoiceDetailTable = React.forwardRef(
  ({ mode, BusinessUnitSelectData }, ref) => {
    const method = useFormContext();

    const { fields, append, remove } = useFieldArray({
      control: method.control,
      name: "CustomerInvoiceDetail",
      rules: {
        required: true,
      },
    });

    React.useImperativeHandle(ref, () => ({
      appendSingleRow(data) {
        append(data);
      },
      removeAllRows() {
        remove();
      },
    }));

    const { pageTitles } = useContext(AppConfigurationContext);

    const typesOptions = [
      { label: `${pageTitles?.product || "Product"}`, value: "Product" },
      { label: "Service", value: "Service" },
    ];

    return (
      <>
        <Table
          responsive
          className="table  table-responsive mt-2"
          style={{ width: "1500px" }}
        >
          <thead>
            <tr>
              <th
                className="p-2 text-white"
                style={{ background: onlineDetailColor }}
              >
                Sr No.
              </th>
              <th
                className="p-2 text-white"
                style={{ background: onlineDetailColor }}
              >
                Is Free
              </th>
              <th
                className="p-2 text-white"
                style={{ background: onlineDetailColor, width: "300px" }}
              >
                InvoiceType
              </th>
              <th
                className="p-2 text-white"
                style={{ background: onlineDetailColor }}
              >
                Business Unit
              </th>

              <th
                className="p-2 text-white"
                style={{ background: onlineDetailColor }}
              >
                {pageTitles?.branch || "Customer Branch"}
              </th>
              <th
                className="p-2 text-white"
                style={{ background: onlineDetailColor }}
              >
                {pageTitles?.product || "Product"}
              </th>
              <th
                className="p-2 text-white"
                style={{ background: onlineDetailColor }}
              >
                Service
              </th>
              <th
                className="p-2 text-white"
                style={{ background: onlineDetailColor }}
              >
                Qty
              </th>
              <th
                className="p-2  text-white"
                style={{ background: onlineDetailColor }}
              >
                Rate
              </th>
              <th
                className="p-2  text-white"
                style={{ background: onlineDetailColor }}
              >
                CGS
              </th>
              <th
                className="p-2  text-white"
                style={{ background: onlineDetailColor }}
              >
                Amount
              </th>
              <th
                className="p-2  text-white"
                style={{ background: onlineDetailColor }}
              >
                Discount
              </th>
              <th
                className="p-2  text-white"
                style={{ background: onlineDetailColor }}
              >
                Net Amount
              </th>
              <th
                className="p-2  text-white"
                style={{ background: onlineDetailColor }}
              >
                Description
              </th>

              <th
                className="p-2  text-white"
                style={{ background: onlineDetailColor }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <FormProvider {...method}>
              {fields.map((item, index) => {
                return (
                  <CustomerInvoiceDetailTableRow
                    key={item.id}
                    item={item}
                    index={index}
                    disable={mode === "view"}
                    BusinessUnitSelectData={BusinessUnitSelectData}
                    remove={remove}
                    typesOptions={typesOptions}
                    pageTitles={pageTitles}
                  />
                );
              })}
            </FormProvider>
          </tbody>
        </Table>
      </>
    );
  }
);

function CustomerInvoiceDetailTableRow({
  item,
  index,
  disable = false,
  BusinessUnitSelectData,
  remove,
  typesOptions,
  pageTitles,
}) {
  const [BusinessUnitID, setBusinessUnitID] = useState(0);
  const [IsFree, setIsFree] = useState(false);
  const [InvoiceType, setInvoiceType] = useState("");

  const method = useFormContext();
  const { data: ProductsInfoSelectData } = useQuery({
    queryKey: [
      SELECT_QUERY_KEYS.PRODUCTS_INFO_SELECT_QUERY_KEY,
      BusinessUnitID,
      index,
    ],
    queryFn: () => fetchAllProductsForSelect(BusinessUnitID),
    initialData: [],
  });
  const { data: ServicesInfoSelectData } = useQuery({
    queryKey: [
      SELECT_QUERY_KEYS.SERVICES_SELECT_QUERY_KEY,
      BusinessUnitID,
      index,
    ],
    queryFn: () => fetchAllServicesForSelect(BusinessUnitID),
    initialData: [],
  });

  const { AccountID } = useContext(CustomerBranchDataContext);

  const { data } = useQuery({
    queryKey: [SELECT_QUERY_KEYS.CUSTOMER_BRANCHES_SELECT_QUERY_KEY, AccountID],
    queryFn: () => fetchAllCustomerBranchesData(AccountID),
    enabled: AccountID !== 0,
    initialData: [],
  });

  return (
    <tr key={item.id}>
      <td>
        <input
          id="RowID"
          readOnly
          className="form-control"
          style={{ padding: "0.25rem 0.4rem", fontSize: "0.9em" }}
          value={index + 1}
          disabled={disable}
        />
      </td>
      <td>
        <Controller
          control={method.control}
          name={`CustomerInvoiceDetail.${index}.IsFree`}
          render={({ field, fieldState }) => (
            <>
              <InputSwitch
                inputId={field.name}
                checked={field.value}
                inputRef={field.ref}
                disabled={disable}
                className={classNames({ "p-invalid": fieldState.error })}
                onChange={(e) => {
                  field.onChange(e.value);

                  if (e.value) {
                    method.setValue(`CustomerInvoiceDetail.${index}.Rate`, 0);
                    method.setValue(`CustomerInvoiceDetail.${index}.Amount`, 0);
                    method.setValue(
                      `CustomerInvoiceDetail.${index}.Discount`,
                      0
                    );
                    method.setValue(
                      `CustomerInvoiceDetail.${index}.NetAmount`,
                      0
                    );
                    setIsFree(true);
                  } else {
                    setIsFree(false);
                  }
                }}
              />
            </>
          )}
        />
      </td>
      <td style={{ width: "300px" }}>
        <CDropdown
          control={method.control}
          options={typesOptions}
          name={`CustomerInvoiceDetail.${index}.InvoiceType`}
          placeholder="Select an invoice type"
          required={true}
          showOnFocus={true}
          disabled={disable}
          focusOptions={() => method.setFocus(`detail.${index}.BusinessUnit`)}
          onChange={(e) => {
            setInvoiceType(e.value);
            if (e.value === "Product") {
              method.setValue(
                `CustomerInvoiceDetail.${index}.ServiceInfoID`,
                null
              );
            }
          }}
        />
      </td>

      <td>
        <CDropdown
          control={method.control}
          name={`CustomerInvoiceDetail.${index}.BusinessUnitID`}
          optionLabel="BusinessUnitName"
          optionValue="BusinessUnitID"
          placeholder="Select a business unit"
          options={BusinessUnitSelectData}
          required={true}
          disabled={disable}
          onChange={(e) => {
            setBusinessUnitID(e.value);
            method.setValue(`CustomerInvoiceDetail.${index}.ProductInfoID`, []);
          }}
          filter={true}
          focusOptions={() => method.setFocus(`detail.${index}.BranchID`)}
        />
      </td>
      {/* Customer Branch */}
      <td>
        <CDropdown
          control={method.control}
          name={`CustomerInvoiceDetail.${index}.CustomerBranch`}
          optionLabel="BranchTitle"
          optionValue="BranchID"
          placeholder={`Select a ${
            pageTitles?.branch?.toLowerCase() || "branch"
          }`}
          options={data}
          required={true}
          disabled={disable}
          filter={true}
          focusOptions={() =>
            method.setFocus(`CustomerInvoiceDetail.${index}.ProductInfo`)
          }
        />
      </td>
      {/* Product Info */}
      <td>
        <CDropdown
          control={method.control}
          name={`CustomerInvoiceDetail.${index}.ProductInfoID`}
          optionLabel="ProductInfoTitle"
          optionValue="ProductInfoID"
          placeholder="Select a product"
          options={ProductsInfoSelectData}
          required={true}
          disabled={disable}
          filter={true}
          focusOptions={() =>
            method.setFocus(`CustomerInvoiceDetail.${index}.Rate`)
          }
        />
      </td>
      {/* Service */}
      <td>
        <CDropdown
          control={method.control}
          name={`CustomerInvoiceDetail.${index}.ServiceInfoID`}
          optionLabel="ProductInfoTitle"
          optionValue="ProductInfoID"
          placeholder="Select a service"
          options={ServicesInfoSelectData}
          required={
            method.watch(`CustomerInvoiceDetail.${index}.InvoiceType`) ===
            "Service"
          }
          disabled={
            disable ||
            method.watch(`CustomerInvoiceDetail.${index}.InvoiceType`) ===
              "Product"
          }
          filter={true}
          focusOptions={() =>
            method.setFocus(`CustomerInvoiceDetail.${index}.Qty`)
          }
        />
      </td>
      <td>
        <NumberInput
          id={`CustomerInvoiceDetail.${index}.Qty`}
          control={method.control}
          onChange={(e) => {
            const rate = parseFloat(
              0 + method.getValues([`CustomerInvoiceDetail.${index}.Rate`])
            );
            const disc = parseFloat(
              0 + method.getValues([`CustomerInvoiceDetail.${index}.Discount`])
            );
            method.setValue(
              `CustomerInvoiceDetail.${index}.Amount`,
              e.value * rate
            );
            method.setValue(
              `CustomerInvoiceDetail.${index}.NetAmount`,
              e.value * rate - disc
            );
          }}
          disabled={disable}
          inputClassName="form-control"
          useGrouping={false}
          enterKeyOptions={() => method.setFocus("Rate")}
        />
      </td>
      <td>
        <NumberInput
          id={`CustomerInvoiceDetail.${index}.Rate`}
          control={method.control}
          onChange={(e) => {
            const qty = parseFloat(
              0 + method.getValues([`CustomerInvoiceDetail.${index}.Qty`])
            );
            const disc = parseFloat(
              0 + method.getValues([`detail.${index}.Discount`])
            );
            method.setValue(
              `CustomerInvoiceDetail.${index}.Amount`,
              e.value * qty
            );
            method.setValue(
              `CustomerInvoiceDetail.${index}.NetAmount`,
              e.value * qty - disc
            );
            method.setValue(`CustomerInvoiceDetail.${index}.Rate`, e.value);
          }}
          disabled={
            disable || method.watch(`CustomerInvoiceDetail.${index}.IsFree`)
          }
          mode="decimal"
          maxFractionDigits={2}
          inputClassName="form-control"
          useGrouping={false}
        />
      </td>
      <td>
        <NumberInput
          id={`CustomerInvoiceDetail.${index}.CGS`}
          control={method.control}
          onChange={(e) => {
            method.setValue(`CustomerInvoiceDetail.${index}.CGS`, e.value);
          }}
          disabled={disable}
          mode="decimal"
          maxFractionDigits={2}
          inputClassName="form-control"
          useGrouping={false}
        />
      </td>
      <td>
        <NumberInput
          id={`CustomerInvoiceDetail.${index}.Amount`}
          control={method.control}
          disabled={true}
          mode="decimal"
          maxFractionDigits={2}
          inputClassName="form-control"
          useGrouping={false}
        />
      </td>
      <td>
        <NumberInput
          id={`CustomerInvoiceDetail.${index}.Discount`}
          control={method.control}
          onChange={(e) => {
            const amount = parseFloat(
              0 + method.getValues([`CustomerInvoiceDetail.${index}.Amount`])
            );

            method.setValue(
              `CustomerInvoiceDetail.${index}.NetAmount`,
              amount - e.value
            );
          }}
          disabled={
            disable || method.watch(`CustomerInvoiceDetail.${index}.IsFree`)
          }
          mode="decimal"
          maxFractionDigits={2}
          inputClassName="form-control"
          useGrouping={false}
        />
      </td>
      <td>
        <NumberInput
          id={`CustomerInvoiceDetail.${index}.NetAmount`}
          control={method.control}
          disabled={true}
          mode="decimal"
          maxFractionDigits={2}
          inputClassName="form-control"
          useGrouping={false}
        />
      </td>
      <td>
        <Form.Control
          type="text"
          as={"textarea"}
          rows={1}
          disabled={disable}
          {...method.register(
            `CustomerInvoiceDetail.${index}.DetailDescription`
          )}
        />
      </td>
      <td>
        <Button
          icon="pi pi-minus"
          severity="danger"
          size="sm"
          type="button"
          style={{
            padding: "0.25rem .7rem",
            borderRadius: "16px",
            fontSize: "0.9em",
          }}
          onClick={() => remove(index)}
        />
      </td>
    </tr>
  );
}

// Total
function CustomerInvoiceDetailTotal() {
  const method = useFormContext();

  const details = useWatch({
    control: method.control,
    name: "CustomerInvoiceDetail",
  });

  useEffect(() => {
    calculateTotal(details);
  }, [details]);

  function calculateTotal(details) {
    let rateSum = 0;
    let cgsSum = 0;
    let discountSum = 0;
    let amountSum = 0;

    details.forEach((item, index) => {
      const rate = parseFloat(item.Rate || 0);
      const cgs = parseFloat(item.CGS || 0);
      const discount = parseFloat(item.Discount || 0);
      const amount = parseFloat(item.NetAmount || 0);
      const qty = parseFloat(item.Qty || 0);

      rateSum += rate * qty;
      cgsSum += cgs;
      discountSum += discount;
      amountSum += amount;
    });
    method.setValue("TotalNetAmount", amountSum);
    method.setValue("TotalDiscount", discountSum);
    method.setValue("TotalAmount", cgsSum);
    method.setValue("TotalRate", rateSum);
  }

  return null;
}

const BranchSelectField = React.forwardRef((props, ref) => {
  const { AccountID, setAccountID } = useContext(CustomerBranchDataContext);

  const method = useFormContext();
  const { pageTitles } = useContext(AppConfigurationContext);

  const { data } = useQuery({
    queryKey: [SELECT_QUERY_KEYS.CUSTOMER_BRANCHES_SELECT_QUERY_KEY, AccountID],
    queryFn: () => fetchAllCustomerBranchesData(AccountID),
    enabled: AccountID !== 0,
    initialData: [],
  });

  React.useImperativeHandle(ref, () => ({
    setAccountID,
  }));

  return (
    <>
      <Form.Group as={Col} className="col-3">
        <Form.Label>
          {pageTitles?.branch || "Customer Branch"}
          <span className="text-danger fw-bold ">*</span>
        </Form.Label>

        <div>
          <CDropdown
            control={method.control}
            name={`CustomerBranch`}
            optionLabel="BranchTitle"
            optionValue="BranchID"
            placeholder={`Select a  ${
              pageTitles?.branch?.toLowerCase() || "branch"
            }`}
            options={data}
            required={true}
            focusOptions={() => method.setFocus("ProductInfo")}
          />
        </div>
      </Form.Group>
    </>
  );
});

function DispatchDetailEvents(details) {
  if (details.length > 0) {
    // details.forEach((item, index) => {
    //   document
    //     .getElementById(`CustomerInvoiceDetail.${index}.IsFree`)
    //     ?.dispatchEvent(new Event("change"));
    // });
    document
      .getElementById(`CustomerInvoiceDetail.2.BusinessUnitID`)
      ?.dispatchEvent(new Event("change"));
  }
}

const CustomerBranchDataContext = createContext();

const CustomerBranchDataProvider = ({ children }) => {
  const [AccountID, setAccountID] = useState();

  return (
    <CustomerBranchDataContext.Provider value={{ setAccountID, AccountID }}>
      {children}
    </CustomerBranchDataContext.Provider>
  );
};
