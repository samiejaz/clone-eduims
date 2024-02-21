import React, { useEffect, useState } from "react";
import { Row, Col, Form, ButtonGroup, Button, Table } from "react-bootstrap";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import ReactSelect from "react-select";
import {
  fetchAllProductsForSelect,
  fetchAllServicesForSelect,
} from "../../api/SelectData";
import NumberInput from "../../components/Forms/NumberInput";
import CDropdown from "../../components/Forms/CDropdown";

function CustomerInvoiceDetailTable(props) {
  const {
    customerBranchSelectData,
    pageTitles,
    fields,
    append,
    remove,
    businessSelectData,
    isEnable,
    typesOption,
  } = props;

  const {
    register,
    control,
    getValues,
    setValue,
    setFocus,
    watch,
    unregister,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    handleNetAmountTotal();
  }, [append, fields]);

  function handleNetAmountTotal() {
    let rateSum = 0;
    let cgsSum = 0;
    let discountSum = 0;
    let amountSum = 0;

    fields.forEach((item, index) => {
      const rate = parseFloat(getValues(`detail.${index}.Rate`) || 0);
      const cgs = parseFloat(getValues(`detail.${index}.CGS`) || 0);
      const discount = parseFloat(getValues(`detail.${index}.Discount`) || 0);
      const amount = parseFloat(getValues(`detail.${index}.NetAmount`) || 0);

      rateSum += rate;
      cgsSum += cgs;
      discountSum += discount;
      amountSum += amount;
    });

    setValue("Total_Rate", rateSum);
    setValue("Total_CGS", cgsSum);
    setValue("Total_Discount", discountSum);
    setValue("Total_Amount", amountSum);
  }

  return (
    <>
      <div className="py-3 mb-4">
        <form>
          <hr />
          <Table
            bordered
            hover
            size="sm"
            responsive
            style={{ minWidth: "3000px" }}
          >
            <thead className="">
              <tr className="text-center bg-info-subtle ">
                <th className="p-2 bg-info text-white">Sr No.</th>
                <th className="p-2 bg-info text-white">Is Free</th>
                <th
                  className="p-2 bg-info text-white"
                  style={{ width: "400px" }}
                >
                  InvoiceType
                </th>
                <th
                  className="p-2 bg-info text-white"
                  style={{ width: "400px" }}
                >
                  Business Unit
                </th>

                <th
                  className="p-2 bg-info text-white"
                  style={{ width: "400px" }}
                >
                  {pageTitles?.branch || "Customer Branch"}
                </th>
                <th
                  className="p-2 bg-info text-white"
                  style={{ width: "400px" }}
                >
                  {pageTitles?.product || "Product"}
                </th>
                <th
                  className="p-2 bg-info text-white"
                  style={{ width: "400px" }}
                >
                  Service
                </th>
                <th className="p-2 bg-info text-white">Qty</th>
                <th className="p-2 bg-info text-white">Rate</th>
                <th className="p-2 bg-info text-white">CGS</th>
                <th className="p-2 bg-info text-white">Amount</th>
                <th className="p-2 bg-info text-white">Discount</th>
                <th className="p-2 bg-info text-white">Net Amount</th>
                <th className="p-2 bg-info text-white">Description</th>
                <th
                  className="p-2 bg-info text-white"
                  style={{ display: "none" }}
                >
                  Products
                </th>
                <th
                  className="p-2 bg-info text-white"
                  style={{ display: "none" }}
                >
                  Services
                </th>
                <th className="p-2 bg-info text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((item, index) => {
                return (
                  <>
                    <DetailRow
                      item={item}
                      index={index}
                      handleNetAmountTotal={handleNetAmountTotal}
                      isEnable={isEnable}
                      key={item.id}
                      typesOption={typesOption}
                      businessSelectData={businessSelectData}
                      pageTitles={pageTitles}
                      customerBranchSelectData={customerBranchSelectData}
                    />
                  </>
                );
              })}
            </tbody>
          </Table>
          <hr />
          <Row className="p-3" style={{ marginTop: "-25px" }}>
            <Form.Group as={Col} controlId="Total_Rate">
              <Form.Label>Total Rate</Form.Label>
              <Form.Control disabled {...register("Total_Rate")} />
            </Form.Group>
            <Form.Group as={Col} controlId="Total_CGS">
              <Form.Label>Total CGS</Form.Label>
              <Form.Control disabled {...register("Total_CGS")} />
            </Form.Group>
            <Form.Group as={Col} controlId="Total_Discount">
              <Form.Label>Total Discount</Form.Label>
              <Form.Control disabled {...register("Total_Discount")} />
            </Form.Group>
            <Form.Group as={Col} controlId="Total_Amount">
              <Form.Label>Total Amount</Form.Label>
              <Form.Control
                disabled
                {...register("Total_Amount")}
                onInput={(e) => {
                  setValue("InstallmentTotalAmount", e.target.value);
                }}
              />
            </Form.Group>
          </Row>
        </form>
      </div>
    </>
  );
}

export default React.memo(CustomerInvoiceDetailTable);

function DetailRow({
  item,
  isEnable,
  index,
  handleNetAmountTotal,
  typesOption,
  businessSelectData,
  pageTitles,
  customerBranchSelectData,
}) {
  const { register, control, setValue, unregister, watch, getValues } =
    useFormContext();

  async function filteredProductsBasedOnRow(selectedOption, index) {
    const data = await fetchAllProductsForSelect(selectedOption);
    setValue(`detail.${index}.products`, JSON.stringify(data));
  }
  async function filteredServicesBasedOnRow(selectedOption, index) {
    const data = await fetchAllServicesForSelect(selectedOption);
    setValue(`detail.${index}.services`, JSON.stringify(data));
  }

  const [isFree, setIsFree] = useState(false);

  function toggleIsFree(val) {
    setIsFree(val);
  }

  return (
    <>
      <tr key={item.id}>
        <td className="text-center" style={{ maxWidth: "60px" }}>
          <NumberInput
            control={control}
            id={`detail.${index}.RowID`}
            value={index + 1}
            disabled={!isEnable}
            readOnly
          />
        </td>
        <td className="text-center" style={{ width: "60px" }}>
          <Form.Check
            {...register(`detail.${index}.IsFree`)}
            style={{ marginTop: "5px" }}
            disabled={!isEnable}
            onChange={(e) => {
              if (e.target.checked) {
                setValue(`detail.${index}.CGS`, 0);
                setValue(`detail.${index}.Amount`, 0);
                setValue(`detail.${index}.Discount`, 0);
                setValue(`detail.${index}.NetAmount`, 0);
                setValue(`detail.${index}.Rate`, 0);
              }
              toggleIsFree(e.target.checked);
            }}
          />
        </td>
        <td style={{ width: "500px" }}>
          <CDropdown
            control={control}
            name={`detail.${index}.InvoiceType`}
            placeholder="Select a type"
            options={typesOption}
            required={true}
            disabled={!isEnable}
            focusOptions={() => setFocus(`detail.${index}.BusinessUnit`)}
            onChange={(e) => {
              if (e.value === "Product") {
                unregister(`detail.${index}.Service`);
              } else {
                register(`detail.${index}.Service`);
              }
            }}
          />
        </td>
        <td style={{ width: "500px" }}>
          <CDropdown
            control={control}
            name={`detail.${index}.BusinessUnit`}
            optionLabel="BusinessUnitName"
            optionValue="BusinessUnitID"
            placeholder="Select a business unit"
            options={businessSelectData}
            required={true}
            disabled={!isEnable}
            onChange={(e) => {
              filteredProductsBasedOnRow(e.value, index);
              filteredServicesBasedOnRow(e.value, index);
              setValue(`detail.${index}.ProductInfo`, []);
            }}
            filter={true}
            focusOptions={() => setFocus(`detail.${index}.CustomerBranch`)}
          />
        </td>

        <td style={{ width: "500px" }}>
          <CDropdown
            control={control}
            name={`detail.${index}.CustomerBranch`}
            optionLabel="BranchTitle"
            optionValue="BranchID"
            placeholder={`Select a ${
              pageTitles?.branch.toLowerCase() || "customer branch"
            }`}
            options={customerBranchSelectData}
            required={true}
            disabled={!isEnable}
            filter={true}
            focusOptions={() => setFocus(`detail.${index}.ProductInfo`)}
          />
        </td>

        <td style={{ width: "500px" }}>
          <CDropdown
            control={control}
            name={`detail.${index}.ProductInfo`}
            optionLabel="ProductInfoTitle"
            optionValue="ProductInfoID"
            placeholder={`Select a ${
              pageTitles?.product.toLowerCase() || "product"
            }`}
            options={JSON.parse(
              watch(`detail.${index}.products`)?.toString() || "[]"
            )}
            required={true}
            disabled={!isEnable}
            filter={true}
            focusOptions={() => setFocus(`detail.${index}.Rate`)}
          />
        </td>
        <td style={{ width: "500px" }}>
          <CDropdown
            control={control}
            name={`detail.${index}.ServiceInfo`}
            optionLabel="ProductInfoTitle"
            optionValue="ProductInfoID"
            placeholder={`Select a ${
              pageTitles?.product.toLowerCase() || "product"
            }`}
            options={JSON.parse(
              watch(`detail.${index}.services`)?.toString() || "[]"
            )}
            required={watch(`detail.${index}.InvoiceType`) !== "Product"}
            filter={true}
            disabled={
              !isEnable || watch(`detail.${index}.InvoiceType`) === "Product"
            }
            focusOptions={() => setFocus(`detail.${index}.Qty`)}
          />
        </td>

        <td style={{ width: "200px" }}>
          <NumberInput
            id={`detail.${index}.Qty`}
            control={control}
            onChange={(e) => {
              const rate = parseFloat(0 + getValues([`detail.${index}.Rate`]));
              const disc = parseFloat(
                0 + getValues([`detail.${index}.Discount`])
              );
              setValue(`detail.${index}.Amount`, e.value * rate);
              setValue(`detail.${index}.NetAmount`, e.value * rate - disc);
              handleNetAmountTotal();
            }}
            disabled={!isEnable}
            inputClassName="form-control"
            useGrouping={false}
            enterKeyOptions={() => setFocus("Rate")}
          />
        </td>
        <td style={{ width: "200px" }}>
          <NumberInput
            id={`detail.${index}.Rate`}
            control={control}
            onChange={(e) => {
              const qty = parseFloat(0 + getValues([`detail.${index}.Qty`]));
              const disc = parseFloat(
                0 + getValues([`detail.${index}.Discount`])
              );
              setValue(`detail.${index}.Amount`, e.value * qty);
              setValue(`detail.${index}.NetAmount`, e.value * qty - disc);
              setValue(`detail.${index}.Rate`, e.value);
              handleNetAmountTotal();
            }}
            disabled={!isEnable || isFree}
            mode="decimal"
            maxFractionDigits={2}
            inputClassName="form-control"
            useGrouping={false}
          />
        </td>
        <td style={{ width: "200px" }}>
          <NumberInput
            id={`detail.${index}.CGS`}
            control={control}
            onChange={(e) => {
              setValue(`detail.${index}.CGS`, e.value);
              handleNetAmountTotal();
            }}
            disabled={!isEnable}
            mode="decimal"
            maxFractionDigits={2}
            inputClassName="form-control"
            useGrouping={false}
          />
        </td>
        <td style={{ width: "200px" }}>
          <NumberInput
            id={`detail.${index}.Amount`}
            control={control}
            onChange={(e) => {
              setValue(`detail.${index}.CGS`, e.value);
              handleNetAmountTotal();
            }}
            disabled={true}
            mode="decimal"
            maxFractionDigits={2}
            inputClassName="form-control"
            useGrouping={false}
          />
        </td>
        <td style={{ width: "200px" }}>
          <NumberInput
            id={`detail.${index}.Discount`}
            control={control}
            onChange={(e) => {
              const amount = parseFloat(
                0 + getValues([`detail.${index}.Amount`])
              );
              setValue(`detail.${index}.NetAmount`, amount - e.target.value);
              setValue(`detail.${index}.Discount`, e.target.value);
              handleNetAmountTotal();
            }}
            disabled={!isEnable || isFree}
            mode="decimal"
            maxFractionDigits={2}
            inputClassName="form-control"
            useGrouping={false}
          />
        </td>

        <td style={{ width: "200px" }}>
          <NumberInput
            id={`detail.${index}.NetAmount`}
            control={control}
            disabled={true}
            mode="decimal"
            maxFractionDigits={2}
            inputClassName="form-control"
            useGrouping={false}
          />
        </td>
        <td style={{ width: "1000px" }}>
          <Form.Control
            type="text"
            as={"textarea"}
            rows={1}
            disabled={!isEnable}
            {...register(`detail.${index}.DetailDescription`)}
          />
        </td>
        <td style={{ display: "none" }}>
          <Form.Control type="text" {...register(`detail.${index}.products`)} />
        </td>
        <td style={{ display: "none" }}>
          <Form.Control type="text" {...register(`detail.${index}.services`)} />
        </td>
        <td>
          <ButtonGroup className="d-flex align-items-center justify-content-center my-auto gap-1">
            <Button
              disabled={!isEnable}
              variant="success"
              size="sm"
              onClick={() => {
                append({
                  Type: [],
                  BusinessUnit: [],
                  Product: [],
                  CustomerBranch: [],
                  Qty: 1,
                  Rate: 0,
                  CGS: 0,
                  Discount: 0,
                  Amount: 0,
                  NetAmount: 0,
                  Description: "",
                });
                setTimeout(() => {
                  setFocus(`detail.${fields.length}.BusinessUnit`);
                }, 200);
              }}
            >
              +
            </Button>
            <Button
              disabled={!isEnable}
              variant="danger"
              size="sm"
              onClick={() => {
                remove(index);
                handleNetAmountTotal();
              }}
            >
              -
            </Button>
          </ButtonGroup>
        </td>
      </tr>
    </>
  );
}
