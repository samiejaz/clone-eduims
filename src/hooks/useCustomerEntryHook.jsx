import { useContext, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { ButtonGroup } from "react-bootstrap";
import CustomerEntry from "../components/CustomerEntryModal/CustomerEntry";
import CustomerBranchEntry from "../components/CustomerEntryModal/CustomerBranchEntry";

import { Controller, FormProvider, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { AppConfigurationContext } from "../context/AppConfigurationContext";
import { Dropdown } from "primereact/dropdown";
import { useOldCustomerSelectData } from "./SelectData/useSelectData";

const customerEntryDefaultValues = {
  CustomerName: "",
  CustomerBusinessName: "",
  CustomerBusinessAddress: "",
  ContactPerson1Name: "",
  ContactPerson1Email: "",
  ContactPerson1No: "",
  Description: "",
  InActive: false,
  Customers: null,
};

const customerBranchDefaultValues = {
  CustomerBranchTitle: "",
  Customers: [],
  BranchAddress: "",
  BranchCode: "",
  ContactPersonName: "",
  ContactPersonNo: "",
  ContactPersonEmail: "",
  Description: "",
  InActive: false,
};
const customerAccountDefaultValues = {
  accountsDetail: [],
};

const apiUrl = import.meta.env.VITE_APP_API_URL;
const useCustomerEntryHook = () => {
  const queryClient = useQueryClient();
  const { user } = useContext(AuthContext);
  const { pageTitles } = useContext(AppConfigurationContext);
  const [visible, setVisible] = useState(false);
  const [CustomerID, setCustomerID] = useState(0);
  const [dialogIndex, setDialogIndex] = useState(0);

  const oldCustomers = useOldCustomerSelectData();
  const customerEntryFrom = useForm({
    defaultValues: customerEntryDefaultValues,
  });
  const customerAccountsForm = useForm({
    defaultValues: customerAccountDefaultValues,
  });

  const customerBranchFrom = useForm(customerBranchDefaultValues);
  let customerMutaion = useMutation({
    mutationFn: async (formData) => {
      let DataToSend = {
        CustomerID: CustomerID ?? 0,
        ContactPerson1Email: formData?.ContactPerson1Email,
        ContactPerson1Name: formData?.ContactPerson1Name,
        ContactPerson1No: formData?.ContactPerson1No,
        CustomerBusinessAddress: formData?.CustomerBusinessAddress,
        CustomerBusinessName: formData.CustomerBusinessName,
        CustomerName: formData.CustomerName,
        Description: formData?.Description,
        InActive: formData?.InActive === false ? 0 : 1,
        EntryUserID: user.userID,
      };

      const { data } = await axios.post(
        apiUrl + "/EduIMS/NewCustomerInsert",
        DataToSend
      );

      if (data.success === true) {
        setCustomerID(data.CustomerID);
        if (CustomerID) {
          toast.success("Customer updated successfully!");
        } else {
          toast.success("Customer saved successfully!");
        }
        setDialogIndex(dialogIndex + 1);
      } else {
        toast.error(data.message, {
          autoClose: 1500,
        });
      }
    },
    onError: () => {
      toast.error("Error while saving data!");
    },
  });

  function customerHandleSubmit(data) {
    customerMutaion.mutate(data);
  }

  function handleCancelClick() {
    queryClient.invalidateQueries({ queryKey: ["Customers"] });
    queryClient.invalidateQueries({ queryKey: ["oldcustomers"] });
    setDialogIndex(0);
    setCustomerID(0);
    customerEntryFrom.reset(customerEntryDefaultValues);
    customerBranchFrom.reset(customerBranchDefaultValues);
    customerAccountsForm.reset(customerAccountsForm);
  }

  const dialogs = [
    {
      header: "Customer Entry",
      content: (
        <>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h6>
                {CustomerID === 0
                  ? "Add New Customer"
                  : "Update the selected customer"}
              </h6>
            </div>
            <Controller
              name="Customers"
              control={customerEntryFrom.control}
              render={({ field }) => (
                <Dropdown
                  id={field.name}
                  value={field.value}
                  optionValue="CustomerID"
                  optionLabel="CustomerName"
                  placeholder="Select a customer"
                  options={oldCustomers.data}
                  focusInputRef={field.ref}
                  onChange={(e) => {
                    field.onChange(e.value);

                    if (e.value === undefined) {
                      customerEntryFrom.reset();
                      setCustomerID(0);
                    } else {
                      setCustomerID(e.value);
                    }
                  }}
                  style={{ width: "49.2%" }}
                  filter
                  showClear
                />
              )}
            />
          </div>
          <FormProvider {...customerEntryFrom}>
            <CustomerEntry CustomerID={CustomerID} />
          </FormProvider>
        </>
      ),
    },
    {
      header: `${pageTitles?.branch || "Customer Branch"} Entry`,
      content: (
        <>
          <FormProvider {...customerBranchFrom}>
            <CustomerBranchEntry CustomerID={CustomerID} />
          </FormProvider>
        </>
      ),
    },
  ];

  const footerContent = (
    <ButtonGroup className="gap-1">
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={() => {
          setVisible(false);
          handleCancelClick();
        }}
        className="p-button-text text-center"
      />

      {dialogIndex === 0 ? (
        <>
          <Button
            label={"Save & Go"}
            type={"button"}
            icon="pi pi-arrow-right"
            onClick={() => {
              if (dialogIndex === 0) {
                customerEntryFrom.handleSubmit(customerHandleSubmit)();
              }
            }}
            loading={customerMutaion.isPending}
            className="p-button-p text-center"
            disabled={dialogIndex === dialogs.length - 1}
          />
        </>
      ) : (
        <>
          <Button
            label={dialogs[dialogIndex - 1]?.header}
            icon="pi pi-arrow-left"
            onClick={() => {
              if (dialogIndex > 0) {
                setDialogIndex(dialogIndex - 1);
              }
            }}
            disabled={dialogIndex === 0}
            className="p-button-p text-center"
          />
        </>
      )}
    </ButtonGroup>
  );

  function dialogHeight() {
    switch (dialogIndex) {
      case 0:
        return "70vh";
      case 1:
        return "80vh";
      default:
        return "90vh";
    }
  }

  return {
    setVisible,
    render: (
      <>
        <Dialog
          header={dialogs[dialogIndex].header}
          visible={visible}
          maximizable
          style={{ width: "80vw", height: dialogHeight() }}
          onHide={() => {
            setVisible(false);
            queryClient.invalidateQueries({ queryKey: ["Customers"] });
            queryClient.invalidateQueries({ queryKey: ["oldcustomers"] });
          }}
          footer={footerContent}
        >
          {dialogs[dialogIndex].content}
        </Dialog>
      </>
    ),
  };
};

export default useCustomerEntryHook;
