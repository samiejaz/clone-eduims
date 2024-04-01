import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Image } from "primereact/image";
import { useForm } from "react-hook-form";
import { SingleFileUploadField, TextInput } from "../Forms/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import {
  ShowErrorToast,
  convertBase64StringToFile,
} from "../../utils/CommonFunctions";
import { useNavigate } from "react-router-dom";
import { FormColumn, FormRow } from "../Layout/LayoutComponents";
import { FormLabel } from "react-bootstrap";

const apiUrl = import.meta.env.VITE_APP_API_URL;

function UserProfile({ showProfile, handleCloseProfile }) {
  const [isEnable, setIsEnable] = useState(true);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const fileRef = useRef();

  const { control, handleSubmit, setValue, register } = useForm({
    defaultValues: {
      FirstName: "",
      LastName: "",
      Email: "",
      UserName: "",
    },
  });

  const { user, loginUser, setUser } = useContext(AuthContext);
  const { data: UserData } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data } = await axios.post(
        `${apiUrl}/EduIMS/GetUserInfo?LoginUserID=${user.userID}`
      );
      let localStorageUser = JSON.parse(localStorage.getItem("user"));
      if (localStorageUser === null) {
        navigate("/auth");
        setUser(null);
      } else {
        // loginUser(
        //   {
        //     userID: data?.data[0]?.LoginUserID,
        //     username: `${data?.data[0]?.FirstName}  ${data?.data[0]?.LastName}`,
        //     image: data?.data[0]?.ProfilePic,
        //   },
        //   false
        // );
      }
      return data;
    },
  });

  const userProfileMutation = useMutation({
    mutationFn: async (formData) => {
      try {
        let newFormData = new FormData();
        newFormData.append("FirstName", formData.FirstName);
        newFormData.append("LastName", formData.LastName);
        newFormData.append("Email", formData.Email);
        newFormData.append("Username", formData.Username);
        newFormData.append("LoginUserID", user.userID);
        newFormData.append("image", formData.UserImage);
        const { data } = await axios.post(
          apiUrl + "/EduIMS/UsersInfoUpdate",
          newFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (data.success === false) {
          ShowErrorToast(data.message);
        } else {
          toast.success("Profile updated successfully!", {
            autoClose: 1000,
          });
          queryClient.invalidateQueries({ queryKey: ["currentUser"] });
          handleCloseProfile();
          setIsEnable(true);
        }
      } catch (err) {
        ShowErrorToast(err.message);
      }
    },
  });

  useEffect(() => {
    if (user?.userID !== 0 && UserData?.data) {
      setValue("FirstName", UserData?.data[0]?.FirstName);
      setValue("LastName", UserData?.data[0]?.LastName);
      setValue("Email", UserData?.data[0]?.Email);
      setValue("Username", UserData?.data[0]?.UserName);
      console.log(UserData?.data[0].ProfilePic);
      if (UserData?.data[0].ProfilePic) {
        fileRef.current?.setBase64File(
          "data:image/png;base64," + UserData?.data[0].ProfilePic
        );
      }
    }
  }, [user, UserData]);

  function onSubmit(data) {
    const file = fileRef.current?.getFile();
    if (file === null) {
      fileRef.current?.setError();
    } else {
      data.UserImage = file;
      userProfileMutation.mutate(data);
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
                      onClick={() => setIsEnable(false)}
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
                      handleCloseProfile();
                      setIsEnable(true);
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
        style={{ width: "40vw", height: "100vh" }}
        onHide={() => {
          handleCloseProfile();
          setIsEnable(true);
        }}
      >
        <div>
          <form>
            <div style={{ textAlign: "center" }}>
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
              {/* <Image
                src={"data:image/png;base64," + imgData}
                alt="Image"
                width="250"
                preview
                className="text-center"
                pt={{
                  previewContainer: {
                    style: {
                      borderRadius: "50%",
                    },
                  },
                }}
              /> */}
            </div>
            <TextInput
              control={control}
              required={true}
              Label={"First Name"}
              ID={"FirstName"}
              isEnable={!isEnable}
            />
            <TextInput
              control={control}
              required={true}
              Label={"Last Name"}
              ID={"LastName"}
              isEnable={!isEnable}
            />
            <TextInput
              control={control}
              required={true}
              Label={"Email"}
              ID={"Email"}
              isEnable={!isEnable}
            />
            <TextInput
              control={control}
              required={true}
              Label={"Username"}
              ID={"Username"}
              isEnable={!isEnable}
            />
          </form>
        </div>
      </Dialog>
    </>
  );
}

export default UserProfile;
