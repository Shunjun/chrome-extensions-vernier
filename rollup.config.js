/*
 * @Author 舜君
 * @LastEditTime 2022-01-04 13:56:51
 * @Description
 */
import typescript from "rollup-plugin-typescript2";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import del from "rollup-plugin-delete";
import copy from "rollup-plugin-copy";

export default {
  input: {
    "scripts/index": "src/scripts/index.ts",
    "background/index": "src/background/index.ts",
    "popup/index": "src/popup/index.ts",
  },
  output: {
    dir: "dist",
    format: "cjs",
  },
  dest: "dist",
  plugins: [
    del({
      targets: "dist/*",
    }),
    copy({
      targets: [
        { src: "src/public/*", dest: "dist" },
        { src: "src/popup/**/*.(css|html)", dest: "dist/popup" },
      ],
    }),
    nodeResolve(),
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          module: "es2015",
        },
      },
    }),
  ],
};
