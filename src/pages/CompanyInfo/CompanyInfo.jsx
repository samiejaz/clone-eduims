import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import {
  convertBase64StringToFile,
  preventFormByEnterKeySubmission,
} from "../../utils/CommonFunctions";
import {
  FormColumn,
  FormRow,
  FormLabel,
} from "../../components/Layout/LayoutComponents";
import TextInput from "../../components/Forms/TextInput";
import ImageContainer from "../../components/ImageContainer";
import { Tooltip } from "react-bootstrap";
import { Button } from "primereact/button";

const apiUrl = import.meta.env.VITE_APP_API_URL;

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
};

function CompanyInfo() {
  document.title = "Company Info";
  const [CompanyInfo, setCompanyInfo] = useState([]);
  const [reload, setReload] = useState(true);
  const imageRef = useRef();

  const { register, handleSubmit, control, setValue, setFocus } = useForm({
    defaultValues,
  });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function fetchCompanyInfo() {
      const { data } = await axios.post(
        `${apiUrl}/EduIMS/GetCompany?LoginUserID=${user.userID}`
      );
      if (data.success === true) {
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
        imageRef.current.src =
          "data:image/png;base64," + data?.data[0]?.CompanyLogo;
        setReload(false);
      }
    }
    if (reload) {
      fetchCompanyInfo();
    }
  }, [reload]);

  const companyMutation = useMutation({
    mutationFn: async (formData) => {
      try {
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

        if (imageRef.current.src !== "" || imageRef.current.src !== undefined) {
          let businessUnitFile = convertBase64StringToFile(
            imageRef.current.src,
            true
          );
          newFormData.append("logo", businessUnitFile);
        }

        const { data } = await axios.post(
          apiUrl + "/EduIMS/CompanyInfoInsertUpdate",
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
            autoClose: false,
          });
        }
      } catch (error) {
        toast.error(error.message, {
          autoClose: false,
        });
      }
    },
  });

  function onSubmit(data) {
    companyMutation.mutate(data);
  }

  return (
    <>
      <div className="p-2">
        <div className="flex align-content-center justify-content-between">
          <div
            style={{ justifySelf: "center", flex: "1", textAlign: "center" }}
          >
            <h1 className="text-2xl fw-bold ">Company Info</h1>
          </div>
          <div className="flex gap-2">
            {/* <Button
              label="Edit"
              severity="warning"
              type="button"
              tooltip="Edit"
              className="rounded"
            /> */}
            <Button
              label="Save"
              severity="success"
              className="rounded"
              onClick={() => handleSubmit(onSubmit)()}
            />
          </div>
        </div>
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
              <input
                as={"textarea"}
                rows={1}
                className="form-control"
                style={{
                  padding: "0.3rem 0.4rem",
                  fontSize: "0.8em",
                }}
                {...register("Description")}
              />
            </FormColumn>
          </FormRow>

          <FormRow>
            <FormColumn lg={6} xl={6}>
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
                <ImageContainer
                  imageRef={imageRef}
                  //  hideButtons={mode === "view"}
                />
              </div>
            </FormColumn>
          </FormRow>

          {/* {(editImage || !CompanyInfo[0]?.CompanyLogo) && (
            <>
              <FormRow className="p-3" style={{ marginTop: "-25px" }}>
                <FormColumn controlId="CompanyLogo" className="mb-3">
                  <FormLabel>Company Logo</FormLabel>
                  <Form.Control
                    type="file"
                    {...register("CompanyLogo")}
                    onChange={onLogoChange}
                    accept="image/jpeg, image/png"
                  />
                </FormColumn>
              </FormRow>
            </>
          )}

          {imgData && (
            <FormRow className="p-3" style={{ marginTop: "-25px" }}>
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
              <FormColumn controlId="CompanyLogo" className="mb-3">
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
              </FormColumn>
            </FormRow>
          )} */}

          {/* <FormRow>
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
          </FormRow> */}
        </form>
      </div>
    </>
  );
}

export default CompanyInfo;
