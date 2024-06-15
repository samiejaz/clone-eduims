import { useContext, useEffect, useRef, useState } from "react"
import { useFormContext } from "react-hook-form"
import { preventFormByEnterKeySubmission } from "../../utils/CommonFunctions"
import { fetchNewCustomerById } from "../../api/NewCustomerData"
import { AuthContext } from "../../context/AuthContext"
import { FormRow, FormColumn, FormLabel } from "../Layout/LayoutComponents"
import TextInput from "../Forms/TextInput"
import CheckBox from "../Forms/CheckBox"
import { CustomerAndLeadsInfo } from "../../hooks/ModalHooks/useLeadsIntroductionModalHook"

function CustomerEntry(props) {
  const { CustomerID, isEnable = true } = props
  const { user } = useContext(AuthContext)
  const [CustomerData, setCustomerData] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const countryRef = useRef()

  const { register, setValue, control, clearErrors } = useFormContext()

  useEffect(() => {
    async function fetchOldCustomer() {
      if (CustomerID !== undefined && CustomerID !== 0 && CustomerID !== null) {
        const data = await fetchNewCustomerById(CustomerID, user.userID)
        setCustomerData(data)
        setIsLoading(false)
      }
    }
    if (CustomerID !== 0 && CustomerID !== undefined) {
      fetchOldCustomer()
    }
  }, [CustomerID])

  useEffect(() => {
    if (CustomerID !== 0 && CustomerData?.data) {
      clearErrors()
      setValue("CountryID", CustomerData.data[0].CountryID ?? null)
      countryRef.current?.setCountryID(CustomerData.data[0].CountryID ?? null)
      setValue("TehsilID", CustomerData.data[0].TehsilID)
      setValue("BusinessTypeID", CustomerData.data[0].BusinessTypeID ?? null)
      setValue("BusinessNatureID", CustomerData.data[0].BusinessNature ?? "")
      setValue("CustomerName", CustomerData?.data[0]?.CustomerName)
      setValue(
        "CustomerBusinessName",
        CustomerData?.data[0]?.CustomerBusinessName ?? ""
      )
      setValue(
        "CustomerBusinessAddress",
        CustomerData?.data[0]?.CustomerBusinessAddress ?? ""
      )
      setValue(
        "ContactPerson1Name",
        CustomerData?.data[0]?.ContactPerson1Name ?? ""
      )
      setValue(
        "ContactPerson1No",
        CustomerData?.data[0]?.ContactPerson1No ?? ""
      )
      setValue(
        "ContactPerson1Email",
        CustomerData?.data[0]?.ContactPerson1Email ?? ""
      )
      setValue("Description", CustomerData?.data[0]?.Description ?? "")
      setValue("InActive", CustomerData?.data[0]?.InActive ?? "")
    }
  }, [CustomerID, CustomerData])

  return (
    <>
      <form onKeyDown={preventFormByEnterKeySubmission}>
        <FormRow>
          <FormColumn lg={6} xl={6} md={6}>
            <FormLabel>Customer Name</FormLabel>
            <span className="text-red-700 fw-bold ">*</span>
            <div>
              <TextInput
                control={control}
                ID={"CustomerName"}
                focusOptions={() => setFocus("CustomerBusinessName")}
                isEnable={isEnable}
                required={true}
              />
            </div>
          </FormColumn>
          <FormColumn lg={6} xl={6} md={6}>
            <FormLabel>Customer Business Name</FormLabel>
            <span className="text-red-700 fw-bold ">*</span>
            <div>
              <TextInput
                control={control}
                ID={"CustomerBusinessName"}
                focusOptions={() => setFocus("CustomerBusinessAddress")}
                isEnable={isEnable}
                required={true}
              />
            </div>
          </FormColumn>
        </FormRow>

        <FormRow>
          <FormColumn lg={12} xl={12} md={6}>
            <FormLabel>Customer Business Address</FormLabel>

            <div>
              <TextInput
                control={control}
                ID={"CustomerBusinessAddress"}
                focusOptions={() => setFocus("ContactPerson1Name")}
                isEnable={isEnable}
              />
            </div>
          </FormColumn>
        </FormRow>
        <FormRow>
          <CustomerAndLeadsInfo
            mode={!isEnable ? "view" : "new"}
            col={6}
            required={false}
            countryRef={countryRef}
          />
        </FormRow>
        <FormRow>
          <FormColumn lg={4} xl={4} md={6}>
            <FormLabel>Contact Name</FormLabel>
            <div>
              <TextInput
                control={control}
                ID={"ContactPerson1Name"}
                focusOptions={() => setFocus("ContactPerson1No")}
                isEnable={isEnable}
              />
            </div>
          </FormColumn>

          <FormColumn lg={4} xl={4} md={6}>
            <FormLabel>Contact No</FormLabel>
            <div>
              <TextInput
                control={control}
                ID={"ContactPerson1No"}
                focusOptions={() => setFocus("ContactPerson1Email")}
                isEnable={isEnable}
              />
            </div>
          </FormColumn>

          <FormColumn lg={4} xl={4} md={6}>
            <FormLabel> Email</FormLabel>
            <div>
              <TextInput
                control={control}
                ID={"ContactPerson1Email"}
                focusOptions={() => setFocus("Description")}
                isEnable={isEnable}
              />
            </div>
          </FormColumn>
        </FormRow>

        <FormRow>
          <FormColumn lg={12} xl={12} md={6}>
            <FormLabel>Descripiton</FormLabel>
            <div>
              <textarea
                rows={"1"}
                disabled={isEnable}
                className="p-inputtext"
                style={{
                  padding: "0.3rem 0.4rem",
                  fontSize: "0.8em",
                  width: "100%",
                }}
                {...register("Description")}
              />
            </div>
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn lg={3} xl={3} md={6}>
            <div className="mt-2">
              <CheckBox
                control={control}
                ID={"InActive"}
                Label={"InActive"}
                isEnable={isEnable}
              />
            </div>
          </FormColumn>
        </FormRow>
      </form>
    </>
  )
}

export default CustomerEntry
