import React from "react"
import { fetchAllAccountsDataBusinessUnitWiseForReport } from "../../api/ReportsData"
import { useQuery } from "@tanstack/react-query"

const SubsidiarySheetSummary = () => {
  const { data: CustomerAccountsData } = useQuery({
    queryKey: ["CustomerAccountsData"],
    queryFn: () =>
      fetchAllAccountsDataBusinessUnitWiseForReport(
        "?DateTo=25-May-2024&ReportType=Summary"
      ),

    refetchOnWindowFocus: false,
  })

  console.log(CustomerAccountsData)

  return <div>SubsidiarySheetSummary</div>
}

export default SubsidiarySheetSummary
