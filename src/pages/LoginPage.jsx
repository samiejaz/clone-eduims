import { useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import Logo from "../images/logo.png";
import { toast } from "react-toastify";

const SignUp = () => {
  const navigate = useNavigate();
  const { user, loginUser } = useContext(AuthContext);
  const { register, handleSubmit, formState } = useForm();
  const { errors } = formState;

  useEffect(() => {
    if (user !== null) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const apiUrl = import.meta.env.VITE_APP_API_URL;

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.post(
        apiUrl + "/EduIMS/VerifyLogin",
        formData
      );
      if (data.success === true) {
        const dataToSerialize = {
          username: data.data[0].FirstName + " " + data.data[0].LastName,
          userID: data.data[0].LoginUserID,
          image: data.data[0]?.ProfilePic,
          DepartmentID: data.data[0]?.DepartmentID,
        };
        loginUser(dataToSerialize);
        toast("Login sucessful", {
          autoClose: 1500,
          position: "top-right",
        });
      } else {
        toast.error(data.Message, {
          autoClose: 1500,
          position: "top-right",
        });
      }
    },
    onError: () => {
      toast.error("Something went wrong! Please try again later", {
        position: "top-left",
        autoClose: 1500,
      });
    },
  });

  function onSubmit(data) {
    mutation.mutate(data);
  }

  return (
    <Container
      fluid
      className="p-4 background-radial-gradient overflow-hidden d-flex justify-content-center align-items-center "
    >
      <Row>
        <Col
          md={6}
          className="text-center text-md-start d-flex flex-column justify-content-center"
        >
          <h1
            className="my-5 display-3 fw-bold ls-tight px-3"
            style={{ color: "#c150c1" }}
          >
            The best offer
            <br />
            <span style={{ color: "#85b8c2" }}>for your business</span>
          </h1>

          <p className="px-3" style={{ color: "#a2a2a2" }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet,
            itaque accusantium odio, soluta, corrupti aliquam quibusdam tempora
            at cupiditate quis eum maiores libero veritatis? Dicta facilis sint
            aliquid ipsum atque?
          </p>
        </Col>

        <Col md={6} className="position-relative">
          <div
            id="radius-shape-1"
            className="position-absolute rounded-circle shadow-5"
          ></div>
          <div id="radius-shape-2" className="position-absolute shadow-5"></div>

          <Card className="my-5 bg-glass">
            <Card.Body className="p-5">
              <div className="text-center mb-5">
                <i
                  className="fas fa-crow fa-3x me-3"
                  style={{ color: "#709085" }}
                />
                <img src={Logo} alt="Logo" />
              </div>
              <Row>
                <h1 className="text-center mb-5">Login</h1>
              </Row>
              <form onSubmit={handleSubmit(onSubmit)} method="post" noValidate>
                <Row>
                  <Form.Group className="mb-2">
                    <Form.Label className="fs-5">Username/Email</Form.Label>
                    <input
                      type="text"
                      id="LoginName"
                      name="LoginName"
                      className="form-control p-3"
                      placeholder="Enter your username/email..."
                      {...register("LoginName", {
                        required: "Username is required!",
                      })}
                    />
                  </Form.Group>
                  <p className="text-danger">{errors.LoginName?.message}</p>
                </Row>
                <Row>
                  <Form.Group className="mb-4">
                    <Form.Label className="fs-5">Password</Form.Label>
                    <input
                      type="password"
                      id="Password"
                      name="Password"
                      className="form-control p-3"
                      placeholder="Enter your password..."
                      {...register("Password", {
                        required: "Password is required!",
                      })}
                    />
                  </Form.Group>
                  <p className="text-danger">{errors.Password?.message}</p>
                </Row>

                <Button
                  className="w-100 mb-4 fs-5 p-2"
                  size="md"
                  type="submit"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      <span> Logging In...</span>
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
                <div className="text-center mt-2">
                  <p>
                    Developed at{" "}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="http://www.edusoftsolutions.com"
                      className="text-center"
                    >
                      Edusoft System Solutions
                    </a>
                  </p>
                </div>
              </form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUp;
