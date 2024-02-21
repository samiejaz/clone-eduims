import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import useEditModal from "../../hooks/useEditModalHook";
import useDeleteModal from "../../hooks/useDeleteModalHook";
import { FilterMatchMode } from "primereact/api";
import { useEffect, BusinessUnitef, useState, useRef } from "react";
import { CustomSpinner } from "../../components/CustomSpinner";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ActionButtons from "../../components/ActionButtons";
import { Controller, useForm } from "react-hook-form";
import ButtonToolBar from "../CustomerInvoice/CustomerInvoiceToolbar";
import { Col, Form, Row } from "react-bootstrap";
import TextInput from "../../components/Forms/TextInput";
import CheckBox from "../../components/Forms/CheckBox";
import { useUserData } from "../../context/AuthContext";
import {
  addNewBusinessUnit,
  deleteBusinessUnitByID,
  fetchAllBusinessUnits,
  fetchBusinessUnitById,
} from "../../api/BusinessUnitData";
import { ROUTE_URLS, QUERY_KEYS } from "../../utils/enums";
import ImageContainer from "../../components/ImageContainer";
import { ColorPicker } from "primereact/colorpicker";
import { classNames } from "primereact/utils";
import { Tooltip } from "primereact/tooltip";

let parentRoute = ROUTE_URLS.GENERAL.BUSINESS_UNITS;
let editRoute = `${parentRoute}/edit/`;
let newRoute = `${parentRoute}/new`;
let viewRoute = `${parentRoute}/`;
let detail = "#22C55E";
let queryKey = QUERY_KEYS.BUSINESS_UNIT_QUERY_KEY;

export function BusinessUnitDetail() {
  document.title = "BusinessUnits";

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
    FirstName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    LastName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    BusinessUnitName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    Email: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const user = useUserData();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchAllBusinessUnits(user.userID),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBusinessUnitByID,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
    },
  });

  function handleDelete(id) {
    deleteMutation.mutate({
      BusinessUnitID: id,
      LoginUserID: user.userID,
    });
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
            <h2 className="text-center my-auto">BusinessUnits</h2>
            <div className="text-end my-auto" style={{ marginLeft: "10px" }}>
              <Button
                label="Add New BusinessUnit"
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
            dataKey="BusinessUnitID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage="No Business Unit found!"
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
                  rowData.BusinessUnitID,
                  () => handleDeleteShow(rowData.BusinessUnitID),
                  handleEditShow,
                  handleView
                )
              }
              header="Actions"
              resizeable={false}
              style={{ minWidth: "7rem", maxWidth: "10rem", width: "7rem" }}
            ></Column>
            <Column
              field="BusinessUnitName"
              filter
              filterPlaceholder="Search by company"
              sortable
              header="Company"
              style={{ minWidth: "20rem" }}
            ></Column>
            <Column
              field="Address"
              sortable
              header="Address"
              filter
              filterPlaceholder="Search by address"
            ></Column>
            <Column
              field="LandlineNo"
              sortable
              header="LandlineNo"
              filter
              filterPlaceholder="Search by landline no"
            ></Column>
            <Column
              field="MobileNo"
              sortable
              header="MobileNo"
              filter
              filterPlaceholder="Search by mobile no"
            ></Column>
            <Column
              field="Email"
              sortable
              header="Email"
              filter
              filterPlaceholder="Search by email"
            ></Column>
          </DataTable>
          {EditModal}
          {DeleteModal}
        </>
      )}
    </div>
  );
}

export function BusinessUnitForm({ pagesTitle, mode }) {
  document.title = "BusinessUnit Entry";

  const queryClient = useQueryClient();
  const imageRef = useRef();

  const navigate = useNavigate();
  const { BusinessUnitID } = useParams();

  const user = useUserData();
  const {
    control,
    handleSubmit,
    setFocus,
    setValue,
    reset,
    register,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      FirstName: "",
      LastName: "",
      Email: "",
      Password: "",
      BusinessUnitName: "",
      InActive: "",
      DepartmentID: [],
    },
  });

  const BusinessUnitData = useQuery({
    queryKey: [queryKey, BusinessUnitID],
    queryFn: () => fetchBusinessUnitById(BusinessUnitID, user.userID),
    enabled: BusinessUnitID !== undefined,
    initialData: [],
  });

  useEffect(() => {
    if (+BusinessUnitID !== undefined && BusinessUnitData?.data?.length > 0) {
      try {
        setValue(
          "BusinessUnitName",
          BusinessUnitData?.data[0]?.BusinessUnitName
        );
        setValue("Address", BusinessUnitData?.data[0]?.Address);
        setValue("LandlineNo", BusinessUnitData?.data[0]?.LandlineNo);
        setValue("MobileNo", BusinessUnitData?.data[0]?.MobileNo);
        setValue("Email", BusinessUnitData?.data[0]?.Email);
        setValue("Website", BusinessUnitData?.data[0]?.Website);
        setValue(
          "AuthorityPersonName",
          BusinessUnitData?.data[0]?.AuthorityPersonName
        );
        setValue(
          "AuthorityPersonNo",
          BusinessUnitData?.data[0]?.AuthorityPersonNo
        );
        setValue(
          "AuthorityPersonEmail",
          BusinessUnitData?.data[0]?.AuthorityPersonEmail
        );
        setValue("NTNno", BusinessUnitData?.data[0]?.NTNno);
        setValue("STRNo", BusinessUnitData?.data[0]?.STRNo);
        setValue("Description", BusinessUnitData?.data[0]?.Description);
        setValue("InActive", BusinessUnitData?.data[0]?.InActive);

        setValue("PrimaryColor", {
          r: BusinessUnitData?.data[0]?.RedColor,
          g: BusinessUnitData?.data[0]?.GreenColor,
          b: BusinessUnitData?.data[0]?.BlueColor,
        });
        imageRef.current.src =
          "data:image/png;base64," + BusinessUnitData?.data[0]?.Logo;
      } catch (error) {}
    }
  }, [BusinessUnitID, BusinessUnitData.data]);

  const mutation = useMutation({
    mutationFn: addNewBusinessUnit,
    onSuccess: ({ success, RecordID }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        navigate(`${parentRoute}/${RecordID}`);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBusinessUnitByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      navigate(parentRoute);
    },
  });

  function handleDelete() {
    deleteMutation.mutate({
      BusinessUnitID: BusinessUnitID,
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
      navigate(viewRoute + BusinessUnitID);
    }
  }
  function handleEdit() {
    navigate(editRoute + BusinessUnitID);
  }

  function onSubmit(data) {
    mutation.mutate({
      formData: data,
      userID: user?.userID,
      BusinessUnitID: BusinessUnitID,
      BusinessUnitLogo: imageRef.current.src,
    });
  }

  return (
    <>
      {BusinessUnitData.isLoading ? (
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
              GoBackLabel="Business Units"
            />
          </div>
          <form className="mt-4">
            <Row>
              <Form.Group as={Col}>
                <Form.Label>
                  Business Unit Name
                  <span className="text-danger fw-bold ">*</span>
                </Form.Label>

                <div>
                  <TextInput
                    control={control}
                    ID={"BusinessUnitName"}
                    required={true}
                    focusOptions={() => setFocus("LandlineNo")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Landline No</Form.Label>

                <div>
                  <TextInput
                    control={control}
                    ID={"LandlineNo"}
                    focusOptions={() => setFocus("MobileNo")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Mobile No</Form.Label>

                <div>
                  <TextInput
                    control={control}
                    ID={"MobileNo"}
                    focusOptions={() => setFocus("Email")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Email</Form.Label>

                <div>
                  <TextInput
                    control={control}
                    ID={"Email"}
                    focusOptions={() => setFocus("Website")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col}>
                <Form.Label>Website</Form.Label>

                <div>
                  <TextInput
                    control={control}
                    ID={"Website"}
                    focusOptions={() => setFocus("AuthorityPersonName")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>
                  Authority Person / CEO Name
                  <span className="text-danger fw-bold ">*</span>
                </Form.Label>

                <div>
                  <TextInput
                    control={control}
                    ID={"AuthorityPersonName"}
                    focusOptions={() => setFocus("AuthorityPersonNo")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>
                  CEO Mobile No
                  <span className="text-danger fw-bold ">*</span>
                </Form.Label>

                <div>
                  <TextInput
                    control={control}
                    ID={"AuthorityPersonNo"}
                    focusOptions={() => setFocus("AuthorityPersonEmail")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>
                  CEO Email
                  <span className="text-danger fw-bold ">*</span>
                </Form.Label>

                <div>
                  <TextInput
                    control={control}
                    ID={"AuthorityPersonEmail"}
                    focusOptions={() => setFocus("NTNno")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col}>
                <Form.Label>NTN-No</Form.Label>

                <div>
                  <TextInput
                    control={control}
                    ID={"NTNno"}
                    focusOptions={() => setFocus("STRNo")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Sales Tax Return No</Form.Label>

                <div>
                  <TextInput
                    control={control}
                    ID={"STRNo"}
                    focusOptions={() => setFocus("Description")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col}>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as={"textarea"}
                  rows={1}
                  disabled={mode === "view"}
                  className="form-control"
                  style={{
                    padding: "0.3rem 0.4rem",
                    fontSize: "0.8em",
                  }}
                  {...register("Description")}
                />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col}>
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

            <Row>
              <Form.Group as={Col} style={{ width: "100%" }}>
                <Tooltip target=".custom-target-icon" />
                <Form.Label style={{ position: "relative" }}>
                  Logo
                  <i
                    className="custom-target-icon pi pi-exclamation-circle p-text-secondary"
                    data-pr-tooltip="Recommended Size (500x500px)"
                    data-pr-position="right"
                    data-pr-at="right+5 top"
                    data-pr-my="left center-2"
                    style={{
                      cursor: "pointer",
                      position: "absolute",
                      right: "-20px",
                      top: "1px",
                    }}
                  ></i>
                </Form.Label>{" "}
                <div>
                  <ImageContainer
                    imageRef={imageRef}
                    hideButtons={mode === "view"}
                  />
                </div>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Choose your primary color</Form.Label>
                <div>
                  <Controller
                    name="PrimaryColor"
                    control={control}
                    render={({ field, fieldState }) => (
                      <ColorPicker
                        name="PrimaryColor"
                        format="rgb"
                        control={control}
                        value={field.value}
                        disabled={mode === "view"}
                        className={classNames({
                          "p-invalid": fieldState.error,
                        })}
                        onChange={(e) => field.onChange(e.value)}
                      />
                    )}
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
