import { FormProvider, useForm, useFormContext } from "react-hook-form"
import {
  CDatePicker,
  CDropDownField,
  CMultiSelectField,
} from "../../components/Forms/form"
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
import { useReportViewerHook } from "../../hooks/CommonHooks/commonhooks"
import { useBusinessUnitsSelectData } from "../../hooks/SelectData/useSelectData"

export default function AccountLedgerReport() {
  document.title = "Account Ledger"
  const method = useForm({
    defaultValues: {
      AccountID: [],
      BusinessUnitID: [],
      CustomerID: null,
    },
  })
  const { generateReport, render } = useReportViewerHook({
    controllerName: "/Reports/CustomerLedgerReport",
  })

  function onSubmit(formData) {
    let BusinessUnitStr =
      formData.BusinessUnitID.length > 0
        ? formData.BusinessUnitID.join(",")
        : ""
    let AccountStr =
      formData.AccountID.length > 0 ? formData.AccountID.join(",") : ""
    let businessUnitQueryParam =
      BusinessUnitStr !== "" ? "&BusinessUnitID=" + BusinessUnitStr : ""
    let AccountIDQueryParam =
      AccountStr !== "" ? "&AccountID=" + AccountStr : ""
    let queryParams = `?CustomerID=${formData.CustomerID}${businessUnitQueryParam}${AccountIDQueryParam}&DateFrom=${formatDateWithSymbol(formData.DateFrom ?? new Date())}&DateTo=${formatDateWithSymbol(formData.DateTo ?? new Date())}&Export=p`
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
            <MultiSelectBusinessUnitField col={4} />
            <CustomerDependentFields />
          </FormProvider>
          <FormColumn lg={2} xl={2} md={6}>
            <FormLabel style={{ fontSize: "14px", fontWeight: "bold" }}>
              Date From
              <span className="text-red-700 fw-bold ">*</span>
            </FormLabel>
            <div>
              <CDatePicker control={method.control} name={"DateFrom"} />
            </div>
          </FormColumn>
          <FormColumn lg={2} xl={2} md={6}>
            <FormLabel style={{ fontSize: "14px", fontWeight: "bold" }}>
              Date To
              <span className="text-red-700 fw-bold ">*</span>
            </FormLabel>
            <div>
              <CDatePicker control={method.control} name={"DateTo"} />
            </div>
          </FormColumn>
          <div className="ml-2 mb-2" style={{ alignSelf: "end" }}>
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
          <span className="text-red-700 fw-bold ">*</span>
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
            required={true}
            onChange={(e) => {
              setCustomerID(e.value)
            }}
          />
        </div>
      </FormColumn>
      <FormColumn lg={4} xl={4} md={12}>
        <FormLabel>Ledger</FormLabel>
        <div>
          <CMultiSelectField
            control={method.control}
            name={`AccountID`}
            optionLabel="AccountTitle"
            optionValue="AccountID"
            placeholder="Select an account"
            options={CustomerAccounts}
          />
        </div>
      </FormColumn>
    </>
  )
}

const MultiSelectBusinessUnitField = ({ col = 3 }) => {
  const businessUnitSelectData = useBusinessUnitsSelectData()
  const method = useFormContext()

  return (
    <>
      <FormColumn lg={col} xl={col} md={12}>
        <FormLabel>Business Unit</FormLabel>
        <CMultiSelectField
          control={method.control}
          name="BusinessUnitID"
          options={businessUnitSelectData.data}
          optionLabel="BusinessUnitName"
          optionValue="BusinessUnitID"
          placeholder="Select a business unit"
        />
      </FormColumn>
    </>
  )
}
