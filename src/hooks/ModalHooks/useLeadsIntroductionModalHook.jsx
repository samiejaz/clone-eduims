import React, { useEffect, useState } from "react"
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form"
import {
  useAllBusinessNatureSelectData,
  useAllBusinessTypesSelectData,
  useAllCountiesSelectData,
  useAllLeadsSouceSelectData,
  useAllTehsilsSelectData,
} from "../SelectData/useSelectData"
import CDropdown from "../../components/Forms/CDropdown"
import CheckBox from "../../components/Forms/CheckBox"
import TextInput from "../../components/Forms/TextInput"
import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import { AutoComplete } from "primereact/autocomplete"
import { classNames } from "primereact/utils"
import { fetchDemonstrationLeadsDataByID } from "../../api/LeadIntroductionData"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "../../utils/enums"
import { useUserData } from "../../context/AuthContext"
import { Dropdown } from "primereact/dropdown"
import { CMaskInputField } from "../../components/Forms/form"
import {
  FormRow,
  FormColumn,
  FormLabel,
} from "../../components/Layout/LayoutComponents"
import { decryptID } from "../../utils/crypto"
import { formatDateAndTime } from "../../utils/CommonFunctions"
import { InputTextarea } from "primereact/inputtextarea"
import CountryDependentFields from "../../components/CommonFormFields/CountryDependantFields"

export const useLeadsIntroductionModalHook = (LeadIntroductionDetailID = 0) => {
  const queryClient = useQueryClient()
  const user = useUserData()

  const [visible, setVisible] = useState(false)
  const LeadIntroductionData = useQuery({
    queryKey: [QUERY_KEYS.LEADS_DEMO_DATA, LeadIntroductionDetailID],
    queryFn: () =>
      fetchDemonstrationLeadsDataByID({
        UserID: user.userID,
        DepartmentID: user.DepartmentID,
        LeadIntroductionDetailID: decryptID(LeadIntroductionDetailID),
      }),

    enabled: LeadIntroductionDetailID !== 0,
    initialData: [],
  })

  const dialogContent = (
    <>
      <FormRow>
        <FormColumn lg={3} xl={3} md={6}>
          <FormLabel>Name of firm</FormLabel>
          <div>
            <input
              type="text"
              className="form-control"
              id="CompanyName"
              value={LeadIntroductionData.data[0]?.CompanyName || ""}
              disabled
            />
          </div>
        </FormColumn>
        <FormColumn lg={3} xl={3} md={6}>
          <FormLabel>Country</FormLabel>
          <div>
            <input
              type="text"
              id="CountryID"
              className="form-control"
              value={LeadIntroductionData.data[0]?.CountryTitle || ""}
              disabled
            />
          </div>
        </FormColumn>
        <FormColumn lg={3} xl={3} md={6}>
          <FormLabel>Tehsil</FormLabel>
          <div>
            <input
              type="text"
              id="TehsilID"
              className="form-control"
              value={LeadIntroductionData.data[0]?.TehsilTitle || ""}
              disabled
            />
          </div>
        </FormColumn>
        <FormColumn lg={3} xl={3} md={6}>
          <FormLabel>Business Type</FormLabel>
          <div>
            <input
              type="text"
              id="BusinessTypeID"
              className="form-control"
              value={LeadIntroductionData.data[0]?.BusinessTypeTitle || ""}
              disabled
            />
          </div>
        </FormColumn>
      </FormRow>
      <FormRow>
        <FormColumn lg={3} xl={3} md={6}>
          <FormLabel>Business Nature</FormLabel>
          <div>
            <input
              type="text"
              id="BusinessNatureID"
              className="form-control"
              value={LeadIntroductionData.data[0]?.BusinessNature || ""}
              disabled
            />
          </div>
        </FormColumn>

        <FormColumn lg={3} xl={3} md={6}>
          <FormLabel>Company Website</FormLabel>
          <div>
            <input
              type="text"
              id="CompanyWebsite"
              className="form-control"
              value={LeadIntroductionData.data[0]?.CompanyWebsite || ""}
              disabled
            />
          </div>
        </FormColumn>
        <FormColumn lg={3} xl={3} md={6}>
          <FormLabel>Contact Person Name</FormLabel>
          <div>
            <input
              type="text"
              id="ContactPersonName"
              className="form-control"
              value={LeadIntroductionData.data[0]?.ContactPersonName || ""}
              disabled
            />
          </div>
        </FormColumn>
        <FormColumn lg={3} xl={3} md={6}>
          <FormLabel>Contact Person Mobile No</FormLabel>
          <div>
            <input
              type="text"
              id="ContactPersonMobileNo"
              className="form-control"
              value={LeadIntroductionData.data[0]?.ContactPersonMobileNo || ""}
              disabled
            />
          </div>
        </FormColumn>
      </FormRow>
      <FormRow>
        <FormColumn lg={4} xl={4} md={6}>
          <FormLabel>Contact Person Email</FormLabel>
          <div>
            <input
              type="text"
              id="ContactPersonEmail"
              className="form-control"
              value={LeadIntroductionData.data[0]?.ContactPersonEmail || ""}
              disabled
            />
          </div>
        </FormColumn>
        <FormColumn lg={4} xl={4} md={6}>
          <FormLabel>Contact Person Whatsapp No</FormLabel>
          <div>
            <input
              type="text"
              id="CompanyAddress"
              className="form-control"
              value={LeadIntroductionData.data[0]?.CompanyAddress || ""}
              disabled
            />
          </div>
        </FormColumn>

        <FormColumn lg={4} xl={4} md={6}>
          <FormLabel>Contact Person Whatsapp No</FormLabel>
          <div>
            <input
              type="text"
              id="ContactPersonWhatsAppNo"
              className="form-control"
              value={
                LeadIntroductionData.data[0]?.ContactPersonWhatsAppNo || ""
              }
              disabled
            />
          </div>
        </FormColumn>
      </FormRow>
      <FormRow>
        <FormColumn lg={12} xl={12} md={6}>
          <FormLabel>Requirements Detail</FormLabel>
          <input
            as={"textarea"}
            rows={1}
            disabled
            className="form-control"
            style={{
              padding: "0.3rem 0.4rem",
              fontSize: "0.8em",
            }}
            value={LeadIntroductionData.data[0]?.RequirementDetail || ""}
          />
        </FormColumn>
      </FormRow>
      <FormRow>
        <FormColumn lg={4} xl={4} md={6}>
          <FormLabel>Meeting Place</FormLabel>
          <div>
            <Dropdown
              options={[
                { label: "At Client Site", value: "AtClientSite" },
                { label: "At Office", value: "AtOffice" },
                { label: "Online", value: "Online" },
              ]}
              value={LeadIntroductionData.data[0]?.MeetingPlace}
              style={{ width: "100%", background: "#dee2e6", color: "black" }}
              disabled
              dropdownIcon={() => null}
            />
          </div>
        </FormColumn>
        <FormColumn lg={4} xl={4} md={6}>
          <FormLabel>Meeting Time</FormLabel>
          <div>
            <input
              type="text"
              id="MeetingTime"
              value={
                formatDateAndTime(LeadIntroductionData.data[0]?.MeetingTime) ||
                ""
              }
              disabled
              className="form-control"
            />
          </div>
        </FormColumn>
        <FormColumn lg={4} xl={4} md={6}>
          <FormLabel>Product</FormLabel>
          <div>
            <input
              type="text"
              id="Product"
              value={LeadIntroductionData.data[0]?.ProductInfoTitle || ""}
              disabled
              className="form-control"
            />
          </div>
        </FormColumn>
      </FormRow>
      <FormRow>
        <FormColumn lg={12} xl={12} md={6}>
          <FormLabel>Description</FormLabel>
          <div>
            <InputTextarea
              autoResize={true}
              name="Description"
              value={LeadIntroductionData.data[0]?.Description || ""}
              disabled
              style={{ width: "100%" }}
            />
          </div>
        </FormColumn>
      </FormRow>
    </>
  )

  const footerContent = <></>

  function onSubmit(data) {}

  return {
    setVisible,
    render: (
      <>
        <Dialog
          draggable={false}
          visible={visible}
          footer={footerContent}
          header="Leads Introduction"
          maximizable
          style={{ width: "80vw", height: "80vh" }}
          onHide={() => {
            setVisible(false)
            queryClient.invalidateQueries([
              QUERY_KEYS.LEAD_INTRODUCTION_QUERY_KEY,
            ])
            //TODO: Invalidate the query
          }}
        >
          {dialogContent}
        </Dialog>
      </>
    ),
  }
}
export function LeadsIntroductionFormComponent({
  mode = "",
  hideFieldsForDemo = false,
  countryRef,
}) {
  const [items, setItems] = useState([])

  const businessTypesSelectData = useAllBusinessTypesSelectData()
  const businessNatureSelectData = useAllBusinessNatureSelectData(true)
  const leadSourcesSelectData = useAllLeadsSouceSelectData()

  const method = useFormContext()

  const search = (event) => {
    let _filteredItems
    let query = event.query
    _filteredItems = businessNatureSelectData?.data.filter((item) => {
      return item.toLowerCase().includes(query.toLowerCase())
    })
    setItems(_filteredItems)
  }

  return (
    <>
      <form>
        <FormRow>
          <FormColumn lg={3} xl={3} md={6}>
            <FormLabel>
              Name of firm
              <span className="text-danger fw-bold ">*</span>
            </FormLabel>
            <div>
              <TextInput
                control={method.control}
                ID={"CompanyName"}
                required={true}
                focusOptions={() => method.setFocus("CountryID")}
                isEnable={mode !== "view"}
              />
            </div>
          </FormColumn>

          <FormProvider {...method}>
            <CountryDependentFields mode={mode} ref={countryRef} />
          </FormProvider>

          <FormColumn lg={3} xl={3} md={6}>
            <FormLabel>
              Business Type
              <span className="text-danger fw-bold ">*</span>
            </FormLabel>
            <div>
              <CDropdown
                control={method.control}
                name={`BusinessTypeID`}
                optionLabel="BusinessTypeTitle"
                optionValue="BusinessTypeID"
                placeholder="Select a business type"
                options={businessTypesSelectData.data}
                required={true}
                disabled={mode === "view"}
                focusOptions={() => method.setFocus("BusinessNatureID")}
              />
            </div>
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn lg={3} xl={3} md={6}>
            <FormLabel>
              Business Nature
              <span className="text-danger fw-bold ">*</span>
            </FormLabel>
            <div style={{ width: "100%" }}>
              <Controller
                name="BusinessNatureID"
                control={method.control}
                rules={{ required: true }}
                render={({ field, fieldState }) => (
                  <>
                    <AutoComplete
                      inputId={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      inputRef={field.ref}
                      suggestions={items}
                      completeMethod={search}
                      disabled={mode === "view"}
                      dropdown
                      style={{ width: "100%" }}
                      pt={{
                        dropdownButton: {
                          root: {
                            style: {
                              padding: "0 !important",
                            },
                          },
                          icon: {
                            style: {
                              padding: "0",
                            },
                          },
                        },
                        input: {
                          style: {
                            width: "100%",
                          },
                        },
                      }}
                      className={classNames({ "p-invalid": fieldState.error })}
                    />
                  </>
                )}
              />
            </div>
          </FormColumn>

          <FormColumn lg={3} xl={3} md={6}>
            <FormLabel>Company Website</FormLabel>
            <div>
              <TextInput
                control={method.control}
                ID={"CompanyWebsite"}
                focusOptions={() => method.setFocus("ContactPersonName")}
                isEnable={mode !== "view"}
              />
            </div>
          </FormColumn>
          <FormColumn lg={3} xl={3} md={6}>
            <FormLabel>
              Contact Person Name
              <span className="text-danger fw-bold ">*</span>
            </FormLabel>
            <div>
              <TextInput
                control={method.control}
                ID={"ContactPersonName"}
                required={true}
                focusOptions={() => method.setFocus("ContactPersonMobileNo")}
                isEnable={mode !== "view"}
              />
            </div>
          </FormColumn>
          <FormColumn lg={3} xl={3} md={6}>
            <FormLabel>
              Contact Person Mobile No
              <span className="text-danger fw-bold ">*</span>
            </FormLabel>
            <div>
              <TextInput
                control={method.control}
                ID={"ContactPersonMobileNo"}
                required={true}
                isEnable={mode !== "view"}
                focusOptions={() => method.setFocus("ContactPersonEmail")}
                onChange={(e) => {
                  if (method.watch("IsWANumberSameAsMobile")) {
                    method.setValue("ContactPersonWhatsAppNo", e.target.value)
                  }
                }}
              />
              {/* <CMaskInputField
                control={method.control}
                name={"ContactPersonMobileNo"}
                required={true}
                focusOptions={() => method.setFocus("ContactPersonEmail")}
                mask="9999-9999999"
                disabled={mode === "view"}
                onChange={(e) => {
                  if (method.watch("IsWANumberSameAsMobile")) {
                    method.setValue("ContactPersonWhatsAppNo", e.value);
                  }
                }}
              /> */}
            </div>
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn lg={3} xl={3} md={6}>
            <FormLabel>Contact Person Email</FormLabel>
            <div>
              <TextInput
                control={method.control}
                ID={"ContactPersonEmail"}
                focusOptions={() => method.setFocus("CompanyAddress")}
                isEnable={mode !== "view"}
              />
            </div>
          </FormColumn>
          <FormColumn lg={3} xl={3} md={6}>
            <FormLabel>
              Company Address
              <span className="text-danger fw-bold ">*</span>
            </FormLabel>
            <div>
              <TextInput
                control={method.control}
                ID={"CompanyAddress"}
                required={true}
                focusOptions={() => method.setFocus("ContactPersonWhatsAppNo")}
                isEnable={mode !== "view"}
              />
            </div>
          </FormColumn>

          <FormColumn lg={3} xl={3} md={6}>
            <FormLabel>Contact Person Whatsapp No</FormLabel>
            <div>
              {/* <CMaskInputField
                control={method.control}
                name={"ContactPersonWhatsAppNo"}
                required={true}
                disabled={
                  method.watch("IsWANumberSameAsMobile") || mode === "view"
                }
                focusOptions={() => method.setFocus("IsWANumberSameAsMobile")}
                mask="9999-9999999"
              /> */}
              <TextInput
                control={method.control}
                ID={"ContactPersonWhatsAppNo"}
                required={true}
                isEnable={mode !== "view"}
                focusOptions={() => method.setFocus("IsWANumberSameAsMobile")}
              />
            </div>
          </FormColumn>
          {hideFieldsForDemo === false ? (
            <>
              <FormColumn lg={3} xl={3} md={6}>
                <FormLabel></FormLabel>
                <div className="mt-1">
                  <CheckBox
                    control={method.control}
                    ID={"IsWANumberSameAsMobile"}
                    Label={"Same as mobile no"}
                    isEnable={mode !== "view"}
                    onChange={(e) => {
                      if (e.checked) {
                        method.setValue(
                          "ContactPersonWhatsAppNo",
                          method.getValues("ContactPersonMobileNo")
                        )
                      } else {
                        method.setValue("ContactPersonWhatsAppNo", "")
                      }
                    }}
                  />
                </div>
              </FormColumn>
            </>
          ) : (
            <></>
          )}
        </FormRow>
        <FormRow>
          <FormColumn lg={9} xl={9} md={12}>
            <FormLabel>Requirements Detail</FormLabel>
            <input
              as={"textarea"}
              rows={1}
              disabled={mode === "view"}
              className="form-control"
              style={{
                padding: "0.3rem 0.4rem",
                fontSize: "0.8em",
              }}
              {...method.register("RequirementDetails")}
            />
          </FormColumn>
          {hideFieldsForDemo === false ? (
            <>
              <FormColumn lg={3} xl={3} md={6}>
                <FormLabel>Where have you heard about us?</FormLabel>
                <div>
                  <CDropdown
                    control={method.control}
                    name={`LeadSourceID`}
                    optionLabel="LeadSourceTitle"
                    optionValue="LeadSourceID"
                    placeholder="Select a lead source"
                    options={leadSourcesSelectData.data}
                    disabled={mode === "view"}
                  />
                </div>
              </FormColumn>
            </>
          ) : (
            <></>
          )}
        </FormRow>
      </form>
    </>
  )
}
export function LeadsIntroductionFormModalButton({
  LeadIntroductionDetailID = 0,
}) {
  const queryClient = useQueryClient()
  const { setVisible, render } = useLeadsIntroductionModalHook(
    LeadIntroductionDetailID
  )
  return (
    <>
      <Button
        icon="pi pi-eye"
        rounded
        outlined
        severity="secondary"
        tooltip="View"
        tooltipOptions={{
          position: "right",
        }}
        onClick={() => {
          setVisible(true)
        }}
        style={{
          padding: "1px 0px",
          fontSize: "small",
          width: "30px",
          height: "2rem",
          border: "none",
        }}
      />
      {render}
    </>
  )
}

export const CustomerAndLeadsInfo = ({
  mode,
  col = 3,
  required = true,
  countryRef,
  focusOn = "",
  disabled,
}) => {
  const [items, setItems] = useState([])

  const method = useFormContext()

  const businessTypesSelectData = useAllBusinessTypesSelectData()
  const businessNatureSelectData = useAllBusinessNatureSelectData(true)
  const search = (event) => {
    let _filteredItems
    let query = event.query
    _filteredItems = businessNatureSelectData?.data.filter((item) => {
      return item.toLowerCase().includes(query.toLowerCase())
    })
    setItems(_filteredItems)
  }

  return (
    <>
      <FormProvider {...method}>
        <CountryDependentFields
          mode={mode}
          col={col}
          required={required}
          ref={countryRef}
        />
      </FormProvider>

      <FormColumn lg={col} xl={col} md={6}>
        <FormLabel>
          Business Type
          {required && (
            <>
              <span className="text-danger fw-bold ">*</span>
            </>
          )}
        </FormLabel>
        <div>
          <CDropdown
            control={method.control}
            name={`BusinessTypeID`}
            optionLabel="BusinessTypeTitle"
            optionValue="BusinessTypeID"
            placeholder="Select a business type"
            options={businessTypesSelectData.data}
            required={required}
            disabled={mode === "view"}
            focusOptions={() => method.setFocus("BusinessNatureID")}
          />
        </div>
      </FormColumn>
      <FormColumn lg={col} xl={col} md={6}>
        <FormLabel>
          Business Nature
          {required && (
            <>
              <span className="text-danger fw-bold ">*</span>
            </>
          )}
        </FormLabel>
        <div style={{ width: "100%" }}>
          <Controller
            name="BusinessNatureID"
            control={method.control}
            rules={{ required: required }}
            render={({ field, fieldState }) => (
              <>
                <AutoComplete
                  inputId={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  inputRef={field.ref}
                  suggestions={items}
                  completeMethod={search}
                  disabled={mode === "view"}
                  dropdown
                  style={{ width: "100%" }}
                  pt={{
                    dropdownButton: {
                      root: {
                        style: {
                          padding: "0 !important",
                        },
                      },
                      icon: {
                        style: {
                          padding: "0",
                        },
                      },
                    },
                    input: {
                      style: {
                        width: "100%",
                      },
                    },
                  }}
                  className={classNames({ "p-invalid": fieldState.error })}
                />
              </>
            )}
          />
        </div>
      </FormColumn>
    </>
  )
}
