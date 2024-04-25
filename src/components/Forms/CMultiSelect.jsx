import { MultiSelect } from "primereact/multiselect"
import { classNames } from "primereact/utils"
import React from "react"
import { Controller } from "react-hook-form"

const CMultiSelect = ({
  control,
  name = "",
  options = [],
  optionLabel,
  optionValue,
  disabled,
  focus,
  display = "chip",
  filter = true,
  placeholder = "",
  required = false,
  errorMessage = "This field is required!",
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      render={({ field, fieldState }) => (
        <>
          <MultiSelect
            value={field.value}
            options={options}
            onChange={(e) => {
              field.onChange(e.value)
            }}
            optionLabel={optionLabel}
            optionValue={optionValue}
            placeholder={placeholder}
            display="chip"
            filter={filter}
            showClear
            className={classNames({
              "p-invalid": fieldState.error,
            })}
            virtualScrollerOptions={{ itemSize: 43 }}
            disabled={disabled}
            style={{ fontSize: "0.9em", width: "100%" }}
            pt={{
              label: {
                className: "gap-2",
                style: { padding: "0.25rem 0.4rem" },
              },
              headerCheckbox: {
                root: {
                  style: { display: "none" },
                },
              },
            }}
            //  emptyMessage="No data found!"
          />
          <span className="text-danger text-sm">
            {fieldState.error ? errorMessage : ""}
          </span>
        </>
      )}
    />
  )
}

export default CMultiSelect
