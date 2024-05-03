import { createContext, useState, useContext } from "react"
import { preventFormByEnterKeySubmission } from "../../utils/CommonFunctions"
import { Form, Row, Col, FormLabel } from "react-bootstrap"
import { Button } from "primereact/button"
import { useForm } from "react-hook-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AuthContext } from "../../context/AuthContext"
import { toast } from "react-toastify"
import axios from "axios"
import { fetchCustomerAccountByID } from "./CustomerEntryAPI"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { FilterMatchMode } from "primereact/api"
import { Dialog } from "primereact/dialog"
import { FormColumn, FormRow } from "../Layout/LayoutComponents"
import TextInput from "../Forms/TextInput"

let pageTitles = {}
import { apiUrl } from "../../../public/COSTANTS"

const AccountEntryContext = createContext()
const AccountEntryProvider = ({ children }) => {
  const [createdAccountID, setCreatedAccountID] = useState(0)
  return (
    <AccountEntryContext.Provider
      value={{ createdAccountID, setCreatedAccountID }}
    >
      {children}
    </AccountEntryContext.Provider>
  )
}

function CustomerAccountEntry(props) {
  const { CustomerID, isEnable = true } = props
  return (
    <>
      <AccountEntryProvider>
        <CustomerAccountDataTableHeader
          CustomerID={CustomerID}
          isEnable={isEnable}
        />
        <div className="mt-3">
          <CustomerAccountDetailTable
            CustomerID={CustomerID}
            isEnable={isEnable}
          />
        </div>
      </AccountEntryProvider>
    </>
  )
}

export default CustomerAccountEntry

function CustomerAccountDataTableHeader(props) {
  const queryClient = useQueryClient()

  const { CustomerID, isEnable } = props
  const { user } = useContext(AuthContext)
  const { setCreatedAccountID } = useContext(AccountEntryContext)

  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: {
      AccountTitle: "",
    },
  })

  const customerAccountEntryMutation = useMutation({
    mutationFn: async (formData) => {
      let DataToSend = {
        AccountID: 0,
        AccountTitle: formData?.AccountTitle,
        CustomerID: CustomerID,
        EntryUserID: user.userID,
      }
      const { data } = await axios.post(
        apiUrl + "/EduIMS/CustomerAccountsInsertUpdate",
        DataToSend
      )
      if (data.success === true) {
        reset()
        toast.success("Ledger saved successfully!")
        queryClient.invalidateQueries({ queryKey: ["customerAccountsDetail"] })
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
      customerAccountEntryMutation.mutate(data)
    }
  }

  return (
    <>
      <form
        // onSubmit={handleSubmit(onSubmit)}
        onKeyDown={preventFormByEnterKeySubmission}
      >
        <FormRow className="place-items-end">
          <FormColumn lg={11} xl={11} sm={11}>
            <FormLabel>Customer Ledger Title</FormLabel>
            <div>
              <TextInput
                control={control}
                ID={"AccountTitle"}
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
              disabled={!isEnable || customerAccountEntryMutation.isPending}
              label={
                customerAccountEntryMutation?.isPending ? `Adding...` : "Add"
              }
              loadingIcon={"pi pi-spin pi-spinner"}
              loading={customerAccountEntryMutation.isPending}
            ></Button>
          </FormColumn>
        </FormRow>
      </form>
    </>
  )
}

function CustomerAccountDetailTable(props) {
  const queryClient = useQueryClient()
  const [visible, setVisible] = useState(false)
  const { CustomerID, isEnable } = props
  const [filters, setFilters] = useState({
    AccountTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })

  const { user } = useContext(AuthContext)
  const { register, setValue, handleSubmit, control } = useForm()

  const { data: CustomerAccounts } = useQuery({
    queryKey: ["customerAccountsDetail", CustomerID],
    queryFn: () => fetchCustomerAccountByID(CustomerID, user.userID),
    enabled: CustomerID !== 0,
    initialData: [],
  })

  const customerAccountEntryMutation = useMutation({
    mutationFn: async (formData) => {
      let DataToSend = {
        AccountID: formData?.AccountID,
        AccountTitle: formData?.AccountTitle,
        CustomerID: CustomerID,
        EntryUserID: user.userID,
      }
      const { data } = await axios.post(
        apiUrl + "/EduIMS/CustomerAccountsInsertUpdate",
        DataToSend
      )

      if (data.success === true) {
        toast.success("Ledger updated successfully!")
        queryClient.invalidateQueries({ queryKey: ["customerAccountsDetail"] })
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

  function onSubmit(data) {
    customerAccountEntryMutation.mutate(data)
  }

  return (
    <>
      <DataTable
        className="mt-2"
        showGridlines
        value={CustomerAccounts?.data || []}
        dataKey="AccountID"
        removableSort
        emptyMessage="No customer ledgers found!"
        filters={filters}
        filterDisplay="row"
        resizableColumns
        size="small"
        selectionMode="single"
        tableStyle={{ minWidth: "50rem", height: "" }}
      >
        <Column
          body={(rowData) => (
            <Button
              icon="pi pi-pencil"
              severity="success"
              size="small"
              className="rounded"
              style={{
                padding: "0.3rem 1.25rem",
                fontSize: ".8em",
              }}
              disabled={!isEnable}
              type="button"
              onClick={() => {
                setVisible(true)
                setValue("AccountTitle", rowData?.AccountTitle)
                setValue("AccountID", rowData?.AccountID)
              }}
            />
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
          field="AccountTitle"
          filter
          filterPlaceholder="Search by Customer Ledger"
          sortable
          header="Ledger Title"
          style={{ minWidth: "20rem" }}
        ></Column>
      </DataTable>

      <form onKeyDown={preventFormByEnterKeySubmission}>
        <div className="card flex justify-content-center">
          <Dialog
            header={"Edit Ledger Name"}
            visible={visible}
            onHide={() => {
              setVisible(false)
            }}
            style={{ width: "40vw" }}
            footer={
              <Button
                severity="success"
                className="rounded"
                label={
                  customerAccountEntryMutation.isPending
                    ? "Updating..."
                    : "Update"
                }
                loading={customerAccountEntryMutation.isPending}
                loadingIcon="pi pi-spin pi-spinner"
                onClick={() => {
                  handleSubmit(onSubmit)()
                }}
              />
            }
          >
            <input
              type="text"
              {...register("AccountID", {
                valueAsNumber: true,
              })}
              className="visually-hidden "
              style={{ display: "none" }}
            />
            <FormRow className="place-items-end">
              <FormColumn lg={11} xl={11} sm={11}>
                <FormLabel>Customer Ledger Title</FormLabel>
                <div>
                  <TextInput
                    control={control}
                    ID={"AccountTitle"}
                    isEnable={isEnable}
                    required={true}
                  />
                </div>
              </FormColumn>
            </FormRow>
          </Dialog>
        </div>
      </form>
    </>
  )
}

// function CustomerAccountDataTableDetail() {
//   const { createdAccountID, setCreatedAccountID } =
//     useContext(AccountEntryContext);
//

//   const { user } = useContext(AuthContext);

//   const methods = useForm();
//   const { fields, append, remove } = useFieldArray({
//     name: "branchDetail",
//   });

//   useEffect(() => {
//     async function fetchCustomerAccount() {
//       if (
//         createdAccountID !== undefined &&
//         createdAccountID !== null &&
//         createdAccountID !== 0
//       ) {
//         const data = await fetchCustomerAccountByID(
//           createdAccountID,
//           user.userID
//         );

//
//       } else {
//         setBankAccount(null);
//         setIsEnable(true);
//         reset(defaultValues);
//         setTimeout(() => {
//           resetSelectValues();
//         }, 200);
//       }
//     }
//     if (createdAccountID !== 0) {
//       fetchCustomerAccount();
//     }
//     return () => {
//       setCreatedAccountID(0);
//     };
//   }, [createdAccountID]);

//   return (
//     <>
//       <FormProvider {...methods}>
//         <form>
//           <Table className="mt-2">
//             <thead>
//               <tr>
//                 <th>No.</th>
//                 <th>Branch Title</th>
//                 <th>Customer Accounts</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {fields.map((field, index) => {
//                 return (
//                   <tr key={field.id}>
//                     <CustomerAccountDataTableDetailRow
//                       field={field}
//                       remove={remove}
//                       index={index}
//                     />
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </Table>
//         </form>
//       </FormProvider>
//     </>
//   );
// }

// function CustomerAccountDataTableDetailRow() {
//   const { register } = useFormContext();
//   const { remove, index } = props;
//   return (
//     <>
//       <td>
//         <InputText
//           // type="text"
//           required
//           className="form-control"
//           {...register(`accountsDetail.${index}.AccountTitle`)}
//         />
//       </td>
//       <td>
//         <Button
//           label="Previous"
//           icon="pi pi-arrow-left"
//           className="p-button-p text-center"
//         />
//         <Button
//           label="Next"
//           icon="pi pi-arrow-left"
//           onClick={() => remove(index)}
//           className="p-button-p text-center"
//         />
//       </td>
//     </>
//   );
// }
