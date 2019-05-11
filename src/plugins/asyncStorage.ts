import { Reactotron } from "reactotron-core-client"

export interface AsyncStorageOptions {
  ignore?: string[]
}

const PLUGIN_DEFAULTS: AsyncStorageOptions = {
  ignore: [],
}

export default asyncStorage => (options: AsyncStorageOptions) => (reactotron: Reactotron) => {
  // setup configuration
  const config = Object.assign({}, PLUGIN_DEFAULTS, options || {})
  const ignore = config["ignore"] || PLUGIN_DEFAULTS.ignore

  let swizzSetItem
  let swizzRemoveItem
  let swizzMergeItem
  let swizzClear
  let swizzMultiSet
  let swizzMultiRemove
  let swizzMultiMerge
  let isSwizzled = false

  const sendToReactotron = (action: string, data?: any) => {
    reactotron.send("asyncStorage.mutation", { action, data })
  }

  const setItem = async (key, value, callback) => {
    try {
      if (ignore.indexOf(key) < 0) {
        sendToReactotron("setItem", { key, value })
      }
    } catch (e) {}
    return swizzSetItem(key, value, callback)
  }

  const removeItem = async (key, callback) => {
    try {
      if (ignore.indexOf(key) < 0) {
        sendToReactotron("removeItem", { key })
      }
    } catch (e) {}
    return swizzRemoveItem(key, callback)
  }

  const mergeItem = async (key, value, callback) => {
    try {
      if (ignore.indexOf(key) < 0) {
        sendToReactotron("mergeItem", { key, value })
      }
    } catch (e) {}
    return swizzMergeItem(key, value, callback)
  }

  const clear = async callback => {
    try {
      sendToReactotron("clear")
    } catch (e) {}
    return swizzClear(callback)
  }

  const multiSet = async (pairs, callback) => {
    try {
      const shippablePairs = (pairs || []).filter(
        pair => pair && pair[0] && ignore.indexOf(pair[0]) < 0
      )
      if (shippablePairs.length > 0) {
        sendToReactotron("multiSet", { pairs: shippablePairs })
      }
    } catch (e) {}
    return swizzMultiSet(pairs, callback)
  }

  const multiRemove = async (keys, callback) => {
    try {
      const shippableKeys = (keys || []).filter(key => ignore.indexOf(key) < 0)
      if (shippableKeys.length > 0) {
        sendToReactotron("multiRemove", { keys: shippableKeys })
      }
    } catch (e) {}
    return swizzMultiRemove(keys, callback)
  }

  const multiMerge = async (pairs, callback) => {
    try {
      const shippablePairs = (pairs || []).filter(
        pair => pair && pair[0] && ignore.indexOf(pair[0]) < 0
      )
      if (shippablePairs.length > 0) {
        sendToReactotron("multiMerge", { pairs: shippablePairs })
      }
    } catch (e) {}
    return swizzMultiMerge(pairs, callback)
  }

  /**
   * Hijacks the AsyncStorage API.
   */
  const trackAsyncStorage = () => {
    if (isSwizzled) return

    swizzSetItem = asyncStorage.setItem
    asyncStorage.setItem = setItem

    swizzRemoveItem = asyncStorage.removeItem
    asyncStorage.removeItem = removeItem

    swizzMergeItem = asyncStorage.mergeItem
    asyncStorage.mergeItem = mergeItem

    swizzClear = asyncStorage.clear
    asyncStorage.clear = clear

    swizzMultiSet = asyncStorage.multiSet
    asyncStorage.multiSet = multiSet

    swizzMultiRemove = asyncStorage.multiRemove
    asyncStorage.multiRemove = multiRemove

    swizzMultiMerge = asyncStorage.multiMerge
    asyncStorage.multiMerge = multiMerge

    isSwizzled = true
  }

  const untrackAsyncStorage = () => {
    if (!isSwizzled) return

    asyncStorage.setItem = swizzSetItem
    asyncStorage.removeItem = swizzRemoveItem
    asyncStorage.mergeItem = swizzMergeItem
    asyncStorage.clear = swizzClear
    asyncStorage.multiSet = swizzMultiSet
    asyncStorage.multiRemove = swizzMultiRemove
    asyncStorage.multiMerge = swizzMultiMerge

    isSwizzled = false
  }

  // reactotronShipStorageValues()
  trackAsyncStorage()

  return {
    features: {
      trackAsyncStorage,
      untrackAsyncStorage,
    },
  }
}
