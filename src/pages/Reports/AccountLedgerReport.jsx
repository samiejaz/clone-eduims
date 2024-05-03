import { FormProvider, set, useForm, useFormContext } from "react-hook-form"
import { CDatePicker, CDropDownField } from "../../components/Forms/form"
import {
  FormRow,
  FormColumn,
  FormLabel,
} from "../../components/Layout/LayoutComponents"
import { Button } from "primereact/button"
import {
  fetchAllCustomerAccountsForSelect,
  fetchAllOldCustomersForSelect,
} from "../../api/SelectData"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { QUERY_KEYS } from "../../utils/enums"
import {
  formatDateWithSymbol,
  preventFormByEnterKeySubmission,
} from "../../utils/CommonFunctions"
import axios from "axios"
import { CustomSpinner } from "../../components/CustomSpinner"
import { apiUrl } from "../../../public/COSTANTS"

export default function AccountLedgerReport() {
  document.title = "Account Ledger"
  const method = useForm()
  const { generateReport, render } = useReportViewer()

  function onSubmit(formData) {
    let queryParams = `?AccountID=${formData.AccountID}&DateFrom=${formatDateWithSymbol(formData.DateFrom ?? new Date())}&DateTo=${formatDateWithSymbol(formData.DateTo ?? new Date())}&Export=p`
    generateReport(queryParams)
  }

  return (
    <>
      <div className="flex align-items-center justify-content-center ">
        <h1 className="text-3xl">Account Ledger</h1>
      </div>
      <form onKeyDown={preventFormByEnterKeySubmission}>
        <FormRow>
          <FormProvider {...method}>
            <CustomerDependentFields />
          </FormProvider>
          <FormColumn lg={2} xl={2} md={6}>
            <FormLabel style={{ fontSize: "14px", fontWeight: "bold" }}>
              Date From
              <span className="text-danger fw-bold ">*</span>
            </FormLabel>
            <div>
              <CDatePicker control={method.control} name={"DateFrom"} />
            </div>
          </FormColumn>
          <FormColumn lg={2} xl={2} md={6}>
            <FormLabel style={{ fontSize: "14px", fontWeight: "bold" }}>
              Date To
              <span className="text-danger fw-bold ">*</span>
            </FormLabel>
            <div>
              <CDatePicker control={method.control} name={"DateTo"} />
            </div>
          </FormColumn>
          <div className="ml-2">
            <Button
              label="View"
              severity="primary"
              pt={{
                root: {
                  style: {
                    padding: ".4rem 1rem",
                  },
                },
              }}
              onClick={() => method.handleSubmit(onSubmit)()}
              type="button"
            />
          </div>
          <div className="ml-2 mr-2 min-h-screen w-full mt-2"> {render}</div>
        </FormRow>
      </form>
    </>
  )
}

const useReportViewer = () => {
  const [queryParams, setQueryParams] = useState(null)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["accountLedgerReport", queryParams],
    queryFn: async () => {
      const { data: base64String } = await axios.post(
        apiUrl + "/Reports/CustomerLedgerReport" + queryParams
      )

      return base64String
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    enabled: queryParams !== null,
  })

  // useEffect(() => {
  //   async function fetchReport() {
  //     try {
  //       setIsLoading(true)
  //       const { data: base64String } = await axios.post(
  //         apiUrl + "/Reports/CustomerLedgerReport" + queryParams
  //       )
  //       setData(base64String)
  //       setIsLoading(false)
  //     } catch (err) {
  //       ShowErrorToast(err.message)
  //       setIsLoading(false)
  //     }
  //   }
  //   if (queryParams) {
  //     fetchReport()
  //   }
  // }, [queryParams])

  function generateReport(querParams) {
    setQueryParams(querParams)
  }

  return {
    generateReport,
    render: (
      <>
        {(isLoading || isFetching) && (
          <>
            <CustomSpinner message="Generating report..." />
          </>
        )}
        {data && (
          <>
            <div className="w-full h-full">
              <embed
                width="100%"
                height="100%"
                src={`data:application/pdf;base64,${data}`}
                type="application/pdf"
              />
            </div>
          </>
        )}
      </>
    ),
  }
}

const CustomerDependentFields = () => {
  const method = useFormContext()
  const [CustomerID, setCustomerID] = useState(0)

  const { data: customerSelectData } = useQuery({
    queryKey: [QUERY_KEYS.ALL_CUSTOMER_QUERY_KEY],
    queryFn: fetchAllOldCustomersForSelect,
    refetchOnWindowFocus: false,
    staleTime: 600000,
    refetchInterval: 600000,
  })

  const { data: CustomerAccounts } = useQuery({
    queryKey: [QUERY_KEYS.CUSTOMER_ACCOUNTS_QUERY_KEY, CustomerID],
    queryFn: () => fetchAllCustomerAccountsForSelect(CustomerID),
    refetchOnWindowFocus: false,
    staleTime: 600000,
    refetchInterval: 600000,
  })

  return (
    <>
      <FormColumn lg={4} xl={4} md={12}>
        <FormLabel style={{ fontSize: "14px", fontWeight: "bold" }}>
          Customer
        </FormLabel>
        <div>
          <CDropDownField
            control={method.control}
            name={`CustomerID`}
            optionLabel="CustomerName"
            optionValue="CustomerID"
            placeholder="Select a customer"
            options={customerSelectData}
            focusOptions={() => method.setFocus("AccountID")}
            onChange={(e) => {
              setCustomerID(e.value)
            }}
          />
        </div>
      </FormColumn>
      <FormColumn lg={4} xl={4} md={12}>
        <FormLabel>
          Ledger
          <span className="text-danger fw-bold ">*</span>
        </FormLabel>
        <div>
          <CDropDownField
            control={method.control}
            name={`AccountID`}
            optionLabel="AccountTitle"
            optionValue="AccountID"
            placeholder="Select an account"
            options={CustomerAccounts}
            required={true}
            focusOptions={() => method.setFocus("DateFrom")}
          />
        </div>
      </FormColumn>
    </>
  )
}
