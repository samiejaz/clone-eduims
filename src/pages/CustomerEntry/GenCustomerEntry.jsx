import { useEffect, useState } from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ActionButtons from "../../components/ActionButtons";
import { FilterMatchMode } from "primereact/api";
import {
  deleteNewCustomerByID,
  fetchAllNewCustomers,
} from "../../api/NewCustomerData";
import { CustomerEntryForm } from "../../components/CustomerEntryFormComponent";
import { useNavigate } from "react-router";
import { MENU_KEYS, ROUTE_URLS } from "../../utils/enums";
import { CustomSpinner } from "../../components/CustomSpinner";
import useConfirmationModal from "../../hooks/useConfirmationModalHook";
import AccessDeniedPage from "../../components/AccessDeniedPage";
import { UserRightsContext } from "../../context/UserRightContext";
import GenNewCustomerView from "./CustomerEntryView";
import { Route, Routes } from "react-router-dom";

const parentRoute = ROUTE_URLS.CUSTOMERS.CUSTOMER_ENTRY;
const viewRoute = `${parentRoute}/`;
const IDENTITY = "CustomerID";

export default function Customers() {
  const { checkForUserRights } = useContext(UserRightsContext);
  const [userRights, setUserRights] = useState([]);

  useEffect(() => {
    const rights = checkForUserRights({
      MenuKey: MENU_KEYS.USERS.CUSTOMERS_FORM_KEY,
      MenuGroupKey: MENU_KEYS.USERS.GROUP_KEY,
    });
    setUserRights([rights]);
  }, []);

  return (
    <Routes>
      {userRights && userRights[0]?.ShowForm ? (
        <>
          <Route index element={<GenCustomerEntry userRights={userRights} />} />
          <Route
            path={`:${IDENTITY}`}
            element={
              <GenNewCustomerView
                key={"CustomerEntryViewRoute"}
                mode={"view"}
                userRights={userRights}
              />
            }
          />
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

export function GenCustomerEntry({ userRights }) {
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

  const { showDeleteDialog, showEditDialog } = useConfirmationModal({
    handleDelete,
    handleEdit,
  });

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
  }
  function handleDelete(CustomerID) {
    deleteMutation.mutate({ CustomerID, LoginUserID: user.userID });
  }
  function handleView(CustomerID) {
    navigate(viewRoute + CustomerID + "?viewMode=view");
  }

  return (
    <div className="mt-4">
      {isLoading || isFetching ? (
        <>
          <CustomSpinner />
        </>
      ) : (
        <>
          <div className="d-flex text-dark mb-4">
            <h2 className="text-center my-auto">Customer Entry</h2>

            {userRights[0]?.RoleNew && (
              <>
                <div className="text-end my-auto">
                  <CustomerEntryForm IconButton={false} />
                </div>
              </>
            )}
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
                ActionButtons({
                  ID: rowData.CustomerID,
                  handleDelete: () => showDeleteDialog(rowData.CustomerID),
                  handleEdit: () => showEditDialog(rowData.CustomerID),
                  handleView: handleView,
                  showEditButton: userRights[0]?.RoleEdit,
                  showDeleteButton: userRights[0]?.RoleDelete,
                  viewBtnRoute: viewRoute + rowData.CustomerID,
                })
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
        </>
      )}
    </div>
  );
}
