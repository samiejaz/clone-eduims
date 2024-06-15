import React, { useState, useEffect } from "react"
import { useKeyCombinationHook } from "../hooks/hooks"
import { Controller, useForm } from "react-hook-form"
import { routes } from "../utils/routes"
import { Dropdown } from "primereact/dropdown"
import { useNavigate } from "react-router-dom"

export const KSearchBar = () => {
  const [visible, setVisible] = useState(false)

  const method = useForm()
  const navigate = useNavigate()

  useKeyCombinationHook(
    () => {
      setVisible((prev) => !prev)
      method.setFocus("KSearchBar")
    },
    "l",
    true
  )

  return (
    <>
      {visible && (
        <div
          className="overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <Controller
            name="KSearchBar"
            control={method.control}
            render={({ field, fieldState }) => (
              <>
                <Dropdown
                  id={field.name}
                  name={field.name}
                  ref={field.ref}
                  focusInputRef={field.ref}
                  value={field.value}
                  options={routes}
                  optionValue="route"
                  optionGroupLabel="menuGroupName"
                  optionGroupChildren="subItems"
                  optionLabel="name"
                  pt={{
                    panel: {
                      style: {
                        zIndex: "10000 !important",
                      },
                    },
                  }}
                  onChange={(e) => {
                    field.onChange(e.value)

                    if (
                      e.originalEvent.key === "ArrowDown" ||
                      e.originalEvent.key === "ArrowUp"
                    ) {
                    } else {
                      if (e.value) {
                        navigate(e.value)
                        setVisible(false)
                      }
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      navigate(field.value)
                      setVisible(false)
                    }
                  }}
                  style={{ width: "50%" }}
                  showOnFocus={true}
                  filter
                />
              </>
            )}
          />
        </div>
      )}
    </>
  )
}
