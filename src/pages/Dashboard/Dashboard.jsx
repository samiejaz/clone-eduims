import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import { useUserData } from "../../context/AuthContext";
import { QUERY_KEYS } from "../../utils/enums";
import {
  addLeadIntroductionOnAction,
  fetchAllDemonstrationLeadsData,
} from "../../api/LeadIntroductionData";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { FilterMatchMode } from "primereact/api";
import { useLeadsIntroductionModalHook } from "../../hooks/ModalHooks/useLeadsIntroductionModalHook";
import { useMeetingDoneModalHook } from "../../components/Modals/MeetingDoneModal";
import { CIconButton } from "../../components/Buttons/CButtons";
import { useRevertBackModalHook } from "../../components/Modals/RevertBackModal";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { toast } from "react-toastify";
import { parseISO } from "date-fns";

function Dashboard() {
  document.title = "Dashboard";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
      className="mt-4"
    >
      <div className="card p-4 border-0 shadow-sm">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3>Title</h3>
            <div>
              <div>
                <ReactDatePicker
                  placeholderText="Select date"
                  dateFormat={"dd-MMM-yyyy"}
                  className={"binput"}
                />
              </div>
            </div>
          </div>
          <hr />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
              gap: "10px",
            }}
          >
            <div
              className="card p-2"
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <p className="fw-bold">Title</p>
              <p>10000</p>
            </div>
            <div
              className="card p-2"
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <p className="fw-bold">Title</p>
              <p>10000</p>
            </div>
            <div
              className="card p-2"
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <p className="fw-bold">Title</p>
              <p>10000</p>
            </div>
            <div
              className="card p-2"
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <p className="fw-bold">Title</p>
              <p>10000</p>
            </div>
            <div
              className="card p-2"
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <p className="fw-bold">Title</p>
              <p>10000</p>
            </div>
            <div
              className="card p-2"
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <p className="fw-bold">Title</p>
              <p>10000</p>
            </div>
          </div>
        </div>
      </div>
      <div className="card p-4 border-0 shadow-sm">
        <div>
          <LeadsIntroductionDemonstratorTable />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

function LeadsIntroductionDemonstratorTable() {
  const queryClient = useQueryClient();

  const [LeadIntroductionData, setLeadIntroductionData] = useState({
    LeadIntroductionID: 0,
    LeadIntroductionDetailID: 0,
  });

  const { render, setVisible } = useLeadsIntroductionModalHook(
    LeadIntroductionData.LeadIntroductionDetailID
  );
  const { render: MeetingDoneModal, setVisible: setMeetingDoneModalVisible } =
    useMeetingDoneModalHook({
      LeadsIntroductionID: LeadIntroductionData.LeadIntroductionID,
      LeadIntroductionDetailID: LeadIntroductionData.LeadIntroductionDetailID,
    });
  const { render: RevertBackModal, setVisible: setRevertBackModalVisible } =
    useRevertBackModalHook({
      LeadsIntroductionID: LeadIntroductionData.LeadIntroductionID,
      LeadIntroductionDetailID: LeadIntroductionData.LeadIntroductionDetailID,
    });
  const user = useUserData();

  const mutation = useMutation({
    mutationFn: addLeadIntroductionOnAction,
    onSuccess: ({ success }) => {
      if (success) {
        toast.success("Acknowledged successfully!");
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.LEADS_DEMO_DATA],
        });
      }
    },
  });

  const confirmAcknowledge = (LeadIntroductionID) => {
    confirmDialog({
      message: "Do you want to acknowledge this record?",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept: () => {
        mutation.mutate({
          userID: user.userID,
          LeadIntroductionID,
          from: "Acknowledged",
        });
      },
      reject: () => {},
    });
  };

  const [filters, setFilters] = useState({
    Status: { value: null, matchMode: FilterMatchMode.CONTAINS },
    CompanyName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    LeadSourceTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const { data } = useQuery({
    queryKey: [QUERY_KEYS.LEADS_DEMO_DATA],
    queryFn: () =>
      fetchAllDemonstrationLeadsData({
        UserID: user.userID,
        DepartmentID: user.DepartmentID,
      }),
    initialData: [],
  });

  const leftActionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <div style={{ display: "flex" }}>
          <div>
            <Button
              icon="pi pi-eye"
              rounded
              outlined
              severity="secondary"
              tooltip="view"
              tooltipOptions={{
                position: "right",
              }}
              style={{
                padding: "1px 0px",
                fontSize: "small",
                width: "30px",
                height: "2rem",
                border: "none",
              }}
              onClick={() => {
                setLeadIntroductionData({
                  LeadIntroductionID: rowData.LeadIntroductionID,
                  LeadIntroductionDetailID: rowData.LeadIntroductionDetailID,
                });
                setVisible(true);
              }}
            />

            <CIconButton
              onClick={() => {
                setLeadIntroductionData({
                  LeadIntroductionID: rowData.LeadIntroductionID,
                  LeadIntroductionDetailID: 0,
                });
                setMeetingDoneModalVisible(true);
              }}
              icon={"pi pi-check"}
              severity="success"
              tooltip="Complete"
              disabled={
                rowData.Status === "Meeting Done" ||
                rowData.Status === "Finalized" ||
                rowData.Status === "Quoted" ||
                rowData.Status === "Closed" ||
                rowData.Status === "Meeting Done" ||
                rowData.Status === "Pending"
              }
            />
            <CIconButton
              onClick={() => {
                setLeadIntroductionData({
                  LeadIntroductionID: rowData.LeadIntroductionID,
                  LeadIntroductionDetailID: 0,
                });
                setRevertBackModalVisible(true);
              }}
              icon={"pi pi-arrow-left"}
              severity="danger"
              tooltip="Return"
              disabled={
                rowData.Status === "Pending" ||
                rowData.Status === "Finalized" ||
                rowData.Status === "Quoted" ||
                rowData.Status === "Closed" ||
                rowData.Status === "Meeting Done" ||
                rowData.Status === "Pending"
              }
            />
            <CIconButton
              onClick={() => confirmAcknowledge(rowData.LeadIntroductionID)}
              icon={"pi pi-star"}
              severity="warning"
              tooltip="Acknowledged"
              disabled={
                rowData.Status === "Acknowledged" ||
                rowData.Status === "Finalized" ||
                rowData.Status === "Quoted" ||
                rowData.Status === "Closed" ||
                rowData.Status === "Meeting Done" ||
                rowData.Status === "Pending"
              }
            />
          </div>
        </div>
      </React.Fragment>
    );
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.Status}
        style={{ background: getSeverity(rowData.Status) }}
      />
    );
  };

  const getSeverity = (status) => {
    switch (status) {
      case "New Lead":
        return "linear-gradient(90deg, rgba(31, 17, 206, 1) 0%, rgba(229, 43, 43, 1) 100%)";
      case "Closed":
        return "linear-gradient(90deg, rgba(200, 0, 0, 1) 0%, rgba(128, 0, 0, 1) 100%)";
      case "Quoted":
        return "linear-gradient(90deg, rgba(200, 0, 158, 1) 0%, rgba(0, 128, 0, 1) 100%)";
      case "Finalized":
        return "linear-gradient(90deg, rgba(0, 255, 49, 1) 0%, rgba(0, 188, 212, 1) 100%, rgba(238, 130, 238, 1) 100%)";
      case "Forwarded":
        return "help";
    }
  };

  return (
    <>
      <DataTable
        value={data}
        dataKey="LeadIntroductionDetailID"
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        removableSort
        emptyMessage="No LeadIntroductions found!"
        filters={filters}
        filterDisplay="row"
        resizableColumns
        size="small"
        className={"thead"}
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column
          body={leftActionBodyTemplate}
          header="Actions"
          resizeable={false}
          style={{ minWidth: "10rem", maxWidth: "10rem", width: "10rem" }}
        ></Column>

        <Column
          field="Status"
          filter
          filterPlaceholder="Search by status"
          sortable
          header="Current Status"
          showFilterMenu={false}
          filterMenuStyle={{ width: "14rem" }}
          style={{ minWidth: "12rem" }}
          body={statusBodyTemplate}
        ></Column>

        <Column
          field="EntryDate"
          filter
          filterPlaceholder="Search by company"
          sortable
          header="Date"
        ></Column>
        <Column
          field="CompanyName"
          filter
          filterPlaceholder="Search by firm"
          sortable
          header="Firm Name"
        ></Column>
        <Column
          field="ContactPersonName"
          filter
          filterPlaceholder="Search by contact person name"
          sortable
          header="Contact Person Name"
        ></Column>
        <Column
          field="ContactPersonMobileNo"
          filter
          filterPlaceholder="Search by mobile"
          sortable
          header="Contact Person Mobile No"
        ></Column>
      </DataTable>
      {render}
      {MeetingDoneModal}
      {RevertBackModal}
      <ConfirmDialog />
    </>
  );
}
