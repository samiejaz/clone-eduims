import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { FilterMatchMode } from "primereact/api";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CustomSpinner } from "../../components/CustomSpinner";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ActionButtons from "../../components/ActionButtons";
import { useForm, FormProvider, Controller } from "react-hook-form";
import ButtonToolBar from "../CustomerInvoice/CustomerInvoiceToolbar";
import { Col, Form, Row } from "react-bootstrap";

import { AuthContext, useUserData } from "../../context/AuthContext";
import {
  addLeadIntroductionOnAction,
  addNewLeadIntroduction,
  deleteLeadIntroductionByID,
  fetchAllLeadIntroductions,
  fetchLeadIntroductionById,
} from "../../api/LeadIntroductionData";
import { ROUTE_URLS, QUERY_KEYS, MENU_KEYS } from "../../utils/enums";
import { LeadsIntroductionFormComponent } from "../../hooks/ModalHooks/useLeadsIntroductionModalHook";
import { Menu } from "primereact/menu";
import { Dialog } from "primereact/dialog";
import {
  useAllDepartmentsSelectData,
  useAllUsersSelectData,
  useProductsInfoSelectData,
} from "../../hooks/SelectData/useSelectData";
import CDropdown from "../../components/Forms/CDropdown";
import NumberInput from "../../components/Forms/NumberInput";
import { Calendar } from "primereact/calendar";
import { classNames } from "primereact/utils";
import { Tag } from "primereact/tag";
import { toast } from "react-toastify";
import { CIconButton } from "../../components/Buttons/CButtons";
import useConfirmationModal from "../../hooks/useConfirmationModalHook";
import AccessDeniedPage from "../../components/AccessDeniedPage";
import { UserRightsContext } from "../../context/UserRightContext";
import LeadsIntroductionViewer, {
  LeadsIntroductionViewerDetail,
} from "../LeadsIntroductionViewer/LeadsIntroductionViewer";
import LeadsComments from "./LeadsComments";

let parentRoute = ROUTE_URLS.LEAD_INTRODUCTION_ROUTE;
let editRoute = `${parentRoute}/edit/`;
let newRoute = `${parentRoute}/new`;
let viewRoute = `${parentRoute}/`;
let queryKey = QUERY_KEYS.LEAD_INTRODUCTION_QUERY_KEY;
let IDENTITY = "LeadIntroductionID";

export default function LeadIntroduction() {
  const { checkForUserRights } = useContext(UserRightsContext);
  const [userRights, setUserRights] = useState([]);

  useEffect(() => {
    const rights = checkForUserRights({
      MenuKey: MENU_KEYS.LEADS.LEAD_INTRODUCTION_FORM_KEY,
      MenuGroupKey: MENU_KEYS.LEADS.GROUP_KEY,
    });
    setUserRights([rights]);
  }, []);

  return (
    <Routes>
      {userRights && userRights[0]?.ShowForm ? (
        <>
          <Route
            index
            element={<LeadIntroductionDetail userRights={userRights} />}
          />
          <Route
            path={`:${IDENTITY}`}
            element={
              <LeadIntroductionForm
                key={"LeadIntroductionViewRoute"}
                mode={"view"}
                userRights={userRights}
              />
            }
          />
          <Route
            path={`edit/:${IDENTITY}`}
            element={
              <>
                {userRights[0].RoleEdit ? (
                  <>
                    <LeadIntroductionForm
                      key={"LeadIntroductionEditRoute"}
                      mode={"edit"}
                      userRights={userRights}
                    />
                  </>
                ) : (
                  <AccessDeniedPage />
                )}
              </>
            }
          />

          <>
            <Route
              path={`new`}
              element={
                <>
                  {userRights[0].RoleNew ? (
                    <>
                      <LeadIntroductionForm
                        key={"LeadIntroductionNewRoute"}
                        mode={"new"}
                        userRights={userRights}
                      />
                    </>
                  ) : (
                    <>
                      <AccessDeniedPage />
                    </>
                  )}
                </>
              }
            />
          </>
        </>
      ) : (
        <Route
          path="*"
          element={
            <>
              <AccessDeniedPage />
            </>
          }
        />
      )}
      <Route
        path={`:LeadIntroductionID`}
        element={<LeadsIntroductionViewer />}
      />
      <Route
        path={`:LeadIntroductionID/:Type/:LeadIntroductionDetailID`}
        element={<LeadsIntroductionViewerDetail />}
      />
      <Route path={`:LeadIntroductionID`} element={<LeadsComments />} />
    </Routes>
  );
}

export function LeadIntroductionDetail({
  ShowMetaDeta = true,
  Rows = 10,
  userRights,
}) {
  document.title = ShowMetaDeta ? "Lead Introductions" : "Leads Dashboard";

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { showDeleteDialog, showEditDialog } = useConfirmationModal({
    handleDelete,
    handleEdit,
  });

  const [filters, setFilters] = useState({
    Status: { value: null, matchMode: FilterMatchMode.CONTAINS },
    VoucherDate: { value: null, matchMode: FilterMatchMode.CONTAINS },
    CompanyName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ContactPersonName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ContactPersonMobileNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const user = useUserData();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchAllLeadIntroductions(user.userID),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLeadIntroductionByID,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
    },
  });

  function handleDelete(id) {
    deleteMutation.mutate({ LeadIntroductionID: id, LoginUserID: user.userID });
  }

  function handleEdit(id) {
    navigate(editRoute + id);
  }

  function handleView(id) {
    navigate(parentRoute + "/" + id);
  }

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <div>
          <ForwardDialogComponent
            LeadIntroductionID={rowData.LeadIntroductionID}
          />
          <QuoteDialogComponent
            LeadIntroductionID={rowData.LeadIntroductionID}
          />
          <FinalizedDialogComponent
            LeadIntroductionID={rowData.LeadIntroductionID}
          />
          <ClosedDialogComponent
            LeadIntroductionID={rowData.LeadIntroductionID}
          />
        </div>
      </React.Fragment>
    );
  };
  const leftActionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <div style={{ display: "flex" }}>
          {ActionButtons(
            rowData.LeadIntroductionID,
            () => showDeleteDialog(rowData.LeadIntroductionID),
            () => showEditDialog(rowData.LeadIntroductionID),
            handleView,
            userRights[0]?.RoleEdit,
            userRights[0]?.RoleDelete
          )}
          <div>
            <Button
              icon="pi pi-list"
              rounded
              outlined
              severity="help"
              tooltip="Timeline"
              tooltipOptions={{
                position: "right",
              }}
              onClick={() =>
                navigate(
                  ROUTE_URLS.GENERAL.LEADS_INTROUDCTION_VIEWER_ROUTE +
                    "/" +
                    rowData.LeadIntroductionID
                )
              }
              style={{
                padding: "1px 0px",
                fontSize: "small",
                width: "30px",
                height: "2rem",
                border: "none",
              }}
            />
            <CIconButton
              icon="pi pi-comments"
              severity="info"
              onClick={() =>
                navigate(
                  ROUTE_URLS.GENERAL.LEADS_INTROUDCTION_COMMENT_ROUTE +
                    "/" +
                    rowData.LeadIntroductionID
                )
              }
              tooltip="Comments"
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
    <div className="mt-4">
      {isLoading || isFetching ? (
        <>
          <CustomSpinner />
        </>
      ) : (
        <>
          {ShowMetaDeta && (
            <>
              <div className="d-flex text-dark  mb-4 ">
                <h2 className="text-center my-auto">Lead Introductions</h2>
                <div
                  className="text-end my-auto"
                  style={{ marginLeft: "10px" }}
                >
                  {userRights[0]?.RoleNew && (
                    <>
                      <Button
                        label="Add New Lead Introduction"
                        icon="pi pi-plus"
                        type="button"
                        className="rounded"
                        onClick={() => navigate(newRoute)}
                      />
                    </>
                  )}
                </div>
              </div>
            </>
          )}
          <DataTable
            value={data}
            dataKey="LeadIntroductionID"
            paginator
            rows={Rows}
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
              field="VoucherDate"
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
            <Column
              body={actionBodyTemplate}
              style={{ minWidth: "4rem", width: "4rem" }}
            ></Column>
          </DataTable>
        </>
      )}
    </div>
  );
}

function LeadIntroductionForm({ mode, userRights }) {
  document.title = "Lead Introduction Entry";

  const queryClient = useQueryClient();
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();
  const { LeadIntroductionID } = useParams();

  const method = useForm({
    defaultValues: {
      CompanyName: "",
      CountryID: [],
      TehsilID: [],
      BusinessTypeID: [],
      CompanyAddress: "",
      CompanyWebsite: "",
      BusinessNature: "",
      ContactPersonName: "",
      ContactPersonMobileNo: "",
      ContactPersonWhatsAppNo: "",
      ContactPersonEmail: "",
      RequirementDetails: "",
      LeadSourceID: [],
      IsWANumberSameAsMobile: false,
    },
  });
  const LeadIntroductionData = useQuery({
    queryKey: [queryKey, LeadIntroductionID],
    queryFn: () => fetchLeadIntroductionById(LeadIntroductionID, user.userID),
    enabled: LeadIntroductionID !== undefined,
    initialData: [],
  });

  useEffect(() => {
    if (
      LeadIntroductionID !== undefined &&
      LeadIntroductionData?.data?.length > 0
    ) {
      method.control._fields.CountryID._f.value =
        LeadIntroductionData.data[0].CountryID;
      method.setValue("CompanyName", LeadIntroductionData.data[0].CompanyName);
      method.setValue("CountryID", LeadIntroductionData.data[0].CountryID);
      method.setValue("TehsilID", LeadIntroductionData.data[0].TehsilID);
      method.setValue(
        "BusinessTypeID",
        LeadIntroductionData.data[0].BusinessTypeID
      );
      method.setValue(
        "CompanyAddress",
        LeadIntroductionData.data[0].CompanyAddress
      );
      method.setValue(
        "CompanyWebsite",
        LeadIntroductionData.data[0].CompanyWebsite
      );
      method.setValue(
        "BusinessNatureID",
        LeadIntroductionData.data[0].BusinessNature
      );
      method.setValue(
        "ContactPersonName",
        LeadIntroductionData.data[0].ContactPersonName
      );
      method.setValue(
        "ContactPersonMobileNo",
        LeadIntroductionData.data[0].ContactPersonMobileNo
      );
      method.setValue(
        "ContactPersonWhatsAppNo",
        LeadIntroductionData.data[0].ContactPersonWhatsAppNo
      );
      method.setValue(
        "ContactPersonEmail",
        LeadIntroductionData.data[0].ContactPersonEmail
      );
      method.setValue(
        "RequirementDetails",
        LeadIntroductionData.data[0].RequirementDetails
      );

      method.setValue(
        "LeadSourceID",
        LeadIntroductionData.data[0].LeadSourceID
      );
    }
  }, [LeadIntroductionID, LeadIntroductionData.data]);

  const mutation = useMutation({
    mutationFn: addNewLeadIntroduction,
    onSuccess: ({ success, RecordID }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        navigate(`${parentRoute}/${RecordID}`);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLeadIntroductionByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      navigate(parentRoute);
    },
  });

  function handleDelete() {
    deleteMutation.mutate({
      LeadIntroductionID: LeadIntroductionID,
      LoginUserID: user.userID,
    });
  }

  function handleAddNew() {
    method.reset();
    navigate(newRoute);
  }
  function handleCancel() {
    if (mode === "new") {
      navigate(parentRoute);
    } else if (mode === "edit") {
      method.clearErrors();
      navigate(viewRoute + LeadIntroductionID);
    }
  }
  function handleEdit() {
    navigate(editRoute + LeadIntroductionID);
  }

  function onSubmit(data) {
    mutation.mutate({
      formData: data,
      userID: user.userID,
      LeadIntroductionID: LeadIntroductionID,
    });
  }

  return (
    <>
      {LeadIntroductionData.isLoading ? (
        <>
          <CustomSpinner />
        </>
      ) : (
        <>
          <div className="mt-4">
            <ButtonToolBar
              editDisable={mode !== "view"}
              cancelDisable={mode === "view"}
              addNewDisable={mode === "edit" || mode === "new"}
              deleteDisable={mode === "edit" || mode === "new"}
              saveDisable={mode === "view"}
              saveLabel={mode === "edit" ? "Update" : "Save"}
              saveLoading={mutation.isPending}
              handleGoBack={() => navigate(parentRoute)}
              handleEdit={() => handleEdit()}
              handleCancel={() => {
                handleCancel();
              }}
              handleAddNew={() => {
                handleAddNew();
              }}
              handleDelete={handleDelete}
              handleSave={() => method.handleSubmit(onSubmit)()}
              GoBackLabel="LeadIntroductions"
              showAddNewButton={userRights[0]?.RoleNew}
              showEditButton={userRights[0]?.RoleEdit}
              showDelete={userRights[0]?.RoleDelete}
            />
          </div>
          <div className="mt-4">
            <FormProvider {...method}>
              <LeadsIntroductionFormComponent mode={mode} />
            </FormProvider>
          </div>
        </>
      )}
    </>
  );
}

const useForwardDialog = (LeadIntroductionID) => {
  const [visible, setVisible] = useState(false);
  return {
    setVisible,
    render: (
      <ForwardDialog
        visible={visible}
        setVisible={setVisible}
        LeadIntroductionID={LeadIntroductionID}
      />
    ),
  };
};

function ForwardDialogComponent({ LeadIntroductionID }) {
  const { setVisible, render } = useForwardDialog(LeadIntroductionID);

  return (
    <>
      <Button
        icon="pi pi-send"
        rounded
        outlined
        className="mr-2"
        tooltip="Forward"
        tooltipOptions={{
          position: "left",
        }}
        onClick={() => setVisible(true)}
        style={{
          padding: "1px 0px",
          fontSize: "small",
          width: "30px",
          marginLeft: "10px",
          height: "2rem",
          border: "none",
        }}
      />
      {render}
    </>
  );
}

function ForwardDialog({ visible = true, setVisible, LeadIntroductionID }) {
  const queryClient = useQueryClient();
  const user = useUserData();
  const usersSelectData = useAllUsersSelectData();
  const departmentSelectData = useAllDepartmentsSelectData();
  const productsSelectData = useProductsInfoSelectData();
  const method = useForm({
    defaultValues: {
      Description: "",
    },
  });

  const mutation = useMutation({
    mutationFn: addLeadIntroductionOnAction,
    onSuccess: ({ success }) => {
      if (success) {
        toast.success("Lead forwarded successfully!");
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.LEADS_CARD_DATA],
        });
      }
    },
  });

  const footerContent = (
    <>
      <Button
        label="Save"
        severity="success"
        className="rounded"
        type="button"
        onClick={() => method.handleSubmit(onSubmit)()}
      />
    </>
  );
  const headerContent = <></>;
  const dialogConent = (
    <>
      <Row>
        <Form.Group as={Col} controlId="DepartmentID">
          <Form.Label style={{ fontSize: "14px", fontWeight: "bold" }}>
            Department
            <span className="text-danger fw-bold ">*</span>
          </Form.Label>
          <div>
            <CDropdown
              control={method.control}
              name={`DepartmentID`}
              optionLabel="DepartmentName"
              optionValue="DepartmentID"
              placeholder="Select a department"
              options={departmentSelectData.data}
              focusOptions={() => method.setFocus("InActive")}
              showClear={true}
            />
          </div>
        </Form.Group>
        <Form.Group as={Col} controlId="UserID">
          <Form.Label style={{ fontSize: "14px", fontWeight: "bold" }}>
            User
            <span className="text-danger fw-bold ">*</span>
          </Form.Label>
          <div>
            <CDropdown
              control={method.control}
              name={`UserID`}
              optionLabel="UserName"
              optionValue="UserID"
              placeholder="Select a user"
              options={usersSelectData.data}
              focusOptions={() => method.setFocus("InActive")}
              showClear={true}
            />
          </div>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col} controlId="MeetingPlace">
          <Form.Label style={{ fontSize: "14px", fontWeight: "bold" }}>
            Meeting Medium
            <span className="text-danger fw-bold ">*</span>
          </Form.Label>
          <div>
            <CDropdown
              control={method.control}
              name={`MeetingPlace`}
              placeholder="Select a place"
              options={[
                { label: "At Client Site", value: "AtClientSite" },
                { label: "At Office", value: "AtOffice" },
                { label: "Online", value: "Online" },
              ]}
              required={true}
              focusOptions={() => method.setFocus("MeetingTime")}
            />
          </div>
        </Form.Group>
        <Form.Group as={Col} controlId="MeetingTime">
          <Form.Label style={{ fontSize: "14px", fontWeight: "bold" }}>
            Meeting Date & Time
            <span className="text-danger fw-bold ">*</span>
          </Form.Label>
          <div>
            <Controller
              name="MeetingTime"
              control={method.control}
              rules={{ required: "Date is required." }}
              render={({ field, fieldState }) => (
                <>
                  <Calendar
                    inputId={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    dateFormat="dd-M-yy"
                    style={{ width: "100%" }}
                    className={classNames({ "p-invalid": fieldState.error })}
                    showTime
                    showIcon
                    hourFormat="12"
                  />
                </>
              )}
            />
          </div>
        </Form.Group>
        <Form.Group as={Col} controlId="DepartmentID">
          <Form.Label style={{ fontSize: "14px", fontWeight: "bold" }}>
            Recomended Product
            <span className="text-danger fw-bold ">*</span>
          </Form.Label>
          <div>
            <CDropdown
              control={method.control}
              name={`ProductInfoID`}
              optionLabel="ProductInfoTitle"
              optionValue="ProductInfoID"
              placeholder="Select a product"
              options={productsSelectData.data}
              required={true}
              focusOptions={() => method.setFocus("Description")}
            />
          </div>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col} className="col-12">
          <Form.Label>Instructions</Form.Label>
          <Form.Control
            as={"textarea"}
            rows={1}
            className="form-control"
            style={{
              padding: "0.3rem 0.4rem",
              fontSize: "0.8em",
            }}
            {...method.register("Description")}
          />
        </Form.Group>
      </Row>
    </>
  );

  function onSubmit(data) {
    if (data.DepartmentID === undefined && data.UserID === undefined) {
      method.setError("DepartmentID", { type: "required" });
      method.setError("UserID", { type: "required" });
    } else {
      mutation.mutate({
        from: "Forward",
        formData: data,
        userID: user.userID,
        LeadIntroductionID: LeadIntroductionID,
      });
    }
  }

  return (
    <>
      <Dialog
        footer={footerContent}
        header="Forward To"
        visible={visible}
        draggable={false}
        onHide={() => setVisible(false)}
        style={{ width: "75vw", height: "55vh" }}
      >
        {dialogConent}
      </Dialog>
    </>
  );
}
// Quoted
const useQuoteDialog = (LeadIntroductionID) => {
  const [visible, setVisible] = useState(false);
  return {
    setVisible,
    render: (
      <QuoteDialog
        visible={visible}
        setVisible={setVisible}
        LeadIntroductionID={LeadIntroductionID}
      />
    ),
  };
};

function QuoteDialogComponent({ LeadIntroductionID }) {
  const { setVisible, render } = useQuoteDialog(LeadIntroductionID);

  return (
    <>
      <Button
        icon="pi pi-dollar"
        rounded
        severity="success"
        outlined
        className="mr-2"
        tooltip="Quoted"
        tooltipOptions={{
          position: "left",
        }}
        onClick={() => setVisible(true)}
        style={{
          padding: "1px 0px",
          fontSize: "small",
          width: "30px",
          marginLeft: "10px",
          height: "2rem",
          border: "none",
        }}
      />
      {render}
    </>
  );
}

function QuoteDialog({ visible = true, setVisible, LeadIntroductionID }) {
  const method = useForm();
  const queryClient = useQueryClient();
  const user = useUserData();
  const footerContent = (
    <>
      <Button
        label="Save"
        severity="success"
        className="rounded"
        type="button"
        onClick={() => method.handleSubmit(onSubmit)()}
      />
    </>
  );
  const headerContent = <></>;
  const dialogConent = (
    <>
      <Row>
        <Form.Group as={Col} controlId="AttachmentFile">
          <Form.Label style={{ fontSize: "14px", fontWeight: "bold" }}>
            File
            <span className="text-danger fw-bold ">*</span>
          </Form.Label>
          <Form.Control
            type="file"
            {...method.register("AttachmentFile")}
          ></Form.Control>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group className="col-xl-3" as={Col} controlId="Amount">
          <Form.Label>Amount</Form.Label>
          <div>
            <NumberInput
              control={method.control}
              id={`Amount`}
              //required={true}
              enterKeyOptions={() => method.setFocus("Description")}
            />
          </div>
        </Form.Group>
        <Form.Group as={Col} controlId="Description" className="col-9">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as={"textarea"}
            rows={1}
            className="form-control"
            style={{
              padding: "0.3rem 0.4rem",
              fontSize: "0.8em",
            }}
            {...method.register("Description")}
          />
        </Form.Group>
      </Row>
    </>
  );
  const mutation = useMutation({
    mutationFn: addLeadIntroductionOnAction,
    onSuccess: ({ success }) => {
      if (success) {
        toast.success("Lead quoted successfully!");
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.LEADS_CARD_DATA],
        });
      }
    },
  });
  function onSubmit(data) {
    mutation.mutate({
      from: "Quoted",
      formData: data,
      userID: user.userID,
      LeadIntroductionID: LeadIntroductionID,
    });
  }

  return (
    <>
      <Dialog
        footer={footerContent}
        header="Quoted"
        visible={visible}
        draggable={false}
        onHide={() => setVisible(false)}
        style={{ width: "75vw", height: "55vh" }}
      >
        {dialogConent}
      </Dialog>
    </>
  );
}
// Finalized
const useFinalizedDialog = (LeadIntroductionID) => {
  const [visible, setVisible] = useState(false);
  return {
    setVisible,
    render: (
      <FinalizedDialog
        visible={visible}
        setVisible={setVisible}
        LeadIntroductionID={LeadIntroductionID}
      />
    ),
  };
};

function FinalizedDialogComponent({ LeadIntroductionID }) {
  const { setVisible, render } = useFinalizedDialog(LeadIntroductionID);

  return (
    <>
      <Button
        icon="pi pi-check"
        rounded
        outlined
        severity="help"
        className="mr-2"
        tooltip="Finalized"
        tooltipOptions={{
          position: "left",
        }}
        onClick={() => setVisible(true)}
        style={{
          padding: "1px 0px",
          fontSize: "small",
          width: "30px",
          marginLeft: "10px",
          height: "2rem",
          border: "none",
        }}
      />
      {render}
    </>
  );
}

function FinalizedDialog({ visible = true, setVisible, LeadIntroductionID }) {
  const queryClient = useQueryClient();
  const user = useUserData();
  const method = useForm();

  const mutation = useMutation({
    mutationFn: addLeadIntroductionOnAction,
    onSuccess: ({ success }) => {
      if (success) {
        toast.success("Lead finalized successfully!");
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.LEADS_CARD_DATA],
        });
      }
    },
  });

  const footerContent = (
    <>
      <Button
        label="Save"
        severity="success"
        className="rounded"
        type="button"
        onClick={() => method.handleSubmit(onSubmit)()}
      />
    </>
  );
  const dialogConent = (
    <>
      <Row>
        <Form.Group as={Col} controlId="AttachmentFile">
          <Form.Label style={{ fontSize: "14px", fontWeight: "bold" }}>
            File
            <span className="text-danger fw-bold ">*</span>
          </Form.Label>
          <Form.Control
            type="file"
            {...method.register("AttachmentFile")}
          ></Form.Control>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group className="col-xl-3" as={Col} controlId="Amount">
          <Form.Label>Amount</Form.Label>
          <div>
            <NumberInput
              control={method.control}
              id={`Amount`}
              //required={true}
              enterKeyOptions={() => method.setFocus("FromBank")}
            />
          </div>
        </Form.Group>
        <Form.Group as={Col} controlId="Description" className="col-9">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as={"textarea"}
            rows={1}
            className="form-control"
            style={{
              padding: "0.3rem 0.4rem",
              fontSize: "0.8em",
            }}
            {...method.register("Description")}
          />
        </Form.Group>
      </Row>
    </>
  );

  function onSubmit(data) {
    mutation.mutate({
      from: "Finalized",
      formData: data,
      userID: user.userID,
      LeadIntroductionID: LeadIntroductionID,
    });
  }

  return (
    <>
      <Dialog
        footer={footerContent}
        header="Finalized"
        visible={visible}
        draggable={false}
        onHide={() => setVisible(false)}
        style={{ width: "75vw", height: "55vh" }}
      >
        {dialogConent}
      </Dialog>
    </>
  );
}

// Closed
const useClosedDialog = (LeadIntroductionID) => {
  const [visible, setVisible] = useState(false);
  return {
    setVisible,
    render: (
      <ClosedDialog
        visible={visible}
        setVisible={setVisible}
        LeadIntroductionID={LeadIntroductionID}
      />
    ),
  };
};

function ClosedDialogComponent({ LeadIntroductionID }) {
  const { setVisible, render } = useClosedDialog(LeadIntroductionID);

  return (
    <>
      <Button
        icon="pi pi-times"
        rounded
        outlined
        severity="danger"
        className="mr-2"
        tooltip="Closed"
        tooltipOptions={{
          position: "left",
        }}
        onClick={() => setVisible(true)}
        style={{
          padding: "1px 0px",
          fontSize: "small",
          width: "30px",
          marginLeft: "10px",
          height: "2rem",
          border: "none",
        }}
      />

      {render}
    </>
  );
}

function ClosedDialog({ visible = true, setVisible, LeadIntroductionID }) {
  const method = useForm();
  const queryClient = useQueryClient();
  const user = useUserData();
  const footerContent = (
    <>
      <Button
        label="Save"
        severity="success"
        className="rounded"
        type="button"
        onClick={() => method.handleSubmit(onSubmit)()}
      />
    </>
  );
  const mutation = useMutation({
    mutationFn: addLeadIntroductionOnAction,
    onSuccess: ({ success }) => {
      if (success) {
        toast.success("Lead closed successfully!");
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.LEADS_CARD_DATA],
        });
      }
    },
  });
  function onSubmit(data) {
    mutation.mutate({
      from: "Closed",
      formData: data,
      userID: user.userID,
      LeadIntroductionID: LeadIntroductionID,
    });
  }
  const dialogConent = (
    <>
      <Row>
        <Form.Group as={Col} controlId="Description" className="col-9">
          <Form.Label>Reason</Form.Label>
          <Form.Control
            as={"textarea"}
            rows={1}
            className="form-control"
            style={{
              padding: "0.3rem 0.4rem",
              fontSize: "0.8em",
            }}
            {...method.register("Description")}
          />
        </Form.Group>
        <Form.Group className="col-xl-3" as={Col} controlId="Amount">
          <Form.Label>Expected Amount</Form.Label>
          <div>
            <NumberInput
              control={method.control}
              id={`Amount`}
              //       required={true}
              enterKeyOptions={() => method.setFocus("FromBank")}
            />
          </div>
        </Form.Group>
      </Row>
    </>
  );

  return (
    <>
      <Dialog
        footer={footerContent}
        header="Closed"
        visible={visible}
        draggable={false}
        onHide={() => setVisible(false)}
        style={{ width: "75vw", height: "40vh" }}
      >
        {dialogConent}
      </Dialog>
    </>
  );
}
