import { toast } from "react-toastify"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { useContext, useEffect, useRef, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import axios from "axios"
import { preventFormByEnterKeySubmission } from "../../utils/CommonFunctions"
import {
  FormColumn,
  FormRow,
  FormLabel,
} from "../../components/Layout/LayoutComponents"
import { TextInput, TextAreaField } from "../../components/Forms/form"
import { Tooltip } from "react-bootstrap"
import SimpleToolbar from "../../components/Toolbars/SimpleToolbar"
import { useKeyCombinationHook } from "../../hooks/hooks"
import SingleFileUpload from "../../components/Forms/SingleFileUpload"
import {
  FormRightsWrapper,
  SingleFormRightsWrapper,
} from "../../components/Wrappers/wrappers"
import { MENU_KEYS } from "../../utils/enums"

const apiUrl = import.meta.env.VITE_APP_API_URL

const defaultValues = {
  CompanyName: "",
  Address: "",
  LandlineNo: "",
  MobileNo: "",
  Email: "",
  Website: "",
  AuthorityPersonName: "",
  AuthorityPersonNo: "",
  AuthorityPersonEmail: "",
  Description: "",
}
function CompanyInfo() {
  return (
    <SingleFormRightsWrapper
      menuKey={MENU_KEYS.GENERAL.COMPANY_INFO_FORM_KEY}
      FormComponent={CompanyInfoForm}
    />
  )
}

function CompanyInfoForm({ mode, userRights }) {
  document.title = "Company Info"
  const [CompanyInfo, setCompanyInfo] = useState([])
  const [reload, setReload] = useState(true)
  const imageRef = useRef()

  const { register, handleSubmit, control, setValue, setFocus } = useForm({
    defaultValues,
  })
  const { user } = useContext(AuthContext)

  useKeyCombinationHook(
    () => {
      handleSubmit(onSubmit)()
    },
    "s",
    true
  )

  useEffect(() => {
    async function fetchCompanyInfo() {
      const { data } = await axios.post(
        `${apiUrl}/EduIMS/GetCompany?LoginUserID=${user.userID}`
      )
      if (data.success === true) {
        setCompanyInfo(data.data)
        setValue("CompanyName", data?.data[0]?.CompanyName)
        setValue("Address", data?.data[0]?.Address)
        setValue("LandlineNo", data?.data[0]?.LandlineNo)
        setValue("MobileNo", data?.data[0]?.MobileNo)
        setValue("Email", data?.data[0]?.Email)
        setValue("Website", data?.data[0]?.Website)
        setValue("AuthorityPersonName", data?.data[0]?.AuthorityPersonName)
        setValue("AuthorityPersonNo", data?.data[0]?.AuthorityPersonNo)
        setValue("AuthorityPersonEmail", data?.data[0]?.AuthorityPersonEmail)
        setValue("Description", data?.data[0]?.Description)
        imageRef.current.setBase64File(
          "data:image/png;base64," + data?.data[0]?.CompanyLogo
        )

        setReload(false)
      }
    }
    if (reload) {
      fetchCompanyInfo()
    }
  }, [reload])

  const companyMutation = useMutation({
    mutationFn: async (formData) => {
      try {
        let newFormData = new FormData()
        newFormData.append("CompanyID", CompanyInfo[0]?.CompanyID)
        newFormData.append("CompanyName", formData.CompanyName)
        newFormData.append("Address", formData?.Address || "")
        newFormData.append("LandlineNo", formData?.LandlineNo || "")
        newFormData.append("MobileNo", formData?.MobileNo || "")
        newFormData.append("Email", formData?.Email || "")
        newFormData.append("Website", formData?.Website || "")
        newFormData.append(
          "AuthorityPersonName",
          formData?.AuthorityPersonName || ""
        )
        newFormData.append(
          "AuthorityPersonNo",
          formData?.AuthorityPersonNo || ""
        )
        newFormData.append(
          "AuthorityPersonEmail",
          formData?.AuthorityPersonEmail || ""
        )
        newFormData.append("Description", formData?.Description || "")
        newFormData.append("EntryUserID", user.userID)

        let businessUnitFile = imageRef.current?.getFile()
        newFormData.append("logo", businessUnitFile)

        const { data } = await axios.post(
          apiUrl + "/EduIMS/CompanyInfoInsertUpdate",
          newFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )

        if (data.success === true) {
          toast.success("Company Info updated successfully!")
          setReload(true)
        } else {
          toast.error(data.message, {
            autoClose: false,
          })
        }
      } catch (error) {
        toast.error(error.message, {
          autoClose: false,
        })
      }
    },
  })

  function onSubmit(data) {
    companyMutation.mutate(data)
  }

  return (
    <>
      <div className="p-2">
        <SimpleToolbar
          onSaveClick={() => handleSubmit(onSubmit)()}
          title={"Company Info"}
        />
        <form onKeyDown={preventFormByEnterKeySubmission}>
          <FormRow>
            <FormColumn lg={3} xl={3} md={6}>
              <FormLabel>Company Name</FormLabel>
              <span className="text-danger fw-bold ">*</span>

              <div>
                <TextInput
                  control={control}
                  ID={"CompanyName"}
                  required={true}
                  focusOptions={() => setFocus("Address")}
                />
              </div>
            </FormColumn>
            <FormColumn lg={9} xl={9} md={6}>
              <FormLabel>Address</FormLabel>
              <div>
                <TextInput
                  control={control}
                  ID={"Address"}
                  required={true}
                  focusOptions={() => setFocus("LandlineNo")}
                />
              </div>
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn lg={3} xl={3} md={6}>
              <FormLabel>Landline No</FormLabel>

              <div>
                <TextInput
                  control={control}
                  ID={"LandlineNo"}
                  required={true}
                  focusOptions={() => setFocus("MobileNo")}
                />
              </div>
            </FormColumn>

            <FormColumn lg={3} xl={3} md={6}>
              <FormLabel>Mobile No</FormLabel>

              <div>
                <TextInput
                  control={control}
                  ID={"MobileNo"}
                  required={true}
                  focusOptions={() => setFocus("Email")}
                />
              </div>
            </FormColumn>
            <FormColumn lg={3} xl={3} md={6}>
              <FormLabel>Email</FormLabel>
              <div>
                <TextInput
                  control={control}
                  ID={"Email"}
                  required={true}
                  focusOptions={() => setFocus("Website")}
                />
              </div>
            </FormColumn>
            <FormColumn lg={3} xl={3} md={6}>
              <FormLabel>Website</FormLabel>

              <div>
                <TextInput
                  control={control}
                  ID={"Website"}
                  required={true}
                  focusOptions={() => setFocus("AuthorityPersonName")}
                />
              </div>
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn lg={4} xl={4} md={6}>
              <FormLabel>Authority Person / CEO Name</FormLabel>

              <div>
                <TextInput
                  control={control}
                  ID={"AuthorityPersonName"}
                  required={true}
                  focusOptions={() => setFocus("AuthorityPersonNo")}
                />
              </div>
            </FormColumn>

            <FormColumn lg={4} xl={4} md={6}>
              <FormLabel>CEO Mobile No</FormLabel>

              <div>
                <TextInput
                  control={control}
                  ID={"AuthorityPersonNo"}
                  required={true}
                  focusOptions={() => setFocus("AuthorityPersonEmail")}
                />
              </div>
            </FormColumn>
            <FormColumn lg={4} xl={4} md={6}>
              <FormLabel>CEO Email</FormLabel>

              <div>
                <TextInput
                  control={control}
                  ID={"AuthorityPersonEmail"}
                  required={true}
                  focusOptions={() => setFocus("Description")}
                />
              </div>
            </FormColumn>
          </FormRow>

          <FormRow>
            <FormColumn lg={12} xl={12} md={6}>
              <FormLabel>Description</FormLabel>
              {/* <input
                as={"textarea"}
                rows={1}
                className="form-control"
                style={{
                  padding: "0.3rem 0.4rem",
                  fontSize: "0.8em",
                }}
                {...register("Description")}
              /> */}
              <div>
                <TextAreaField
                  control={control}
                  name={"Description"}
                  autoResize={true}
                />
              </div>
            </FormColumn>
          </FormRow>

          <FormRow>
            <FormColumn lg={12} xl={12}>
              <Tooltip target=".custom-target-icon" />
              <FormLabel className="relative">
                Logo
                <i
                  className="custom-target-icon pi pi-exclamation-circle p-text-secondary"
                  data-pr-tooltip="Recommended Size (500x500px)"
                  data-pr-position="right"
                  data-pr-at="right+5 top"
                  data-pr-my="left center-2"
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    right: "-20px",
                    top: "1px",
                  }}
                ></i>
              </FormLabel>
              <div>
                {/* <ImageContainer imageRef={imageRef} /> */}
                <SingleFileUpload ref={imageRef} accept="image/*" />
              </div>
            </FormColumn>
          </FormRow>
        </form>
      </div>
    </>
  )
}

export default CompanyInfo
