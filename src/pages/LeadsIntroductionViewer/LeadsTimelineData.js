import axios from "axios"
import { ShowErrorToast } from "../../utils/CommonFunctions"
import { decryptID } from "../../utils/crypto"

const apiUrl = import.meta.env.VITE_APP_API_URL

export async function getLeadsTimeline({ LeadIntroductionID, LoginUserID }) {
  if (LeadIntroductionID !== undefined) {
    LeadIntroductionID = decryptID(LeadIntroductionID)
    const { data } = await axios.post(
      apiUrl +
        `/data_LeadIntroduction/GetLeadIntroductionDetailData?LoginUserID=${LoginUserID}&LeadIntroductionID=${LeadIntroductionID}`
    )
    return data.data
  } else {
    return []
  }
}
export async function getLeadsTimelineDetail({
  LeadIntroductionDetailID,
  LoginUserID,
}) {
  try {
    if (
      LeadIntroductionDetailID !== undefined &&
      LeadIntroductionDetailID !== 0
    ) {
      LeadIntroductionDetailID = decryptID(LeadIntroductionDetailID)

      const { data } = await axios.post(
        apiUrl +
          `/data_LeadIntroduction/GetLeadIntroductionDetailDataWhere?LoginUserID=${LoginUserID}&LeadIntroductionDetailID=${LeadIntroductionDetailID}`
      )
      return data.data
    } else {
      return []
    }
  } catch (e) {
    ShowErrorToast(e.message)
  }
}
