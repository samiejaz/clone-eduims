import React, { useEffect, useState } from "react"

import { MOVEABLE_COMPNENTS_NAMES } from "../../utils/enums"

import { InfoCardsContainer } from "../Leads/LeadsDashboard/LeadsDashboard"

const componentMapping = {
  InfoCardsContainer,
}

function DynamicComponent({ componentName }) {
  const Component = componentMapping[componentName]
  return <Component />
}

function Dashboard() {
  document.title = "Dashboard"
  const [dynamicComponent, setDynamicComponent] = useState("")

  useEffect(() => {
    function getDynamicallyCreatedComponent() {
      const dynamicComponent = localStorage.getItem("dynamic-component")
      if (dynamicComponent) {
        setDynamicComponent(dynamicComponent)
      }
    }
    getDynamicallyCreatedComponent()
  }, [localStorage.getItem("dynamic-component")])

  return (
    <div className="flex flex-column gap-1 mt-4">
      <div className="w-full">
        <div className="flex align-items-center justify-content-between">
          <h1 className="text-2xl">Dashboard</h1>
        </div>
        <hr />
        {dynamicComponent !== "" && (
          <>
            <DynamicComponent
              componentName={MOVEABLE_COMPNENTS_NAMES.LEADS_DASHBOARD_CARDS}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard
