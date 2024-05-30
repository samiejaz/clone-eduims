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
import React, { useEffect, useRef, useState } from "react"

import { useUserData } from "../../context/AuthContext"
import { useNavigate, useParams } from "react-router-dom"

import TextInput from "../../components/Forms/TextInput"
import { TextAreaField } from "../../components/Forms/form"

import NumberInput from "../../components/Forms/NumberInput"
import DetailHeaderActionButtons from "../../components/DetailHeaderActionButtons"
import CDropdown from "../../components/Forms/CDropdown"
import { DevTool } from "@hookform/devtools"
import {
  addNewDebitNote,
  fetchAllDebitNotees,
  fetchMonthlyMaxDebitNoteNo,
  fetchDebitNoteById,
  deleteDebitNoteByID,
} from "../../api/DebitNoteData"
import ButtonToolBar from "../../components/ActionsToolbar"
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
import { encryptID } from "../../utils/crypto"
import { FormRightsWrapper } from "../../components/Wrappers/wrappers"
import {
  FormColumn,
  FormRow,
  FormLabel,
} from "../../components/Layout/LayoutComponents"
import { Table } from "react-bootstrap"
import { DetailPageTilteAndActionsComponent } from "../../components"

let parentRoute = ROUTE_URLS.ACCOUNTS.DEBIT_NODE_ROUTE
let editRoute = `${parentRoute}/edit/`
let newRoute = `${parentRoute}/new`
let cashDetailColor = "#22C55E"
let queryKey = QUERY_KEYS.DEBIT_NODE_QUERY_KEY
let viewRoute = `${parentRoute}/`
let IDENTITY = "DebitNoteID"
let MENU_KEY = MENU_KEYS.ACCOUNTS.DEBIT_NOTE_FORM_KEY

export default function BankAccountOpening() {
  return (
    <FormRightsWrapper
      FormComponent={DebitNoteEntryForm}
      DetailComponent={DebitNoteEntrySearch}
      menuKey={MENU_KEY}
      identity={IDENTITY}
    />
  )
}
function DebitNoteEntrySearch({ userRights }) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { showDeleteDialog, showEditDialog } = useConfirmationModal({
    handleDelete,
    handleEdit,
  })

  const [filters, setFilters] = useState({
    VoucherNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
    CustomerName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    AccountTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
    DebitNoteMode: { value: null, matchMode: FilterMatchMode.CONTAINS },
    TotalNetAmount: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })

  const user = useUserData()

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchAllDebitNotees(user.userID),
    initialData: [],
  })

  const deleteMutation = useMutation({
    mutationFn: deleteDebitNoteByID,
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
    deleteMutation.mutate({ DebitNoteID: id, LoginUserID: user.userID })
  }

  function handleEdit(id) {
    navigate(editRoute + id)
  }

  function handleView(id) {
    navigate(parentRoute + "/" + id)
  }

  const onRowClick = (e) => {
    navigate(viewRoute + encryptID(e?.data?.DebitNoteID))
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
            title="Debit Notes"
            onAddNewClick={() => navigate(newRoute)}
            showAddNewButton={userRights[0]?.RoleNew}
            buttonLabel="Create New Debit Note"
          />
          <DataTable
            showGridlines
            value={data}
            dataKey="DebitNoteID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage="No Debit Notes found!"
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
                  ID: encryptID(rowData.DebitNoteID),
                  handleDelete: () =>
                    showDeleteDialog(encryptID(rowData.DebitNoteID)),
                  handleEdit: () =>
                    showEditDialog(encryptID(rowData.DebitNoteID)),
                  handleView: handleView,
                  showEditButton: userRights[0]?.RoleEdit,
                  showDeleteButton: userRights[0]?.RoleDelete,
                  viewBtnRoute: viewRoute + encryptID(rowData.DebitNoteID),
                })
              }
              header="Actions"
              resizeable={false}
              style={{ minWidth: "7rem", maxWidth: "7rem", width: "7rem" }}
            ></Column>
            <Column
              field="VoucherNo"
              filter
              filterPlaceholder="Search by voucher no"
              sortable
              header="Voucher No"
            ></Column>
            <Column field="VoucherDate" sortable header="Voucher Date"></Column>
            <Column
              field="TotalNetAmount"
              sortable
              header="Total Reciept Amount"
              filter
              filterPlaceholder="Search by DebitNote amount"
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
          </DataTable>
        </>
      )}
    </>
  )
}

const defaultValues = {
  VoucherDate: new Date(),
  Description: "",
  DebitNoteDetail: [],
}

function DebitNoteEntryForm({ mode, userRights }) {
  document.title = "Debit Note Entry"
  const queryClient = useQueryClient()
  const { DebitNoteID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const user = useUserData()
  // Ref
  const detailTableRef = useRef()
  const customerCompRef = useRef()
  // Form
  const method = useForm({
    defaultValues,
  })

  const { data: DebitNoteData } = useQuery({
    queryKey: [QUERY_KEYS.DEBIT_NODE_QUERY_KEY, +DebitNoteID],
    queryFn: () => fetchDebitNoteById(DebitNoteID, user.userID),
    enabled: DebitNoteID !== undefined,
    initialData: [],
  })

  const { data: BusinessUnitSelectData } = useQuery({
    queryKey: [QUERY_KEYS.BUSINESS_UNIT_QUERY_KEY],
    queryFn: fetchAllBusinessUnitsForSelect,
    initialData: [],
    enabled: mode !== "",
  })

  const DebitNoteMutation = useMutation({
    mutationFn: addNewDebitNote,
    onSuccess: ({ success, RecordID }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] })
        navigate(`${parentRoute}/${RecordID}`)
      }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteDebitNoteByID,
    onSuccess: (success) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] })
      }
    },
  })
  useEffect(() => {
    if (DebitNoteID !== undefined && DebitNoteData?.Master?.length > 0) {
      // Setting Values
      method.setValue("SessionID", DebitNoteData?.Master[0]?.SessionID)
      method.setValue(
        "BusinessUnitID",
        DebitNoteData?.Master[0]?.BusinessUnitID
      )
      method.setValue("Customer", DebitNoteData?.Master[0]?.CustomerID)

      customerCompRef.current.setCustomerID(
        DebitNoteData?.Master[0]?.CustomerID
      )

      method.setValue("CustomerLedgers", DebitNoteData?.Master[0]?.AccountID)
      method.setValue("DocumentNo", DebitNoteData?.Master[0]?.DocumentNo)
      method.setValue("VoucherNo", DebitNoteData?.Master[0]?.VoucherNo)
      method.setValue(
        "SessionBasedVoucherNo",
        DebitNoteData?.Master[0]?.SessionBasedVoucherNo
      )
      method.setValue(
        "SessionBasedVoucherNo",
        DebitNoteData?.Master[0]?.SessionBasedVoucherNo
      )
      method.setValue("DebitNoteMode", DebitNoteData?.Master[0]?.DebitNoteMode)
      method.setValue("Description", DebitNoteData?.Master[0]?.Description)
      method.setValue(
        "VoucherDate",
        new Date(DebitNoteData?.Master[0]?.VoucherDate)
      )
      method.setValue(
        "DebitNoteDetail",
        DebitNoteData.Detail?.map((item) => {
          return {
            BusinessUnitID: item.DetailBusinessUnitID,
            Amount: item.Amount,
            Description: item.DetailDescription,
            Balance: item.Balance,
          }
        })
      )
    }
  }, [DebitNoteID, DebitNoteData])

  function handleEdit() {
    navigate(`${editRoute}${DebitNoteID}`)
  }

  function handleAddNew() {
    method.reset()
    navigate(newRoute)
  }

  function handleCancel() {
    if (mode === "new") {
      navigate(parentRoute)
    } else if (mode === "edit") {
      navigate(`${parentRoute}/${DebitNoteID}`)
    }
  }

  function handleDelete() {
    deleteMutation.mutate({
      DebitNoteID: DebitNoteID,
      LoginUserID: user.userID,
    })
    navigate(parentRoute)
  }

  function onSubmit(data) {
    DebitNoteMutation.mutate({
      formData: data,
      userID: user.userID,
      DebitNoteID: DebitNoteID,
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
              GoBackLabel="DebitNotes"
              saveLoading={DebitNoteMutation.isPending}
              handleDelete={handleDelete}
              showAddNewButton={userRights[0]?.RoleNew}
              showEditButton={userRights[0]?.RoleEdit}
              showDelete={userRights[0]?.RoleDelete}
            />
          </div>
          <form id="DebitNote" className="mt-4">
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
              </FormRow>
            </FormProvider>

            <FormRow>
              <FormColumn lg={12} xl={12}>
                <FormLabel>Description</FormLabel>
                <TextAreaField
                  control={method.control}
                  name={"Description"}
                  autoResize={false}
                  disabled={mode === "view"}
                />
              </FormColumn>
            </FormRow>
          </form>

          {mode !== "view" && (
            <>
              <div className="card p-2 bg-light mt-2 ">
                <DebitNoteDetailHeaderForm
                  appendSingleRow={detailTableRef.current?.appendSingleRow}
                />
              </div>
            </>
          )}

          <FormProvider {...method}>
            <DebitNoteDetailTable
              mode={mode}
              BusinessUnitSelectData={BusinessUnitSelectData}
              ref={detailTableRef}
            />
          </FormProvider>
          <hr />
          <FormProvider {...method}>
            <DebitNoteDetailTotal />
          </FormProvider>
          <FormColumn style={{ marginBottom: "1rem" }}>
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
        <FormLabel style={{ fontSize: "14px", fontWeight: "bold" }}>
          Session
          <span className="text-danger fw-bold ">*</span>
        </FormLabel>
        <div>
          <CDropdown
            control={method.control}
            name={`SessionID`}
            filter={false}
            optionLabel="SessionTitle"
            optionValue="SessionID"
            placeholder="Select a session"
            options={data}
            required={true}
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
        <FormColumn lg={6} xl={6} md={6}>
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
        <FormColumn lg={6} xl={6} md={6}>
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
              focusOptions={() => method.setFocus("Description")}
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
    async function fetchDebitNoteNo() {
      const data = await fetchMonthlyMaxDebitNoteNo(BusinesssUnitID)
      method.setValue("BusinessUnitID", BusinesssUnitID)
      method.setValue("VoucherNo", data.data[0]?.VoucherNo)
      method.setValue(
        "SessionBasedVoucherNo",
        data.data[0]?.SessionBasedVoucherNo
      )
    }

    if (BusinesssUnitID !== 0 && mode === "new") {
      fetchDebitNoteNo()
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
            focusOptions={() => method.setFocus("DocumentNo")}
            onChange={(e) => {
              setBusinessUnitID(e.value)
            }}
          />
        </div>
      </FormColumn>
      <FormColumn lg={2} xl={2} md={6}>
        <FormLabel>Debit Note No(Monthly)</FormLabel>

        <div>
          <TextInput
            control={method.control}
            ID={"VoucherNo"}
            isEnable={false}
          />
        </div>
      </FormColumn>
      <FormColumn lg={2} xl={2} md={6}>
        <FormLabel>Debit Note No(Yearly)</FormLabel>

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

// New Detail Header Form
function DebitNoteDetailHeaderForm({ appendSingleRow }) {
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
          <FormColumn lg={9} xl={9}>
            <FormLabel>Description</FormLabel>
            <TextAreaField
              control={method.control}
              name={"Description"}
              autoResize={true}
            />
          </FormColumn>
          <FormColumn lg={3} xl={3} md={6}>
            <FormLabel></FormLabel>
            <DetailHeaderActionButtons
              handleAdd={() => method.handleSubmit(onSubmit)()}
              handleClear={() => method.reset()}
            />
          </FormColumn>
        </FormRow>
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
            focusOptions={() => method.setFocus("Amount")}
          />
        </div>
      </FormColumn>
      <FormColumn lg={3} xl={3} md={6}>
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
      <FormColumn lg={3} xl={3} md={6}>
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

const DebitNoteDetailTable = React.forwardRef(
  ({ mode, BusinessUnitSelectData }, ref) => {
    const method = useFormContext()

    const { fields, append, remove } = useFieldArray({
      control: method.control,
      name: "DebitNoteDetail",
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
                style={{ width: "2%", background: cashDetailColor }}
              >
                Sr No.
              </th>
              <th
                className="p-2 text-white text-center "
                style={{ width: "5%", background: cashDetailColor }}
              >
                Business Unit
              </th>

              <th
                className="p-2 text-white text-center "
                style={{ width: "4%", background: cashDetailColor }}
              >
                Balance
              </th>

              <th
                className="p-2 text-white text-center "
                style={{ width: "4%", background: cashDetailColor }}
              >
                Amount
              </th>

              <th
                className="p-2 text-white text-center "
                style={{ width: "10%", background: cashDetailColor }}
              >
                Description
              </th>
              <th
                className="p-2 text-white text-center "
                style={{ width: "4%", background: cashDetailColor }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <FormProvider {...method}>
              {fields.map((item, index) => {
                return (
                  <DebitNoteDetailTableRow
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

function DebitNoteDetailTableRow({
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
            name={`DebitNoteDetail.${index}.BusinessUnitID`}
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
            name={`DebitNoteDetail.${index}.Balance`}
            control={method.control}
            enterKeyOptions={() =>
              method.setFocus(`DebitNoteDetail.${index}.Amount`)
            }
            disabled={true}
          />
        </td>
        <td>
          <CNumberInput
            name={`DebitNoteDetail.${index}.Amount`}
            control={method.control}
            enterKeyOptions={() =>
              method.setFocus(`DebitNoteDetail.${index}.Description`)
            }
            required={true}
            disabled={disable}
          />
        </td>

        <td>
          <TextAreaField
            control={method.control}
            name={`DebitNoteDetail.${index}.Description`}
            autoResize={false}
            disabled={disable}
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
function DebitNoteDetailTotal() {
  const method = useFormContext()

  const details = useWatch({
    control: method.control,
    name: "DebitNoteDetail",
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
