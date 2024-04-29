import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Route, Routes, useNavigate, useParams } from "react-router-dom"
import { FilterMatchMode } from "primereact/api"
import { useContext, useEffect, useRef, useState } from "react"
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
  addNewUser,
  deleteUserByID,
  fetchAllUsers,
  fetchUserById,
} from "../../api/UserData"
import { ROUTE_URLS, QUERY_KEYS, MENU_KEYS } from "../../utils/enums"
import {
  useAllDepartmentsSelectData,
  useAllUserRolesSelectData,
} from "../../hooks/SelectData/useSelectData"
import CDropdown from "../../components/Forms/CDropdown"
import {
  FormRow,
  FormColumn,
  FormLabel,
} from "../../components/Layout/LayoutComponents"
import useConfirmationModal from "../../hooks/useConfirmationModalHook"
import { encryptID } from "../../utils/crypto"
import { SingleFileUploadField } from "../../components/Forms/form"
import { Avatar } from "primereact/avatar"

import { FormRightsWrapper } from "../../components/Wrappers/wrappers"
let parentRoute = ROUTE_URLS.USER_ROUTE
let editRoute = `${parentRoute}/edit/`
let newRoute = `${parentRoute}/new`
let viewRoute = `${parentRoute}/`
let queryKey = QUERY_KEYS.USER_QUERY_KEY
let IDENTITY = "UserID"
let MENU_KEY = MENU_KEYS.USERS.USERS_FORM_KEY

export default function Users() {
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
  document.title = "Users"

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { showDeleteDialog, showEditDialog } = useConfirmationModal({
    handleDelete,
    handleEdit,
  })

  const [filters, setFilters] = useState({
    FirstName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    LastName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    UserName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    Email: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })

  const user = useUserData()

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchAllUsers(user.userID),
    initialData: [],
  })

  const deleteMutation = useMutation({
    mutationFn: deleteUserByID,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      })
    },
  })

  function handleDelete(id) {
    deleteMutation.mutate({ UserID: id, LoginUserID: user.userID })
  }

  function handleEdit(id) {
    navigate(editRoute + id)
  }

  function handleView(id) {
    navigate(parentRoute + "/" + id)
  }

  function profileTemplate(rowData) {
    return (
      <Avatar
        image={"data:image/png;base64," + rowData?.ProfilePic}
        shape="circle"
      />
    )
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
          <div className="d-flex text-dark  mb-4 ">
            <h2 className="text-center my-auto">Users</h2>
            <div className="text-end my-auto" style={{ marginLeft: "10px" }}>
              {userRights[0]?.RoleNew && (
                <>
                  <Button
                    label="Add New User"
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
            dataKey="LoginUserID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage="No User found!"
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
                  ID: encryptID(rowData.LoginUserID),
                  handleDelete: () =>
                    showDeleteDialog(encryptID(rowData.LoginUserID)),
                  handleEdit: () =>
                    showEditDialog(encryptID(rowData.LoginUserID)),
                  handleView: handleView,
                  showEditButton:
                    rowData.FirstName === "ADMINISTRATOR"
                      ? false
                      : userRights[0]?.RoleEdit,
                  showDeleteButton:
                    rowData.FirstName === "ADMINISTRATOR"
                      ? false
                      : userRights[0]?.RoleDelete,
                  viewBtnRoute: viewRoute + encryptID(rowData.LoginUserID),
                })
              }
              header="Actions"
              resizeable={false}
              style={{ minWidth: "7rem", maxWidth: "10rem", width: "7rem" }}
            ></Column>
            <Column
              field="ProfilePic"
              header="User"
              body={profileTemplate}
            ></Column>
            <Column
              field="FirstName"
              filter
              filterPlaceholder="Search by firstname"
              sortable
              header="First Name"
              style={{ minWidth: "20rem" }}
            ></Column>
            <Column
              field="LastName"
              filter
              filterPlaceholder="Search by lastname"
              sortable
              header="Last Name"
              style={{ minWidth: "20rem" }}
            ></Column>
            <Column
              field="UserName"
              filter
              filterPlaceholder="Search by username"
              sortable
              header="Username"
              style={{ minWidth: "20rem" }}
            ></Column>
            <Column
              field="Email"
              filter
              filterPlaceholder="Search by email"
              sortable
              header="Email"
              style={{ minWidth: "20rem" }}
            ></Column>
          </DataTable>
        </>
      )}
    </div>
  )
}

function FormComponent({ mode, userRights }) {
  document.title = "User Entry"

  const queryClient = useQueryClient()
  const fileRef = useRef()

  const navigate = useNavigate()
  const { UserID } = useParams()
  const user = useUserData()

  const {
    control,
    handleSubmit,
    setFocus,
    setValue,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      FirstName: "",
      LastName: "",
      Email: "",
      Password: "",
      UserName: "",
      InActive: "",
      DepartmentID: null,
      RoleID: null,
    },
  })

  const departmentSelectData = useAllDepartmentsSelectData()
  const userRolesSelectData = useAllUserRolesSelectData()

  const UserData = useQuery({
    queryKey: [queryKey, UserID],
    queryFn: () => fetchUserById(UserID, user.userID),
    enabled: UserID !== undefined,
    initialData: [],
  })

  useEffect(() => {
    if (!isDirty) {
      if (+UserID !== undefined && UserData?.data?.length > 0) {
        try {
          setValue("FirstName", UserData?.data[0]?.FirstName)
          setValue("LastName", UserData?.data[0]?.LastName)
          setValue("Email", UserData?.data[0]?.Email)
          setValue("UserName", UserData?.data[0]?.UserName)
          setValue("Password", UserData?.data[0]?.Password)
          setValue("InActive", UserData?.data[0]?.InActive)
          setValue("DepartmentID", UserData?.data[0]?.DepartmentID)
          setValue("RoleID", UserData?.data[0]?.RoleID)
          if (UserData?.data[0]?.ProfilePic) {
            fileRef.current?.setBase64File(
              "data:image/png;base64," + UserData?.data[0]?.ProfilePic
            )
          }
        } catch (error) {}
      }
    }
  }, [UserID, UserData])

  const mutation = useMutation({
    mutationFn: addNewUser,
    onSuccess: ({ success, RecordID }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] })
        navigate(`${parentRoute}/${RecordID}`)
      }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteUserByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
      navigate(parentRoute)
    },
  })

  function handleDelete() {
    deleteMutation.mutate({
      UserID: UserID,
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
      navigate(viewRoute + UserID)
    }
  }
  function handleEdit() {
    navigate(editRoute + UserID)
  }
  function onSubmit(data) {
    const file = fileRef.current?.getFile()
    if (file === null) {
      fileRef.current?.setError()
    } else {
      data.UserImage = file
      mutation.mutate({
        formData: data,
        userID: user?.userID,
        UserID: UserID,
      })
    }
  }

  return (
    <>
      {UserData.isLoading ? (
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
              GoBackLabel="Users"
              showAddNewButton={userRights[0]?.RoleNew}
              showEditButton={
                mode === "view" &&
                UserData?.data[0]?.FirstName === "ADMINISTRATOR"
                  ? false
                  : userRights[0]?.RoleEdit
              }
              showDelete={
                mode === "view" &&
                UserData?.data[0]?.FirstName === "ADMINISTRATOR"
                  ? false
                  : userRights[0]?.RoleDelete
              }
              showCancelButton={
                mode === "view" &&
                UserData?.data[0]?.FirstName === "ADMINISTRATOR"
                  ? false
                  : true
              }
              showSaveButton={
                mode === "view" &&
                UserData?.data[0]?.FirstName === "ADMINISTRATOR"
                  ? false
                  : true
              }
            />
          </div>
          <form className="mt-4">
            <FormRow>
              <FormColumn lg={4} xl={4} md={12}>
                <FormLabel>
                  First Name
                  <span className="text-danger fw-bold ">*</span>
                </FormLabel>

                <div>
                  <TextInput
                    control={control}
                    ID={"FirstName"}
                    required={true}
                    focusOptions={() => setFocus("LastName")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </FormColumn>
              <FormColumn lg={4} xl={4} md={12}>
                <FormLabel>
                  Last Name
                  <span className="text-danger fw-bold ">*</span>
                </FormLabel>

                <div>
                  <TextInput
                    control={control}
                    ID={"LastName"}
                    required={true}
                    focusOptions={() => setFocus("Email")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </FormColumn>
              <FormColumn lg={4} xl={4} md={12}>
                <FormLabel style={{ fontSize: "14px", fontWeight: "bold" }}>
                  Department
                  <span className="text-danger fw-bold ">*</span>
                </FormLabel>
                <div>
                  <CDropdown
                    control={control}
                    name={`DepartmentID`}
                    optionLabel="DepartmentName"
                    optionValue="DepartmentID"
                    placeholder="Select a department"
                    options={departmentSelectData.data}
                    required={true}
                    disabled={mode === "view"}
                    focusOptions={() => setFocus("InActive")}
                  />
                </div>
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn lg={4} xl={4} md={12}>
                <FormLabel>
                  Email
                  <span className="text-danger fw-bold ">*</span>
                </FormLabel>

                <div>
                  <TextInput
                    control={control}
                    ID={"Email"}
                    required={true}
                    focusOptions={() => setFocus("UserName")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </FormColumn>
              <FormColumn lg={4} xl={4} md={12}>
                <FormLabel>
                  User Name
                  <span className="text-danger fw-bold ">*</span>
                </FormLabel>

                <div>
                  <TextInput
                    control={control}
                    ID={"UserName"}
                    required={true}
                    focusOptions={() => setFocus("Password")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </FormColumn>
              <FormColumn lg={4} xl={4} md={12}>
                <FormLabel>
                  Password
                  <span className="text-danger fw-bold ">*</span>
                </FormLabel>

                <div>
                  <TextInput
                    control={control}
                    ID={"Password"}
                    required={true}
                    focusOptions={() => setFocus("RoleID")}
                    isEnable={mode !== "view"}
                    type="password"
                  />
                </div>
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn lg={4} xl={4} md={12}>
                <FormLabel style={{ fontSize: "14px", fontWeight: "bold" }}>
                  Role
                  <span className="text-danger fw-bold ">*</span>
                </FormLabel>
                <div>
                  <CDropdown
                    control={control}
                    name={`RoleID`}
                    optionLabel="RoleTitle"
                    optionValue="RoleID"
                    placeholder="Select a role"
                    options={userRolesSelectData.data}
                    required={true}
                    disabled={mode === "view"}
                    focusOptions={() => setFocus("InActive")}
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

            <FormRow>
              <FormColumn lg={6} xl={6} md={6}>
                <FormLabel>Profie Pic</FormLabel>
                <div>
                  <SingleFileUploadField
                    ref={fileRef}
                    accept="image/*"
                    chooseBtnLabel="Select Image"
                    changeBtnLabel="Change Image"
                    mode={mode}
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
