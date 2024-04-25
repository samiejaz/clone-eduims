import { Button } from "primereact/button"
import React, { useRef } from "react"

const ImageContainer = ({ imageRef, hideButtons = false }) => {
  const imputRef = useRef()

  async function previewImage(e) {
    const reader = new FileReader()
    reader.addEventListener("load", () => {
      let base64Data
      if (reader.result.includes("data:image/png;base64,")) {
        base64Data = reader.result.replace(/^data:image\/png;base64,/, "")
      } else {
        base64Data = reader.result.replace(/^data:image\/jpeg;base64,/, "")
      }
      imageRef.current.src = "data:image/png;base64," + base64Data
    })
    reader.readAsDataURL(e.target.files[0])
  }

  return (
    <div
      style={{
        padding: "0",
        width: "100%",
        margin: "0px 10px",
      }}
    >
      {!hideButtons && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: ".5rem",
            }}
          >
            <Button
              icon="pi pi-plus"
              rounded
              tooltip="Choose"
              severity="primary"
              aria-label="Choose"
              style={{ borderRadius: "50%" }}
              outlined
              text
              type="button"
              onClick={() => {
                imputRef.current.click()
              }}
            />

            <input
              type="file"
              hidden
              ref={imputRef}
              accept="image/*"
              onChange={previewImage}
            />
            <Button
              icon="pi pi-trash"
              rounded
              tooltip="Remove"
              severity="danger"
              aria-label="Remove"
              style={{ borderRadius: "50%", padding: "0" }}
              outlined
              text
              type="button"
              onClick={() => {
                imputRef.current.value = ""
                imageRef.current.src = ""
              }}
            />
          </div>
        </>
      )}

      <div
        style={{
          padding: "2rem",
        }}
      >
        <div>
          <img
            style={{
              width: "30%",
              height: "30%",
              display: "block",
              objectFit: "cover",
            }}
            ref={imageRef}
            src=""
            alt="Logo"
          />
        </div>
      </div>
    </div>
  )
}

export default React.memo(ImageContainer)
