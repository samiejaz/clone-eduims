import React, { useState } from "react"
import { useBusinessUnitsSelectData } from "../../hooks/SelectData/useSelectData"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"

const BusinessUnitsCheckBoxDatable = React.forwardRef((props, ref) => {
  const { isRowSelectable } = props

  const [selectedBusinessUnits, setSelectedBusinessUnits] = useState()
  const BusinessUnitSelectData = useBusinessUnitsSelectData()
  const handleIsRowSelectable = (event) => {
    return isRowSelectable
  }

  React.useImperativeHandle(ref, () => ({
    setBusinessUnits(data) {
      setSelectedBusinessUnits(data)
    },
    getSelectedBusinessUnits() {
      return selectedBusinessUnits
    },
  }))

  return (
    <DataTable
      id="businessUnitTable"
      value={BusinessUnitSelectData.data}
      selectionMode={"checkbox"}
      selection={selectedBusinessUnits}
      onSelectionChange={(e) => setSelectedBusinessUnits(e.value)}
      dataKey="BusinessUnitID"
      tableStyle={{ minWidth: "50rem" }}
      size="sm"
      isDataSelectable={handleIsRowSelectable}
    >
      <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
      <Column field="BusinessUnitName" header="Business Unit"></Column>
    </DataTable>
  )
})

export default BusinessUnitsCheckBoxDatable
