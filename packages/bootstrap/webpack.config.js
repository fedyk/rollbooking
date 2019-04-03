const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  devtool: "none",
  context: path.resolve(__dirname, "src"),
  entry: {
    booking: "./booking.js",
    bootstrap: "./bootstrap.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "./../../public/packages/bootstrap"),
    library: "[name]",
   libraryTarget: "var",
  },
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
        }, {
          loader: "css-loader",
        }, {
          loader: "postcss-loader", // Run post css actions
          options: {
            plugins: function () { // post css plugins, can be exported to postcss.config.js
              return [
                require("precss"),
                require("autoprefixer")
              ];
            }
          }
        }, {
          loader: "sass-loader" // compiles Sass to CSS
        }]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
};
