const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const baseConfig = require('./base');
const stylesConfig = require('./styles');
const Path = require("path");

module.exports = webpackMerge(baseConfig, {
    entry: [
        'babel-polyfill',
        'react-hot-loader/patch',
        'webpack-dev-server/client?http://localhost:4001',
        'webpack/hot/only-dev-server',
        './src/index.js'
    ],
    output: {
        filename: "[name].js",
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
    devtool: "cheap-module-source-map",
    devServer: {
        // contentBase: [Utils.BUILD_PATH],
        historyApiFallback: true,
        port: 4001,
        compress: true,
        hot: true,
        stats: 'minimal',
        open: true,
        // proxy: {
        //     '/api': {
        //         target: 'http://localhost:9000',
        //         secure: false
        //     }
        // }
    },
    resolve: {
        alias: {
            config: Path.join(__dirname, '../config/config.dev_local.js')
        }
    }
});