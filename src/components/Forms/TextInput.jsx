import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { Controller } from "react-hook-form";

function TextInput({
  Label = "",
  ID,
  control,
  required,
  focusOptions,
  isEnable = true,
  floatLabel = false,
  onChange,
  ...options
}) {
  return (
    <Controller
      name={ID}
      control={control}
      rules={{ required }}
      render={({ field, fieldState }) => (
        <>
          <label htmlFor={field.name}>{Label}</label>
          <span className={floatLabel ? "p-float-label" : ""}>
            <InputText
              disabled={!isEnable}
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
                backgroundColor: isEnable === false ? "#dee2e6" : "white",
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
              autoComplete="off"
              {...options}
            />
          </span>
        </>
      )}
    />
  );
}

export default TextInput;
