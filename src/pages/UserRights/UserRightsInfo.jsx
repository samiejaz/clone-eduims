import { FormProvider, useForm } from "react-hook-form"

import React from "react"

import UserRightsGroupedTable from "./UserRightsGroupedDatatable"
import UserRightsGroupedTableCellWise from "./UserRightsGroupedDataTableCellWise"

const UserRightsInfo = () => {
  const method = useForm()

  return (
    <>
      <FormProvider {...method}>
        <UserRightsGroupedTable />
        {/* <UserRightsGroupedTableCellWise /> */}
      </FormProvider>
    </>
  )
}

export default UserRightsInfo
