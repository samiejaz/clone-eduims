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
  addNewBusinessType,
  deleteBusinessTypeByID,
  fetchAllBusinessTypes,
  fetchBusinessTypeById,
} from "../../api/BusinessTypeData";
import { ROUTE_URLS, QUERY_KEYS } from "../../utils/enums";

let parentRoute = ROUTE_URLS.BUSINESS_TYPE;
let editRoute = `${parentRoute}/edit/`;
let newRoute = `${parentRoute}/new`;
let viewRoute = `${parentRoute}/`;
let detail = "#22C55E";
let queryKey = QUERY_KEYS.BUSINESS_TYPE_QUERY_KEY;

export function BusinessTypeDetail() {
  document.title = "Business Types";
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
    queryFn: () => fetchAllBusinessTypes(user.userID),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBusinessTypeByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      navigate(parentRoute);
    },
  });

  function handleDelete(id) {
    deleteMutation.mutate({
      BusinessTypeID: id,
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
            <h2 className="text-center my-auto">Business Types</h2>
            <div className="text-end my-auto" style={{ marginLeft: "10px" }}>
              <Button
                label="Add New Business Type"
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
            dataKey="BusinessTypeID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage="No business types found!"
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
                  rowData.BusinessTypeID,
                  () => handleDeleteShow(rowData.BusinessTypeID),
                  handleEditShow,
                  handleView
                )
              }
              header="Actions"
              resizeable={false}
              style={{ minWidth: "7rem", maxWidth: "10rem", width: "7rem" }}
            ></Column>
            <Column
              field="BusinessTypeTitle"
              filter
              filterPlaceholder="Search by Business Type"
              sortable
              header="Business Type"
            ></Column>
          </DataTable>
          {EditModal}
          {DeleteModal}
        </>
      )}
    </div>
  );
}
export function BusinessTypeForm({ pagesTitle, user, mode }) {
  document.title = "Business Type Entry";
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { BusinessTypeID } = useParams();
  const { control, handleSubmit, setFocus, setValue, reset } = useForm({
    defaultValues: {
      BusinessTypeTitle: "",
      InActive: false,
    },
  });
  const BusinessTypeData = useQuery({
    queryKey: [queryKey, BusinessTypeID],
    queryFn: () => fetchBusinessTypeById(BusinessTypeID, user.userID),
    enabled: BusinessTypeID !== undefined,
    initialData: [],
  });

  useEffect(() => {
    if (BusinessTypeID !== undefined && BusinessTypeData.data.length > 0) {
      setValue("BusinessTypeTitle", BusinessTypeData.data[0].BusinessTypeTitle);
      setValue("InActive", BusinessTypeData.data[0].InActive);
    }
  }, [BusinessTypeID, BusinessTypeData]);

  const mutation = useMutation({
    mutationFn: addNewBusinessType,
    onSuccess: ({ success, RecordID }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        navigate(`${parentRoute}/${RecordID}`);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBusinessTypeByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      navigate(parentRoute);
    },
  });

  function handleDelete() {
    deleteMutation.mutate({
      BusinessTypeID: BusinessTypeID,
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
      navigate(viewRoute + BusinessTypeID);
    }
  }
  function handleEdit() {
    navigate(editRoute + BusinessTypeID);
  }
  function onSubmit(data) {
    mutation.mutate({
      formData: data,
      userID: user.userID,
      BusinessTypeID: BusinessTypeID,
    });
  }

  return (
    <>
      {BusinessTypeData.isLoading ? (
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
              GoBackLabel="Business Types"
            />
          </div>
          <form className="mt-4">
            <Row>
              <Form.Group as={Col} controlId="BusinessTypeTitle">
                <Form.Label>
                  Business Type
                  <span className="text-danger fw-bold ">*</span>
                </Form.Label>

                <div>
                  <TextInput
                    control={control}
                    ID={"BusinessTypeTitle"}
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
