import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import filesize from "rollup-plugin-filesize";
import progress from "rollup-plugin-progress";
import visualizer from "rollup-plugin-visualizer";
import postcss from "rollup-plugin-postcss";
import replace from "rollup-plugin-replace";
import pkg from "./package.json";

const minimize = process.env.NODE_ENV === "production";

export default {
  input: "src/index.tsx",
  output: [
    {
      file: pkg.browser,
      format: "iife",
      name: "calendar",
      sourcemap: false,
    },
  ],
  plugins: [
    resolve(),

    replace({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development")
    }),

    commonjs({
      namedExports: {
        "node_modules/react-dom/index.js": ["render"],
        "node_modules/react/index.js": ["createElement", "PureComponent", "Fragment", "createRef"],
      }
    }),

    typescript(),

    postcss({
      extract: true,
      minimize: minimize,
      extensions: [".css", ".scss", ".sass"],
    }),

    // Minimize es bundles
    // minimize && terser(),

    // Logs the filesize in cli when done
    // filesize(),

    // Progress while building
    // progress({ clearLine: false }),

    // Generates a statistics page
    // visualizer({
    //   filename: "./statistics.html",
    //   title: "My Bundle",
    // }),
  ],
};
