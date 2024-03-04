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
import ButtonToolBar from "../CustomerInvoice/CustomerInvoiceToolbar";
import TextInput from "../../components/Forms/TextInput";
import CheckBox from "../../components/Forms/CheckBox";
import { useUserData } from "../../context/AuthContext";
import {
  addNewBusinessSegment,
  deleteBusinessSegmentByID,
  fetchAllBusinessSegments,
  fetchBusinessSegmentById,
} from "../../api/BusinessSegmentData";
import { MENU_KEYS, QUERY_KEYS, ROUTE_URLS } from "../../utils/enums";
import {
  FormRow,
  FormColumn,
  FormLabel,
} from "../../components/Layout/LayoutComponents";
import useConfirmationModal from "../../hooks/useConfirmationModalHook";
import AccessDeniedPage from "../../components/AccessDeniedPage";
import { checkForUserRights } from "../../utils/routes";

let parentRoute = ROUTE_URLS.BUSINESS_SEGMENT_ROUTE;
let editRoute = `${parentRoute}/edit/`;
let newRoute = `${parentRoute}/new`;
let viewRoute = `${parentRoute}/`;
let queryKey = QUERY_KEYS.BUSINESS_SEGMENT_QUERY_KEY;
let IDENTITY = "BusinessSegmentID";

export default function BusinessSegmentOpening() {
  const [userRights, setUserRights] = useState([]);

  useEffect(() => {
    const rights = checkForUserRights({
      MenuName: MENU_KEYS.GENERAL.BUSINESS_SEGMENT_FORM_KEY,
    });
    setUserRights(rights);
  }, []);

  return (
    <Routes>
      {userRights && userRights[0]?.ShowForm ? (
        <>
          <Route
            index
            element={<BusinessSegmentDetail userRights={userRights} />}
          />
          <Route
            path={`:${IDENTITY}`}
            element={
              <BusinessSegmentForm
                key={"BusinessSegmentViewRoute"}
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
                    <BusinessSegmentForm
                      key={"BusinessSegmentEditRoute"}
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
                      <BusinessSegmentForm
                        key={"BusinessSegmentNewRoute"}
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

export function BusinessSegmentDetail({ userRights }) {
  document.title = "Business Segments";
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { showDeleteDialog, showEditDialog } = useConfirmationModal({
    handleDelete,
    handleEdit,
  });

  const [filters, setFilters] = useState({
    BusinessSegmentTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const user = useUserData();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchAllBusinessSegments(user.userID),

    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBusinessSegmentByID,
    onSuccess: (success) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        navigate(parentRoute);
      }
    },
  });

  function handleDelete(id) {
    deleteMutation.mutate({
      BusinessSegmentID: id,
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
            <h2 className="text-center my-auto">Business Segments</h2>
            <div className="text-end my-auto" style={{ marginLeft: "10px" }}>
              {userRights[0]?.RoleNew && (
                <>
                  <Button
                    label="Add New Business Segment"
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
            dataKey="BusinessSegmentID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage="No business segments found!"
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
                  rowData.BusinessSegmentID,
                  () => showDeleteDialog(rowData.BusinessSegmentID),
                  () => showEditDialog(rowData.BusinessSegmentID),
                  handleView,
                  userRights[0]?.RoleEdit,
                  userRights[0]?.RoleDelete
                )
              }
              header="Actions"
              resizeable={false}
              style={{ minWidth: "7rem", maxWidth: "10rem", width: "7rem" }}
            ></Column>
            <Column
              field="BusinessSegmentTitle"
              filter
              filterPlaceholder="Search by Business Segment"
              sortable
              header="Business Segment"
            ></Column>
          </DataTable>
        </>
      )}
    </div>
  );
}
export function BusinessSegmentForm({ mode, userRights }) {
  document.title = "Business Segment Entry";
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { BusinessSegmentID } = useParams();
  const { control, handleSubmit, setFocus, setValue, reset } = useForm({
    defaultValues: {
      BusinessSegmentTitle: "",
      InActive: false,
    },
  });

  const user = useUserData();

  const BusinessSegmentData = useQuery({
    queryKey: [queryKey, BusinessSegmentID],
    queryFn: () => fetchBusinessSegmentById(BusinessSegmentID, user.userID),
    enabled: BusinessSegmentID !== undefined,
    initialData: [],
  });

  useEffect(() => {
    if (
      BusinessSegmentID !== undefined &&
      BusinessSegmentData.data.length > 0
    ) {
      setValue(
        "BusinessSegmentTitle",
        BusinessSegmentData.data[0].BusinessSegmentTitle
      );
      setValue("InActive", BusinessSegmentData.data[0].InActive);
    }
  }, [BusinessSegmentID, BusinessSegmentData]);

  const mutation = useMutation({
    mutationFn: addNewBusinessSegment,
    onSuccess: ({ success, RecordID }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        navigate(`${parentRoute}/${RecordID}`);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBusinessSegmentByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      navigate(parentRoute);
    },
  });

  function handleDelete() {
    deleteMutation.mutate({
      BusinessSegmentID: BusinessSegmentID,
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
      navigate(viewRoute + BusinessSegmentID);
    }
  }
  function handleEdit() {
    navigate(editRoute + BusinessSegmentID);
  }
  function onSubmit(data) {
    mutation.mutate({
      formData: data,
      userID: user.userID,
      BusinessSegmentID: BusinessSegmentID,
    });
  }

  return (
    <>
      {BusinessSegmentData.isLoading ? (
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
              GoBackLabel="Business Segments"
              showAddNewButton={userRights[0]?.RoleNew}
              showEditButton={userRights[0]?.RoleEdit}
              showDelete={userRights[0]?.RoleDelete}
            />
          </div>
          <form className="mt-4">
            <FormRow>
              <FormColumn lg={6} xl={6} md={6}>
                <FormLabel>
                  Business Segment
                  <span className="text-danger fw-bold ">*</span>
                </FormLabel>

                <div>
                  <TextInput
                    control={control}
                    ID={"BusinessSegmentTitle"}
                    required={true}
                    focusOptions={() => setFocus("InActive")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </FormColumn>
              <FormColumn lg={6} xl={6} md={6}>
                <FormLabel></FormLabel>
                <div className="mt-1">
                  <CheckBox
                    control={control}
                    ID={"InActive"}
                    Label={"InActive"}
                    isEnable={mode !== "view"}
                  />
                </div>
              </FormColumn>
            </FormRow>
          </form>
        </>
      )}
    </>
  );
}
