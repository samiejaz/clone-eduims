import axios from "axios";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_APP_API_URL;
const CONTROLLER = "UserLeadDashboard";

export async function fetchAllLeadComments({
  LoginUserID,
  LeadIntroductionID,
}) {
  const { data } = await axios.post(
    apiUrl +
      `/${CONTROLLER}/GetLeadIntroductionCommentsWhere?LoginUserID=${LoginUserID}&LeadIntroductionID=${LeadIntroductionID}`
  );
  return data.data ?? [];
}

export async function fetchAllLeadCommentByID({ LoginUserID, CommentiD }) {
  const { data } = await axios.post(
    apiUrl +
      `/${CONTROLLER}/GetLeadIntroductionCommentsWhere?LoginUserID=${LoginUserID}&CommentID=${CommentiD}`
  );
  return data.data ?? [];
}

export async function deleteCommentByID({ LoginUserID, CommentID }) {
  const { data } = await axios.post(
    apiUrl +
      `/${CONTROLLER}/LeadIntroductionCommentsDelete?CommentID=${CommentID}&LoginUserID=${LoginUserID}`
  );
  if (data.success === true) {
    toast.success("Comment sucessfully deleted!");
    return true;
  } else {
    toast.error(data.message, {
      autoClose: false,
    });
    return false;
  }
}

export async function addNewComment({
  formData,
  userID,
  LeadIntroductionID,
  CommentID = 0,
}) {
  try {
    const DataToSend = {
      CommentID: 0,
      LeadIntroductionID: LeadIntroductionID,
      Comment: formData.Comment,
      EntryUserID: userID,
    };

    if (CommentID === 0 || CommentID === undefined) {
      DataToSend.CommentID = 0;
    } else {
      DataToSend.CommentID = CommentID;
    }

    const { data } = await axios.post(
      apiUrl + `/${CONTROLLER}/LeadIntroductionCommentsInsertUpdate`,
      DataToSend
    );

    if (data.success === true) {
      if (CommentID !== 0) {
        toast.success("Comment updated successfully!");
      } else {
        toast.success("Comment created successfully!");
      }
      return { success: true, RecordID: data?.CommentID };
    } else {
      toast.error(data.message, {
        autoClose: false,
      });
      return { success: false, RecordID: CommentID };
    }
  } catch (e) {
    toast.error(e.message, {
      autoClose: false,
    });
  }
}
