import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { preventFormByEnterKeySubmission } from "../../utils/CommonFunctions";
import { AppConfigurationContext } from "../../context/AppConfigurationContext";
import {
  FormRow,
  FormColumn,
  FormLabel,
} from "../../components/Layout/LayoutComponents";
import TextInput from "../../components/Forms/TextInput";
import { Button } from "primereact/button";
import { useKeyCombinationHook } from "../../hooks/hooks";
import { Tag } from "primereact/tag";
import SimpleToolbar from "../../components/Toolbars/SimpleToolbar";

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
  const { control, setFocus, handleSubmit, setValue } = useForm({
    defaultValues,
  });
  const { user } = useContext(AuthContext);

  useKeyCombinationHook(
    () => {
      handleSubmit(onSubmit)();
    },
    "s",
    true
  );

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
      try {
        let DataToSend = {
          ConfigID: ConfigID,
          ProductTitle: formData?.ProductName,
          CustomerBranchTitle: formData?.BranchName,
          EntryUserID: user?.userID,
        };

        const { data } = await axios.post(
          `${apiUrl}/EduIMS/ConfigOneInsertUpdate`,
          DataToSend
        );

        if (data.success === true) {
          toast.success("App Configuration updated successfully!");
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
    configurationMutation.mutate(data);
  }

  return (
    <>
      <div className="p-2">
        <SimpleToolbar
          onSaveClick={() => handleSubmit(onSubmit)()}
          title={"App Configuration"}
        />
        <form onKeyDown={preventFormByEnterKeySubmission}>
          <FormRow>
            <FormColumn lg={3} xl={3} md={6}>
              <FormLabel>Product Name</FormLabel>

              <div>
                <TextInput
                  control={control}
                  ID={"ProductName"}
                  focusOptions={() => setFocus("BranchName")}
                />
              </div>
            </FormColumn>
            <FormColumn lg={3} xl={3} md={6}>
              <FormLabel>Branch Name</FormLabel>

              <div>
                <TextInput control={control} ID={"BranchName"} />
              </div>
            </FormColumn>
          </FormRow>
        </form>
      </div>
    </>
  );
}

export default AppConfiguration;
