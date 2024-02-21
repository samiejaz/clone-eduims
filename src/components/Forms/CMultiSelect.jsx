import { MultiSelect } from "primereact/multiselect";
import React from "react";
import { Controller } from "react-hook-form";

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
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <MultiSelect
          value={field.value}
          options={options}
          onChange={(e) => {
            field.onChange(e.value);
          }}
          optionLabel={optionLabel}
          optionValue={optionValue}
          placeholder={placeholder}
          display="chip"
          filter={filter}
          showClear
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
        />
      )}
    />
  );
};

export default CMultiSelect;
