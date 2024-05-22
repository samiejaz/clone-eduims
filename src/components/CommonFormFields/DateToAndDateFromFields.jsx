import React from "react"
import { FormColumn, FormLabel } from "../Layout/LayoutComponents"
import CDatePicker from "../Forms/CDatePicker"
import { useFormContext } from "react-hook-form"

const DateToAndDateFromFields = ({
  cols = 2,
  onChangeDateTo = () => null,
  onChangeDateFrom = () => null,
  dateToLabel = "Date To",
  dateFromLabel = "Date From",
  showDateFrom = true,
  showDateTo = true,
}) => {
  const method = useFormContext()
  return (
    <>
      {showDateFrom && (
        <>
          <FormColumn lg={cols} xl={cols} md={6}>
            <FormLabel style={{ fontSize: "14px", fontWeight: "bold" }}>
              {dateFromLabel}
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
        </>
      )}
      {showDateTo && (
        <>
          <FormColumn lg={cols} xl={cols} md={6}>
            <FormLabel style={{ fontSize: "14px", fontWeight: "bold" }}>
              {dateToLabel}
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
      )}
    </>
  )
}

export default DateToAndDateFromFields
