import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useState } from "react"
import { CustomSpinner } from "../../components/CustomSpinner"
import { PrintReportInNewTabWithLoadingToast } from "../../utils/CommonFunctions"

const apiUrl = import.meta.env.VITE_APP_API_URL
const useReportViewer = ({ controllerName, ShowPrintInNewTab = false }) => {
  const [queryParams, setQueryParams] = useState(null)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["accountLedgerReport", queryParams],
    queryFn: async () => {
      const { data: base64String } = await axios.post(
        apiUrl + controllerName + queryParams
      )

      return base64String
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    enabled: queryParams !== null,
  })

  function generateReport(reportQueyrParams) {
    if (!ShowPrintInNewTab) {
      setQueryParams(reportQueyrParams)
    } else {
      PrintReportInNewTabWithLoadingToast({
        fullUrl: apiUrl + controllerName + reportQueyrParams,
      })
    }
  }

  return {
    generateReport,
    render: (
      <>
        {(isLoading || isFetching) && (
          <>
            <CustomSpinner message="Generating report..." />
          </>
        )}
        {data && (
          <>
            <div className="w-full h-full">
              <embed
                width="100%"
                height="100%"
                src={`data:application/pdf;base64,${data}`}
                type="application/pdf"
              />
            </div>
          </>
        )}
      </>
    ),
  }
}

export default useReportViewer
