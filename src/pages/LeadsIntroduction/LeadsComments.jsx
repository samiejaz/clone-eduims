import React, { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUserData } from "../../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addNewComment,
  deleteCommentByID,
  fetchAllLeadComments,
} from "../../api/LeadsIntroductionCommentsData";
import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { Mention } from "primereact/mention";
import { Button } from "primereact/button";
import { ROUTE_URLS } from "../../utils/enums";
import { Dialog } from "primereact/dialog";
import { CIconButton } from "../../components/Buttons/CButtons";
import useDeleteModal from "../../hooks/useDeleteModalHook";

const LeadsComments = () => {
  const { LeadIntroductionID } = useParams();
  const navigate = useNavigate();
  const user = useUserData();

  const commentDialogRef = useRef();

  return (
    <div className="mt-4">
      <div className="s-sb">
        <Button
          onClick={() => navigate(ROUTE_URLS.LEAD_INTRODUCTION_ROUTE)}
          type="button"
          icon="pi pi-arrow-left"
          label="Back to Leads"
          className="rounded"
        />
        <Button
          onClick={() => commentDialogRef.current?.setVisible(true)}
          type="button"
          icon="pi pi-plus"
          label="Add New Comment"
          className="rounded"
          severity="success"
        />
      </div>
      <div id="hide-scrollbar">
        <CommentsContainer
          LeadIntroductionID={LeadIntroductionID}
          user={user}
        />
      </div>
      <div>
        <CreateCommentDialog
          user={user}
          LeadIntroductionID={LeadIntroductionID}
          ref={commentDialogRef}
        />
      </div>
    </div>
  );
};

const CommentsContainer = ({ LeadIntroductionID, user }) => {
  const { data } = useQuery({
    queryKey: ["leadComments"],
    queryFn: () =>
      fetchAllLeadComments({
        LeadIntroductionID: LeadIntroductionID,
        LoginUserID: user.userID,
      }),
  });

  return (
    <>
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {data?.length > 0 ? (
            data.map((comment, index) => (
              <React.Fragment key={comment.CommentID}>
                <SingleComment comment={comment} user={user} />
              </React.Fragment>
            ))
          ) : (
            <div style={{ textAlign: "center" }}>
              <p>No Comments!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const SingleComment = ({ comment, user }) => {
  const queryClient = useQueryClient();

  function handleDelete(id) {
    deleteMutation.mutate({
      CommentID: id,
      LoginUserID: user.userID,
    });
  }

  const deleteMutation = useMutation({
    mutationFn: deleteCommentByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadComments"] });
    },
  });

  return (
    <>
      <Card
        title={
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Avatar
                image={"data:image/png;base64," + comment.ProfilePic}
                size="large"
                shape="circle"
              />
              <div className="s-sb s-w-100">
                <div>
                  <p
                    style={{
                      margin: 0,
                      padding: 0,
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                    }}
                  >
                    {comment.FullName}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      padding: 0,
                      fontWeight: "lighter",
                      fontSize: "1rem",
                    }}
                  >
                    {"@" + comment.UserName}
                  </p>
                </div>
                {user.userID === comment.EntryUserID && (
                  <>
                    <div>
                      <CIconButton
                        icon="pi pi-trash"
                        severity="danger"
                        tooltip="Delete"
                        onClick={() => handleDelete(comment.CommentID)}
                        toolTipPostion="left"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        }
        style={{
          width: "100%",
          boxShadow: "none",
          borderBottom: "1px solid #eee",
        }}
      >
        <p style={{ marginLeft: "4rem", marginBottom: "0" }}>
          {comment.Comment}
        </p>
      </Card>
    </>
  );
};

const CreateCommentDialog = React.forwardRef(
  ({ user, LeadIntroductionID }, commentDialogRef) => {
    const [visible, setVisible] = useState(false);
    const queryClient = useQueryClient();

    React.useImperativeHandle(commentDialogRef, () => ({
      setVisible,
    }));

    const mutation = useMutation({
      mutationFn: addNewComment,
      onSuccess: ({ success }) => {
        if (success) {
          queryClient.invalidateQueries({ queryKey: ["leadComments"] });
          setVisible(false);
        }
      },
    });

    const method = useForm({
      Comment: "",
    });

    function onSubmit(data) {
      mutation.mutate({
        formData: data,
        LeadIntroductionID: LeadIntroductionID,
        userID: user.userID,
        CommentID: 0,
      });
      method.reset();
    }

    return (
      <>
        <Dialog
          visible={visible}
          onHide={() => setVisible(false)}
          style={{ width: "80vw", height: "50vh" }}
        >
          <p className="form-label">Comment</p>
          <Controller
            name="Comment"
            control={method.control}
            rules={{ required: "Value is required." }}
            render={({ field, fieldState }) => (
              <Mention
                id={field.name}
                field="nickname"
                {...field}
                rows={6}
                className={classNames({ "p-invalid": fieldState.error })}
                placeholder="Add a new comment..."
                style={{ width: "100%", margin: "0", padding: "0" }}
                pt={{
                  input: {
                    style: {
                      width: "100%",
                    },
                  },
                }}
              />
            )}
          />
          <div className="mt-2" style={{ textAlign: "end" }}>
            <Button
              icon="pi pi-send"
              label="Add Comment"
              type="button"
              onClick={() => method.handleSubmit(onSubmit)()}
            />
          </div>
        </Dialog>
      </>
    );
  }
);

export default LeadsComments;
