import { createContext, useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import {
  ShowErrorToast,
  ShowSuccessToast,
  preventFormByEnterKeySubmission,
} from "../../utils/CommonFunctions"
import { Button } from "primereact/button"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { fetchCustomerBranchesByCustomerID } from "./CustomerEntryAPI"
import {
  fetchAllCustomerAccountsForSelect,
  fetchAllCustomersBranch,
} from "../../api/SelectData"
import { AuthContext } from "../../context/AuthContext"
import { FilterMatchMode } from "primereact/api"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Dialog } from "primereact/dialog"
import { CustomerAccountEntryModal } from "../Modals/CustomerAccountEntryModal"
import { AppConfigurationContext } from "../../context/AppConfigurationContext"
import { deleteCustomerBranchByID } from "../../api/CustomerBranchData"
import useDeleteModal from "../../hooks/useDeleteModalHook"
import {
  CDropDownField,
  CMultiSelectField,
  TextInput,
  CheckBox,
} from "../Forms/form"
import { AllCustomersBranchEntryModal } from "../Modals/AllCustomersBranchEntryModal"
import { FormColumn, FormLabel, FormRow } from "../Layout/LayoutComponents"

const BranchEntryContext = createContext()

import { apiUrl } from "../../../public/COSTANTS"

const BranchEntryProiver = ({ children }) => {
  const [createdBranchID, setCreatedBranchID] = useState(0)
  return (
    <BranchEntryContext.Provider
      value={{ createdBranchID, setCreatedBranchID }}
    >
      {children}
    </BranchEntryContext.Provider>
  )
}

function CustomerBranchEntry(props) {
  const { CustomerID, isEnable = true } = props
  const { pageTitles } = useContext(AppConfigurationContext)
  return (
    <>
      <BranchEntryProiver>
        <CustomerBranchEntryHeader
          CustomerID={CustomerID}
          pageTitles={pageTitles}
          isEnable={isEnable}
        />
        <CustomerBranchesDataTable
          CustomerID={CustomerID}
          pageTitles={pageTitles}
          isEnable={isEnable}
        />
      </BranchEntryProiver>
    </>
  )
}

export default CustomerBranchEntry

function CustomerBranchEntryHeader(props) {
  const { CustomerID, pageTitles, isEnable } = props
  const queryClient = useQueryClient()
  const { user } = useContext(AuthContext)
  const { control, handleSubmit, reset, setValue, watch, resetField } = useForm(
    {
      defaultValues: {
        CustomerBranch: [],
        BranchAddress: "",
        ContactPersonName: "",
        ContactPersonNo: "",
        ContactPersonEmail: "",
        Description: "",
        InActive: false,
        CreateNewAccount: false,
        CustomerAccounts: [],
      },
    }
  )

  const { data: CustomersBranch } = useQuery({
    queryKey: ["customersBranch"],
    queryFn: () => fetchAllCustomersBranch(),
    initialData: [],
  })
  const { data: CustomerAccounts } = useQuery({
    queryKey: ["customerAccounts", CustomerID],
    queryFn: () => fetchAllCustomerAccountsForSelect(CustomerID),
    enabled: CustomerID !== 0,
    initialData: [],
  })

  const customerBranchMutation = useMutation({
    mutationFn: async (formData) => {
      let AccountIDs = []

      if (formData?.CustomerAccounts?.length > 0) {
        AccountIDs = formData?.CustomerAccounts?.map((AccountID, i) => {
          return {
            RowID: i + 1,
            AccountID: AccountID,
            CreateNewAccount: 0,
          }
        })
      } else {
        AccountIDs = [
          {
            RowID: 1,
            AccountID: 0,
            CreateNewAccount: 1,
          },
        ]
      }
      formData.CustomerAccounts = AccountIDs
      let DataToSend = {
        CustomerBranchID: 0,
        CustomerID: CustomerID,
        BranchID: formData?.CustomerBranch,
        BranchAddress: formData?.BranchAddress,
        ContactPersonName: formData?.ContactPersonName,
        ContactPersonNo: formData?.ContactPersonNo,
        ContactPersonEmail: formData?.ContactPersonEmail,
        Description: formData?.Description,
        InActive: formData?.InActive ? 1 : 0,
        AccountIDs: JSON.stringify(formData?.CustomerAccounts),
        EntryUserID: user.userID,
      }

      const { data } = await axios.post(
        apiUrl + "/EduIMS/CustomerBranchInsertUpdate",
        DataToSend
      )

      if (data.success === true) {
        reset()
        ShowSuccessToast(
          `${pageTitles?.branch || "Customer Branch"} saved successfully!`
        )
        queryClient.invalidateQueries({ queryKey: ["customerBranchesDetail"] })
        queryClient.invalidateQueries({
          queryKey: ["customerAccounts", CustomerID],
        })
      } else {
        ShowErrorToast(data.message)
      }
    },
    onError: () => {
      ShowErrorToast("Error while saving data!")
    },
  })

  function onSubmit(data) {
    if (CustomerID === 0) {
      ShowErrorToast("No Customer Found!!")
    } else {
      customerBranchMutation.mutate(data)
    }
  }

  const createNewLedger = watch("CreateNewAccount")

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={preventFormByEnterKeySubmission}
      >
        <FormRow className="place-items-center">
          <FormColumn lg={4} xl={4} md={6}>
            <FormLabel>
              {pageTitles?.branch || "Customer Branch"} Title
              <span className="text-danger fw-bold ">*</span>
              <AllCustomersBranchEntryModal
                CustomerID={CustomerID}
                pageTitles={pageTitles}
              />
            </FormLabel>

            <div>
              <CDropDownField
                control={control}
                name="CustomerBranch"
                disabled={!isEnable}
                options={CustomersBranch}
                optionLabel="BranchTitle"
                optionValue="BranchID"
                placeholder="Select a branch"
                required={true}
              />
            </div>
          </FormColumn>
          <FormColumn lg={4} xl={4} md={6}>
            <FormLabel>
              Customer Ledgers
              <span className="text-danger fw-bold ">*</span>
              <CustomerAccountEntryModal CustomerID={CustomerID} />
            </FormLabel>
            <div>
              <CMultiSelectField
                control={control}
                name="CustomerAccounts"
                disabled={createNewLedger || !isEnable}
                options={CustomerAccounts}
                optionLabel="AccountTitle"
                optionValue="AccountID"
                placeholder="Select an account"
                required={!createNewLedger}
              />
            </div>
          </FormColumn>
          <FormColumn lg={4} xl={4} md={6}>
            <FormLabel></FormLabel>
            <div>
              <CheckBox
                control={control}
                ID={"CreateNewAccount"}
                Label={"Create New Ledger"}
                isEnable={isEnable}
                onChange={() => {
                  resetField("CustomerAccounts")
                }}
              />
            </div>
          </FormColumn>
        </FormRow>

        <FormRow>
          <FormColumn lg={12} xl={12} md={12}>
            <FormLabel>
              {pageTitles?.branch || "Customer Branch"} Address
            </FormLabel>
            <div>
              <TextInput
                control={control}
                ID={"BranchAddress"}
                focusOptions={() => setFocus("ContactPersonName")}
                isEnable={isEnable}
              />
            </div>
          </FormColumn>
        </FormRow>

        <FormRow>
          <FormColumn lg={4} xl={4} md={6}>
            <FormLabel>Contact Person Name</FormLabel>
            <div>
              <TextInput
                control={control}
                ID={"ContactPersonName"}
                focusOptions={() => setFocus("ContactPersonNo")}
                isEnable={isEnable}
              />
            </div>
          </FormColumn>

          <FormColumn lg={4} xl={4} md={6}>
            <FormLabel>Contact Person No</FormLabel>
            <div>
              <TextInput
                control={control}
                ID={"ContactPersonNo"}
                focusOptions={() => setFocus("ContactPersonEmail")}
                isEnable={isEnable}
              />
            </div>
          </FormColumn>

          <FormColumn lg={4} xl={4} md={6}>
            <FormLabel>Contact Person Email</FormLabel>
            <div>
              <TextInput
                control={control}
                ID={"ContactPersonEmail"}
                focusOptions={() => setFocus("Description")}
                isEnable={isEnable}
              />
            </div>
          </FormColumn>
        </FormRow>

        <FormRow>
          <FormColumn lg={12} xl={12} md={6}>
            <FormLabel>Descripiton</FormLabel>
            <div>
              <TextInput
                control={control}
                ID={"Description"}
                focusOptions={() => setFocus("InActive")}
                isEnable={isEnable}
              />
            </div>
          </FormColumn>
        </FormRow>

        <FormRow>
          <FormColumn lg={4} xl={4} md={6}>
            <div className="mt-2">
              <CheckBox
                control={control}
                ID={"InActive"}
                Label={"InActive"}
                isEnable={isEnable}
              />
            </div>
          </FormColumn>
        </FormRow>

        <FormRow>
          <div className="flex align-items-center gap-2 ml-2 mt-2">
            <Button
              disabled={!isEnable || customerBranchMutation.isPending}
              label={customerBranchMutation?.isPending ? `Adding...` : "Add"}
              className="rounded text-center"
              severity="success"
              type="button"
              style={{
                padding: "0.3rem 1.25rem",
                fontSize: ".8em",
              }}
              loading={customerBranchMutation.isPending}
              loadingIcon={"pi pi-spin pi-spinner"}
              onClick={() => {
                handleSubmit(onSubmit)()
              }}
            />
            <Button
              disabled={!isEnable}
              label="Clear"
              className="rounded text-center"
              severity="danger"
              type="button"
              style={{
                padding: "0.3rem 1.25rem",

                fontSize: ".8em",
              }}
              onClick={() => reset()}
            />
          </div>
        </FormRow>
      </form>
    </>
  )
}

function CustomerBranchesDataTable(props) {
  const queryClient = useQueryClient()
  const { pageTitles, isEnable: isGloballyEnable } = props
  const [visible, setVisible] = useState(false)
  const { CustomerID } = props
  const [filters, setFilters] = useState({
    CustomerBranchTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })
  const [CustomerBranchID, setCustomerBranchID] = useState(0)
  const [isEnable, setIsEnable] = useState(false)
  const [CustomerBranchData, setCustomerBranchData] = useState()

  const { user } = useContext(AuthContext)
  const { register, setValue, handleSubmit, watch, control } = useForm()

  const { data: CustomerBranches } = useQuery({
    queryKey: ["customerBranchesDetail", CustomerID],
    queryFn: () => fetchCustomerBranchesByCustomerID(CustomerID, user.userID),
    enabled: CustomerID !== 0,
    initialData: [],
  })

  const customerAccountEntryMutation = useMutation({
    mutationFn: async (formData) => {
      let AccountIDs = []

      if (formData?.CustomerAccounts?.length > 0) {
        AccountIDs = formData?.CustomerAccounts?.map((AccountID, i) => {
          return {
            RowID: i + 1,
            AccountID: AccountID,
            CreateNewAccount: 0,
          }
        })
      } else {
        AccountIDs = [
          {
            RowID: 1,
            AccountID: 0,
            CreateNewAccount: 1,
          },
        ]
      }
      formData.CustomerAccounts = AccountIDs
      let DataToSend = {
        CustomerBranchID: formData?.CustomerBranchID,
        CustomerID: CustomerID,
        BranchID: formData?.CustomerBranch,
        BranchAddress: formData?.BranchAddress,
        ContactPersonName: formData?.ContactPersonName,
        ContactPersonNo: formData?.ContactPersonNo,
        ContactPersonEmail: formData?.ContactPersonEmail,
        Description: formData?.Description,
        InActive: formData?.InActive ? 1 : 0,
        AccountIDs: JSON.stringify(formData?.CustomerAccounts),
        EntryUserID: user.userID,
      }

      const { data } = await axios.post(
        apiUrl + "/EduIMS/CustomerBranchInsertUpdate",
        DataToSend
      )

      if (data.success === true) {
        ShowSuccessToast(
          `${pageTitles?.branch || "Customer Branch"} updated! successfully!`
        )
        queryClient.invalidateQueries({ queryKey: ["customerBranchesDetail"] })
        queryClient.invalidateQueries({
          queryKey: ["customerAccounts", CustomerID],
        })
        setVisible(false)
      } else {
        ShowErrorToast(data.message)
      }
    },
    onError: () => {
      ShowErrorToast("Error while saving data!")
    },
  })

  function onSubmit(data) {
    customerAccountEntryMutation.mutate(data)
  }

  const { data: CustomersBranch } = useQuery({
    queryKey: ["customersBranch"],
    queryFn: () => fetchAllCustomersBranch(),
    initialData: [],
  })

  const { data: CustomerAccounts } = useQuery({
    queryKey: ["customerAccounts", CustomerID],
    queryFn: () => fetchAllCustomerAccountsForSelect(CustomerID),
    enabled: CustomerID !== 0,
    initialData: [],
  })

  const {
    render: DeleteModal,
    handleShow: handleDeleteShow,
    handleClose: handleDeleteClose,
    setIdToDelete,
  } = useDeleteModal(handleDelete)

  const deleteMutation = useMutation({
    mutationFn: deleteCustomerBranchByID,
    onSuccess: (response) => {
      if (response === true) {
        queryClient.invalidateQueries({ queryKey: ["customerBranchesDetail"] })
      }
    },
  })

  useEffect(() => {
    async function fetchCustomerBranch() {
      if (
        CustomerBranchID !== undefined &&
        CustomerBranchID !== null &&
        CustomerBranchID !== 0
      ) {
        const { data } = await axios.post(
          `${apiUrl}/EduIMS/ViewCustomerBranchWhere?CustomerBranchID=${CustomerBranchID}&LoginUserID=${user.userID}`
        )
        if (!data) {
          ShowErrorToast("Network Error Occured!")
        }

        setCustomerBranchData(data)
      } else {
        setCustomerBranchData(null)
      }
    }
    if (CustomerBranchID !== 0) {
      fetchCustomerBranch()
    }
  }, [CustomerBranchID])

  useEffect(() => {
    if (CustomerBranchID !== 0 && CustomerBranchData?.BracnhInfo) {
      setValue(
        "CustomerBranchID",
        CustomerBranchData?.BracnhInfo[0].CustomerBranchID
      )
      setValue("CustomerBranch", CustomerBranchData?.BracnhInfo[0].BranchID)
      setValue("BranchAddress", CustomerBranchData?.BracnhInfo[0].BranchAddress)
      setValue(
        "ContactPersonName",
        CustomerBranchData?.BracnhInfo[0].ContactPersonName
      )
      setValue(
        "ContactPersonNo",
        CustomerBranchData?.BracnhInfo[0].ContactPersonNo
      )
      setValue(
        "ContactPersonEmail",
        CustomerBranchData?.BracnhInfo[0].ContactPersonEmail
      )
      setValue("Description", CustomerBranchData?.BracnhInfo[0].Description)
      setValue("InActive", CustomerBranchData?.BracnhInfo[0].InActive)
      setValue(
        "CustomerAccounts",
        CustomerBranchData?.Accounts.map((acc) => acc.AccountID)
      )
    }
  }, [CustomerBranchID, CustomerBranchData])

  function handleDelete(BranchID) {
    deleteMutation.mutate({
      CustomerBranchID: BranchID,
      LoginUserID: user.userID,
    })
    handleDeleteClose()
    setIdToDelete(0)
  }

  const createNewLedger = watch("CreateNewAccount")

  return (
    <>
      <>
        <DataTable
          className="mt-2"
          showGridlines
          value={CustomerBranches?.data || []}
          dataKey="CustomerBranchID"
          removableSort
          emptyMessage={`No ${
            pageTitles?.branch?.toLowerCase() ?? "customer branch"
          }`}
          filters={filters}
          filterDisplay="row"
          resizableColumns
          size="small"
          selectionMode="single"
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column
            body={(rowData) => (
              <>
                <div className="flex align-items-center gap-1">
                  <Button
                    icon="pi pi-eye"
                    severity="secondary"
                    size="small"
                    className="rounded"
                    style={{
                      padding: "0.3rem .7rem",
                      fontSize: ".8em",
                      width: "30px",
                    }}
                    onClick={() => {
                      setVisible(true)
                      setCustomerBranchID(rowData?.CustomerBranchID)
                      setIsEnable(false)
                    }}
                  />
                  <Button
                    disabled={!isGloballyEnable}
                    icon="pi pi-pencil"
                    severity="success"
                    size="small"
                    className="rounded"
                    style={{
                      padding: "0.3rem .7rem",
                      fontSize: ".8em",
                      width: "30px",
                    }}
                    onClick={() => {
                      setVisible(true)
                      setCustomerBranchID(rowData?.CustomerBranchID)
                      setIsEnable(true)
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
                      handleDeleteShow(rowData?.CustomerBranchID)
                    }}
                  />
                </div>
              </>
            )}
            header="Actions"
            resizeable={false}
            style={{
              minWidth: "8rem",
              maxWidth: "8rem",
              width: "8rem",
              textAlign: "center",
            }}
          ></Column>
          <Column
            field="BranchTitle"
            filter
            filterPlaceholder={`Search by ${
              pageTitles?.branch || "customer branch"
            }`}
            sortable
            header={`${pageTitles?.branch || "Customer Branch"} Title`}
            style={{ minWidth: "20rem" }}
          ></Column>
        </DataTable>

        <form onKeyDown={preventFormByEnterKeySubmission}>
          <div className="card flex justify-content-center">
            <Dialog
              header={`Edit ${pageTitles?.branch || "Customer Branch"}`}
              visible={visible}
              onHide={() => setVisible(false)}
              style={{ width: "80vw", height: "75vh" }}
              footer={
                <>
                  {!isEnable ? (
                    <>
                      <Button
                        label="Edit"
                        severity="success"
                        className="rounded"
                        type="button"
                        onClick={() => {
                          setIsEnable(true)
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <Button
                        label={
                          customerAccountEntryMutation.isPending
                            ? "Updating..."
                            : "Update"
                        }
                        severity="success"
                        className="rounded"
                        type="button"
                        loading={customerAccountEntryMutation.isPending}
                        loadingIcon="pi pi-spin pi-spinner"
                        onClick={() => {
                          handleSubmit(onSubmit)()
                        }}
                      />
                    </>
                  )}
                </>
              }
            >
              <input
                type="text"
                {...register("CustomerBranchID", {
                  valueAsNumber: true,
                })}
                className="visually-hidden "
                style={{ display: "none" }}
              />
              <form
                onSubmit={handleSubmit(onSubmit)}
                onKeyDown={preventFormByEnterKeySubmission}
              >
                <FormRow className="place-items-center">
                  <FormColumn lg={4} xl={4} md={6}>
                    <FormLabel>
                      {pageTitles?.branch || "Customer Branch"} Title
                      <span className="text-danger fw-bold ">*</span>
                      <AllCustomersBranchEntryModal
                        CustomerID={CustomerID}
                        pageTitles={pageTitles}
                      />
                    </FormLabel>

                    <div>
                      <CDropDownField
                        control={control}
                        name="CustomerBranch"
                        disabled={!isEnable}
                        options={CustomersBranch}
                        optionLabel="BranchTitle"
                        optionValue="BranchID"
                        placeholder="Select a branch"
                        required={true}
                      />
                    </div>
                  </FormColumn>
                  <FormColumn lg={4} xl={4} md={6}>
                    <FormLabel>Customer Ledgers</FormLabel>
                    <span className="text-danger fw-bold ">*</span>
                    <CustomerAccountEntryModal CustomerID={CustomerID} />

                    <CMultiSelectField
                      control={control}
                      name="CustomerAccounts"
                      disabled={createNewLedger}
                      options={CustomerAccounts}
                      optionLabel="AccountTitle"
                      optionValue="AccountID"
                      placeholder="Select an account"
                      required={!createNewLedger}
                      showClear={isEnable}
                    />
                  </FormColumn>
                  <FormColumn lg={4} xl={4} md={6}>
                    <FormLabel></FormLabel>
                    <div className="form-control" style={{ marginTop: "5px" }}>
                      <CheckBox
                        control={control}
                        ID={"CreateNewAccount"}
                        Label={"Create New Ledger"}
                        isEnable={isEnable}
                        onChange={() => {
                          setValue("CustomerAccounts", [])
                        }}
                      />
                    </div>
                  </FormColumn>
                </FormRow>

                <FormRow>
                  <FormColumn>
                    <FormLabel>
                      {pageTitles?.branch || "Customer Branch"} Address
                    </FormLabel>
                    <div>
                      <TextInput
                        control={control}
                        ID={"BranchAddress"}
                        focusOptions={() => setFocus("ContactPersonName")}
                        isEnable={isEnable}
                      />
                    </div>
                  </FormColumn>
                </FormRow>

                <FormRow>
                  <FormColumn lg={4} xl={4} md={6}>
                    <FormLabel>Contact Person Name</FormLabel>
                    <div>
                      <TextInput
                        control={control}
                        ID={"ContactPersonName"}
                        focusOptions={() => setFocus("ContactPersonNo")}
                        isEnable={isEnable}
                      />
                    </div>
                  </FormColumn>

                  <FormColumn lg={4} xl={4} md={6}>
                    <FormLabel>Contact Person No</FormLabel>
                    <div>
                      <TextInput
                        control={control}
                        ID={"ContactPersonNo"}
                        focusOptions={() => setFocus("ContactPersonEmail")}
                        isEnable={isEnable}
                      />
                    </div>
                  </FormColumn>

                  <FormColumn lg={4} xl={4} md={6}>
                    <FormLabel>Contact Person Email</FormLabel>
                    <div>
                      <TextInput
                        control={control}
                        ID={"ContactPersonEmail"}
                        focusOptions={() => setFocus("Description")}
                        isEnable={isEnable}
                      />
                    </div>
                  </FormColumn>
                </FormRow>

                <FormRow>
                  <FormColumn lg={12} xl={12} md={6}>
                    <FormLabel>Descripiton</FormLabel>
                    <div>
                      <TextInput
                        control={control}
                        ID={"Description"}
                        focusOptions={() => setFocus("InActive")}
                        isEnable={isEnable}
                      />
                    </div>
                  </FormColumn>
                </FormRow>

                <FormRow>
                  <FormColumn lg={12} xl={12} md={6}>
                    <div className="mt-2">
                      <CheckBox
                        control={control}
                        ID={"InActive"}
                        Label={"InActive"}
                        isEnable={isEnable}
                      />
                    </div>
                  </FormColumn>
                </FormRow>
              </form>
            </Dialog>
          </div>
        </form>
        {DeleteModal}
      </>
    </>
  )
}
