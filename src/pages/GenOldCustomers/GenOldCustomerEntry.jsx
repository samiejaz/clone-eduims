import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Route, Routes, useNavigate, useParams } from "react-router-dom"
import { FilterMatchMode } from "primereact/api"
import { useEffect, useState } from "react"
import { CustomSpinner } from "../../components/CustomSpinner"
import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { MultiSelect } from "primereact/multiselect"
import ActionButtons from "../../components/ActionButtons"
import { Controller, useForm } from "react-hook-form"
import ButtonToolBar from "../../components/ActionsToolbar"
import TextInput from "../../components/Forms/TextInput"
import { useUserData } from "../../context/AuthContext"
import {
  addNewGenOldCustomer,
  deleteGenOldCustomerByID,
  fetchAllGenOldCustomers,
  fetchGenOldCustomerById,
} from "../../api/GenOldCustomerData"
import { ROUTE_URLS, QUERY_KEYS, MENU_KEYS } from "../../utils/enums"
import {
  useActivationClientsSelectData,
  useSoftwareClientsSelectData,
} from "../../hooks/SelectData/useSelectData"
import useConfirmationModal from "../../hooks/useConfirmationModalHook"
import { decryptID, encryptID } from "../../utils/crypto"
import {
  FormRow,
  FormColumn,
  FormLabel,
} from "../../components/Layout/LayoutComponents"
import { checkForUserRightsAsync } from "../../api/MenusData"
import AccessDeniedPage from "../../components/AccessDeniedPage"
import { DetailPageTilteAndActionsComponent } from "../../components"

let parentRoute = ROUTE_URLS.CUSTOMERS.OLD_CUSTOMER_ENTRY
let editRoute = `${parentRoute}/edit/`
let newRoute = `${parentRoute}/new`
let viewRoute = `${parentRoute}/`
let queryKey = QUERY_KEYS.OLD_CUSTOMERS_QUERY_KEY

export default function OldCustomers() {
  const [userRights, setUserRights] = useState([])

  const user = useUserData()

  const { data: rights } = useQuery({
    queryKey: ["formRights"],
    queryFn: () =>
      checkForUserRightsAsync({
        MenuKey: MENU_KEYS.USERS.OLD_CUSTOMERS_FORM_KEY,
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
    <>
      <Routes>
        {userRights.length > 0 && userRights[0].ShowForm ? (
          <>
            <Route
              index
              element={<GenOldCustomerDetail userRights={userRights} />}
            />
            <Route
              path={`:CustomerID`}
              element={
                <GenOldCustomerForm
                  key={"GenOldCustomerViewRoute"}
                  mode={"view"}
                  userRights={userRights}
                />
              }
            />
            <Route
              path={`edit/:CustomerID`}
              element={
                <>
                  {userRights[0].RoleEdit ? (
                    <>
                      <GenOldCustomerForm
                        key={"GenOldCustomerEditRoute"}
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
                        <GenOldCustomerForm
                          key={"GenOldCustomerNewRoute"}
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
    </>
  )
}

export function GenOldCustomerDetail({ userRights }) {
  document.title = "Old Customers"
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { showDeleteDialog, showEditDialog } = useConfirmationModal({
    handleDelete,
    handleEdit,
  })

  const [filters, setFilters] = useState({
    CustomerName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })

  const user = useUserData()

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchAllGenOldCustomers(user.userID),
    initialData: [],
  })

  const deleteMutation = useMutation({
    mutationFn: deleteGenOldCustomerByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
      navigate(parentRoute)
    },
  })

  function handleDelete(id) {
    deleteMutation.mutate({
      CustomerID: id,
      LoginUserID: user.userID,
    })
  }

  function handleEdit(id) {
    navigate(editRoute + id)
  }

  function handleView(id) {
    navigate(parentRoute + "/" + id)
  }

  const onRowClick = (e) => {
    navigate(viewRoute + encryptID(e?.data?.CustomerID))
  }

  return (
    <div className="mt-4">
      {isLoading || isFetching ? (
        <>
          <CustomSpinner />
        </>
      ) : (
        <>
          <DetailPageTilteAndActionsComponent
            title="Old Customers"
            onAddNewClick={() => navigate(newRoute)}
            showAddNewButton={userRights[0]?.RoleNew}
            buttonLabel="Add New"
          />
          <DataTable
            showGridlines
            value={data}
            dataKey="CustomerID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage="No customers found!"
            filters={filters}
            filterDisplay="row"
            resizableColumns
            size="small"
            className={"thead"}
            tableStyle={{ minWidth: "50rem" }}
            onRowClick={onRowClick}
          >
            <Column
              body={(rowData) =>
                ActionButtons({
                  ID: encryptID(rowData.CustomerID),
                  handleDelete: () =>
                    showDeleteDialog(encryptID(rowData.CustomerID)),
                  handleEdit: () =>
                    showEditDialog(encryptID(rowData.CustomerID)),
                  handleView: handleView,
                  showEditButton: userRights[0]?.RoleEdit,
                  showDeleteButton: false,
                  viewBtnRoute: viewRoute + encryptID(rowData.CustomerID),
                })
              }
              header="Actions"
              resizeable={false}
              style={{ minWidth: "7rem", maxWidth: "10rem", width: "7rem" }}
            ></Column>
            <Column
              field="CustomerName"
              filter
              filterPlaceholder="Search by Customer Name"
              sortable
              header="Customer Name"
            ></Column>
          </DataTable>
        </>
      )}
    </div>
  )
}
export function GenOldCustomerForm({ mode, userRights }) {
  document.title = "Old Customer Entry"
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const user = useUserData()
  const { CustomerID } = useParams()
  const { control, handleSubmit, setFocus, setValue, reset } = useForm({
    defaultValues: {
      CustomerName: "",
      SoftwareMgtDbID: null,
      ActivationDbID: null,
    },
  })

  const activationClients = useActivationClientsSelectData(
    CustomerID ? decryptID(CustomerID) : 0
  )
  const softwareClients = useSoftwareClientsSelectData(
    CustomerID ? decryptID(CustomerID) : 0
  )

  const GenOldCustomerData = useQuery({
    queryKey: [queryKey, CustomerID],
    queryFn: () => fetchGenOldCustomerById(CustomerID, user.userID),
    initialData: [],
  })

  useEffect(() => {
    if (CustomerID !== undefined && GenOldCustomerData.data?.data?.length > 0) {
      if (GenOldCustomerData?.data?.data[0]?.ActivationDbID !== 0) {
        setValue(
          "ActivationDbID",
          GenOldCustomerData?.data?.dataAct?.map((item) => item.ACTCustomerID)
        )
      }
      if (GenOldCustomerData?.data?.data[0]?.SoftwareMgtDbID !== 0) {
        setValue(
          "SoftwareMgtDbID",
          GenOldCustomerData?.data?.dataSoft?.map((item) => item.SoftCustomerID)
        )
      }
      setValue("CustomerName", GenOldCustomerData?.data?.data[0]?.CustomerName)
      setValue("InActive", GenOldCustomerData?.data?.data[0]?.InActive)
    }
  }, [CustomerID, GenOldCustomerData.data.data])

  const mutation = useMutation({
    mutationFn: addNewGenOldCustomer,
    onSuccess: ({ success, RecordID }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] })
        navigate(`${parentRoute}/${RecordID}`)
      }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteGenOldCustomerByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
      navigate(parentRoute)
    },
  })

  function handleDelete() {
    deleteMutation.mutate({
      CustomerID: CustomerID,
      LoginUserID: user.userID,
    })
  }

  function handleAddNew() {
    reset()
    navigate(newRoute)
  }
  function handleCancel() {
    if (mode === "new") {
      navigate(parentRoute)
    } else if (mode === "edit") {
      navigate(viewRoute + CustomerID)
    }
  }
  function handleEdit() {
    navigate(editRoute + CustomerID)
  }
  function onSubmit(data) {
    mutation.mutate({
      formData: data,
      userID: user.userID,
      CustomerID: CustomerID,
    })
  }

  return (
    <>
      {GenOldCustomerData.isLoading ? (
        <>
          <CustomSpinner />
        </>
      ) : (
        <>
          <div className="mt-4">
            <ButtonToolBar
              mode={mode}
              saveLoading={mutation.isPending}
              handleGoBack={() => navigate(parentRoute)}
              handleEdit={() => handleEdit()}
              handleCancel={() => {
                handleCancel()
              }}
              handleAddNew={() => {
                handleAddNew()
              }}
              handleDelete={handleDelete}
              handleSave={() => handleSubmit(onSubmit)()}
              GoBackLabel="Old Customers"
              showDelete={false}
              showAddNewButton={userRights[0]?.RoleNew}
              showEditButton={userRights[0]?.RoleEdit}
            />
          </div>
          <form className="mt-4">
            <FormRow>
              <FormColumn lg={6} xl={6} md={12}>
                <FormLabel>
                  Customer Name (Activation)
                  <span className="text-red-700 fw-bold ">*</span>
                </FormLabel>

                <div>
                  <Controller
                    name="ActivationDbID"
                    control={control}
                    render={({ field }) => (
                      <MultiSelect
                        value={field.value}
                        options={activationClients.data}
                        onChange={(e) => {
                          field.onChange(e.value)
                        }}
                        optionLabel="ACTCustomerName"
                        optionValue="ACTCustomerID"
                        placeholder="Select a customer"
                        className="w-full"
                        display="chip"
                        filter
                        showClear
                        defaultValue={null}
                        virtualScrollerOptions={{ itemSize: 43 }}
                        disabled={mode === "view"}
                        pt={{
                          label: {
                            className: "multi-select-value-container gap-2",
                            style: { padding: "0.475rem 0.75rem" },
                          },
                          headerCheckbox: {
                            root: {
                              style: { display: "none" },
                            },
                          },
                        }}
                      />
                    )}
                  />
                </div>
              </FormColumn>
              <FormColumn lg={6} xl={6} md={12}>
                <FormLabel>
                  Customer Name (Software Mgt.)
                  <span className="text-red-700 fw-bold ">*</span>
                </FormLabel>

                <div>
                  <Controller
                    name="SoftwareMgtDbID"
                    control={control}
                    render={({ field }) => (
                      <MultiSelect
                        value={field.value}
                        options={softwareClients.data}
                        onChange={(e) => field.onChange(e.value)}
                        optionLabel="SoftCustomerName"
                        optionValue="SoftCustomerID"
                        placeholder="Select a customer"
                        className="w-full"
                        display="chip"
                        filter
                        selectAll={false}
                        showClear
                        defaultValue={null}
                        virtualScrollerOptions={{ itemSize: 43 }}
                        disabled={mode === "view"}
                        pt={{
                          label: {
                            className: "multi-select-value-container gap-2",
                            style: { padding: "0.475rem 0.75rem" },
                          },
                          headerCheckbox: {
                            root: {
                              style: { display: "none" },
                            },
                          },
                        }}
                      />
                    )}
                  />
                </div>
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn lg={12} xl={12} md={12}>
                <FormLabel>Customer Name</FormLabel>
                <span className="text-red-700 fw-bold ">*</span>
                <div>
                  <TextInput
                    control={control}
                    ID={"CustomerName"}
                    required={true}
                    focusOptions={() => setFocus("BranchCode")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </FormColumn>
            </FormRow>
          </form>
        </>
      )}
    </>
  )
}
