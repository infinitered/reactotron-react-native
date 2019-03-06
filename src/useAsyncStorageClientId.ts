import { AsyncStorage } from "react-native"

const REACTOTRON_ASYNC_CLIENT_ID = "@REACTOTRON/clientId"

export default {
  getClientId: async () => {
    debugger
    return AsyncStorage.getItem(REACTOTRON_ASYNC_CLIENT_ID)
  },
  setClientId: (clientId: string) => {
    debugger
    return AsyncStorage.setItem(REACTOTRON_ASYNC_CLIENT_ID, clientId)
  },
}
