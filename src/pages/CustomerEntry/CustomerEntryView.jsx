import { Controller, FormProvider, useForm } from "react-hook-form"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import CustomerEntry from "../../components/CustomerEntryModal/CustomerEntry"
import CustomerAccountEntry from "../../components/CustomerEntryModal/CustomerAccountsEntry"
import CustomerBranchEntry from "../../components/CustomerEntryModal/CustomerBranchEntry"
import { TabView, TabPanel } from "primereact/tabview"

import { Button } from "primereact/button"
import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { toast } from "react-toastify"
import { BreadCrumb } from "primereact/breadcrumb"
import { fetchAllOldCustomersForSelect } from "../../api/SelectData"
import { ROUTE_URLS } from "../../utils/enums"
import { Dropdown } from "primereact/dropdown"
import { apiUrl } from "../../../public/COSTANTS"
import { FormColumn, FormRow } from "../../components/Layout/LayoutComponents"

const items = [{ label: "Customer Detail" }]

export default function GenNewCustomerView() {
  const [CustomerID, setCustomerID] = useState(0)
  const [isGloballyEnable, setIsGloballyEnable] = useState()
  const params = useParams()
  const location = useLocation()
  const { search } = location
  const url = new URLSearchParams(search)
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const { control } = useForm()
  const customerEntryForm = useForm()
  const customerBranchFrom = useForm()

  useEffect(() => {
    setCustomerID(params?.CustomerID)
    setIsGloballyEnable(url.get("viewMode") === "edit" ? true : false)
  }, [])

  const home = {
    label: "Customers",
    command: () => navigate(ROUTE_URLS.CUSTOMERS.CUSTOMER_ENTRY),
  }

  let customerMutation = useMutation({
    mutationFn: async (formData) => {
      let DataToSend = {
        CustomerID: CustomerID !== 0 ? CustomerID : params.CustomerID,
        ContactPerson1Email: formData?.ContactPerson1Email,
        ContactPerson1Name: formData?.ContactPerson1Name,
        ContactPerson1No: formData?.ContactPerson1No,
        CustomerBusinessAddress: formData?.CustomerBusinessAddress,
        CustomerBusinessName: formData.CustomerBusinessName,
        CustomerName: formData.CustomerName,
        Description: formData?.Description,
        InActive: formData?.InActive === false ? 0 : 1,
        EntryUserID: user.userID,
        CountryID: formData.CountryID,
        TehsilID: formData.TehsilID,
        BusinessTypeID: formData.BusinessTypeID,
        BusinessNature: formData.BusinessNatureID,
      }

      const { data } = await axios.post(
        apiUrl + "/EduIMS/NewCustomerInsert",
        DataToSend
      )

      if (data.success === true) {
        if (+params.CustomerID) {
          toast.success("Customer updated successfully!")
        } else {
          toast.success("Customer saved successfully!")
        }
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
    customerMutation.mutate(data)
  }

  const { data } = useQuery({
    queryKey: ["oldcustomers"],
    queryFn: () => fetchAllOldCustomersForSelect(),
    initialData: [],
  })

  return (
    <>
      <div className="bg__image mt-4">
        <div className="d-flex justify-content-between ">
          <div>
            <BreadCrumb
              model={items}
              home={home}
              style={{ border: "none", background: "inherit" }}
            />
          </div>
          {isGloballyEnable === false && (
            <>
              <div>
                <Button
                  style={{ marginRight: "40px" }}
                  onClick={() => setIsGloballyEnable(true)}
                  severity="warning"
                  label="Edit"
                  icon="pi pi-pencil"
                  className="rounded"
                ></Button>
              </div>
            </>
          )}
        </div>
        <div className="d-flex text-dark p-3 mb-4 ">
          <FormRow className="w-full">
            <FormColumn lg={6} xl={6}>
              <h2 className="text-start my-auto">Customer Detail</h2>
            </FormColumn>
            <FormColumn lg={6} xl={6}>
              <Controller
                name="Customers"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    id={field.name}
                    value={field.value}
                    optionValue="CustomerID"
                    optionLabel="CustomerName"
                    placeholder="Select a customer"
                    options={data}
                    focusInputRef={field.ref}
                    onChange={(e) => {
                      field.onChange(e.value)
                      if (e.value === undefined) {
                        setCustomerID(params?.CustomerID)
                      } else {
                        setCustomerID(e.value)
                      }
                    }}
                    style={{ width: "100%" }}
                    filter
                    showClear
                  />
                )}
              />
            </FormColumn>
          </FormRow>
        </div>
        <div className="card">
          <TabView>
            <TabPanel header="Customer">
              <FormProvider {...customerEntryForm}>
                <CustomerEntry
                  CustomerID={CustomerID}
                  isEnable={isGloballyEnable}
                />
                <div>
                  <Button
                    type="button"
                    severity="success"
                    label="Save"
                    className="rounded w-100"
                    onClick={() => {
                      customerEntryForm.handleSubmit(onSubmit)()
                    }}
                    disabled={!isGloballyEnable}
                  ></Button>
                </div>
              </FormProvider>
            </TabPanel>
            <TabPanel header="Customer Branches">
              <FormProvider {...customerBranchFrom}>
                <CustomerBranchEntry
                  CustomerID={CustomerID}
                  isEnable={isGloballyEnable}
                />
              </FormProvider>
            </TabPanel>
            <TabPanel header="Customer Ledgers ">
              <CustomerAccountEntry
                CustomerID={CustomerID}
                isEnable={isGloballyEnable}
              />
            </TabPanel>
          </TabView>
        </div>
      </div>
    </>
  )
}
