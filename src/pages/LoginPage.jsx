import { useEffect } from "react"
import axios from "axios"

import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { useContext } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { CheckCircle } from "lucide-react"
import { Button } from "primereact/button"
const apiUrl = import.meta.env.VITE_APP_API_URL

const SignUp = () => {
  document.title = "Login"
  const navigate = useNavigate()
  const { user, loginUser } = useContext(AuthContext)
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    defaultValues: {
      LoginName: "",
      Password: "",
    },
  })

  useEffect(() => {
    if (user !== null) {
      navigate("/", { replace: true })
    }
  }, [user, navigate])

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.post(
        apiUrl + "/EduIMS/VerifyLogin",
        formData
      )
      if (data.success === true) {
        const dataToSerialize = {
          username:
            data.data[0].FirstName +
            " " +
            (data.data[0].LastName === null ? "" : data.data[0].LastName),
          userID: data.data[0].LoginUserID,
          image: data.data[0]?.ProfilePic,
          DepartmentID: data.data[0].DepartmentID,
        }

        loginUser(dataToSerialize)
        toast("Login sucessful", {
          autoClose: 1500,
          position: "top-right",
          icon: <CheckCircle />,
        })
      } else {
        toast.error(data.Message, {
          autoClose: 1500,
          position: "top-right",
        })
      }
    },
    onError: () => {
      toast.error("Something went wrong! Please try again later", {
        position: "top-left",
        autoClose: 1500,
      })
    },
  })

  function onSubmit(data) {
    mutation.mutate(data)
  }

  return (
    <>
      {/* <div
        id="login-container"
        className="flex justify-content-end min-h-screen mx-5"
      >
        <Card className="my-5 bg-glass w-50">
          <Card.Body className="p-5">
            <div className="text-center mb-5">
              <i
                className="fas fa-crow fa-3x me-3"
                style={{ color: "#709085" }}
              />
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
                <p className="text-red-700">{errors.LoginName?.message}</p>
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
                <p className="text-red-700">{errors.Password?.message}</p>
              </Row>

              <Button
                className="w-100 mb-4 fs-5 p-2"
                size="md"
                type="submit"
                style={{
                  background: "#7ED957",
                  border: "none",
                  outline: "none",
                }}
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
      </div> */}
      <div className="w-full min-h-screen flex align-items-center justify-content-center login-container__body text-white">
        <div className="w-full lg:w-5 xl:2-5 p-4 rounded shadow flex flex-column gap-5 login-container">
          <div className="w-full text-center">
            <h1>
              edu
              <span style={{ color: "#0CAB77", padding: 0, margin: 0 }}>
                IMS
              </span>
            </h1>
          </div>
          <div className="w-full">
            <form
              className="flex flex-column gap-3"
              onSubmit={handleSubmit(onSubmit)}
              method="post"
            >
              <div className="w-full">
                <label htmlFor="Username" className="font-bold">
                  Username
                </label>

                <input
                  {...register("LoginName", {
                    required: true,
                  })}
                  className={`w-full p-2 text-lg rounded login-input ${errors.LoginName ? "invalid" : ""} `}
                  placeholder="Username"
                />
              </div>
              <div className="w-full">
                <label htmlFor="Password" className="font-bold">
                  Password
                </label>

                <input
                  {...register("Password", {
                    required: true,
                  })}
                  className={`w-full p-2 text-lg rounded login-input ${errors.Password ? "invalid" : ""} `}
                  type="password"
                  placeholder="Password"
                />
              </div>
              <div className="w-full">
                <Button
                  label="Login"
                  pt={{
                    root: {
                      className: "w-full rounded",
                    },
                  }}
                  loading={mutation.isPending}
                  loadingIcon="pi pi-spin pi-spinner"
                />
              </div>
              <div className="text-center">
                <p>
                  Developed at{" "}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="http://www.edusoftsolutions.com"
                    className="text-center"
                    style={{ color: "#0CAB77", textDecoration: "underline" }}
                  >
                    Edusoft System Solutions
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignUp
