import { Row, Form, Col, Button, ButtonGroup, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { preventFormByEnterKeySubmission } from "../../utils/CommonFunctions";
import { AppConfigurationContext } from "../../context/AppConfigurationContext";

const apiUrl = import.meta.env.VITE_APP_API_URL;

let defaultValues = {
  ProductName: "Product",
  BranchName: "Branch",
};

function AppConfiguration() {
  document.title = "App Configuration";

  const [reload, setReload] = useState(true);
  const [ConfigID, setConfigID] = useState(true);
  const { setPageTitles } = useContext(AppConfigurationContext);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isDirty, isValid, errors },
  } = useForm({
    defaultValues,
  });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function fetchCompanyInfo() {
      const { data } = await axios.post(
        `${apiUrl}/EduIMS/GetConfigInfo?LoginUserID=${user?.userID}`
      );
      if (data.success === true) {
        setConfigID(data?.data[0]?.ConfigID);
        setValue("ProductName", data?.data[0]?.ProductTitle);
        setValue("BranchName", data?.data[0]?.CustomerBranchTitle);
        setPageTitles({
          product: data?.data[0]?.ProductTitle,
          branch: data?.data[0]?.CustomerBranchTitle,
        });
        setReload(false);
      }
    }
    if (reload) {
      fetchCompanyInfo();
    }
  }, [reload]);

  const configurationMutation = useMutation({
    mutationFn: async (formData) => {
      let DataToSend = {
        ConfigID: ConfigID,
        ProductTitle: formData?.ProductName,
        CustomerBranchTitle: formData?.BranchName,
        EntryUserID: user?.userID,
      };

      const { data } = await axios.post(
        "http://192.168.9.110:90/api/EduIMS/ConfigOneInsertUpdate",
        DataToSend
      );

      if (data.success === true) {
        toast.success("App Configuration updated successfully!");
        setReload(true);
      } else {
        toast.error(data.message, {
          autoClose: 1500,
        });
      }
    },
  });

  function onSubmit(data) {
    configurationMutation.mutate(data);
  }

  return (
    <>
      <div className="mt-5 p-2">
        <h4 className="p-3 mb-2 bg-light text-dark text-center  ">
          App Configuration
        </h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={preventFormByEnterKeySubmission}
        >
          <Row className="p-3">
            <Form.Group as={Col} controlId="ProductName">
              <Form.Label>Product Name</Form.Label>

              <Form.Control
                type="text"
                required
                className="form-control"
                {...register("ProductName")}
              />
              <p className="text-danger">{errors.ProductName?.message}</p>
            </Form.Group>
            <Form.Group as={Col} controlId="BranchName">
              <Form.Label>Branch Name</Form.Label>

              <Form.Control
                type="text"
                className="form-control"
                {...register("BranchName")}
              />
            </Form.Group>
          </Row>

          <Row>
            <ButtonGroup className="gap-2 rounded-2">
              <Button
                disabled={
                  !isDirty || !isValid || configurationMutation.isPending
                }
                variant="success"
                style={{ marginTop: "30px" }}
                className="btn btn-primary p-2 rounded-sm fw-bold"
                type="submit"
              >
                {configurationMutation.isPending ? (
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

export default AppConfiguration;
