import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Image } from "primereact/image";
import { useForm } from "react-hook-form";
import { TextInput } from "../Forms/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { FileUpload } from "primereact/fileupload";
import { toast } from "react-toastify";
import { convertBase64StringToFile } from "../../utils/CommonFunctions";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_APP_API_URL;

function UserProfile({ showProfile, handleCloseProfile }) {
  const [isEnable, setIsEnable] = useState(true);
  const [imgData, setImgData] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
        loginUser(
          {
            userID: data?.data[0]?.LoginUserID,
            username: `${data?.data[0]?.FirstName}  ${data?.data[0]?.LastName}`,
            image: data?.data[0]?.ProfilePic,
          },
          false
        );
      }
      return data;
    },
  });

  const userProfileMutation = useMutation({
    mutationFn: async (formData) => {
      let newFormData = new FormData();
      newFormData.append("FirstName", formData.FirstName);
      newFormData.append("LastName", formData.LastName);
      newFormData.append("Email", formData.Email);
      newFormData.append("Username", formData.Username);
      newFormData.append("LoginUserID", user.userID);
      let file = convertBase64StringToFile(imgData);
      newFormData.append("image", file);
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
        toast.error(data.message, {
          autoClose: 1000,
        });
      } else {
        toast.success("Profile updated successfully!", {
          autoClose: 1000,
        });
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        handleCloseProfile();
        setIsEnable(true);
      }
    },
    onError: (err) => {
      toast.error("Error while saving data!!");
    },
  });

  useEffect(() => {
    if (user?.userID !== 0 && UserData?.data) {
      setValue("FirstName", UserData?.data[0]?.FirstName);
      setValue("LastName", UserData?.data[0]?.LastName);
      setValue("Email", UserData?.data[0]?.Email);
      setValue("Username", UserData?.data[0]?.UserName);
      setImgData(UserData?.data[0]?.ProfilePic);
    }
  }, [user, UserData]);

  function onSubmit(data) {
    userProfileMutation.mutate(data);
  }

  return (
    <>
      <Dialog
        header={"Your Profile"}
        visible={showProfile}
        draggable={false}
        position="top"
        style={{ width: "40vw", height: "80vh" }}
        onHide={() => {
          handleCloseProfile();
          setIsEnable(true);
        }}
        footer={
          <div>
            {isEnable ? (
              <>
                <>
                  <Button
                    label="Close"
                    icon="pi pi-times"
                    severity="warning"
                    type="button"
                    onClick={() => {
                      handleCloseProfile();
                      setIsEnable(false);
                    }}
                    className="p-button-text text-center"
                  />
                  <Button
                    label="Edit"
                    icon="pi pi-check"
                    severity="success"
                    type="button"
                    onClick={() => setIsEnable(false)}
                    style={{ borderRadius: "5px" }}
                    className="text-center"
                  />
                </>
              </>
            ) : (
              <>
                <Button
                  label="Cancel"
                  icon="pi pi-times"
                  severity="warning"
                  type="button"
                  onClick={() => {
                    handleCloseProfile();
                    setIsEnable(true);
                  }}
                  className="p-button-text text-center"
                />
                <Button
                  label="Update"
                  icon="pi pi-check"
                  severity="success"
                  type="button"
                  onClick={() => handleSubmit(onSubmit)()}
                  style={{ borderRadius: "5px" }}
                  className="text-center"
                />
              </>
            )}
          </div>
        }
      >
        <div>
          <form>
            <div style={{ textAlign: "center" }}>
              <Image
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
              />
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
