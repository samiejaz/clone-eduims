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
  addNewLeadSource,
  deleteLeadSourceByID,
  fetchAllLeadSources,
  fetchLeadSourceById,
} from "../../api/LeadSourceData";
import { ROUTE_URLS, QUERY_KEYS } from "../../utils/enums";

let parentRoute = ROUTE_URLS.LEED_SOURCE_ROUTE;
let editRoute = `${parentRoute}/edit/`;
let newRoute = `${parentRoute}/new`;
let viewRoute = `${parentRoute}/`;
let detail = "#22C55E";
let queryKey = QUERY_KEYS.LEED_SOURCE_QUERY_KEY;

export function LeadSourceDetail() {
  document.title = "Lead Sources";

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    render: EditModal,
    handleShow: handleEditShow,
    handleClose: handleEditClose,
    setIdToEdit,
  } = useEditModal(handleEdit);

  const {
    render: DeleteModal,
    handleShow: handleDeleteShow,
    handleClose: handleDeleteClose,
    setIdToDelete,
  } = useDeleteModal(handleDelete);

  const [filters, setFilters] = useState({
    VoucherNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
    CustomerName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    AccountTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ReceiptMode: { value: null, matchMode: FilterMatchMode.CONTAINS },
    TotalNetAmount: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const user = useUserData();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchAllLeadSources(user.userID),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLeadSourceByID,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
    },
  });

  function handleDelete(id) {
    deleteMutation.mutate({ LeadSourceID: id, LoginUserID: user.userID });
    handleDeleteClose();
    setIdToDelete(0);
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
            <h2 className="text-center my-auto">Lead Sources</h2>
            <div className="text-end my-auto" style={{ marginLeft: "10px" }}>
              <Button
                label="Add New Lead Source"
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
            dataKey="LeadSourceID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage="No Lead Sources found!"
            filters={filters}
            filterDisplay="row"
            resizableColumns
            size="small"
            selectionMode="single"
            style={{ backgroundColor: "red" }}
            className={"thead"}
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column
              body={(rowData) =>
                ActionButtons(
                  rowData.LeadSourceID,
                  () => handleDeleteShow(rowData.LeadSourceID),
                  handleEditShow,
                  handleView
                )
              }
              header="Actions"
              resizeable={false}
              style={{ minWidth: "7rem", maxWidth: "10rem", width: "7rem" }}
            ></Column>
            <Column
              field="LeadSourceTitle"
              filter
              filterPlaceholder="Search by Lead Source"
              sortable
              header="Lead Source"
            ></Column>
          </DataTable>
          {EditModal}
          {DeleteModal}
        </>
      )}
    </div>
  );
}
export function LeadSourceForm({ pagesTitle, user, mode }) {
  document.title = "Lead Source Entry";
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { LeadSourceID } = useParams();
  const { control, handleSubmit, setFocus, setValue, reset } = useForm({
    defaultValues: {
      LeadSourceTitle: "",
      InActive: false,
    },
  });
  const LeadSourceData = useQuery({
    queryKey: [queryKey, LeadSourceID],
    queryFn: () => fetchLeadSourceById(LeadSourceID, user.userID),
    enabled: LeadSourceID !== undefined,
    initialData: [],
  });

  useEffect(() => {
    if (LeadSourceID !== undefined && LeadSourceData?.data?.length > 0) {
      setValue("LeadSourceTitle", LeadSourceData.data[0].LeadSourceTitle);
      setValue("InActive", LeadSourceData.data[0].InActive);
    }
  }, [LeadSourceID, LeadSourceData]);

  const mutation = useMutation({
    mutationFn: addNewLeadSource,
    onSuccess: ({ success, RecordID }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        navigate(`${parentRoute}/${RecordID}`);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLeadSourceByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      navigate(parentRoute);
    },
  });

  function handleDelete() {
    deleteMutation.mutate({
      LeadSourceID: LeadSourceID,
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
      navigate(viewRoute + LeadSourceID);
    }
  }
  function handleEdit() {
    navigate(editRoute + LeadSourceID);
  }

  function onSubmit(data) {
    mutation.mutate({
      formData: data,
      userID: user.userID,
      LeadSourceID: LeadSourceID,
    });
  }

  return (
    <>
      {LeadSourceData.isLoading ? (
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
              GoBackLabel="LeadSources"
            />
          </div>
          <form className="mt-4">
            <Row>
              <Form.Group as={Col} controlId="LeadSourceTitle">
                <Form.Label>
                  LeadSource
                  <span className="text-danger fw-bold ">*</span>
                </Form.Label>

                <div>
                  <TextInput
                    control={control}
                    ID={"LeadSourceTitle"}
                    required={true}
                    focusOptions={() => setFocus("InActive")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </Form.Group>
              <Form.Group as={Col} controlId="InActive">
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
