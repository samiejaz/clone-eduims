import { InputSwitch } from "primereact/inputswitch";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { routes } from "../../utils/routes";
import TextInput from "../../components/Forms/TextInput";
import { classNames } from "primereact/utils";
import React from "react";

import UserRightsGroupedTable from "./UserRightsGroupedDatatable";

let detailTableName = "UserRightsDetail";
let cashDetailColor = "#22C55E";

const UserRightsInfo = () => {
  const method = useForm();

  return (
    <>
      <FormProvider {...method}>
        {/* <UserRightsDetailTable /> */}
        <UserRightsGroupedTable />
      </FormProvider>
    </>
  );
};

export default UserRightsInfo;

const UserRightsDetailTable = () => {
  const method = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control: method.control,
    name: detailTableName,
    rules: {
      required: true,
    },
  });

  return (
    <>
      <table className="table table-responsive mt-2">
        <thead>
          <tr>
            <th
              className="p-2 text-white text-center "
              style={{ width: "2%", background: cashDetailColor }}
            >
              Sr No.
            </th>
            <th
              className="p-2 text-white text-center "
              style={{ width: "5%", background: cashDetailColor }}
            >
              Form
            </th>

            <th
              className="p-2 text-white text-center "
              style={{ width: "4%", background: cashDetailColor }}
            >
              Allow Delete
            </th>

            <th
              className="p-2 text-white text-center "
              style={{ width: "4%", background: cashDetailColor }}
            >
              Allow Edit
            </th>

            <th
              className="p-2 text-white text-center "
              style={{ width: "10%", background: cashDetailColor }}
            >
              Allow New
            </th>
            <th
              className="p-2 text-white text-center "
              style={{ width: "10%", background: cashDetailColor }}
            >
              Allow Print
            </th>
            <th
              className="p-2 text-white text-center "
              style={{ width: "4%", background: cashDetailColor }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <FormProvider {...method}>
            {/* {fields.map((item, index) => {
              return (
                <UserRightDetailTableRow
                  key={item.id}
                  item={item}
                  index={index}
                />
              );
            })} */}
            {routes.map((item, index) => {
              return (
                <UserRightDetailTableRow
                  key={item.id}
                  item={item}
                  index={index}
                />
              );
            })}
          </FormProvider>
        </tbody>
      </table>
    </>
  );
};

const UserRightDetailTableRow = ({ index, item, disable = false }) => {
  const method = useFormContext();

  return (
    <tr id={item.id}>
      <td>
        <input
          id={"RowID_" + index}
          readOnly
          className="form-control"
          style={{ padding: "0.25rem 0.4rem", fontSize: "0.9em" }}
          value={index + 1}
          disabled={disable}
        />
      </td>
      <td>
        <TextInput
          control={method.control}
          ID={`${detailTableName}.${index}.FormName`}
        />
      </td>
      <td>
        <Controller
          control={method.control}
          name={`${detailTableName}.${index}.RoleDelete`}
          render={({ field, fieldState }) => (
            <>
              <InputSwitch
                inputId={field.name}
                checked={field.value}
                inputRef={field.ref}
                disabled={disable}
                className={classNames({ "p-invalid": fieldState.error })}
                onChange={(e) => {
                  field.onChange(e.value);
                }}
              />
            </>
          )}
        />
      </td>
      <td>
        <Controller
          control={method.control}
          name={`${detailTableName}.${index}.RoleEdit`}
          render={({ field, fieldState }) => (
            <>
              <InputSwitch
                inputId={field.name}
                checked={field.value}
                inputRef={field.ref}
                disabled={disable}
                className={classNames({ "p-invalid": fieldState.error })}
                onChange={(e) => {
                  field.onChange(e.value);
                }}
              />
            </>
          )}
        />
      </td>
      <td>
        <Controller
          control={method.control}
          name={`${detailTableName}.${index}.RoleNew`}
          render={({ field, fieldState }) => (
            <>
              <InputSwitch
                inputId={field.name}
                checked={field.value}
                inputRef={field.ref}
                disabled={disable}
                className={classNames({ "p-invalid": fieldState.error })}
                onChange={(e) => {
                  field.onChange(e.value);
                }}
              />
            </>
          )}
        />
      </td>
      <td>
        <Controller
          control={method.control}
          name={`${detailTableName}.${index}.RolePrint`}
          render={({ field, fieldState }) => (
            <>
              <InputSwitch
                inputId={field.name}
                checked={field.value}
                inputRef={field.ref}
                disabled={disable}
                className={classNames({ "p-invalid": fieldState.error })}
                onChange={(e) => {
                  field.onChange(e.value);
                }}
              />
            </>
          )}
        />
      </td>
      <td></td>
    </tr>
  );
};
