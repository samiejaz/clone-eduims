import React, { useEffect } from "react";
import { Dialog } from "primereact/dialog";
import ModalActionButtons from "../ModalActionButtons";
import { Controller } from "react-hook-form";
import ReactDatePicker from "react-datepicker";
import { Button } from "primereact/button";
import NumberInput from "../Forms/NumberInput";
import { toast } from "react-toastify";

function CustomerInvoiceIntallmentsModal({
  visible,
  setVisible,
  handleClose,
  installmentsFieldArray,
  method,
  isEnable,
}) {
  useEffect(() => {
    method.setValue("InstallmentTotalRemaining", method.watch(`Total_Amount`));
  }, [method.watch(`Total_Amount`)]);

  useEffect(() => {
    handleNetAmountTotal();
  }, [
    installmentsFieldArray.fields,
    installmentsFieldArray.append,
    installmentsFieldArray.remove,
  ]);

  function handleNetAmountTotal() {
    let remainingAmountSum = 0;
    let TotalNetAmount = method.getValues(`Total_Amount`) || 0;
    installmentsFieldArray.fields.forEach((item, index) => {
      const amount = parseFloat(
        method.getValues(`installments.${index}.Amount`) || 0
      );
      remainingAmountSum += amount;
    });
    method.setValue(
      "InstallmentTotalRemaining",
      TotalNetAmount - remainingAmountSum
    );
  }

  function handleSaveClick() {
    let InstallmentTotalRemaining = method.getValues(
      "InstallmentTotalRemaining"
    );
    if (InstallmentTotalRemaining === 0) {
      setVisible(false);
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
        onHide={() => handleClose()}
        footer={
          <>
            <div>
              <ModalActionButtons
                saveLabel="Save Installments"
                cancelLabel="Cancel"
                handleCancelClick={handleClose}
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
            disabled={
              !isEnable || method.watch("InstallmentTotalRemaining") === 0
            }
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
                  value={method.watch("Total_Amount")}
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
                      <Controller
                        control={method.control}
                        name={`installments.${index}.IDate`}
                        render={({ field }) => (
                          <ReactDatePicker
                            placeholderText="Select installment date"
                            onChange={(date) => field.onChange(date)}
                            selected={field.value || new Date()}
                            dateFormat={"dd-MMM-yyyy"}
                            className="binput"
                            disabled={!isEnable}
                          />
                        )}
                      />
                    </div>
                    <div style={{ width: "100%" }}>
                      <NumberInput
                        control={method.control}
                        id={`installments.${index}.Amount`}
                        required={true}
                        style={{ width: "100%" }}
                        onChange={(e) => {
                          method.setValue(
                            `installments.${index}.Amount`,
                            e.value
                          );
                          handleNetAmountTotal();
                        }}
                        prefix="Rs "
                        rules={{
                          required: true,
                        }}
                        min={1}
                        mode="decimal"
                        useGrouping={false}
                        disabled={!isEnable}
                      />
                    </div>
                    <div style={{ display: "flex", gap: 2 }}>
                      <Button
                        icon="pi pi-plus"
                        severity="success"
                        style={{ borderRadius: "10px" }}
                        type="button"
                        disabled={
                          !isEnable ||
                          method.watch("InstallmentTotalRemaining") === 0
                        }
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
                        disabled={!isEnable}
                        onClick={() => installmentsFieldArray.remove(index)}
                      />
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </Dialog>
    </>
  );
}

export default CustomerInvoiceIntallmentsModal;
