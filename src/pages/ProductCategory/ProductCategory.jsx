import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Route, Routes, useNavigate, useParams } from "react-router-dom"

import { FilterMatchMode } from "primereact/api"
import { useContext, useEffect, useState } from "react"
import { CustomSpinner } from "../../components/CustomSpinner"
import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import ActionButtons from "../../components/ActionButtons"
import { useForm } from "react-hook-form"
import ButtonToolBar from "../../components/ActionsToolbar"
import { Col, Form, Row } from "react-bootstrap"
import TextInput from "../../components/Forms/TextInput"
import CheckBox from "../../components/Forms/CheckBox"
import {
  addNewProductCategory,
  deleteProductCategoryByID,
  fetchAllProductCategories,
  fetchProductCategoryById,
} from "../../api/ProductCategoryData"
import { ROUTE_URLS, QUERY_KEYS, MENU_KEYS } from "../../utils/enums"
import CDropdown from "../../components/Forms/CDropdown"
import { useUserData } from "../../context/AuthContext"
import { AppConfigurationContext } from "../../context/AppConfigurationContext"
import useConfirmationModal from "../../hooks/useConfirmationModalHook"

import { encryptID } from "../../utils/crypto"

import { FormRightsWrapper } from "../../components/Wrappers/wrappers"
let parentRoute = ROUTE_URLS.UTILITIES.PRODUCT_CATEGORY_ROUTE
let editRoute = `${parentRoute}/edit/`
let newRoute = `${parentRoute}/new`
let viewRoute = `${parentRoute}/`
let queryKey = QUERY_KEYS.PRODUCT_CATEGORIES_QUERY_KEY
let IDENTITY = "ProductCategoryID"
let MENU_KEY = MENU_KEYS.UTILITIES.PRODUCT_CATEGORIES_FORM_KEY

export default function ProductCategory() {
  return (
    <FormRightsWrapper
      FormComponent={FormComponent}
      DetailComponent={DetailComponent}
      menuKey={MENU_KEY}
      identity={IDENTITY}
    />
  )
}

export function DetailComponent({ userRights }) {
  const { pageTitles } = useContext(AppConfigurationContext)
  document.title = `${pageTitles?.product ?? "Product"} Categories`
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { showDeleteDialog, showEditDialog } = useConfirmationModal({
    handleDelete,
    handleEdit,
  })

  const [filters, setFilters] = useState({
    ProductCategoryTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ProductType: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })

  const user = useUserData()

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchAllProductCategories(user.userID),
    initialData: [],
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProductCategoryByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
      navigate(parentRoute)
    },
  })

  function handleDelete(id) {
    deleteMutation.mutate({
      ProductCategoryID: id,
      LoginUserID: user.userID,
    })
  }

  function handleEdit(id) {
    navigate(editRoute + id)
  }

  function handleView(id) {
    navigate(parentRoute + "/" + id)
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
              {pageTitles?.product || "Product"} Categories
            </h2>
            <div className="text-end my-auto" style={{ marginLeft: "10px" }}>
              {userRights[0]?.RoleNew && (
                <>
                  <Button
                    label={`Add New ${
                      pageTitles?.product || "Product"
                    } Category`}
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
            dataKey="ProductCategoryID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage={`No ${
              pageTitles?.product || "Product"
            } categories found!`}
            filters={filters}
            filterDisplay="row"
            resizableColumns
            size="small"
            selectionMode="single"
            className={"thead"}
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column
              body={(rowData) =>
                ActionButtons({
                  ID: encryptID(rowData.ProductCategoryID),
                  handleDelete: () =>
                    showDeleteDialog(encryptID(rowData.ProductCategoryID)),
                  handleEdit: () =>
                    showEditDialog(encryptID(rowData.ProductCategoryID)),
                  handleView: handleView,
                  showEditButton: userRights[0]?.RoleEdit,
                  showDeleteButton: userRights[0]?.RoleDelete,
                  viewBtnRoute:
                    viewRoute + encryptID(rowData.ProductCategoryID),
                })
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
              header={`${pageTitles?.product || "Product"} Category`}
              style={{ minWidth: "20rem" }}
            ></Column>
            <Column
              field="ProductType"
              filter
              filterPlaceholder={`Search by ${
                pageTitles?.product?.toLowerCase() ?? "product"
              } type`}
              sortable
              header={`${pageTitles?.product || "Product"} Type`}
              style={{ minWidth: "20rem" }}
            ></Column>
          </DataTable>
        </>
      )}
    </div>
  )
}

function FormComponent({ mode, userRights }) {
  const { pageTitles } = useContext(AppConfigurationContext)
  document.title = `${pageTitles?.product || "Product"} Category Entry`

  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { ProductCategoryID } = useParams()
  const { control, handleSubmit, setFocus, setValue, reset } = useForm({
    defaultValues: {
      ProductCategoryTitle: "",
      InActive: false,
    },
  })

  const user = useUserData()

  const ProductCategoryData = useQuery({
    queryKey: [queryKey, ProductCategoryID],
    queryFn: () => fetchProductCategoryById(ProductCategoryID, user.userID),
    initialData: [],
    enabled: mode !== "new",
  })

  useEffect(() => {
    if (
      ProductCategoryID !== undefined &&
      ProductCategoryData.data?.length > 0
    ) {
      setValue(
        "ProductCategoryTitle",
        ProductCategoryData?.data[0]?.ProductCategoryTitle
      )
      setValue("ProductType", ProductCategoryData?.data[0]?.ProductType)

      setValue("InActive", ProductCategoryData?.data[0]?.InActive)
    }
  }, [ProductCategoryID, ProductCategoryData])

  const mutation = useMutation({
    mutationFn: addNewProductCategory,
    onSuccess: ({ success, RecordID }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] })
        navigate(`${parentRoute}/${RecordID}`)
      }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProductCategoryByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
      navigate(parentRoute)
    },
  })

  function handleDelete() {
    deleteMutation.mutate({
      ProductCategoryID: ProductCategoryID,
      LoginUserID: user.userID,
    })
  }

  function handleAddNew() {
    reset()
    navigate(newRoute)
  }
  function handleCancel() {
    if (mode === "new") {
      navigate(parentRoute)
    } else if (mode === "edit") {
      navigate(viewRoute + ProductCategoryID)
    }
  }
  function handleEdit() {
    navigate(editRoute + ProductCategoryID)
  }
  function onSubmit(data) {
    mutation.mutate({
      formData: data,
      userID: user.userID,
      ProductCategoryID: ProductCategoryID,
    })
  }

  const typesOptions = [
    { label: `${pageTitles?.product || "Product"}`, value: "Product" },
    { label: "Service", value: "Service" },
  ]

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
              mode={mode}
              saveLoading={mutation.isPending}
              handleGoBack={() => navigate(parentRoute)}
              handleEdit={() => handleEdit()}
              handleCancel={() => {
                handleCancel()
              }}
              handleAddNew={() => {
                handleAddNew()
              }}
              handleDelete={handleDelete}
              handleSave={() => handleSubmit(onSubmit)()}
              GoBackLabel={`${pageTitles?.product || "Product"} Categories`}
              showAddNewButton={userRights[0]?.RoleNew}
              showEditButton={userRights[0]?.RoleEdit}
              showDelete={userRights[0]?.RoleDelete}
            />
          </div>
          <form className="mt-4">
            <Row>
              <Form.Group as={Col}>
                <Form.Label>
                  {pageTitles?.product || "Product"} Category
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
                  {pageTitles?.product || "Product"} Type
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
  )
}
