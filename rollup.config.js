/*
 * @Author 舜君
 * @LastEditTime 2021-12-30 01:35:35
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
      targets: [{ src: "src/public/*", dest: "dist" }],
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
