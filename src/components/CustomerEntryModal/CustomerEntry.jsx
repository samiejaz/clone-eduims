import { useContext, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { preventFormByEnterKeySubmission } from "../../utils/CommonFunctions";
import { Form, Row, Col } from "react-bootstrap";
import { fetchNewCustomerById } from "../../api/NewCustomerData";
import { AuthContext } from "../../context/AuthContext";

function CustomerEntry(props) {
  const { CustomerID, isEnable = true } = props;
  const { user } = useContext(AuthContext);
  const [CustomerData, setCustomerData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    async function fetchOldCustomer() {
      if (CustomerID !== undefined && CustomerID !== 0 && CustomerID !== null) {
        const data = await fetchNewCustomerById(CustomerID, user.userID);
        setCustomerData(data);
        setIsLoading(false);
      }
    }
    if (CustomerID !== 0 && CustomerID !== undefined) {
      fetchOldCustomer();
    }
  }, [CustomerID]);

  useEffect(() => {
    if (CustomerID !== 0 && CustomerData?.data) {
      setValue("CustomerName", CustomerData?.data[0]?.CustomerName);
      setValue(
        "CustomerBusinessName",
        CustomerData?.data[0]?.CustomerBusinessName
      );
      setValue(
        "CustomerBusinessAddress",
        CustomerData?.data[0]?.CustomerBusinessAddress
      );
      setValue("ContactPerson1Name", CustomerData?.data[0]?.ContactPerson1Name);
      setValue("ContactPerson1No", CustomerData?.data[0]?.ContactPerson1No);
      setValue(
        "ContactPerson1Email",
        CustomerData?.data[0]?.ContactPerson1Email
      );
      setValue("Description", CustomerData?.data[0]?.Description);
      setValue("InActive", CustomerData?.data[0]?.InActive);
    }
  }, [CustomerID, CustomerData]);

  return (
    <>
      <form onKeyDown={preventFormByEnterKeySubmission}>
        <Row>
          <Form.Group as={Col} controlId="CustomerName">
            <Form.Label>Customer Name</Form.Label>
            <span className="text-danger fw-bold ">*</span>
            <Form.Control
              type="text"
              required
              aria-invalid={errors?.CustomerName ? true : false}
              className="form-control"
              {...register("CustomerName", {
                required: "Please enter customer name!",
              })}
              disabled={!isEnable}
            />
            <p className="text-danger">{errors?.CustomerName?.message}</p>
          </Form.Group>
          <Form.Group as={Col} controlId="CustomerBusinessName">
            <Form.Label>Customer Business Name</Form.Label>
            <span className="text-danger fw-bold ">*</span>
            <Form.Control
              type="text"
              required
              aria-invalid={errors?.CustomerBusinessName ? "true" : "false"}
              {...register("CustomerBusinessName", {
                required: "Please enter customer business name!",
              })}
              disabled={!isEnable}
            />
            <p className="text-danger">
              {errors?.CustomerBusinessName?.message}
            </p>
          </Form.Group>
        </Row>

        <Row>
          <Form.Group controlId="CustomerBusinessAddress">
            <Form.Label>Customer Business Address</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              {...register("CustomerBusinessAddress", {
                // disabled: !isEnable,
              })}
              disabled={!isEnable}
            />
          </Form.Group>
        </Row>

        <Row>
          <Form.Group as={Col} controlId="ContactPerson1Name">
            <Form.Label>Contact Name</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              {...register("ContactPerson1Name", {
                // disabled: !isEnable,
              })}
              disabled={!isEnable}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="ContactPerson1No">
            <Form.Label>Contact No</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              {...register("ContactPerson1No", {
                // disabled: !isEnable,
              })}
              disabled={!isEnable}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="ContactPerson1Email">
            <Form.Label> Email</Form.Label>
            <Form.Control
              type="email"
              placeholder=""
              {...register("ContactPerson1Email", {
                // disabled: !isEnable,
              })}
              disabled={!isEnable}
            />
          </Form.Group>
        </Row>

        <Row>
          <Form.Group as={Col} controlId="Description">
            <Form.Label>Descripiton</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              name="email"
              {...register("Description", {
                // disabled: !isEnable,
              })}
              disabled={!isEnable}
            />
          </Form.Group>
        </Row>
        <Row>
          <Form.Group as={Col} controlId="InActive">
            <Form.Check
              aria-label="Inactive"
              label="Inactive"
              {...register("InActive", {
                // disabled: !isEnable,
              })}
              disabled={!isEnable}
            />
          </Form.Group>
        </Row>
      </form>
    </>
  );
}

export default CustomerEntry;
