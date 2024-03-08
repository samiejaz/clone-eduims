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
import ButtonToolBar from "../CustomerInvoice/CustomerInvoiceToolbar";
import TextInput from "../../components/Forms/TextInput";
import CheckBox from "../../components/Forms/CheckBox";
import { useUserData } from "../../context/AuthContext";
import {
  addNewBankAccount,
  deleteBankAccountByID,
  fetchAllBankAccounts,
  fetchBankAccountById,
} from "../../api/BankAccountData";
import { ROUTE_URLS, QUERY_KEYS, MENU_KEYS } from "../../utils/enums";
import {
  FormRow,
  FormColumn,
  FormLabel,
} from "../../components/Layout/LayoutComponents";
import useConfirmationModal from "../../hooks/useConfirmationModalHook";
import AccessDeniedPage from "../../components/AccessDeniedPage";
import { UserRightsContext } from "../../context/UserRightContext";
let parentRoute = ROUTE_URLS.ACCOUNTS.BANK_ACCOUNT_OPENING;
let editRoute = `${parentRoute}/edit/`;
let newRoute = `${parentRoute}/new`;
let viewRoute = `${parentRoute}/`;
let queryKey = QUERY_KEYS.BANK_ACCOUNTS_QUERY_KEY;
let IDENTITY = "BankAccountID";

export default function BanckAccountOpening() {
  const { checkForUserRights } = useContext(UserRightsContext);
  const [userRights, setUserRights] = useState([]);

  useEffect(() => {
    const rights = checkForUserRights({
      MenuKey: MENU_KEYS.ACCOUNTS.BANK_ACCOUNTS_FORM_KEY,
      MenuGroupKey: MENU_KEYS.ACCOUNTS.GROUP_KEY,
    });
    setUserRights([rights]);
  }, []);

  return (
    <Routes>
      {userRights && userRights[0]?.ShowForm ? (
        <>
          <Route
            index
            element={<BankAccountDetail userRights={userRights} />}
          />
          <Route
            path={`:${IDENTITY}`}
            element={
              <BankAccountForm
                key={"BankAccountViewRoute"}
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
                    <BankAccountForm
                      key={"BankAccountEditRoute"}
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
                      <BankAccountForm
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

function BankAccountDetail({ userRights }) {
  document.title = "Bank Accounts";
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { showDeleteDialog, showEditDialog } = useConfirmationModal({
    handleDelete,
    handleEdit,
  });

  const [filters, setFilters] = useState({
    BankAccountTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
    AccountNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
    IbanNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const user = useUserData();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchAllBankAccounts(user.userID),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBankAccountByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      navigate(parentRoute);
    },
  });

  function handleDelete(id) {
    deleteMutation.mutate({
      BankAccountID: id,
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
            <h2 className="text-center my-auto">Bank Accounts</h2>
            <div className="text-end my-auto" style={{ marginLeft: "10px" }}>
              {userRights[0]?.RoleNew && (
                <>
                  <Button
                    label="Add New Bank Account"
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
            dataKey="BankAccountID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage="No Bank Accounts found!"
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
                  rowData.BankAccountID,
                  () => showDeleteDialog(rowData.BankAccountID),
                  () => showEditDialog(rowData.BankAccountID),
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
              field="BankAccountTitle"
              filter
              filterPlaceholder="Search by BankAccount"
              sortable
              header="BankAccount"
              style={{ minWidth: "20rem" }}
            ></Column>
            <Column
              field="AccountNo"
              filter
              filterPlaceholder="Search by Account No"
              sortable
              header="Account No"
              style={{ minWidth: "20rem" }}
            ></Column>
            <Column
              field="IbanNo"
              filter
              filterPlaceholder="Search by IBAN No"
              sortable
              header="IBAN No"
              style={{ minWidth: "20rem" }}
            ></Column>
          </DataTable>
        </>
      )}
    </div>
  );
}
function BankAccountForm({ mode, userRights }) {
  document.title = "Bank Account Entry";
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const user = useUserData();
  const { BankAccountID } = useParams();
  const { control, handleSubmit, setFocus, setValue, reset } = useForm({
    defaultValues: {
      BankAccountTitle: "",
      BankTitle: "",
      BusinessUnit: null,
      BranchName: "",
      BranchCode: "",
      AccountNo: "",
      IbanNo: "",
      InActive: false,
    },
  });

  const BankAccountData = useQuery({
    queryKey: [queryKey, +BankAccountID],
    queryFn: () => fetchBankAccountById(BankAccountID, user.userID),
    enabled: mode !== "new",
    initialData: [],
  });

  useEffect(() => {
    if (BankAccountID !== undefined && BankAccountData.data.length > 0) {
      setValue("BankAccountTitle", BankAccountData?.data[0]?.BankAccountTitle);
      setValue("BranchName", BankAccountData?.data[0]?.BranchName);
      setValue("BranchCode", BankAccountData?.data[0]?.BranchCode);
      setValue("AccountNo", BankAccountData?.data[0]?.AccountNo);
      setValue("IbanNo", BankAccountData?.data[0]?.IbanNo);
      setValue("BankTitle", BankAccountData?.data[0]?.BankTitle);
      setValue("InActive", BankAccountData?.data[0]?.InActive);
    }
  }, [BankAccountID, BankAccountData.data]);

  const mutation = useMutation({
    mutationFn: addNewBankAccount,
    onSuccess: ({ success, RecordID }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        navigate(`${parentRoute}/${RecordID}`);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBankAccountByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      navigate(parentRoute);
    },
  });

  function handleDelete() {
    deleteMutation.mutate({
      BankAccountID: BankAccountID,
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
      navigate(viewRoute + BankAccountID);
    }
  }
  function handleEdit() {
    navigate(editRoute + BankAccountID);
  }
  function onSubmit(data) {
    mutation.mutate({
      formData: data,
      userID: user.userID,
      BankAccountID: BankAccountID,
    });
  }

  return (
    <>
      {BankAccountData.isLoading ? (
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
              GoBackLabel="Bank Accounts"
              showAddNewButton={userRights[0]?.RoleNew}
              showEditButton={userRights[0]?.RoleEdit}
              showDelete={userRights[0]?.RoleDelete}
            />
          </div>
          <form className="mt-4">
            <FormRow>
              <FormColumn lg={4} xl={4} md={12}>
                <FormLabel>
                  Bank Name
                  <span className="text-danger fw-bold ">*</span>
                </FormLabel>

                <div>
                  <TextInput
                    control={control}
                    ID={"BankTitle"}
                    required={true}
                    focusOptions={() => setFocus("BankAccountTitle")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </FormColumn>
              <FormColumn lg={4} xl={4} md={12}>
                <FormLabel>
                  Bank Account Title
                  <span className="text-danger fw-bold ">*</span>
                </FormLabel>

                <div>
                  <TextInput
                    control={control}
                    ID={"BankAccountTitle"}
                    required={true}
                    focusOptions={() => setFocus("BusinessUnitID")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </FormColumn>
              <FormColumn lg={4} xl={4} md={12}>
                <FormLabel>Branch Name</FormLabel>

                <div>
                  <TextInput
                    control={control}
                    ID={"BranchName"}
                    focusOptions={() => setFocus("BranchCode")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn lg={4} xl={4} md={12}>
                <FormLabel>Branch Code</FormLabel>

                <div>
                  <TextInput
                    control={control}
                    ID={"BranchCode"}
                    focusOptions={() => setFocus("AccountNo")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </FormColumn>
              <FormColumn lg={4} xl={4} md={12}>
                <FormLabel>Account No</FormLabel>

                <div>
                  <TextInput
                    control={control}
                    ID={"AccountNo"}
                    focusOptions={() => setFocus("IbanNo")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </FormColumn>
              <FormColumn lg={4} xl={4} md={12}>
                <FormLabel>IBAN No</FormLabel>

                <div>
                  <TextInput
                    control={control}
                    ID={"IbanNo"}
                    focusOptions={() => setFocus("InActive")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn lg={6} xl={6} md={6}>
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
          </form>
        </>
      )}
    </>
  );
}
