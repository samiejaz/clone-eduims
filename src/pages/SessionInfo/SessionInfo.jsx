import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Route, Routes, useNavigate, useParams } from "react-router-dom"
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
import AccessDeniedPage from "../../components/AccessDeniedPage"
import { encryptID } from "../../utils/crypto"
import { checkForUserRightsAsync } from "../../api/MenusData"

let parentRoute = ROUTE_URLS.GENERAL.SESSION_INFO
let editRoute = `${parentRoute}/edit/`
let newRoute = `${parentRoute}/new`
let viewRoute = `${parentRoute}/`
let queryKey = QUERY_KEYS.SESSION_INFO_QUERY_KEY
let IDENTITY = "SessionID"

export default function SessionInfoOpening() {
  const [userRights, setUserRights] = useState([])

  const user = useUserData()

  const { data: rights } = useQuery({
    queryKey: ["formRights"],
    queryFn: () =>
      checkForUserRightsAsync({
        MenuKey: MENU_KEYS.GENERAL.SESSION_INFO_FORM_KEY,
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
          <Route index element={<SessionDetail userRights={userRights} />} />
          <Route
            path={`:${IDENTITY}`}
            element={
              <SessionForm
                key={"SessionInfoViewRoute"}
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
                    <SessionForm
                      key={"SessionInfoEditRoute"}
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
                      <SessionForm
                        key={"SessionInfoNewRoute"}
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

export function SessionDetail({ userRights }) {
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

  return (
    <div className="mt-4">
      {isLoading || isFetching ? (
        <>
          <CustomSpinner />
        </>
      ) : (
        <>
          <div className="d-flex text-dark  mb-4 ">
            <h2 className="text-center my-auto">Session Info</h2>
            <div className="text-end my-auto" style={{ marginLeft: "10px" }}>
              {userRights[0]?.RoleNew && (
                <>
                  <Button
                    label="Add New Session Info"
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
export function SessionForm({ mode, userRights }) {
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
