const Path = require("path");
const webpackMerge = require('webpack-merge');
const Utils = require('./utils');
const baseConfig = require('./production');
//const MinifyPlugin = require("babel-minify-webpack-plugin");
const MinifyPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = webpackMerge(baseConfig, {
    resolve: {
        alias: {
            config: Path.join(__dirname, '../config/config.prod_deploy.js')
        }
    }
});
