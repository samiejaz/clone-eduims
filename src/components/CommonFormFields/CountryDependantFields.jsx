import { useFormContext } from "react-hook-form"
import {
  useAllCountiesSelectData,
  useAllTehsilsSelectData,
} from "../../hooks/SelectData/useSelectData"
import React, { useState } from "react"
import { FormColumn, FormLabel } from "../Layout/LayoutComponents"
import CDropdown from "../Forms/CDropdown"

const CountryDependentFields = React.forwardRef(
  ({ mode, col = 3, required = true }, ref) => {
    const [CountryID, setCountryID] = useState(0)

    const method = useFormContext()
    const countriesSelectData = useAllCountiesSelectData()
    const tehsilsSelectData = useAllTehsilsSelectData(CountryID)

    React.useImperativeHandle(ref, () => ({
      setCountryID,
    }))

    return (
      <>
        <FormColumn lg={col} xl={col} md={6}>
          <FormLabel>
            Country
            {required && (
              <>
                <span className="text-red-700 fw-bold ">*</span>
              </>
            )}
          </FormLabel>
          <div>
            <CDropdown
              control={method.control}
              name={`CountryID`}
              optionLabel="CountryTitle"
              optionValue="CountryID"
              placeholder="Select a country"
              options={countriesSelectData.data}
              required={required}
              disabled={mode === "view"}
              focusOptions={() => method.setFocus("TehsilID")}
              onChange={(e) => {
                setCountryID(e.value)
                method.resetField("TehsilID")
              }}
            />
          </div>
        </FormColumn>
        <FormColumn lg={col} xl={col} md={6}>
          <FormLabel>
            Tehsil
            {required && (
              <>
                <span className="text-red-700 fw-bold ">*</span>
              </>
            )}
          </FormLabel>
          <div>
            <CDropdown
              control={method.control}
              name={`TehsilID`}
              optionLabel="TehsilTitle"
              optionValue="TehsilID"
              placeholder="Select a tehsil"
              options={tehsilsSelectData.data}
              required={required}
              disabled={mode === "view"}
              focusOptions={() => method.setFocus("BusinessTypeID")}
            />
          </div>
        </FormColumn>
      </>
    )
  }
)

export default CountryDependentFields
