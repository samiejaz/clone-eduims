import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import React, { useState } from "react"
import { ShowSuccessToast } from "../../utils/CommonFunctions"

const BusinessUnitAndBalanceWiseAccountLedgers = () => {
  const [selectedCell, setSelectedCell] = useState(null)

  let data = [
    {
      businessUnitId: 1,
      businessUnit: "Paragmetic",
      balance1: 1000,
      balance2: 1000,
      balance3: 1000,
      balance4: 1000,
      balance5: 1000,
      balance6: 1000,
      balance7: 1000,
      balance8: 1000,
      balance9: 1000,
      balance10: 1000,
      balance11: 1000,
      balance12: 1000,
      total: 4000,
    },
    {
      businessUnitId: 2,
      businessUnit: "Edusoft",
      balance1: 1000,
      balance2: 1000,
      balance3: 1000,
      balance4: 1000,
      balance5: 1000,
      balance6: 1000,
      balance7: 1000,
      balance8: 1000,
      balance9: 1000,
      balance10: 1000,
      balance11: 1000,
      balance12: 1000,
      total: 4000,
    },
    {
      businessUnitId: 3,
      businessUnit: "Technophile",
      balance1: 1000,
      balance2: 1000,
      balance3: 1000,
      balance4: 1000,
      balance5: 1000,
      balance6: 1000,
      balance7: 1000,
      balance8: 1000,
      balance9: 1000,
      balance10: 1000,
      balance11: 1000,
      balance12: 1000,
      total: 4000,
    },
  ]
  let headers = [
    { id: 1, account: "Cantt" },
    { id: 2, account: "Bosan Road" },
    { id: 3, account: "Vehari" },
    { id: 4, account: "Shah Shams" },
    { id: 5, account: "Muzaffarabad" },
    { id: 6, account: "Mil Phatak" },
    { id: 49120851024, account: "Lahore" },
    { id: 8, account: "Bahadurpur" },
    { id: 9, account: "Lahore 3" },
    { id: 10, account: "Bahadurpur 2" },
    { id: 11, account: "Lahore 2" },
    { id: 12, account: "Bahadurpur 34" },
  ]

  function handleCellSelection(e) {
    let BusinessUnitId = e.value.rowData.businessUnitId
    let BusinessUnit = e.value.rowData.businessUnit
    let AccountID = e.value.column.props.columnKey
    let Account = e.value.column.props.header

    if (Account === "Total") {
      ShowSuccessToast(
        `Generating Total Report For ${Account}, ${BusinessUnit}`
      )
    } else {
      ShowSuccessToast(`Generating Report For ${Account}, ${BusinessUnit}`)
    }
    setSelectedCell(e.value)
  }

  const isCellSelectable = (event) => event.data.field !== "businessUnit"

  return (
    <DataTable
      showGridlines
      value={data}
      emptyMessage="No accounts!"
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
    >
      <Column
        header="Business Unit ID"
        hidden
        field="businessUnitId"
        style={{ minWidth: "10rem", width: "10rem" }}
      ></Column>
      <Column
        header="Business Units"
        frozen
        field="businessUnit"
        sortable
        filter
        style={{ minWidth: "10rem", width: "10rem" }}
      ></Column>
      {headers.map((header, index) => (
        <Column
          header={header.account}
          key={header.id}
          style={{ minWidth: "10rem", width: "10rem" }}
          field={`balance${index + 1}`}
          columnKey={header.id}
        ></Column>
      ))}
      <Column
        header="Total"
        alignFrozen="right"
        frozen={true}
        style={{ minWidth: "7rem", width: "7rem" }}
        field="total"
      ></Column>
    </DataTable>
  )
}

export default BusinessUnitAndBalanceWiseAccountLedgers
