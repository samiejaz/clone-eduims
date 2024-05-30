import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { FilterMatchMode } from "primereact/api"
import { useEffect, useState } from "react"
import { CustomSpinner } from "../../components/CustomSpinner"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import ActionButtons from "../../components/ActionButtons"
import { useForm } from "react-hook-form"
import ButtonToolBar from "../../components/ActionsToolbar"
import TextInput from "../../components/Forms/TextInput"
import CheckBox from "../../components/Forms/CheckBox"
import { useUserData } from "../../context/AuthContext"
import {
  addNewSession,
  deleteSessionByID,
  fetchAllSessions,
  fetchSessionById,
} from "../../api/SessionData"
import {
  ROUTE_URLS,
  QUERY_KEYS,
  SELECT_QUERY_KEYS,
  MENU_KEYS,
} from "../../utils/enums"
import CDatePicker from "../../components/Forms/CDatePicker"
import { parseISO } from "date-fns"
import {
  FormRow,
  FormColumn,
  FormLabel,
} from "../../components/Layout/LayoutComponents"
import useConfirmationModal from "../../hooks/useConfirmationModalHook"
import { encryptID } from "../../utils/crypto"
import { FormRightsWrapper } from "../../components/Wrappers/wrappers"
import { DetailPageTilteAndActionsComponent } from "../../components"

let parentRoute = ROUTE_URLS.GENERAL.SESSION_INFO
let editRoute = `${parentRoute}/edit/`
let newRoute = `${parentRoute}/new`
let viewRoute = `${parentRoute}/`
let queryKey = QUERY_KEYS.SESSION_INFO_QUERY_KEY
let IDENTITY = "SessionID"
let MENU_KEY = MENU_KEYS.GENERAL.SESSION_INFO_FORM_KEY

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
  document.title = "Session Info"
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { showDeleteDialog, showEditDialog } = useConfirmationModal({
    handleDelete,
    handleEdit,
  })

  const [filters, setFilters] = useState({
    SessionTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })

  const user = useUserData()

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchAllSessions(user.userID),
    initialData: [],
  })

  const deleteMutation = useMutation({
    mutationFn: deleteSessionByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
      navigate(parentRoute)
    },
  })

  function handleDelete(id) {
    deleteMutation.mutate({
      SessionID: id,
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
    navigate(viewRoute + encryptID(e?.data?.SessionID))
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
            title="Session Info"
            onAddNewClick={() => navigate(newRoute)}
            showAddNewButton={userRights[0]?.RoleNew}
            buttonLabel="Add New Session Info"
          />
          <DataTable
            showGridlines
            value={data}
            dataKey="SessionID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage="No session found!"
            filters={filters}
            filterDisplay="row"
            resizableColumns
            size="small"
            selectionMode="single"
            tableStyle={{ minWidth: "50rem" }}
            onRowClick={onRowClick}
          >
            <Column
              body={(rowData) =>
                ActionButtons({
                  ID: encryptID(rowData.SessionID),
                  handleDelete: () =>
                    showDeleteDialog(encryptID(rowData.SessionID)),
                  handleEdit: () =>
                    showEditDialog(encryptID(rowData.SessionID)),
                  handleView: handleView,
                  showEditButton: userRights[0]?.RoleEdit,
                  showDeleteButton: userRights[0]?.RoleDelete,
                  viewBtnRoute: viewRoute + encryptID(rowData.SessionID),
                })
              }
              header="Actions"
              resizeable={false}
              style={{ minWidth: "7rem", maxWidth: "7rem", width: "7rem" }}
            ></Column>
            <Column
              field="SessionTitle"
              filter
              filterPlaceholder="Search by session"
              sortable
              header="Session"
              style={{ minWidth: "20rem" }}
            ></Column>
            <Column
              field="SessionOpeningDate"
              sortable
              header="Opening Date"
              style={{ minWidth: "20rem" }}
            ></Column>
            <Column
              field="SessionClosingDate"
              sortable
              header="Closing Date"
              style={{ minWidth: "20rem" }}
            ></Column>
          </DataTable>
        </>
      )}
    </div>
  )
}
export function FormComponent({ mode, userRights }) {
  document.title = "Session Info Entry"
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { SessionID } = useParams()
  const { control, handleSubmit, setFocus, setValue, reset } = useForm({
    defaultValues: {
      SessionTitle: "",
      InActive: false,
    },
  })

  const user = useUserData()

  const SessionData = useQuery({
    queryKey: [queryKey, SessionID],
    queryFn: () => fetchSessionById(SessionID, user?.userID),
    enabled: SessionID !== undefined,
    initialData: [],
  })

  useEffect(() => {
    if (+SessionID !== 0 && SessionData.data.length > 0) {
      setValue("SessionTitle", SessionData?.data[0]?.SessionTitle)
      setValue(
        "SessionOpeningDate",
        parseISO(SessionData?.data[0]?.SessionOpeningDate)
      )
      setValue(
        "SessionClosingDate",
        parseISO(SessionData?.data[0]?.SessionClosingDate)
      )
    }
  }, [SessionID, SessionData.data])

  const mutation = useMutation({
    mutationFn: addNewSession,
    onSuccess: ({ success, RecordID }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] })
        queryClient.invalidateQueries({
          queryKey: [SELECT_QUERY_KEYS.SESSION_SELECT_QUERY_KEY],
        })
        navigate(`${parentRoute}/${RecordID}`)
      }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteSessionByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
      queryClient.invalidateQueries({
        queryKey: [SELECT_QUERY_KEYS.SESSION_SELECT_QUERY_KEY],
      })
      navigate(parentRoute)
    },
  })

  function handleDelete() {
    deleteMutation.mutate({
      SessionID: SessionID,
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
      navigate(viewRoute + SessionID)
    }
  }
  function handleEdit() {
    navigate(editRoute + SessionID)
  }
  function onSubmit(data) {
    mutation.mutate({
      formData: data,
      userID: user.userID,
      SessionID: SessionID,
    })
  }

  return (
    <>
      {SessionData.isLoading ? (
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
              GoBackLabel="Sessions"
              showAddNewButton={userRights[0]?.RoleNew}
              showEditButton={userRights[0]?.RoleEdit}
              showDelete={userRights[0]?.RoleDelete}
            />
          </div>
          <form className="mt-4">
            <FormRow>
              <FormColumn lg={4} xl={4} md={6}>
                <FormLabel>
                  Session Info
                  <span className="text-danger fw-bold ">*</span>
                </FormLabel>

                <div>
                  <TextInput
                    control={control}
                    ID={"SessionTitle"}
                    required={true}
                    focusOptions={() => setFocus("InActive")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </FormColumn>
              <FormColumn lg={4} xl={4} md={6}>
                <FormLabel style={{ fontSize: "14px", fontWeight: "bold" }}>
                  Session Opening Date
                  <span className="text-danger fw-bold ">*</span>
                </FormLabel>
                <div>
                  <CDatePicker
                    control={control}
                    name={"SessionOpeningDate"}
                    disabled={mode === "view"}
                    required={true}
                  />
                </div>
              </FormColumn>
              <FormColumn lg={4} xl={4} md={6}>
                <FormLabel style={{ fontSize: "14px", fontWeight: "bold" }}>
                  Session Closing Date
                  <span className="text-danger fw-bold ">*</span>
                </FormLabel>
                <div>
                  <CDatePicker
                    control={control}
                    name={"SessionClosingDate"}
                    disabled={mode === "view"}
                    required={true}
                  />
                </div>
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn lg={6} xl={6} md={4} sm={4}>
                <div>
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
