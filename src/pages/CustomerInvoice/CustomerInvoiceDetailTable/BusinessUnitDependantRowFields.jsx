import React, { useContext, useEffect, useState } from "react"
import { Controller, FormProvider, useFormContext } from "react-hook-form"
import {
  fetchAllCustomerBranchesData,
  fetchAllProductsForSelect,
  fetchAllServicesForSelect,
} from "../../../api/SelectData"
import { useQuery } from "@tanstack/react-query"
import { SELECT_QUERY_KEYS } from "../../../utils/enums"
import { NumberInput, TextAreaField } from "../../../components/Forms/form"
import { InputSwitch } from "primereact/inputswitch"
import { classNames } from "primereact/utils"
import { Button } from "primereact/button"
import CDropdown from "../../../components/Forms/CDropdown"
import { CustomerBranchDataContext } from "../NewCustomerInvoice"
import { InputText } from "primereact/inputtext"

export const CustomerInvoiceDetailTableRowComponent = ({
  item,
  index,
  disable,
  typesOptions,
  BusinessUnitSelectData,
  pageTitles,
  remove,
}) => {
  const method = useFormContext()
  const [invoiceType, setInvoiceType] = useState("")
  const [isFree, setIsFree] = useState(false)

  useEffect(() => {
    setInvoiceType(
      method.getValues(`CustomerInvoiceDetail.${index}.InvoiceType`)
    )
    setIsFree(method.getValues(`CustomerInvoiceDetail.${index}.IsFree`))
  }, [])

  return (
    <>
      <tr key={item.id}>
        <td>
          <InputText
            id="RowID"
            readOnly
            className="form-control"
            style={{ padding: "0.25rem 0.4rem", fontSize: "0.9em" }}
            value={index + 1}
            pt={{
              root: {
                style: {
                  width: "50px",
                },
              },
            }}
            disabled={disable}
          />
        </td>
        <td>
          <Controller
            control={method.control}
            name={`CustomerInvoiceDetail.${index}.IsFree`}
            render={({ field, fieldState }) => (
              <>
                <InputSwitch
                  inputId={field.name}
                  checked={field.value}
                  inputRef={field.ref}
                  disabled={disable}
                  className={classNames({ "p-invalid": fieldState.error })}
                  onChange={(e) => {
                    field.onChange(e.value)
                    setIsFree(e.value)
                    if (e.value) {
                      method.setValue(`CustomerInvoiceDetail.${index}.Rate`, 0)
                      method.setValue(
                        `CustomerInvoiceDetail.${index}.Amount`,
                        0
                      )
                      method.setValue(
                        `CustomerInvoiceDetail.${index}.Discount`,
                        0
                      )
                      method.setValue(
                        `CustomerInvoiceDetail.${index}.NetAmount`,
                        0
                      )
                    }
                  }}
                />
              </>
            )}
          />
        </td>
        <td style={{ minWidth: "2rem", width: "2rem" }}>
          <CDropdown
            control={method.control}
            options={typesOptions}
            name={`CustomerInvoiceDetail.${index}.InvoiceType`}
            placeholder="Select an invoice type"
            required={true}
            showOnFocus={true}
            disabled={disable}
            focusOptions={() => method.setFocus(`detail.${index}.BusinessUnit`)}
            onChange={(e) => {
              setInvoiceType(e.value)
              if (e.value === "Product") {
                method.setValue(
                  `CustomerInvoiceDetail.${index}.ServiceInfoID`,
                  null
                )
              }
            }}
          />
        </td>

        <FormProvider {...method}>
          <CustomerBranchDetailField
            key={"customerbranchfields_" + index}
            index={index}
            disable={disable}
            pageTitles={pageTitles}
          />
          <BusinessUnitDependantRowFields
            key={"businessunitdependentfields_" + index}
            index={index}
            disable={disable}
            BusinessUnitSelectData={BusinessUnitSelectData}
            invoiceType={invoiceType}
            pageTitles={pageTitles}
          />
        </FormProvider>
        <td style={{ width: "5rem", minWidth: "5rem" }}>
          <NumberInput
            id={`CustomerInvoiceDetail.${index}.Qty`}
            control={method.control}
            onChange={(e) => {
              const rate = parseFloat(
                0 + method.getValues([`CustomerInvoiceDetail.${index}.Rate`])
              )
              const disc = parseFloat(
                0 +
                  method.getValues([`CustomerInvoiceDetail.${index}.Discount`])
              )
              method.setValue(
                `CustomerInvoiceDetail.${index}.Amount`,
                e.value * rate
              )
              method.setValue(
                `CustomerInvoiceDetail.${index}.NetAmount`,
                e.value * rate - disc
              )
            }}
            disabled={disable}
            inputClassName="form-control"
            useGrouping={false}
            enterKeyOptions={() => method.setFocus("Rate")}
          />
        </td>
        <td style={{ width: "5rem", minWidth: "5rem" }}>
          <NumberInput
            id={`CustomerInvoiceDetail.${index}.Rate`}
            control={method.control}
            onChange={(e) => {
              const qty = parseFloat(
                0 + method.getValues([`CustomerInvoiceDetail.${index}.Qty`])
              )
              const disc = parseFloat(
                0 + method.getValues([`detail.${index}.Discount`])
              )
              method.setValue(
                `CustomerInvoiceDetail.${index}.Amount`,
                e.value * qty
              )
              method.setValue(
                `CustomerInvoiceDetail.${index}.NetAmount`,
                e.value * qty - disc
              )
              method.setValue(`CustomerInvoiceDetail.${index}.Rate`, e.value)
            }}
            disabled={disable || isFree}
            mode="decimal"
            maxFractionDigits={2}
            inputClassName="form-control"
            useGrouping={false}
          />
        </td>
        <td style={{ width: "5rem", minWidth: "5rem" }}>
          <NumberInput
            id={`CustomerInvoiceDetail.${index}.CGS`}
            control={method.control}
            onChange={(e) => {
              method.setValue(`CustomerInvoiceDetail.${index}.CGS`, e.value)
            }}
            disabled={disable}
            mode="decimal"
            maxFractionDigits={2}
            inputClassName="form-control"
            useGrouping={false}
          />
        </td>
        <td style={{ width: "5rem", minWidth: "5rem" }}>
          <NumberInput
            id={`CustomerInvoiceDetail.${index}.Amount`}
            control={method.control}
            disabled={true}
            mode="decimal"
            maxFractionDigits={2}
            inputClassName="form-control"
            useGrouping={false}
          />
        </td>
        <td style={{ width: "5rem", minWidth: "5rem" }}>
          <NumberInput
            id={`CustomerInvoiceDetail.${index}.Discount`}
            control={method.control}
            onChange={(e) => {
              const amount = parseFloat(
                0 + method.getValues([`CustomerInvoiceDetail.${index}.Amount`])
              )

              method.setValue(
                `CustomerInvoiceDetail.${index}.NetAmount`,
                amount - e.value
              )
            }}
            disabled={disable || isFree}
            mode="decimal"
            maxFractionDigits={2}
            inputClassName="form-control"
            useGrouping={false}
          />
        </td>
        <td style={{ width: "5rem", minWidth: "5rem" }}>
          <NumberInput
            id={`CustomerInvoiceDetail.${index}.NetAmount`}
            control={method.control}
            disabled={true}
            mode="decimal"
            maxFractionDigits={2}
            inputClassName="form-control"
            useGrouping={false}
          />
        </td>
        <td style={{ minWidth: "400px" }}>
          <TextAreaField
            control={method.control}
            name={`CustomerInvoiceDetail.${index}.DetailDescription`}
            disabled={disable}
          />
        </td>
        <td>
          <Button
            icon="pi pi-minus"
            severity="danger"
            size="sm"
            type="button"
            style={{
              padding: "0.25rem .7rem",
              borderRadius: "16px",
              fontSize: "0.9em",
            }}
            onClick={() => remove(index)}
          />
        </td>
      </tr>
    </>
  )
}

const BusinessUnitDependantRowFields = ({
  index,
  BusinessUnitSelectData,
  disable,
  invoiceType,
  pageTitles,
}) => {
  const [BusinessUnitID, setBusinessUnitID] = useState(0)

  const method = useFormContext()

  const { data: ProductsInfoSelectData } = useQuery({
    queryKey: [
      SELECT_QUERY_KEYS.PRODUCTS_INFO_SELECT_QUERY_KEY,
      BusinessUnitID,
      index,
    ],
    queryFn: () => fetchAllProductsForSelect(BusinessUnitID),
    initialData: [],
  })
  const { data: ServicesInfoSelectData } = useQuery({
    queryKey: [
      SELECT_QUERY_KEYS.SERVICES_SELECT_QUERY_KEY,
      BusinessUnitID,
      index,
    ],
    queryFn: () => fetchAllServicesForSelect(BusinessUnitID),
    initialData: [],
  })

  useEffect(() => {
    setBusinessUnitID(
      method.getValues(`CustomerInvoiceDetail.${index}.BusinessUnitID`)
    )
  }, [])

  return (
    <>
      <td>
        <CDropdown
          control={method.control}
          name={`CustomerInvoiceDetail.${index}.BusinessUnitID`}
          optionLabel="BusinessUnitName"
          optionValue="BusinessUnitID"
          placeholder="Select a business unit"
          options={BusinessUnitSelectData}
          required={true}
          disabled={disable}
          onChange={(e) => {
            setBusinessUnitID(e.value)
            method.setValue(`CustomerInvoiceDetail.${index}.ProductInfoID`, [])
          }}
          filter={true}
          focusOptions={() => method.setFocus(`detail.${index}.BranchID`)}
        />
      </td>
      <td>
        <CDropdown
          control={method.control}
          name={`CustomerInvoiceDetail.${index}.ProductInfoID`}
          optionLabel="ProductInfoTitle"
          optionValue="ProductInfoID"
          placeholder={`Select a ${pageTitles?.product || "product"}`}
          options={ProductsInfoSelectData}
          required={true}
          disabled={disable}
          filter={true}
          focusOptions={() =>
            method.setFocus(`CustomerInvoiceDetail.${index}.Rate`)
          }
        />
      </td>
      <td>
        <CDropdown
          control={method.control}
          name={`CustomerInvoiceDetail.${index}.ServiceInfoID`}
          optionLabel="ProductInfoTitle"
          optionValue="ProductInfoID"
          placeholder="Select a service"
          options={ServicesInfoSelectData}
          required={invoiceType === "Service"}
          disabled={disable || invoiceType === "Product"}
          filter={true}
          focusOptions={() =>
            method.setFocus(`CustomerInvoiceDetail.${index}.Qty`)
          }
          errorMessage=""
        />
      </td>
    </>
  )
}

const CustomerBranchDetailField = ({ pageTitles, index, disable }) => {
  const method = useFormContext()
  const { AccountID } = useContext(CustomerBranchDataContext)

  const { data } = useQuery({
    queryKey: [SELECT_QUERY_KEYS.CUSTOMER_BRANCHES_SELECT_QUERY_KEY, AccountID],
    queryFn: () => fetchAllCustomerBranchesData(AccountID),
    enabled: AccountID !== 0,
    initialData: [],
  })
  return (
    <>
      <td>
        <CDropdown
          control={method.control}
          name={`CustomerInvoiceDetail.${index}.CustomerBranch`}
          optionLabel="BranchTitle"
          optionValue="BranchID"
          placeholder={`Select a ${
            pageTitles?.branch?.toLowerCase() ?? "branch"
          }`}
          options={data}
          required={true}
          disabled={disable}
          filter={true}
          focusOptions={() =>
            method.setFocus(`CustomerInvoiceDetail.${index}.ProductInfo`)
          }
        />
      </td>
    </>
  )
}
