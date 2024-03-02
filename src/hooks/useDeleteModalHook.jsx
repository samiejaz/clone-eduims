import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

const useDeleteModal = (handleDelete) => {
  // const reject = () => {};
  // const setIdToDelete = () => {};
  // const confirm = (id) => {
  //   confirmDialog({
  //     message: "Do you want to delete this record?",
  //     header: "Delete Confirmation",
  //     icon: "pi pi-info-circle",
  //     defaultFocus: "reject",
  //     acceptClassName: "p-button-danger",
  //     position: "top",
  //     accept: () => handleDelete(id),
  //     reject,
  //   });
  // };
  // return {
  //   handleShow: confirm,
  //   handleClose: reject,
  //   setIdToDelete,
  //   render: (
  //     <ConfirmDialog
  //       id="deleteDialog"
  //       draggable={false}
  //       style={{ width: "27vw" }}
  //       pt={{
  //         acceptButton: {
  //           root: {
  //             className: "rounded",
  //           },
  //         },
  //         rejectButton: {
  //           root: {
  //             className: "rounded",
  //           },
  //         },
  //       }}
  //     />
  //   ),
  // };
};

export default useDeleteModal;
