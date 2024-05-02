import { classNames } from "primereact/utils"
import { Password } from "primereact/password"
import { Controller } from "react-hook-form"

function CPassword({
  label = "",
  name,
  control,
  required,
  focusOptions,
  disabled = false,
  floatLabel = false,
  onChange,
  toggleMask = true,
  errorMessage = "This field is required!",
  ...options
}) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      render={({ field, fieldState }) => (
        <>
          <label htmlFor={field.name}>{label}</label>
          <span className={floatLabel ? "p-float-label" : ""}>
            <Password
              disabled={disabled}
              id={field.name}
              value={field.value}
              ref={field.ref}
              onChange={(e) => {
                field.onChange(e.target.value)
                if (onChange) {
                  onChange(e)
                }
              }}
              style={{
                width: "100%",
                backgroundColor: disabled ? "#dee2e6" : "white",
                color: "black",
              }}
              pt={{
                root: {
                  style: {
                    width: "100%",
                    padding: "0",
                    fontSize: ".9em",
                  },
                },
                input: {
                  style: {
                    width: "100%",
                  },
                },
              }}
              onKeyDown={(e) => {
                if (focusOptions) {
                  if (e.key === "Enter") {
                    focusOptions()
                  }
                }
              }}
              className={classNames({
                "p-invalid": fieldState.error,
              })}
              autoComplete="off"
              {...options}
              toggleMask={toggleMask}
            />
            <span className="text-danger text-sm">
              {fieldState.error ? errorMessage : ""}
            </span>
          </span>
        </>
      )}
    />
  )
}

export default CPassword
