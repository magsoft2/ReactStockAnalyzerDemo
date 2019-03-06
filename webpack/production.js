const Path = require("path");
const Webpack = require("webpack");
const webpackMerge = require('webpack-merge');
const Utils = require('./utils');
const baseConfig = require('./base');
//const MinifyPlugin = require("babel-minify-webpack-plugin");
const MinifyPlugin = require("uglifyjs-webpack-plugin");
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
		new Webpack.optimize.ModuleConcatenationPlugin(),
        // new MinifyPlugin({
			// parallel: 4,
			// sourceMap: false,
			// uglifyOptions: {
			  // warnings: false,
			  // compress: true,
			  // mangle: true,
			  // keep_classnames: undefined,
			  // keep_fnames: false,
			// }
		  // }),
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
            config: Path.join(__dirname, '../config/config.prod.js')
        }
    }
});
