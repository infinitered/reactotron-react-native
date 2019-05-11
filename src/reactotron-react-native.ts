import { Platform, NativeModules } from "react-native"
import { createClient, Reactotron } from "reactotron-core-client"
import getHost from "rn-host-detect"

import getReactNativeVersion from "./helpers/getReactNativeVersion"
import getReactNativeDimensions from "./helpers/getReactNativeDimensions"
import overlay from "./plugins/overlay"
import openInEditor, { OpenInEditorOptions } from "./plugins/openInEditor"
import trackGlobalErrors, { TrackGlobalErrorsOptions } from "./plugins/trackGlobalErrors"
import networking, { NetworkingOptions } from "./plugins/networking"
import storybook from "./plugins/storybook"
import devTools from "./plugins/devTools"

const constants = NativeModules.PlatformConstants || {}

let tempClientId = null

const DEFAULTS = {
  createSocket: (path: string) => new WebSocket(path), // eslint-disable-line
  host: getHost("localhost"),
  port: 9090,
  name: "React Native App",
  environment: process.env.NODE_ENV || (__DEV__ ? "development" : "production"),
  client: {
    reactotronLibraryName: "reactotron-react-native",
    reactotronLibraryVersion: "REACTOTRON_REACT_NATIVE_VERSION",
    platform: Platform.OS,
    platformVersion: Platform.Version,
    osRelease: constants.Release,
    model: constants.Model,
    serverHost: constants.ServerHost,
    forceTouch: constants.forceTouchAvailable || false,
    interfaceIdiom: constants.interfaceIdiom,
    systemName: constants.systemName,
    uiMode: constants.uiMode,
    serial: constants.Serial,
    androidId: constants.androidID,
    reactNativeVersion: getReactNativeVersion(),
    ...getReactNativeDimensions(),
  },
  getClientId: async () => {
    debugger
    return tempClientId
  },
  setClientId: (clientId: string) => {
    debugger
    tempClientId = clientId
    return Promise.resolve()
  },
  proxyHack: true,
}

export interface UseReactNativeOptions {
  errors?: TrackGlobalErrorsOptions | boolean
  editor?: OpenInEditorOptions | boolean
  overlay?: boolean
  networking?: NetworkingOptions | boolean
  storybook?: boolean
  devTools?: boolean
}

const reactotron: Reactotron & {
  useReactNative?: (options: UseReactNativeOptions) => Reactotron
  overlay?: (App: React.ReactNode) => void
  storybookSwitcher?: (App: React.ReactNode) => void
} = createClient(DEFAULTS)

function getPluginOptions<T>(options?: T | boolean): T {
  return typeof options === "object" ? options : null
}

reactotron.useReactNative = (options: UseReactNativeOptions = {}) => {
  if (options.errors !== false) {
    reactotron.use(trackGlobalErrors(getPluginOptions(options.errors)))
  }

  if (options.editor !== false) {
    reactotron.use(openInEditor(getPluginOptions(options.editor)))
  }

  if (options.overlay !== false) {
    reactotron.use(overlay())
  }

  if (options.networking !== false) {
    reactotron.use(networking(getPluginOptions(options.networking)))
  }

  if (options.storybook !== false) {
    reactotron.use(storybook())
  }

  if (options.devTools !== false) {
    reactotron.use(devTools())
  }

  return reactotron
}

export { trackGlobalErrors, openInEditor, overlay, networking, storybook, devTools }

export default reactotron
