import React, { useEffect, useState, useRef } from "react"
import { ROUTE_URLS } from "../../utils/enums"
import { Timeline } from "primereact/timeline"
import { Card } from "primereact/card"
import { Button } from "primereact/button"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Controller, useForm } from "react-hook-form"
import NumberInput from "../../components/Forms/NumberInput"
import CDropdown from "../../components/Forms/CDropdown"
import {
  useAllDepartmentsSelectData,
  useAllUsersSelectData,
  useProductsInfoSelectData,
} from "../../hooks/SelectData/useSelectData"
import { Calendar } from "primereact/calendar"
import { classNames } from "primereact/utils"
import { parseISO } from "date-fns"
import {
  addLeadIntroductionOnAction,
  getLeadsFile,
} from "../../api/LeadIntroductionData"
import { toast } from "react-toastify"
import { MeetingDoneFields } from "../../components/Modals/MeetingDoneModal"
import { RevertBackFields } from "../../components/Modals/RevertBackModal"
import { decryptID, encryptID } from "../../utils/crypto"
import { ShowErrorToast } from "../../utils/CommonFunctions"
import { useUserData } from "../../context/AuthContext"
import {
  FormRow,
  FormColumn,
  FormLabel,
} from "../../components/Layout/LayoutComponents"
import {
  SingleFileUploadField,
  TextAreaField,
} from "../../components/Forms/form"
import useLeadsFileViewerHook from "./useLeadsFileViewerHook"
import { Plus } from "lucide-react"
const apiUrl = import.meta.env.VITE_APP_API_URL

let queryKey = "key"

async function getLeadsTimeline({ LeadIntroductionID, LoginUserID }) {
  debugger
  try {
    if (LeadIntroductionID !== undefined) {
      LeadIntroductionID = decryptID(LeadIntroductionID)
      const { data } = await axios.post(
        apiUrl +
          `/data_LeadIntroduction/GetLeadIntroductionDetailData?LoginUserID=${LoginUserID}&LeadIntroductionID=${LeadIntroductionID}`
      )
      return data.data
    } else {
      return []
    }
  } catch (e) {
    ShowErrorToast(e.message)
    return []
  }
}
async function getLeadsTimelineDetail({
  LeadIntroductionDetailID,
  LoginUserID,
}) {
  try {
    if (LeadIntroductionDetailID !== undefined) {
      LeadIntroductionDetailID = decryptID(LeadIntroductionDetailID)
      const { data } = await axios.post(
        apiUrl +
          `/data_LeadIntroduction/GetLeadIntroductionDetailDataWhere?LoginUserID=${LoginUserID}&LeadIntroductionDetailID=${LeadIntroductionDetailID}`
      )
      return data.data
    } else {
      return []
    }
  } catch (e) {
    ShowErrorToast(e.message)
    return []
  }
}

// UI
function getStatusIcon(status) {
  switch (status) {
    case "Forwarded":
      return "pi pi-send"
    case "Quoted":
      return "pi pi-dollar"
    case "Finalized":
      return "pi pi-check"
    case "Closed":
      return "pi pi-times"
    case "Acknowledge":
      return "pi pi-star"
    case "Acknowledged":
      return "pi pi-star"
    case "Meeting Done":
      return "pi pi-check-circle"
    case "Pending":
      return "pi pi-spinner"
  }
}

function getIconColor(status) {
  switch (status?.toLowerCase().replaceAll(" ", "")) {
    case "newlead":
      return "#34568B"
    case "closed":
      return "linear-gradient(90deg, rgba(200, 0, 0, 1) 0%, rgba(128, 0, 0, 1) 100%)"
    case "quoted":
      return "#22C55E"
    case "finalized":
      return "#B35DF7"
    case "forwarded":
      return "#9EBBF9"
    case "acknowledge":
      return "#FCB382"
    case "acknowledged":
      return "#FCB382"
    case "meetingdone":
      return "#FF6F61"
    case "pending":
      return "#DFCFBE"
  }
}
function getGradientIconColor(status) {
  switch (status?.toLowerCase().replaceAll(" ", "")) {
    case "newlead":
      return {
        iconBgColor:
          "linear-gradient(90deg, rgba(200, 0, 0, 1) 0%, rgba(128, 0, 0, 1) 100%)",
        iconColor: "red",
      }
    case "closed":
      return {
        iconBgColor:
          "linear-gradient(90deg, rgba(200, 0, 0, 1) 0%, rgba(128, 0, 0, 1) 100%)",
        iconColor: "red",
      }
    case "quoted":
      return {
        iconBgColor:
          "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(34,197,94,1) 0%, rgba(19,120,56,1) 84%)",
        iconColor: "#22C55E",
      }

    case "finalized":
      return {
        iconBgColor:
          "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(179,93,247,1) 0%, rgba(87,51,116,1) 84%)",
        iconColor: "#B35DF7",
      }

    case "forwarded":
      return {
        iconBgColor:
          "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(158,187,249,1) 0%, rgba(134,154,198,1) 84%)",
        iconColor: "#9EBBF9",
      }
    case "acknowledge":
      return {
        iconBgColor:
          "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(252,179,130,1) 0%, rgba(207,137,90,1) 84%)",
        iconColor: "#FCB382",
      }
    case "acknowledged":
      return {
        iconBgColor:
          " linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(252,179,130,1) 0%, rgba(207,137,90,1) 84%)",
        iconColor: "#FCB382",
      }
    case "meetingdone":
      return {
        iconBgColor:
          "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(255,111,97,1) 0%, rgba(159,60,51,1) 84%)",
        iconColor: "#FF6F61",
      }
    case "pending":
      return {
        iconBgColor:
          "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(223,207,190,1) 0%, rgba(172,155,136,1) 84%)",
        iconColor: "#DFCFBE",
      }
  }
}

const customizedMarker = (item) => {
  return (
    <>
      <span
        className="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1"
        style={{
          background: item.color,
          width: "2rem ",
          height: "2rem ",
          borderRadius: "50% ",
        }}
      >
        <i className={item.icon}></i>
      </span>
    </>
  )
}

const LeadsIntroductionViewer = ({ FormLeadIntroductionID }) => {
  const { LeadIntroductionID } = useParams()
  const user = useUserData()

  let NewLeadIntroductionID = FormLeadIntroductionID ?? LeadIntroductionID

  const { data } = useQuery({
    queryKey: [queryKey, NewLeadIntroductionID],
    queryFn: async () =>
      getLeadsTimeline({
        LeadIntroductionID: NewLeadIntroductionID,
        LoginUserID: user.userID,
      }),
    initialData: [],
    enabled: NewLeadIntroductionID !== undefined,
  })

  let newEvents = data.map((item) => {
    return {
      Status: item.Status,
      Date: formatDate(item.EntryDate),
      icon: getStatusIcon(item.Status),
      color: getIconColor(item.Status),
      Detail: item.Detail,
      LeadIntroductionDetailID: item.LeadIntroductionDetailID,
    }
  })

  const customizedContent = (item) => {
    return (
      <Card title={item.Status} subTitle={item.Date}>
        <p>{item.Detail}</p>
        {!(item.Status === "Acknowledged" || item.Status === "Acknowledge") && (
          <>
            <Link
              to={`${
                ROUTE_URLS.GENERAL.LEADS_INTROUDCTION_DETAIL_VIEWER_ROUTE
              }/${NewLeadIntroductionID}/${
                item.Status === "Meeting Done"
                  ? encryptID("MeetingDone")
                  : encryptID(item.Status)
              }/${encryptID(item.LeadIntroductionDetailID)}`}
              className="p-button p-button-text text-blue-700 font-semibold"
            >
              View More
            </Link>
          </>
        )}
      </Card>
    )
  }

  return (
    <div className="mt-5">
      {!FormLeadIntroductionID && (
        <>
          <Link
            to={ROUTE_URLS.LEAD_INTRODUCTION_ROUTE}
            className="p-button"
            style={{
              color: "white",
              fontWeight: 700,
            }}
          >
            <span
              className="pi pi-arrow-left"
              style={{ marginRight: ".5rem" }}
            ></span>
            Back To Leads
          </Link>
        </>
      )}

      <div style={{ marginBottom: "1rem" }}>
        {newEvents && newEvents.length > 0 ? (
          <>
            <Timeline
              value={newEvents}
              align="alternate"
              className="customized-timeline"
              marker={customizedMarker}
              content={customizedContent}
            />
          </>
        ) : (
          <>
            <div className="flex align-items-center justify-content-center min-h-90vh">
              <div>
                <p className="fw-bold">No data found!</p>
              </div>
            </div>

            {/* <CustomSpinner message="Loading timeline..." /> */}
          </>
        )}
      </div>
    </div>
  )
}

export default LeadsIntroductionViewer

function formatDate(data) {
  let date = new Date(data)
  let hours = date.getHours()
  let minutes = ("0" + date.getMinutes()).slice(-2)
  let seconds = ("0" + date.getSeconds()).slice(-2)
  let ampm = hours >= 12 ? "PM" : "AM"

  // Convert to 12-hour format
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'

  let formattedDate =
    ("0" + date.getDate()).slice(-2) +
    "-" +
    [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ][date.getMonth()] +
    "-" +
    date.getFullYear() +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds +
    " " +
    ampm
  return formattedDate
}
let queryKey2 = "key2"
export const LeadsIntroductionViewerDetail = ({
  FormType,
  FormLeadIntroductionID,
  FormLeadIntroductionDetailID,
}) => {
  const { LeadIntroductionID, LeadIntroductionDetailID, Type } = useParams()

  let newLeadIntroductionID = FormLeadIntroductionID ?? LeadIntroductionID
  let newLeadIntroductionDetailID =
    FormLeadIntroductionDetailID ?? LeadIntroductionDetailID
  let newType = FormType ?? Type

  const TimelineType = decryptID(newType)

  return (
    <div className="mt-5">
      {TimelineType === "Forwarded" ? (
        <>
          <ForwardedFieldsContainer
            LeadIntroductionDetailID={newLeadIntroductionDetailID}
            LeadIntroductionID={newLeadIntroductionID}
            showToolbar={false}
          />
        </>
      ) : (
        <></>
      )}
      {TimelineType === "Quoted" || TimelineType === "Finalized" ? (
        <>
          <QuotedFieldsContainer
            LeadIntroductionDetailID={newLeadIntroductionDetailID}
            LeadIntroductionID={newLeadIntroductionID}
            Type={TimelineType}
            showToolbar={false}
          />
        </>
      ) : (
        <></>
      )}
      {TimelineType === "Closed" ? (
        <>
          <ClosedFieldContainer
            LeadIntroductionDetailID={newLeadIntroductionDetailID}
            LeadIntroductionID={newLeadIntroductionID}
            showToolbar={false}
          />
        </>
      ) : (
        <></>
      )}
      {TimelineType === "MeetingDone" ? (
        <>
          <MeetingDoneFields
            LeadIntroductionID={newLeadIntroductionID}
            LeadIntroductionDetailID={newLeadIntroductionDetailID}
            ShowToolBar={!FormLeadIntroductionID && true}
            ResetFields={false}
            AreFieldsEnable={false}
          />
        </>
      ) : (
        ""
      )}
      {TimelineType === "Pending" ? (
        <>
          <RevertBackFields
            LeadIntroductionID={newLeadIntroductionID}
            LeadIntroductionDetailID={newLeadIntroductionDetailID}
            ShowToolBar={!FormLeadIntroductionID && true}
            ResetFields={false}
            AreFieldsEnable={false}
          />
        </>
      ) : (
        ""
      )}
    </div>
  )
}

function ForwardedFieldsContainer({
  LeadIntroductionDetailID,
  LeadIntroductionID,
  showToolbar,
}) {
  const [isEnable, setIsEnable] = useState(false)

  const method = useForm()

  const departmentSelectData = useAllDepartmentsSelectData()
  const usersSelectData = useAllUsersSelectData()
  const productsSelectData = useProductsInfoSelectData(0, true)
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

  // Forward Fields
  const ForwardFields = (
    <>
      <FormRow>
        <FormColumn lg={6} xl={6} md={6}>
          <FormLabel>
            Department
            <span className="text-danger fw-bold ">*</span>
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
        <FormColumn lg={6} xl={6} md={6}>
          <FormLabel style={{ fontSize: "14px", fontWeight: "bold" }}>
            User
            <span className="text-danger fw-bold ">*</span>
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
          <FormLabel style={{ fontSize: "14px", fontWeight: "bold" }}>
            Meeting Medium
            <span className="text-danger fw-bold ">*</span>
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
            <span className="text-danger fw-bold ">*</span>
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
            <span className="text-danger fw-bold ">*</span>
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
        <FormColumn lg={12} xl={12} md={12} className="col-12">
          <FormLabel>Instructions</FormLabel>
          <TextAreaField
            control={method.control}
            name={"Description"}
            autoResize={true}
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

  const fileRef = useRef()

  return (
    <>
      {showToolbar && (
        <>
          <LeadsViewerButtonToolBar
            LeadIntroductionID={LeadIntroductionID}
            handleCancel={() => setIsEnable(false)}
            handleEdit={() => setIsEnable(true)}
            handleSave={() => method.handleSubmit(onSubmit)()}
            isLoading={mutation.isPending}
            isEnable={isEnable}
          />
        </>
      )}

      {ForwardFields}

      {/* {filePath !== null && fileType !== "" ? (
        <>
          <FormColumn lg={12} xl={12} md={12}>
            <FormLabel>File</FormLabel>
            <div>
              <SingleFileUploadField
                ref={fileRef}
                accept="image/*"
                chooseBtnLabel="Select Image"
                changeBtnLabel="Change Image"
                mode={"view"}
                errorMessage="Upload your logo"
              />
            </div>
          </FormColumn>
        </>
      ) : (
        <></>
      )} */}
    </>
  )
}

function QuotedFieldsContainer({
  LeadIntroductionDetailID,
  LeadIntroductionID,
  Type,
  showToolbar = true,
}) {
  const method = useForm()
  const [isEnable, setIsEnable] = useState(false)

  const user = useUserData()

  const { data } = useQuery({
    queryKey: [queryKey2, LeadIntroductionDetailID],
    queryFn: () =>
      getLeadsTimelineDetail({
        LeadIntroductionDetailID,
        LoginUserID: user.userID,
      }),
    enabled: isEnable === false,
    initialData: [],
  })

  const mutation = useMutation({
    mutationFn: addLeadIntroductionOnAction,
    onSuccess: ({ success }) => {
      if (success) {
        toast.success("Updated successfully")
        setIsEnable(false)
      }
    },
  })

  useEffect(() => {
    if (data.length > 0) {
      method.setValue("Amount", data[0].Amount)
      method.setValue("Description", data[0].Description)
    }
  }, [data])

  const { render, getFileData, setFileError } = useLeadsFileViewerHook({
    fileName: data[0]?.FileName,
    mode: isEnable ? "edit" : "view",
  })

  const QuotedFields = (
    <>
      <FormRow>
        <FormColumn lg={3} xl={3} md={12}>
          <FormLabel>Amount</FormLabel>
          <div>
            <NumberInput
              control={method.control}
              id={`Amount`}
              enterKeyOptions={() => method.setFocus("Description")}
              disabled={!isEnable}
            />
          </div>
        </FormColumn>
        <FormColumn lg={9} xl={9} md={12}>
          <FormLabel>Description</FormLabel>
          <TextAreaField
            control={method.control}
            name={"Description"}
            autoResize={true}
            disabled={!isEnable}
          />
        </FormColumn>
        {render}
      </FormRow>
    </>
  )

  function onSubmit(data) {
    data.AttachmentFile = getFileData()
    if (data.AttachmentFile !== null) {
      mutation.mutate({
        from: Type,
        formData: data,
        userID: user.userID,
        LeadIntroductionID: LeadIntroductionID,
        LeadIntroductionDetailID: LeadIntroductionDetailID,
      })
    } else {
      setFileError()
    }
  }

  return (
    <>
      {showToolbar && (
        <>
          <LeadsViewerButtonToolBar
            LeadIntroductionID={LeadIntroductionID}
            handleCancel={() => setIsEnable(false)}
            handleEdit={() => setIsEnable(true)}
            handleSave={() => method.handleSubmit(onSubmit)()}
            isLoading={mutation.isPending}
            isEnable={isEnable}
          />
        </>
      )}

      {QuotedFields}
    </>
  )
}

function ClosedFieldContainer({
  LeadIntroductionDetailID,
  LeadIntroductionID,
  showToolbar = true,
}) {
  const [isEnable, setIsEnable] = useState(false)
  const user = useUserData()

  const method = useForm()
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
        toast.success("Updated successfully")
        setIsEnable(false)
      }
    },
  })

  useEffect(() => {
    if (data.length > 0 && !method.formState.isDirty) {
      method.setValue("Amount", data[0].Amount)
      method.setValue("Description", data[0].Description)
    }
  }, [data])

  const ClosedFields = (
    <>
      <FormRow>
        <FormColumn lg={3} xl={3} md={12}>
          <FormLabel>Expected Amount</FormLabel>
          <div>
            <NumberInput
              control={method.control}
              id={`Amount`}
              enterKeyOptions={() => method.setFocus("Description")}
              disabled={!isEnable}
            />
          </div>
        </FormColumn>
        <FormColumn lg={9} xl={9} md={12}>
          <FormLabel>Instructions</FormLabel>
          <TextAreaField
            control={method.control}
            name={"Description"}
            autoResize={true}
            disabled={!isEnable}
          />
        </FormColumn>
      </FormRow>
    </>
  )

  function onSubmit(data) {
    mutation.mutate({
      from: "Closed",
      formData: data,
      userID: user.userID,
      LeadIntroductionID: LeadIntroductionID,
      LeadIntroductionDetailID: LeadIntroductionDetailID,
    })
  }

  return (
    <>
      {showToolbar && (
        <>
          <LeadsViewerButtonToolBar
            LeadIntroductionID={LeadIntroductionID}
            handleCancel={() => setIsEnable(false)}
            handleEdit={() => setIsEnable(true)}
            handleSave={() => method.handleSubmit(onSubmit)()}
            isLoading={mutation.isPending}
            isEnable={isEnable}
          />
        </>
      )}

      {ClosedFields}
    </>
  )
}

export function LeadsViewerButtonToolBar({
  LeadIntroductionID,
  handleEdit,
  handleCancel,
  handleSave,
  isLoading,
  isEnable,
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Link
        to={
          ROUTE_URLS.GENERAL.LEADS_INTROUDCTION_VIEWER_ROUTE +
          "/" +
          LeadIntroductionID
        }
      >
        <Button
          label={"Back To Timeline"}
          icon="pi pi-arrow-left"
          type="button"
          severity="success"
          className="p-button-success rounded"
          pt={{
            label: {
              className: "hidden lg:block xl:block md:block",
            },
          }}
          link
          text
        />
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Button
          label={"Cancel"}
          icon="pi pi-times"
          className="rounded"
          type="button"
          severity="secondary"
          onClick={handleCancel}
          disabled={!isEnable}
          pt={{
            label: {
              className: "hidden lg:block xl:block md:block",
            },
          }}
        />
        <Button
          label={"Edit"}
          icon="pi pi-pencil"
          type="button"
          severity="warning"
          className="p-button-success rounded"
          onClick={handleEdit}
          disabled={isEnable}
          pt={{
            label: {
              className: "hidden lg:block xl:block md:block",
            },
          }}
        />
        <Button
          label={"Update"}
          icon="pi pi-check"
          type="button"
          severity="success"
          className="p-button-success rounded"
          onClick={handleSave}
          loading={isLoading}
          loadingIcon="pi pi-spin pi-cog"
          disabled={!isEnable}
          pt={{
            label: {
              className: "hidden lg:block xl:block md:block",
            },
          }}
        />
      </div>
    </div>
  )
}

function getFileType(fileType) {
  switch (fileType) {
    case "xlsx":
      return "microsoftxlsx"
    case "docx":
      return "microsoftdoc"
    default:
      return fileType
  }
}

export function LeadsViewerDetailOnLeadsForm({
  LeadIntroductionID,
  LoginUserID,
}) {
  const { data, isLoading } = useQuery({
    queryKey: [queryKey, LeadIntroductionID],
    queryFn: async () =>
      getLeadsTimeline({
        LeadIntroductionID: LeadIntroductionID,
        LoginUserID: LoginUserID,
      }),
    initialData: [],
    enabled: LeadIntroductionID !== undefined,
  })

  return (
    <>
      {isLoading ? (
        <CustomSpinner />
      ) : (
        <>
          <div className="flex flex-column mt-5 gap-5 w-full">
            {data.map((item) => (
              <div
                key={item.LeadIntroductionDetailID}
                className="w-full lead-timeline-shadow rounded"
              >
                <LeadsViewerDetailOnLeads
                  item={item}
                  LeadIntroductionID={LeadIntroductionID}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}

const LeadsViewerDetailOnLeads = ({ item, LeadIntroductionID }) => {
  const containerRef = useRef()
  const iconRef = useRef()

  const onCollapse = () => {
    if (containerRef.current?.className.includes("expanded")) {
      containerRef.current.className = "px-2 collapsed"
      iconRef.current.className = "pi pi-plus"
    } else {
      containerRef.current.className = "px-2 expanded"
      iconRef.current.className = "pi pi-minus"
    }
  }

  return (
    <>
      <LeadsViewerDetailOnLeadsFormHeader
        key={item.LeadIntroductionDetailID}
        status={item.Status}
        date={item.EntryDate}
        description={item.Detail}
        icon={"send"}
        onCollapse={onCollapse}
        iconRef={iconRef}
      />
      <div className="px-2 expanded" id="content" ref={containerRef}>
        <LeadsIntroductionViewerDetail
          FormLeadIntroductionID={LeadIntroductionID}
          FormLeadIntroductionDetailID={encryptID(
            item.LeadIntroductionDetailID
          )}
          FormType={`${
            item.Status === "Meeting Done"
              ? encryptID("MeetingDone")
              : encryptID(item.Status)
          }`}
        />
      </div>
    </>
  )
}

const LeadsViewerDetailOnLeadsFormHeader = ({
  status,
  icon,
  date,
  description,
  onCollapse,
  iconRef,
}) => {
  const { iconBgColor, iconColor } = getGradientIconColor(status)
  return (
    <>
      <div
        className="w-full px-4 py-2"
        style={{ background: iconBgColor, color: "white" }}
      >
        <div className="w-full flex align-items-center justify-content-between">
          <div>
            <div className="flex align-items-center justify-content-start gap-4">
              <i
                className={`${getStatusIcon(status)} p-3 bg-white rounded`}
                style={{
                  color: iconColor,
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              ></i>
              <h1 className="p-0 m-0">{status}</h1>
              <span>{formatDate(date)}</span>
            </div>
            <div className="flex align-items-center justify-content-start gap-4 mt-1">
              <p className="font-bold p-0 m-0">Detail: </p>
              <p className="p-0 m-0">{description}</p>
            </div>
          </div>
          <div>
            <i className="pi pi-minus" ref={iconRef} onClick={onCollapse}></i>
          </div>
        </div>
      </div>
    </>
  )
}
