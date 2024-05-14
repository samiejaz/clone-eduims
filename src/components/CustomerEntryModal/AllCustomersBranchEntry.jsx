import { useState, useContext } from "react"
import { preventFormByEnterKeySubmission } from "../../utils/CommonFunctions"
import { Button } from "primereact/button"
import { useForm } from "react-hook-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AuthContext } from "../../context/AuthContext"
import { toast } from "react-toastify"
import axios from "axios"
import {
  deleteAllCustomersBranchByID,
  fetchAllCustomersBranch,
} from "./CustomerEntryAPI"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { FilterMatchMode } from "primereact/api"
import { Dialog } from "primereact/dialog"
import { FormColumn, FormLabel, FormRow } from "../Layout/LayoutComponents"
import TextInput from "../Forms/TextInput"
import CheckBox from "../Forms/CheckBox"
import { confirmDialog } from "primereact/confirmdialog"
import { apiUrl } from "../../../public/COSTANTS"

function AllCustomersBranchEntry(props) {
  const { CustomerID, isEnable = true } = props
  return (
    <>
      <CustomerAccountDataTableHeader
        CustomerID={CustomerID}
        isEnable={isEnable}
      />
      <div className="mt-3">
        <AllCustomersBranchDetailTable
          CustomerID={CustomerID}
          isEnable={isEnable}
        />
      </div>
    </>
  )
}

export default AllCustomersBranchEntry

function CustomerAccountDataTableHeader(props) {
  const queryClient = useQueryClient()

  const { CustomerID, isEnable, pageTitles } = props
  const { user } = useContext(AuthContext)

  const { handleSubmit, reset, control } = useForm({
    defaultValues: {
      BranchTitle: "",
    },
  })

  const AllCustomersBranchEntryMutation = useMutation({
    mutationFn: async (formData) => {
      let DataToSend = {
        BranchID: 0,
        BranchTitle: formData?.BranchTitle,
        EntryUserID: user.userID,
        InActive: formData?.InActive ? 1 : 0,
      }
      const { data } = await axios.post(
        apiUrl + "/Branch/BranchInsertUpdate",
        DataToSend
      )
      if (data.success === true) {
        reset()
        toast.success(
          `${pageTitles?.branch || "Customer Branch"} saved successfully!`
        )
        queryClient.invalidateQueries({
          queryKey: ["allCustomerBranchesDetail"],
        })
      } else {
        toast.error(data.message, {
          autoClose: 1500,
        })
      }
    },
    onError: () => {
      toast.error("Error while saving data!")
    },
  })

  function onSubmit(data) {
    if (CustomerID === 0) {
      toast.error("No Customer Found!!")
    } else {
      AllCustomersBranchEntryMutation.mutate(data)
    }
  }

  return (
    <>
      <form onKeyDown={preventFormByEnterKeySubmission}>
        <FormRow className="place-items-end">
          <FormColumn lg={11} xl={11} sm={11}>
            <FormLabel>
              {pageTitles?.branch || "Customer Branch"} Title
            </FormLabel>
            <div>
              <TextInput
                control={control}
                ID={"BranchTitle"}
                isEnable={isEnable}
                required={true}
              />
            </div>
          </FormColumn>
          <FormColumn lg={1} xl={1} sm={1}>
            <Button
              severity="info"
              className="px-4 py-2 rounded-1 "
              onClick={() => {
                handleSubmit(onSubmit)()
              }}
              type="button"
              disabled={!isEnable || AllCustomersBranchEntryMutation.isPending}
              label={
                AllCustomersBranchEntryMutation?.isPending ? `Adding...` : "Add"
              }
              loadingIcon={"pi pi-spin pi-spinner"}
              loading={AllCustomersBranchEntryMutation.isPending}
            ></Button>
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn lg={2} xl={2} sm={2}>
            <CheckBox
              control={control}
              ID={"InActive"}
              Label={"InActive"}
              isEnable={isEnable}
            />
          </FormColumn>
        </FormRow>
      </form>
    </>
  )
}

function AllCustomersBranchDetailTable(props) {
  const queryClient = useQueryClient()
  const [visible, setVisible] = useState(false)
  const { CustomerID, isEnable, pageTitles } = props
  const [filters, setFilters] = useState({
    BranchTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })

  const { user } = useContext(AuthContext)
  const { register, setValue, handleSubmit, control } = useForm()

  const { data: CustomerBranches } = useQuery({
    queryKey: ["allCustomerBranchesDetail"],
    queryFn: () => fetchAllCustomersBranch(user.userID),
    initialData: [],
  })

  const AllCustomersBranchEntryMutation = useMutation({
    mutationFn: async (formData) => {
      let DataToSend = {
        BranchID: formData?.BranchID,
        BranchTitle: formData?.BranchTitle,
        CustomerID: CustomerID,
        EntryUserID: user.userID,
        InActive: formData?.InActive ? 1 : 0,
      }
      const { data } = await axios.post(
        apiUrl + "/Branch/BranchInsertUpdate",
        DataToSend
      )

      if (data.success === true) {
        toast.success(
          `${pageTitles?.branch || "Customer Branch"} updated successfully!`
        )
        queryClient.invalidateQueries({
          queryKey: ["allCustomerBranchesDetail"],
        })
        queryClient.invalidateQueries({ queryKey: ["customerBranchesDetail"] })
        setVisible(false)
      } else {
        toast.error(data.message, {
          autoClose: 1500,
        })
      }
    },
    onError: () => {
      toast.error("Error while saving data!")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteAllCustomersBranchByID,
    onSuccess: (response) => {
      if (response === true) {
        queryClient.invalidateQueries({
          queryKey: ["allCustomerBranchesDetail"],
        })
      }
    },
  })

  function onSubmit(data) {
    AllCustomersBranchEntryMutation.mutate(data)
  }

  function handleDelete(BranchID) {
    deleteMutation.mutate({
      BranchID: BranchID,
      LoginUserID: user.userID,
    })
  }

  const confirmDelete = (id) => {
    confirmDialog({
      message: "Are you sure you want to delete this record?",
      header: "Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      position: "top",
      accept: () => handleDelete(id),
      reject: () => {},
    })
  }

  return (
    <>
      <DataTable
        className="mt-2"
        showGridlines
        value={CustomerBranches?.data || []}
        dataKey="BranchID"
        removableSort
        emptyMessage={`No ${
          pageTitles?.branch?.toLowerCase() ?? "customer branch"
        } found!`}
        filters={filters}
        filterDisplay="row"
        resizableColumns
        size="small"
        selectionMode="single"
        tableStyle={{ minWidth: "50rem", height: "" }}
      >
        <Column
          body={(rowData) => (
            <>
              <div className="flex aling-items-center gap-2">
                <Button
                  icon="pi pi-pencil"
                  severity="success"
                  size="small"
                  className="rounded"
                  style={{
                    padding: "0.3rem .7rem",
                    fontSize: ".8em",
                    width: "30px",
                  }}
                  disabled={!isEnable}
                  type="button"
                  onClick={() => {
                    setVisible(true)
                    setValue("BranchTitle", rowData?.BranchTitle)
                    setValue("BranchID", rowData?.BranchID)
                  }}
                />
                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  size="small"
                  className="rounded"
                  style={{
                    padding: "0.3rem .7rem",
                    fontSize: ".8em",
                    width: "30px",
                  }}
                  onClick={() => {
                    confirmDelete(rowData?.BranchID)
                  }}
                />
              </div>
            </>
          )}
          header="Actions"
          resizeable={false}
          style={{
            minWidth: "7rem",
            maxWidth: "7rem",
            width: "7rem",
            textAlign: "center",
          }}
        ></Column>
        <Column
          field="BranchTitle"
          filter
          filterPlaceholder={`Search by ${
            pageTitles?.branch || "Customer Branch"
          }`}
          sortable
          header={`${pageTitles?.branch || "Customer Branch"} Title`}
          style={{ minWidth: "20rem" }}
        ></Column>
      </DataTable>

      <form onKeyDown={preventFormByEnterKeySubmission}>
        <div className="card flex justify-content-center">
          <Dialog
            header={`Edit ${pageTitles?.branch || "Customer Branch"} Title`}
            visible={visible}
            onHide={() => {
              setVisible(false)
            }}
            style={{ width: "40vw" }}
            footer={
              <Button
                severity="success"
                className="rounded"
                type="button"
                label={
                  AllCustomersBranchEntryMutation.isPending
                    ? "Updating..."
                    : "Update"
                }
                loading={AllCustomersBranchEntryMutation.isPending}
                loadingIcon="pi pi-spin pi-spinner"
                onClick={() => {
                  handleSubmit(onSubmit)()
                }}
              />
            }
          >
            <input
              type="text"
              {...register("BranchID", {
                valueAsNumber: true,
              })}
              className="visually-hidden "
              style={{ display: "none" }}
            />
            <FormRow>
              <FormColumn lg={12} xl={12} sm={12}>
                <FormLabel>
                  {pageTitles?.branch || "Customer Branch"} Title
                </FormLabel>
                <div>
                  <TextInput
                    control={control}
                    ID={"BranchTitle"}
                    isEnable={isEnable}
                    required={true}
                  />
                </div>
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn lg={2} xl={2} sm={2}>
                <CheckBox
                  control={control}
                  ID={"InActive"}
                  Label={"InActive"}
                  isEnable={isEnable}
                />
              </FormColumn>
            </FormRow>
          </Dialog>
        </div>
      </form>
    </>
  )
}
