import React from "react"
import { FormColumn, FormLabel } from "../Layout/LayoutComponents"
import CDatePicker from "../Forms/CDatePicker"
import { useFormContext } from "react-hook-form"

const DateToAndDateFromFields = ({
  cols = 2,
  onChangeDateTo = () => null,
  onChangeDateFrom = () => null,
}) => {
  const method = useFormContext()
  return (
    <>
      <FormColumn lg={cols} xl={cols} md={6}>
        <FormLabel style={{ fontSize: "14px", fontWeight: "bold" }}>
          Date From
          <span className="text-danger fw-bold ">*</span>
        </FormLabel>
        <div>
          <CDatePicker
            control={method.control}
            name={"DateFrom"}
            onChange={onChangeDateFrom}
          />
        </div>
      </FormColumn>
      <FormColumn lg={cols} xl={cols} md={6}>
        <FormLabel style={{ fontSize: "14px", fontWeight: "bold" }}>
          Date To
          <span className="text-danger fw-bold ">*</span>
        </FormLabel>
        <div>
          <CDatePicker
            control={method.control}
            name={"DateTo"}
            onChange={onChangeDateTo}
          />
        </div>
      </FormColumn>
    </>
  )
}

export default DateToAndDateFromFields
