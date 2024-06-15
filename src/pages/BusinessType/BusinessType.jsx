import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { FilterMatchMode } from "primereact/api"
import { useContext, useEffect, useState } from "react"
import { CustomSpinner } from "../../components/CustomSpinner"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import ActionButtons from "../../components/ActionButtons"
import { useForm } from "react-hook-form"
import ButtonToolBar from "../../components/ActionsToolbar"
import TextInput from "../../components/Forms/TextInput"
import CheckBox from "../../components/Forms/CheckBox"
import { AuthContext, useUserData } from "../../context/AuthContext"
import {
  addNewBusinessType,
  deleteBusinessTypeByID,
  fetchAllBusinessTypes,
  fetchBusinessTypeById,
} from "../../api/BusinessTypeData"
import useConfirmationModal from "../../hooks/useConfirmationModalHook"
import {
  FormRow,
  FormColumn,
  FormLabel,
} from "../../components/Layout/LayoutComponents"

import { ROUTE_URLS, QUERY_KEYS, MENU_KEYS } from "../../utils/enums"
import { encryptID } from "../../utils/crypto"
import { FormRightsWrapper } from "../../components/Wrappers/wrappers"
import { DetailPageTilteAndActionsComponent } from "../../components"

let parentRoute = ROUTE_URLS.BUSINESS_TYPE
let editRoute = `${parentRoute}/edit/`
let newRoute = `${parentRoute}/new`
let viewRoute = `${parentRoute}/`
let queryKey = QUERY_KEYS.BUSINESS_TYPE_QUERY_KEY
let MENU_KEY = MENU_KEYS.GENERAL.BUSINESS_TYPE_FORM_KEY
let IDENTITY = "BusinessTypeID"

export default function BusinessType() {
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
  document.title = "Business Types"
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { showDeleteDialog, showEditDialog } = useConfirmationModal({
    handleDelete,
    handleEdit,
  })

  const [filters, setFilters] = useState({
    BusinessTypeTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })

  const user = useUserData()

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchAllBusinessTypes(user.userID),
    initialData: [],
  })

  const deleteMutation = useMutation({
    mutationFn: deleteBusinessTypeByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
      navigate(parentRoute)
    },
  })

  function handleDelete(id) {
    deleteMutation.mutate({
      BusinessTypeID: id,
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
    navigate(viewRoute + encryptID(e?.data?.BusinessTypeID))
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
            title="Business Types"
            onAddNewClick={() => navigate(newRoute)}
            showAddNewButton={userRights[0]?.RoleNew}
            buttonLabel="Add New Business Type"
          />
          <DataTable
            showGridlines
            value={data}
            dataKey="BusinessTypeID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage="No business types found!"
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
                  ID: encryptID(rowData.BusinessTypeID),
                  handleDelete: () =>
                    showDeleteDialog(encryptID(rowData.BusinessTypeID)),
                  handleEdit: () =>
                    showEditDialog(encryptID(rowData.BusinessTypeID)),
                  handleView: handleView,
                  showEditButton: userRights[0]?.RoleEdit,
                  showDeleteButton: userRights[0]?.RoleDelete,
                  viewBtnRoute: viewRoute + encryptID(rowData.BusinessTypeID),
                })
              }
              header="Actions"
              resizeable={false}
              style={{ minWidth: "7rem", maxWidth: "10rem", width: "7rem" }}
            ></Column>
            <Column
              field="BusinessTypeTitle"
              filter
              filterPlaceholder="Search by Business Type"
              sortable
              header="Business Type"
            ></Column>
          </DataTable>
        </>
      )}
    </div>
  )
}
function FormComponent({ mode, userRights }) {
  document.title = "Business Type Entry"
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { BusinessTypeID } = useParams()
  const { control, handleSubmit, setFocus, setValue, reset } = useForm({
    defaultValues: {
      BusinessTypeTitle: "",
      InActive: false,
    },
  })

  const { user } = useContext(AuthContext)

  const BusinessTypeData = useQuery({
    queryKey: [queryKey, BusinessTypeID],
    queryFn: () => fetchBusinessTypeById(BusinessTypeID, user.userID),
    enabled: BusinessTypeID !== undefined,
    initialData: [],
  })

  useEffect(() => {
    if (BusinessTypeID !== undefined && BusinessTypeData.data.length > 0) {
      setValue("BusinessTypeTitle", BusinessTypeData.data[0].BusinessTypeTitle)
      setValue("InActive", BusinessTypeData.data[0].InActive)
    }
  }, [BusinessTypeID, BusinessTypeData])

  const mutation = useMutation({
    mutationFn: addNewBusinessType,
    onSuccess: ({ success, RecordID }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] })
        navigate(`${parentRoute}/${RecordID}`)
      }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteBusinessTypeByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
      navigate(parentRoute)
    },
  })

  function handleDelete() {
    deleteMutation.mutate({
      BusinessTypeID: BusinessTypeID,
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
      navigate(viewRoute + BusinessTypeID)
    }
  }
  function handleEdit() {
    navigate(editRoute + BusinessTypeID)
  }
  function onSubmit(data) {
    mutation.mutate({
      formData: data,
      userID: user.userID,
      BusinessTypeID: BusinessTypeID,
    })
  }

  return (
    <>
      {BusinessTypeData.isLoading ? (
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
              GoBackLabel="Business Types"
              showAddNewButton={userRights[0]?.RoleNew}
              showEditButton={userRights[0]?.RoleEdit}
              showDelete={userRights[0]?.RoleDelete}
            />
          </div>
          <form className="mt-4">
            <FormRow>
              <FormColumn lg={6} xl={6} md={6}>
                <FormLabel>
                  Business Type
                  <span className="text-red-700 fw-bold ">*</span>
                </FormLabel>

                <div>
                  <TextInput
                    control={control}
                    ID={"BusinessTypeTitle"}
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
