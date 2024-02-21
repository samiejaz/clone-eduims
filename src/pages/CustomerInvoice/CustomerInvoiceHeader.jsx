import { Row, Col, Form, ButtonGroup } from "react-bootstrap";
import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { useEffect } from "react";
import NumberInput from "../../components/Forms/NumberInput";
import CDropdown from "../../components/Forms/CDropdown";
import {
  useBusinessUnitsSelectData,
  useProductsInfoSelectData,
  useServicesInfoSelectData,
} from "../../hooks/SelectData/useSelectData";
import DetailHeaderActionButtons from "../../components/DetailHeaderActionButtons";

function CustomerInvoiceHeader(props) {
  const { customerBranchSelectData, typesOption, append, pageTitles } = props;
  const [isFree, setIsFree] = useState(false);
  const [invoiceType, setInvoiceType] = useState();
  const [BusinessUnitID, setBusinessUnitID] = useState(0);

  const {
    control,
    handleSubmit,
    register,
    reset,
    getValues,
    setValue,
    setFocus,
    formState,
  } = useFormContext();

  const businessSelectData = useBusinessUnitsSelectData();
  const productsInfoSelectData = useProductsInfoSelectData(BusinessUnitID);
  const servicesInfoSelectData = useServicesInfoSelectData(BusinessUnitID);

  function onSubmit(data) {
    append({
      InvoiceType: data.InvoiceType,
      BusinessUnit: data.BusinessUnit,
      CustomerBranch: data.CustomerBranch,
      ProductInfo: data.ProductInfo,
      ServiceInfo: data.ServiceInfo,
      Qty: data.Qty,
      Rate: data.Rate,
      CGS: data.CGS,
      Discount: data.Discount,
      Amount: data.Amount,
      NetAmount: data.NetAmount,
      DetailDescription: data.DetailDescription,
      products: JSON.stringify(productsInfoSelectData.data),
      IsFree: data.IsFree,
      services: JSON.stringify(servicesInfoSelectData.data),
    });
    reset();
    setIsFree(false);
    setFocus("InvoiceType");
  }

  return (
    <>
      <form>
        <Row>
          <Form.Group as={Col} controlId="InvoiceType">
            <Form.Label>Invoice Type</Form.Label>
            <span className="text-danger fw-bold ">*</span>

            <div>
              <CDropdown
                control={control}
                name={`InvoiceType`}
                placeholder="Select a type"
                options={typesOption}
                required={true}
                focusOptions={() => setFocus("BusinessUnit")}
                onChange={(e) => {
                  setInvoiceType(e.value === "Product" ? true : false);
                }}
              />
            </div>
          </Form.Group>
          <Form.Group as={Col} controlId="BusinessUnit">
            <Form.Label>
              Business Unit
              <span className="text-danger fw-bold ">*</span>
            </Form.Label>

            <div>
              <CDropdown
                control={control}
                name={`BusinessUnit`}
                optionLabel="BusinessUnitName"
                optionValue="BusinessUnitID"
                placeholder="Select a business unit"
                options={businessSelectData.data}
                required={true}
                onChange={(e) => {
                  setValue("ProductInfo", []);
                  setValue("ServiceInfo", []);
                  setBusinessUnitID(e.value);
                }}
                filter={true}
                focusOptions={() => setFocus("CustomerBranch")}
              />
            </div>
          </Form.Group>
          <Form.Group as={Col} controlId="CustomerBranch">
            <Form.Label>
              {pageTitles?.branch || "Customer Branch"}
              <span className="text-danger fw-bold ">*</span>
            </Form.Label>

            <div>
              <CDropdown
                control={control}
                name={`CustomerBranch`}
                optionLabel="BranchTitle"
                optionValue="BranchID"
                placeholder={`Select a ${
                  pageTitles?.branch.toLowerCase() || "customer branche"
                }s`}
                options={customerBranchSelectData}
                required={true}
                focusOptions={() => setFocus("ProductInfo")}
              />
            </div>
          </Form.Group>
        </Row>

        <Row>
          <Form.Group as={Col} controlId="ProductInfo">
            <Form.Label>
              {pageTitles?.product || "Product"} to{" "}
              {invoiceType ? "Invoice" : "Serve"}
            </Form.Label>
            <span className="text-danger fw-bold ">*</span>

            <div>
              <CDropdown
                control={control}
                name={`ProductInfo`}
                optionLabel="ProductInfoTitle"
                optionValue="ProductInfoID"
                placeholder={`Select a ${
                  pageTitles?.product.toLowerCase() || "product"
                }`}
                options={productsInfoSelectData.data}
                required={true}
                filter={true}
                focusOptions={() =>
                  setFocus(invoiceType ? "Qty" : "ServiceInfo")
                }
              />
            </div>
          </Form.Group>
          <Form.Group as={Col} controlId="ServiceInfo" className="col-3">
            <Form.Label>Service to Invoice</Form.Label>

            <div>
              <CDropdown
                control={control}
                name={`ServiceInfo`}
                optionLabel="ProductInfoTitle"
                optionValue="ProductInfoID"
                placeholder={`Select a service`}
                options={servicesInfoSelectData.data}
                disabled={invoiceType}
                filter={true}
                focusOptions={() => setFocus("Qty")}
              />
            </div>
            {/* <span className="text-danger">{errors?.ServiceInfo?.message}</span> */}
          </Form.Group>
          <Form.Group as={Col} controlId="Qty" className="col-1 p-0 ">
            <Form.Label>Qty</Form.Label>
            <NumberInput
              id={"Qty"}
              control={control}
              onChange={(e) => {
                const rate = getValues(["Rate"]);
                setValue("Amount", e.value * rate);
              }}
              inputClassName="form-control"
              useGrouping={false}
              enterKeyOptions={() => setFocus("Rate")}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="Rate" className="col-1">
            <Form.Label>Rate</Form.Label>
            <NumberInput
              id={"Rate"}
              control={control}
              onChange={(e) => {
                const qty = getValues(["Qty"]);
                setValue("Amount", e.value * qty);
                const disc = getValues(["Discount"]);
                setValue("NetAmount", e.value * qty - disc);
              }}
              mode="decimal"
              maxFractionDigits={2}
              inputClassName="form-control"
              useGrouping={false}
              disabled={isFree}
              enterKeyOptions={() => setFocus("CGS")}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="CGS" className="col-1">
            <Form.Label>CGS</Form.Label>
            <NumberInput
              id={"CGS"}
              control={control}
              mode="decimal"
              maxFractionDigits={2}
              inputClassName="form-control"
              useGrouping={false}
              enterKeyOptions={() => setFocus("Discount")}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="Amount" className="col-1">
            <Form.Label>Amount</Form.Label>
            <NumberInput
              id={"Amount"}
              control={control}
              mode="decimal"
              maxFractionDigits={2}
              inputClassName="form-control"
              useGrouping={false}
              disabled={true}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="Discount" className="col-1">
            <Form.Label>Discount</Form.Label>
            <NumberInput
              id={"Discount"}
              control={control}
              disabled={isFree}
              onChange={(e) => {
                const amount = getValues(["Amount"]);
                setValue("NetAmount", amount - e.value);
              }}
              mode="decimal"
              maxFractionDigits={2}
              inputClassName="form-control"
              useGrouping={false}
              enterKeyOptions={() => setFocus("DetailDescription")}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="NetAmount" className="col-1">
            <Form.Label>Net Amount</Form.Label>
            <NumberInput
              id={"NetAmount"}
              control={control}
              mode="decimal"
              maxFractionDigits={2}
              inputClassName="form-control"
              useGrouping={false}
              disabled={true}
            />
          </Form.Group>
        </Row>
        {/* <Row className="py-3" style={{ marginTop: "-25px" }}>
        
        </Row> */}
        <Row>
          <Form.Group as={Col} controlId="DetailDescription" className="col-9">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as={"textarea"}
              rows={1}
              className="form-control"
              {...register("DetailDescription")}
            />
          </Form.Group>

          <Form.Control
            type="text"
            {...register("products")}
            style={{ display: "none" }}
          />
          <Form.Group as={Col} className="col-1" controlId="IsFree">
            <Form.Label></Form.Label>
            <Form.Check
              {...register("IsFree")}
              label="Is Free"
              aria-label="Is Free"
              style={{ marginTop: "7px" }}
              onChange={(e) => {
                if (e.target.checked) {
                  setValue("Rate", 0);
                  setValue("CGS", 0);
                  setValue("Amount", 0);
                  setValue("Discount", 0);
                  setValue("NetAmount", 0);
                  setIsFree(true);
                } else {
                  setIsFree(false);
                }
              }}
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label></Form.Label>
            <DetailHeaderActionButtons
              handleAdd={() => handleSubmit(onSubmit)()}
              handleClear={() => reset()}
            />
          </Form.Group>
        </Row>
      </form>
    </>
  );
}

export default CustomerInvoiceHeader;
