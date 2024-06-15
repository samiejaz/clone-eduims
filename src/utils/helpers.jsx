import { Button } from "primereact/button"
import { confirmDialog } from "primereact/confirmdialog"
import { SEVERITIES } from "./CONSTANTS"

export const displayOkDialog = ({
  accept = () => null,
  acceptLabel = "OK",
  header = "CheckReliance",
  message = "",
  icon = <i className="pi pi-exclamation-circle text-5xl text-white"></i>,
}) => {
  confirmDialog({
    accept,
    message: (
      <>
        <div className="flex flex-column align-items-center p-5 surface-overlay border-round">
          <div
            className={`border-circle bg-primary inline-flex justify-content-center align-items-center h-6rem w-6rem -mt-8`}
          >
            {icon}
          </div>
          <span className="font-bold text-2xl block mb-2 mt-4">{header}</span>
          <p className="mb-0 text-md text-center">{message}</p>
        </div>
      </>
    ),
    pt: {
      header: {
        className: "hidden",
      },
      content: {
        className: "p-0 rounded",
      },
      footer: {
        className: "[&>*:first-child]:hidden pb-4 pt-2 ",
      },
      root: {
        className: "w-25rem",
      },
    },
    acceptLabel,
  })
}

export const displayYesNoDialog = ({
  accept = () => null,
  reject = () => null,
  acceptLabel = "Yes",
  rejectLabel = "No",
  header = "Confirmation",
  message = "",
  icon = <i className="pi pi-question text-5xl text-white"></i>,
  acceptClassName,
  rejectClassName,
  iconContainerClassName = "",
  severity = "success",
  position,
  defaultFocus = "accept",
}) => {
  if (severity === SEVERITIES.SECONDARY) {
    iconContainerClassName += " bg-secondary"
    acceptClassName += " p-button-secondary"
    rejectClassName += " p-button-secondary"
  }
  if (severity === SEVERITIES.DANGER) {
    iconContainerClassName += " bg-red-500"
    acceptClassName += " p-button-danger"
    rejectClassName += " p-button-danger"
  }
  if (severity === SEVERITIES.WARNING) {
    iconContainerClassName += " bg-warning"
    acceptClassName += " p-button-warning"
    rejectClassName += " p-button-warning"
  }
  if (severity === SEVERITIES.HELP) {
    iconContainerClassName += " bg-help"
    acceptClassName += " p-button-help"
    rejectClassName += " p-button-help"
  }
  if (severity === SEVERITIES.INFO) {
    iconContainerClassName += " s-bg-info"
    acceptClassName += " p-button-info"
    rejectClassName += " p-button-info"
  }
  if (severity === SEVERITIES.PRIMARY) {
    iconContainerClassName += " bg-primary"
    acceptClassName += " p-button-primary"
    rejectClassName += " p-button-primary"
  }

  confirmDialog({
    accept,
    reject,
    position,
    defaultFocus,
    message: () => (
      <>
        <div className="flex flex-column align-items-center p-5 surface-overlay border-round">
          <div
            className={`border-circle text-white inline-flex justify-content-center align-items-center h-6rem w-6rem -mt-8 ${iconContainerClassName}`}
          >
            {icon}
          </div>
          <span className="font-bold text-2xl block mb-2 mt-4">{header}</span>
          <p className="mb-0 text-lg">{message}</p>
        </div>
      </>
    ),
    pt: {
      header: {
        className: "hidden",
      },
      content: {
        className:
          "p-0 flex align-items-center justify-content-center overflow-visible",
      },
      footer: {
        className:
          "flex aligm-items-center justify-content-between flex-row-reverse gap-2",
      },
      root: {
        className: "w-25rem",
      },
    },
    acceptClassName: `flex-1 ${acceptClassName}`,
    rejectClassName: `flex-1 p-button-outlined ${rejectClassName}`,
    acceptLabel,
    rejectLabel,
  })
}
