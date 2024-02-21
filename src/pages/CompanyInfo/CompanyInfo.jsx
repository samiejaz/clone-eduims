import { Row, Form, Col, Button, ButtonGroup, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { Image } from "primereact/image";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import {
  convertBase64StringToFile,
  preventFormByEnterKeySubmission,
} from "../../utils/CommonFunctions";

const apiUrl = import.meta.env.VITE_APP_API_URL;

function CompanyInfo() {
  document.title = "Company Info";
  const [CompanyInfo, setCompanyInfo] = useState([]);
  const [isLoding, setIsLoading] = useState(false);
  const [reload, setReload] = useState(true);
  const [imgData, setImgData] = useState();
  const [editImage, setEditImage] = useState(false);

  const {
    register,
    handleSubmit,

    setValue,
    formState: { isDirty, isValid, errors },
  } = useForm();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function fetchCompanyInfo() {
      const { data } = await axios.post(
        `${apiUrl}/EduIMS/GetCompany?LoginUserID=${user.userID}`
      );
      if (data.success === true) {
        setIsLoading(true);
        setCompanyInfo(data.data);
        setValue("CompanyName", data?.data[0]?.CompanyName);
        setValue("Address", data?.data[0]?.Address);
        setValue("LandlineNo", data?.data[0]?.LandlineNo);
        setValue("MobileNo", data?.data[0]?.MobileNo);
        setValue("Email", data?.data[0]?.Email);
        setValue("Website", data?.data[0]?.Website);
        setValue("AuthorityPersonName", data?.data[0]?.AuthorityPersonName);
        setValue("AuthorityPersonNo", data?.data[0]?.AuthorityPersonNo);
        setValue("AuthorityPersonEmail", data?.data[0]?.AuthorityPersonEmail);

        setValue("Description", data?.data[0]?.Description);
        setImgData(data?.data[0].CompanyLogo);
        setIsLoading(false);
        setReload(false);
      }
    }
    if (reload) {
      fetchCompanyInfo();
    }
  }, [reload]);

  const companyMutation = useMutation({
    mutationFn: async (formData) => {
      let newFormData = new FormData();
      newFormData.append("CompanyID", CompanyInfo[0]?.CompanyID);
      newFormData.append("CompanyName", formData.CompanyName);
      newFormData.append("Address", formData?.Address || "");
      newFormData.append("LandlineNo", formData?.LandlineNo || "");
      newFormData.append("MobileNo", formData?.MobileNo || "");
      newFormData.append("Email", formData?.Email || "");
      newFormData.append("Website", formData?.Website || "");
      newFormData.append(
        "AuthorityPersonName",
        formData?.AuthorityPersonName || ""
      );
      newFormData.append(
        "AuthorityPersonNo",
        formData?.AuthorityPersonNo || ""
      );
      newFormData.append(
        "AuthorityPersonEmail",
        formData?.AuthorityPersonEmail || ""
      );
      newFormData.append("Description", formData?.Description || "");
      newFormData.append("EntryUserID", user.userID);

      if (imgData && CompanyInfo[0]?.CompanyLogo && !formData?.CompanyLogo[0]) {
        let file = convertBase64StringToFile(CompanyInfo[0]?.CompanyLogo);
        newFormData.append("logo", file);
      } else {
        newFormData.append("logo", formData?.CompanyLogo[0]);
      }

      const { data } = await axios.post(
        "http://192.168.9.110:90/api/EduIMS/CompanyInfoInsertUpdate",
        newFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success === true) {
        toast.success("Company Info updated successfully!");
        setReload(true);
      } else {
        toast.error(data.message, {
          autoClose: 1500,
        });
      }
    },
  });

  function onSubmit(data) {
    companyMutation.mutate(data);
  }

  function onLogoChange(e) {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      let base64Data;
      if (reader.result.includes("data:image/png;base64,")) {
        base64Data = reader.result.replace(/^data:image\/png;base64,/, "");
      } else {
        base64Data = reader.result.replace(/^data:image\/jpeg;base64,/, "");
      }
      setImgData(base64Data);
    });
    reader.readAsDataURL(e.target.files[0]);
  }

  function handleEdit() {
    setEditImage(true);
  }

  function handleDelete() {
    setValue("CompanyLogo", []);
    setImgData("");
  }

  return (
    <>
      <div className="mt-5 p-2">
        <h4 className="p-3 mb-2 bg-light text-dark text-center  ">
          Company Info
        </h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={preventFormByEnterKeySubmission}
        >
          <Row className="p-3">
            <Form.Group as={Col} controlId="CompanyName">
              <Form.Label>Company Name</Form.Label>
              <span className="text-danger fw-bold ">*</span>
              <Form.Control
                type="text"
                required
                className="form-control"
                {...register("CompanyName")}
              />
              <p className="text-danger">{errors.CompanyName?.message}</p>
            </Form.Group>
            <Form.Group as={Col} controlId="Address">
              <Form.Label>Address</Form.Label>

              <Form.Control
                type="text"
                className="form-control"
                {...register("Address")}
              />
            </Form.Group>
          </Row>
          <Row className="p-3" style={{ marginTop: "-25px" }}>
            <Form.Group as={Col} controlId="LandlineNo">
              <Form.Label>Landline No</Form.Label>

              <Form.Control
                type="text"
                className="form-control"
                {...register("LandlineNo")}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="MobileNo">
              <Form.Label>Mobile No</Form.Label>

              <Form.Control
                type="text"
                className="form-control"
                {...register("MobileNo")}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="Email">
              <Form.Label>Email</Form.Label>

              <Form.Control
                type="text"
                className="form-control"
                {...register("Email")}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="Website">
              <Form.Label>Website</Form.Label>

              <Form.Control
                type="text"
                className="form-control"
                {...register("Website")}
              />
            </Form.Group>
          </Row>
          <Row className="p-3" style={{ marginTop: "-25px" }}>
            <Form.Group as={Col} controlId="AuthorityPersonName">
              <Form.Label>Authority Person / CEO Name</Form.Label>

              <Form.Control
                type="text"
                className="form-control"
                {...register("AuthorityPersonName")}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="AuthorityPersonNo">
              <Form.Label>Mobile No</Form.Label>

              <Form.Control
                type="text"
                className="form-control"
                {...register("AuthorityPersonNo")}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="AuthorityPersonEmail">
              <Form.Label>Email</Form.Label>

              <Form.Control
                type="text"
                className="form-control"
                {...register("AuthorityPersonEmail")}
              />
            </Form.Group>
          </Row>

          <Row className="p-3" style={{ marginTop: "-25px" }}>
            <Form.Group as={Col} controlId="Description">
              <Form.Label>Description</Form.Label>

              <Form.Control
                type="text"
                className="form-control"
                {...register("Description")}
              />
            </Form.Group>
          </Row>

          {(editImage || !CompanyInfo[0]?.CompanyLogo) && (
            <>
              <Row className="p-3" style={{ marginTop: "-25px" }}>
                <Form.Group controlId="CompanyLogo" className="mb-3">
                  <Form.Label>Company Logo</Form.Label>
                  <Form.Control
                    type="file"
                    {...register("CompanyLogo")}
                    onChange={onLogoChange}
                    accept="image/jpeg, image/png"
                  />
                </Form.Group>
              </Row>
            </>
          )}

          {imgData && (
            <Row className="p-3" style={{ marginTop: "-25px" }}>
              <div className="text-end mb-1">
                <ButtonGroup className="gap-1">
                  <Button
                    onClick={() => handleDelete()}
                    size="sm"
                    variant="danger"
                    className="rounded"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill="currentColor"
                      className="bi bi-trash3"
                      viewBox="0 0 16 16"
                    >
                      <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                    </svg>
                  </Button>
                  <Button
                    onClick={() => handleEdit()}
                    size="sm"
                    variant="success"
                    className="rounded"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill="currentColor"
                      className="bi bi-pencil-square"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                      <path
                        fillRule="evenodd"
                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                      />
                    </svg>
                  </Button>
                </ButtonGroup>
              </div>
              <Form.Group as={Col} controlId="CompanyLogo" className="mb-3">
                <div className="card flex justify-content-center">
                  <>
                    <Image
                      src={"data:image/png;base64," + imgData}
                      alt="Image"
                      width="250"
                      preview
                      className="text-center"
                    />
                  </>
                </div>
              </Form.Group>
            </Row>
          )}

          <Row>
            <ButtonGroup className="gap-2 rounded-2">
              <Button
                disabled={!isDirty || !isValid || companyMutation.isPending}
                variant="success"
                style={{ marginTop: "30px" }}
                className="btn btn-primary p-2 rounded-sm fw-bold"
                type="submit"
              >
                {companyMutation.isPending ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    <span> Saving...</span>
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </ButtonGroup>
          </Row>
        </form>
      </div>
    </>
  );
}

export default CompanyInfo;
