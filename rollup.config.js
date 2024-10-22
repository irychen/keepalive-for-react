import { nodeResolve } from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"
import commonjs from "@rollup/plugin-commonjs"
import terser from "@rollup/plugin-terser"
import babel from "@rollup/plugin-babel"

const commonConfig = {
    input: "src/index.ts",
    external: ["react", "react-dom", "react-router-dom"],
    plugins: [
        nodeResolve(),
        babel({
            exclude: "node_modules/**",
            babelHelpers: "bundled",
        }),
        typescript(),
        commonjs(),
        terser(),
    ],
}

const config = [
    {
        ...commonConfig,
        output: {
            file: "dist/esm/index.mjs",
            exports: "named",
            format: "esm",
        },
    },
    {
        ...commonConfig,
        output: {
            file: "dist/cjs/index.cjs",
            exports: "named",
            format: "cjs",
        },
    },
]
export default config
