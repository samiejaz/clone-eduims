import axios from "axios"
import { toast } from "react-toastify"
const apiUrl = import.meta.env.VITE_APP_API_URL

export function FormatDate(dateString) {
  const formattedDate = `${dateString.slice(0, 4)}-${dateString.slice(
    5,
    7
  )}-${dateString.slice(8, 10)}`
  return formattedDate
}

export function preventFormByEnterKeySubmission(e) {
  if (e.key === "Enter") {
    e.preventDefault()
  }
}

export function convertBase64StringToFile(imageString, withBase64 = false) {
  let base64Image = ""
  if (!withBase64) {
    base64Image = "data:image/png;base64," + imageString
  } else {
    base64Image = imageString
  }
  const byteString = atob(base64Image.split(",")[1])
  const bytes = new ArrayBuffer(byteString.length)
  const byteArray = new Uint8Array(bytes)
  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i)
  }

  const blob = new Blob([bytes], { type: "image/png" })
  const fileName = "image.png"
  const file = new File([blob], fileName, { type: "image/png" })
  return file
}

export function getTodaysDate() {
  const today = new Date()
  const month = today.getMonth() + 1 // Months are zero-indexed
  const date = today.getDate()
  const year = today.getFullYear()

  // Format the date in the desired format
  const formattedDate = `${date}-${month}-${year}`

  return formattedDate
}

export function formatDateToMMDDYYYY(date) {
  var day = ("0" + date.getDate()).slice(-2)
  var month = ("0" + (date.getMonth() + 1)).slice(-2)
  var year = date.getFullYear()

  return month + "/" + day + "/" + year
}

export async function PrintReportInNewTab({ controllerName, fullUrl = "" }) {
  try {
    let url =
      fullUrl !== "" ? fullUrl : `${apiUrl}/Reports/${controllerName}&Export=p`
    const { data } = await axios.post(url)

    const win = window.open("")
    let html = ""

    html += "<html>"
    html += '<body style="margin:0!important">'
    html +=
      '<embed width="100%" height="100%" src="data:application/pdf;base64,' +
      data +
      '" type="application/pdf" />'
    html += "</body>"
    html += "</html>"
    setTimeout(() => {
      win.document.write(html)
    }, 0)
  } catch (e) {
    ShowErrorToast(e.message)
  }
}

export async function PrintReportInNewTabWithLoadingToast({
  controllerName,
  fullUrl = "",
  toastLoadingMessage = "Generating report...",
  toastSuccessMessage = "Report generated successfully",
}) {
  try {
    toast.loading(toastLoadingMessage, {
      toastId: "printReportLoading",
      position: "top-right",
    })

    let url =
      fullUrl !== "" ? fullUrl : `${apiUrl}/Reports/${controllerName}&Export=p`
    const { data } = await axios.post(url)

    const win = window.open("")
    let html = ""

    html += "<html>"
    html += '<body style="margin:0!important">'
    html +=
      '<embed width="100%" height="100%" src="data:application/pdf;base64,' +
      data +
      '" type="application/pdf" />'
    html += "</body>"
    html += "</html>"
    setTimeout(() => {
      win.document.write(html)
    }, 0)
    toast.dismiss("printReportLoading")
    toast.success(toastSuccessMessage, {
      position: "top-right",
    })
  } catch (e) {
    toast.dismiss("printReportLoading")
    toast.error("Error generating report: " + e.message)
  }
}

export function ShowErrorToast(message = "") {
  if (message !== "") {
    toast.error(message, {
      autoClose: false,
    })
  }
}

export function ShowSuccessToast(message = "") {
  if (message !== "") {
    toast.success(message)
  }
}

export function formatDateAndTime(dateString) {
  const date = new Date(dateString)

  const day = date.getDate()
  const month = date.toLocaleString("en-US", { month: "short" })
  const year = date.getFullYear()

  let hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? "PM" : "AM"
  hours = hours % 12
  hours = hours ? hours : 12

  const formattedDate = `${day}-${month}-${year} ${hours}:${
    minutes < 10 ? "0" : ""
  }${minutes} ${ampm}`

  return formattedDate
}

export const downloadFile = (file) => {
  const url = URL.createObjectURL(file)
  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", file.name)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function formatDateWithSymbol(dateInput, symbol = "-") {
  const month = dateInput.toLocaleString("en-US", { month: "short" })
  const date = dateInput.getDate()
  const year = dateInput.getFullYear()

  const formattedDate = `${date}${symbol}${month}${symbol}${year}`

  return formattedDate
}
