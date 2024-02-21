import { Spinner } from "react-bootstrap";
import { useState } from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ActionButtons from "../../components/ActionButtons";
import useDeleteModal from "../../hooks/useDeleteModalHook";
import useEditModal from "../../hooks/useEditModalHook";
import { FilterMatchMode } from "primereact/api";

import {
  deleteNewCustomerByID,
  fetchAllNewCustomers,
} from "../../api/NewCustomerData";
import { CustomerEntryForm } from "../../components/CustomerEntryFormComponent";
import { useNavigate } from "react-router";
import { ROUTE_URLS } from "../../utils/enums";

const parentRoute = ROUTE_URLS.CUSTOMERS.CUSTOMER_ENTRY;
const editRoute = `${parentRoute}/edit/`;
const viewRoute = `${parentRoute}/`;

export default function GenCustomerEntry() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  // Hooks
  const { user } = useContext(AuthContext);

  const [filters, setFilters] = useState({
    CustomerName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    CustomerBusinessAddress: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
    },
    CustomerBusinessName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ContactPerson1Name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const {
    render: EditModal,
    handleShow: handleEditShow,
    handleClose: handleEditClose,
    setIdToEdit,
  } = useEditModal(handleEdit);
  const {
    render: DeleteModal,
    handleShow: handleDeleteShow,
    handleClose: handleDeleteClose,
    setIdToDelete,
  } = useDeleteModal(handleDelete);

  // Queries
  const {
    data: Customers,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["Customers"],
    queryFn: () => fetchAllNewCustomers(user.userID),
    initialData: [],
    refetchOnWindowFocus: false,
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: deleteNewCustomerByID,
    onSuccess: (response) => {
      if (response) {
        queryClient.invalidateQueries({ queryKey: ["Customers"] });
      }
    },
  });

  function handleEdit(CustomerID) {
    navigate(viewRoute + CustomerID + "?viewMode=edit");
    handleEditClose();
    setIdToEdit(0);
  }
  function handleDelete(CustomerID) {
    deleteMutation.mutate({ CustomerID, LoginUserID: user.userID });
    handleDeleteClose();
    setIdToDelete(0);
  }
  function handleView(CustomerID) {
    console.log(CustomerID);
    navigate(viewRoute + CustomerID + "?viewMode=view");
  }

  return (
    <div className="mt-4">
      {isLoading || isFetching ? (
        <>
          <div className="h-100 w-100">
            <div className="d-flex align-content-center justify-content-center ">
              <Spinner
                animation="border"
                size="lg"
                role="status"
                aria-hidden="true"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="d-flex text-dark mb-4">
            <h2 className="text-center my-auto">Customer Entry</h2>

            <div className="text-end my-auto">
              <CustomerEntryForm IconButton={false} />
            </div>
          </div>
          <DataTable
            showGridlines
            value={Customers}
            dataKey="CustomerID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage="No customer entry found!"
            filters={filters}
            filterDisplay="row"
            resizableColumns
            size="small"
            selectionMode="single"
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column
              body={(rowData) =>
                ActionButtons(
                  rowData.CustomerID,
                  handleDeleteShow,
                  handleEditShow,
                  handleView,
                  true
                )
              }
              header="Actions"
              resizeable={false}
              style={{ minWidth: "7rem", maxWidth: "7rem", width: "7rem" }}
            ></Column>
            <Column
              field="CustomerName"
              filter
              filterPlaceholder="Search by Customer Name"
              sortable
              header="Customer Name"
            ></Column>
            <Column
              field="CustomerBusinessAddress"
              filter
              filterPlaceholder="Search by Address"
              sortable
              header="Customer Business Address"
            ></Column>
            <Column
              field="CustomerBusinessName"
              filter
              filterPlaceholder="Search by Business Name"
              sortable
              header="Customer Business Name"
            ></Column>
            <Column
              field="ContactPerson1Name"
              filter
              filterPlaceholder="Search by Contact Person Name"
              sortable
              header="Contact Person Name"
            ></Column>
          </DataTable>
          {DeleteModal}
          {EditModal}
        </>
      )}
    </div>
  );
}
