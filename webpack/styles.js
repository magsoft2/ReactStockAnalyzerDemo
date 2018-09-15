const webpackMerge = require('webpack-merge');
const Utils = require('./utils');
const baseConfig = require('./base');
const Webpack = require("webpack");
const AutoPrefixer = require("autoprefixer");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const Path = require("path");

module.exports = webpackMerge(baseConfig, {
   module: {
       rules: [
           {
               test:   /\.css$/,
               use: ExtractTextPlugin.extract({
                   fallback: "style-loader",
                   use: [
                       {
                           loader: 'css-loader',
                           options: {
                               modules: true,
                               localIdentName: '[name]__[local]--[hash:base64:5]',
                           }
                       },
                       "postcss-loader",
                       "resolve-url-loader",
                   ]
               })
           },
           {
               test:   /\.styl$/,
               use: ExtractTextPlugin.extract({
                   loader: 'style!css!stylus?resolve url',
                   fallback: "style-loader",
                   use: [
                       "css-loader",
                       "postcss-loader",
                       "resolve-url-loader?keepQuery",
                       "stylus-loader",
                   ],
                   publicPath: Utils.PUBLIC_PATH,
               })
           }
       ]
   },
    plugins: [
        // new Webpack.LoaderOptionsPlugin({
        //     debug: process.env.NODE_ENV === 'development',
        //     options: {
        //         postcss: function () {
        //             return {
        //                 defaults: [AutoPrefixer],
        //                 cleaner:  [AutoPrefixer({ browsers: ["last 3 versions"] })],
        //                 // cssnano: process.env.NODE_ENV === 'production'
        //             };
        //         },
        //         stylus: {
        //             import: Path.resolve(process.cwd(), "styleguide.styl")
        //         }
        //     }
        // }),
        // new ExtractTextPlugin({
        //     filename: "[name].css",
        //     allChunks: true
        // }),
    ]
});