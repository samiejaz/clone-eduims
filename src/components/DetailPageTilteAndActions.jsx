import { Button } from "primereact/button"
import React from "react"

const DetailPageTilteAndActions = ({
  showAddNewButton = true,
  onAddNewClick = () => null,
  title = "",
  buttonLabel = "",
}) => {
  return (
    <div className="flex align-items-center justify-content-start gap-2 mb-4 flex-wrap">
      <h2 className="m-0">{title}</h2>
      <div>
        {showAddNewButton && (
          <>
            <Button
              label={buttonLabel}
              icon="pi pi-plus"
              type="button"
              className="rounded"
              onClick={onAddNewClick}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default DetailPageTilteAndActions
