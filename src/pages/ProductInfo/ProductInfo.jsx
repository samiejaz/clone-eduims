import React, { useContext, useRef } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { FilterMatchMode } from "primereact/api"
import { useEffect, useState } from "react"
import { CustomSpinner } from "../../components/CustomSpinner"
import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import ActionButtons from "../../components/ActionButtons"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import ButtonToolBar from "../../components/ActionsToolbar"
import {
  FormRow,
  FormColumn,
  FormLabel,
} from "../../components/Layout/LayoutComponents"
import TextInput from "../../components/Forms/TextInput"
import CheckBox from "../../components/Forms/CheckBox"
import {
  addNewProductInfo,
  deleteProductInfoByID,
  fetchAllProducts,
  fetchProductInfoByID,
} from "../../api/ProductInfoData"
import {
  ROUTE_URLS,
  QUERY_KEYS,
  SELECT_QUERY_KEYS,
  MENU_KEYS,
} from "../../utils/enums"
import CDropdown from "../../components/Forms/CDropdown"
import { useUserData } from "../../context/AuthContext"
import {
  fetchAllBusinessUnitsForSelect,
  fetchAllProductCategoriesForSelect,
} from "../../api/SelectData"
import {
  AppConfigurationContext,
  useAppConfigurataionProvider,
} from "../../context/AppConfigurationContext"
import useConfirmationModal from "../../hooks/useConfirmationModalHook"
import { encryptID } from "../../utils/crypto"
import { FormRightsWrapper } from "../../components/Wrappers/wrappers"
import {
  ShowErrorToast,
  preventFormByEnterKeySubmission,
} from "../../utils/CommonFunctions"
import { confirmDialog } from "primereact/confirmdialog"
import { Dialog } from "primereact/dialog"
import { CommonBusinessUnitCheckBoxDatatable } from "../../components/CommonFormFields"
import { DetailPageTilteAndActionsComponent } from "../../components"
let parentRoute = ROUTE_URLS.UTILITIES.PRODUCT_INFO_ROUTE
let editRoute = `${parentRoute}/edit/`
let newRoute = `${parentRoute}/new`
let viewRoute = `${parentRoute}/`
let queryKey = QUERY_KEYS.PRODUCT_INFO_QUERY_KEY
let IDENTITY = "ProductInfoID"
let MENU_KEY = MENU_KEYS.UTILITIES.PRODUCT_INFO_FORM_KEY

export default function ProductInfo() {
  return (
    <FormRightsWrapper
      FormComponent={FormComponent}
      DetailComponent={DetailComponent}
      menuKey={MENU_KEY}
      identity={IDENTITY}
    />
  )
}

function DetailComponent({ userRights }) {
  const { pageTitles } = useContext(AppConfigurationContext)

  document.title = `${pageTitles?.product + "s" || "Products"}`
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { showDeleteDialog, showEditDialog } = useConfirmationModal({
    handleDelete,
    handleEdit,
  })
  const [filters, setFilters] = useState({
    ProductInfoTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ProductType: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })

  const user = useUserData()

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchAllProducts(user.userID),
    initialData: [],
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProductInfoByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
      navigate(parentRoute)
    },
  })

  function handleDelete(id) {
    deleteMutation.mutate({
      ProductInfoID: id,
      LoginUserID: user.userID,
    })
  }

  function handleEdit(id) {
    navigate(editRoute + id)
  }

  function handleView(id) {
    navigate(parentRoute + "/" + id)
  }

  const onRowClick = (e) => {
    navigate(viewRoute + encryptID(e?.data?.ProductInfoID))
  }
  return (
    <div className="mt-4">
      {isLoading || isFetching ? (
        <>
          <CustomSpinner />
        </>
      ) : (
        <>
          <DetailPageTilteAndActionsComponent
            title={`${pageTitles?.product + "s" || "Products"}`}
            onAddNewClick={() => navigate(newRoute)}
            showAddNewButton={userRights[0]?.RoleNew}
            buttonLabel={`Add New ${pageTitles?.product || "Product"}`}
          />

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
            className={"thead"}
            tableStyle={{ minWidth: "50rem" }}
            onRowClick={onRowClick}
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
                pageTitles?.product?.toLowerCase() ?? "product"
              }`}
              sortable
              header={`${pageTitles?.product || "Product"} Info`}
              style={{ minWidth: "20rem" }}
            ></Column>
            <Column
              field="ProductCategoryTitle"
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
  document.title = `${pageTitles?.product || "Product"} Entry`
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { ProductInfoID } = useParams()
  const businessUnitsRef = useRef()
  const { control, handleSubmit, setFocus, setValue, reset } = useForm({
    defaultValues: {
      ProductInfoTitle: "",
      InActive: false,
    },
  })

  const user = useUserData()

  const ProductInfoData = useQuery({
    queryKey: [queryKey, ProductInfoID],
    queryFn: () => fetchProductInfoByID(ProductInfoID, user.userID),
    initialData: [],
  })

  const { data: ProductCategoriesSelectData } = useQuery({
    queryKey: [SELECT_QUERY_KEYS.PRODUCT_CATEGORIES_SELECT_QUERY_KEY],
    queryFn: fetchAllProductCategoriesForSelect,
    initialData: [],
  })

  useEffect(() => {
    if (ProductInfoID !== undefined && ProductInfoData.data.data?.length > 0) {
      if (ProductInfoData?.data.data[0]?.ProductInfoID !== 0) {
        setValue(
          "ProductCategoryID",
          ProductInfoData?.data.data[0]?.ProductCategoryID
        )
      }
      setValue(
        "ProductInfoTitle",
        ProductInfoData?.data.data[0]?.ProductInfoTitle
      )
      setValue("InActive", ProductInfoData?.data.data[0]?.InActive)
      businessUnitsRef.current?.setBusinessUnits(ProductInfoData.data.Detail)
    }
  }, [ProductInfoID, ProductInfoData.data])

  const mutation = useMutation({
    mutationFn: addNewProductInfo,
    onSuccess: ({ success, RecordID }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] })
        navigate(`${parentRoute}/${RecordID}`)
      }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProductInfoByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
      navigate(parentRoute)
    },
  })

  function handleDelete() {
    deleteMutation.mutate({
      ProductInfoID: ProductInfoID,
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
      navigate(viewRoute + ProductInfoID)
    }
  }
  function handleEdit() {
    navigate(editRoute + ProductInfoID)
  }
  function onSubmit(data) {
    mutation.mutate({
      formData: data,
      userID: user.userID,
      ProductInfoID: ProductInfoID,
      selectedBusinessUnits:
        businessUnitsRef.current?.getSelectedBusinessUnits(),
    })
  }

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
                handleCancel()
              }}
              handleAddNew={() => {
                handleAddNew()
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
            <FormRow>
              <FormColumn lg={6} xl={6} md={6}>
                <FormLabel>
                  {pageTitles?.product || "Product"} Title
                  <span className="text-red-700 fw-bold ">*</span>
                </FormLabel>

                <div>
                  <TextInput
                    control={control}
                    ID={"ProductInfoTitle"}
                    required={true}
                    focusOptions={() => setFocus("ProductType")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </FormColumn>
              <FormColumn lg={6} xl={6} md={6}>
                <FormLabel>
                  {pageTitles?.product || "Product"} Category
                  <span className="text-red-700 fw-bold ">*</span>
                </FormLabel>

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
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn>
                <div className="mt-2">
                  <CheckBox
                    control={control}
                    ID={"InActive"}
                    Label={"InActive"}
                    isEnable={mode !== "view"}
                  />
                </div>
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn>
                <CommonBusinessUnitCheckBoxDatatable
                  ref={businessUnitsRef}
                  isRowSelectable={mode !== "view"}
                />
              </FormColumn>
            </FormRow>
          </form>
        </>
      )}
    </>
  )
}
const ProductInfoFormFields = ({ mode, ProductInfoID }) => {
  const { control, setFocus } = useFormContext()
  const { pageTitles } = useAppConfigurataionProvider()
  const [selectedBusinessUnits, setSelectedBusinessUnits] = useState()

  const { data: BusinessUnitSelectData } = useQuery({
    queryKey: [SELECT_QUERY_KEYS.BUSINESS_UNIT_SELECT_QUERY_KEY],
    queryFn: fetchAllBusinessUnitsForSelect,
    initialData: [],
  })
  const { data: ProductCategoriesSelectData } = useQuery({
    queryKey: [SELECT_QUERY_KEYS.PRODUCT_CATEGORIES_SELECT_QUERY_KEY],
    queryFn: fetchAllProductCategoriesForSelect,
    initialData: [],
  })

  const isRowSelectable = () => {
    return mode !== "view" ? true : false
  }
  return (
    <>
      <form className="mt-4">
        <FormRow>
          <FormColumn lg={6} xl={6} md={12}>
            <FormLabel>
              {pageTitles?.product || "Product"} Title
              <span className="text-red-700 fw-bold ">*</span>
            </FormLabel>

            <div>
              <TextInput
                control={control}
                ID={"ProductInfoTitle"}
                required={true}
                focusOptions={() => setFocus("ProductType")}
                isEnable={mode !== "view"}
              />
            </div>
          </FormColumn>
          <FormColumn lg={6} xl={6} md={12}>
            <FormLabel>
              {pageTitles?.product || "Product"} Category
              <span className="text-red-700 fw-bold ">*</span>
            </FormLabel>

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
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn lg={3} xl={3} md={6}>
            <div className="mt-2">
              <CheckBox
                control={control}
                ID={"InActive"}
                Label={"InActive"}
                isEnable={mode !== "view"}
              />
            </div>
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn>
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
              <Column field="BusinessUnitName" header="Business Unit"></Column>
            </DataTable>
          </FormColumn>
        </FormRow>
      </form>
    </>
  )
}

const ProductInfoDetailTable = (props) => {
  const queryClient = useQueryClient()
  const [visible, setVisible] = useState(false)
  const { isEnable, pageTitles, changePoductInfoID } = props
  const [filters, setFilters] = useState({
    ProductTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })
  const method = useForm()
  const user = useUserData()

  const { data: Products } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchAllProducts(user.userID),
    initialData: [],
  })

  const mutation = useMutation({
    mutationFn: addNewProductInfo,
    onError: () => {
      ShowErrorToast("Error while saving data!")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProductInfoByID,
    onSuccess: (response) => {
      if (response === true) {
        queryClient.invalidateQueries({
          queryKey: [queryKey],
        })
      }
    },
  })

  function onSubmit(data) {
    mutation.mutate(data)
  }

  function handleDelete(ProductID) {
    deleteMutation.mutate({
      ProductID: ProductID,
      LoginUserID: user.userID,
    })
  }

  const confirmDelete = (id) => {
    confirmDialog({
      message: "Are you sure you want to delete this record?",
      header: "Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      position: "top",
      accept: () => handleDelete(id),
      reject: () => {},
    })
  }

  return (
    <>
      <DataTable
        className="mt-2"
        showGridlines
        value={Products || []}
        dataKey="ProductID"
        removableSort
        emptyMessage={`No ${
          pageTitles?.product?.toLowerCase() ?? "products"
        } found!`}
        filters={filters}
        filterDisplay="row"
        resizableColumns
        size="small"
        selectionMode="single"
        tableStyle={{ minWidth: "50rem", height: "" }}
      >
        <Column
          body={(rowData) => (
            <>
              <div className="flex align-items-center gap-2">
                <Button
                  icon="pi pi-eye"
                  severity="secondary"
                  size="small"
                  className="rounded"
                  style={{
                    padding: "0.3rem .7rem",
                    fontSize: ".8em",
                    width: "30px",
                  }}
                  disabled={!isEnable}
                  type="button"
                  onClick={() => {
                    changePoductInfoID(rowData?.ProductInfoID)
                  }}
                />
                <Button
                  icon="pi pi-pencil"
                  severity="success"
                  size="small"
                  className="rounded"
                  style={{
                    padding: "0.3rem .7rem",
                    fontSize: ".8em",
                    width: "30px",
                  }}
                  disabled={!isEnable}
                  type="button"
                  onClick={() => {
                    setVisible(true)
                    method.setValue("ProductTitle", rowData?.ProductTitle)
                    method.setValue("ProductID", rowData?.ProductID)
                  }}
                />
                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  size="small"
                  className="rounded"
                  style={{
                    padding: "0.3rem .7rem",
                    fontSize: ".8em",
                    width: "30px",
                  }}
                  onClick={() => {
                    confirmDelete(rowData?.ProductID)
                  }}
                />
              </div>
            </>
          )}
          header="Actions"
          resizeable={false}
          style={{
            minWidth: "7rem",
            maxWidth: "7rem",
            width: "7rem",
            textAlign: "center",
          }}
        ></Column>
        <Column
          field="ProductInfoTitle"
          filter
          filterPlaceholder={`Search by ${
            pageTitles?.product?.toLowerCase() ?? "product"
          }`}
          sortable
          header={`${pageTitles?.product || "Product"} Info`}
          style={{ minWidth: "20rem" }}
        ></Column>
        <Column
          field="ProductCategoryTitle"
          filter
          filterPlaceholder={`Search by ${
            pageTitles?.product?.toLowerCase() ?? "product"
          } type`}
          sortable
          header={`${pageTitles?.product || "Product"} Type`}
          style={{ minWidth: "20rem" }}
        ></Column>
      </DataTable>

      <form onKeyDown={preventFormByEnterKeySubmission}>
        <div className="card flex justify-content-center">
          <Dialog
            header={`Edit ${pageTitles?.product || "Product"}`}
            visible={visible}
            onHide={() => {
              setVisible(false)
            }}
            style={{ width: "70vw", height: "80vh" }}
            footer={
              <Button
                severity="success"
                className="rounded"
                type="button"
                label={mutation.isPending ? "Updating..." : "Update"}
                loading={mutation.isPending}
                loadingIcon="pi pi-spin pi-spinner"
                onClick={() => {
                  method.handleSubmit(onSubmit)()
                }}
              />
            }
          >
            <input
              type="text"
              {...method.register("ProductID", {
                valueAsNumber: true,
              })}
              className="visually-hidden "
              style={{ display: "none" }}
            />
            <FormProvider {...method}>
              <ProductInfoFormFields mode={"view"} />
            </FormProvider>
          </Dialog>
        </div>
      </form>
    </>
  )
}

const ProductInfoModalContent = () => {
  const { pageTitles } = useAppConfigurataionProvider()
  const user = useUserData()

  const [ProductInfoID, setProductInfoID] = useState(null)
  const ProductInfoData = useQuery({
    queryKey: [queryKey, ProductInfoID],
    queryFn: () => fetchProductInfoByID(ProductInfoID, user.userID),
    initialData: [],
  })

  function changePoductInfoID(id) {
    setProductInfoID(id)
  }

  return (
    <>
      <ProductInfoFormFields mode={"new"} ProductInfoID={ProductInfoID} />
      <ProductInfoDetailTable
        isEnable={true}
        pageTitles={pageTitles}
        changePoductInfoID={changePoductInfoID}
      />
    </>
  )
}
const useProductInfoDialog = () => {
  const [visible, setVisible] = useState(false)

  return {
    setVisible,
    render: (
      <Dialog
        visible={visible}
        onHide={() => setVisible(false)}
        maximizable
        header={"Add new Product"}
        style={{ width: "80vw", height: "90vh" }}
        pt={{
          header: {
            style: {
              paddingBottom: 0,
            },
          },
        }}
      >
        <ProductInfoModalContent />
      </Dialog>
    ),
  }
}

export const ProductInfoDialog = () => {
  const { setVisible, render } = useProductInfoDialog()

  return (
    <>
      <Button
        tooltip="Add new product"
        icon="pi pi-plus"
        severity="secondary"
        size="small"
        className="rounded-2"
        type="button"
        onClick={() => setVisible(true)}
        style={{
          padding: "1px 0px",
          fontSize: "small",
          width: "30px",
          marginLeft: "10px",
        }}
      />
      <div>{render}</div>
    </>
  )
}
