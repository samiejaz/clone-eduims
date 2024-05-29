import React, { useState } from "react"
import { fetchAllAccountsDataBusinessUnitWiseForReport } from "../../api/ReportsData"
import { useQuery } from "@tanstack/react-query"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { useBusinessUnitsSelectData } from "../../hooks/SelectData/useSelectData"
import { getSumOfPropertyInObjectStartingWith } from "../../utils/CommonFunctions"
import { Filter } from "lucide-react"
import { Button } from "primereact/button"
import { Link } from "react-router-dom"
import { ROUTE_URLS } from "../../utils/enums"

const SubsidiarySheetSummary = () => {
  const HEADER_BACKGROUND_COLOR = "#64748B"
  const [showZeroBalances, setShowZeroBalances] = useState(false)
  const { data: CustomerAccountsData } = useQuery({
    queryKey: ["CustomerAccountsData"],
    queryFn: () =>
      fetchAllAccountsDataBusinessUnitWiseForReport(
        "?LoginUserID=1&CustomerID=1&DateFrom=25-May-2024&DateTo=25-May-2024"
      ),
    refetchOnWindowFocus: false,
  })

  const { data: headers } = useBusinessUnitsSelectData({
    refetchOnWindowFocus: false,
  })

  const totalTemplate = (rowData) => {
    let sumOfCurrentRowBalances = 0
    if (rowData.AccountID === "Total") {
      sumOfCurrentRowBalances = CustomerAccountsData.grandTotal
    } else {
      sumOfCurrentRowBalances = getSumOfPropertyInObjectStartingWith(
        rowData,
        "BusinessUnit_"
      )
    }

    return <>{sumOfCurrentRowBalances}</>
  }

  function filteredData() {
    if (showZeroBalances) {
      return CustomerAccountsData?.data
    } else {
      return CustomerAccountsData?.data.filter((item) => {
        return getSumOfPropertyInObjectStartingWith(item, "BusinessUnit_") !== 0
      })
    }
  }
  return (
    <>
      <div className="flex align-items-center justify-content-between gap-2 w-full">
        <Link to={ROUTE_URLS.REPORTS.SUBSIDIARY_SHEET_REPORT_ROUTE}>
          <Button
            onClick={() => setShowZeroBalances((prev) => !prev)}
            label={`Report View`}
            className="mb-2"
            icon={`pi pi-arrow-left`}
            severity="secondary"
            link
            text
          />
        </Link>
        <Button
          onClick={() => setShowZeroBalances((prev) => !prev)}
          label={`${showZeroBalances ? "Hide" : "Show"} Zero Balances`}
          className="mb-2"
          icon={`pi ${showZeroBalances ? "pi-arrow-down" : "pi-arrow-up"}`}
          severity="secondary"
        />
      </div>
      <DataTable
        showGridlines
        value={filteredData()}
        emptyMessage="No ledgers found!"
        resizableColumns
        selectionMode="single"
        size="small"
        tableStyle={{ minWidth: "50rem" }}
        scrollable
        scrollHeight="400px"
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
            background: HEADER_BACKGROUND_COLOR,
            color: "white",
          }}
          pt={{
            filterMenuButton: {
              className: "hover:bg=",
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
                background: HEADER_BACKGROUND_COLOR,
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
            background: HEADER_BACKGROUND_COLOR,
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

export default SubsidiarySheetSummary
