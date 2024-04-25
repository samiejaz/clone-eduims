import React, { useEffect, useRef } from "react"
import { SingleFileUploadField } from "../../components/Forms/form"
import { useQuery } from "@tanstack/react-query"
import { getLeadsFile } from "../../api/LeadIntroductionData"
import { FormColumn } from "../../components/Layout/LayoutComponents"
import { FormLabel } from "react-bootstrap"

const useLeadsFileViewerHook = ({ fileName, fileType = "", mode = "view" }) => {
  const fileRef = useRef()
  const { data: file } = useQuery({
    queryKey: ["leadsFile", fileName],
    queryFn: () => getLeadsFile(fileName),
    initialData: {
      name: null,
    },
    enabled: fileName !== undefined,
  })

  useEffect(() => {
    if (file.name !== null) {
      fileRef.current?.setFile(file)
    }
  }, [file])
  return {
    getFileData: fileRef.current?.getFile,
    setFileError: fileRef.current?.setError,
    render: (
      <>
        <FormColumn lg={12} xl={12} md={12}>
          <FormLabel>File</FormLabel>
          <div>
            <SingleFileUploadField
              ref={fileRef}
              mode={mode}
              errorMessage="Please upload the file"
            />
          </div>
        </FormColumn>
      </>
    ),
  }
}

export default useLeadsFileViewerHook
