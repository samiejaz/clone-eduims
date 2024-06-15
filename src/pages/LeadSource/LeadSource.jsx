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
  addNewLeadSource,
  deleteLeadSourceByID,
  fetchAllLeadSources,
  fetchLeadSourceById,
} from "../../api/LeadSourceData"
import { ROUTE_URLS, QUERY_KEYS, MENU_KEYS } from "../../utils/enums"
import useConfirmationModal from "../../hooks/useConfirmationModalHook"
import {
  FormRow,
  FormColumn,
  FormLabel,
} from "../../components/Layout/LayoutComponents"
import { encryptID } from "../../utils/crypto"
import { FormRightsWrapper } from "../../components/Wrappers/wrappers"
import { DetailPageTilteAndActionsComponent } from "../../components"
let parentRoute = ROUTE_URLS.LEED_SOURCE_ROUTE
let editRoute = `${parentRoute}/edit/`
let newRoute = `${parentRoute}/new`
let viewRoute = `${parentRoute}/`
let queryKey = QUERY_KEYS.LEED_SOURCE_QUERY_KEY

let IDENTITY = "LeadSourceID"
let MENU_KEY = MENU_KEYS.LEADS.LEAD_SOURCE_FORM_KEY

export default function LeadSources() {
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
  document.title = "Lead Sources"

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { showDeleteDialog, showEditDialog } = useConfirmationModal({
    handleDelete,
    handleEdit,
  })

  const [filters, setFilters] = useState({
    LeadSourceTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })

  const user = useUserData()

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchAllLeadSources(user.userID),
    initialData: [],
  })

  const deleteMutation = useMutation({
    mutationFn: deleteLeadSourceByID,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      })
    },
  })

  function handleDelete(id) {
    deleteMutation.mutate({ LeadSourceID: id, LoginUserID: user.userID })
  }

  function handleEdit(id) {
    navigate(editRoute + id)
  }

  function handleView(id) {
    navigate(parentRoute + "/" + id)
  }

  const onRowClick = (e) => {
    navigate(viewRoute + encryptID(e?.data?.LeadSourceID))
  }

  return (
    <div className="mt-4">
      {isLoading || isFetching ? (
        <>
          <>
            <CustomSpinner />
          </>
        </>
      ) : (
        <>
          <DetailPageTilteAndActionsComponent
            title="Lead Sources"
            onAddNewClick={() => navigate(newRoute)}
            showAddNewButton={userRights[0]?.RoleNew}
            buttonLabel="Add New Lead Source"
          />
          <DataTable
            showGridlines
            value={data}
            dataKey="LeadSourceID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage="No Lead Sources found!"
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
                  ID: encryptID(rowData.LeadSourceID),
                  handleDelete: () =>
                    showDeleteDialog(encryptID(rowData.LeadSourceID)),
                  handleEdit: () =>
                    showEditDialog(encryptID(rowData.LeadSourceID)),
                  handleView: handleView,
                  showEditButton: userRights[0]?.RoleEdit,
                  showDeleteButton: userRights[0]?.RoleDelete,
                  viewBtnRoute: viewRoute + encryptID(rowData.LeadSourceID),
                })
              }
              header="Actions"
              resizeable={false}
              style={{ minWidth: "7rem", maxWidth: "10rem", width: "7rem" }}
            ></Column>
            <Column
              field="LeadSourceTitle"
              filter
              filterPlaceholder="Search by Lead Source"
              sortable
              header="Lead Source"
            ></Column>
          </DataTable>
        </>
      )}
    </div>
  )
}
function FormComponent({ mode, userRights }) {
  document.title = "Lead Source Entry"
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { LeadSourceID } = useParams()
  const { control, handleSubmit, setFocus, setValue, reset } = useForm({
    defaultValues: {
      LeadSourceTitle: "",
      InActive: false,
    },
  })

  const user = useUserData()

  const LeadSourceData = useQuery({
    queryKey: [queryKey, LeadSourceID],
    queryFn: () => fetchLeadSourceById(LeadSourceID, user.userID),
    enabled: LeadSourceID !== undefined,
    initialData: [],
  })

  useEffect(() => {
    if (LeadSourceID !== undefined && LeadSourceData?.data?.length > 0) {
      setValue("LeadSourceTitle", LeadSourceData.data[0].LeadSourceTitle)
      setValue("InActive", LeadSourceData.data[0].InActive)
    }
  }, [LeadSourceID, LeadSourceData])

  const mutation = useMutation({
    mutationFn: addNewLeadSource,
    onSuccess: ({ success, RecordID }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] })
        navigate(`${parentRoute}/${RecordID}`)
      }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteLeadSourceByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
      navigate(parentRoute)
    },
  })

  function handleDelete() {
    deleteMutation.mutate({
      LeadSourceID: LeadSourceID,
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
      navigate(viewRoute + LeadSourceID)
    }
  }
  function handleEdit() {
    navigate(editRoute + LeadSourceID)
  }

  function onSubmit(data) {
    mutation.mutate({
      formData: data,
      userID: user.userID,
      LeadSourceID: LeadSourceID,
    })
  }

  return (
    <>
      {LeadSourceData.isLoading ? (
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
              GoBackLabel="LeadSources"
              showAddNewButton={userRights[0]?.RoleNew}
              showEditButton={userRights[0]?.RoleEdit}
              showDelete={userRights[0]?.RoleDelete}
            />
          </div>
          <form className="mt-4">
            <FormRow>
              <FormColumn lg={6} xl={6} md={6}>
                <FormLabel>
                  Lead Source
                  <span className="text-red-700 fw-bold ">*</span>
                </FormLabel>

                <div>
                  <TextInput
                    control={control}
                    ID={"LeadSourceTitle"}
                    required={true}
                    focusOptions={() => setFocus("InActive")}
                    isEnable={mode !== "view"}
                    errorMessage="Source title is required!"
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
