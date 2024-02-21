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
import {
  addNewProductCategory,
  deleteProductCategoryByID,
  fetchAllProductCategories,
  fetchProductCategoryById,
} from "../../api/ProductCategoryData";
import { ROUTE_URLS, QUERY_KEYS } from "../../utils/enums";
import CDropdown from "../../components/Forms/CDropdown";
import { useUserData } from "../../context/AuthContext";

let parentRoute = ROUTE_URLS.UTILITIES.PRODUCT_CATEGORY_ROUTE;
let editRoute = `${parentRoute}/edit/`;
let newRoute = `${parentRoute}/new`;
let viewRoute = `${parentRoute}/`;
let detail = "#22C55E";
let queryKey = QUERY_KEYS.PRODUCT_CATEGORIES_QUERY_KEY;

export function ProductCategoryDetail() {
  document.title = "Product Categories";
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
    ProductCategoryTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ProductType: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const user = useUserData();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchAllProductCategories(user.userID),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProductCategoryByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      navigate(parentRoute);
    },
  });

  function handleDelete(id) {
    deleteMutation.mutate({
      ProductCategoryID: id,
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
            <h2 className="text-center my-auto">Product Categories</h2>
            <div className="text-end my-auto" style={{ marginLeft: "10px" }}>
              <Button
                label="Add New Product Category"
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
            dataKey="ProductCategoryID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage="No product categories found!"
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
                  rowData.ProductCategoryID,
                  () => handleDeleteShow(rowData.ProductCategoryID),
                  handleEditShow,
                  handleView
                )
              }
              header="Actions"
              resizeable={false}
              style={{ minWidth: "7rem", maxWidth: "10rem", width: "7rem" }}
            ></Column>
            <Column
              field="ProductCategoryTitle"
              filter
              filterPlaceholder="Search by category"
              sortable
              header={`${"Product"} Category`}
              style={{ minWidth: "20rem" }}
            ></Column>
            <Column
              field="ProductType"
              filter
              filterPlaceholder={`Search by ${"product"} type`}
              sortable
              header={`"Product" Type`}
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

export function ProductCategoryForm({ pagesTitle, mode }) {
  document.title = "Product Category Entry";
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { ProductCategoryID } = useParams();
  const { control, handleSubmit, setFocus, setValue, reset, register } =
    useForm({
      defaultValues: {
        ProductCategoryTitle: "",
        InActive: false,
      },
    });

  const user = useUserData();

  const ProductCategoryData = useQuery({
    queryKey: [queryKey, ProductCategoryID],
    queryFn: () => fetchProductCategoryById(ProductCategoryID, user.userID),
    initialData: [],
  });

  useEffect(() => {
    if (
      ProductCategoryID !== undefined &&
      ProductCategoryData.data?.length > 0
    ) {
      setValue(
        "ProductCategoryTitle",
        ProductCategoryData?.data[0]?.ProductCategoryTitle
      );
      setValue("ProductType", ProductCategoryData?.data[0]?.ProductType);

      setValue("InActive", ProductCategoryData?.data[0]?.InActive);
    }
  }, [ProductCategoryID, ProductCategoryData]);

  const mutation = useMutation({
    mutationFn: addNewProductCategory,
    onSuccess: ({ success, RecordID }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        navigate(`${parentRoute}/${RecordID}`);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProductCategoryByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      navigate(parentRoute);
    },
  });

  function handleDelete() {
    deleteMutation.mutate({
      ProductCategoryID: ProductCategoryID,
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
      navigate(viewRoute + ProductCategoryID);
    }
  }
  function handleEdit() {
    navigate(editRoute + ProductCategoryID);
  }
  function onSubmit(data) {
    mutation.mutate({
      formData: data,
      userID: user.userID,
      ProductCategoryID: ProductCategoryID,
    });
  }

  const typesOptions = [
    { label: "Product", value: "Product" },
    { label: "Service", value: "Service" },
  ];

  return (
    <>
      {ProductCategoryData.isLoading ? (
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
              GoBackLabel="Product Categorys"
            />
          </div>
          <form className="mt-4">
            <Row>
              <Form.Group as={Col}>
                <Form.Label>
                  Product Category
                  <span className="text-danger fw-bold ">*</span>
                </Form.Label>

                <div>
                  <TextInput
                    control={control}
                    ID={"ProductCategoryTitle"}
                    required={true}
                    focusOptions={() => setFocus("ProductType")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>
                  Product Type
                  <span className="text-danger fw-bold ">*</span>
                </Form.Label>

                <div>
                  <CDropdown
                    control={control}
                    name="ProductType"
                    options={typesOptions}
                    required={true}
                    focusOptions={() => setFocus("InActive")}
                    disabled={mode === "view"}
                    showOnFocus={true}
                    filter={false}
                  />
                </div>
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
          </form>
        </>
      )}
    </>
  );
}
