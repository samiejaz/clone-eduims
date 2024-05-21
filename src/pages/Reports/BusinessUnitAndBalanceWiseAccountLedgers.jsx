import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import React, { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "../../utils/enums"
import {
  fetchAllCustomerAccountsForSelect,
  fetchAllOldCustomersForSelect,
} from "../../api/SelectData"
import { CDropDownField } from "../../components/Forms/form"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import { decryptID, encryptID } from "../../utils/crypto"
import { useSearchParams } from "react-router-dom"
import usePrintReportPDFHook from "../../hooks/CommonHooks/usePrintReportPDFHook"
import { useBusinessUnitsSelectData } from "../../hooks/SelectData/useSelectData"
import { Filter } from "lucide-react"
import {
  FormColumn,
  FormLabel,
  FormRow,
} from "../../components/Layout/LayoutComponents"
import { CommonDateToAndDateFromFields } from "../../components/CommonFormFields"
import { fetchAllAccountsDataBusinessUnitWiseForReport } from "../../api/ReportsData"
import {
  formatDateWithSymbol,
  getSumOfPropertyInObjectStartingWith,
} from "../../utils/CommonFunctions"
import { useAuthProvider } from "../../context/AuthContext"
import { useReportViewerHook } from "../../hooks/CommonHooks/commonhooks"

const BusinessUnitAndBalanceWiseAccountLedgers = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryParams = new URLSearchParams(searchParams)
  const [reportQueryParams, setReportQueryParams] = useState(null)

  const { user } = useAuthProvider()

  const CustomerID =
    queryParams.get("customer") !== null
      ? decryptID(queryParams.get("customer"))
      : null

  const { data: customerSelectData } = useQuery({
    queryKey: [QUERY_KEYS.ALL_CUSTOMER_QUERY_KEY],
    queryFn: fetchAllOldCustomersForSelect,
    refetchOnWindowFocus: false,
    staleTime: 600000,
    refetchInterval: 600000,
  })

  const BusinessUnitSelectData = useBusinessUnitsSelectData()
  const { data: CustomerAccountsData } = useQuery({
    queryKey: ["CustomerAccountsData", reportQueryParams],
    queryFn: () =>
      fetchAllAccountsDataBusinessUnitWiseForReport(reportQueryParams),
    enabled: reportQueryParams !== null,
    refetchOnWindowFocus: false,
  })

  const method = useForm({
    defaultValues: {
      CustomerID: null,
      DateFrom: new Date(),
      DateTo: new Date(),
    },
  })

  function generateReportQueryParams() {
    let CustomerID = method.getValues("CustomerID")
    let DateFrom = method.getValues("DateFrom")
    let DateTo = method.getValues("DateTo")

    let newQuerParams = `?LoginUserID=${user.userID}&CustomerID=${CustomerID === null ? 0 : CustomerID}&DateFrom=${formatDateWithSymbol(DateFrom)}&DateTo=${formatDateWithSymbol(DateTo)}`
    setReportQueryParams(newQuerParams)
  }

  return (
    <>
      <FormProvider {...method}>
        <div className="">
          <div>
            <h1 className="text-3xl">Businesss Unit Wise Ledger</h1>
          </div>
          <FormRow>
            <FormColumn lg={6} xl={6} md={6}>
              <FormLabel>Customer</FormLabel>
              <CDropDownField
                control={method.control}
                name={"CustomerID"}
                optionLabel="CustomerName"
                optionValue="CustomerID"
                placeholder="Select a customer"
                options={customerSelectData}
                filter={true}
                onChange={(e) => {
                  setSearchParams({ customer: encryptID(e.value) })
                  generateReportQueryParams()
                }}
              />
            </FormColumn>

            <CommonDateToAndDateFromFields
              cols={3}
              onChangeDateFrom={generateReportQueryParams}
              onChangeDateTo={generateReportQueryParams}
            />
          </FormRow>
        </div>
        <hr />
        <div>
          <AccountsGrid
            headers={BusinessUnitSelectData.data}
            accountsData={CustomerAccountsData}
          />
        </div>
      </FormProvider>
    </>
  )
}

export default BusinessUnitAndBalanceWiseAccountLedgers

const AccountsGrid = ({ headers = [], accountsData = [] }) => {
  const [selectedCell, setSelectedCell] = useState(null)

  const { generateReport } = useReportViewerHook({
    controllerName: "/Reports/CustomerLedgerReport",
  })
  const method = useFormContext()

  function handleCellSelection(e) {
    let AccountID = e.value.rowData.AccountID
    let BusinessUnitID = e.value.column.props.columnKey
    let BusinessUnitTitle = e.value.column.props.header
    let CustomerID = method.getValues("CustomerID")
    let DateFrom = method.getValues("DateFrom")
    let DateTo = method.getValues("DateTo")

    let reportQueryParams = null
    if (BusinessUnitTitle === "Total") {
    } else {
      reportQueryParams = `?BusinessUnitID=${BusinessUnitID}&CustomerID=${CustomerID}&AccountID=${AccountID}&DateFrom=${formatDateWithSymbol(DateFrom ?? new Date())}&DateTo=${formatDateWithSymbol(DateTo ?? new Date())}&Export=p`
      generateReport(reportQueryParams)
    }
    setSelectedCell(e.value)
  }

  const isCellSelectable = (event) => event.data.field !== "AccountTitle"

  const totalTemplate = (rowData) => {
    let sumOfCurrentRowBalances = getSumOfPropertyInObjectStartingWith(
      rowData,
      "BusinessUnit_"
    )
    return <>{sumOfCurrentRowBalances}</>
  }

  return (
    <>
      <DataTable
        showGridlines
        value={accountsData}
        emptyMessage="No ledgers found!"
        resizableColumns
        cellSelection
        selectionMode="single"
        selection={selectedCell}
        onSelectionChange={handleCellSelection}
        size="small"
        tableStyle={{ minWidth: "50rem" }}
        scrollable
        scrollHeight="400px"
        isDataSelectable={isCellSelectable}
        filterIcon={() => <Filter color="white" />}
      >
        <Column
          header="Business Unit ID"
          hidden
          field="AccountID"
          style={{ minWidth: "10rem", width: "10rem" }}
        ></Column>
        <Column
          header="Accounts"
          frozen
          field="AccountTitle"
          headerStyle={{
            background: "#10B981",
            color: "white",
          }}
          pt={{
            filterMenuButton: {
              className: "h-royalblue",
            },
          }}
          filter
          style={{ minWidth: "10rem", width: "10rem" }}
        ></Column>
        {headers &&
          headers.map((header, index) => (
            <Column
              header={header.BusinessUnitName}
              key={header.BusinessUnitID}
              headerStyle={{
                background: "#10B981",
                color: "white",
              }}
              style={{ minWidth: "10rem", width: "10rem" }}
              field={`BusinessUnit_${header.BusinessUnitID}`}
              bodyStyle={{ textAlign: "center" }}
              columnKey={header.BusinessUnitID}
            ></Column>
          ))}
        <Column
          header="Total"
          alignFrozen="right"
          frozen={true}
          headerStyle={{
            background: "#10B981",
            color: "white",
          }}
          bodyStyle={{ textAlign: "center" }}
          style={{ minWidth: "7rem", width: "7rem" }}
          field="total"
          body={totalTemplate}
        ></Column>
      </DataTable>
    </>
  )
}
