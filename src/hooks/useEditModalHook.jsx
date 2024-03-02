import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

const useEditModal = (handleEdit) => {
  // const [show, setShowModal] = useState(false);
  // const [idToEdit, setIdToEdit] = useState(0);

  // const handleShow = (id) => {
  //   setIdToEdit(id);
  //   setShowModal(true);
  // };

  // const handleClose = () => {
  //   setShowModal(false);
  // };

  // return {
  //   handleClose,
  //   handleShow,
  //   setIdToEdit,
  //   render: (
  //     <Modal show={show} onHide={handleClose} animation={true}>
  //       <Modal.Header closeButton>
  //         <Modal.Title>Edit</Modal.Title>
  //       </Modal.Header>
  //       <Modal.Body>
  //         <p>Are you sure you want to edit the record?</p>
  //       </Modal.Body>
  //       <Modal.Footer>
  //         <Button variant="secondary" onClick={handleClose}>
  //           No
  //         </Button>
  //         <Button variant="primary" onClick={() => handleEdit(idToEdit)}>
  //           Yes
  //         </Button>
  //       </Modal.Footer>
  //     </Modal>
  //   ),
  // };
  const reject = () => {};
  const setIdToDelete = () => {};
  const confirm = (id) => {
    confirmDialog({
      message: "Do you want to edit this record?",
      header: "Edit Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "accept",
      acceptClassName: "p-button-primary",
      position: "top",
      accept: () => handleEdit(id),
      reject,
    });
  };

  return {
    handleShow: confirm,
    handleClose: reject,
    setIdToDelete,
    render: (
      <></>
      // <ConfirmDialog
      //   id="editDialog"
      //   draggable={false}
      //   style={{ width: "27vw" }}
      //   pt={{
      //     acceptButton: {
      //       root: {
      //         className: "rounded",
      //       },
      //     },
      //     rejectButton: {
      //       root: {
      //         className: "rounded",
      //       },
      //     },
      //   }}
      // />
    ),
  };
};

export default useEditModal;
