import React from "react"
import { Route, Routes } from "react-router-dom"
import AccountLedgerReport from "./AccountLedgerReport"
import { ReportRightsWrapper } from "../../components/Wrappers/wrappers"
import { MENU_KEYS, ROUTE_URLS } from "../../utils/enums"
import BusinessUnitAndBalanceWiseAccountLedgers from "./BusinessUnitAndBalanceWiseAccountLedgers"

const Reports = () => {
  return (
    <Routes>
      <Route
        path={ROUTE_URLS.REPORTS.ACCOUNT_LEDGER_REPORT_ROUTE.replaceAll(
          "/reports",
          ""
        )}
        element={
          <ReportRightsWrapper
            menuKey={MENU_KEYS.REPORTS.ACCOUNT_LEDGER_REPORT_FORM_KEY}
            ReportComponent={AccountLedgerReport}
          />
        }
      />
      <Route
        path={ROUTE_URLS.REPORTS.BUSINESS_UNIT_AND_BALANCE_LEDGER_REPORT_ROUTE.replaceAll(
          "/reports",
          ""
        )}
        element={<BusinessUnitAndBalanceWiseAccountLedgers />}
      />
    </Routes>
  )
}

export default Reports
