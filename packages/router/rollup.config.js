import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import babel from "@rollup/plugin-babel";

const commonConfig = {
    input: "src/index.ts",
    external: ["react", "react-dom", "react-router", "react/jsx-runtime", "keepalive-for-react"],
    plugins: [
        nodeResolve(),
        babel({
            exclude: "node_modules/**",
            babelHelpers: "bundled",
        }),
        typescript({
            jsx: "react-jsx",
        }),
        commonjs(),
    ],
};

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
            file: "dist/esm/index-min.mjs",
            exports: "named",
            format: "esm",
        },
        plugins: [...commonConfig.plugins, terser()],
    },
    {
        ...commonConfig,
        output: {
            file: "dist/cjs/index.cjs",
            exports: "named",
            format: "cjs",
        },
    },
    {
        ...commonConfig,
        output: {
            file: "dist/cjs/index-min.cjs",
            exports: "named",
            format: "cjs",
        },
        plugins: [...commonConfig.plugins, terser()],
    },
];
export default config;
