import React from "react"
import { Button } from "primereact/button"
import { useMutation } from "@tanstack/react-query"
import { AddMenus } from "../../api/MenusData"

const SyncRoutes = () => {
  const mutation = useMutation({
    mutationFn: AddMenus,
  })

  return (
    <div className="flex align-items-center justify-content-center min-h-screen">
      <Button
        label="Sync Routes"
        loading={mutation.isPending}
        loadingIcon="pi pi-spin pi-cog"
        onClick={() => mutation.mutateAsync({ LoginUserID: 1 })}
      />
    </div>
  )
}

export default SyncRoutes
