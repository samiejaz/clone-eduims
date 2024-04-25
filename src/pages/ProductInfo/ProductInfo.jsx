import React, { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { FilterMatchMode } from "primereact/api";
import { useEffect, useState } from "react";
import { CustomSpinner } from "../../components/CustomSpinner";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ActionButtons from "../../components/ActionButtons";
import { useForm } from "react-hook-form";
import ButtonToolBar from "../../components/ActionsToolbar";
import { Col, Form, Row } from "react-bootstrap";
import TextInput from "../../components/Forms/TextInput";
import CheckBox from "../../components/Forms/CheckBox";
import {
  addNewProductInfo,
  deleteProductInfoByID,
  fetchAllProducts,
  fetchProductInfoByID,
} from "../../api/ProductInfoData";
import {
  ROUTE_URLS,
  QUERY_KEYS,
  SELECT_QUERY_KEYS,
  MENU_KEYS,
} from "../../utils/enums";
import CDropdown from "../../components/Forms/CDropdown";
import { useUserData } from "../../context/AuthContext";
import {
  fetchAllBusinessUnitsForSelect,
  fetchAllProductCategoriesForSelect,
} from "../../api/SelectData";
import { AppConfigurationContext } from "../../context/AppConfigurationContext";
import useConfirmationModal from "../../hooks/useConfirmationModalHook";
import AccessDeniedPage from "../../components/AccessDeniedPage";
import { UserRightsContext } from "../../context/UserRightContext";
import { encryptID } from "../../utils/crypto";

let parentRoute = ROUTE_URLS.UTILITIES.PRODUCT_INFO_ROUTE;
let editRoute = `${parentRoute}/edit/`;
let newRoute = `${parentRoute}/new`;
let viewRoute = `${parentRoute}/`;
let queryKey = QUERY_KEYS.PRODUCT_INFO_QUERY_KEY;
let IDENTITY = "ProductInfoID";

export default function BanckAccountOpening() {
  const { checkForUserRights } = useContext(UserRightsContext);
  const [userRights, setUserRights] = useState([]);

  useEffect(() => {
    const rights = checkForUserRights({
      MenuKey: MENU_KEYS.UTILITIES.PRODUCT_INFO_FORM_KEY,
      MenuGroupKey: MENU_KEYS.UTILITIES.GROUP_KEY,
    });
    setUserRights([rights]);
  }, []);

  return (
    <Routes>
      {userRights && userRights[0]?.ShowForm ? (
        <>
          <Route
            index
            element={<ProductInfoDetail userRights={userRights} />}
          />
          <Route
            path={`:${IDENTITY}`}
            element={
              <ProductInfoForm
                key={"ProductInfoViewRoute"}
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
                    <ProductInfoForm
                      key={"ProductInfoEditRoute"}
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
                      <ProductInfoForm
                        key={"ProductInfoNewRoute"}
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
    </Routes>
  );
}

function ProductInfoDetail({ userRights }) {
  const { pageTitles } = useContext(AppConfigurationContext);

  document.title = `${pageTitles?.product + "s" || "Products"}`;
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { showDeleteDialog, showEditDialog } = useConfirmationModal({
    handleDelete,
    handleEdit,
  });
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
  }

  function handleView(id) {
    navigate(parentRoute + "/" + id);
  }
  return (
    <div className="mt-4">
      {isLoading || isFetching ? (
        <>
          <CustomSpinner />
        </>
      ) : (
        <>
          <div className="d-flex text-dark  mb-4 ">
            <h2 className="text-center my-auto">
              {pageTitles?.product + "s" || "Products"}
            </h2>
            <div className="text-end my-auto" style={{ marginLeft: "10px" }}>
              {userRights[0]?.RoleNew && (
                <>
                  <Button
                    label={`Add New ${pageTitles?.product || "Product"}`}
                    icon="pi pi-plus"
                    type="button"
                    className="rounded"
                    onClick={() => navigate(newRoute)}
                  />
                </>
              )}
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
            emptyMessage={`No ${
              pageTitles?.product + "s".toLowerCase() || "products"
            } found!`}
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
                ActionButtons({
                  ID: encryptID(rowData.ProductInfoID),
                  handleDelete: () =>
                    showDeleteDialog(encryptID(rowData.ProductInfoID)),
                  handleEdit: () =>
                    showEditDialog(encryptID(rowData.ProductInfoID)),
                  handleView: handleView,
                  showEditButton: userRights[0]?.RoleEdit,
                  showDeleteButton: userRights[0]?.RoleDelete,
                  viewBtnRoute: viewRoute + encryptID(rowData.ProductInfoID),
                })
              }
              header="Actions"
              resizeable={false}
              style={{ minWidth: "7rem", maxWidth: "10rem", width: "7rem" }}
            ></Column>
            <Column
              field="ProductInfoTitle"
              filter
              filterPlaceholder={`Search by ${
                pageTitles?.product.toLowerCase() || "product"
              }`}
              sortable
              header={`${pageTitles?.product || "Product"} Info`}
              style={{ minWidth: "20rem" }}
            ></Column>
            <Column
              field="ProductCategoryTitle"
              filter
              filterPlaceholder={`Search by ${
                pageTitles?.product.toLowerCase() || "product"
              } type`}
              sortable
              header={`${pageTitles?.product || "Product"} Type`}
              style={{ minWidth: "20rem" }}
            ></Column>
          </DataTable>
        </>
      )}
    </div>
  );
}

function ProductInfoForm({ mode, userRights }) {
  const { pageTitles } = useContext(AppConfigurationContext);
  document.title = `${pageTitles?.product || "Product"} Entry`;
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { ProductInfoID } = useParams();
  const [selectedBusinessUnits, setSelectedBusinessUnits] = useState();
  const { control, handleSubmit, setFocus, setValue, reset } = useForm({
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
              mode={mode}
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
              GoBackLabel={`${pageTitles?.product || "Product"}s`}
              showAddNewButton={userRights[0]?.RoleNew}
              showEditButton={userRights[0]?.RoleEdit}
              showDelete={userRights[0]?.RoleDelete}
            />
          </div>
          <form className="mt-4">
            <Row>
              <Form.Group as={Col}>
                <Form.Label>
                  {pageTitles?.product || "Product"} Title
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
                  {pageTitles?.product || "Product"} Category
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
