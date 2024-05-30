import { Checkbox } from "primereact/checkbox"
import React from "react"
import { Controller } from "react-hook-form"

const CheckBox = ({
  ID,
  Label,
  isEnable,
  control,
  onChange,
  containerClassName = "",
}) => {
  return (
    <Controller
      name={ID}
      control={control}
      render={({ field }) => (
        <>
          <div
            className={
              `flex align-items-center justify-content-start ` +
              containerClassName
            }
          >
            <Checkbox
              disabled={!isEnable}
              inputId={field.name}
              checked={field.value}
              inputRef={field.ref}
              onChange={(e) => {
                field.onChange(e.checked)
                if (onChange) {
                  onChange(e)
                }
              }}
            />
            <label htmlFor={field.name} style={{ marginLeft: "5px" }}>
              {Label}
            </label>
          </div>
        </>
      )}
    />
  )
}

export default CheckBox
