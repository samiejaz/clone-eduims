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
import { useUserData } from "../../context/AuthContext";
import {
  addNewBankAccount,
  deleteBankAccountByID,
  fetchAllBankAccounts,
  fetchBankAccountById,
} from "../../api/BankAccountData";
import { ROUTE_URLS, QUERY_KEYS } from "../../utils/enums";
import { fetchAllBusinessUnitsForSelect } from "../../api/SelectData";
import CDropdown from "../../components/Forms/CDropdown";

let parentRoute = ROUTE_URLS.ACCOUNTS.BANK_ACCOUNT_OPENING;
let editRoute = `${parentRoute}/edit/`;
let newRoute = `${parentRoute}/new`;
let viewRoute = `${parentRoute}/`;
let detail = "#22C55E";
let queryKey = QUERY_KEYS.BANK_ACCOUNTS_QUERY_KEY;

export function BankAccountDetail() {
  document.title = "Bank Accounts";
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
            <h2 className="text-center my-auto">Bank Accounts</h2>
            <div className="text-end my-auto" style={{ marginLeft: "10px" }}>
              <Button
                label="Add New Bank Account"
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
                  () => handleDeleteShow(rowData.BankAccountID),
                  handleEditShow,
                  handleView
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
          {EditModal}
          {DeleteModal}
        </>
      )}
    </div>
  );
}
export function BankAccountForm({ pagesTitle, mode }) {
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
            />
          </div>
          <form className="mt-4">
            <Row>
              <Form.Group as={Col}>
                <Form.Label>
                  Bank Name
                  <span className="text-danger fw-bold ">*</span>
                </Form.Label>

                <div>
                  <TextInput
                    control={control}
                    ID={"BankTitle"}
                    required={true}
                    focusOptions={() => setFocus("BankAccountTitle")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>
                  Bank Account Title
                  <span className="text-danger fw-bold ">*</span>
                </Form.Label>

                <div>
                  <TextInput
                    control={control}
                    ID={"BankAccountTitle"}
                    required={true}
                    focusOptions={() => setFocus("BusinessUnitID")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Branch Name</Form.Label>

                <div>
                  <TextInput
                    control={control}
                    ID={"BranchName"}
                    focusOptions={() => setFocus("BranchCode")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col}>
                <Form.Label>Branch Code</Form.Label>

                <div>
                  <TextInput
                    control={control}
                    ID={"BranchCode"}
                    focusOptions={() => setFocus("AccountNo")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Account No</Form.Label>

                <div>
                  <TextInput
                    control={control}
                    ID={"AccountNo"}
                    focusOptions={() => setFocus("IbanNo")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>IBAN No</Form.Label>

                <div>
                  <TextInput
                    control={control}
                    ID={"IbanNo"}
                    focusOptions={() => setFocus("InActive")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} controlId="InActive">
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
