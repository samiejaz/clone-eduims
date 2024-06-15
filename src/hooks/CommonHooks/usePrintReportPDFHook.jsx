import { useMutation } from "@tanstack/react-query"
import React from "react"
import { PrintReportInNewTabWithLoadingToast } from "../../utils/CommonFunctions"
import { Button } from "primereact/button"
import { CustomSpinner } from "../../components/CustomSpinner"

const usePrintReportPDFHook = () => {
  const mutation = useMutation({
    mutationFn: PrintReportInNewTabWithLoadingToast,
  })

  function handlePrintReport({ getPrintFromUrl, fullUrl }) {
    mutation.mutateAsync({
      controllerName: getPrintFromUrl || fullUrl,
    })
  }

  return {
    handlePrintReport,
    spinner: (
      <>
        {mutation.isPending && (
          <>
            <CustomSpinner message="Generating Receipt" />
          </>
        )}
      </>
    ),
    render: (
      <>
        <Button
          label={mutation.isPending ? "Generating..." : "Print"}
          icon="pi pi-print"
          className="rounded"
          type="button"
          severity="help"
          loading={mutation.isPending}
          loadingIcon="pi pi-spin pi-print"
          onClick={() => mutation.mutateAsync()}
          pt={{
            label: {
              className: "hidden md:block lg:block",
            },
          }}
        />
      </>
    ),
  }
}

export default usePrintReportPDFHook
