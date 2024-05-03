import { InputTextarea } from "primereact/inputtextarea"
import { classNames } from "primereact/utils"
import React from "react"
import { Controller } from "react-hook-form"

const CTextArea = ({
  name,
  control,
  required,
  rows = 1,
  cols = 1,
  autoResize = false,
  disabled = false,
  ...options
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      render={({ field, fieldState }) => (
        <>
          <InputTextarea
            id={field.name}
            {...field}
            rows={rows}
            style={{
              width: "100%",
              backgroundColor: disabled ? "#dee2e6" : "white",
              color: "black",
            }}
            className={classNames({ "p-invalid": fieldState.error })}
            autoResize={autoResize}
            disabled={disabled}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                const start = e.target.selectionStart
                const end = e.target.selectionEnd
                const newText =
                  e.target.value.substring(0, start) +
                  "\n" +
                  e.target.value.substring(end)
                e.target.value = newText
                e.target.selectionStart = e.target.selectionEnd = start + 1
              }
            }}
            {...options}
          />
        </>
      )}
    />
  )
}

export default CTextArea
