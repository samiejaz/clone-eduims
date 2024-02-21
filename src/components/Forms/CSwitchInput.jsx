import { InputSwitch } from "primereact/inputswitch";
import { classNames } from "primereact/utils";
import React from "react";
import { Controller } from "react-hook-form";

const CSwitchInput = React.forwardRef(
  (
    {
      control,
      name,
      required = false,
      disabled = false,
      focusOptions,
      onChange,
    },
    ref
  ) => {
    return (
      <>
        <Controller
          name={name}
          control={control}
          rules={{ required }}
          render={({ field, fieldState }) => (
            <>
              <InputSwitch
                inputId={field.name}
                checked={field.value}
                inputRef={ref}
                disabled={disabled}
                className={classNames({ "p-invalid": fieldState.error })}
                onChange={(e) => {
                  field.onChange(e.value);

                  if (onChange) {
                    onChange(e);
                  }
                }}
              />
            </>
          )}
        />
      </>
    );
  }
);

export default CSwitchInput;
