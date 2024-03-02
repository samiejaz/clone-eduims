import React from "react";

export const FormRow = ({ children }) => {
  return <div className="grid">{children}</div>;
};

export const FormColumn = ({
  children,
  className = "",
  xs = 12,
  sm = 12,
  md = 12,
  lg = 12,
  xl = 12,
}) => {
  const responsiveClass = `col-${xs} sm:col-${sm} md:col-${md} lg:col-${lg} xl:col-${xl}`;
  const combinedClass = `${responsiveClass} ${className}`.trim();

  return <div className={combinedClass}>{children}</div>;
};

export const FormLabel = ({
  children,
  className = "font-semibold",
  labelFor = "",
}) => {
  return (
    <label
      className={className}
      htmlFor={labelFor === "" ? children : labelFor}
      id={labelFor === "" ? children : labelFor + "_label"}
    >
      {children}
    </label>
  );
};

export const FormField = ({
  col = "12",
  label = "",
  showSteric = false,
  inputTemplate,
}) => {
  return (
    <>
      <FormColumn className={`col-${col}`}>
        <FormLabel>
          {label}
          {showSteric && (
            <>
              <span className="text-danger fw-bold ">*</span>
            </>
          )}
        </FormLabel>
        {inputTemplate}
      </FormColumn>
    </>
  );
};
