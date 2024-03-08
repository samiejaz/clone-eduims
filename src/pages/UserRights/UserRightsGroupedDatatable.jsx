import React, { useState, useEffect, useRef, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputSwitch } from "primereact/inputswitch";
import { UserRightsContext } from "../../context/UserRightContext";
import { FilterMatchMode } from "primereact/api";

let filters = {
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
};

export default function UserRightsGroupedTable() {
  const [expandedRows, setExpandedRows] = useState([]);
  const { setRoutesWithUserRights, routesWithUserRights } =
    useContext(UserRightsContext);

  const headerTemplate = (data) => {
    return (
      <React.Fragment>
        <span className="vertical-align-middle ml-2 font-bold line-height-3">
          {data.menuGroupName}
        </span>
      </React.Fragment>
    );
  };
  const RoleEditor = (options) => {
    return (
      <InputSwitch
        checked={options.value}
        onChange={(e) => options.editorCallback(e.value)}
      />
    );
  };
  const ShowFormTemplate = (rowData) => {
    return <InputSwitch checked={rowData.ShowForm} />;
  };
  const RoleEditTemplate = (rowData) => {
    return <InputSwitch checked={rowData.RoleEdit} />;
  };
  const RoleDeleteTemplate = (rowData) => {
    return <InputSwitch checked={rowData.RoleDelete} />;
  };
  const RoleNewTemplate = (rowData) => {
    return <InputSwitch checked={rowData.RoleNew} />;
  };
  const RolePrintTemplate = (rowData) => {
    return <InputSwitch checked={rowData.RolePrint} />;
  };
  const onRowEditComplete = (e) => {
    let _routesWithUserRights = [...routesWithUserRights];

    let { newData } = e;
    for (let i = 0; i < _routesWithUserRights.length; i++) {
      for (let j = 0; j < _routesWithUserRights[i].subItems.length; j++) {
        if (
          _routesWithUserRights[i]?.subItems[j]?.menuKey === newData.menuKey
        ) {
          _routesWithUserRights[i].subItems[j] = { ...newData };
        }
      }
    }
    setRoutesWithUserRights(_routesWithUserRights);
  };

  const bodyTemplate = (rowData) => {
    return (
      <>
        <DataTable
          value={rowData.subItems}
          tableStyle={{ minWidth: "45rem" }}
          editMode="row"
          dataKey="menuKey"
          onRowEditComplete={onRowEditComplete}
          filters={filters}
          filterDisplay="row"
        >
          <Column
            field="name"
            header="Name"
            style={{ width: "40%" }}
            filter
            filterPlaceholder="Search by form name"
          ></Column>
          <Column
            field="ShowForm"
            header="Show Form"
            style={{ width: "10%" }}
            bodyStyle={{ textAlign: "center" }}
            body={ShowFormTemplate}
            editor={(options) => RoleEditor(options)}
          ></Column>
          <Column
            field="RoleNew"
            header="Role New"
            style={{ width: "10%" }}
            bodyStyle={{ textAlign: "center" }}
            body={RoleNewTemplate}
            editor={(options) => RoleEditor(options)}
          ></Column>
          <Column
            field="RoleEdit"
            header="Role Edit"
            style={{ width: "10%" }}
            editor={(options) => RoleEditor(options)}
            body={RoleEditTemplate}
            bodyStyle={{ textAlign: "center" }}
          ></Column>
          <Column
            field="RoleDelete"
            header="Role Delete"
            style={{ width: "10%" }}
            bodyStyle={{ textAlign: "center" }}
            body={RoleDeleteTemplate}
            editor={(options) => RoleEditor(options)}
          ></Column>
          <Column
            field="RolePrint"
            header="Role Print"
            style={{ width: "10%" }}
            bodyStyle={{ textAlign: "center" }}
            body={RolePrintTemplate}
            editor={(options) => RoleEditor(options)}
          ></Column>
          <Column
            rowEditor={true}
            headerStyle={{ width: "10%", minWidth: "8rem" }}
            bodyStyle={{ textAlign: "center" }}
          ></Column>
        </DataTable>
      </>
    );
  };

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
          header="Forms"
          style={{ width: "20%" }}
          body={bodyTemplate}
        ></Column>
      </DataTable>
    </div>
  );
}
