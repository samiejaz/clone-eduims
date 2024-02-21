// import { useContext, useEffect, useState } from "react";
// import TabHeader from "../../components/TabHeader";
// import { Form, Row, Col, Spinner } from "react-bootstrap";
// import { Controller, useForm } from "react-hook-form";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import ButtonRow from "../../components/ButtonRow";
// import { AuthContext } from "../../context/AuthContext";
// import axios from "axios";
// import { ActiveKeyContext } from "../../context/ActiveKeyContext";
// import { toast } from "react-toastify";
// import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";
// import ActionButtons from "../../components/ActionButtons";
// import useEditModal from "../../hooks/useEditModalHook";
// import useDeleteModal from "../../hooks/useDeleteModalHook";
// import { FilterMatchMode } from "primereact/api";
// import { preventFormByEnterKeySubmission } from "../../utils/CommonFunctions";
// import Select from "react-select";
// import {
//   InvoiceDefaultDescriptionsDataContext,
//   InvoiceDefaultDescriptionsDataProivder,
// } from "./InvoiceDefaultDescriptionsDataContext";
// import {
//   deleteInvoiceDeafultDescriptionsByID,
//   fetchAllInvoiceDeafultDescriptions,
//   fetchInvoiceDeafultDescriptionById,
// } from "../../api/InvoiceDefaultDescriptions";
// import { AppConfigurationContext } from "../../context/AppConfigurationContext";

// const apiUrl = import.meta.env.VITE_APP_API_URL;

// const defaultValues = {
//   InvoiceType: [],
//   Description: "",
//   InActive: false,
// };

// function InvoiceDefaultDescriptions() {
//   const { pageTitles } = useContext(AppConfigurationContext);
//   document.title = `Invoice Descriptions`;
//   return (
//     <InvoiceDefaultDescriptionsDataProivder>
//       <TabHeader
//         Search={<InvoiceDefaultDescriptionsSearch pageTitles={pageTitles} />}
//         Entry={<InvoiceDefaultDescriptionsEntry pageTitles={pageTitles} />}
//         SearchTitle={"InvoiceDefaultDescription Info"}
//         EntryTitle={"Add New InvoiceDefaultDescription"}
//       />
//     </InvoiceDefaultDescriptionsDataProivder>
//   );
// }

// function InvoiceDefaultDescriptionsSearch({ pageTitles }) {
//   const queryClient = useQueryClient();

//   const { user } = useContext(AuthContext);
//   const { setKey } = useContext(ActiveKeyContext);

//   const [filters, setFilters] = useState({
//     Description: {
//       value: null,
//       matchMode: FilterMatchMode.CONTAINS,
//     },
//     InvoiceType: {
//       value: null,
//       matchMode: FilterMatchMode.CONTAINS,
//     },
//   });

//   const {
//     render: EditModal,
//     handleShow: handleEditShow,
//     handleClose: handleEditClose,
//     setIdToEdit,
//   } = useEditModal(handleEdit);

//   const {
//     render: DeleteModal,
//     handleShow: handleDeleteShow,
//     handleClose: handleDeleteClose,
//     setIdToDelete,
//   } = useDeleteModal(handleDelete);

//   const { setIsEnable, setDescriptionID } = useContext(
//     InvoiceDefaultDescriptionsDataContext
//   );

//   const {
//     data: InvoiceDefaultDescriptions,
//     isLoading,
//     isFetching,
//   } = useQuery({
//     queryKey: ["invoiceDefaultDescriptions"],
//     queryFn: () => fetchAllInvoiceDeafultDescriptions(user.userID),
//     initialData: [],
//   });

//   const deleteMutation = useMutation({
//     mutationFn: deleteInvoiceDeafultDescriptionsByID,
//     onSuccess: (data) => {
//       if (data === true) {
//         queryClient.invalidateQueries({
//           queryKey: ["invoiceDefaultDescriptions"],
//         });
//       }
//     },
//   });

//   function handleEdit(DescriptionID) {
//     setDescriptionID(DescriptionID);
//     setIsEnable(true);
//     setKey("entry");
//     handleEditClose();
//     setIdToEdit(0);
//   }
//   function handleDelete(DescriptionID) {
//     deleteMutation.mutate({
//       DescriptionID,
//       LoginUserID: user.userID,
//     });
//     handleDeleteClose();
//     setIdToDelete(0);
//     setDescriptionID(0);
//   }
//   function handleView(DescriptionID) {
//     setKey("entry");
//     setDescriptionID(DescriptionID);
//     setIsEnable(false);
//   }

//   return (
//     <>
//       {isFetching || isLoading ? (
//         <>
//           <div className="d-flex align-content-center justify-content-center h-100 w-100 m-auto">
//             <Spinner
//               animation="border"
//               size="lg"
//               role="status"
//               aria-hidden="true"
//             />
//           </div>
//         </>
//       ) : (
//         <>
//           <DataTable
//             showGridlines
//             value={InvoiceDefaultDescriptions}
//             dataKey="DescriptionID"
//             paginator
//             rows={10}
//             rowsPerPageOptions={[5, 10, 25, 50]}
//             removableSort
//             emptyMessage="No descriptions found!"
//             filters={filters}
//             filterDisplay="row"
//             resizableColumns
//             size="small"
//             selectionMode="single"
//             tableStyle={{ minWidth: "50rem" }}
//           >
//             <Column
//               body={(rowData) =>
//                 ActionButtons(
//                   rowData.DescriptionID,
//                   handleDeleteShow,
//                   handleEditShow,
//                   handleView
//                 )
//               }
//               header="Actions"
//               resizeable={false}
//               style={{ minWidth: "7rem", maxWidth: "7rem", width: "7rem" }}
//             ></Column>
//             <Column
//               field="Description"
//               filter
//               filterPlaceholder="Search by description"
//               sortable
//               header="Description"
//               style={{ minWidth: "20rem" }}
//             ></Column>
//             <Column
//               field="InvoiceType"
//               filter
//               filterPlaceholder="Search by inovice type"
//               sortable
//               header="InvoiceType"
//               style={{ minWidth: "20rem" }}
//             ></Column>
//           </DataTable>
//           {EditModal}
//           {DeleteModal}
//         </>
//       )}
//     </>
//   );
// }

// function InvoiceDefaultDescriptionsEntry({ pageTitles }) {
//   const queryClient = useQueryClient();
//   const [InvoiceDefaultDescription, setInvoiceDefaultDescription] = useState();
//   const [isLoading, setIsLoading] = useState(false);
//   const {
//     control,
//     register,
//     handleSubmit,
//     reset,
//     setValue,
//     formState: { isDirty, isValid },
//   } = useForm();

//   const { user } = useContext(AuthContext);
//   const { setKey } = useContext(ActiveKeyContext);
//   const { isEnable, DescriptionID, setDescriptionID, setIsEnable } = useContext(
//     InvoiceDefaultDescriptionsDataContext
//   );

//   useEffect(() => {
//     async function fetchInvoiceDefaultDescription() {
//       if (
//         DescriptionID !== undefined &&
//         DescriptionID !== null &&
//         DescriptionID !== 0
//       ) {
//         setIsLoading(true);
//         const data = await fetchInvoiceDeafultDescriptionById(
//           DescriptionID,
//           user.userID
//         );
//         if (!data) {
//           setKey("search");
//           toast.error("Network Error Occured!");
//         }
//         setInvoiceDefaultDescription(data);
//         setIsLoading(false);
//       } else {
//         setInvoiceDefaultDescription(null);
//         setTimeout(() => {
//           reset(defaultValues);
//           setIsEnable(true);
//         }, 200);
//       }
//     }
//     if (DescriptionID !== 0) {
//       fetchInvoiceDefaultDescription();
//     }
//   }, [DescriptionID]);

//   const invoiceDefaultDescriptionsMutation = useMutation({
//     mutationFn: async (formData) => {
//       const dataToSend = {
//         DescriptionID: 0,
//         Description: formData.Description,
//         InvoiceType: formData.InvoiceType.value,
//         InActive: formData.InActive ? 1 : 0,
//         EntryUserID: user.userID,
//       };

//       if (InvoiceDefaultDescription?.data && DescriptionID !== 0) {
//         dataToSend.DescriptionID =
//           InvoiceDefaultDescription?.data[0]?.DescriptionID;
//       } else {
//         dataToSend.DescriptionID = 0;
//       }

//       const { data } = await axios.post(
//         apiUrl + `/EduIMS/InvoiceDescriptionInsertUpdate`,
//         dataToSend
//       );

//       if (data.success === true) {
//         if (DescriptionID !== 0) {
//           toast.success("Inovice Description updated successfully!");
//         } else {
//           toast.success("Inovice Description saved successfully!");
//         }
//         setDescriptionID(0);
//         setInvoiceDefaultDescription([]);
//         reset(defaultValues);
//         setIsEnable(true);
//         setKey("search");
//         queryClient.invalidateQueries({
//           queryKey: ["invoiceDefaultDescriptions"],
//         });
//       } else {
//         toast.error(data.message, {
//           autoClose: 1500,
//         });
//       }
//     },
//   });
//   const deleteMutation = useMutation({
//     mutationFn: deleteInvoiceDeafultDescriptionsByID,
//     onSuccess: (response) => {
//       if (response === true) {
//         queryClient.invalidateQueries({
//           queryKey: ["invoiceDefaultDescriptions"],
//         });
//         setInvoiceDefaultDescription(undefined);
//         setDescriptionID(0);
//         reset(defaultValues);
//         setIsEnable(true);
//         setKey("search");
//       }
//     },
//   });

//   useEffect(() => {
//     if (DescriptionID !== 0 && InvoiceDefaultDescription?.data) {
//       setValue("Description", InvoiceDefaultDescription?.data[0]?.Description);
//       setValue("InvoiceType", {
//         label: InvoiceDefaultDescription?.data[0]?.InvoiceType,
//         value: InvoiceDefaultDescription?.data[0]?.InvoiceType,
//       });
//       setValue("InActive", InvoiceDefaultDescription?.data[0]?.InActive);
//     }
//   }, [DescriptionID, InvoiceDefaultDescription]);

//   function onSubmit(data) {
//     invoiceDefaultDescriptionsMutation.mutate(data);
//   }
//   function handleEdit() {
//     setIsEnable(true);
//   }

//   function handleAddNew() {
//     setInvoiceDefaultDescription([]);
//     setDescriptionID(0);
//     reset(defaultValues);
//     setIsEnable(true);
//   }

//   function handleCancel() {
//     setInvoiceDefaultDescription([]);
//     setDescriptionID(0);
//     reset(defaultValues);
//     setIsEnable(true);
//   }

//   function handleDelete() {
//     deleteMutation.mutate({
//       DescriptionID,
//       LoginUserID: user.userID,
//     });
//   }

//   const typesOptions = [
//     { label: pageTitles?.product || "Product", value: "Product" },
//     { label: "Service", value: "Service" },
//   ];

//   return (
//     <>
//       {isLoading ? (
//         <>
//           <div className="d-flex align-content-center justify-content-center h-100 w-100 m-auto">
//             <Spinner
//               animation="border"
//               size="lg"
//               role="status"
//               aria-hidden="true"
//             />
//           </div>
//         </>
//       ) : (
//         <>
//           <h4 className="p-3 mb-2 bg-light text-dark text-center  ">
//             Invoice Description Entry
//           </h4>
//           <form
//             onSubmit={handleSubmit(onSubmit)}
//             onKeyDown={(e) => (e.key === "Enter" ? e.preventDefault() : "")}
//           >
//             <Row className="p-3">
//               <Form.Group as={Col} controlId="InvoiceType">
//                 <Form.Label>Invoice Type</Form.Label>
//                 <span className="text-danger fw-bold ">*</span>
//                 <Controller
//                   control={control}
//                   name="InvoiceType"
//                   render={({ field: { onChange, value } }) => (
//                     <Select
//                       required
//                       isDisabled={!isEnable}
//                       options={typesOptions}
//                       value={value}
//                       onChange={(selectedOption) => onChange(selectedOption)}
//                       placeholder="Select a type"
//                       noOptionsMessage={() => "No types found!"}
//                     />
//                   )}
//                 />
//               </Form.Group>
//             </Row>
//             <Row className="p-3" style={{ marginTop: "-25px" }}>
//               <Form.Group as={Col} controlId="Description">
//                 <Form.Label>Description</Form.Label>
//                 <span className="text-danger fw-bold ">*</span>
//                 <Form.Control
//                   as={"textarea"}
//                   rows={5}
//                   disabled={!isEnable}
//                   required
//                   className="form-control"
//                   {...register("Description", {
//                     required: "Description is required!",
//                   })}
//                 />
//               </Form.Group>
//             </Row>
//             <Row className="p-3" style={{ marginTop: "-25px" }}>
//               <Form.Group as={Col} controlId="InActive">
//                 <Form.Check
//                   aria-label="Inactive"
//                   label="Inactive"
//                   {...register("InActive", {
//                     disabled: !isEnable,
//                   })}
//                 />
//               </Form.Group>
//             </Row>

//             <ButtonRow
//               isDirty={isDirty}
//               isValid={isValid}
//               editMode={isEnable}
//               isSubmitting={invoiceDefaultDescriptionsMutation.isPending}
//               handleAddNew={handleAddNew}
//               handleCancel={handleCancel}
//               viewRecord={!isEnable}
//               editRecord={isEnable && (DescriptionID > 0 ? true : false)}
//               newRecord={DescriptionID === 0 ? true : false}
//               handleEdit={handleEdit}
//               handleDelete={handleDelete}
//             />
//           </form>
//         </>
//       )}
//     </>
//   );
// }

// export default InvoiceDefaultDescriptions;
