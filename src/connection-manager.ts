import { NativeModules } from "react-native"

export default class ConnectionManager {
  private webSocket: any
  private flipperConnection: any

  constructor(path?: string) {
    this.webSocket = new WebSocket(path)
    this.flipperConnection = NativeModules.Reactotron
  }

  send(payload: any) {
    if (this.webSocket.readyState === 1) {
      this.webSocket.send(payload)
    }

    if (this.flipperConnection) {
      this.flipperConnection.sendCommand("command", JSON.parse(payload))
    }
  }

  on(event: "open" | "close" | "message", callback: any) {
    if (event === "open") {
      if (this.flipperConnection) {
        callback()
      }

      this.webSocket.onopen = callback
    } else if (event === "close") {
      this.webSocket.onclose = () => {
        if (!this.flipperConnection) {
          callback()
        }
      }
    } else if (event === "message") {
      this.webSocket.onmessage = evt => callback(evt.data)
    }
  }

  close() {
    this.webSocket.close()
  }
}
