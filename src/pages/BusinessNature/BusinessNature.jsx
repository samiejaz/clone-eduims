import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { FilterMatchMode } from "primereact/api"
import { useEffect, useState } from "react"
import { CustomSpinner } from "../../components/CustomSpinner"
import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import ActionButtons from "../../components/ActionButtons"
import { useForm } from "react-hook-form"
import ButtonToolBar from "../../components/ActionsToolbar"

import TextInput from "../../components/Forms/TextInput"
import CheckBox from "../../components/Forms/CheckBox"
import { useUserData } from "../../context/AuthContext"
import {
  addNewBusinessNature,
  deleteBusinessNatureByID,
  fetchAllBusinessNatures,
  fetchBusinessNatureById,
} from "../../api/BusinessNatureData"
import { MENU_KEYS, QUERY_KEYS, ROUTE_URLS } from "../../utils/enums"
import useConfirmationModal from "../../hooks/useConfirmationModalHook"
import {
  FormRow,
  FormColumn,
  FormLabel,
} from "../../components/Layout/LayoutComponents"
import { encryptID } from "../../utils/crypto"
import { FormRightsWrapper } from "../../components/Wrappers/wrappers"

let parentRoute = ROUTE_URLS.BUSINESS_NATURE_ROUTE
let editRoute = `${parentRoute}/edit/`
let newRoute = `${parentRoute}/new`
let viewRoute = `${parentRoute}/`
let queryKey = QUERY_KEYS.BUSINESS_NATURE_QUERY_KEY
let IDENTITY = "BusinessNatureID"
let MENU_KEY = MENU_KEYS.GENERAL.BUSINESS_NATURE_FORM_KEY

export default function BusinessNature() {
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
  document.title = "Business Natures"
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { showDeleteDialog, showEditDialog } = useConfirmationModal({
    handleDelete,
    handleEdit,
  })

  const [filters, setFilters] = useState({
    BusinessNatureTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })

  const user = useUserData()

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchAllBusinessNatures(user.userID),
    initialData: [],
  })

  const deleteMutation = useMutation({
    mutationFn: deleteBusinessNatureByID,
    onSuccess: (success) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] })
      }
    },
  })

  function handleDelete(id) {
    deleteMutation.mutate({ BusinessNatureID: id, LoginUserID: user.userID })
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
          <CustomSpinner />
        </>
      ) : (
        <>
          <div className="d-flex text-dark  mb-4 ">
            <h2 className="text-center my-auto">Business Natures</h2>
            <div className="text-end my-auto" style={{ marginLeft: "10px" }}>
              {userRights[0]?.RoleNew && (
                <>
                  <Button
                    label="Add New Business Nature"
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
            dataKey="BusinessNatureID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage="No business natures found!"
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
                  ID: encryptID(rowData.BusinessNatureID),
                  handleDelete: () =>
                    showDeleteDialog(encryptID(rowData.BusinessNatureID)),
                  handleEdit: () =>
                    showEditDialog(encryptID(rowData.BusinessNatureID)),
                  handleView: handleView,
                  showEditButton: userRights[0]?.RoleEdit,
                  showDeleteButton: userRights[0]?.RoleDelete,
                  viewBtnRoute: viewRoute + encryptID(rowData.BusinessNatureID),
                })
              }
              header="Actions"
              resizeable={false}
              style={{ minWidth: "7rem", maxWidth: "10rem", width: "7rem" }}
            ></Column>
            <Column
              field="BusinessNatureTitle"
              filter
              filterPlaceholder="Search by Business Nature"
              sortable
              header="BusinessNature"
            ></Column>
          </DataTable>
        </>
      )}
    </div>
  )
}
function FormComponent({ mode, userRights }) {
  document.title = "Business Nature Entry"

  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { BusinessNatureID } = useParams()
  const { control, handleSubmit, setFocus, setValue, reset } = useForm({
    defaultValues: {
      BusinessNatureTitle: "",
      InActive: false,
    },
  })

  const user = useUserData()

  const BusinessNatureData = useQuery({
    queryKey: [queryKey, BusinessNatureID],
    queryFn: () => fetchBusinessNatureById(BusinessNatureID, user?.userID),
    enabled: BusinessNatureID !== undefined,
    initialData: [],
  })

  useEffect(() => {
    if (BusinessNatureID !== undefined && BusinessNatureData?.data.length > 0) {
      setValue(
        "BusinessNatureTitle",
        BusinessNatureData.data[0].BusinessNatureTitle
      )
      setValue("InActive", BusinessNatureData.data[0].InActive)
    }
  }, [BusinessNatureID, BusinessNatureData])

  const mutation = useMutation({
    mutationFn: addNewBusinessNature,
    onSuccess: ({ success, RecordID }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] })
        navigate(`${parentRoute}/${RecordID}`)
      }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteBusinessNatureByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
      navigate(parentRoute)
    },
  })

  function handleDelete() {
    deleteMutation.mutate({
      BusinessNatureID: BusinessNatureID,
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
      navigate(parentRoute + "/" + BusinessNatureID)
    }
  }
  function handleEdit() {
    navigate(editRoute + BusinessNatureID)
  }
  function onSubmit(data) {
    mutation.mutate({
      formData: data,
      userID: user.userID,
      BusinessNatureID: BusinessNatureID,
    })
  }
  return (
    <>
      {BusinessNatureData.isLoading ? (
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
              handleSave={() => handleSubmit(onSubmit)()}
              handleDelete={handleDelete}
              GoBackLabel="Countries"
              showAddNewButton={userRights[0]?.RoleNew}
              showEditButton={userRights[0]?.RoleEdit}
              showDelete={userRights[0]?.RoleDelete}
            />
          </div>
          <form className="mt-4">
            <FormRow>
              <FormColumn lg={6} xl={6} md={6}>
                <FormLabel>
                  Business Nature
                  <span className="text-danger fw-bold ">*</span>
                </FormLabel>

                <div>
                  <TextInput
                    control={control}
                    ID={"BusinessNatureTitle"}
                    required={true}
                    focusOptions={() => setFocus("InActive")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </FormColumn>
              <FormColumn lg={6} xl={6} md={6}>
                <FormLabel></FormLabel>
                <div className="mt-1">
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
