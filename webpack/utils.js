"use strict";

const path = require("path");

const ROOT = path.resolve('');
const BUILD_PATH = path.join(ROOT, "build");
const SRC_PATH = path.join(ROOT, "src");
const PUBLIC_PATH = process.env.ENV_PUBLIC_PATH ? process.env.ENV_PUBLIC_PATH : "";
const PROD = process.env.NODE_ENV === "production";

module.exports = {
    PROD,
    ROOT,
    BUILD_PATH,
    PUBLIC_PATH,
    SRC_PATH,
};
