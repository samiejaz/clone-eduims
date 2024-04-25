import { confirmDialog } from "primereact/confirmdialog"

const useConfirmationModal = ({ handleDelete, handleEdit }) => {
  const reject = () => {}

  const confirmEdit = (id) => {
    confirmDialog({
      message: "Do you want to edit this record?",
      header: "Edit Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "accept",
      acceptClassName: "p-button-primary",
      position: "top",
      accept: () => handleEdit(id),
      reject,
    })
  }
  const confirmDelete = (id) => {
    confirmDialog({
      message: "Do you want to delete this record?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      position: "top",
      accept: () => handleDelete(id),
      reject,
    })
  }

  return {
    showEditDialog: confirmEdit,
    showDeleteDialog: confirmDelete,
  }
}

export default useConfirmationModal
