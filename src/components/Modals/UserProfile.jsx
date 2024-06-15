import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { useForm } from "react-hook-form"
import { PasswordField, SingleFileUploadField, TextInput } from "../Forms/form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { useAuthProvider } from "../../context/AuthContext"
import { toast } from "react-toastify"
import {
  ShowErrorToast,
  convertBase64StringToFile,
} from "../../utils/CommonFunctions"
import { useNavigate } from "react-router-dom"
import { FormColumn, FormRow, FormLabel } from "../Layout/LayoutComponents"
import { Image } from "primereact/image"
const apiUrl = import.meta.env.VITE_APP_API_URL

function UserProfile({ showProfile, handleCloseProfile }) {
  const [isEnable, setIsEnable] = useState(true)

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const fileRef = useRef()

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      FirstName: "",
      LastName: "",
      Email: "",
      UserName: "",
      Password: "",
    },
  })

  const { user, setUser, updateUserName } = useAuthProvider()
  const { data: UserData } = useQuery({
    queryKey: ["currentUser", user],
    queryFn: async () => {
      const { data } = await axios.post(
        `${apiUrl}/EduIMS/GetUserInfo?LoginUserID=${user.userID}`
      )
      let localStorageUser = JSON.parse(localStorage.getItem("user"))
      if (localStorageUser === null) {
        navigate("/auth")
        setUser(null)
      }
      if (data) {
        return data
      } else {
        return []
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 100 * 60 * 60 * 60 * 24,
  })

  const userProfileMutation = useMutation({
    mutationFn: async (formData) => {
      try {
        let newFormData = new FormData()
        newFormData.append("FirstName", formData.FirstName)
        newFormData.append("LastName", formData.LastName)
        newFormData.append("Email", formData.Email)
        newFormData.append("Username", formData.Username)
        newFormData.append("LoginUserID", user.userID)
        newFormData.append("Password", formData.Password)
        newFormData.append("image", formData.UserImage)
        const { data } = await axios.post(
          apiUrl + "/EduIMS/UsersInfoUpdate",
          newFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )

        if (data.success === false) {
          ShowErrorToast(data.message)
        } else {
          toast.success("Profile updated successfully!", {
            autoClose: 1000,
          })
          updateUserName(`${formData.FirstName}  ${formData.LastName}`)

          queryClient.invalidateQueries({ queryKey: ["currentUser"] })
          handleCloseProfile()
          setIsEnable(true)
        }
      } catch (err) {
        ShowErrorToast(err.message)
      }
    },
  })

  useEffect(() => {
    if (user?.userID !== 0 && UserData?.data) {
      setValue("FirstName", UserData?.data[0]?.FirstName)
      setValue("LastName", UserData?.data[0]?.LastName)
      setValue("Email", UserData?.data[0]?.Email)
      setValue("Username", UserData?.data[0]?.UserName)
      setValue("Password", UserData?.data[0]?.Password)
    }
  }, [user, UserData])

  function onSubmit(data) {
    const file = fileRef.current?.getFile(false)
    if (file === null) {
      let convertedFile = convertBase64StringToFile(
        "data:image/png;base64," + UserData?.data[0].ProfilePic,
        true
      )
      if (convertedFile) {
        data.UserImage = convertedFile
        userProfileMutation.mutate(data)
      }
    } else {
      data.UserImage = file
      userProfileMutation.mutate(data)
    }
  }

  return (
    <>
      <Dialog
        header={
          <>
            <div>
              {isEnable ? (
                <>
                  <>
                    <Button
                      label="Edit"
                      severity="success"
                      type="button"
                      onClick={() => {
                        setIsEnable(false)
                      }}
                      className="p-button-success rounded"
                      pt={{
                        label: {
                          className: "hidden md:block lg:block",
                        },
                        root: {
                          style: {
                            padding: "0.5rem",
                            fontSize: "0.7em",
                          },
                        },
                      }}
                    />
                  </>
                </>
              ) : (
                <div
                  className="flex gap-2"
                  style={{ justifyContent: "flex-start" }}
                >
                  <Button
                    label={"Cancel"}
                    type="button"
                    severity="warning"
                    onClick={() => {
                      //  handleCloseProfile();
                      setIsEnable(true)
                    }}
                    className="p-button-success rounded"
                    pt={{
                      label: {
                        className: "hidden md:block lg:block",
                      },
                      root: {
                        style: {
                          padding: "0.5rem",
                          fontSize: "0.7em",
                        },
                      },
                    }}
                  />
                  <Button
                    label="Update"
                    type="button"
                    severity="success"
                    onClick={() => handleSubmit(onSubmit)()}
                    loading={userProfileMutation.isPending}
                    loadingIcon={"pi pi-spin pi-cog"}
                    className="p-button-success rounded"
                    pt={{
                      label: {
                        className: "hidden md:block lg:block",
                      },
                      root: {
                        style: {
                          padding: "0.5rem",
                          fontSize: "0.7em",
                        },
                      },
                    }}
                  />
                </div>
              )}
            </div>
          </>
        }
        visible={showProfile}
        draggable={false}
        position="right"
        style={{ height: "100vh" }}
        pt={{
          root: {
            className: "w-full lg:w-5 xl:w-5",
          },
        }}
        onHide={() => {
          handleCloseProfile()
          setIsEnable(true)
        }}
      >
        <div>
          <form>
            <div style={{ textAlign: "center" }}>
              {!isEnable ? (
                <>
                  <FormRow>
                    <FormColumn lg={12} xl={12} md={12}>
                      <FormLabel>Profie Pic</FormLabel>
                      <div>
                        <SingleFileUploadField
                          ref={fileRef}
                          accept="image/*"
                          chooseBtnLabel="Select Image"
                          changeBtnLabel="Change Image"
                          mode={"edit"}
                        />
                      </div>
                    </FormColumn>
                  </FormRow>
                </>
              ) : (
                <>
                  <Image
                    src={
                      UserData?.data?.length > 0
                        ? "data:image/png;base64," +
                          UserData?.data[0]?.ProfilePic
                        : ""
                    }
                    width="100"
                    height="100"
                    pt={{
                      image: {
                        style: {
                          borderRadius: "50%",
                        },
                      },
                    }}
                    preview
                  />
                </>
              )}
            </div>
            <TextInput
              control={control}
              required={true}
              Label={"First Name"}
              ID={"FirstName"}
              isEnable={!isEnable}
              showErrorMessage={false}
            />
            <TextInput
              control={control}
              required={true}
              Label={"Last Name"}
              ID={"LastName"}
              isEnable={!isEnable}
              showErrorMessage={false}
            />
            <TextInput
              control={control}
              required={true}
              Label={"Email"}
              ID={"Email"}
              isEnable={!isEnable}
              showErrorMessage={false}
            />
            <TextInput
              control={control}
              required={true}
              Label={"Username"}
              ID={"Username"}
              isEnable={!isEnable}
              showErrorMessage={false}
            />

            <PasswordField
              control={control}
              name={"Password"}
              disabled={isEnable}
              label="Password"
            />
          </form>
        </div>
      </Dialog>
    </>
  )
}

export default UserProfile
