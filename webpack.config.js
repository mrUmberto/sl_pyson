const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './lib/pyson.js',
    externals: [nodeExternals()],
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'pyson.js',
        libraryTarget: 'umd',
        library: 'pyson',
        // Workaround to fix umd build, restore webpack v3 behaviour
        // https://github.com/webpack/webpack/issues/6677
        // https://github.com/webpack/webpack/issues/6642
        globalObject: "typeof self !== 'undefined' ? self : this"
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            }
        ]
    },
    plugins: [
        new UglifyJsPlugin(),
    ]
};
