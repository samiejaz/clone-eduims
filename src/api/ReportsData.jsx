import axios from "axios"
import { ShowErrorToast } from "../utils/CommonFunctions"

const apiUrl = import.meta.env.VITE_APP_API_URL

export async function fetchAllAccountsDataBusinessUnitWiseForReport(
  queryParams
) {
  try {
    if (queryParams) {
      const { data } = await axios.post(
        apiUrl + "/CustomerLedger/GetCustomerLedgerBalances" + queryParams
      )
      if (data.success) {
        let transformedData =
          data.data.length > 0
            ? getTransformedDataForCustomerAccountLedgerBusinessUnitWise(
                data.data
              )
            : []

        let totalsRow = calculateAndReturnTotalsRow(transformedData)
        transformedData.push(totalsRow)

        return transformedData ?? []
      } else {
        ShowErrorToast(data.Message)
        return []
      }
    } else {
      return []
    }
  } catch (error) {
    ShowErrorToast("FetchAll::" + error.message)
  }
}

function getTransformedDataForCustomerAccountLedgerBusinessUnitWise(data) {
  let result = []
  let accountMap = {}
  let businessUnits = {}
  data.forEach((entry) => {
    if (!businessUnits[entry.BusinessUnitID]) {
      businessUnits[entry.BusinessUnitID] = entry.BusinessUnitName
    }
  })

  data.forEach((entry) => {
    if (!accountMap[entry.AccountID]) {
      accountMap[entry.AccountID] = {
        AccountID: entry.AccountID,
        AccountTitle: entry.AccountTitle,
      }
      Object.keys(businessUnits).forEach((businessUnitID) => {
        accountMap[entry.AccountID][`BusinessUnit_${businessUnitID}`] = null
      })
      result.push(accountMap[entry.AccountID])
    }
    accountMap[entry.AccountID][`BusinessUnit_${entry.BusinessUnitID}`] =
      entry.Balance
  })

  return result
}

function calculateAndReturnTotalsRow(accounts) {
  const totals = {}
  accounts.forEach((account) => {
    Object.keys(account).forEach((key) => {
      if (key.startsWith("BusinessUnit_") && typeof account[key] === "number") {
        if (!totals[key]) {
          totals[key] = 0
        }
        totals[key] += account[key]
      }
    })
  })

  const summary = {
    AccountID: "Total",
    AccountTitle: "",
  }
  Object.keys(totals).forEach((key) => {
    summary[key] = totals[key]
  })

  return summary
}
