import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import {
  useAllDepartmentsSelectData,
  useAllUsersSelectData,
  useProductsInfoSelectData,
} from "../../hooks/SelectData/useSelectData"
import { useUserData } from "../../context/AuthContext"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getLeadsTimelineDetail } from "./LeadsTimelineData"
import { addLeadIntroductionOnAction } from "../../api/LeadIntroductionData"
import CDropdown from "../../components/Forms/CDropdown"
import {
  FormRow,
  FormColumn,
  FormLabel,
} from "../../components/Layout/LayoutComponents"
import { LeadsViewerButtonToolBar } from "./LeadsIntroductionViewer"
import { Calendar } from "primereact/calendar"
import { classNames } from "primereact/utils"

let queryKey2 = "key2"
export default function ForwardedTimelinePage({
  LeadIntroductionDetailID,
  LeadIntroductionID,
}) {
  const [isEnable, setIsEnable] = useState(false)

  const method = useForm()

  const departmentSelectData = useAllDepartmentsSelectData()
  const usersSelectData = useAllUsersSelectData()
  const productsSelectData = useProductsInfoSelectData()
  const user = useUserData()

  const { data } = useQuery({
    queryKey: [queryKey2, LeadIntroductionDetailID],
    queryFn: () =>
      getLeadsTimelineDetail({
        LeadIntroductionDetailID,
        LoginUserID: user.userID,
      }),
    initialData: [],
  })

  const mutation = useMutation({
    mutationFn: addLeadIntroductionOnAction,
    onSuccess: ({ success }) => {
      if (success) {
        setIsEnable(false)
        toast.success("Updated successfully")
        method.clearErrors()
      }
    },
  })

  useEffect(() => {
    if (data.length > 0 && !method.formState.isDirty) {
      method.setValue("DepartmentID", data[0].DepartmentID)
      method.setValue("UserID", data[0].UserID)
      method.setValue("MeetingPlace", data[0].MeetingPlace)
      method.setValue("MeetingTime", parseISO(data[0].MeetingTime))
      method.setValue("DepartmentID", data[0].DepartmentID)
      method.setValue("ProductInfoID", data[0].RecommendedProductID)
      method.setValue("Description", data[0].Description)
    }
  }, [data])

  let filePath =
    data[0]?.FileName === null
      ? null
      : "http://192.168.9.110:90/api/data_LeadIntroduction/DownloadLeadProposal?filename=" +
        data[0]?.FileName
  let fileType = data[0]?.FileType === null ? null : data[0]?.FileType.slice(1)
  // Forward Fields
  const ForwardFields = (
    <>
      <FormRow>
        <FormColumn lg={4} xl={4} md={6}>
          <FormLabel>
            Department
            <span className="text-red-700 fw-bold ">*</span>
          </FormLabel>
          <div>
            <CDropdown
              control={method.control}
              name={`DepartmentID`}
              optionLabel="DepartmentName"
              optionValue="DepartmentID"
              placeholder="Select a department"
              options={departmentSelectData.data}
              focusOptions={() => method.setFocus("InActive")}
              showClear={true}
              disabled={!isEnable}
            />
          </div>
        </FormColumn>
        <FormColumn lg={4} xl={4} md={6}>
          <FormLabel>
            User
            <span className="text-red-700 fw-bold ">*</span>
          </FormLabel>
          <div>
            <CDropdown
              control={method.control}
              name={`UserID`}
              optionLabel="UserName"
              optionValue="UserID"
              placeholder="Select a user"
              options={usersSelectData.data}
              focusOptions={() => method.setFocus("InActive")}
              showClear={true}
              disabled={!isEnable}
            />
          </div>
        </FormColumn>
      </FormRow>
      <FormRow>
        <FormColumn lg={4} xl={4} md={6}>
          <FormLabel>
            Meeting Medium
            <span className="text-red-700 fw-bold ">*</span>
          </FormLabel>
          <div>
            <CDropdown
              control={method.control}
              name={`MeetingPlace`}
              placeholder="Select a place"
              options={[
                { label: "At Client Site", value: "AtClientSite" },
                { label: "At Office", value: "AtOffice" },
                { label: "Online", value: "Online" },
              ]}
              required={true}
              focusOptions={() => method.setFocus("MeetingTime")}
              disabled={!isEnable}
            />
          </div>
        </FormColumn>
        <FormColumn lg={4} xl={4} md={6}>
          <FormLabel>
            Meeting Date & Time
            <span className="text-red-700 fw-bold ">*</span>
          </FormLabel>
          <div>
            <Controller
              name="MeetingTime"
              control={method.control}
              rules={{ required: "Date is required." }}
              render={({ field, fieldState }) => (
                <>
                  <Calendar
                    inputId={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    dateFormat="dd-M-yy"
                    style={{ width: "100%" }}
                    className={classNames({ "p-invalid": fieldState.error })}
                    showTime
                    showIcon
                    hourFormat="12"
                    disabled={!isEnable}
                  />
                </>
              )}
            />
          </div>
        </FormColumn>
        <FormColumn lg={4} xl={4} md={6}>
          <FormLabel>
            Recomended Product
            <span className="text-red-700 fw-bold ">*</span>
          </FormLabel>
          <div>
            <CDropdown
              control={method.control}
              name={`ProductInfoID`}
              optionLabel="ProductInfoTitle"
              optionValue="ProductInfoID"
              placeholder="Select a product"
              options={productsSelectData.data}
              required={true}
              focusOptions={() => method.setFocus("Description")}
              disabled={!isEnable}
            />
          </div>
        </FormColumn>
      </FormRow>
      <FormRow>
        <FormColumn lg={4} xl={4} md={6}>
          <FormLabel>Instructions</FormLabel>
          <input
            as={"textarea"}
            rows={1}
            className="form-control"
            style={{
              padding: "0.3rem 0.4rem",
              fontSize: "0.8em",
            }}
            {...method.register("Description")}
            disabled={!isEnable}
          />
        </FormColumn>
      </FormRow>
    </>
  )

  function onSubmit(data) {
    if (
      (data.DepartmentID === undefined || data.DepartmentID === null) &&
      (data.UserID === undefined || data.DepartmentID === null)
    ) {
      method.setError("DepartmentID", { type: "required" })
      method.setError("UserID", { type: "required" })
    } else {
      mutation.mutate({
        from: "Forward",
        formData: data,
        userID: user.userID,
        LeadIntroductionID: LeadIntroductionID,
        LeadIntroductionDetailID: LeadIntroductionDetailID,
      })
    }
  }

  return (
    <>
      <LeadsViewerButtonToolBar
        LeadIntroductionID={LeadIntroductionID}
        handleCancel={() => setIsEnable(false)}
        handleEdit={() => setIsEnable(true)}
        handleSave={() => method.handleSubmit(onSubmit)()}
        isLoading={mutation.isPending}
        isEnable={isEnable}
      />
      {ForwardFields}

      {filePath !== null && fileType !== "" ? (
        <>
          <FormLabel>File</FormLabel>
        </>
      ) : (
        <></>
      )}
    </>
  )
}
