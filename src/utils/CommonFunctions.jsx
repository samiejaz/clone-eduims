import axios from "axios";

export function FormatDate(dateString) {
  const formattedDate = `${dateString.slice(0, 4)}-${dateString.slice(
    5,
    7
  )}-${dateString.slice(8, 10)}`;
  return formattedDate;
}

export function preventFormByEnterKeySubmission(e) {
  if (e.key === "Enter") {
    e.preventDefault();
  }
}

export function convertBase64StringToFile(imageString, withBase64 = false) {
  let base64Image = "";
  if (!withBase64) {
    base64Image = "data:image/png;base64," + imageString;
  } else {
    base64Image = imageString;
  }
  const byteString = atob(base64Image.split(",")[1]);
  const bytes = new ArrayBuffer(byteString.length);
  const byteArray = new Uint8Array(bytes);
  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([bytes], { type: "image/png" });
  const fileName = "image.png";
  const file = new File([blob], fileName, { type: "image/png" });
  return file;
}

export function getTodaysDate() {
  const today = new Date();
  const month = today.getMonth() + 1; // Months are zero-indexed
  const date = today.getDate();
  const year = today.getFullYear();

  // Format the date in the desired format
  const formattedDate = `${date}-${month}-${year}`;

  return formattedDate;
}

export function formatDateToMMDDYYYY(date) {
  var day = ("0" + date.getDate()).slice(-2);
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  var year = date.getFullYear();

  return month + "/" + day + "/" + year;
}

export async function PrintReportInNewTab(url) {
  const { data } = await axios.post(
    `http://192.168.9.110:90/api/Reports/${url}&Export=p`
  );

  const win = window.open("");
  let html = "";

  html += "<html>";
  html += '<body style="margin:0!important">';
  html +=
    '<embed width="100%" height="100%" src="data:application/pdf;base64,' +
    data +
    '" type="application/pdf" />';
  html += "</body>";
  html += "</html>";
  setTimeout(() => {
    win.document.write(html);
  }, 0);
}
