import React, { useEffect, useState } from "react"
import { Row, Form, Col } from "react-bootstrap"
import { useForm } from "react-hook-form"
import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import { addLeadIntroductionOnAction } from "../../api/LeadIntroductionData"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useUserData } from "../../context/AuthContext"
import { toast } from "react-toastify"
import { LeadsViewerButtonToolBar } from "../../pages/LeadsIntroductionViewer/LeadsIntroductionViewer"
import { QUERY_KEYS } from "../../utils/enums"
import { getLeadsTimelineDetail } from "../../pages/LeadsIntroductionViewer/LeadsTimelineData"

const defaultValues = {
  Description: "",
}

const RevertBackModal = ({
  visible,
  setVisible,
  LeadsIntroductionID,
  LeadIntroductionDetailID,
}) => {
  return (
    <Dialog
      header="Return"
      onHide={() => setVisible(false)}
      visible={visible}
      style={{ minWidth: "60vw", minHeight: "40vh" }}
    >
      <RevertBackFields
        LeadIntroductionID={LeadsIntroductionID}
        LeadIntroductionDetailID={LeadIntroductionDetailID}
        setVisible={setVisible}
      />
    </Dialog>
  )
}
export default RevertBackModal

export const useRevertBackModalHook = ({
  LeadsIntroductionID = 0,
  LeadIntroductionDetailID = 0,
}) => {
  const [visible, setVisible] = useState(false)

  return {
    setVisible,
    render: (
      <RevertBackModal
        visible={visible}
        setVisible={setVisible}
        LeadsIntroductionID={LeadsIntroductionID}
        LeadIntroductionDetailID={LeadIntroductionDetailID}
      />
    ),
  }
}

export const RevertBackFields = ({
  LeadIntroductionID = 0,
  LeadIntroductionDetailID = 0,
  ShowToolBar = false,
  ResetFields = true,
  AreFieldsEnable = true,
  setVisible,
}) => {
  const queryClient = useQueryClient()
  const [isEnable, setIsEnable] = useState(AreFieldsEnable)

  const user = useUserData()

  const method = useForm({
    defaultValues,
  })

  const { data } = useQuery({
    queryKey: ["key2", LeadIntroductionDetailID],
    queryFn: () =>
      getLeadsTimelineDetail({
        LeadIntroductionDetailID,
        LoginUserID: user.userID,
      }),
  })

  useEffect(() => {
    if (LeadIntroductionDetailID !== 0 && data && data.length > 0) {
      method.setValue("Description", data[0].Description)
    }
  }, [LeadIntroductionDetailID, data])

  const mutation = useMutation({
    mutationFn: addLeadIntroductionOnAction,
    onSuccess: ({ success }) => {
      if (success) {
        toast.success("Retruned successfully!")
        if (ResetFields) {
          method.reset()

          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.LEADS_DEMO_DATA],
          })
          setVisible(false)
        } else {
          setIsEnable(false)
        }
      }
    },
  })

  const onSubmit = (data) => {
    mutation.mutate({
      formData: data,
      LeadIntroductionID: LeadIntroductionID,
      LeadIntroductionDetailID: LeadIntroductionDetailID,
      userID: user.userID,
      from: "Pending",
    })
  }

  const dialogContent = (
    <>
      <form>
        {ShowToolBar && (
          <>
            <div style={{ marginBottom: "1rem" }}>
              <LeadsViewerButtonToolBar
                LeadIntroductionID={LeadIntroductionID}
                handleSave={() => method.handleSubmit(onSubmit)()}
                isLoading={mutation.isPending}
                handleEdit={() => setIsEnable(true)}
                handleCancel={() => setIsEnable(false)}
                isEnable={isEnable}
              />
            </div>
          </>
        )}

        <Row>
          <Form.Group as={Col} controlId="Description" className="col-12">
            <Form.Label>Reason</Form.Label>
            <Form.Control
              as={"textarea"}
              rows={1}
              className="form-control"
              style={{
                padding: "0.3rem 0.4rem",
                fontSize: "0.8em",
              }}
              {...method.register("Description")}
              disabled={!isEnable}
            />
          </Form.Group>
        </Row>
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          {!ShowToolBar && (
            <>
              <Button
                label="Save"
                severity="success"
                className="rounded"
                type="button"
                onClick={() => method.handleSubmit(onSubmit)()}
              />
            </>
          )}
        </div>
      </form>
    </>
  )

  return <>{dialogContent}</>
}
