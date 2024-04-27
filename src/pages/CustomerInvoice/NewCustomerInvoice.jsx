import { Row, Form, Col, Spinner, Table } from "react-bootstrap"
import { DataTable } from "primereact/datatable"
import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { toast } from "react-toastify"
import {
  useForm,
  useFieldArray,
  useFormContext,
  FormProvider,
  useWatch,
  Controller,
} from "react-hook-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import ActionButtons from "../../components/ActionButtons"
import { FilterMatchMode } from "primereact/api"
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"

import { AuthContext } from "../../context/AuthContext"
import { Route, Routes, useNavigate, useParams } from "react-router-dom"

import TextInput from "../../components/Forms/TextInput"
import NumberInput from "../../components/Forms/NumberInput"

import DetailHeaderActionButtons from "../../components/DetailHeaderActionButtons"
import CDropdown from "../../components/Forms/CDropdown"
import { DevTool } from "@hookform/devtools"
import {
  addNewCustomerInvoice,
  deleteCustomerInvoiceByID,
  fetchMonthlyMaxCustomerInvoiceNo,
  fetchCustomerInvoiceById,
  fetchAllCustomerInvoices,
} from "../../api/CustomerInvoiceData"
import ButtonToolBar from "../../components/ActionsToolbar"

import {
  MENU_KEYS,
  QUERY_KEYS,
  ROUTE_URLS,
  SELECT_QUERY_KEYS,
} from "../../utils/enums"
import {
  fetchAllBusinessUnitsForSelect,
  fetchAllCustomerAccountsForSelect,
  fetchAllCustomerBranchesData,
  fetchAllOldCustomersForSelect,
  fetchAllProductsForSelect,
  fetchAllServicesForSelect,
  fetchAllSessionsForSelect,
} from "../../api/SelectData"
import CDatePicker from "../../components/Forms/CDatePicker"
import CSwitchInput from "../../components/Forms/CSwitchInput"
import { useUserData } from "../../context/AuthContext"
import { CustomerEntryForm } from "../../components/CustomerEntryFormComponent"
import { ShowErrorToast } from "../../utils/CommonFunctions"
import NewCustomerInvoiceIntallmentsModal from "../../components/Modals/NewCustomerInvoiceInstallmentModal"
import { CustomSpinner } from "../../components/CustomSpinner"
import { AppConfigurationContext } from "../../context/AppConfigurationContext"
import useConfirmationModal from "../../hooks/useConfirmationModalHook"
import AccessDeniedPage from "../../components/AccessDeniedPage"
import { UserRightsContext } from "../../context/UserRightContext"
import { decryptID, encryptID } from "../../utils/crypto"
import { CustomerInvoiceDetailTableRowComponent } from "./CustomerInvoiceDetailTable/BusinessUnitDependantRowFields"
import { TextAreaField } from "../../components/Forms/form"
import { usePrintReportAsPDF } from "../../hooks/CommonHooks/commonhooks"
import { checkForUserRightsAsync } from "../../api/MenusData"

let parentRoute = ROUTE_URLS.ACCOUNTS.NEW_CUSTOMER_INVOICE
let editRoute = `${parentRoute}/edit/`
let newRoute = `${parentRoute}/new`
let viewRoute = `${parentRoute}/`
let onlineDetailColor = "#365abd"
let queryKey = QUERY_KEYS.CUSTOMER_INVOICE_QUERY_KEY
let IDENTITY = "CustomerInvoiceID"

export default function CustomerInvoice() {
  const { checkForUserRights } = useContext(UserRightsContext)
  const [userRights, setUserRights] = useState([])

  const user = useUserData()

  const { data: rights } = useQuery({
    queryKey: ["formRights"],
    queryFn: () =>
      checkForUserRightsAsync({
        MenuKey: MENU_KEYS.ACCOUNTS.CUSTOMER_INVOICE_FORM_KEY,
        LoginUserID: user?.userID,
      }),
    initialData: [],
  })

  useEffect(() => {
    if (rights) {
      setUserRights(rights)
    }
  }, [rights])

  return (
    <Routes>
      {userRights && userRights[0]?.ShowForm ? (
        <>
          <Route
            index
            element={<NewCustomerInvoiceEntrySearch userRights={userRights} />}
          />
          <Route
            path={`:${IDENTITY}`}
            element={
              <NewCustomerInvoiceEntryForm
                key={"CustomerInvoiceViewRoute"}
                mode={"view"}
                userRights={userRights}
              />
            }
          />
          <Route
            path={`edit/:${IDENTITY}`}
            element={
              <>
                {userRights[0].RoleEdit ? (
                  <>
                    <NewCustomerInvoiceEntryForm
                      key={"CustomerInvoiceEditRoute"}
                      mode={"edit"}
                      userRights={userRights}
                    />
                  </>
                ) : (
                  <AccessDeniedPage />
                )}
              </>
            }
          />

          <>
            <Route
              path={`new`}
              element={
                <>
                  {userRights[0].RoleNew ? (
                    <>
                      <NewCustomerInvoiceEntryForm
                        key={"CustomerInvoiceNewRoute"}
                        mode={"new"}
                        userRights={userRights}
                      />
                    </>
                  ) : (
                    <>
                      <AccessDeniedPage />
                    </>
                  )}
                </>
              }
            />
          </>
        </>
      ) : (
        <Route
          path="*"
          element={
            <>
              <AccessDeniedPage />
            </>
          }
        />
      )}
    </Routes>
  )
}

function NewCustomerInvoiceEntrySearch({ userRights }) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { showDeleteDialog, showEditDialog } = useConfirmationModal({
    handleDelete,
    handleEdit,
  })
  const { handlePrintReport } = usePrintReportAsPDF()

  const [filters, setFilters] = useState({
    SessionBasedVoucherNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
    InvoiceNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
    CustomerName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    AccountTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
    CustomerInvoiceMode: { value: null, matchMode: FilterMatchMode.CONTAINS },
    TotalNetAmount: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })

  const user = useUserData()

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchAllCustomerInvoices(user.userID),
    initialData: [],
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCustomerInvoiceByID,
    onSuccess: (success) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] })
      }
    },
  })

  function handleDelete(id) {
    deleteMutation.mutate({ CustomerInvoiceID: id, LoginUserID: user.userID })
  }

  function handleEdit(id) {
    navigate(editRoute + id)
  }

  function handleView(id) {
    navigate(parentRoute + "/" + id)
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
              {userRights[0]?.RoleNew && (
                <>
                  <Button
                    label="Create New Invoice"
                    icon="pi pi-plus"
                    type="button"
                    className="rounded"
                    onClick={() => navigate(newRoute)}
                  />
                </>
              )}
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
                ActionButtons({
                  ID: encryptID(rowData.CustomerInvoiceID),
                  handleDelete: () =>
                    showDeleteDialog(encryptID(rowData.CustomerInvoiceID)),
                  handleEdit: () =>
                    showEditDialog(encryptID(rowData.CustomerInvoiceID)),
                  handleView: handleView,
                  showEditButton: userRights[0]?.RoleEdit,
                  showDeleteButton: userRights[0]?.RoleDelete,
                  viewBtnRoute:
                    viewRoute + encryptID(rowData.CustomerInvoiceID),
                  showPrintBtn: true,
                  handlePrint: () =>
                    handlePrintReport({
                      getPrintFromUrl:
                        "InvoicePrint?CustomerInvoiceID=" +
                        rowData.CustomerInvoiceID,
                    }),
                })
              }
              header="Actions"
              resizeable={false}
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
  )
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
}

function NewCustomerInvoiceEntryForm({ mode, userRights }) {
  document.title = "Customer Invoice"
  const queryClient = useQueryClient()
  const { CustomerInvoiceID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  // Ref
  const detailTableRef = useRef()
  const customerCompRef = useRef()
  const invoiceInstallmentRef = useRef()
  const nullBranchRef = useRef()
  // Form
  const method = useForm({
    defaultValues,
  })

  const { data: CustomerInvoiceData } = useQuery({
    queryKey: [
      QUERY_KEYS.CUSTOMER_INVOICE_QUERY_KEY,
      {
        CustomerInvoiceID: CustomerInvoiceID,
      },
    ],
    queryFn: () => fetchCustomerInvoiceById(CustomerInvoiceID, user.userID),
    enabled: CustomerInvoiceID !== undefined,
    initialData: [],
    refetchOnWindowFocus: false,
  })

  const { data: BusinessUnitSelectData } = useQuery({
    queryKey: [SELECT_QUERY_KEYS.BUSINESS_UNIT_SELECT_QUERY_KEY],
    queryFn: fetchAllBusinessUnitsForSelect,
    initialData: [],
    enabled: mode !== "",
    refetchOnWindowFocus: false,
  })

  const CustomerInvoiceMutation = useMutation({
    mutationFn: addNewCustomerInvoice,
    onSuccess: ({ success, RecordID }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] })
        navigate(`${parentRoute}/${RecordID}`)
      }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCustomerInvoiceByID,
    onSuccess: (success) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] })
      }
    },
  })

  useEffect(() => {
    if (
      CustomerInvoiceID !== undefined &&
      CustomerInvoiceData?.Master?.length > 0
    ) {
      method.setValue("SessionID", CustomerInvoiceData?.Master[0]?.SessionID)
      method.setValue(
        "BusinessUnitID",
        CustomerInvoiceData?.Master[0]?.BusinessUnitID
      )
      method.setValue("Customer", CustomerInvoiceData?.Master[0]?.CustomerID)
      method.setValue("VoucherNo", CustomerInvoiceData?.Master[0]?.InvoiceNo)
      method.setValue(
        "SessionBasedVoucherNo",
        CustomerInvoiceData?.Master[0]?.InvoiceNo1
      )
      method.setValue(
        "VoucherDate",
        new Date(CustomerInvoiceData?.Master[0]?.InvoiceDate)
      )
      method.setValue(
        "VoucherDueDate",
        new Date(CustomerInvoiceData?.Master[0]?.InvoiceDueDate)
      )
      customerCompRef.current?.setCustomerID(
        CustomerInvoiceData?.Master[0]?.CustomerID
      )
      method.setValue(
        "CustomerLedgers",
        CustomerInvoiceData?.Master[0]?.AccountID
      )

      nullBranchRef.current?.setAccountID(
        CustomerInvoiceData?.Master[0]?.AccountID
      )

      method.setValue(
        "DocumentNo",
        CustomerInvoiceData?.Master[0]?.DocumentNo ?? undefined
      )
      method.setValue(
        "InvoiceTitle",
        CustomerInvoiceData?.Master[0]?.InvoiceTitle
      )
      method.setValue(
        "Description",
        CustomerInvoiceData?.Master[0]?.MasterDescription ?? undefined
      )
      method.setValue(
        "CustomerInvoiceDetail",
        CustomerInvoiceData.Detail?.map((invoice, index) => {
          return {
            InvoiceType: invoice.InvoiceTypeTitle,
            ProductInfoID: invoice.ProductToInvoiceID,
            ServiceInfoID: invoice.ServiceToInvoiceID,
            CustomerBranch: invoice.BranchID,
            BusinessUnitID: invoice.BusinessUnitID,
            Qty: invoice.Quantity,
            ...invoice,
          }
        })
      )
      method.setValue(
        "installments",
        CustomerInvoiceData?.InstallmentDetail.map((item, index) => {
          return {
            IDate: new Date(item.DueDate),
            Amount: item.Amount,
          }
        })
      )

      method.setValue("TotalAmount", CustomerInvoiceData?.Master[0]?.TotalCGS)
      method.setValue(
        "TotalNetAmount",
        CustomerInvoiceData?.Master[0]?.TotalNetAmount
      )
      method.setValue(
        "TotalDiscount",
        CustomerInvoiceData?.Master[0]?.TotalDiscount
      )
      method.setValue("TotalRate", CustomerInvoiceData?.Master[0]?.TotalRate)
    }
  }, [CustomerInvoiceID, CustomerInvoiceData])

  function handleEdit() {
    navigate(`${editRoute}${CustomerInvoiceID}`)
  }

  function handleAddNew() {
    method.reset()
    navigate(newRoute)
  }

  function handleCancel() {
    if (mode === "new") {
      navigate(parentRoute)
    } else if (mode === "edit") {
      navigate(`${parentRoute}/${CustomerInvoiceID}`)
    }
  }

  function handleDelete() {
    deleteMutation.mutate({
      CustomerInvoiceID: CustomerInvoiceID,
      LoginUserID: user.userID,
    })
    navigate(parentRoute)
  }

  function onSubmit(data) {
    if (data?.CustomerInvoiceDetail.length > 0) {
      CustomerInvoiceMutation.mutate({
        formData: data,
        userID: user.userID,
        CustomerInvoiceID: CustomerInvoiceID,
      })
    } else {
      ShowErrorToast("Please add atleast 1 row!")
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
                mode={mode}
                handleGoBack={() => navigate(parentRoute)}
                handleEdit={() => handleEdit()}
                handleCancel={() => {
                  handleCancel()
                }}
                handleAddNew={() => {
                  handleAddNew()
                }}
                handleSave={() => method.handleSubmit(onSubmit)()}
                GoBackLabel="CustomerInvoices"
                saveLoading={CustomerInvoiceMutation.isPending}
                handleDelete={handleDelete}
                showPrint={userRights[0]?.RolePrint}
                printDisable={mode !== "view"}
                showAddNewButton={userRights[0]?.RoleNew}
                showEditButton={userRights[0]?.RoleEdit}
                showDelete={userRights[0]?.RoleDelete}
                getPrintFromUrl={
                  mode !== "new" &&
                  `InvoicePrint?CustomerInvoiceID=${decryptID(
                    CustomerInvoiceID
                  )}`
                }
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
                    <div>
                      <textarea
                        rows={"1"}
                        disabled={mode === "view"}
                        className="p-inputtext"
                        style={{
                          padding: "0.3rem 0.4rem",
                          fontSize: "0.8em",
                          width: "100%",
                        }}
                        {...method.register("Description")}
                      />
                    </div>
                  </Form.Group>
                </Row>
              </FormProvider>
            </form>
            <NullBranchContext ref={nullBranchRef} />
            {mode !== "view" && (
              <>
                <div className="card p-2 bg-light mt-2 ">
                  <CustomerInvoiceDetailHeaderForm
                    appendSingleRow={detailTableRef.current?.appendSingleRow}
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
  )
}

// New Master Fields
function SessionSelect({ mode }) {
  const { data } = useQuery({
    queryKey: [SELECT_QUERY_KEYS.SESSION_SELECT_QUERY_KEY],
    queryFn: fetchAllSessionsForSelect,
    // Caching data for 10 mins
    refetchOnWindowFocus: false,
    staleTime: 600000,
    refetchInterval: 600000,
  })

  const method = useFormContext()

  useEffect(() => {
    if (data && data.length > 0 && mode === "new") {
      method.setValue("SessionID", data[0]?.SessionID)
    }
  }, [data, mode])

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
  )
}

const CustomerDependentFields = React.forwardRef(
  ({ mode, removeAllRows }, ref) => {
    const { setAccountID } = useContext(CustomerBranchDataContext)
    const [CustomerID, setCustomerID] = useState(0)

    const { data: customerSelectData } = useQuery({
      queryKey: [QUERY_KEYS.ALL_CUSTOMER_QUERY_KEY],
      queryFn: fetchAllOldCustomersForSelect,
      refetchOnWindowFocus: false,
      staleTime: 600000,
      refetchInterval: 600000,
    })

    const { data: CustomerAccounts } = useQuery({
      queryKey: [QUERY_KEYS.CUSTOMER_ACCOUNTS_QUERY_KEY, CustomerID],
      queryFn: () => fetchAllCustomerAccountsForSelect(CustomerID),
      refetchOnWindowFocus: false,
      staleTime: 600000,
      refetchInterval: 600000,
    })

    React.useImperativeHandle(ref, () => ({
      setCustomerID,
    }))

    const method = useFormContext()

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
                setCustomerID(e.value)
                removeAllRows()
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
                setAccountID(e.value)
                removeAllRows()
              }}
              focusOptions={() => method.setFocus("CustomerInvoiceMode")}
            />
          </div>
        </Form.Group>
      </>
    )
  }
)

function BusinessUnitDependantFields({ mode }) {
  const [BusinesssUnitID, setBusinessUnitID] = useState(0)

  const { data: BusinessUnitSelectData } = useQuery({
    queryKey: [QUERY_KEYS.BUSINESS_UNIT_QUERY_KEY],
    queryFn: fetchAllBusinessUnitsForSelect,
    enabled: mode !== "",
    refetchOnWindowFocus: false,
    staleTime: 600000,
    refetchInterval: 600000,
  })

  useEffect(() => {
    if (BusinessUnitSelectData?.length > 0) {
      method.setValue(
        "BusinessUnitID",
        BusinessUnitSelectData[0].BusinessUnitID
      )
      setBusinessUnitID(BusinessUnitSelectData[0].BusinessUnitID)
    }
  }, [BusinessUnitSelectData])

  useEffect(() => {
    async function fetchCustomerInvoiceNo() {
      const data = await fetchMonthlyMaxCustomerInvoiceNo(BusinesssUnitID)
      method.setValue("BusinessUnitID", BusinesssUnitID)
      method.setValue("VoucherNo", data[0]?.InvoiceNo)
      method.setValue("SessionBasedVoucherNo", data[0]?.SessionBasedVoucherNo)
    }

    if (BusinesssUnitID !== 0 && mode === "new") {
      fetchCustomerInvoiceNo()
    }
  }, [BusinesssUnitID, mode])

  const method = useFormContext()

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
              setBusinessUnitID(e.value)
            }}
          />
        </div>
      </Form.Group>
      <Form.Group as={Col} className="col-2">
        <Form.Label>Customer Invoice No(Monthly)</Form.Label>

        <div>
          <TextInput
            control={method.control}
            ID={"VoucherNo"}
            isEnable={false}
          />
        </div>
      </Form.Group>
      <Form.Group as={Col} className="col-2">
        <Form.Label>Customer Invoice No(Yearly)</Form.Label>

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
  )
}

// New Detail Header Form
function CustomerInvoiceDetailHeaderForm({ appendSingleRow }) {
  const invoiceTypeRef = useRef()
  const { pageTitles } = useContext(AppConfigurationContext)

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
  })

  function onSubmit(data) {
    appendSingleRow(data)
    method.reset()
  }

  const typesOptions = [
    { label: `${pageTitles?.product || "Product"}`, value: "Product" },
    { label: "Service", value: "Service" },
  ]

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
                  invoiceTypeRef.current?.setInvoiceType(e.value)
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
            <BranchSelectField />
          </FormProvider>
          <Form.Group as={Col} className="col-1">
            <Form.Label>Qty</Form.Label>
            <NumberInput
              id={"Qty"}
              control={method.control}
              onChange={(e) => {
                const rate = method.getValues(["Rate"])
                method.setValue("Amount", e.value * rate)
                const amount = method.getValues(["Amount"])
                const discount = method.getValues(["Discount"])
                method.setValue("NetAmount", amount - discount)
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
                const qty = method.getValues(["Qty"])
                method.setValue("Amount", e.value * qty)
                const disc = method.getValues(["Discount"])
                method.setValue("NetAmount", e.value * qty - disc)
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
                const amount = method.getValues(["Amount"])
                method.setValue("NetAmount", amount - e.value)
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
            {/* <Form.Control
              as={"textarea"}
              rows={1}
              className="form-control"
              style={{
                padding: "0.3rem 0.4rem",
                fontSize: "0.8em",
              }}
              {...method.register("DetailDescription")}
            /> */}
            <TextAreaField control={method.control} name={"Description"} />
          </Form.Group>
          <Form.Group as={Col} className="col-1">
            <Form.Label>Is Free</Form.Label>
            <div>
              <CSwitchInput
                control={method.control}
                name={"IsFree"}
                onChange={(e) => {
                  if (e.value) {
                    method.setValue("Rate", 0)
                    method.setValue("Amount", 0)
                    method.setValue("Discount", 0)
                    method.setValue("NetAmount", 0)
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
  )
}

const DetailHeaderBusinessUnitDependents = React.forwardRef((props, ref) => {
  const [InvoiceType, setInvoiceType] = useState()
  const [BusinessUnitID, setBusinessUnitID] = useState(0)

  const { pageTitles } = useContext(AppConfigurationContext)

  const { data: BusinessUnitSelectData } = useQuery({
    queryKey: [SELECT_QUERY_KEYS.BUSINESS_UNIT_SELECT_QUERY_KEY],
    queryFn: fetchAllBusinessUnitsForSelect,
    refetchOnWindowFocus: false,
    staleTime: 600000,
    refetchInterval: 600000,
  })
  const { data: ProductsInfoSelectData } = useQuery({
    queryKey: [
      SELECT_QUERY_KEYS.PRODUCTS_INFO_SELECT_QUERY_KEY,
      BusinessUnitID,
    ],
    queryFn: () => fetchAllProductsForSelect(BusinessUnitID),
    refetchOnWindowFocus: false,
    staleTime: 600000,
    refetchInterval: 600000,
  })
  const { data: ServicesInfoSelectData } = useQuery({
    queryKey: [SELECT_QUERY_KEYS.SERVICES_SELECT_QUERY_KEY, BusinessUnitID],
    queryFn: () => fetchAllServicesForSelect(BusinessUnitID),
    refetchOnWindowFocus: false,
    staleTime: 600000,
    refetchInterval: 600000,
  })

  React.useImperativeHandle(ref, () => ({
    setInvoiceType,
  }))

  const method = useFormContext()

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
              setBusinessUnitID(e.value)
              method.resetField("ProductInfoID")
              method.resetField("ServiceInfoID")
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
      </Form.Group>
    </>
  )
})

const CustomerInvoiceDetailTable = React.forwardRef(
  ({ mode, BusinessUnitSelectData }, ref) => {
    const method = useFormContext()

    const { fields, append, remove } = useFieldArray({
      control: method.control,
      name: "CustomerInvoiceDetail",
      rules: {
        required: true,
      },
    })

    React.useImperativeHandle(ref, () => ({
      appendSingleRow(data) {
        append(data)
      },
      removeAllRows() {
        remove()
      },
    }))

    const { pageTitles } = useContext(AppConfigurationContext)

    const typesOptions = [
      { label: `${pageTitles?.product || "Product"}`, value: "Product" },
      { label: "Service", value: "Service" },
    ]

    return (
      <>
        <Table
          responsive
          className="table  table-responsive mt-2"
          style={{ width: "1500px" }}
        >
          <thead>
            <DetailTableHeadings pageTitles={pageTitles} />
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
                )
              })}
            </FormProvider>
          </tbody>
        </Table>
      </>
    )
  }
)

function CustomerInvoiceDetailTableRow({
  item,
  index,
  disable = false,
  BusinessUnitSelectData,
  remove,
  typesOptions,
  pageTitles,
}) {
  const method = useFormContext()

  return (
    <FormProvider {...method}>
      <CustomerInvoiceDetailTableRowComponent
        index={index}
        item={item}
        BusinessUnitSelectData={BusinessUnitSelectData}
        typesOptions={typesOptions}
        disable={disable}
        pageTitles={pageTitles}
        remove={remove}
      />
    </FormProvider>
  )
}

// Total
function CustomerInvoiceDetailTotal() {
  const method = useFormContext()

  const details = useWatch({
    control: method.control,
    name: "CustomerInvoiceDetail",
  })

  useEffect(() => {
    calculateTotal(details)
  }, [details])

  function calculateTotal(details) {
    let rateSum = 0
    let cgsSum = 0
    let discountSum = 0
    let amountSum = 0

    details.forEach((item, index) => {
      const rate = parseFloat(item.Rate || 0)
      const cgs = parseFloat(item.CGS || 0)
      const discount = parseFloat(item.Discount || 0)
      const amount = parseFloat(item.NetAmount || 0)
      const qty = parseFloat(item.Qty || 0)

      rateSum += rate * qty
      cgsSum += cgs
      discountSum += discount
      amountSum += amount
    })
    method.setValue("TotalNetAmount", amountSum)
    method.setValue("TotalDiscount", discountSum)
    method.setValue("TotalAmount", cgsSum)
    method.setValue("TotalRate", rateSum)
  }

  return null
}

const BranchSelectField = () => {
  const { AccountID } = useContext(CustomerBranchDataContext)

  const method = useFormContext()
  const { pageTitles } = useContext(AppConfigurationContext)

  const { data } = useQuery({
    queryKey: [SELECT_QUERY_KEYS.CUSTOMER_BRANCHES_SELECT_QUERY_KEY, AccountID],
    queryFn: () => fetchAllCustomerBranchesData(AccountID),
    enabled: AccountID !== 0,
    initialData: [],
    refetchOnWindowFocus: false,
  })

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
  )
}
export const CustomerBranchDataContext = createContext()

const CustomerBranchDataProvider = ({ children }) => {
  const [AccountID, setAccountID] = useState(0)

  return (
    <CustomerBranchDataContext.Provider value={{ setAccountID, AccountID }}>
      {children}
    </CustomerBranchDataContext.Provider>
  )
}

const NullBranchContext = React.forwardRef((_, ref) => {
  const { setAccountID } = useContext(CustomerBranchDataContext)
  React.useImperativeHandle(ref, () => ({
    setAccountID,
  }))

  return null
})

const DetailTableHeadings = ({ pageTitles }) => {
  return (
    <tr>
      <th className="p-2 text-white" style={{ background: onlineDetailColor }}>
        Sr No.
      </th>
      <th className="p-2 text-white" style={{ background: onlineDetailColor }}>
        Is Free
      </th>
      <th
        className="p-2 text-white"
        style={{ background: onlineDetailColor, width: "300px" }}
      >
        Invoice Type
      </th>

      <th className="p-2 text-white" style={{ background: onlineDetailColor }}>
        {pageTitles?.branch || "Customer Branch"}
      </th>
      <th className="p-2 text-white" style={{ background: onlineDetailColor }}>
        Business Unit
      </th>
      <th className="p-2 text-white" style={{ background: onlineDetailColor }}>
        {pageTitles?.product || "Product"}
      </th>
      <th className="p-2 text-white" style={{ background: onlineDetailColor }}>
        Service
      </th>
      <th className="p-2 text-white" style={{ background: onlineDetailColor }}>
        Qty
      </th>
      <th className="p-2  text-white" style={{ background: onlineDetailColor }}>
        Rate
      </th>
      <th className="p-2  text-white" style={{ background: onlineDetailColor }}>
        CGS
      </th>
      <th className="p-2  text-white" style={{ background: onlineDetailColor }}>
        Amount
      </th>
      <th className="p-2  text-white" style={{ background: onlineDetailColor }}>
        Discount
      </th>
      <th className="p-2  text-white" style={{ background: onlineDetailColor }}>
        Net Amount
      </th>
      <th className="p-2  text-white" style={{ background: onlineDetailColor }}>
        Description
      </th>

      <th className="p-2  text-white" style={{ background: onlineDetailColor }}>
        Actions
      </th>
    </tr>
  )
}
