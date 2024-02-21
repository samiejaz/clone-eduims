import { useState, useContext } from "react";
import { preventFormByEnterKeySubmission } from "../../utils/CommonFunctions";
import { Form, Row, Col, ButtonGroup } from "react-bootstrap";
import { Button } from "primereact/button";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import {
  deleteAllCustomersBranchByID,
  fetchAllCustomersBranch,
} from "./CustomerEntryAPI";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { Dialog } from "primereact/dialog";
import useDeleteModal from "../../hooks/useDeleteModalHook";

const apiUrl = import.meta.env.VITE_APP_API_URL;

function AllCustomersBranchEntry(props) {
  const { CustomerID, isEnable = true } = props;
  return (
    <>
      <CustomerAccountDataTableHeader
        CustomerID={CustomerID}
        isEnable={isEnable}
      />
      <div className="mt-3">
        <AllCustomersBranchDetailTable
          CustomerID={CustomerID}
          isEnable={isEnable}
        />
      </div>
    </>
  );
}

export default AllCustomersBranchEntry;

function CustomerAccountDataTableHeader(props) {
  const queryClient = useQueryClient();

  const { CustomerID, isEnable, pageTitles } = props;
  const { user } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      BranchTitle: "",
    },
  });

  const AllCustomersBranchEntryMutation = useMutation({
    mutationFn: async (formData) => {
      let DataToSend = {
        BranchID: 0,
        BranchTitle: formData?.BranchTitle,
        EntryUserID: user.userID,
        InActive: formData?.InActive ? 1 : 0,
      };
      const { data } = await axios.post(
        apiUrl + "/Branch/BranchInsertUpdate",
        DataToSend
      );
      if (data.success === true) {
        reset();
        toast.success(
          `${pageTitles?.branch || "Customer Branch"} saved successfully!`
        );
        queryClient.invalidateQueries({
          queryKey: ["allCustomerBranchesDetail"],
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
      AllCustomersBranchEntryMutation.mutate(data);
    }
  }

  return (
    <>
      <form
        // onSubmit={handleSubmit(onSubmit)}
        onKeyDown={preventFormByEnterKeySubmission}
      >
        <Row>
          <Form.Group as={Col} controlId="BranchTitle">
            <Form.Label>
              {pageTitles?.branch || "Customer Branch"} Title
            </Form.Label>
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder=""
                disabled={!isEnable}
                className="form-control"
                {...register("BranchTitle", {
                  required: `${
                    pageTitles?.branch || "Customer Branch"
                  } Title is required!`,
                })}
              />
              <Button
                severity="info"
                className="px-4 py-2 rounded-1 "
                onClick={() => {
                  handleSubmit(onSubmit)();
                }}
                type="button"
                disabled={
                  !isEnable || AllCustomersBranchEntryMutation.isPending
                }
                label={
                  AllCustomersBranchEntryMutation?.isPending
                    ? `Adding...`
                    : "Add"
                }
                loadingIcon={"pi pi-spin pi-spinner"}
                loading={AllCustomersBranchEntryMutation.isPending}
              ></Button>
            </div>
            <p className="text-danger">{errors?.BranchTitle?.message}</p>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group
            as={Col}
            controlId="InActiveG"
            style={{ marginTop: "-15px" }}
          >
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
    </>
  );
}

function AllCustomersBranchDetailTable(props) {
  const queryClient = useQueryClient();
  const [visible, setVisible] = useState(false);
  const { CustomerID, isEnable, pageTitles } = props;
  const [filters, setFilters] = useState({
    BranchTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const { user } = useContext(AuthContext);
  const { register, setValue, handleSubmit } = useForm();

  const { data: CustomerBranches } = useQuery({
    queryKey: ["allCustomerBranchesDetail"],
    queryFn: () => fetchAllCustomersBranch(user.userID),
    initialData: [],
  });

  const {
    render: DeleteModal,
    handleShow: handleDeleteShow,
    handleClose: handleDeleteClose,
    setIdToDelete,
  } = useDeleteModal(handleDelete);

  const AllCustomersBranchEntryMutation = useMutation({
    mutationFn: async (formData) => {
      let DataToSend = {
        BranchID: formData?.BranchID,
        BranchTitle: formData?.BranchTitle,
        CustomerID: CustomerID,
        EntryUserID: user.userID,
        InActive: formData?.InActive ? 1 : 0,
      };
      const { data } = await axios.post(
        apiUrl + "/Branch/BranchInsertUpdate",
        DataToSend
      );

      if (data.success === true) {
        toast.success(
          `${pageTitles?.branch || "Customer Branch"} updated successfully!`
        );
        queryClient.invalidateQueries({
          queryKey: ["allCustomerBranchesDetail"],
        });
        queryClient.invalidateQueries({ queryKey: ["customerBranchesDetail"] });
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

  const deleteMutation = useMutation({
    mutationFn: deleteAllCustomersBranchByID,
    onSuccess: (response) => {
      if (response === true) {
        queryClient.invalidateQueries({
          queryKey: ["allCustomerBranchesDetail"],
        });
      }
    },
  });

  function onSubmit(data) {
    AllCustomersBranchEntryMutation.mutate(data);
  }

  function handleDelete(BranchID) {
    deleteMutation.mutate({
      BranchID: BranchID,
      LoginUserID: user.userID,
    });

    handleDeleteClose();
    setIdToDelete(0);
  }

  return (
    <>
      <DataTable
        className="mt-2"
        showGridlines
        value={CustomerBranches?.data || []}
        dataKey="BranchID"
        removableSort
        emptyMessage={`No ${
          pageTitles?.branch?.toLowerCase() || "customer branch"
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
              <ButtonGroup className="gap-2">
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
                    setVisible(true);
                    setValue("BranchTitle", rowData?.BranchTitle);
                    setValue("BranchID", rowData?.BranchID);
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
                    handleDeleteShow(rowData?.BranchID);
                  }}
                />
              </ButtonGroup>
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
          field="BranchTitle"
          filter
          filterPlaceholder={`Search by ${
            pageTitles?.branch || "Customer Branch"
          }`}
          sortable
          header={`${pageTitles?.branch || "Customer Branch"} Title`}
          style={{ minWidth: "20rem" }}
        ></Column>
      </DataTable>

      <form onKeyDown={preventFormByEnterKeySubmission}>
        <div className="card flex justify-content-center">
          <Dialog
            header={`Edit ${pageTitles?.branch || "Customer Branch"} Title`}
            visible={visible}
            onHide={() => {
              setVisible(false);
            }}
            style={{ width: "40vw" }}
            footer={
              <Button
                severity="success"
                className="rounded"
                type="button"
                label={
                  AllCustomersBranchEntryMutation.isPending
                    ? "Updating..."
                    : "Update"
                }
                loading={AllCustomersBranchEntryMutation.isPending}
                loadingIcon="pi pi-spin pi-spinner"
                onClick={() => {
                  handleSubmit(onSubmit)();
                }}
              />
            }
          >
            <input
              type="text"
              {...register("BranchID", {
                valueAsNumber: true,
              })}
              className="visually-hidden "
              style={{ display: "none" }}
            />
            <Row>
              <Form.Group as={Col} controlId="BranchTitle">
                <Form.Label>
                  {pageTitles?.branch || "Customer Branch"} Title
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  required
                  className="form-control"
                  {...register("BranchTitle")}
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
          </Dialog>
        </div>
        {DeleteModal}
      </form>
    </>
  );
}
