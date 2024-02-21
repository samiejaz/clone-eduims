import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { useEffect } from "react";
import { Controller } from "react-hook-form";

function CNumberInput({
  name,
  control,
  required = false,
  disabled = false,
  onChange,
  focusOptions,
  keyFilter = "num",
  ...props
}) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      render={({ field, fieldState }) => (
        <>
          <InputText
            disabled={disabled}
            id={field.name}
            value={field.value}
            ref={field.ref}
            onChange={(e) => {
              field.onChange(e.target.value);
              if (onChange) {
                onChange(e);
              }
            }}
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
            className={classNames({
              "p-invalid": fieldState.error,
            })}
            keyfilter={keyFilter}
            {...props}
          />
        </>
      )}
    />
  );
}

export default CNumberInput;
