const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");

const SERVER = "https://localhost:5000";

module.exports = ({ mode } = { mode: "development" }) => ({
  mode,
  devServer: {
    host: "0.0.0.0",
    port: "3000",
    proxy: {
      "/api": { target: SERVER, secure: false },
      "**": {
        bypass(req) {
          if (req.headers.accept.includes("html")) {
            return "/index.html";
          }
        },
      },
    },
    hot: true,
    overlay: true,
    https: false,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    historyApiFallback: true,
  },
  resolve: { extensions: [".js", ".jsx"] },
  entry: {
    polyfill: ["core-js/stable", "regenerator-runtime/runtime", "whatwg-fetch"],
    calendar: "./index.jsx",
  },
  module: {
    rules: [
      {
        loader: "babel-loader",
        exclude: /node_modules/,
        test: /\.(jsx|js)?$/,
      },
    ],
  },
  output: {
    path: path.join(__dirname, "./dist/"),
    filename: "js/[name]-[hash].js",
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/,
          name: "react",
          chunks: "all",
        },
        vendor: {
          test: /[\\/]node_modules[\\/](axios)[\\/]/,
          name: "vendor",
          chunks: "all",
        },
      },
    },
  },
  plugins: [
    new CleanWebpackPlugin({ verbose: true }),
    new HTMLWebpackPlugin({
      title: "Calendar App",
      filename: "index.html",
      template: "public/index.html",
      favicon: "public/favicon.ico",
      chunks: ["polyfill", "vendor", "react", "calendar"],
      hash: true,
      xhtml: true,
      inject: true,
    }),
  ],
});
