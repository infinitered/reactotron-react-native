import resolve from "rollup-plugin-node-resolve"
import babel from "rollup-plugin-babel"
import flow from "rollup-plugin-flow"
import filesize from "rollup-plugin-filesize"
import minify from "rollup-plugin-babel-minify"

export default {
  input: "src/reactotron-react-native.ts",
  output: {
    file: "dist/index.js",
    format: "cjs",
  },
  plugins: [
    resolve({ extensions: [".ts", ".tsx"] }),
    babel({ extensions: [".ts", ".tsx"], runtimeHelpers: true }),
    process.env.NODE_ENV === "production"
      ? minify({
          comments: false,
        })
      : null,
    filesize(),
    flow({ all: true }),
  ],
  external: [
    "reactotron-core-client",
    "react",
    "react-native",
    "react-native/Libraries/Network/XHRInterceptor",
    "rn-host-detect",
    "query-string"
  ],
}
