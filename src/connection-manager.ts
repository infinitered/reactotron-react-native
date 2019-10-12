import { NativeModules } from "react-native"

export default class ConnectionManager {
  // private webSocket: WebSocket
  private flipperConnection: any

  // TODO: Implement a Send
  // TODO: Implement `on` - "open", "close", "message"
  // TODO: Implement close
  constructor(path?: string) {
    // this.webSocket = new WebSocket(path)
    this.flipperConnection = NativeModules.Reactotron
  }

  send(payload: any) {
    // this.webSocket.send(payload)

    if (this.flipperConnection) {
      this.flipperConnection.sendCommand("command", JSON.parse(payload))
    }
  }

  on(event: "open" | "close" | "message", callback: any) {
    if (event === 'open') {
      // TODO: Handle the websocket

      if (this.flipperConnection) {
        callback()
      }
    }
  }

  close() {}
}
