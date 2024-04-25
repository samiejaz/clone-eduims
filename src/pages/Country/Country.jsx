import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { FilterMatchMode } from "primereact/api";
import { useContext, useEffect, useState } from "react";
import { CustomSpinner } from "../../components/CustomSpinner";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ActionButtons from "../../components/ActionButtons";
import { useForm } from "react-hook-form";
import ButtonToolBar from "../../components/ActionsToolbar";
import TextInput from "../../components/Forms/TextInput";
import CheckBox from "../../components/Forms/CheckBox";
import { AuthContext, useUserData } from "../../context/AuthContext";
import {
  addNewCountry,
  deleteCountryByID,
  fetchAllCountries,
  fetchCountryById,
} from "../../api/CountryData";
import { MENU_KEYS, QUERY_KEYS, ROUTE_URLS } from "../../utils/enums";
import {
  FormRow,
  FormColumn,
  FormLabel,
} from "../../components/Layout/LayoutComponents";
import useConfirmationModal from "../../hooks/useConfirmationModalHook";
import AccessDeniedPage from "../../components/AccessDeniedPage";
import { UserRightsContext } from "../../context/UserRightContext";
import { encryptID } from "../../utils/crypto";

let parentRoute = ROUTE_URLS.COUNTRY_ROUTE;
let editRoute = `${parentRoute}/edit/`;
let newRoute = `${parentRoute}/new`;
let viewRoute = `${parentRoute}/`;
let queryKey = QUERY_KEYS.COUNTRIES_QUERY_KEY;
let IDENTITY = "CountryID";

export default function BanckAccountOpening() {
  const { checkForUserRights } = useContext(UserRightsContext);
  const [userRights, setUserRights] = useState([]);

  useEffect(() => {
    const rights = checkForUserRights({
      MenuKey: MENU_KEYS.GENERAL.COUNTRY_FORM_KEY,
      MenuGroupKey: MENU_KEYS.GENERAL.GROUP_KEY,
    });
    setUserRights([rights]);
  }, []);

  return (
    <Routes>
      {userRights && userRights[0]?.ShowForm ? (
        <>
          <Route index element={<CountryDetail userRights={userRights} />} />
          <Route
            path={`:${IDENTITY}`}
            element={
              <CountryForm
                key={"CountryViewRoute"}
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
                    <CountryForm
                      key={"CountryEditRoute"}
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
                      <CountryForm
                        key={"BankAccountNewRoute"}
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

function CountryDetail({ userRights }) {
  document.title = "Countries";
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { showDeleteDialog, showEditDialog } = useConfirmationModal({
    handleDelete,
    handleEdit,
  });

  const [filters, setFilters] = useState({
    CountryTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const user = useUserData();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchAllCountries(user.userID),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCountryByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });

  function handleDelete(id) {
    deleteMutation.mutate({ CountryID: id, LoginUserID: user.userID });
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
            <h2 className="text-center my-auto">Countries</h2>
            <div className="text-end my-auto" style={{ marginLeft: "10px" }}>
              {userRights[0]?.RoleNew && (
                <>
                  <Button
                    label="Add New Country"
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
            dataKey="CountryID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage="No countries found!"
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
                  ID: encryptID(rowData.CountryID),
                  handleDelete: () =>
                    showDeleteDialog(encryptID(rowData.CountryID)),
                  handleEdit: () =>
                    showEditDialog(encryptID(rowData.CountryID)),
                  handleView: handleView,
                  showEditButton: userRights[0]?.RoleEdit,
                  showDeleteButton: userRights[0]?.RoleDelete,
                  viewBtnRoute: viewRoute + encryptID(rowData.CountryID),
                })
              }
              header="Actions"
              resizeable={false}
              style={{ minWidth: "7rem", maxWidth: "10rem", width: "7rem" }}
            ></Column>
            <Column
              field="CountryTitle"
              filter
              filterPlaceholder="Search by country"
              sortable
              header="Country"
            ></Column>
          </DataTable>
        </>
      )}
    </div>
  );
}
function CountryForm({ mode, userRights }) {
  document.title = "Country Entry";

  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const { CountryID } = useParams();
  const { control, handleSubmit, setFocus, setValue, reset } = useForm({
    defaultValues: {
      CountryTitle: "",
      InActive: false,
    },
  });

  const { user } = useContext(AuthContext);

  const CountryData = useQuery({
    queryKey: [queryKey, CountryID],
    queryFn: () => fetchCountryById(CountryID, user?.userID),
    initialData: [],
  });

  useEffect(() => {
    if (CountryID !== undefined && CountryData?.data.length > 0) {
      setValue("CountryTitle", CountryData.data[0].CountryTitle);
      setValue("InActive", CountryData.data[0].InActive);
    }
  }, [CountryID, CountryData]);

  const mutation = useMutation({
    mutationFn: addNewCountry,
    onSuccess: async ({ success, RecordID }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        navigate(`${parentRoute}/${RecordID}`);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCountryByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      navigate(parentRoute);
    },
  });

  function handleDelete() {
    deleteMutation.mutate({ CountryID: CountryID, LoginUserID: user.userID });
  }

  function handleAddNew() {
    reset();
    navigate(newRoute);
  }
  function handleCancel() {
    if (mode === "new") {
      navigate(parentRoute);
    } else if (mode === "edit") {
      navigate(viewRoute + CountryID);
    }
  }
  function handleEdit() {
    navigate(editRoute + CountryID);
  }
  function onSubmit(data) {
    mutation.mutate({
      formData: data,
      userID: user.userID,
      CountryID: CountryID,
    });
  }

  return (
    <>
      {CountryData.isLoading ? (
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
              GoBackLabel="Countries"
              showAddNewButton={userRights[0]?.RoleNew}
              showEditButton={userRights[0]?.RoleEdit}
              showDelete={userRights[0]?.RoleDelete}
            />
          </div>
          <form className="mt-4">
            <FormRow>
              <FormColumn lg={6} xl={6} md={6}>
                <FormLabel labelFor={"CountryTitle"}>
                  Country
                  <span className="text-danger fw-bold ">*</span>
                </FormLabel>

                <div>
                  <TextInput
                    control={control}
                    ID={"CountryTitle"}
                    required={true}
                    focusOptions={() => setFocus("InActive")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </FormColumn>
              <FormColumn lg={3} xl={3} md={6}>
                <label htmlFor="InActive"></label>
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
