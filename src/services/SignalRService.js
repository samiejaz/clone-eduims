import {
  HubConnectionBuilder,
  HttpTransportType,
  LogLevel,
} from "@microsoft/signalr"
const apiUrl = import.meta.env.VITE_APP_API_URL_FOR_SIGNALR

class SignalRConnectionManager {
  constructor() {
    this.connection = null
  }

  startConnection = async () => {
    if (!this.connection) {
      this.connection = new HubConnectionBuilder()
        .withUrl(`${apiUrl}/Notification`, {
          skipNegotiation: true,
          transport: HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect([5, 15, 30, 60, 120])
        .configureLogging(LogLevel.Information)
        .build()

      try {
        const user = JSON.parse(localStorage.getItem("user"))
        await this.connection.start()
        await this.connection.invoke("JoinGroup", {
          // GroupName: user.DepartmentID.toString(),
          UserName: user.userID.toString(),
        })
      } catch (err) {
        console.error("Error while starting SignalR connection:", err)
      }
    }
  }

  stopConnection = async () => {
    if (this.connection) {
      try {
        await this.connection.stop()
      } catch (err) {
        console.error("Error while stopping SignalR connection:", err)
      } finally {
        this.connection = null
      }
    }
  }

  getConnection = () => {
    return this.connection
  }

  getConnectionID = async () => {
    await this.connection.invoke("GetConnectionID", (connectionID) => {})
  }
}

const signalRConnectionManager = new SignalRConnectionManager()

export default signalRConnectionManager
