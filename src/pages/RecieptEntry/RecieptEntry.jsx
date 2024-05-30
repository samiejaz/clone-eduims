import { DataTable } from "primereact/datatable"
import { Button } from "primereact/button"
import { Column } from "primereact/column"
import {
  useForm,
  useFieldArray,
  useFormContext,
  FormProvider,
  useWatch,
} from "react-hook-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import ActionButtons from "../../components/ActionButtons"
import { FilterMatchMode } from "primereact/api"
import React, { useContext, useEffect, useRef, useState } from "react"

import { AuthContext } from "../../context/AuthContext"
import { useNavigate, useParams } from "react-router-dom"

import TextInput from "../../components/Forms/TextInput"
import NumberInput from "../../components/Forms/NumberInput"
import { TextAreaField } from "../../components/Forms/form"

import DetailHeaderActionButtons from "../../components/DetailHeaderActionButtons"
import CDropdown from "../../components/Forms/CDropdown"
import { DevTool } from "@hookform/devtools"
import {
  addNewReceiptVoucher,
  deleteReceiptVoucherByID,
  fetchAllReceiptVoucheres,
  fetchMonthlyMaxReceiptNo,
  fetchReceiptVoucherById,
} from "../../api/ReceiptVoucherData"
import ButtonToolBar from "../../components/ActionsToolbar"

import { Tag } from "primereact/tag"
import {
  MENU_KEYS,
  QUERY_KEYS,
  ROUTE_URLS,
  SELECT_QUERY_KEYS,
} from "../../utils/enums"
import {
  fetchAllBankAccountsForSelect,
  fetchAllBusinessUnitsForSelect,
  fetchAllCustomerAccountsForSelect,
  fetchAllOldCustomersForSelect,
  fetchAllSessionsForSelect,
} from "../../api/SelectData"
import CDatePicker from "../../components/Forms/CDatePicker"
import CNumberInput from "../../components/Forms/CNumberInput"
import { CustomSpinner } from "../../components/CustomSpinner"
import useConfirmationModal from "../../hooks/useConfirmationModalHook"

import { decryptID, encryptID } from "../../utils/crypto"
import { Dropdown } from "primereact/dropdown"
import { usePrintReportAsPDF } from "../../hooks/CommonHooks/commonhooks"

import { FormRightsWrapper } from "../../components/Wrappers/wrappers"
import {
  FormColumn,
  FormLabel,
  FormRow,
} from "../../components/Layout/LayoutComponents"
import { Table } from "react-bootstrap"
import { DetailPageTilteAndActionsComponent } from "../../components"

const receiptModeOptions = [
  { label: "Cash", value: "Cash" },
  { label: "Online Transfer", value: "Online" },
  { label: "Instrument", value: "Instrument" },
]

const instrumentTypeOptions = [
  { value: "Cheque", label: "Cheque" },
  { value: "DD", label: "DD" },
]

let parentRoute = ROUTE_URLS.ACCOUNTS.RECIEPT_VOUCHER_ROUTE
let editRoute = `${parentRoute}/edit/`
let newRoute = `${parentRoute}/new`
let viewRoute = `${parentRoute}/`
let cashDetailColor = "#22C55E"
let onlineDetailColor = "#F59E0B"
let chequeDetailColor = "#3B82F6"
let ddDetailColor = "#8f48d2"
let queryKey = QUERY_KEYS.RECEIPT_VOUCHER_INFO_QUERY_KEY

let IDENTITY = "ReceiptVoucherID"
let MENU_KEY = MENU_KEYS.ACCOUNTS.RECIEPT_VOUCHER_FORM_KEY

export default function RecieptVouchers() {
  return (
    <FormRightsWrapper
      FormComponent={FormComponent}
      DetailComponent={DetailComponent}
      menuKey={MENU_KEY}
      identity={IDENTITY}
    />
  )
}

function DetailComponent({ userRights }) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { showDeleteDialog, showEditDialog } = useConfirmationModal({
    handleDelete,
    handleEdit,
  })

  const { handlePrintReport } = usePrintReportAsPDF()

  const [filters, setFilters] = useState({
    BusinessUnitName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    VoucherNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
    VoucherDate: { value: null, matchMode: FilterMatchMode.CONTAINS },
    CustomerName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    AccountTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ReceiptMode: { value: null, matchMode: FilterMatchMode.EQUALS },
    TotalNetAmount: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })

  const { user } = useContext(AuthContext)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchAllReceiptVoucheres(user.userID),
    initialData: [],
  })

  const deleteMutation = useMutation({
    mutationFn: deleteReceiptVoucherByID,
    onSuccess: (success) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] })
      }
    },
  })

  if (isLoading) {
    return <h1>Loading...</h1>
  }

  function handleDelete(id) {
    deleteMutation.mutate({ ReceiptVoucherID: id, LoginUserID: user.userID })
  }

  function handleEdit(id) {
    navigate(editRoute + id)
  }

  function handleView(id) {
    navigate(parentRoute + "/" + id)
  }

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.ReceiptMode}
        style={{ background: getSeverity(rowData.ReceiptMode) }}
      />
    )
  }
  const statusItemTemplate = (option) => {
    return <Tag value={option} style={{ background: getSeverity(option) }} />
  }

  const [statuses] = useState(["Cash", "Online", "Instrument", "Cheque", "DD"])

  const statusRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={statusItemTemplate}
        placeholder="Select One"
        className="p-column-filter"
        showClear
        style={{ minWidth: "12rem" }}
      />
    )
  }

  const getSeverity = (status) => {
    switch (status) {
      case "Online":
        return "#F9A972"
      case "Cash":
        return "#10B981"
      case "Instrument":
        return "#3B82F6"
      case "DD":
        return "danger"
      default:
        return "#10B981"
    }
  }

  const onRowClick = (e) => {
    navigate(viewRoute + encryptID(e?.data?.ReceiptVoucherID))
  }

  return (
    <>
      {isLoading || isFetching ? (
        <>
          <CustomSpinner />
        </>
      ) : (
        <>
          <DetailPageTilteAndActionsComponent
            title="Receipt Vouchers"
            onAddNewClick={() => navigate(newRoute)}
            showAddNewButton={userRights[0]?.RoleNew}
            buttonLabel="Create New Receipt"
          />
          <DataTable
            showGridlines
            value={data}
            dataKey="ReceiptVoucherID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage="No receipts found!"
            filters={filters}
            filterDisplay="row"
            resizableColumns
            size="small"
            selectionMode="single"
            className={"thead"}
            tableStyle={{ minWidth: "50rem" }}
            onRowClick={onRowClick}
          >
            <Column
              body={(rowData) =>
                ActionButtons({
                  ID: encryptID(rowData.ReceiptVoucherID),
                  handleDelete: () =>
                    showDeleteDialog(encryptID(rowData.ReceiptVoucherID)),
                  handleEdit: () =>
                    showEditDialog(encryptID(rowData.ReceiptVoucherID)),
                  handleView: handleView,
                  showEditButton: userRights[0]?.RoleEdit,
                  showDeleteButton: userRights[0]?.RoleDelete,
                  viewBtnRoute: viewRoute + encryptID(rowData.ReceiptVoucherID),
                  showPrintBtn: true,
                  handlePrint: () =>
                    handlePrintReport({
                      getPrintFromUrl:
                        "ReceiptVoucherPrint?ReceiptVoucherID=" +
                        rowData.ReceiptVoucherID,
                    }),
                })
              }
              header="Actions"
              resizeable={false}
              // style={{ minWidth: "7rem", maxWidth: "7rem", width: "7rem" }}
            ></Column>
            <Column
              field="VoucherNo"
              filter
              filterPlaceholder="Search by voucher no"
              sortable
              header="Voucher No"
            ></Column>
            <Column
              field="VoucherDate"
              filter
              filterPlaceholder="Search by voucher date"
              sortable
              header="Voucher Date"
            ></Column>
            <Column
              field="TotalNetAmount"
              sortable
              header="Total Reciept Amount"
              filter
              filterPlaceholder="Search by amount"
              style={{ maxWidth: "13rem" }}
            ></Column>

            <Column
              field="ReceiptMode"
              sortable
              header="Receipt Mode"
              showFilterMenu={false}
              filterMenuStyle={{ width: "4rem" }}
              body={statusBodyTemplate}
              filter
              filterElement={statusRowFilterTemplate}
            ></Column>

            <Column
              field="CustomerName"
              sortable
              header="Customer Name"
              filter
              filterPlaceholder="Search by Customer"
            ></Column>
            <Column
              field="AccountTitle"
              sortable
              header="Ledger"
              filter
              filterPlaceholder="Search by ledger"
            ></Column>

            <Column
              field="BusinessUnitName"
              filter
              filterPlaceholder="Search by business unit"
              sortable
              header="Business Unit"
            ></Column>
          </DataTable>
        </>
      )}
    </>
  )
}

const defaultValues = {
  SessionID: "",
  BusinessUnitID: "",
  Customer: "",
  CustomerLedgers: "",
  DocumentNo: "",
  VoucherNo: "",
  SessionBasedVoucherNo: "",
  ReceiptMode: "",
  Description: "",
  FromBank: "",
  TransactionID: "",
  ReceivedInBankID: "",
  InstrumentDate: new Date(),
  VoucherDate: new Date(),
  receiptDetail: [],
}

function FormComponent({ mode, userRights }) {
  document.title = "Receipt Voucher Entry"
  const queryClient = useQueryClient()
  const { ReceiptVoucherID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  // Ref
  const detailTableRef = useRef()
  const customerCompRef = useRef()
  const receiptModeRef = useRef()
  // Form
  const method = useForm({
    defaultValues: defaultValues,
  })

  const { data: ReceiptVoucherData } = useQuery({
    queryKey: [QUERY_KEYS.RECEIPT_VOUCHER_INFO_QUERY_KEY, +ReceiptVoucherID],
    queryFn: () => fetchReceiptVoucherById(ReceiptVoucherID, user.userID),
    enabled: mode !== "new",
    initialData: [],
    refetchOnWindowFocus: false,
  })

  const { data: BusinessUnitSelectData } = useQuery({
    queryKey: [QUERY_KEYS.BUSINESS_UNIT_QUERY_KEY],
    queryFn: fetchAllBusinessUnitsForSelect,
    initialData: [],
    enabled: mode !== "",
  })

  const receiptVoucherMutation = useMutation({
    mutationFn: addNewReceiptVoucher,
    onSuccess: ({ success, RecordID }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] })
        navigate(`${parentRoute}/${RecordID}`)
      }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteReceiptVoucherByID,
    onSuccess: (success) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] })
      }
    },
  })

  useEffect(() => {
    if (
      ReceiptVoucherID !== undefined &&
      ReceiptVoucherData?.Master?.length > 0
    ) {
      method.setValue("SessionID", ReceiptVoucherData?.Master[0]?.SessionID)
      method.setValue(
        "BusinessUnitID",
        ReceiptVoucherData?.Master[0]?.BusinessUnitID
      )
      method.setValue("Customer", ReceiptVoucherData?.Master[0]?.CustomerID)

      customerCompRef.current.setCustomerID(
        ReceiptVoucherData?.Master[0]?.CustomerID
      )

      method.setValue(
        "CustomerLedgers",
        ReceiptVoucherData?.Master[0]?.AccountID
      )
      method.setValue("DocumentNo", ReceiptVoucherData?.Master[0]?.DocumentNo)
      method.setValue("VoucherNo", ReceiptVoucherData?.Master[0]?.VoucherNo)
      method.setValue(
        "SessionBasedVoucherNo",
        ReceiptVoucherData?.Master[0]?.SessionBasedVoucherNo
      )
      method.setValue("ReceiptMode", ReceiptVoucherData?.Master[0]?.ReceiptMode)
      receiptModeRef.current?.setReceiptMode(
        ReceiptVoucherData?.Master[0]?.ReceiptMode === "Instrument"
          ? ReceiptVoucherData?.Master[0]?.InstrumentType
          : ReceiptVoucherData?.Master[0]?.ReceiptMode
      )
      method.setValue(
        "InstrumentType",
        ReceiptVoucherData?.Master[0]?.InstrumentType
      )
      method.setValue(
        "Description",
        ReceiptVoucherData?.Master[0]?.Description ?? undefined
      )
      method.setValue("FromBank", ReceiptVoucherData?.Master[0]?.FromBank)
      method.setValue(
        "TransactionID",
        ReceiptVoucherData?.Master[0]?.TransactionID === null
          ? ReceiptVoucherData?.Master[0]?.InstrumentNo
          : ReceiptVoucherData?.Master[0]?.TransactionID
      )
      method.setValue(
        "ReceivedInBankID",
        ReceiptVoucherData?.Master[0]?.ReceivedInBankID
      )
      method.setValue(
        "InstrumentDate",
        new Date(ReceiptVoucherData?.Master[0]?.InstrumentDate)
      )
      method.setValue(
        "VoucherDate",
        new Date(ReceiptVoucherData?.Master[0]?.VoucherDate)
      )

      method.setValue(
        "receiptDetail",
        ReceiptVoucherData.Detail?.map((item) => {
          return {
            BusinessUnitID: item.DetailBusinessUnitID,
            Amount: item.Amount,
            Description: item.DetailDescription,
            Balance: item.Balance,
          }
        })
      )
    }
  }, [ReceiptVoucherID, ReceiptVoucherData])

  function handleEdit() {
    navigate(`${editRoute}${ReceiptVoucherID}`)
  }

  function handleAddNew() {
    method.reset()
    navigate(newRoute)
  }

  function handleCancel() {
    if (mode === "new") {
      navigate(parentRoute)
    } else if (mode === "edit") {
      navigate(`${parentRoute}/${ReceiptVoucherID}`)
    }
  }

  function handleDelete() {
    deleteMutation.mutate({
      ReceiptVoucherID: ReceiptVoucherID,
      LoginUserID: user.userID,
    })
    navigate(parentRoute)
  }

  function onSubmit(data) {
    receiptVoucherMutation.mutate({
      formData: data,
      userID: user.userID,
      ReceiptVoucherID: ReceiptVoucherID,
    })
  }

  return (
    <>
      {isLoading ? (
        <>
          <CustomSpinner />
        </>
      ) : (
        <>
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
              GoBackLabel="Receipts"
              saveLoading={receiptVoucherMutation.isPending}
              handleDelete={handleDelete}
              showPrint={userRights[0]?.RolePrint}
              showAddNewButton={userRights[0]?.RoleNew}
              showEditButton={userRights[0]?.RoleEdit}
              showDelete={userRights[0]?.RoleDelete}
              getPrintFromUrl={
                "ReceiptVoucherPrint?ReceiptVoucherID=" +
                decryptID(ReceiptVoucherID)
              }
            />
          </div>
          <form id="receiptVoucher" className="mt-4">
            <FormProvider {...method}>
              <FormRow>
                <SessionSelect mode={mode} />
                <BusinessUnitDependantFields mode={mode} />
                <FormColumn lg={2} xl={2} md={6}>
                  <FormLabel>Date</FormLabel>
                  <div>
                    <CDatePicker
                      control={method.control}
                      name="VoucherDate"
                      disabled={mode === "view"}
                    />
                  </div>
                </FormColumn>
              </FormRow>
              <FormRow>
                <CustomerDependentFields
                  mode={mode}
                  removeAllRows={detailTableRef.current?.removeAllRows}
                  ref={customerCompRef}
                />
                <ReceiptModeDependantFields
                  mode={mode}
                  removeAllRows={detailTableRef.current?.removeAllRows}
                  ref={receiptModeRef}
                />
              </FormRow>
            </FormProvider>

            <FormRow>
              <FormColumn>
                <FormLabel>Description</FormLabel>
                <div>
                  <TextAreaField
                    control={method.control}
                    disabled={mode === "view"}
                    name={"Description"}
                  />
                </div>
              </FormColumn>
            </FormRow>
          </form>

          {mode !== "view" && (
            <>
              <div className="card p-2 bg-light mt-2 ">
                <ReceiptDetailHeaderForm
                  appendSingleRow={detailTableRef.current?.appendSingleRow}
                />
              </div>
            </>
          )}

          <FormProvider {...method}>
            <ReceiptDetailTable
              mode={mode}
              BusinessUnitSelectData={BusinessUnitSelectData}
              ref={detailTableRef}
            />
          </FormProvider>
          <hr />
          <FormProvider {...method}>
            <ReceiptDetailTotal />
          </FormProvider>
          <FormColumn lg={3} xl={3} md={6}>
            <FormLabel>Total</FormLabel>

            <div>
              <NumberInput
                control={method.control}
                id={"TotalNetAmount"}
                disabled={true}
              />
            </div>
          </FormColumn>
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
    initialData: [],
  })

  const method = useFormContext()

  useEffect(() => {
    if (data.length > 0 && mode === "new") {
      method.setValue("SessionID", data[0]?.SessionID)
    }
  }, [data, mode])

  return (
    <>
      <FormColumn lg={2} xl={2} md={6}>
        <FormLabel>
          Session
          <span className="text-danger fw-bold ">*</span>
        </FormLabel>
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
      </FormColumn>
    </>
  )
}

const CustomerDependentFields = React.forwardRef(
  ({ mode, removeAllRows }, ref) => {
    const [CustomerID, setCustomerID] = useState(0)

    React.useImperativeHandle(ref, () => ({
      setCustomerID,
    }))

    const { data: customerSelectData } = useQuery({
      queryKey: [QUERY_KEYS.ALL_CUSTOMER_QUERY_KEY],
      queryFn: fetchAllOldCustomersForSelect,
      initialData: [],
    })

    const { data: CustomerAccounts } = useQuery({
      queryKey: [QUERY_KEYS.CUSTOMER_ACCOUNTS_QUERY_KEY, CustomerID],
      queryFn: () => fetchAllCustomerAccountsForSelect(CustomerID),
      initialData: [],
    })

    const method = useFormContext()

    return (
      <>
        <FormColumn lg={3} xl={3} md={6}>
          <FormLabel>
            Customer Name
            <span className="text-danger fw-bold ">*</span>
          </FormLabel>

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
        </FormColumn>
        <FormColumn lg={3} xl={3} md={6}>
          <FormLabel>
            Customer Ledgers
            <span className="text-danger fw-bold ">*</span>
          </FormLabel>

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
              onChange={() => {
                removeAllRows()
              }}
              focusOptions={() => method.setFocus("ReceiptMode")}
            />
          </div>
        </FormColumn>
      </>
    )
  }
)

function BusinessUnitDependantFields({ mode }) {
  const [BusinesssUnitID, setBusinessUnitID] = useState(0)

  const { data: BusinessUnitSelectData } = useQuery({
    queryKey: [QUERY_KEYS.BUSINESS_UNIT_QUERY_KEY],
    queryFn: fetchAllBusinessUnitsForSelect,
    initialData: [],
    enabled: mode !== "",
  })
  useEffect(() => {
    if (BusinessUnitSelectData.length > 0) {
      method.setValue(
        "BusinessUnitID",
        BusinessUnitSelectData[0].BusinessUnitID
      )
      setBusinessUnitID(BusinessUnitSelectData[0].BusinessUnitID)
    }
  }, [BusinessUnitSelectData])

  useEffect(() => {
    async function fetchReceiptNo() {
      const data = await fetchMonthlyMaxReceiptNo(BusinesssUnitID)
      method.setValue("BusinessUnitID", BusinesssUnitID)
      method.setValue("VoucherNo", data.data[0]?.VoucherNo)
      method.setValue(
        "SessionBasedVoucherNo",
        data.data[0]?.SessionBasedVoucherNo
      )
    }

    if (BusinesssUnitID !== 0 && mode === "new") {
      fetchReceiptNo()
    }
  }, [BusinesssUnitID, mode])

  const method = useFormContext()

  return (
    <>
      <FormColumn lg={2} xl={2} md={6}>
        <FormLabel>
          Business Unit
          <span className="text-danger fw-bold ">*</span>
        </FormLabel>

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
      </FormColumn>
      <FormColumn lg={2} xl={2} md={6} className="col-sm-2">
        <FormLabel>Receipt No(Monthly)</FormLabel>

        <div>
          <TextInput
            control={method.control}
            ID={"VoucherNo"}
            isEnable={false}
          />
        </div>
      </FormColumn>
      <FormColumn lg={2} xl={2} md={6} className="col-sm-2">
        <FormLabel>Receipt No(Yearly)</FormLabel>

        <div>
          <TextInput
            control={method.control}
            ID={"SessionBasedVoucherNo"}
            isEnable={false}
          />
        </div>
      </FormColumn>
      <FormColumn lg={2} xl={2} md={6}>
        <FormLabel>Document No</FormLabel>

        <div>
          <TextInput
            control={method.control}
            ID={"DocumentNo"}
            isEnable={mode !== "view"}
          />
        </div>
      </FormColumn>
    </>
  )
}

const ReceiptModeDependantFields = React.forwardRef(
  ({ mode, removeAllRows }, ref) => {
    const [receiptMode, setReceiptMode] = useState("")

    React.useImperativeHandle(ref, () => ({
      setReceiptMode,
    }))

    const method = useFormContext()

    function ShowSection() {
      if (receiptMode === "Online") {
        return (
          <>
            <MasterBankFields mode={mode} col={4} />
          </>
        )
      } else if (receiptMode === "DD" || receiptMode === "Cheque") {
        return (
          <>
            <MasterBankFields
              mode={mode}
              FromBankTitle="Instrument Of"
              ReceivedInBankTitle="In Bank"
              TranstactionIDTitle="Instrument No"
              col={3}
            />
            <FormColumn lg={3} xl={3} md={6}>
              <FormLabel style={{ fontSize: "14px", fontWeight: "bold" }}>
                Instrument Date
              </FormLabel>
              <div>
                <CDatePicker
                  control={method.control}
                  name="InstrumentDate"
                  disabled={mode === "view"}
                />
              </div>
            </FormColumn>
          </>
        )
      }
    }

    function emptyAllFieldsOnReceiptModeChange() {
      method.resetField("FromBank")
      method.resetField("InstrumentDate")
      method.resetField("ReceivedInBankID")
      method.resetField("TransactionID")
    }

    return (
      <>
        <FormColumn className="col-xl-2 " lg={3} xl={3} md={6}>
          <FormLabel>
            Receipt Mode
            <span className="text-danger fw-bold ">*</span>
          </FormLabel>
          <div>
            <CDropdown
              control={method.control}
              options={receiptModeOptions}
              optionValue="value"
              optionLabel="label"
              name={`ReceiptMode`}
              placeholder="Select receipt mode"
              onChange={(e) => {
                setReceiptMode(e.value)
                method.setValue("InstrumentType", [])
                removeAllRows()
                emptyAllFieldsOnReceiptModeChange()
              }}
              showOnFocus={true}
              disabled={mode === "view"}
              focusOptions={(e) => {
                method.setFocus(
                  e.value === "Instrument" ? "InstrumentType" : "Description"
                )
              }}
            />
          </div>
        </FormColumn>

        <FormColumn className="col-xl-2 " lg={3} xl={3} md={6}>
          <FormLabel style={{ fontSize: "14px", fontWeight: "bold" }}>
            Instrument Type
          </FormLabel>
          <div>
            <CDropdown
              control={method.control}
              name={`InstrumentType`}
              placeholder="Select a type"
              options={instrumentTypeOptions}
              required={receiptMode === "Instrument"}
              disabled={
                mode === "view" ||
                receiptMode === "Cash" ||
                receiptMode === "Online"
              }
              focusOptions={() => method.setFocus("Description")}
              onChange={(e) => {
                setReceiptMode(e.value)
                removeAllRows()
                emptyAllFieldsOnReceiptModeChange()
              }}
            />
          </div>
        </FormColumn>

        <ShowSection />
      </>
    )
  }
)

const MasterBankFields = ({
  mode,
  FromBankTitle = "From Bank",
  ReceivedInBankTitle = "Receieved In Bank",
  TranstactionIDTitle = "TransactionID",
  col,
}) => {
  const { data } = useQuery({
    queryKey: [SELECT_QUERY_KEYS.BANKS_SELECT_QUERY_KEY],
    queryFn: fetchAllBankAccountsForSelect,
    initialData: [],
  })

  const method = useFormContext()

  return (
    <>
      <FormColumn lg={col} xl={col} md={6}>
        <FormLabel>{FromBankTitle}</FormLabel>
        <div>
          <TextInput
            ID={"FromBank"}
            control={method.control}
            required={true}
            focusOptions={() => method.setFocus("ReceivedInBankID")}
            isEnable={mode !== "view"}
          />
        </div>
      </FormColumn>
      <FormColumn lg={col} xl={col} md={6}>
        <FormLabel>{ReceivedInBankTitle}</FormLabel>
        <div>
          <CDropdown
            control={method.control}
            options={data}
            optionValue="BankAccountID"
            optionLabel="BankAccountTitle"
            name="ReceivedInBankID"
            placeholder="Select a bank"
            required={true}
            disabled={mode === "view"}
            focusOptions={() => method.setFocus("TransactionID")}
          />
        </div>
      </FormColumn>
      <FormColumn lg={col} xl={col} md={6}>
        <FormLabel>{TranstactionIDTitle}</FormLabel>
        <div>
          <TextInput
            control={method.control}
            ID={"TransactionID"}
            required={true}
            isEnable={mode !== "view"}
            focusOptions={() => method.setFocus("IntrumentDate")}
          />
        </div>
      </FormColumn>
    </>
  )
}

// New Detail Header Form
function ReceiptDetailHeaderForm({ appendSingleRow }) {
  const method = useForm({
    defaultValues: {
      BalanceAmount: "",
      Amount: 0,
      Description: "",
    },
  })

  function onSubmit(data) {
    appendSingleRow(data)
    method.reset()
  }

  return (
    <>
      <form>
        <FormRow>
          <FormProvider {...method}>
            <DetailHeaderBusinessUnitDependents />
          </FormProvider>
        </FormRow>
        <FormRow>
          <FormColumn lg={9} xl={9} md={6}>
            <FormLabel>Description</FormLabel>
            <div>
              <TextAreaField control={method.control} name={"Description"} />
            </div>
          </FormColumn>
          <FormColumn className="col-xl-3" lg={3} xl={3} md={6}>
            <FormLabel></FormLabel>
            <DetailHeaderActionButtons
              handleAdd={() => method.handleSubmit(onSubmit)()}
              handleClear={() => method.reset()}
            />
          </FormColumn>
        </FormRow>
        <DevTool control={method.control} />
      </form>
    </>
  )
}

function DetailHeaderBusinessUnitDependents() {
  const { data: BusinessUnitSelectData } = useQuery({
    queryKey: [QUERY_KEYS.BUSINESS_UNIT_QUERY_KEY],
    queryFn: fetchAllBusinessUnitsForSelect,
    initialData: [],
  })

  const method = useFormContext()

  return (
    <>
      <FormColumn lg={3} xl={3} md={6} className="col-3">
        <FormLabel>
          Business Unit
          <span className="text-danger fw-bold ">*</span>
        </FormLabel>

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
          />
        </div>
      </FormColumn>
      <FormColumn lg={3} xl={3} md={6} className="col-3">
        <FormLabel>
          Balance
          <span className="text-danger fw-bold ">*</span>
        </FormLabel>

        <div>
          <CNumberInput
            control={method.control}
            name="BalanceAmount"
            disabled={true}
          />
        </div>
      </FormColumn>
      <FormColumn lg={3} xl={3} md={6} className="col-3">
        <FormLabel>
          Amount
          <span className="text-danger fw-bold ">*</span>
        </FormLabel>

        <div>
          <NumberInput control={method.control} id={"Amount"} required={true} />
        </div>
      </FormColumn>
    </>
  )
}

const ReceiptDetailTable = React.forwardRef(
  ({ mode, BusinessUnitSelectData }, ref) => {
    const method = useFormContext()

    const { fields, append, remove } = useFieldArray({
      control: method.control,
      name: "receiptDetail",
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

    return (
      <>
        <Table responsive className="table table-responsive mt-2">
          <thead>
            <tr>
              <th
                className="p-2 text-white text-center "
                style={{
                  width: "2%",
                  background: chequeDetailColor,
                }}
              >
                Sr No.
              </th>
              <th
                className="p-2 text-white text-center "
                style={{ width: "5%", background: chequeDetailColor }}
              >
                Business Unit
              </th>

              <th
                className="p-2 text-white text-center "
                style={{ width: "4%", background: chequeDetailColor }}
              >
                Balance
              </th>

              <th
                className="p-2 text-white text-center "
                style={{ width: "4%", background: chequeDetailColor }}
              >
                Amount
              </th>

              <th
                className="p-2 text-white text-center "
                style={{ width: "10%", background: chequeDetailColor }}
              >
                Description
              </th>
              <th
                className="p-2 text-white text-center "
                style={{ width: "4%", background: chequeDetailColor }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <FormProvider {...method}>
              {fields.map((item, index) => {
                return (
                  <ReceiptDetailTableRow
                    key={item.id}
                    item={item}
                    index={index}
                    disable={mode === "view"}
                    BusinessUnitSelectData={BusinessUnitSelectData}
                    remove={remove}
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

function ReceiptDetailTableRow({
  item,
  index,
  BusinessUnitSelectData,
  remove,
  disable = false,
}) {
  const method = useFormContext()

  return (
    <>
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
          <CDropdown
            control={method.control}
            options={BusinessUnitSelectData}
            name={`receiptDetail.${index}.BusinessUnitID`}
            placeholder="Select a business unit"
            optionLabel="BusinessUnitName"
            optionValue="BusinessUnitID"
            required={true}
            showOnFocus={true}
            disabled={disable}
          />
        </td>

        <td>
          <CNumberInput
            name={`receiptDetail.${index}.Balance`}
            control={method.control}
            enterKeyOptions={() =>
              method.setFocus(`receiptDetail.${index}.Amount`)
            }
            disabled={true}
          />
        </td>
        <td>
          <CNumberInput
            name={`receiptDetail.${index}.Amount`}
            control={method.control}
            enterKeyOptions={() =>
              method.setFocus(`receiptDetail.${index}.Description`)
            }
            required={true}
            disabled={disable}
          />
        </td>

        <td>
          <TextAreaField
            disabled={disable}
            control={method.control}
            name={`receiptDetail.${index}.Description`}
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
    </>
  )
}

// Total
function ReceiptDetailTotal() {
  const method = useFormContext()

  const details = useWatch({
    control: method.control,
    name: "receiptDetail",
  })

  useEffect(() => {
    calculateTotal(details)
  }, [details])

  function calculateTotal(details) {
    let total = details?.reduce((accumulator, item) => {
      return accumulator + parseFloat(item.Amount)
    }, 0)
    method.setValue("TotalNetAmount", total)
  }

  return null
}
