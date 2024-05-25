import React from "react"
import { Route, Routes } from "react-router-dom"
import { ReportRightsWrapper } from "../../components/Wrappers/wrappers"
import { MENU_KEYS, ROUTE_URLS } from "../../utils/enums"
import {
  BusinessUnitAndBalanceWiseAccountLedgersReprot,
  AccountLedgerReport,
  SubsidiarySheetReport,
} from "./index"

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
        element={
          <ReportRightsWrapper
            menuKey={
              MENU_KEYS.REPORTS.BUSINESS_UNIT_AND_BALANCE_LEDGER_REPORT_FORM_KEY
            }
            ReportComponent={BusinessUnitAndBalanceWiseAccountLedgersReprot}
          />
        }
      />
      <Route
        path={ROUTE_URLS.REPORTS.SUBSIDIARY_SHEET_REPORT_ROUTE.replaceAll(
          "/reports",
          ""
        )}
        element={
          <ReportRightsWrapper
            menuKey={MENU_KEYS.REPORTS.SUBSIDIARY_REPORT_FORM_KEY}
            ReportComponent={SubsidiarySheetReport}
          />
        }
      />
    </Routes>
  )
}

export default Reports
