import { createContext, useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { preventFormByEnterKeySubmission } from "../../utils/CommonFunctions";
import { Form, Row, Col, ButtonGroup } from "react-bootstrap";
import { Button } from "primereact/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";
import { fetchCustomerBranchesByCustomerID } from "./CustomerEntryAPI";
import {
  fetchAllCustomerAccountsForSelect,
  fetchAllCustomersBranch,
} from "../../api/SelectData";
import { AuthContext } from "../../context/AuthContext";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { CustomerAccountEntryModal } from "../Modals/CustomerAccountEntryModal";
import { AppConfigurationContext } from "../../context/AppConfigurationContext";
import { deleteCustomerBranchByID } from "../../api/CustomerBranchData";
import useDeleteModal from "../../hooks/useDeleteModalHook";
import { CustomSpinner } from "../CustomSpinner";
import { CDropDownField, CMultiSelectField } from "../Forms/form";
import { AllCustomersBranchEntryModal } from "../Modals/AllCustomersBranchEntryModal";

const BranchEntryContext = createContext();

const apiUrl = import.meta.env.VITE_APP_API_URL;

const BranchEntryProiver = ({ children }) => {
  const [createdBranchID, setCreatedBranchID] = useState(0);
  return (
    <BranchEntryContext.Provider
      value={{ createdBranchID, setCreatedBranchID }}
    >
      {children}
    </BranchEntryContext.Provider>
  );
};

function CustomerBranchEntry(props) {
  const { CustomerID, isEnable = true } = props;
  const { pageTitles } = useContext(AppConfigurationContext);
  return (
    <>
      <BranchEntryProiver>
        <CustomerBranchEntryHeader
          CustomerID={CustomerID}
          pageTitles={pageTitles}
          isEnable={isEnable}
        />
        <CustomerBranchesDataTable
          CustomerID={CustomerID}
          pageTitles={pageTitles}
          isEnable={isEnable}
        />
      </BranchEntryProiver>
    </>
  );
}

export default CustomerBranchEntry;

function CustomerBranchEntryHeader(props) {
  const { CustomerID, pageTitles, isEnable } = props;
  const queryClient = useQueryClient();
  const { user } = useContext(AuthContext);
  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      CustomerBranch: [],
      BranchAddress: "",
      ContactPersonName: "",
      ContactPersonNo: "",
      ContactPersonEmail: "",
      Description: "",
      InActive: false,
      CreateNewAccount: false,
      CustomerAccounts: [],
    },
  });

  const { data: CustomersBranch } = useQuery({
    queryKey: ["customersBranch"],
    queryFn: () => fetchAllCustomersBranch(),
    initialData: [],
  });
  const { data: CustomerAccounts } = useQuery({
    queryKey: ["customerAccounts", CustomerID],
    queryFn: () => fetchAllCustomerAccountsForSelect(CustomerID),
    enabled: CustomerID !== 0,
    initialData: [],
  });

  const customerBranchMutation = useMutation({
    mutationFn: async (formData) => {
      let AccountIDs = [];
      if (formData?.CustomerAccounts?.length > 0) {
        AccountIDs = formData?.CustomerAccounts?.map((b, i) => {
          return {
            RowID: i + 1,
            AccountID: b.AccountID,
            CreateNewAccount: 0,
          };
        });
      } else {
        AccountIDs = [
          {
            RowID: 1,
            AccountID: 0,
            CreateNewAccount: 1,
          },
        ];
      }
      formData.CustomerAccounts = AccountIDs;
      let DataToSend = {
        CustomerBranchID: 0,
        CustomerID: CustomerID,
        BranchID: formData?.CustomerBranch?.BranchID,
        BranchAddress: formData?.BranchAddress,
        ContactPersonName: formData?.ContactPersonName,
        ContactPersonNo: formData?.ContactPersonNo,
        ContactPersonEmail: formData?.ContactPersonEmail,
        Description: formData?.Description,
        InActive: formData?.InActive ? 1 : 0,
        AccountIDs: JSON.stringify(formData?.CustomerAccounts),
        EntryUserID: user.userID,
      };

      const { data } = await axios.post(
        apiUrl + "/EduIMS/CustomerBranchInsertUpdate",
        DataToSend
      );

      if (data.success === true) {
        reset();
        toast.success(
          `${pageTitles?.branch || "Customer Branch"} saved successfully!`
        );
        queryClient.invalidateQueries({ queryKey: ["customerBranchesDetail"] });
        queryClient.invalidateQueries({
          queryKey: ["customerAccounts", CustomerID],
        });
      } else {
        toast.error(data.message, {
          autoClose: 1500,
        });
      }
    },
    onError: () => {
      toast.error("Error while saving data!");
    },
  });

  function onSubmit(data) {
    if (CustomerID === 0) {
      toast.error("No Customer Found!!");
    } else {
      customerBranchMutation.mutate(data);
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={preventFormByEnterKeySubmission}
      >
        <Row>
          <Form.Group as={Col} controlId="CustomerBranch">
            <Form.Label>
              {pageTitles?.branch || "Customer Branch"} Title
            </Form.Label>
            <span className="text-danger fw-bold ">*</span>
            <AllCustomersBranchEntryModal
              CustomerID={CustomerID}
              pageTitles={pageTitles}
            />
            <CDropDownField
              control={control}
              name="CustomerBranch"
              disabled={!isEnable}
              options={CustomersBranch}
              optionLabel="BranchTitle"
              optionValue="BranchID"
            />
            <p className="text-danger">
              {errors?.CustomerBusinessName?.message}
            </p>
          </Form.Group>
          <Form.Group as={Col} controlId="CustomerAccounts">
            <Form.Label>Customer Ledgers</Form.Label>
            <span className="text-danger fw-bold ">*</span>
            <CustomerAccountEntryModal CustomerID={CustomerID} />
            <CMultiSelectField
              control={control}
              name="CustomerAccounts"
              disabled={!isEnable}
              options={CustomerAccounts}
              optionLabel="AccountTitle"
              optionValue="AccountID"
            />
          </Form.Group>
          <Form.Group as={Col} controlId="CreateNewAccount">
            <Form.Label></Form.Label>
            <div className="form-control" style={{ marginTop: "5px" }}>
              <Controller
                control={control}
                name="CreateNewAccount"
                render={({ field: { onChange, value } }) => (
                  <Form.Check
                    disabled={!isEnable}
                    aria-label="CreateNewAccount"
                    label="Create New Ledger"
                    value={value}
                    onChange={(v) => {
                      onChange(v);
                      setValue("CustomerAccounts", []);
                    }}
                  />
                )}
              />
            </div>
          </Form.Group>
        </Row>

        <Row>
          <Form.Group controlId="BranchAddress">
            <Form.Label>
              {pageTitles?.branch || "Customer Branch"} Address
            </Form.Label>
            <Form.Control
              disabled={!isEnable}
              type="text"
              placeholder=""
              {...register("BranchAddress")}
            />
          </Form.Group>
        </Row>

        <Row>
          <Form.Group as={Col} controlId="ContactPersonName">
            <Form.Label>Contact Person Name</Form.Label>
            <Form.Control
              disabled={!isEnable}
              type="text"
              placeholder=""
              {...register("ContactPersonName")}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="ContactPersonNo">
            <Form.Label>Contact Person No</Form.Label>
            <Form.Control
              disabled={!isEnable}
              type="text"
              placeholder=""
              {...register("ContactPersonNo")}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="ContactPersonEmail">
            <Form.Label>Contact Person Email</Form.Label>
            <Form.Control
              disabled={!isEnable}
              type="email"
              placeholder=""
              {...register("ContactPersonEmail")}
            />
          </Form.Group>
        </Row>

        <Row>
          <Form.Group as={Col} controlId="Description">
            <Form.Label>Descripiton</Form.Label>
            <Form.Control
              disabled={!isEnable}
              type="text"
              placeholder=""
              name="email"
              {...register("Description")}
            />
          </Form.Group>
        </Row>

        <Row>
          <Form.Group as={Col} controlId="InActiveG" className="mt-2">
            <div className="d-flex gap-2">
              <Form.Check
                disabled={!isEnable}
                aria-label="InActive"
                id="InActive"
                name="InActive"
                {...register("InActive")}
              />
              <Form.Label>InActive</Form.Label>
            </div>
          </Form.Group>
        </Row>

        <Row className="mt-2 mb-2">
          <ButtonGroup className="gap-2">
            <Button
              disabled={!isEnable || customerBranchMutation.isPending}
              label={customerBranchMutation?.isPending ? `Adding...` : "Add"}
              className="rounded text-center"
              severity="success"
              type="button"
              style={{
                padding: "0.3rem 1.25rem",
                fontSize: ".8em",
              }}
              loading={customerBranchMutation.isPending}
              loadingIcon={"pi pi-spin pi-spinner"}
              onClick={() => {
                handleSubmit(onSubmit)();
              }}
            />
            <Button
              disabled={!isEnable}
              label="Clear"
              className="rounded text-center"
              severity="danger"
              type="button"
              style={{
                padding: "0.3rem 1.25rem",

                fontSize: ".8em",
              }}
              onClick={() => reset()}
            />
          </ButtonGroup>
        </Row>
      </form>
    </>
  );
}

function CustomerBranchesDataTable(props) {
  const queryClient = useQueryClient();
  const { pageTitles, isEnable: isGloballyEnable } = props;
  const [visible, setVisible] = useState(false);
  const { CustomerID } = props;
  const [filters, setFilters] = useState({
    CustomerBranchTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [CustomerBranchID, setCustomerBranchID] = useState(0);
  const [isEnable, setIsEnable] = useState(false);
  const [CustomerBranchData, setCustomerBranchData] = useState();

  const { user } = useContext(AuthContext);
  const { register, setValue, handleSubmit, watch, control } = useForm();

  const { data: CustomerBranches } = useQuery({
    queryKey: ["customerBranchesDetail", CustomerID],
    queryFn: () => fetchCustomerBranchesByCustomerID(CustomerID, user.userID),
    enabled: CustomerID !== 0,
    initialData: [],
  });

  const customerAccountEntryMutation = useMutation({
    mutationFn: async (formData) => {
      let AccountIDs = [];
      if (formData?.CustomerAccounts?.length > 0) {
        AccountIDs = formData?.CustomerAccounts?.map((b, i) => {
          return {
            RowID: i + 1,
            AccountID: b.AccountID,
            CreateNewAccount: 0,
          };
        });
      } else {
        AccountIDs = [
          {
            RowID: 1,
            AccountID: 0,
            CreateNewAccount: 1,
          },
        ];
      }
      formData.CustomerAccounts = AccountIDs;
      let DataToSend = {
        CustomerBranchID: formData?.CustomerBranchID,
        CustomerID: CustomerID,
        BranchID: formData?.CustomerBranch?.BranchID,
        BranchAddress: formData?.BranchAddress,
        ContactPersonName: formData?.ContactPersonName,
        ContactPersonNo: formData?.ContactPersonNo,
        ContactPersonEmail: formData?.ContactPersonEmail,
        Description: formData?.Description,
        InActive: formData?.InActive ? 1 : 0,
        AccountIDs: JSON.stringify(formData?.CustomerAccounts),
        EntryUserID: user.userID,
      };

      const { data } = await axios.post(
        apiUrl + "/EduIMS/CustomerBranchInsertUpdate",
        DataToSend
      );

      if (data.success === true) {
        toast.success(
          `${pageTitles?.branch || "Customer Branch"} updated! successfully!`
        );
        queryClient.invalidateQueries({ queryKey: ["customerBranchesDetail"] });
        queryClient.invalidateQueries({
          queryKey: ["customerAccounts", CustomerID],
        });
        setVisible(false);
      } else {
        toast.error(data.message, {
          autoClose: 1500,
        });
      }
    },
    onError: () => {
      toast.error("Error while saving data!");
    },
  });

  function onSubmit(data) {
    customerAccountEntryMutation.mutate(data);
  }

  const { data: CustomersBranch } = useQuery({
    queryKey: ["customersBranch"],
    queryFn: () => fetchAllCustomersBranch(),
    initialData: [],
  });

  const { data: CustomerAccounts } = useQuery({
    queryKey: ["customerAccounts", CustomerID],
    queryFn: () => fetchAllCustomerAccountsForSelect(CustomerID),
    enabled: CustomerID !== 0,
    initialData: [],
  });

  const {
    render: DeleteModal,
    handleShow: handleDeleteShow,
    handleClose: handleDeleteClose,
    setIdToDelete,
  } = useDeleteModal(handleDelete);

  const deleteMutation = useMutation({
    mutationFn: deleteCustomerBranchByID,
    onSuccess: (response) => {
      if (response === true) {
        queryClient.invalidateQueries({ queryKey: ["customerBranchesDetail"] });
      }
    },
  });

  useEffect(() => {
    async function fetchCustomerBranch() {
      if (
        CustomerBranchID !== undefined &&
        CustomerBranchID !== null &&
        CustomerBranchID !== 0
      ) {
        const { data } = await axios.post(
          `${apiUrl}/EduIMS/ViewCustomerBranchWhere?CustomerBranchID=${CustomerBranchID}&LoginUserID=${user.userID}`
        );
        if (!data) {
          toast.error("Network Error Occured!", {
            position: "bottom-left",
          });
        }

        setCustomerBranchData(data);
      } else {
        setCustomerBranchData(null);
      }
    }
    if (CustomerBranchID !== 0) {
      fetchCustomerBranch();
    }
  }, [CustomerBranchID]);

  useEffect(() => {
    if (CustomerBranchID !== 0 && CustomerBranchData?.BracnhInfo) {
      setValue(
        "CustomerBranchID",
        CustomerBranchData?.BracnhInfo[0].CustomerBranchID
      );
      setValue("CustomerBranch", {
        BranchID: CustomerBranchData?.BracnhInfo[0].BranchID,
        BranchTitle: CustomerBranchData?.BracnhInfo[0].BranchTitle,
      });
      setValue(
        "BranchAddress",
        CustomerBranchData?.BracnhInfo[0].BranchAddress
      );
      setValue(
        "ContactPersonName",
        CustomerBranchData?.BracnhInfo[0].ContactPersonName
      );
      setValue(
        "ContactPersonNo",
        CustomerBranchData?.BracnhInfo[0].ContactPersonNo
      );
      setValue(
        "ContactPersonEmail",
        CustomerBranchData?.BracnhInfo[0].ContactPersonEmail
      );
      setValue("Description", CustomerBranchData?.BracnhInfo[0].Description);
      setValue("InActive", CustomerBranchData?.BracnhInfo[0].InActive);
      setValue("CustomerAccounts", CustomerBranchData?.Accounts);
    }
  }, [CustomerBranchID, CustomerBranchData]);

  function handleDelete(BranchID) {
    deleteMutation.mutate({
      CustomerBranchID: BranchID,
      LoginUserID: user.userID,
    });
    handleDeleteClose();
    setIdToDelete(0);
  }

  return (
    <>
      <>
        <DataTable
          className="mt-2"
          showGridlines
          value={CustomerBranches?.data || []}
          dataKey="CustomerBranchID"
          removableSort
          emptyMessage={`No ${
            pageTitles?.branch?.toLowerCase() || "customer branch"
          }`}
          filters={filters}
          filterDisplay="row"
          resizableColumns
          size="small"
          selectionMode="single"
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column
            body={(rowData) => (
              <>
                <ButtonGroup className="gap-1">
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
                    onClick={() => {
                      setVisible(true);
                      setCustomerBranchID(rowData?.CustomerBranchID);
                      setIsEnable(false);
                    }}
                  />
                  <Button
                    disabled={!isGloballyEnable}
                    icon="pi pi-pencil"
                    severity="success"
                    size="small"
                    className="rounded"
                    style={{
                      padding: "0.3rem .7rem",
                      fontSize: ".8em",
                      width: "30px",
                    }}
                    onClick={() => {
                      setVisible(true);
                      setCustomerBranchID(rowData?.CustomerBranchID);
                      setIsEnable(true);
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
                      handleDeleteShow(rowData?.CustomerBranchID);
                    }}
                  />
                </ButtonGroup>
              </>
            )}
            header="Actions"
            resizeable={false}
            style={{
              minWidth: "8rem",
              maxWidth: "8rem",
              width: "8rem",
              textAlign: "center",
            }}
          ></Column>
          <Column
            field="BranchTitle"
            filter
            filterPlaceholder={`Search by ${
              pageTitles?.branch || "customer branch"
            }`}
            sortable
            header={`${pageTitles?.branch || "Customer Branch"} Title`}
            style={{ minWidth: "20rem" }}
          ></Column>
        </DataTable>

        <form onKeyDown={preventFormByEnterKeySubmission}>
          <div className="card flex justify-content-center">
            <Dialog
              header={`Edit ${pageTitles?.branch || "Customer Branch"}`}
              visible={visible}
              onHide={() => setVisible(false)}
              style={{ width: "70vw", height: "65vh" }}
              footer={
                <>
                  {!isEnable ? (
                    <>
                      <Button
                        label="Edit"
                        severity="success"
                        className="rounded"
                        type="button"
                        onClick={() => {
                          setIsEnable(true);
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <Button
                        label={
                          customerAccountEntryMutation.isPending
                            ? "Updating..."
                            : "Update"
                        }
                        severity="success"
                        className="rounded"
                        type="button"
                        loading={customerAccountEntryMutation.isPending}
                        loadingIcon="pi pi-spin pi-spinner"
                        onClick={() => {
                          handleSubmit(onSubmit)();
                        }}
                      />
                    </>
                  )}
                </>
              }
            >
              <input
                type="text"
                {...register("CustomerBranchID", {
                  valueAsNumber: true,
                })}
                className="visually-hidden "
                style={{ display: "none" }}
              />
              <form
                onSubmit={handleSubmit(onSubmit)}
                onKeyDown={preventFormByEnterKeySubmission}
              >
                <Row>
                  <Form.Group as={Col} controlId="CustomerBranchTitle">
                    <Form.Label>
                      {pageTitles?.branch || "Customer Branch"} Title
                    </Form.Label>
                    <span className="text-danger fw-bold ">*</span>
                    <AllCustomersBranchEntryModal
                      CustomerID={CustomerID}
                      pageTitles={pageTitles}
                    />
                    <Controller
                      control={control}
                      name="CustomerBranch"
                      render={({ field: { onChange, value } }) => (
                        <Select
                          isDisabled={!isEnable}
                          options={CustomersBranch}
                          getOptionValue={(option) => option.BranchID}
                          getOptionLabel={(option) => option.BranchTitle}
                          value={value}
                          onChange={(selectedOption) =>
                            onChange(selectedOption)
                          }
                          placeholder={`Select a ${
                            pageTitles?.branch || "Customer Branch"
                          }`}
                          noOptionsMessage={() =>
                            `No ${
                              pageTitles?.branch?.toLowerCase() ||
                              "customer branch"
                            } found!`
                          }
                        />
                      )}
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="Customers">
                    <Form.Label>Customer Ledgers</Form.Label>
                    <span className="text-danger fw-bold ">*</span>
                    <CustomerAccountEntryModal CustomerID={CustomerID} />
                    <Controller
                      control={control}
                      name="CustomerAccounts"
                      render={({ field: { onChange, value } }) => (
                        <Select
                          isDisabled={watch("CreateNewAccount") || !isEnable}
                          options={CustomerAccounts}
                          getOptionValue={(option) => option.AccountID}
                          getOptionLabel={(option) => option.AccountTitle}
                          value={value}
                          onChange={(selectedOption) =>
                            onChange(selectedOption)
                          }
                          placeholder="Select a ledger"
                          noOptionsMessage={() => "No ledgers found!"}
                          isClearable
                          isMulti
                        />
                      )}
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="CreateNewAccount">
                    <Form.Label></Form.Label>
                    <div className="form-control" style={{ marginTop: "5px" }}>
                      <Controller
                        control={control}
                        name="CreateNewAccount"
                        render={({ field: { onChange, value } }) => (
                          <Form.Check
                            aria-label="CreateNewAccount"
                            label="Create New Ledger"
                            value={value}
                            onChange={(v) => {
                              onChange(v);
                              setValue("CustomerAccounts", []);
                            }}
                            disabled={!isEnable}
                          />
                        )}
                      />
                    </div>
                  </Form.Group>
                </Row>

                <Row>
                  <Form.Group controlId="BranchAddress">
                    <Form.Label>
                      {pageTitles?.branch || "Customer Branch"} Address
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      {...register("BranchAddress")}
                      disabled={!isEnable}
                    />
                  </Form.Group>
                </Row>

                <Row>
                  <Form.Group as={Col} controlId="ContactPersonName">
                    <Form.Label>Contact Person Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      {...register("ContactPersonName")}
                      disabled={!isEnable}
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="ContactPersonNo">
                    <Form.Label>Contact Person No</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      {...register("ContactPersonNo")}
                      disabled={!isEnable}
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="ContactPersonEmail">
                    <Form.Label>Contact Person Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder=""
                      {...register("ContactPersonEmail")}
                      disabled={!isEnable}
                    />
                  </Form.Group>
                </Row>

                <Row>
                  <Form.Group as={Col} controlId="Description">
                    <Form.Label>Descripiton</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      name="email"
                      {...register("Description")}
                      disabled={!isEnable}
                    />
                  </Form.Group>
                </Row>

                <Row>
                  <Form.Group as={Col} controlId="InActiveG" className="mt-2">
                    <div className="d-flex gap-2">
                      <Form.Check
                        aria-label="InActive"
                        id="InActive"
                        name="InActive"
                        {...register("InActive")}
                        disabled={!isEnable}
                      />
                      <Form.Label>InActive</Form.Label>
                    </div>
                  </Form.Group>
                </Row>
              </form>
            </Dialog>
          </div>
        </form>
        {DeleteModal}
      </>
    </>
  );
}
