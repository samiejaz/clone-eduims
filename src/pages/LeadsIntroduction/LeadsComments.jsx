import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useUserData } from "../../context/AuthContext"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  addNewComment,
  deleteCommentByID,
  fetchAllLeadComments,
} from "../../api/LeadsIntroductionCommentsData"
import { Controller, useForm } from "react-hook-form"
import { classNames } from "primereact/utils"
import { Button } from "primereact/button"
import { InputText } from "primereact/inputtext"
import { ContextMenu } from "primereact/contextmenu"
import { confirmDialog } from "primereact/confirmdialog"
import { Avatar } from "primereact/avatar"
import { CustomSpinner } from "../../components/CustomSpinner"
import { ROUTE_URLS } from "../../utils/enums"
import { CIconButton } from "../../components/Buttons/CButtons"
import { decryptID } from "../../utils/crypto"
import { Dialog } from "primereact/dialog"

const LeadsComments = () => {
  const { LeadIntroductionID } = useParams()
  const user = useUserData()

  return (
    <LeadCommentProivder>
      <div className="flex flex-column h-full" style={{ minHeight: "90vh" }}>
        <div
          id="comment-scrollbar"
          className="flex-grow-1 w-full relative overflow-y-scroll"
        >
          <div className="absolute top-0 left-0 right-0 bottom-2">
            <CommentsContainer
              LeadIntroductionID={decryptID(LeadIntroductionID)}
              user={user}
            />
          </div>
        </div>
        <div className="flex-none w-full">
          <CreateCommentInput
            LeadIntroductionID={decryptID(LeadIntroductionID)}
            user={user}
          />
        </div>
      </div>
    </LeadCommentProivder>
  )
}

const CONTEXT_ACTIONS = {
  EDIT_ACTION: "Edit",
  DELETE_ACTION: "Delete",
}

const CommentsContainer = ({ LeadIntroductionID, user }) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [commentID, setCommentID] = useState(null)
  const [commentText, setCommentText] = useState(null)
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["leadComments"],
    queryFn: () =>
      fetchAllLeadComments({
        LeadIntroductionID: LeadIntroductionID,
        LoginUserID: user.userID,
      }),
  })

  const { setComment } = useContext(LeadCommentContext)

  const cm = useRef(null)

  const items = [
    // {
    //   label: "Edit",
    //   icon: "pi pi-pencil",
    //   command: () => {
    //     handleClick(commentID, CONTEXT_ACTIONS.EDIT_ACTION, commentText);
    //   },
    // },
    {
      label: "Delete",
      icon: "pi pi-trash",
      command: () => {
        handleClick(commentID, CONTEXT_ACTIONS.DELETE_ACTION)
      },
    },
  ]

  const onRightClick = (event, commentId, commentText = "") => {
    if (cm.current) {
      setCommentID(commentId)
      if (commentText !== "") {
        setCommentText(commentText)
      }
      cm.current.show(event)
    }
  }

  function handleClick(id, action, comment = "") {
    if (action === CONTEXT_ACTIONS.EDIT_ACTION) {
      handleEdit(id, comment)
    } else if (action === CONTEXT_ACTIONS.DELETE_ACTION) {
      confirmDialog({
        message: "Are you sure you want to delete this comment?",
        header: "Confirmation",
        icon: "pi pi-info-circle",
        defaultFocus: "reject",
        acceptClassName: "p-button-danger",
        position: "top",
        accept: () => handleDelete(id),
        reject: () => {},
      })
    } else {
    }
  }

  const deleteMutation = useMutation({
    mutationFn: deleteCommentByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadComments"] })
    },
  })

  function handleDelete(id) {
    deleteMutation.mutate({
      CommentID: id,
      LoginUserID: user.userID,
    })
  }

  function handleEdit(id, comment) {
    setComment({
      CommentID: id,
      Comment: comment,
    })
  }

  return (
    <>
      {isLoading || isFetching ? (
        <>
          <CustomSpinner message="Loading Comments..." />
        </>
      ) : (
        <>
          <div className="relative">
            <CIconButton
              icon="pi pi-arrow-left"
              onClick={() => navigate(-1)}
              severity="secondary"
              tooltip="Go Back..."
              className="fixed"
              style={{ top: "3rem", left: "6.3rem" }}
            />

            <hr
              className="mt-2"
              aria-hidden="true"
              style={{ color: "#F9FAFB" }}
            />
            <div className="flex align-items-center flex-column ">
              <ul className="w-full flex flex-column gap-2">
                {data?.length > 0 ? (
                  data.map((comment, index) => (
                    <React.Fragment key={comment.CommentID}>
                      <SingleComment
                        comment={comment}
                        user={user}
                        handleRightClick={onRightClick}
                        key={comment.CommentID}
                      />
                    </React.Fragment>
                  ))
                ) : (
                  <li style={{ textAlign: "center" }}>
                    <div
                      className="flex align-items-center justify-content-center"
                      style={{ minHeight: "80vh" }}
                    >
                      <p>No Comments!</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>

            <ContextMenu
              ref={cm}
              model={items}
              onHide={() => {
                setCommentID(null)
                setCommentText(null)
              }}
              pt={{
                menu: {
                  className: "m-0",
                },
              }}
            />
          </div>
        </>
      )}
    </>
  )
}

const SingleComment = ({ comment, user, handleRightClick }) => {
  return (
    <>
      <li
        className={classNames("flex w-full align-self-start gap-1", {
          "align-self-end": comment.EntryUserID === user.userID,
        })}
        style={{ maxWidth: "fit-content" }}
        onContextMenu={(event) => {
          if (comment.EntryUserID === user.userID) {
            handleRightClick(event, comment.CommentID, comment.Comment)
          }
        }}
      >
        <div
          className={classNames("flex-none", {
            "flex-order-1": comment.EntryUserID === user.userID,
          })}
        >
          <Avatar
            image={"data:image/png;base64," + comment.ProfilePic}
            size="large"
            shape="circle"
          />
        </div>
        <div
          className={classNames("flex-grow-1 px-3 py-2 rounded", {
            "flex-order-0": comment.EntryUserID === user.userID,
          })}
          style={{ background: "#202C33", color: "white" }}
        >
          <p className="p-0 m-0 text-sm font-semibold">~{comment.FullName}</p>
          <p className="p-0 m-0" style={{ whiteSpace: "pre-line" }}>
            {comment.Comment}
          </p>
        </div>
      </li>
    </>
  )
}

const CreateCommentInput = ({ LeadIntroductionID, user }) => {
  const queryClient = useQueryClient()
  const method = useForm({
    defaultValues: {
      Comment: "",
      EditComment: "",
    },
  })
  const { comment, setComment } = useContext(LeadCommentContext)

  useEffect(() => {
    if (comment?.Comment !== null) {
      method.setValue("EditComment", comment.Comment)
      method.setFocus("EditComment")
    }
  }, [comment])

  const mutation = useMutation({
    mutationFn: addNewComment,
    onSuccess: ({ success }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: ["leadComments"] })
        setComment({ CommentID: null, Comment: null })
        method.reset()
      }
    },
  })

  function onSubmit(data) {
    try {
      mutation.mutate({
        formData: data,
        LeadIntroductionID: LeadIntroductionID,
        userID: user.userID,
        CommentID: comment.CommentID ?? 0,
      })
    } catch (e) {
      toast.error(e.message, {
        autoClose: false,
      })
    }
  }

  return (
    <>
      <div className="py-2">
        <div className="flex align-items-center justify-content-between gap-2">
          <div className="flex-grow-1">
            <Controller
              id="Comment"
              name="Comment"
              control={method.control}
              rules={{ required: comment.CommentID === null }}
              render={({ field, fieldState }) => (
                <>
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={field.value}
                    ref={field.ref}
                    onChange={(e) => {
                      field.onChange(e.target.value)
                    }}
                    rows={1}
                    placeholder="Type your comment..."
                    className={classNames(
                      "unresize-textarea p-inputtext w-100 p-3",
                      {
                        "p-invalid": fieldState.error,
                      }
                    )}
                    onKeyDown={(e) => {
                      if (e.shiftKey && e.key === "Enter") {
                        e.preventDefault()
                        const start = e.target.selectionStart
                        const end = e.target.selectionEnd
                        const newText =
                          e.target.value.substring(0, start) +
                          "\n" +
                          e.target.value.substring(end)
                        e.target.value = newText
                        e.target.selectionStart = e.target.selectionEnd =
                          start + 1
                      } else if (e.key === "Enter" && e.target.value !== "") {
                        method.handleSubmit(onSubmit)()
                      }
                    }}
                  ></textarea>
                </>
              )}
            />
          </div>
          <div className="flex-none align-self-stretch">
            <Button
              type="button"
              onClick={() => method.handleSubmit(onSubmit)()}
              icon="pi pi-send"
              tooltipOptions={{
                position: "left",
              }}
              tooltip="Send"
              severity="primary"
              pt={{
                root: {
                  className: "rounded h-full",
                },
                icon: {
                  className: "text-xl",
                },
              }}
            />
          </div>
        </div>
      </div>
      <Dialog
        visible={comment.CommentID !== null}
        onHide={() => {
          setComment({
            Comment: null,
            CommentID: null,
          })
        }}
        style={{ width: "80vw", height: "30vh" }}
      >
        <Controller
          id="EditComment"
          name="EditComment"
          control={method.control}
          rules={{ required: comment.CommentID !== null }}
          render={({ field, fieldState }) => (
            <>
              <textarea
                id={field.name}
                name={field.name}
                value={field.value}
                ref={field.ref}
                onChange={(e) => {
                  field.onChange(e.target.value)
                }}
                placeholder="Type your comment..."
                className={classNames("p-inputtext w-100 p-3", {
                  "p-invalid": fieldState.error,
                })}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.shiftKey) {
                    e.preventDefault()
                    const start = e.target.selectionStart
                    const end = e.target.selectionEnd
                    const newText =
                      e.target.value.substring(0, start) +
                      "\n" +
                      e.target.value.substring(end)
                    e.target.value = newText
                    e.target.selectionStart = e.target.selectionEnd = start + 1
                  }

                  // if (e.key === "Enter" && e.target.value !== "") {
                  //   method.handleSubmit(onSubmit)();
                  // }
                }}
              ></textarea>
            </>
          )}
        />
      </Dialog>
    </>
  )
}

export default LeadsComments

const LeadCommentContext = createContext()

const LeadCommentProivder = ({ children }) => {
  const [comment, setComment] = useState({
    CommentID: null,
    Comment: null,
  })

  return (
    <LeadCommentContext.Provider value={{ comment, setComment }}>
      {children}
    </LeadCommentContext.Provider>
  )
}
