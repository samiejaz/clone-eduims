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
import { MultiSelect } from "primereact/multiselect";
import ActionButtons from "../../components/ActionButtons";
import { Controller, useForm } from "react-hook-form";
import ButtonToolBar from "../CustomerInvoice/CustomerInvoiceToolbar";
import { Col, Form, Row } from "react-bootstrap";
import TextInput from "../../components/Forms/TextInput";

import { useUserData } from "../../context/AuthContext";
import {
  addNewGenOldCustomer,
  deleteGenOldCustomerByID,
  fetchAllGenOldCustomers,
  fetchGenOldCustomerById,
} from "../../api/GenOldCustomerData";
import { ROUTE_URLS, QUERY_KEYS } from "../../utils/enums";

import {
  useActivationClientsSelectData,
  useSoftwareClientsSelectData,
} from "../../hooks/SelectData/useSelectData";

let parentRoute = ROUTE_URLS.CUSTOMERS.OLD_CUSTOMER_ENTRY;
let editRoute = `${parentRoute}/edit/`;
let newRoute = `${parentRoute}/new`;
let viewRoute = `${parentRoute}/`;
let detail = "#22C55E";
let queryKey = QUERY_KEYS.OLD_CUSTOMERS_QUERY_KEY;

export function GenOldCustomerDetail() {
  document.title = "Old Customers";
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
    CustomerName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const user = useUserData();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchAllGenOldCustomers(user.userID),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGenOldCustomerByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      navigate(parentRoute);
    },
  });

  function handleDelete(id) {
    deleteMutation.mutate({
      CustomerID: id,
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
            <h2 className="text-center my-auto">Old Customers</h2>
            <div className="text-end my-auto" style={{ marginLeft: "10px" }}>
              <Button
                label="Add New"
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
            dataKey="CustomerID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage="No customers found!"
            filters={filters}
            filterDisplay="row"
            resizableColumns
            size="small"
            style={{ backgroundColor: "red" }}
            className={"thead"}
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column
              body={(rowData) =>
                ActionButtons(
                  rowData.CustomerID,
                  () => handleDeleteShow(rowData.CustomerID),
                  handleEditShow,
                  handleView,
                  true
                )
              }
              header="Actions"
              resizeable={false}
              style={{ minWidth: "7rem", maxWidth: "10rem", width: "7rem" }}
            ></Column>
            <Column
              field="CustomerName"
              filter
              filterPlaceholder="Search by Customer Name"
              sortable
              header="Customer Name"
            ></Column>
          </DataTable>
          {EditModal}
          {DeleteModal}
        </>
      )}
    </div>
  );
}
export function GenOldCustomerForm({ pagesTitle, mode }) {
  document.title = "Old Customer Entry";
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const user = useUserData();
  const { CustomerID } = useParams();
  const { control, handleSubmit, setFocus, setValue, reset } = useForm({
    defaultValues: {
      CustomerName: "",
      SoftwareMgtDbID: null,
      ActivationDbID: null,
    },
  });

  const activationClients = useActivationClientsSelectData(CustomerID ?? 0);
  const softwareClients = useSoftwareClientsSelectData(CustomerID ?? 0);

  const GenOldCustomerData = useQuery({
    queryKey: [queryKey, CustomerID],
    queryFn: () => fetchGenOldCustomerById(CustomerID, user.userID),
    initialData: [],
  });

  useEffect(() => {
    if (CustomerID !== undefined && GenOldCustomerData.data?.data?.length > 0) {
      if (GenOldCustomerData?.data?.data[0]?.ActivationDbID !== 0) {
        setValue(
          "ActivationDbID",
          GenOldCustomerData?.data?.dataAct?.map((item) => item.ACTCustomerID)
        );
      }
      if (GenOldCustomerData?.data?.data[0]?.SoftwareMgtDbID !== 0) {
        setValue(
          "SoftwareMgtDbID",
          GenOldCustomerData?.data?.dataSoft?.map((item) => item.SoftCustomerID)
        );
      }
      setValue("CustomerName", GenOldCustomerData?.data?.data[0]?.CustomerName);
      setValue("InActive", GenOldCustomerData?.data?.data[0]?.InActive);
    }
  }, [CustomerID, GenOldCustomerData.data.data]);

  const mutation = useMutation({
    mutationFn: addNewGenOldCustomer,
    onSuccess: ({ success, RecordID }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        navigate(`${parentRoute}/${RecordID}`);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGenOldCustomerByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      navigate(parentRoute);
    },
  });

  function handleDelete() {
    deleteMutation.mutate({
      CustomerID: CustomerID,
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
      navigate(viewRoute + CustomerID);
    }
  }
  function handleEdit() {
    navigate(editRoute + CustomerID);
  }
  function onSubmit(data) {
    mutation.mutate({
      formData: data,
      userID: user.userID,
      CustomerID: CustomerID,
    });
  }

  return (
    <>
      {GenOldCustomerData.isLoading ? (
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
              GoBackLabel="Old Customers"
              showDelete={false}
            />
          </div>
          <form className="mt-4">
            <Row>
              <Form.Group as={Col}>
                <Form.Label>
                  Customer Name (Activation)
                  <span className="text-danger fw-bold ">*</span>
                </Form.Label>

                <div>
                  <Controller
                    name="ActivationDbID"
                    control={control}
                    render={({ field }) => (
                      <MultiSelect
                        value={field.value}
                        options={activationClients.data}
                        onChange={(e) => {
                          field.onChange(e.value);
                        }}
                        optionLabel="ACTCustomerName"
                        optionValue="ACTCustomerID"
                        placeholder="Select a customer"
                        className="w-100"
                        display="chip"
                        filter
                        showClear
                        defaultValue={null}
                        virtualScrollerOptions={{ itemSize: 43 }}
                        disabled={mode === "view"}
                        pt={{
                          label: {
                            className: "multi-select-value-container gap-2",
                            style: { padding: "0.475rem 0.75rem" },
                          },
                          headerCheckbox: {
                            root: {
                              style: { display: "none" },
                            },
                          },
                        }}
                      />
                    )}
                  />
                </div>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>
                  Customer Name (Software Mgt.)
                  <span className="text-danger fw-bold ">*</span>
                </Form.Label>

                <div>
                  <Controller
                    name="SoftwareMgtDbID"
                    control={control}
                    render={({ field }) => (
                      <MultiSelect
                        value={field.value}
                        options={softwareClients.data}
                        onChange={(e) => field.onChange(e.value)}
                        optionLabel="SoftCustomerName"
                        optionValue="SoftCustomerID"
                        placeholder="Select a customer"
                        className="w-100"
                        display="chip"
                        filter
                        selectAll={false}
                        showClear
                        defaultValue={null}
                        virtualScrollerOptions={{ itemSize: 43 }}
                        disabled={mode === "view"}
                        pt={{
                          label: {
                            className: "multi-select-value-container gap-2",
                            style: { padding: "0.475rem 0.75rem" },
                          },
                          headerCheckbox: {
                            root: {
                              style: { display: "none" },
                            },
                          },
                        }}
                      />
                    )}
                  />
                </div>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col}>
                <Form.Label>Customer Name</Form.Label>
                <span className="text-danger fw-bold ">*</span>
                <div>
                  <TextInput
                    control={control}
                    ID={"CustomerName"}
                    required={true}
                    focusOptions={() => setFocus("BranchCode")}
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
