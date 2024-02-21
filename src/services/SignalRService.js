import {
  HubConnectionBuilder,
  HttpTransportType,
  LogLevel,
} from "@microsoft/signalr";

class SignalRConnectionManager {
  constructor() {
    this.connection = null;
  }

  startConnection = async () => {
    if (!this.connection) {
      this.connection = new HubConnectionBuilder()
        .withUrl("http://192.168.9.110:90/Notification", {
          skipNegotiation: true,
          transport: HttpTransportType.WebSockets,
        })
        .configureLogging(LogLevel.Information)
        .build();

      try {
        const user = JSON.parse(localStorage.getItem("user"));
        await this.connection.start();
        await this.connection.invoke("JoinGroup", {
          GroupName: "",
          UserName: user.userID.toString(),
        });
      } catch (err) {
        console.error("Error while starting SignalR connection:", err);
      }
    }
  };

  stopConnection = async () => {
    if (this.connection) {
      try {
        await this.connection.stop();
      } catch (err) {
        console.error("Error while stopping SignalR connection:", err);
      } finally {
        this.connection = null;
      }
    }
  };

  getConnection = () => {
    return this.connection;
  };

  getConnectionID = async () => {
    await this.connection.invoke("GetConnectionID", (connectionID) => {});
  };
}

const signalRConnectionManager = new SignalRConnectionManager();

export default signalRConnectionManager;
