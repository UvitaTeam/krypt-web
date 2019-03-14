const webpack = require("webpack");
const path = require("path");

const name = "krypt-web";
const config = {
  mode: "production",
  entry: `${__dirname}/src/lib/index.js`,
  output: {
    path: `${__dirname}/dist`,
    filename: `${name}.min.js`,
    library: name,
    libraryTarget: "umd",
    umdNamedDefine: true,
    globalObject: "this"
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: "babel-loader",
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: "eslint-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    modules: [path.resolve("./node_modules"), path.resolve("./src")],
    extensions: [".json", ".js"]
  }
};

module.exports = config;
