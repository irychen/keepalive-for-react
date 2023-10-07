import type {RollupOptions} from 'rollup';
import babel from '@rollup/plugin-babel';
import typescript from "@rollup/plugin-typescript";
import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
// import terser from '@rollup/plugin-terser';
// import ts from 'rollup-plugin-ts'
// import pkg from './package.json' assert {type: "json"};

const config: RollupOptions[] = [
    {
        input: 'src/index.ts',
        output: {
            file:'index.js',
            exports: 'named',
            format: 'es',
        },
        external: ['react', 'react-dom', 'react/jsx-runtime'],
        plugins: [
            nodeResolve(),
            babel({
                exclude: 'node_modules/**',
                babelHelpers: 'bundled',
                presets: ['@babel/preset-env', '@babel/preset-react'],
            }),
            typescript(),
            commonjs()
        ],
    },
];
export default config;