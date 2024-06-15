import { confirmDialog } from "primereact/confirmdialog"
import { displayYesNoDialog } from "../utils/helpers"
import { SEVERITIES } from "../utils/CONSTANTS"

const useConfirmationModal = ({ handleDelete, handleEdit }) => {
  const reject = () => {}

  const confirmEdit = (id) => {
    displayYesNoDialog({
      message: "Do you want to edit this record?",
      header: "Edit Confirmation",
      accept: () => handleEdit(id),
      icon: <i className="pi pi-info-circle text-5xl"></i>,
      severity: SEVERITIES.PRIMARY,
      defaultFocus: "accept",
    })
  }
  const confirmDelete = (id) => {
    displayYesNoDialog({
      message: "Do you want to delete this record?",
      header: "Delete Confirmation",
      accept: () => handleDelete(id),
      icon: <i className="pi pi-info-circle text-5xl"></i>,
      severity: SEVERITIES.DANGER,
      defaultFocus: "reject",
    })
  }

  return {
    showEditDialog: confirmEdit,
    showDeleteDialog: confirmDelete,
  }
}

export default useConfirmationModal
