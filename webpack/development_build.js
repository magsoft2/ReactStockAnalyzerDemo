const Path = require("path");
const webpackMerge = require('webpack-merge');
const Utils = require('./utils');
const baseConfig = require('./base');
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = webpackMerge(baseConfig, {
    entry : [
        "babel-polyfill",
        Utils.SRC_PATH
    ],

    output: {
        filename :"[name].js"
    },

    plugins: [
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: { discardComments: { removeAll: true } },
            canPrint: true
        }),
        new CleanWebpackPlugin(Utils.BUILD_PATH+'/*.*', {
            root: Utils.ROOT,
        }),
    ],
    resolve: {
        alias: {
            config: Path.join(__dirname, '../config/config.dev.js')
        }
    }
});
