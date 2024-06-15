import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"

import { FilterMatchMode } from "primereact/api"
import { useEffect, useState, useRef } from "react"
import { CustomSpinner } from "../../components/CustomSpinner"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import ActionButtons from "../../components/ActionButtons"
import { Controller, useForm } from "react-hook-form"
import ButtonToolBar from "../../components/ActionsToolbar"
import {
  FormRow,
  FormColumn,
  FormLabel,
} from "../../components/Layout/LayoutComponents"
import TextInput from "../../components/Forms/TextInput"
import CheckBox from "../../components/Forms/CheckBox"
import { useUserData } from "../../context/AuthContext"
import {
  addNewBusinessUnit,
  deleteBusinessUnitByID,
  fetchAllBusinessUnits,
  fetchBusinessUnitById,
} from "../../api/BusinessUnitData"
import { ROUTE_URLS, QUERY_KEYS, MENU_KEYS } from "../../utils/enums"
import { ColorPicker } from "primereact/colorpicker"
import { classNames } from "primereact/utils"
import useConfirmationModal from "../../hooks/useConfirmationModalHook"
import { encryptID } from "../../utils/crypto"
import {
  SingleFileUploadField,
  TextAreaField,
} from "../../components/Forms/form"
import { FormRightsWrapper } from "../../components/Wrappers/wrappers"
import { DetailPageTilteAndActionsComponent } from "../../components"

let parentRoute = ROUTE_URLS.GENERAL.BUSINESS_UNITS
let editRoute = `${parentRoute}/edit/`
let newRoute = `${parentRoute}/new`
let viewRoute = `${parentRoute}/`
let queryKey = QUERY_KEYS.BUSINESS_UNIT_QUERY_KEY
let IDENTITY = "BusinessUnitID"
let MENU_KEY = MENU_KEYS.GENERAL.BUSINESS_UNIT_FORM_KEY

export default function BusinessUnits() {
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
  document.title = "Business Units"

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { showDeleteDialog, showEditDialog } = useConfirmationModal({
    handleDelete,
    handleEdit,
  })

  const [filters, setFilters] = useState({
    BusinessUnitName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    Address: { value: null, matchMode: FilterMatchMode.CONTAINS },
    LandlineNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
    MobileNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
    Email: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })

  const user = useUserData()

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchAllBusinessUnits(user.userID),
    initialData: [],
  })

  const deleteMutation = useMutation({
    mutationFn: deleteBusinessUnitByID,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      })
    },
  })

  function handleDelete(id) {
    deleteMutation.mutate({
      BusinessUnitID: id,
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
    navigate(viewRoute + encryptID(e?.data?.BusinessUnitID))
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
            title="Business Units"
            onAddNewClick={() => navigate(newRoute)}
            showAddNewButton={userRights[0]?.RoleNew}
            buttonLabel="Add New Business Unit"
          />
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
            className={"thead"}
            tableStyle={{ minWidth: "50rem" }}
            onRowClick={onRowClick}
          >
            <Column
              body={(rowData) =>
                ActionButtons({
                  ID: encryptID(rowData.BusinessUnitID),
                  handleDelete: () =>
                    showDeleteDialog(encryptID(rowData.BusinessUnitID)),
                  handleEdit: () =>
                    showEditDialog(encryptID(rowData.BusinessUnitID)),
                  handleView: handleView,
                  showEditButton: userRights[0]?.RoleEdit,
                  showDeleteButton: userRights[0]?.RoleDelete,
                  viewBtnRoute: viewRoute + encryptID(rowData.BusinessUnitID),
                })
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
              header="Business Unit"
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
        </>
      )}
    </div>
  )
}

function FormComponent({ mode, userRights }) {
  document.title = "Business Unit Entry"

  const queryClient = useQueryClient()
  const fileRef = useRef()
  const secondLogoRef = useRef()

  const navigate = useNavigate()
  const { BusinessUnitID } = useParams()

  const user = useUserData()
  const { control, handleSubmit, setFocus, setValue, reset, register } =
    useForm({
      defaultValues: {
        BusinessUnitName: "",
        Address: "",
        LandlineNo: "",
        MobileNo: "",
        Email: "",
        Website: "",
        AuthorityPersonName: "",
        AuthorityPersonNo: "",
        AuthorityPersonEmail: "",
        NTNno: "",
        STRNo: "",
        Description: "",
        InActive: false,
      },
    })

  const BusinessUnitData = useQuery({
    queryKey: [queryKey, BusinessUnitID],
    queryFn: () => fetchBusinessUnitById(BusinessUnitID, user.userID),
    enabled: BusinessUnitID !== undefined,
    initialData: [],
  })

  useEffect(() => {
    if (+BusinessUnitID !== undefined && BusinessUnitData?.data?.length > 0) {
      try {
        setValue(
          "BusinessUnitName",
          BusinessUnitData?.data[0]?.BusinessUnitName ?? undefined
        )
        setValue("Address", BusinessUnitData?.data[0]?.Address ?? undefined)
        setValue(
          "LandlineNo",
          BusinessUnitData?.data[0]?.LandlineNo ?? undefined
        )
        setValue("MobileNo", BusinessUnitData?.data[0]?.MobileNo ?? undefined)
        setValue("Email", BusinessUnitData?.data[0]?.Email ?? undefined)
        setValue("Website", BusinessUnitData?.data[0]?.Website ?? undefined)
        setValue(
          "AuthorityPersonName",
          BusinessUnitData?.data[0]?.AuthorityPersonName ?? undefined
        )
        setValue(
          "AuthorityPersonNo",
          BusinessUnitData?.data[0]?.AuthorityPersonNo ?? undefined
        )
        setValue(
          "AuthorityPersonEmail",
          BusinessUnitData?.data[0]?.AuthorityPersonEmail ?? undefined
        )
        setValue("NTNno", BusinessUnitData?.data[0]?.NTNno ?? undefined)
        setValue("STRNo", BusinessUnitData?.data[0]?.STRNo ?? undefined)
        setValue(
          "Description",
          BusinessUnitData?.data[0]?.Description ?? undefined
        )
        setValue("InActive", BusinessUnitData?.data[0]?.InActive)

        setValue("PrimaryColor", {
          r: BusinessUnitData?.data[0]?.RedColor ?? 0,
          g: BusinessUnitData?.data[0]?.GreenColor ?? 0,
          b: BusinessUnitData?.data[0]?.BlueColor ?? 0,
        })
        fileRef.current?.setBase64File(
          "data:image/png;base64," + BusinessUnitData?.data[0]?.Logo
        )
        secondLogoRef.current?.setBase64File(
          "data:image/png;base64," + BusinessUnitData?.data[0]?.Logo2
        )
      } catch (error) {}
    }
  }, [BusinessUnitID, BusinessUnitData.data])

  const mutation = useMutation({
    mutationFn: addNewBusinessUnit,
    onSuccess: ({ success, RecordID }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] })
        navigate(`${parentRoute}/${RecordID}`)
      }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteBusinessUnitByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
      navigate(parentRoute)
    },
  })

  function handleDelete() {
    deleteMutation.mutate({
      BusinessUnitID: BusinessUnitID,
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
      navigate(viewRoute + BusinessUnitID)
    }
  }
  function handleEdit() {
    navigate(editRoute + BusinessUnitID)
  }

  function onSubmit(data) {
    const file = fileRef.current?.getFile()
    const secondLogo = secondLogoRef.current?.getFile()

    data.Logo = file
    data.secondLogo = secondLogo
    mutation.mutate({
      formData: data,
      userID: user?.userID,
      BusinessUnitID: BusinessUnitID,
    })
  }

  return (
    <>
      {BusinessUnitData.isLoading ? (
        <>
          <CustomSpinner />
        </>
      ) : (
        <div>
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
              GoBackLabel="Business Units"
              showAddNewButton={userRights[0]?.RoleNew}
              showEditButton={userRights[0]?.RoleEdit}
              showDelete={userRights[0]?.RoleDelete}
            />
          </div>
          <form className="mt-4">
            <FormRow>
              <FormColumn lg={3} xl={3} md={6}>
                <FormLabel>
                  Business Unit Name
                  <span className="text-red-700 fw-bold ">*</span>
                </FormLabel>

                <div>
                  <TextInput
                    control={control}
                    ID={"BusinessUnitName"}
                    required={true}
                    focusOptions={() => setFocus("LandlineNo")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </FormColumn>
              <FormColumn lg={3} xl={3} md={6}>
                <FormLabel>Landline No</FormLabel>

                <div>
                  <TextInput
                    control={control}
                    ID={"LandlineNo"}
                    focusOptions={() => setFocus("MobileNo")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </FormColumn>
              <FormColumn lg={3} xl={3} md={6}>
                <FormLabel>Mobile No</FormLabel>

                <div>
                  <TextInput
                    control={control}
                    ID={"MobileNo"}
                    focusOptions={() => setFocus("Email")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </FormColumn>
              <FormColumn lg={3} xl={3} md={6}>
                <FormLabel>Email</FormLabel>

                <div>
                  <TextInput
                    control={control}
                    ID={"Email"}
                    focusOptions={() => setFocus("Address")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn lg={12} xl={12}>
                <FormLabel>Address</FormLabel>
                <TextAreaField
                  control={control}
                  name={"Address"}
                  autoResize={true}
                  disabled={mode === "view"}
                  focusOptions={() => setFocus("Website")}
                />
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn lg={3} xl={3} md={6}>
                <FormLabel>Website</FormLabel>

                <div>
                  <TextInput
                    control={control}
                    ID={"Website"}
                    focusOptions={() => setFocus("AuthorityPersonName")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </FormColumn>
              <FormColumn lg={3} xl={3} md={6}>
                <FormLabel>Authority Person / CEO Name</FormLabel>

                <div>
                  <TextInput
                    control={control}
                    ID={"AuthorityPersonName"}
                    focusOptions={() => setFocus("AuthorityPersonNo")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </FormColumn>
              <FormColumn lg={3} xl={3} md={6}>
                <FormLabel>CEO Mobile No</FormLabel>

                <div>
                  <TextInput
                    control={control}
                    ID={"AuthorityPersonNo"}
                    focusOptions={() => setFocus("AuthorityPersonEmail")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </FormColumn>
              <FormColumn lg={3} xl={3} md={6}>
                <FormLabel>CEO Email</FormLabel>

                <div>
                  <TextInput
                    control={control}
                    ID={"AuthorityPersonEmail"}
                    focusOptions={() => setFocus("NTNno")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn lg={6} xl={6}>
                <FormLabel>NTN-No</FormLabel>

                <div>
                  <TextInput
                    control={control}
                    ID={"NTNno"}
                    focusOptions={() => setFocus("STRNo")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </FormColumn>
              <FormColumn lg={6} xl={6}>
                <FormLabel>Sales Tax Return No</FormLabel>

                <div>
                  <TextInput
                    control={control}
                    ID={"STRNo"}
                    focusOptions={() => setFocus("Description")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn lg={12} xl={12}>
                <FormLabel>Description</FormLabel>
                <TextAreaField
                  control={control}
                  name={"Description"}
                  autoResize={true}
                  disabled={mode === "view"}
                />
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn lg={6} xl={6}>
                <div className="mt-2">
                  <CheckBox
                    control={control}
                    ID={"InActive"}
                    Label={"InActive"}
                    isEnable={mode !== "view"}
                  />
                </div>
              </FormColumn>
              <FormColumn lg={6} xl={6}>
                <FormLabel labelFor="PrimaryColor">
                  Choose your primary color
                </FormLabel>
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
              </FormColumn>
            </FormRow>

            <FormRow>
              <FormColumn lg={6} xl={6} md={6}>
                <FormLabel>Logo</FormLabel>
                <div>
                  <SingleFileUploadField
                    ref={fileRef}
                    accept="image/*"
                    chooseBtnLabel="Select Image"
                    changeBtnLabel="Change Image"
                    mode={mode}
                    errorMessage="Upload your logo"
                  />
                </div>
              </FormColumn>
              <FormColumn lg={6} xl={6} md={6}>
                <FormLabel>Second Logo</FormLabel>
                <div>
                  <SingleFileUploadField
                    ref={secondLogoRef}
                    accept="image/*"
                    chooseBtnLabel="Select Image"
                    changeBtnLabel="Change Image"
                    mode={mode}
                    errorMessage="Upload your logo"
                  />
                </div>
              </FormColumn>
            </FormRow>
          </form>
        </div>
      )}
    </>
  )
}
