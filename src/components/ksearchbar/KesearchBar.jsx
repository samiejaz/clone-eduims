import React, { useEffect, useRef, useState } from "react"
import "./ksearchbar.css"
import { X } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useClickOutside, useCtrlKeyDown, useKeydown } from "./KsearchBarHooks"
import { useRoutesData } from "../../context/RoutesContext"

const KesearchBar = () => {
  const { originalRoutes: routes } = useRoutesData()
  const [searchQuery, setSearchQuery] = useState("")
  const [ids, setIds] = useState([])
  const [items, setItems] = useState({
    recentRoutes: false,
    routes: routes,
  })
  const [visible, setVisible] = useState(false)
  const listContainerRef = useRef()
  const divRef = useRef()

  useCtrlKeyDown(() => setVisible(true), "l")
  useKeydown(() => setVisible(false), "Escape")
  useClickOutside(() => {
    setVisible(false)
  }, divRef)

  useEffect(() => {
    const storedIds = JSON.parse(localStorage.getItem("favouriteRoutes")) || []
    setIds(storedIds)
  }, [])

  useEffect(() => {
    if (ids && searchQuery === "") {
      setItems({
        recentRoutes: true,
        routes: routes
          ?.filter((item) => ids.includes(item.id))
          .map((item) => {
            return {
              ...item,
              isFavourite: true,
            }
          }),
      })
    } else {
      if (searchQuery !== "") {
        setItems({ recentRoutes: false, routes: routes })
      }
    }
  }, [searchQuery, ids])

  function favouriteRoute(id, removeRoute = false) {
    let favouriteArray = JSON.parse(localStorage.getItem("favouriteRoutes"))
    if (favouriteArray === null) {
      favouriteArray = []
    }
    if (favouriteArray.includes(id) && removeRoute) {
      favouriteArray = favouriteArray.filter((item) => item !== id)
    } else {
      favouriteArray.push(id)
    }

    localStorage.setItem("favouriteRoutes", JSON.stringify(favouriteArray))

    setIds(favouriteArray)
  }

  return (
    <>
      {visible ? (
        <>
          <div className="ksearchbar-overlay">
            <div className="ksearchbar-inner" ref={divRef}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    border: "1px solid #dfe7ef",
                    borderRadius: "10px",
                  }}
                  className="ksearchbar-input-container"
                >
                  <KesearchBarInput
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    focusOnFirstItem={() =>
                      listContainerRef.current?.focusOnFirstItem()
                    }
                  />
                </div>
                <span className="recentText">
                  {items.recentRoutes ? "Recent" : "Available"}
                </span>
                <div className="ksearchbar-list-container">
                  <KesearchBarList
                    searchQuery={searchQuery}
                    ref={listContainerRef}
                    items={items}
                    favouriteRoute={favouriteRoute}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  )
}

const KesearchBarInput = ({
  searchQuery,
  setSearchQuery,
  focusOnFirstItem,
}) => {
  const inputRef = useRef()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <>
      <input
        value={searchQuery}
        ref={inputRef}
        onChange={(e) => setSearchQuery(e.target.value)}
        id="ksearchbar-input"
        name="ksearchbar-input"
        className="ksearchbar-input"
        placeholder="Search for routes..."
        style={{
          maxWidth: "100%",
          width: "100%",
          padding: "0.7rem",
          border: "0",
          fontSize: "1.2rem",
          color: "#4b5563",
          outline: "none",
        }}
        autoComplete="off"
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            if (focusOnFirstItem) {
              focusOnFirstItem()
            }
          }
        }}
      />
    </>
  )
}

const KesearchBarList = React.forwardRef(
  ({ searchQuery, items, favouriteRoute }, ref) => {
    const filteredItems = items?.routes?.filter((item) =>
      item.menuKey
        .replaceAll(" ", "")
        .toLowerCase()
        .includes(searchQuery.replaceAll(" ", "").toLowerCase())
    )

    React.useImperativeHandle(ref, () => ({
      focusOnFirstItem,
    }))

    const divs = useRef([])
    const navigate = useNavigate()

    function focusOnFirstItem() {
      if (divs.current.length > 0) {
        divs.current[0]?.focus()
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault()
        const currentIndex = divs.current.findIndex(
          (div) => document.activeElement === div
        )
        if (currentIndex !== -1) {
          const nextIndex =
            event.key === "ArrowDown" ? currentIndex + 1 : currentIndex - 1
          if (nextIndex >= 0 && nextIndex < divs.current.length) {
            divs.current[nextIndex].focus()
          }
        }
      }
    }
    return (
      <>
        <ul
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {filteredItems.length > 0 ? (
            <>
              {filteredItems.map((item, index) => (
                <KesearchBarListItem
                  key={item.menuName}
                  id={item.menuKey}
                  name={item.menuName}
                  path={item.routeUrl}
                  handleKeyPress={handleKeyDown}
                  navigate={navigate}
                  showIcon={items.recentRoutes ?? true}
                  isFavourite={item?.isFavourite ?? false}
                  favouriteRoute={favouriteRoute}
                  ref={(ref) => (divs.current[index] = ref)}
                />
              ))}
            </>
          ) : (
            <div
              style={{
                textAlign: "center",
                verticalAlign: "middle",
                color: "#4b5563",
              }}
            >
              {items.recentRoutes
                ? "Start searching for routes!"
                : "No routes found!"}
            </div>
          )}
        </ul>
      </>
    )
  }
)

const KesearchBarListItem = React.forwardRef((props, ref) => {
  const {
    id,
    name,
    path,
    handleKeyPress,
    navigate,
    showIcon,
    isFavourite,
    favouriteRoute,
  } = props
  return (
    <div
      tabIndex={"0"}
      onKeyDown={(e) => {
        if (e.ctrlKey && e.key === "Enter") {
          window.open(path, "_blank")
          favouriteRoute(id)
        } else {
          if (e.key === "Enter") {
            navigate(path)
            favouriteRoute(id)
          } else {
            handleKeyPress(e)
          }
        }
      }}
      className="ksearchbar-list-item"
      ref={ref}
    >
      <Link to={path} onClick={() => favouriteRoute(id)} style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "inherit",
          }}
        >
          {showIcon ? (
            <svg width="20" height="20" viewBox="0 0 20 20">
              <g
                stroke="currentColor"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3.18 6.6a8.23 8.23 0 1112.93 9.94h0a8.23 8.23 0 01-11.63 0"></path>
                <path d="M6.44 7.25H2.55V3.36M10.45 6v5.6M10.45 11.6L13 13"></path>
              </g>
            </svg>
          ) : null}
          <li style={{ color: "inherit" }}>{name}</li>
        </div>
      </Link>
      {showIcon ? (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            {/* <Star
              style={{ height: "18px", width: "18px" }}
              className="action-icons"
              onClick={() => favouriteRoute(id)}
              fill={isFavourite ? "yellow" : "none"}
              stroke={isFavourite ? "yellow" : "currentColor"}
            /> */}
            <X
              style={{ height: "18px", width: "18px" }}
              onClick={() => favouriteRoute(id, true)}
              className="action-icons"
            />
          </div>
        </>
      ) : null}
    </div>
  )
})

export default KesearchBar
