import React from "react";
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
  addNewProductInfo,
  deleteProductInfoByID,
  fetchAllProducts,
  fetchProductInfoByID,
} from "../../api/ProductInfoData";
import { ROUTE_URLS, QUERY_KEYS, SELECT_QUERY_KEYS } from "../../utils/enums";
import CDropdown from "../../components/Forms/CDropdown";
import { useUserData } from "../../context/AuthContext";
import {
  fetchAllBusinessUnitsForSelect,
  fetchAllProductCategoriesForSelect,
} from "../../api/SelectData";

const ProductInfo = () => {
  return <div>ProductInfo</div>;
};

export default ProductInfo;

let parentRoute = ROUTE_URLS.UTILITIES.PRODUCT_INFO_ROUTE;
let editRoute = `${parentRoute}/edit/`;
let newRoute = `${parentRoute}/new`;
let viewRoute = `${parentRoute}/`;
let detail = "#22C55E";
let queryKey = QUERY_KEYS.PRODUCT_INFO_QUERY_KEY;

export function ProductInfoDetail() {
  document.title = "Products";
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
    ProductInfoTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ProductType: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const user = useUserData();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchAllProducts(user.userID),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProductInfoByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      navigate(parentRoute);
    },
  });

  function handleDelete(id) {
    deleteMutation.mutate({
      ProductInfoID: id,
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
            <h2 className="text-center my-auto">Products</h2>
            <div className="text-end my-auto" style={{ marginLeft: "10px" }}>
              <Button
                label="Add New Product Info"
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
            dataKey="ProductInfoID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage="No Products found!"
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
                  rowData.ProductInfoID,
                  () => handleDeleteShow(rowData.ProductInfoID),
                  handleEditShow,
                  handleView
                )
              }
              header="Actions"
              resizeable={false}
              style={{ minWidth: "7rem", maxWidth: "10rem", width: "7rem" }}
            ></Column>
            <Column
              field="ProductInfoTitle"
              filter
              filterPlaceholder="Search by Info"
              sortable
              header={`${"Product"} Info`}
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

export function ProductInfoForm({ pagesTitle, mode }) {
  document.title = "Product Info Entry";
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { ProductInfoID } = useParams();
  const [selectedBusinessUnits, setSelectedBusinessUnits] = useState();
  const { control, handleSubmit, setFocus, setValue, reset, register } =
    useForm({
      defaultValues: {
        ProductInfoTitle: "",
        InActive: false,
      },
    });

  const user = useUserData();

  const ProductInfoData = useQuery({
    queryKey: [queryKey, ProductInfoID],
    queryFn: () => fetchProductInfoByID(ProductInfoID, user.userID),
    initialData: [],
  });

  const { data: BusinessUnitSelectData } = useQuery({
    queryKey: [SELECT_QUERY_KEYS.BUSINESS_UNIT_SELECT_QUERY_KEY],
    queryFn: fetchAllBusinessUnitsForSelect,
    initialData: [],
  });
  const { data: ProductCategoriesSelectData } = useQuery({
    queryKey: [SELECT_QUERY_KEYS.PRODUCT_CATEGORIES_SELECT_QUERY_KEY],
    queryFn: fetchAllProductCategoriesForSelect,
    initialData: [],
  });

  useEffect(() => {
    if (ProductInfoID !== undefined && ProductInfoData.data.data?.length > 0) {
      console.log(ProductInfoID, ProductInfoData);
      if (ProductInfoData?.data.data[0]?.ProductInfoID !== 0) {
        setValue(
          "ProductCategoryID",
          ProductInfoData?.data.data[0]?.ProductCategoryID
        );
      }
      setValue(
        "ProductInfoTitle",
        ProductInfoData?.data.data[0]?.ProductInfoTitle
      );
      setValue("InActive", ProductInfoData?.data.data[0]?.InActive);
      setSelectedBusinessUnits(ProductInfoData.data.Detail);
    }
  }, [ProductInfoID, ProductInfoData.data]);

  const mutation = useMutation({
    mutationFn: addNewProductInfo,
    onSuccess: ({ success, RecordID }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        navigate(`${parentRoute}/${RecordID}`);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProductInfoByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      navigate(parentRoute);
    },
  });

  function handleDelete() {
    deleteMutation.mutate({
      ProductInfoID: ProductInfoID,
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
      navigate(viewRoute + ProductInfoID);
    }
  }
  function handleEdit() {
    navigate(editRoute + ProductInfoID);
  }
  function onSubmit(data) {
    mutation.mutate({
      formData: data,
      userID: user.userID,
      ProductInfoID: ProductInfoID,
      selectedBusinessUnits: selectedBusinessUnits,
    });
  }

  const isRowSelectable = (event) => {
    return mode !== "view" ? true : false;
  };

  return (
    <>
      {ProductInfoData.isLoading ? (
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
              GoBackLabel="Product Infos"
            />
          </div>
          <form className="mt-4">
            <Row>
              <Form.Group as={Col}>
                <Form.Label>
                  Product Info
                  <span className="text-danger fw-bold ">*</span>
                </Form.Label>

                <div>
                  <TextInput
                    control={control}
                    ID={"ProductInfoTitle"}
                    required={true}
                    focusOptions={() => setFocus("ProductType")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>
                  Product Category
                  <span className="text-danger fw-bold ">*</span>
                </Form.Label>

                <div>
                  <CDropdown
                    control={control}
                    name="ProductCategoryID"
                    options={ProductCategoriesSelectData}
                    optionLabel="ProductCategoryTitle"
                    optionValue="ProductCategoryID"
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
            <Row>
              <Form.Group as={Col}>
                <DataTable
                  id="businessUnitTable"
                  value={BusinessUnitSelectData}
                  selectionMode={"checkbox"}
                  selection={selectedBusinessUnits}
                  onSelectionChange={(e) => setSelectedBusinessUnits(e.value)}
                  dataKey="BusinessUnitID"
                  tableStyle={{ minWidth: "50rem" }}
                  size="sm"
                  isDataSelectable={isRowSelectable}
                >
                  <Column
                    selectionMode="multiple"
                    headerStyle={{ width: "3rem" }}
                  ></Column>
                  <Column
                    field="BusinessUnitName"
                    header="Business Unit"
                  ></Column>
                </DataTable>
              </Form.Group>
            </Row>
          </form>
        </>
      )}
    </>
  );
}
