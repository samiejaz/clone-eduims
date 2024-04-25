import React, { useState, useEffect, useRef } from "react"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { routes, routesWithUserRights } from "../../utils/routes"
import { InputSwitch } from "primereact/inputswitch"

export default function UserRightsGroupedTableCellWise() {
  const [expandedRows, setExpandedRows] = useState([])

  const headerTemplate = (data) => {
    return (
      <React.Fragment>
        <span className="vertical-align-middle ml-2 font-bold line-height-3">
          {data.menuGroupName}
        </span>
      </React.Fragment>
    )
  }
  const RoleEditor = (options) => {
    return (
      <InputSwitch
        checked={options.value}
        onChange={(e) => options.editorCallback(e.value)}
      />
    )
  }
  const RoleEditTemplate = (rowData) => {
    return <InputSwitch checked={rowData.RoleEdit} />
  }
  const RoleDeleteTemplate = (rowData) => {
    return <InputSwitch checked={rowData.RoleDelete} />
  }
  const RoleNewTemplate = (rowData) => {
    return <InputSwitch checked={rowData.RoleNew} />
  }
  const RolePrintTemplate = (rowData) => {
    return <InputSwitch checked={rowData.RolePrint} />
  }

  const onCellEditComplete = (e) => {
    let _routesWithUserRights = [...routesWithUserRights]
    let { rowData, newValue, field, originalEvent: event } = e

    rowData[field] = newValue

    //   setProducts(_products);
  }

  const bodyTemplate = (rowData) => {
    return (
      <>
        <DataTable
          value={rowData.subItems}
          tableStyle={{ minWidth: "45rem" }}
          editMode="cell"
          dataKey="menuKey"
        >
          <Column field="name" header="Name" style={{ width: "20%" }}></Column>
          <Column
            field="RoleNew"
            header="Role New"
            style={{ width: "20%" }}
            bodyStyle={{ textAlign: "center" }}
            body={RoleNewTemplate}
            editor={(options) => RoleEditor(options)}
            onCellEditComplete={onCellEditComplete}
          ></Column>
          <Column
            field="RoleEdit"
            header="Role Edit"
            style={{ width: "20%" }}
            editor={(options) => RoleEditor(options)}
            body={RoleEditTemplate}
            bodyStyle={{ textAlign: "center" }}
            onCellEditComplete={onCellEditComplete}
          ></Column>
          <Column
            field="RoleDelete"
            header="Role Delete"
            style={{ width: "20%" }}
            bodyStyle={{ textAlign: "center" }}
            body={RoleDeleteTemplate}
            editor={(options) => RoleEditor(options)}
            onCellEditComplete={onCellEditComplete}
          ></Column>
          <Column
            field="RolePrint"
            header="Role Print"
            style={{ width: "20%" }}
            bodyStyle={{ textAlign: "center" }}
            body={RolePrintTemplate}
            editor={(options) => RoleEditor(options)}
            onCellEditComplete={onCellEditComplete}
          ></Column>
        </DataTable>
      </>
    )
  }

  return (
    <div className="card">
      <DataTable
        value={routesWithUserRights}
        rowGroupMode="subheader"
        groupRowsBy="menuGroupName"
        sortMode="single"
        expandableRowGroups
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowGroupHeaderTemplate={headerTemplate}
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column
          field="menuGroupName"
          header="Name"
          style={{ width: "20%" }}
          body={bodyTemplate}
        ></Column>
      </DataTable>
    </div>
  )
}
