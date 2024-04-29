import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { FilterMatchMode } from "primereact/api"
import { useContext, useEffect, useState } from "react"
import { CustomSpinner } from "../../components/CustomSpinner"
import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import ActionButtons from "../../components/ActionButtons"
import { useForm } from "react-hook-form"
import ButtonToolBar from "../../components/ActionsToolbar"
import TextInput from "../../components/Forms/TextInput"
import CheckBox from "../../components/Forms/CheckBox"
import { AuthContext, useUserData } from "../../context/AuthContext"
import {
  addNewTehsil,
  deleteTehsilByID,
  fetchAllTehsiles,
  fetchTehsilById,
} from "../../api/TehsilData"
import CDropdown from "../../components/Forms/CDropdown"
import { useAllCountiesSelectData } from "../../hooks/SelectData/useSelectData"
import { MENU_KEYS, QUERY_KEYS, ROUTE_URLS } from "../../utils/enums"
import {
  FormRow,
  FormColumn,
  FormLabel,
} from "../../components/Layout/LayoutComponents"
import useConfirmationModal from "../../hooks/useConfirmationModalHook"
import { encryptID } from "../../utils/crypto"
import { FormRightsWrapper } from "../../components/Wrappers/wrappers"
let parentRoute = ROUTE_URLS.TEHSIL_ROUTE
let editRoute = `${parentRoute}/edit/`
let newRoute = `${parentRoute}/new`
let viewRoute = `${parentRoute}/`
let queryKey = QUERY_KEYS.TEHSIL_QUERY_KEY
let IDENTITY = "TehsilID"
let MENU_KEY = MENU_KEYS.GENERAL.TEHSIL_FORM_KEY

export default function SessionInfo() {
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
  document.title = "Tehsils"

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { showDeleteDialog, showEditDialog } = useConfirmationModal({
    handleDelete,
    handleEdit,
  })

  const [filters, setFilters] = useState({
    TehsilTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })

  const user = useUserData()

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchAllTehsiles(user.userID),
    initialData: [],
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTehsilByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
    },
  })

  function handleDelete(id) {
    deleteMutation.mutate({ TehsilID: id, LoginUserID: user.userID })
  }

  function handleEdit(id) {
    navigate(editRoute + id)
  }

  function handleView(id) {
    navigate(parentRoute + "/" + id)
  }

  return (
    <div className="mt-4">
      {isLoading || isFetching ? (
        <>
          <div className="h-100 w-100">
            <div className="d-flex align-content-center justify-content-center ">
              <CustomSpinner />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* <LinkActionButtons /> */}
          <div className="d-flex text-dark  mb-4 ">
            <h2 className="text-center my-auto">Tehsils</h2>
            <div className="text-end my-auto" style={{ marginLeft: "10px" }}>
              {userRights[0]?.RoleNew && (
                <>
                  <Button
                    label="Add New Tehsil"
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
            dataKey="TehsilID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage="No tehsils found!"
            filters={filters}
            filterDisplay="row"
            resizableColumns
            size="small"
            selectionMode="single"
            className={"thead"}
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column
              body={(rowData) =>
                ActionButtons({
                  ID: encryptID(rowData.TehsilID),
                  handleDelete: () =>
                    showDeleteDialog(encryptID(rowData.TehsilID)),
                  handleEdit: () => showEditDialog(encryptID(rowData.TehsilID)),
                  handleView: handleView,
                  showEditButton: userRights[0]?.RoleEdit,
                  showDeleteButton: userRights[0]?.RoleDelete,
                  viewBtnRoute: viewRoute + encryptID(rowData.TehsilID),
                })
              }
              header="Actions"
              resizeable={false}
              style={{ minWidth: "7rem", maxWidth: "10rem", width: "7rem" }}
            ></Column>
            <Column
              field="TehsilTitle"
              filter
              filterPlaceholder="Search by Tehsil"
              sortable
              header="Tehsil"
            ></Column>
          </DataTable>
        </>
      )}
    </div>
  )
}
function FormComponent({ mode, userRights }) {
  document.title = "Tehsil Entry"
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { TehsilID } = useParams()
  const { control, handleSubmit, setFocus, setValue, reset } = useForm({
    defaultValues: {
      TehsilTitle: "",
      Country: [],
      InActive: false,
    },
  })

  const countriesSelectData = useAllCountiesSelectData()
  const { user } = useContext(AuthContext)

  const TehsilData = useQuery({
    queryKey: [queryKey, TehsilID],
    queryFn: () => fetchTehsilById(TehsilID, user?.userID),
    enabled: TehsilID !== undefined,
    initialData: [],
  })

  useEffect(() => {
    if (TehsilID !== undefined && TehsilData.data.length > 0) {
      setValue("TehsilTitle", TehsilData.data[0].TehsilTitle)
      setValue("Country", TehsilData.data[0].CountryID)
      setValue("InActive", TehsilData.data[0].InActive)
    }
  }, [TehsilID, TehsilData])

  const mutation = useMutation({
    mutationFn: addNewTehsil,
    onSuccess: ({ success, RecordID }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] })
        navigate(`${parentRoute}/${RecordID}`)
      }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTehsilByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
      navigate(parentRoute)
    },
  })

  function handleDelete() {
    deleteMutation.mutate({ TehsilID: TehsilID, LoginUserID: user.userID })
  }

  function handleAddNew() {
    reset()
    navigate(newRoute)
  }
  function handleCancel() {
    if (mode === "new") {
      navigate(parentRoute)
    } else if (mode === "edit") {
      navigate(viewRoute + TehsilID)
    }
  }
  function handleEdit() {
    navigate(editRoute + TehsilID)
  }

  function onSubmit(data) {
    mutation.mutate({
      formData: data,
      userID: user.userID,
      TehsilID: TehsilID,
    })
  }

  return (
    <>
      {TehsilData.isLoading ? (
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
              GoBackLabel="Tehsils"
              showAddNewButton={userRights[0]?.RoleNew}
              showEditButton={userRights[0]?.RoleEdit}
              showDelete={userRights[0]?.RoleDelete}
            />
          </div>
          <form className="mt-4">
            <FormRow>
              <FormColumn lg={6} xl={6} md={6}>
                <FormLabel labelFor="TehsilTitle">
                  Tehsil
                  <span className="text-danger fw-bold ">*</span>
                </FormLabel>

                <div>
                  <TextInput
                    control={control}
                    ID={"TehsilTitle"}
                    required={true}
                    focusOptions={() => setFocus("Country")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </FormColumn>
              <FormColumn lg={6} xl={6} md={6}>
                <FormLabel labelFor="Country">
                  Country
                  <span className="text-danger fw-bold ">*</span>
                </FormLabel>
                <div>
                  <CDropdown
                    control={control}
                    name={`Country`}
                    optionLabel="CountryTitle"
                    optionValue="CountryID"
                    placeholder="Select a country"
                    options={countriesSelectData.data}
                    required={true}
                    disabled={mode === "view"}
                    focusOptions={() => setFocus("InActive")}
                  />
                </div>
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn lg={6} xl={6} md={6}>
                <div className="mt-2">
                  <CheckBox
                    control={control}
                    ID={"InActive"}
                    Label={"InActive"}
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
