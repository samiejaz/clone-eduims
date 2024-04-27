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
  addNewDepartment,
  deleteDepartmentByID,
  fetchAllDepartments,
  fetchDepartmentById,
} from "../../api/DepartmentData"
import { ROUTE_URLS, QUERY_KEYS, MENU_KEYS } from "../../utils/enums"
import {
  FormRow,
  FormColumn,
  FormLabel,
} from "../../components/Layout/LayoutComponents"
import useConfirmationModal from "../../hooks/useConfirmationModalHook"
import { encryptID } from "../../utils/crypto"
import { FormRightsWrapper } from "../../components/Wrappers/wrappers"

let parentRoute = ROUTE_URLS.DEPARTMENT
let editRoute = `${parentRoute}/edit/`
let newRoute = `${parentRoute}/new`
let viewRoute = `${parentRoute}/`
let queryKey = QUERY_KEYS.DEPARTMENT_QUERY_KEY
let IDENTITY = "DepartmentID"
let MENU_KEY = MENU_KEYS.USERS.DEPARTMENTS_FORM_KEY

export default function Departments() {
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
  document.title = "Departments"

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { showDeleteDialog, showEditDialog } = useConfirmationModal({
    handleDelete,
    handleEdit,
  })

  const [filters, setFilters] = useState({
    DepartmentName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })

  const user = useUserData()

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchAllDepartments(user.userID),
    initialData: [],
  })

  const deleteMutation = useMutation({
    mutationFn: deleteDepartmentByID,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      })
    },
  })

  function handleDelete(id) {
    deleteMutation.mutate({ DepartmentID: id, LoginUserID: user.userID })
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
            <h2 className="text-center my-auto">Departments</h2>
            <div className="text-end my-auto" style={{ marginLeft: "10px" }}>
              {userRights[0]?.RoleNew && (
                <>
                  <Button
                    label="Add New Department"
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
            dataKey="DepartmentID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage="No departments found!"
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
                  ID: encryptID(rowData.DepartmentID),
                  handleDelete: () =>
                    showDeleteDialog(encryptID(rowData.DepartmentID)),
                  handleEdit: () =>
                    showEditDialog(encryptID(rowData.DepartmentID)),
                  handleView: handleView,
                  showEditButton: userRights[0]?.RoleEdit,
                  showDeleteButton: userRights[0]?.RoleDelete,
                  viewBtnRoute: viewRoute + encryptID(rowData.DepartmentID),
                })
              }
              header="Actions"
              resizeable={false}
              style={{ minWidth: "7rem", maxWidth: "10rem", width: "7rem" }}
            ></Column>
            <Column
              field="DepartmentName"
              filter
              filterPlaceholder="Search by Department"
              sortable
              header="Department"
            ></Column>
          </DataTable>
        </>
      )}
    </div>
  )
}
function FormComponent({ mode, userRights }) {
  document.title = "Department Entry"
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { DepartmentID } = useParams()
  const { control, handleSubmit, setFocus, setValue } = useForm({
    defaultValues: {
      DepartmentName: "",
      InActive: false,
    },
  })

  const user = useUserData()

  const DepartmentData = useQuery({
    queryKey: [queryKey, DepartmentID],
    queryFn: () => fetchDepartmentById(DepartmentID, user.userID),
    enabled: DepartmentID !== undefined,
    initialData: [],
  })

  useEffect(() => {
    if (DepartmentID !== undefined && DepartmentData?.data?.length > 0) {
      setValue("DepartmentName", DepartmentData.data[0].DepartmentName)
      setValue("InActive", DepartmentData.data[0].InActive)
    }
  }, [DepartmentID, DepartmentData])

  const mutation = useMutation({
    mutationFn: addNewDepartment,
    onSuccess: ({ success, RecordID }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] })
        navigate(`${parentRoute}/${RecordID}`)
      }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteDepartmentByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
      navigate(parentRoute)
    },
  })

  function handleDelete() {
    deleteMutation.mutate({
      DepartmentID: DepartmentID,
      LoginUserID: user.userID,
    })
  }

  function handleAddNew() {
    navigate(newRoute)
  }
  function handleCancel() {
    if (mode === "new") {
      navigate(parentRoute)
    } else if (mode === "edit") {
      navigate(viewRoute + DepartmentID)
    }
  }
  function handleEdit() {
    navigate(editRoute + DepartmentID)
  }

  function onSubmit(data) {
    mutation.mutate({
      formData: data,
      userID: user.userID,
      DepartmentID: DepartmentID,
    })
  }

  return (
    <>
      {DepartmentData.isLoading ? (
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
              GoBackLabel="Departments"
              showAddNewButton={userRights[0]?.RoleNew}
              showEditButton={userRights[0]?.RoleEdit}
              showDelete={userRights[0]?.RoleDelete}
            />
          </div>
          <form className="mt-4">
            <FormRow>
              <FormColumn lg={6} xl={6} md={6}>
                <FormLabel>
                  Department
                  <span className="text-danger fw-bold ">*</span>
                </FormLabel>

                <div>
                  <TextInput
                    control={control}
                    ID={"DepartmentName"}
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
