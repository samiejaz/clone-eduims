import React, { useEffect, useState } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import {
  useAllBusinessNatureSelectData,
  useAllBusinessTypesSelectData,
  useAllCountiesSelectData,
  useAllLeadsSouceSelectData,
  useAllTehsilsSelectData,
} from "../SelectData/useSelectData";
import CDropdown from "../../components/Forms/CDropdown";
import { Col, Form, Row } from "react-bootstrap";
import CheckBox from "../../components/Forms/CheckBox";
import TextInput from "../../components/Forms/TextInput";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { AutoComplete } from "primereact/autocomplete";
import { classNames } from "primereact/utils";
import {
  fetchDemonstrationLeadsDataByID,
  fetchLeadIntroductionById,
} from "../../api/LeadIntroductionData";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../utils/enums";
import { useUserData } from "../../context/AuthContext";
import { parseISO } from "date-fns";
import { Dropdown } from "primereact/dropdown";

export const useLeadsIntroductionModalHook = (LeadIntroductionDetailID = 0) => {
  const queryClient = useQueryClient();
  const user = useUserData();

  const [visible, setVisible] = useState(false);
  const LeadIntroductionData = useQuery({
    queryKey: [QUERY_KEYS.LEADS_DEMO_DATA, LeadIntroductionDetailID],
    queryFn: () =>
      fetchDemonstrationLeadsDataByID({
        UserID: user.userID,
        DepartmentID: user.DepartmentID,
        LeadIntroductionDetailID,
      }),

    enabled: LeadIntroductionDetailID !== 0,
    initialData: [],
  });

  const dialogContent = (
    <>
      <Row>
        <Form.Group as={Col}>
          <Form.Label>Name of firm</Form.Label>
          <div>
            <Form.Control
              type="text"
              id="CompanyName"
              value={LeadIntroductionData.data[0]?.CompanyName}
              disabled
            />
          </div>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Country</Form.Label>
          <div>
            <Form.Control
              type="text"
              id="CountryID"
              value={LeadIntroductionData.data[0]?.CountryTitle}
              disabled
            />
          </div>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Tehsil</Form.Label>
          <div>
            <Form.Control
              type="text"
              id="TehsilID"
              value={LeadIntroductionData.data[0]?.TehsilTitle}
              disabled
            />
          </div>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Business Type</Form.Label>
          <div>
            <Form.Control
              type="text"
              id="BusinessTypeID"
              value={LeadIntroductionData.data[0]?.BusinessTypeTitle}
              disabled
            />
          </div>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col}>
          <Form.Label>Business Nature</Form.Label>
          <div>
            <Form.Control
              type="text"
              id="BusinessNatureID"
              value={LeadIntroductionData.data[0]?.BusinessNature}
              disabled
            />
          </div>
        </Form.Group>

        <Form.Group as={Col}>
          <Form.Label>Company Website</Form.Label>
          <div>
            <Form.Control
              type="text"
              id="CompanyWebsite"
              value={LeadIntroductionData.data[0]?.CompanyWebsite}
              disabled
            />
          </div>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Contact Person Name</Form.Label>
          <div>
            <Form.Control
              type="text"
              id="ContactPersonName"
              value={LeadIntroductionData.data[0]?.ContactPersonName}
              disabled
            />
          </div>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Contact Person Mobile No</Form.Label>
          <div>
            <Form.Control
              type="text"
              id="ContactPersonMobileNo"
              value={LeadIntroductionData.data[0]?.ContactPersonMobileNo}
              disabled
            />
          </div>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col}>
          <Form.Label>Contact Person Email</Form.Label>
          <div>
            <Form.Control
              type="text"
              id="ContactPersonEmail"
              value={LeadIntroductionData.data[0]?.ContactPersonEmail}
              disabled
            />
          </div>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Contact Person Whatsapp No</Form.Label>
          <div>
            <Form.Control
              type="text"
              id="CompanyAddress"
              value={LeadIntroductionData.data[0]?.CompanyAddress}
              disabled
            />
          </div>
        </Form.Group>

        <Form.Group as={Col}>
          <Form.Label>Contact Person Whatsapp No</Form.Label>
          <div>
            <Form.Control
              type="text"
              id="ContactPersonWhatsAppNo"
              value={LeadIntroductionData.data[0]?.ContactPersonWhatsAppNo}
              disabled
            />
          </div>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col}>
          <Form.Label>Requirements Detail</Form.Label>
          <Form.Control
            as={"textarea"}
            rows={1}
            disabled
            className="form-control"
            style={{
              padding: "0.3rem 0.4rem",
              fontSize: "0.8em",
            }}
            value={LeadIntroductionData.data[0]?.RequirementDetail}
          />
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col}>
          <Form.Label>Meeting Place</Form.Label>
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
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Meeting Time</Form.Label>
          <div>
            <Form.Control
              type="text"
              id="MeetingTime"
              value={parseISO(LeadIntroductionData.data[0]?.MeetingTime, {
                additionalDigits: "0",
              })}
              disabled
            />
          </div>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Product</Form.Label>
          <div>
            <Form.Control
              type="text"
              id="Product"
              value={LeadIntroductionData.data[0]?.ProductInfoTitle}
              disabled
            />
          </div>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col}>
          <Form.Label>Description</Form.Label>
          <Form.Control
            as={"textarea"}
            rows={1}
            disabled
            className="form-control"
            style={{
              padding: "0.3rem 0.4rem",
              fontSize: "0.8em",
            }}
            value={LeadIntroductionData.data[0]?.Description}
          />
        </Form.Group>
      </Row>
    </>
  );

  const footerContent = <></>;

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
            setVisible(false);
            queryClient.invalidateQueries([
              QUERY_KEYS.LEAD_INTRODUCTION_QUERY_KEY,
            ]);
            //TODO: Invalidate the query
          }}
        >
          {dialogContent}
        </Dialog>
      </>
    ),
  };
};
export function LeadsIntroductionFormComponent({
  mode = "",
  hideFieldsForDemo = false,
}) {
  const [CountryID, setCountryID] = useState(0);
  const [items, setItems] = useState([]);

  const countriesSelectData = useAllCountiesSelectData();

  const businessTypesSelectData = useAllBusinessTypesSelectData();
  const tehsilsSelectData = useAllTehsilsSelectData(CountryID);
  const businessNatureSelectData = useAllBusinessNatureSelectData(true);
  const leadSourcesSelectData = useAllLeadsSouceSelectData();

  const method = useFormContext();

  useEffect(() => {
    setCountryID(method.control._fields.CountryID._f.value);
  }, []);

  const search = (event) => {
    let _filteredItems;
    let query = event.query;
    _filteredItems = businessNatureSelectData?.data.filter((item) => {
      return item.toLowerCase().includes(query.toLowerCase());
    });
    setItems(_filteredItems);
  };

  return (
    <>
      <form>
        <Row>
          <Form.Group as={Col} controlId="CompanyName">
            <Form.Label>
              Name of firm
              <span className="text-danger fw-bold ">*</span>
            </Form.Label>
            <div>
              <TextInput
                control={method.control}
                ID={"CompanyName"}
                required={true}
                focusOptions={() => method.setFocus("CountryID")}
                isEnable={mode !== "view"}
              />
            </div>
          </Form.Group>
          <Form.Group as={Col} controlId="CountryID">
            <Form.Label>
              Country
              <span className="text-danger fw-bold ">*</span>
            </Form.Label>
            <div>
              <CDropdown
                control={method.control}
                name={`CountryID`}
                optionLabel="CountryTitle"
                optionValue="CountryID"
                placeholder="Select a country"
                options={countriesSelectData.data}
                required={true}
                disabled={mode === "view"}
                focusOptions={() => method.setFocus("TehsilID")}
                onChange={(e) => {
                  // setCountryID(e.value);
                  method.resetField("TehsilID");
                }}
              />
            </div>
          </Form.Group>
          <Form.Group as={Col} controlId="TehsilID">
            <Form.Label>
              Tehsil
              <span className="text-danger fw-bold ">*</span>
            </Form.Label>
            <div>
              <CDropdown
                control={method.control}
                name={`TehsilID`}
                optionLabel="TehsilTitle"
                optionValue="TehsilID"
                placeholder="Select a tehsil"
                options={tehsilsSelectData.data}
                required={true}
                disabled={mode === "view"}
                focusOptions={() => method.setFocus("BusinessTypeID")}
              />
            </div>
          </Form.Group>
          <Form.Group as={Col} controlId="BusinessTypeID">
            <Form.Label>
              Business Type
              <span className="text-danger fw-bold ">*</span>
            </Form.Label>
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
          </Form.Group>
        </Row>
        <Row>
          <Form.Group as={Col} controlId="BusinessNatureID">
            <Form.Label>
              Business Nature
              <span className="text-danger fw-bold ">*</span>
            </Form.Label>
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
          </Form.Group>

          <Form.Group as={Col} controlId="CompanyWebsite">
            <Form.Label>Company Website</Form.Label>
            <div>
              <TextInput
                control={method.control}
                ID={"CompanyWebsite"}
                required={true}
                focusOptions={() => method.setFocus("ContactPersonName")}
                isEnable={mode !== "view"}
              />
            </div>
          </Form.Group>
          <Form.Group as={Col} controlId="ContactPersonName">
            <Form.Label>Contact Person Name</Form.Label>
            <div>
              <TextInput
                control={method.control}
                ID={"ContactPersonName"}
                required={true}
                focusOptions={() => method.setFocus("ContactPersonMobileNo")}
                isEnable={mode !== "view"}
              />
            </div>
          </Form.Group>
          <Form.Group as={Col} controlId="ContactPersonMobileNo">
            <Form.Label>Contact Person Mobile No</Form.Label>
            <div>
              <TextInput
                control={method.control}
                ID={"ContactPersonMobileNo"}
                required={true}
                isEnable={mode !== "view"}
                focusOptions={() => method.setFocus("ContactPersonEmail")}
                onChange={(e) => {
                  if (method.watch("IsWANumberSameAsMobile")) {
                    method.setValue("ContactPersonWhatsAppNo", e.target.value);
                  }
                }}
              />
              {/* <CMaskInput
                control={method.control}
                name={"ContactPersonMobileNo"}
                required={true}
                focusOptions={() => method.setFocus("ContactPersonEmail")}
                mask="9999-9999999"
                onChange={(e) => {
                  if (method.watch("IsWANumberSameAsMobile")) {
                    method.setValue("ContactPersonWhatsAppNo", e.value);
                  }
                }}
              /> */}
            </div>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group as={Col} controlId="ContactPersonEmail">
            <Form.Label>Contact Person Email</Form.Label>
            <div>
              <TextInput
                control={method.control}
                ID={"ContactPersonEmail"}
                required={true}
                focusOptions={() => method.setFocus("CompanyAddress")}
                isEnable={mode !== "view"}
              />
            </div>
          </Form.Group>
          <Form.Group as={Col} controlId="CompanyAddress">
            <Form.Label>
              Company Address
              <span className="text-danger fw-bold ">*</span>
            </Form.Label>
            <div>
              <TextInput
                control={method.control}
                ID={"CompanyAddress"}
                required={true}
                focusOptions={() => method.setFocus("ContactPersonWhatsAppNo")}
                isEnable={mode !== "view"}
              />
            </div>
          </Form.Group>

          <Form.Group as={Col} controlId="ContactPersonWhatsAppNo">
            <Form.Label>Contact Person Whatsapp No</Form.Label>
            <div>
              {/* <CMaskInput
                control={method.control}
                name={"ContactPersonWhatsAppNo"}
                required={true}
                disabled={method.watch("IsWANumberSameAsMobile")}
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
          </Form.Group>
          {hideFieldsForDemo === false ? (
            <>
              <Form.Group as={Col} controlId="IsWANumberSameAsMobile">
                <Form.Label></Form.Label>
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
                          method.getValues(["ContactPersonMobileNo"])
                        );
                      } else {
                        method.setValue("ContactPersonWhatsAppNo", "");
                      }
                    }}
                  />
                </div>
              </Form.Group>
            </>
          ) : (
            <></>
          )}
        </Row>
        <Row>
          <Form.Group as={Col} controlId="RequirementDetails" className="col-9">
            <Form.Label>Requirements Detail</Form.Label>
            <Form.Control
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
          </Form.Group>
          {hideFieldsForDemo === false ? (
            <>
              <Form.Group as={Col} controlId="LeadSourceID">
                <Form.Label>
                  Where have you here about us?
                  <span className="text-danger fw-bold ">*</span>
                </Form.Label>
                <div>
                  <CDropdown
                    control={method.control}
                    name={`LeadSourceID`}
                    optionLabel="LeadSourceTitle"
                    optionValue="LeadSourceID"
                    placeholder="Select a lead source"
                    options={leadSourcesSelectData.data}
                    required={true}
                    disabled={mode === "view"}
                  />
                </div>
              </Form.Group>
            </>
          ) : (
            <></>
          )}
        </Row>
      </form>
    </>
  );
}
export function LeadsIntroductionFormModalButton({
  LeadIntroductionDetailID = 0,
}) {
  const queryClient = useQueryClient();
  const { setVisible, render } = useLeadsIntroductionModalHook(
    LeadIntroductionDetailID
  );
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
          setVisible(true);
          // queryClient.invalidateQueries([
          //   QUERY_KEYS.LEAD_INTRODUCTION_QUERY_KEY,
          //   LeadIntroductionDetailID,
          // ]);
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
  );
}
