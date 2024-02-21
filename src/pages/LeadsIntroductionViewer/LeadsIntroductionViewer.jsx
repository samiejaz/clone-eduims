import React, { useEffect, useState, useRef } from "react";
import { ROUTE_URLS } from "../../utils/enums";
import { Timeline } from "primereact/timeline";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Col, Form, Row } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import NumberInput from "../../components/Forms/NumberInput";
import CDropdown from "../../components/Forms/CDropdown";
import {
  useAllDepartmentsSelectData,
  useAllUsersSelectData,
  useProductsInfoSelectData,
} from "../../hooks/SelectData/useSelectData";
import { Calendar } from "primereact/calendar";
import { classNames } from "primereact/utils";
import { parseISO } from "date-fns";
import { addLeadIntroductionOnAction } from "../../api/LeadIntroductionData";
import { toast } from "react-toastify";
import { MeetingDoneFields } from "../../components/Modals/MeetingDoneModal";
import { RevertBackFields } from "../../components/Modals/RevertBackModal";

const apiUrl = import.meta.env.VITE_APP_API_URL;

let parentRoute = ROUTE_URLS.GENERAL.LEADS_INTROUDCTION_VIEWER_ROUTE;
let editRoute = `${parentRoute}/edit/`;
let newRoute = `${parentRoute}/new`;
let viewRoute = `${parentRoute}/`;
let detail = "#22C55E";
let queryKey = "key";
// let queryKey = QUERY_KEYS.LEAD_INTRODUCTION_QUERY_KEY;

//api/data_LeadIntroduction/GetLeadIntroductionDetailData?LoginUserID=1&LeadIntroductionID=7
const user = JSON.parse(localStorage.getItem("user"));

const LeadsIntroductionViewer = () => {
  const { LeadIntroductionID } = useParams();
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: [queryKey, +LeadIntroductionID],
    queryFn: async () => {
      const { data } = await axios.post(
        apiUrl +
          `/data_LeadIntroduction/GetLeadIntroductionDetailData?LoginUserID=${user.userID}&LeadIntroductionID=${LeadIntroductionID}`
      );
      return data.data;
    },
    initialData: [],
  });

  let newEvents = data.map((item) => {
    return {
      Status: item.Status,
      Date: formatDate(item.EntryDate),
      icon: getStatusIcon(item.Status),
      color: getIconColor(item.Status),
      Detail: item.Detail,
      LeadIntroductionDetailID: item.LeadIntroductionDetailID,
    };
  });

  function getStatusIcon(status) {
    switch (status) {
      case "Forwarded":
        return "pi pi-send";
      case "Quoted":
        return "pi pi-dollar";
      case "Finalized":
        return "pi pi-check";
      case "Closed":
        return "pi pi-times";
      case "Acknowledge":
        return "pi pi-star";
      case "Meeting Done":
        return "pi pi-check-circle";
      case "Pending":
        return "pi pi-spinner";
    }
  }

  function getIconColor(status) {
    switch (status) {
      case "Forwarded":
        return "linear-gradient(90deg, rgba(255, 30, 30, 1) 0%, rgba(0, 188, 212, 1) 0%, rgba(238, 130, 238, 1) 0%, rgba(0, 188, 212, 1) 0%, rgba(0, 162, 255, 1) 0%)";
      case "Quoted":
        return "linear-gradient(90deg, rgba(255, 30, 30, 1) 0%, rgba(0, 188, 212, 1) 0%, rgba(238, 130, 238, 1) 0%, rgba(0, 188, 212, 1) 0%, rgba(0, 255, 69, 1) 0%)";
      case "Finalized":
        return "linear-gradient(90deg, rgba(255, 30, 30, 1) 0%, rgba(0, 188, 212, 1) 0%, rgba(238, 130, 238, 1) 0%, rgba(0, 188, 212, 1) 0%, rgba(59, 199, 255, 1) 0%)";
      case "Closed":
        return "linear-gradient(90deg, rgba(212, 0, 27, 1) 84%, rgba(255, 30, 30, 1) 100%, rgba(0, 188, 212, 1) 100%, rgba(238, 130, 238, 1) 100%, rgba(0, 188, 212, 1) 100%)";
      case "Acknowledge":
        return "linear-gradient(90deg, rgba(255, 30, 30, 1) 0%, rgba(0, 188, 212, 1) 0%, rgba(238, 130, 238, 1) 0%, rgba(0, 188, 212, 1) 0%, rgba(0, 255, 10, 1) 0%)";
      case "Meeting Done":
        return "linear-gradient(90deg, rgba(99, 255, 30, 1) 100%, rgba(0, 188, 212, 1) 100%, rgba(238, 130, 238, 1) 100%, rgba(0, 188, 212, 1) 100%, rgba(0, 188, 212, 1) 100%)";
      case "Pending":
        return "linear-gradient(90deg, rgba(255, 30, 30, 1) 0%, rgba(0, 188, 212, 1) 0%, rgba(238, 130, 238, 1) 0%, rgba(0, 188, 212, 1) 0%, rgba(255, 165, 59, 1) 0%)";
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
    );
  };

  const customizedContent = (item) => {
    return (
      <Card title={item.Status} subTitle={item.Date}>
        <p>{item.Detail}</p>
        {item.Status !== "Acknowledged" && (
          <>
            <Button
              label="View More"
              className="p-button-text"
              type="button"
              onClick={() =>
                navigate(
                  `${
                    ROUTE_URLS.GENERAL.LEADS_INTROUDCTION_DETAIL_VIEWER_ROUTE
                  }/${LeadIntroductionID}/${
                    item.Status === "Meeting Done" ? "MeetingDone" : item.Status
                  }/${item.LeadIntroductionDetailID}`
                )
              }
            ></Button>
          </>
        )}
      </Card>
    );
  };

  return (
    <div className="mt-5">
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
      <div style={{ marginBottom: "1rem" }}>
        <Timeline
          value={newEvents}
          align="alternate"
          className="customized-timeline"
          marker={customizedMarker}
          content={customizedContent}
        />
      </div>
    </div>
  );
};

export default LeadsIntroductionViewer;

function formatDate(data) {
  let date = new Date(data);
  let hours = date.getHours();
  let minutes = ("0" + date.getMinutes()).slice(-2);
  let seconds = ("0" + date.getSeconds()).slice(-2);
  let ampm = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

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
    ampm;
  return formattedDate;
}
let queryKey2 = "key2";
export const LeadsIntroductionViewerDetail = () => {
  const { LeadIntroductionID, LeadIntroductionDetailID, Type } = useParams();
  const [isEnable, setIsEnable] = useState(false);

  return (
    <div className="mt-5">
      {Type === "Forwarded" ? (
        <>
          <ForwardedFieldsContainer
            LeadIntroductionDetailID={LeadIntroductionDetailID}
            LeadIntroductionID={LeadIntroductionID}
          />
        </>
      ) : (
        <></>
      )}
      {Type === "Quoted" || Type === "Finalized" ? (
        <>
          <QuotedFieldsContainer
            LeadIntroductionDetailID={LeadIntroductionDetailID}
            LeadIntroductionID={LeadIntroductionID}
            Type={Type}
          />
        </>
      ) : (
        <></>
      )}
      {Type === "Closed" ? (
        <>
          <ClosedFieldContainer
            LeadIntroductionDetailID={LeadIntroductionDetailID}
            LeadIntroductionID={LeadIntroductionID}
          />
        </>
      ) : (
        <></>
      )}
      {Type === "MeetingDone" ? (
        <>
          <MeetingDoneFields
            LeadIntroductionID={LeadIntroductionID}
            LeadIntroductionDetailID={LeadIntroductionDetailID}
            ShowToolBar={true}
            ResetFields={false}
            AreFieldsEnable={false}
          />
        </>
      ) : (
        ""
      )}
      {Type === "Pending" ? (
        <>
          <RevertBackFields
            LeadIntroductionID={LeadIntroductionID}
            LeadIntroductionDetailID={LeadIntroductionDetailID}
            ShowToolBar={true}
            ResetFields={false}
            AreFieldsEnable={false}
          />
        </>
      ) : (
        ""
      )}
    </div>
  );
};

function ForwardedFieldsContainer({
  LeadIntroductionDetailID,
  LeadIntroductionID,
}) {
  const [isEnable, setIsEnable] = useState(false);

  const method = useForm();

  const departmentSelectData = useAllDepartmentsSelectData();
  const usersSelectData = useAllUsersSelectData();
  const productsSelectData = useProductsInfoSelectData();

  const { data } = useQuery({
    queryKey: [queryKey2, LeadIntroductionDetailID],
    queryFn: async () => {
      const { data } = await axios.post(
        apiUrl +
          `/data_LeadIntroduction/GetLeadIntroductionDetailDataWhere?LoginUserID=${user.userID}&LeadIntroductionDetailID=${LeadIntroductionDetailID}`
      );
      return data.data;
    },
    initialData: [],
  });

  const mutation = useMutation({
    mutationFn: addLeadIntroductionOnAction,
    onSuccess: ({ success }) => {
      if (success) {
        setIsEnable(false);
        toast.success("Updated successfully");
        method.clearErrors();
      }
    },
  });

  useEffect(() => {
    if (data.length > 0 && !method.formState.isDirty) {
      method.setValue("DepartmentID", data[0].DepartmentID);
      method.setValue("UserID", data[0].UserID);
      method.setValue("MeetingPlace", data[0].MeetingPlace);
      method.setValue("MeetingTime", parseISO(data[0].MeetingTime));
      method.setValue("DepartmentID", data[0].DepartmentID);
      method.setValue("ProductInfoID", data[0].RecommendedProductID);
      method.setValue("Description", data[0].Description);
    }
  }, [data]);

  let filePath =
    data[0]?.FileName === null
      ? null
      : "http://192.168.9.110:90/api/data_LeadIntroduction/DownloadLeadProposal?filename=" +
        data[0]?.FileName;
  let fileType = data[0]?.FileType === null ? null : data[0]?.FileType.slice(1);

  // Forward Fields
  const ForwardFields = (
    <>
      <Row>
        <Form.Group as={Col} controlId="DepartmentID">
          <Form.Label style={{ fontSize: "14px", fontWeight: "bold" }}>
            Department
            <span className="text-danger fw-bold ">*</span>
          </Form.Label>
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
        </Form.Group>
        <Form.Group as={Col} controlId="UserID">
          <Form.Label style={{ fontSize: "14px", fontWeight: "bold" }}>
            User
            <span className="text-danger fw-bold ">*</span>
          </Form.Label>
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
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col} controlId="MeetingPlace">
          <Form.Label style={{ fontSize: "14px", fontWeight: "bold" }}>
            Meeting Medium
            <span className="text-danger fw-bold ">*</span>
          </Form.Label>
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
        </Form.Group>
        <Form.Group as={Col} controlId="MeetingTime">
          <Form.Label style={{ fontSize: "14px", fontWeight: "bold" }}>
            Meeting Date & Time
            <span className="text-danger fw-bold ">*</span>
          </Form.Label>
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
        </Form.Group>
        <Form.Group as={Col} controlId="ProductInfoID">
          <Form.Label style={{ fontSize: "14px", fontWeight: "bold" }}>
            Recomended Product
            <span className="text-danger fw-bold ">*</span>
          </Form.Label>
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
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col} className="col-12">
          <Form.Label>Instructions</Form.Label>
          <Form.Control
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
        </Form.Group>
      </Row>
    </>
  );

  function onSubmit(data) {
    if (
      (data.DepartmentID === undefined || data.DepartmentID === null) &&
      (data.UserID === undefined || data.DepartmentID === null)
    ) {
      method.setError("DepartmentID", { type: "required" });
      method.setError("UserID", { type: "required" });
    } else {
      mutation.mutate({
        from: "Forward",
        formData: data,
        userID: user.userID,
        LeadIntroductionID: LeadIntroductionID,
        LeadIntroductionDetailID: LeadIntroductionDetailID,
      });
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
          <Form.Label>File</Form.Label>
          {/* <div className="mt-5">
            <FileViewer fileType={fileType} filePath={filePath} />
          </div> */}
        </>
      ) : (
        <></>
      )}
    </>
  );
}

function QuotedFieldsContainer({
  LeadIntroductionDetailID,
  LeadIntroductionID,
  Type,
}) {
  const method = useForm();
  const fileInputRef = useRef();
  const [isEnable, setIsEnable] = useState(false);
  const [filePath, setFilePath] = useState("");
  const [fileType, setFileType] = useState("");
  const { data } = useQuery({
    queryKey: [queryKey2, LeadIntroductionDetailID],
    queryFn: async () => {
      const { data } = await axios.post(
        apiUrl +
          `/data_LeadIntroduction/GetLeadIntroductionDetailDataWhere?LoginUserID=${user.userID}&LeadIntroductionDetailID=${LeadIntroductionDetailID}`
      );

      return data.data;
    },
    enabled: isEnable === false,
    initialData: [],
  });

  const mutation = useMutation({
    mutationFn: addLeadIntroductionOnAction,
    onSuccess: ({ success }) => {
      if (success) {
        toast.success("Updated successfully");
        setIsEnable(false);
      }
    },
  });

  useEffect(() => {
    if (data.length > 0) {
      method.setValue("Amount", data[0].Amount);
      method.setValue("Description", data[0].Description);
      setFilePath(
        data[0]?.FileName === null
          ? null
          : "http://110.39.141.170:90/api/data_LeadIntroduction/DownloadLeadProposal?filename=" +
              data[0]?.FileName
      );
      setFileType(
        data[0]?.FileType === null ? null : data[0]?.FileType.slice(1)
      );
    }
  }, [data]);

  const QuotedFields = (
    <>
      <Row>
        <Form.Group className="col-xl-3" as={Col} controlId="Amount">
          <Form.Label>Amount</Form.Label>
          <div>
            <NumberInput
              control={method.control}
              id={`Amount`}
              enterKeyOptions={() => method.setFocus("Description")}
              disabled={!isEnable}
            />
          </div>
        </Form.Group>
        <Form.Group as={Col} controlId="Description" className="col-9">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as={"textarea"}
            rows={1}
            className="form-control"
            style={{
              padding: "0.3rem 0.4rem",
              fontSize: "0.8em",
            }}
            disabled={!isEnable}
            {...method.register("Description")}
          />
        </Form.Group>
      </Row>
    </>
  );

  function onSubmit(data) {
    mutation.mutate({
      from: Type,
      formData: data,
      userID: user.userID,
      LeadIntroductionID: LeadIntroductionID,
      LeadIntroductionDetailID: LeadIntroductionDetailID,
      fileData: {
        FileType: data[0]?.FileType ?? "",
        FilePath: data[0]?.FilePath ?? "",
        FileName: data[0]?.FileName ?? "",
        FullFilePath: data[0]?.FullFilePath ?? "",
      },
      file: fileInputRef.current?.children[0].files[0],
    });
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
      {QuotedFields}
      {isEnable ? (
        <>
          <Row>
            <Form.Group as={Col} controlId="AttachmentFile">
              <Form.Label style={{ fontSize: "14px", fontWeight: "bold" }}>
                Choose File
                <span className="text-danger fw-bold ">*</span>
              </Form.Label>
              <Form.Control
                type="file"
                {...method.register("AttachmentFile")}
              ></Form.Control>
            </Form.Group>
          </Row>
        </>
      ) : (
        <></>
      )}
      {filePath !== null && fileType !== "" ? (
        <>
          <Form.Label>File</Form.Label>
          {isEnable && (
            <>
              <div>
                <Button icon="pi pi-plus" type="button" className="rounded" />
                <Button icon="pi pi-trash" type="button" className="rounded" />
              </div>
            </>
          )}
          <div className="mt-5">
            {/* <FileViewer
              fileType={getFileType(fileType)}
              filePath={filePath}
              ref={fileInputRef}
            /> */}
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

function ClosedFieldContainer({
  LeadIntroductionDetailID,
  LeadIntroductionID,
}) {
  const [isEnable, setIsEnable] = useState(false);

  const method = useForm();
  const { data } = useQuery({
    queryKey: [queryKey2, LeadIntroductionDetailID],
    queryFn: async () => {
      const { data } = await axios.post(
        apiUrl +
          `/data_LeadIntroduction/GetLeadIntroductionDetailDataWhere?LoginUserID=${user.userID}&LeadIntroductionDetailID=${LeadIntroductionDetailID}`
      );
      return data.data;
    },
    initialData: [],
  });

  const mutation = useMutation({
    mutationFn: addLeadIntroductionOnAction,
    onSuccess: ({ success }) => {
      if (success) {
        toast.success("Updated successfully");
        setIsEnable(false);
      }
    },
  });

  useEffect(() => {
    if (data.length > 0 && !method.formState.isDirty) {
      method.setValue("Amount", data[0].Amount);
      method.setValue("Description", data[0].Description);
    }
  }, [data]);

  const ClosedFields = (
    <>
      <Row>
        <Form.Group className="col-xl-3" as={Col} controlId="Amount">
          <Form.Label>Expected Amount</Form.Label>
          <div>
            <NumberInput
              control={method.control}
              id={`Amount`}
              enterKeyOptions={() => method.setFocus("Description")}
              disabled={!isEnable}
            />
          </div>
        </Form.Group>
        <Form.Group as={Col} controlId="Description" className="col-9">
          <Form.Label>Reason</Form.Label>
          <Form.Control
            as={"textarea"}
            rows={1}
            className="form-control"
            style={{
              padding: "0.3rem 0.4rem",
              fontSize: "0.8em",
            }}
            disabled={!isEnable}
            {...method.register("Description")}
          />
        </Form.Group>
      </Row>
    </>
  );

  function onSubmit(data) {
    mutation.mutate({
      from: "Closed",
      formData: data,
      userID: user.userID,
      LeadIntroductionID: LeadIntroductionID,
      LeadIntroductionDetailID: LeadIntroductionDetailID,
    });
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
      {ClosedFields}
    </>
  );
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
        className="p-button"
        style={{
          color: "white",
          fontWeight: 700,
        }}
      >
        <span
          className="pi pi-arrow-left"
          style={{ marginRight: ".5rem" }}
        ></span>{" "}
        Back To Timeline
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
        />
        <Button
          label={"Edit"}
          icon="pi pi-pencil"
          type="button"
          severity="warning"
          className="p-button-success rounded"
          onClick={handleEdit}
          disabled={isEnable}
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
        />
      </div>
    </div>
  );
}

function getFileType(fileType) {
  switch (fileType) {
    case "xlsx":
      return "microsoftxlsx";
    case "docx":
      return "microsoftdoc";
    default:
      return fileType;
  }
}
