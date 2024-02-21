import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import ModalActionButtons from "../ModalActionButtons";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import ReactDatePicker from "react-datepicker";
import { Button } from "primereact/button";
import NumberInput from "../Forms/NumberInput";
import { toast } from "react-toastify";
import CDatePicker from "../Forms/CDatePicker";

const NewCustomerInvoiceIntallmentsModal = React.forwardRef(({ mode }, ref) => {
  const [visible, setVisible] = useState(false);

  React.useImperativeHandle(ref, () => ({
    openDialog(val) {
      setVisible(val);
    },
  }));

  const method = useFormContext();

  const installmentsFieldArray = useFieldArray({
    control: method.control,
    name: "installments",
  });

  async function handleSaveClick() {
    let InstallmentTotalRemaining = method.getValues(
      "InstallmentTotalRemaining"
    );
    if (InstallmentTotalRemaining === 0) {
      if (!method.formState.errors?.installments) {
        setVisible(false);
      }
    } else if (InstallmentTotalRemaining > 0) {
      toast.error("Installment Amounts must be equal to Total Net Amount", {
        position: "top-right",
      });
    } else {
      toast.error("Installment Amounts cannot exceed Total Net Amount", {
        position: "top-right",
      });
    }
  }

  return (
    <>
      <Dialog
        header={"Installments"}
        visible={visible}
        maximizable
        draggable={false}
        style={{ width: "80vw", height: "80vh" }}
        onHide={() => {
          setVisible(false);
          if (mode === "new") {
            method.resetField("installments");
          }
        }}
        footer={
          <>
            <div>
              <ModalActionButtons
                saveLabel="Save Installments"
                cancelLabel="Cancel"
                handleCancelClick={() => {
                  setVisible(false);
                  method.resetField("installments");
                }}
                handleSaveClick={handleSaveClick}
              />
            </div>
          </>
        }
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            label="Add Installment"
            type="button"
            onClick={() => installmentsFieldArray.append({ Amount: 0 })}
            disabled={mode === "view"}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div>
                <h6 style={{ marginRight: "4px" }}>Total Net Amount: </h6>
              </div>
              <div>
                <NumberInput
                  id={"InstallmentTotalAmount"}
                  control={method.control}
                  disabled={true}
                  prefix="Rs "
                  mode="decimal"
                  useGrouping={false}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <h6 style={{ marginRight: "4px" }}>Remaining Net Amount: </h6>
              <NumberInput
                id={"InstallmentTotalRemaining"}
                control={method.control}
                disabled={true}
                prefix="Rs "
                mode="decimal"
                useGrouping={false}
              />
            </div>
          </div>
        </div>
        <div style={{ marginTop: "20px" }}>
          {installmentsFieldArray.fields.map((item, index) => {
            return (
              <React.Fragment key={item.id}>
                <div key={item.id}>
                  <div
                    className="flex"
                    style={{ marginBottom: "10px", gap: 2 }}
                  >
                    <div style={{ width: "100%" }}>
                      {/* <Controller
                        control={method.control}
                        name={`installments.${index}.IDate`}
                        render={({ field }) => (
                          <ReactDatePicker
                            placeholderText="Select installment date"
                            onChange={(date) => field.onChange(date)}
                            selected={field.value || new Date()}
                            dateFormat={"dd-MMM-yyyy"}
                            className="binput"
                            disabled={mode === "view"}
                          />
                        )}
                      /> */}
                      <CDatePicker
                        control={method.control}
                        name={`installments.${index}.IDate`}
                        disabled={mode === "view"}
                        required={true}
                      />
                    </div>
                    <div style={{ width: "100%" }}>
                      <NumberInput
                        control={method.control}
                        id={`installments.${index}.Amount`}
                        required={true}
                        style={{ width: "100%" }}
                        prefix="Rs "
                        min={1}
                        mode="decimal"
                        useGrouping={false}
                        disabled={mode === "view"}
                      />
                    </div>
                    <div style={{ display: "flex", gap: 2 }}>
                      <Button
                        icon="pi pi-plus"
                        severity="success"
                        style={{ borderRadius: "10px" }}
                        type="button"
                        disabled={mode === "view"}
                        onClick={() =>
                          installmentsFieldArray.append({
                            Amount: 0,
                          })
                        }
                      />
                      <Button
                        icon="pi pi-minus"
                        severity="danger"
                        style={{ borderRadius: "10px" }}
                        type="button"
                        disabled={mode === "view"}
                        onClick={() => installmentsFieldArray.remove(index)}
                      />
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
        <FormProvider {...method}>
          <CalculateInstallmentTotal />
        </FormProvider>
      </Dialog>
    </>
  );
});

function CalculateInstallmentTotal() {
  const method = useFormContext();

  const details = useWatch({
    control: method.control,
    name: "installments",
  });

  useEffect(() => {
    calculateTotal(details);
  }, [details]);

  function calculateTotal(details = []) {
    let totalInstallment = parseFloat(0 + method.getValues("TotalNetAmount"));
    let totalRemainingInstallment = 0;

    if (details?.length > 0) {
      details.forEach((item, index) => {
        const amount = parseFloat(item.Amount || 0);
        totalRemainingInstallment += amount;
      });
      method.setValue("InstallmentTotalAmount", totalInstallment);
      method.setValue(
        "InstallmentTotalRemaining",
        totalInstallment - totalRemainingInstallment
      );
    } else {
      method.setValue("InstallmentTotalAmount", totalInstallment);
      method.setValue("InstallmentTotalRemaining", totalInstallment);
    }
  }

  return null;
}

export default NewCustomerInvoiceIntallmentsModal;
