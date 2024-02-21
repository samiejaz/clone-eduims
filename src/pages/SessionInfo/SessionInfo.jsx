import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import useEditModal from "../../hooks/useEditModalHook";
import useDeleteModal from "../../hooks/useDeleteModalHook";
import { FilterMatchMode } from "primereact/api";
import { useEffect, useState } from "react";
import { CustomSpinner } from "../../components/CustomSpinner";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ActionButtons from "../../components/ActionButtons";
import { useForm } from "react-hook-form";
import ButtonToolBar from "../CustomerInvoice/CustomerInvoiceToolbar";
import { Col, Form, Row } from "react-bootstrap";
import TextInput from "../../components/Forms/TextInput";
import CheckBox from "../../components/Forms/CheckBox";
import { useUserData } from "../../context/AuthContext";
import {
  addNewSession,
  deleteSessionByID,
  fetchAllSessions,
  fetchSessionById,
} from "../../api/SessionData";
import { ROUTE_URLS, QUERY_KEYS, SELECT_QUERY_KEYS } from "../../utils/enums";
import CDatePicker from "../../components/Forms/CDatePicker";
import { parseISO } from "date-fns";

let parentRoute = ROUTE_URLS.GENERAL.SESSION_INFO;
let editRoute = `${parentRoute}/edit/`;
let newRoute = `${parentRoute}/new`;
let viewRoute = `${parentRoute}/`;
let detail = "#22C55E";
let queryKey = QUERY_KEYS.SESSION_INFO_QUERY_KEY;

export function SessionDetail() {
  document.title = "Session Info";
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    render: EditModal,
    handleShow: handleEditShow,
    handleClose: handleEditClose,
    setIdToEdit,
  } = useEditModal(handleEdit);

  const { render: DeleteModal, handleShow: handleDeleteShow } =
    useDeleteModal(handleDelete);

  const [filters, setFilters] = useState({
    SessionTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const user = useUserData();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchAllSessions(user.userID),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSessionByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      navigate(parentRoute);
    },
  });

  function handleDelete(id) {
    deleteMutation.mutate({
      SessionID: id,
      LoginUserID: user.userID,
    });
  }

  function handleEdit(id) {
    navigate(editRoute + id);
    handleEditClose();
    setIdToEdit(0);
  }

  function handleView(id) {
    navigate(parentRoute + "/" + id);
  }

  return (
    <div className="mt-4">
      {isLoading || isFetching ? (
        <>
          <div className="h-100 w-100">
            <div className="d-flex align-content-center justify-content-center ">
              <CustomSpinner />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="d-flex text-dark  mb-4 ">
            <h2 className="text-center my-auto">Session Info</h2>
            <div className="text-end my-auto" style={{ marginLeft: "10px" }}>
              <Button
                label="Add New Session Info"
                icon="pi pi-plus"
                type="button"
                className="rounded"
                onClick={() => navigate(newRoute)}
              />
            </div>
          </div>
          <DataTable
            showGridlines
            value={data}
            dataKey="SessionID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage="No session found!"
            filters={filters}
            filterDisplay="row"
            resizableColumns
            size="small"
            selectionMode="single"
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column
              body={(rowData) =>
                ActionButtons(
                  rowData.SessionID,
                  handleDeleteShow,
                  handleEditShow,
                  handleView
                )
              }
              header="Actions"
              resizeable={false}
              style={{ minWidth: "7rem", maxWidth: "7rem", width: "7rem" }}
            ></Column>
            <Column
              field="SessionTitle"
              filter
              filterPlaceholder="Search by session"
              sortable
              header="Session"
              style={{ minWidth: "20rem" }}
            ></Column>
            <Column
              field="SessionOpeningDate"
              sortable
              header="Opening Date"
              style={{ minWidth: "20rem" }}
            ></Column>
            <Column
              field="SessionClosingDate"
              sortable
              header="Closing Date"
              style={{ minWidth: "20rem" }}
            ></Column>
          </DataTable>
          {EditModal}
          {DeleteModal}
        </>
      )}
    </div>
  );
}
export function SessionForm({ pagesTitle, user, mode }) {
  document.title = "Session Info Entry";
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { SessionID } = useParams();
  const { control, handleSubmit, setFocus, setValue, reset } = useForm({
    defaultValues: {
      SessionTitle: "",
      InActive: false,
    },
  });
  const SessionData = useQuery({
    queryKey: [queryKey, SessionID],
    queryFn: () => fetchSessionById(SessionID, user.userID),
    enabled: SessionID !== undefined,
    initialData: [],
  });

  useEffect(() => {
    if (+SessionID !== 0 && SessionData.data.length > 0) {
      setValue("SessionTitle", SessionData?.data[0]?.SessionTitle);
      setValue(
        "SessionOpeningDate",
        parseISO(SessionData?.data[0]?.SessionOpeningDate)
      );
      setValue(
        "SessionClosingDate",
        parseISO(SessionData?.data[0]?.SessionClosingDate)
      );
    }
  }, [SessionID, SessionData.data]);

  const mutation = useMutation({
    mutationFn: addNewSession,
    onSuccess: ({ success, RecordID }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        queryClient.invalidateQueries({
          queryKey: [SELECT_QUERY_KEYS.SESSION_SELECT_QUERY_KEY],
        });
        navigate(`${parentRoute}/${RecordID}`);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSessionByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({
        queryKey: [SELECT_QUERY_KEYS.SESSION_SELECT_QUERY_KEY],
      });
      navigate(parentRoute);
    },
  });

  function handleDelete() {
    deleteMutation.mutate({
      SessionID: SessionID,
      LoginUserID: user.userID,
    });
  }

  function handleAddNew() {
    reset();
    navigate(newRoute);
  }
  function handleCancel() {
    if (mode === "new") {
      navigate(parentRoute);
    } else if (mode === "edit") {
      navigate(viewRoute + SessionID);
    }
  }
  function handleEdit() {
    navigate(editRoute + SessionID);
  }
  function onSubmit(data) {
    mutation.mutate({
      formData: data,
      userID: user.userID,
      SessionID: SessionID,
    });
  }

  return (
    <>
      {SessionData.isLoading ? (
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
              handleSave={() => handleSubmit(onSubmit)()}
              GoBackLabel="Sessions"
            />
          </div>
          <form className="mt-4">
            <Row>
              <Form.Group as={Col}>
                <Form.Label>
                  Session Info
                  <span className="text-danger fw-bold ">*</span>
                </Form.Label>

                <div>
                  <TextInput
                    control={control}
                    ID={"SessionTitle"}
                    required={true}
                    focusOptions={() => setFocus("InActive")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label style={{ fontSize: "14px", fontWeight: "bold" }}>
                  Session Opening Date
                  <span className="text-danger fw-bold ">*</span>
                </Form.Label>
                <div>
                  <CDatePicker
                    control={control}
                    name={"SessionOpeningDate"}
                    disabled={mode === "view"}
                    required={true}
                  />
                </div>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label style={{ fontSize: "14px", fontWeight: "bold" }}>
                  Session Closing Date
                  <span className="text-danger fw-bold ">*</span>
                </Form.Label>
                <div>
                  <CDatePicker
                    control={control}
                    name={"SessionClosingDate"}
                    disabled={mode === "view"}
                    required={true}
                  />
                </div>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col}>
                <Form.Label></Form.Label>
                <div className="mt-1">
                  <CheckBox
                    control={control}
                    ID={"InActive"}
                    Label={"InActive"}
                    isEnable={mode !== "view"}
                  />
                </div>
              </Form.Group>
            </Row>
          </form>
        </>
      )}
    </>
  );
}
