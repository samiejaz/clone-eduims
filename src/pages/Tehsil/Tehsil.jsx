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
  addNewTehsil,
  deleteTehsilByID,
  fetchAllTehsiles,
  fetchTehsilById,
} from "../../api/TehsilData";
import CDropdown from "../../components/Forms/CDropdown";
import { useAllCountiesSelectData } from "../../hooks/SelectData/useSelectData";
import { QUERY_KEYS, ROUTE_URLS } from "../../utils/enums";

let parentRoute = ROUTE_URLS.TEHSIL_ROUTE;
let editRoute = `${parentRoute}/edit/`;
let newRoute = `${parentRoute}/new`;
let viewRoute = `${parentRoute}/`;
let detail = "#22C55E";
let queryKey = QUERY_KEYS.TEHSIL_QUERY_KEY;

export function TehsilDetail() {
  document.title = "Tehsils";

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
    queryFn: () => fetchAllTehsiles(user.userID),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTehsilByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });

  function handleDelete(id) {
    deleteMutation.mutate({ TehsilID: id, LoginUserID: user.userID });
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
          {/* <LinkActionButtons /> */}
          <div className="d-flex text-dark  mb-4 ">
            <h2 className="text-center my-auto">Tehsils</h2>
            <div className="text-end my-auto" style={{ marginLeft: "10px" }}>
              <Button
                label="Add New Tehsil"
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
            dataKey="TehsilID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage="No tehsils found!"
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
                  rowData.TehsilID,
                  () => handleDeleteShow(rowData.TehsilID),
                  handleEditShow,
                  handleView
                )
              }
              header="Actions"
              resizeable={false}
              style={{ minWidth: "7rem", maxWidth: "10rem", width: "7rem" }}
            ></Column>
            <Column
              field="TehsilTitle"
              filter
              filterPlaceholder="Search by Tehsil"
              sortable
              header="Tehsil"
            ></Column>
          </DataTable>
          {EditModal}
          {DeleteModal}
        </>
      )}
    </div>
  );
}
export function TehsilForm({ pagesTitle, user, mode }) {
  document.title = "Tehsil Entry";
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { TehsilID } = useParams();
  const { control, handleSubmit, setFocus, setValue, reset } = useForm({
    defaultValues: {
      TehsilTitle: "",
      Country: [],
      InActive: false,
    },
  });

  const countriesSelectData = useAllCountiesSelectData();

  const TehsilData = useQuery({
    queryKey: [queryKey, TehsilID],
    queryFn: () => fetchTehsilById(TehsilID, user?.userID),
    enabled: TehsilID !== undefined,
    initialData: [],
  });

  useEffect(() => {
    if (TehsilID !== undefined && TehsilData.data.length > 0) {
      setValue("TehsilTitle", TehsilData.data[0].TehsilTitle);
      setValue("Country", TehsilData.data[0].CountryID);
      setValue("InActive", TehsilData.data[0].InActive);
    }
  }, [TehsilID, TehsilData]);

  const mutation = useMutation({
    mutationFn: addNewTehsil,
    onSuccess: (success) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        navigate(`${parentRoute}/${TehsilID}`);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTehsilByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      navigate(parentRoute);
    },
  });

  function handleDelete() {
    deleteMutation.mutate({ TehsilID: TehsilID, LoginUserID: user.userID });
  }

  function handleAddNew() {
    reset();
    navigate(newRoute);
  }
  function handleCancel() {
    if (mode === "new") {
      navigate(parentRoute);
    } else if (mode === "edit") {
      navigate(viewRoute + TehsilID);
    }
  }
  function handleEdit() {
    navigate(editRoute + TehsilID);
  }

  function onSubmit(data) {
    mutation.mutate({
      formData: data,
      userID: user.userID,
      TehsilID: TehsilID,
    });
  }

  return (
    <>
      {TehsilData.isLoading ? (
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
              GoBackLabel="Tehsils"
            />
          </div>
          <form className="mt-4">
            <Row>
              <Form.Group as={Col} controlId="TehsilTitle">
                <Form.Label>
                  Tehsil
                  <span className="text-danger fw-bold ">*</span>
                </Form.Label>

                <div>
                  <TextInput
                    control={control}
                    ID={"TehsilTitle"}
                    required={true}
                    focusOptions={() => setFocus("Country")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </Form.Group>
              <Form.Group as={Col} controlId="Country">
                <Form.Label style={{ fontSize: "14px", fontWeight: "bold" }}>
                  Country
                  <span className="text-danger fw-bold ">*</span>
                </Form.Label>
                <div>
                  <CDropdown
                    control={control}
                    name={`Country`}
                    optionLabel="CountryTitle"
                    optionValue="CountryID"
                    placeholder="Select a country"
                    options={countriesSelectData.data}
                    required={true}
                    disabled={mode === "view"}
                    focusOptions={() => setFocus("InActive")}
                  />
                </div>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} controlId="InActive">
                <div className="mt-2">
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
