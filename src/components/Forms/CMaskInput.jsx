import React from "react";
import { Controller } from "react-hook-form";
import { InputMask } from "primereact/inputmask";
import { classNames } from "primereact/utils";

const CMaskInput = ({
  control,
  name,
  mask = "",
  placeholder = "",
  focusOptions,
  onChange,
  disabled = false,
  ...options
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: "Phone is required." }}
      render={({ field, fieldState }) => (
        <>
          <InputMask
            id={field.name}
            value={field.value}
            className={classNames({ "p-invalid": fieldState.error })}
            onChange={(e) => {
              field.onChange(e.target.value);

              if (onChange) {
                onChange(e);
              }
            }}
            mask={mask}
            disabled={disabled}
            placeholder={placeholder}
            style={{
              width: "100%",
              backgroundColor: disabled ? "#dee2e6" : "white",
              color: "black",
            }}
            pt={{
              root: { style: { padding: "0.3rem 0.4rem", fontSize: ".9em" } },
            }}
            onKeyDown={(e) => {
              if (focusOptions) {
                if (e.key === "Enter") {
                  focusOptions();
                }
              }
            }}
            {...options}
          />
        </>
      )}
    />
  );
};

export default CMaskInput;
