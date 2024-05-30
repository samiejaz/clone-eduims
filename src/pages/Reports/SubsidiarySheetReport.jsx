import { useForm } from "react-hook-form"
import {
  CDatePicker,
  CDropDownField,
  CheckBox,
} from "../../components/Forms/form"
import {
  FormRow,
  FormColumn,
  FormLabel,
} from "../../components/Layout/LayoutComponents"
import { Button } from "primereact/button"
import {
  formatDateWithSymbol,
  preventFormByEnterKeySubmission,
} from "../../utils/CommonFunctions"
import { useReportViewerHook } from "../../hooks/CommonHooks/commonhooks"
import { Link } from "react-router-dom"
import { ROUTE_URLS } from "../../utils/enums"

export default function SubsidiarySheetReport() {
  document.title = "Subsidiary Sheet"
  const method = useForm({
    defaultValues: {
      DateTo: new Date(),
      ShowZeroBalances: false,
      ReportType: "Summary",
    },
  })
  const { generateReport, render } = useReportViewerHook({
    controllerName: "/Reports/GetSubsidiarySheetReport",
  })

  function onSubmit(formData) {
    let queryParams = `?DateTo=${formatDateWithSymbol(formData.DateTo ?? new Date())}&ShowZeroBalances=${formData.ShowZeroBalances ? 1 : 0}&ReportType=${formData.ReportType}`
    generateReport(queryParams)
  }

  return (
    <>
      <div className="flex align-items-center justify-content-between w-full">
        <div>
          <h1 className="text-3xl">Subsidiary Sheet</h1>
        </div>
        {/* <div style={{ justifySelf: "end" }}>
          <Link to={ROUTE_URLS.REPORTS.SUBSIDIARY_SHEET_SUMMARY_REPORT_ROUTE}>
            <Button
              label="Table View"
              severity="secondary"
              type="button"
              icon="pi pi-arrow-right"
              iconPos="right"
              link
              text
            />
          </Link>
        </div> */}
      </div>
      <hr className="m-0 mb-2" />
      <form onKeyDown={preventFormByEnterKeySubmission}>
        <FormRow>
          <FormColumn lg={2} xl={2} md={6}>
            <FormLabel style={{ fontSize: "14px", fontWeight: "bold" }}>
              As On Date
              <span className="text-danger fw-bold ">*</span>
            </FormLabel>
            <div>
              <CDatePicker control={method.control} name={"DateTo"} />
            </div>
          </FormColumn>
          <FormColumn className="col-xl-3" lg={3} xl={3} md={6}>
            <FormLabel style={{ fontSize: "14px", fontWeight: "bold" }}>
              Report Type
            </FormLabel>
            <div>
              <CDropDownField
                control={method.control}
                name={"ReportType"}
                options={[
                  { label: "Summary", value: "Summary" },
                  { label: "Detail", value: "Detail" },
                ]}
              />
            </div>
          </FormColumn>
          <FormColumn lg={2} xl={2} md={6} className="flex">
            <CheckBox
              control={method.control}
              ID={"ShowZeroBalances"}
              Label={"Show Zero Balances"}
              containerClassName="mt-4"
              isEnable={true}
            />
          </FormColumn>

          <div
            className="ml-2 mb-2 flex align-items-center gap-2"
            style={{ alignSelf: "end" }}
          >
            <Button
              label="View"
              severity="primary"
              pt={{
                root: {
                  style: {
                    padding: ".4rem 1rem",
                  },
                },
              }}
              onClick={() => method.handleSubmit(onSubmit)()}
              type="button"
            />
          </div>
          <div className="ml-2 mr-2 min-h-screen w-full mt-2"> {render}</div>
        </FormRow>
      </form>
    </>
  )
}
