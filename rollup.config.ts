import type {RollupOptions} from 'rollup';
import babel from '@rollup/plugin-babel';
import typescript from "@rollup/plugin-typescript";
import {nodeResolve} from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
// import ts from 'rollup-plugin-ts'
// import pkg from './package.json' assert {type: "json"};

const config: RollupOptions[] = [
    {
        input: 'src/index.ts',
        output: {
            file: './lib/index.js',
            exports: 'named',
            format: 'es',
        },
        external: ['react', 'react-dom', 'react/jsx-runtime','react-router-dom'],
        plugins: [
            nodeResolve(),
            babel({
                exclude: 'node_modules/**',
                babelHelpers: 'bundled',
                presets: [['@babel/preset-env',{
                    modules: false,
                }], '@babel/preset-react'],
            }),
            typescript(),
        ],
    }, {
        input: 'src/index.ts',
        output: {
            file: './lib/index.min.js',
            exports: 'named',
            format: 'es',
            sourcemap: true,
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
            terser()
        ],
    }
];
export default config;