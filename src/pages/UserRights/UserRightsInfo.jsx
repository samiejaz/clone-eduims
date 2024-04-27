import { FormProvider, useForm } from "react-hook-form"
import React, { useContext, useState, useEffect, useRef } from "react"
import UserRightsGroupedTable from "./UserRightsGroupedDatatable"
import UserRightsGroupedTableCellWise from "./UserRightsGroupedDataTableCellWise"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import useConfirmationModal from "../../hooks/useConfirmationModalHook"
import { FilterMatchMode } from "primereact/api"
import { useUserData } from "../../context/AuthContext"
import { encryptID } from "../../utils/crypto"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { CustomSpinner } from "../../components/CustomSpinner"
import {
  MENU_KEYS,
  QUERY_KEYS,
  ROUTE_URLS,
  SELECT_QUERY_KEYS,
} from "../../utils/enums"
import { Route, Routes, useNavigate, useParams } from "react-router-dom"
import AccessDeniedPage from "../../components/AccessDeniedPage"
import { Button } from "primereact/button"
import ButtonToolBar from "../../components/ActionsToolbar"
import { preventFormByEnterKeySubmission } from "../../utils/CommonFunctions"
import {
  FormColumn,
  FormRow,
  FormLabel,
} from "../../components/Layout/LayoutComponents"
import { TextInput } from "../../components/Forms/form"
import {
  addNewUserRole,
  checkForUserRightsAsync,
  fetchAllUserRoless,
  fetchUserRolesById,
} from "../../api/MenusData"
import ActionButtons from "../../components/ActionButtons"
import {
  initAuthorizedMenus,
  initAuthorizedRoutesWithUserRights,
  initRoutesWithUserRights,
} from "../../utils/routes"

let parentRoute = ROUTE_URLS.CONFIGURATION.USER_RIGHTS_ROUTE
let editRoute = `${parentRoute}/edit/`
let newRoute = `${parentRoute}/new`
let viewRoute = `${parentRoute}/`
let queryKey = QUERY_KEYS.USER_ROLES_QUERY_KEY

function UserRoles() {
  const [userRights, setUserRights] = useState([])

  const user = useUserData()

  const { data: rights } = useQuery({
    queryKey: ["formRights"],
    queryFn: () =>
      checkForUserRightsAsync({
        MenuKey: MENU_KEYS.CONFIGURATION.USER_RIGHTS_ROUTE,
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
        {userRights.length > 0 &&
        userRights[0] !== null &&
        userRights[0].ShowForm ? (
          <>
            <Route
              index
              element={<UserRightsDetail userRights={userRights} />}
            />
            <Route
              path={`:RoleID`}
              element={
                <UserRightsInfo
                  key={"RoleViewRoute"}
                  mode={"view"}
                  userRights={userRights}
                />
              }
            />
            <Route
              path={`edit/:RoleID`}
              element={
                <>
                  {userRights[0].RoleEdit ? (
                    <>
                      <UserRightsInfo
                        key={"RoleEditRoute"}
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
                        <UserRightsInfo
                          key={"RoleNewRoute"}
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

const UserRightsInfo = ({ mode, userRights }) => {
  document.title = "Business Type Entry"
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { RoleID } = useParams()
  const method = useForm({
    defaultValues: {
      RoleTitle: "",
    },
  })
  const user = useUserData()
  const userRightsRef = useRef()

  const RoleData = useQuery({
    queryKey: [queryKey, RoleID],
    queryFn: () => fetchUserRolesById({ LoginUserID: user?.userID, RoleID }),
    enabled: RoleID !== undefined,
    initialData: [],
  })

  const mutation = useMutation({
    mutationFn: addNewUserRole,
    onSuccess: ({ success, RecordID }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] })
        queryClient.invalidateQueries({
          queryKey: [SELECT_QUERY_KEYS.USER_ROLES_SELECT_QUERY_KEY],
        })

        navigate(`${parentRoute}/${RecordID}`)
      }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => {},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
      navigate(parentRoute)
    },
  })

  useEffect(() => {
    if (RoleID !== undefined && RoleData.data.Master?.length > 0) {
      let MasterData = RoleData.data.Master[0]
      method.setValue("RoleTitle", MasterData.RoleTitle)

      let DetailData = RoleData.data.Detail
      if (DetailData.length > 0) {
        let updatedDetailData = initAuthorizedMenus(DetailData, true)
        userRightsRef.current?.setUserRoutesDetail(updatedDetailData)
      }
    }
  }, [RoleID, RoleData])

  function handleDelete() {
    deleteMutation.mutate({
      RoleID: RoleID,
      LoginUserID: user.userID,
    })
  }

  function handleAddNew() {
    method.reset()
    navigate(newRoute)
  }
  function handleCancel() {
    if (mode === "new") {
      navigate(parentRoute)
    } else if (mode === "edit") {
      navigate(viewRoute + RoleID)
    }
  }
  function handleEdit() {
    navigate(editRoute + RoleID)
  }
  function onSubmit(data) {
    const userRightsDetail = userRightsRef.current?.getUserRoutesDetail()
    data.UserRightsDetail = userRightsDetail
    mutation.mutate({
      formData: data,
      userID: user.userID,
      RoleID: RoleID,
    })
  }
  return (
    <>
      <div className="mt-4 mb-4">
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
          GoBackLabel="Roles"
          saveLoading={mutation.isPending}
          handleDelete={handleDelete}
          showPrint={userRights[0]?.RolePrint}
          showAddNewButton={userRights[0]?.RoleNew}
          showEditButton={userRights[0]?.RoleEdit}
          showDelete={userRights[0]?.RoleDelete}
        />
      </div>
      <form onKeyDown={preventFormByEnterKeySubmission}>
        <FormRow>
          <FormColumn lg={12} xl={12} sm={12}>
            <FormLabel>
              Role Title
              <span className="text-danger fw-bold ">*</span>
            </FormLabel>
            <div>
              <TextInput
                control={method.control}
                ID={"RoleTitle"}
                required={true}
                isEnable={mode !== "view"}
              />
            </div>
          </FormColumn>
        </FormRow>
        <FormProvider {...method}>
          <UserRightsGroupedTable mode={mode} ref={userRightsRef} />
          {/* <UserRightsGroupedTableCellWise /> */}
        </FormProvider>
      </form>
    </>
  )
}

function UserRightsDetail({ userRights }) {
  document.title = "User Rights"
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { showDeleteDialog, showEditDialog } = useConfirmationModal({
    handleDelete,
    handleEdit,
  })

  const [filters, setFilters] = useState({
    RoleTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })

  const user = useUserData()

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchAllUserRoless(user?.userID),
    initialData: [],
  })
  const deleteMutation = useMutation({
    mutationFn: addNewUserRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
      navigate(parentRoute)
    },
  })

  function handleDelete(id) {
    deleteMutation.mutate({
      RoleID: id,
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
            <h2 className="text-center my-auto">Roles</h2>
            <div className="text-end my-auto" style={{ marginLeft: "10px" }}>
              {userRights[0]?.RoleNew && (
                <>
                  <Button
                    label="Add New Role"
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
            dataKey="RoleID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage="No Roles found!"
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
                  ID: encryptID(rowData.RoleID),
                  handleDelete: () =>
                    showDeleteDialog(encryptID(rowData.RoleID)),
                  handleEdit: () => showEditDialog(encryptID(rowData.RoleID)),
                  handleView: handleView,
                  showEditButton: userRights[0]?.RoleEdit,
                  showDeleteButton: userRights[0]?.RoleDelete,
                  viewBtnRoute: viewRoute + encryptID(rowData.RoleID),
                })
              }
              header="Actions"
              resizeable={false}
              style={{ minWidth: "7rem", maxWidth: "10rem", width: "7rem" }}
            ></Column>
            <Column
              field="RoleTitle"
              filter
              filterPlaceholder="Search by Role"
              sortable
              header="Role"
            ></Column>
            <Column
              field="EntryDate"
              filter
              filterPlaceholder="Search by date"
              sortable
              header="Entry Date"
            ></Column>
          </DataTable>
        </>
      )}
    </div>
  )
}

export default UserRoles
