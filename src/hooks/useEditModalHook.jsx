import { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const useEditModal = (handleEdit) => {
  const [show, setShowModal] = useState(false);
  const [idToEdit, setIdToEdit] = useState(0);

  const handleShow = (id) => {
    setIdToEdit(id);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return {
    handleClose,
    handleShow,
    setIdToEdit,
    render: (
      <Modal show={show} onHide={handleClose} animation={true}>
        <Modal.Header closeButton>
          <Modal.Title>Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to edit the record?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            No
          </Button>
          <Button variant="primary" onClick={() => handleEdit(idToEdit)}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    ),
  };
};

export default useEditModal;
