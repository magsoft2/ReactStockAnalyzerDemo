"use strict";

const path = require("path");
const Webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const AutoPrefixer = require("autoprefixer");
const Utils = require("./utils");

const PROD = Utils.PROD;
const DEBUG = !PROD;
const MAX_INLINE_SIZE = 50000;


module.exports = {

    context: Utils.ROOT,

    stats: {
        colors: true,
        modules: true,
        reasons: true,
        errorDetails: true
    },

    output: {
        path: Utils.BUILD_PATH,
        publicPath: Utils.PUBLIC_PATH,
    },

    resolve: {
        modules: ["src", "node_modules"],
        extensions: ["json", ".js", ".styl"]
    },

    module: {
        unknownContextRegExp: /$^/,
        unknownContextCritical: false,
        exprContextRegExp: /$^/,
        exprContextCritical: false,
        wrappedContextRegExp: /$^/,
        wrappedContextCritical: false,
        rules: [
            {
                parser: {
                    amd: false
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        "css-loader",
                        "postcss-loader",
                        "resolve-url-loader",
                    ]
                })
            },
            {
                test: /\.styl$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        "css-loader",
                        "postcss-loader",
                        "resolve-url-loader?keepQuery",
                        "stylus-loader",
                    ],
                    publicPath: Utils.PUBLIC_PATH,
                })
            },
            {
                test: /\.js$|jsx$/,
                use: [{
                    loader: "babel-loader",
                    options: {
                        comments: false,
                        cacheDirectory: DEBUG,
                        babelrc: false,
                        plugins: [
                            "babel-plugin-wildcard",
                            "transform-runtime",
                            "transform-decorators-legacy",
                            "transform-class-properties",
                            "transform-exponentiation-operator",
                            "transform-es2015-for-of",
                            "transform-es2015-block-scoping",
                            "transform-es2015-arrow-functions",
                        ],
                        presets: [
                            [
                                "env",
                                {
                                    "targets": {
                                        "browsers": ["last 3 versions", "ie >= 10"]
                                    },
                                    "modules": false,
                                    "useBuiltIns": true,
                                    "debug": true,
                                    "loose": true,
                                    "shippedProposals": true,
                                }
                            ],
                            "stage-0",
                            "react",
                        ]
                    }
                }],
                exclude: [/node_modules/, /libs/]
                // exclude: [/node_modules/,/libs/]
            },
            {
                test: /\.pug$/,
                use: [{
                    loader: "pug-loader",
                    options: { pretty: DEBUG }
                }]
            },
            {
                test: /\.svg.*?$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        "limit": MAX_INLINE_SIZE,
                        "mimetype": "image/svg+xml",
                        "name": "images/[name].[ext]"
                    }
                }]
            },
            {
                test: /\.(png|jpg|gif|ico).*$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        name: "images/[name].[ext]",
                        limit: MAX_INLINE_SIZE
                    }
                }]
            },
            {
                test: /\.(woff|woff2).*$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        "limit": MAX_INLINE_SIZE,
                        "mimetype": "application/font-woff",
                        "name": "[name].[ext]"
                    }
                }]
            },
            {
                test: /\.ttf.*?$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        "limit": MAX_INLINE_SIZE,
                        "mimetype": "application/octet-stream",
                        "name": "[name].[ext]"
                    }
                }]
            },
            {
                test: /\.eot.*?$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        "name": "[name].[ext]"
                    }
                }]
            },
            {
                test: /\.html.*?$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        "name": "[name].[ext]"
                    }
                }]
            },
        ]
    },

    node: {
        fs: "empty"
    },
    plugins: [
        new Webpack.LoaderOptionsPlugin({
            debug: !PROD,
            options: {
                postcss: function () {
                    return {
                        defaults: [AutoPrefixer],
                        cleaner: [AutoPrefixer({ browsers: ["last 3 versions"] })],
                    };
                },
                stylus: {
                    import: path.resolve(process.cwd(), "src/styles/styleguide.styl")
                }
            }
        }),
        new ExtractTextPlugin({
            filename: "[name].css",
            allChunks: true
        }),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: path.join(Utils.SRC_PATH, "index.pug"),
            inject: false,
            hash: true,
        }),
        new Webpack.DefinePlugin({
            __DEV__: Number(DEBUG),
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        }),
        new Webpack.NamedModulesPlugin(),
        new Webpack.NoEmitOnErrorsPlugin(),
        new Webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru/),
        new CopyWebpackPlugin([
            // {from: Path.resolve(Utils.SRC_PATH, 'touch-icons'),  fromType: 'glob'},
            { from: path.resolve(Utils.SRC_PATH, 'images'), to: 'images', fromType: 'glob' },
        ])
    ]

};

