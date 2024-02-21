import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import React from "react";
import { Controller } from "react-hook-form";

const CTextArea = ({
  name,
  control,
  required,
  rows = 1,
  cols = 1,
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
            style={{ width: "100%" }}
            className={classNames({ "p-invalid": fieldState.error })}
            {...options}
          />
        </>
      )}
    />
  );
};

export default CTextArea;
