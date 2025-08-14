const path = require("path");
const ESLintPlugin = require("eslint-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: "all",
    },
  };

  if (isProd) {
    config.minimizer = [new TerserWebpackPlugin(), new CssMinimizerPlugin()];
  }

  return config;
};

const htmlPageNames = ["about", "villas", "404", "services", "map", "villa", "booking-request"];
const multipleHtmlPlugins = htmlPageNames.map((name) => {
  return new HTMLWebpackPlugin({
    template: `./src/${name}.html`,
    filename: `${name}.html`,
  });
});

const plugins = () => {
  const plugins = [
    new ESLintPlugin(),
    new HTMLWebpackPlugin({
      template: "./src/index.html",
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/assets/img"),
          to: path.resolve(__dirname, "build/assets/img"),
          noErrorOnMissing: true,
        },
        {
          from: path.resolve(__dirname, "src/assets/video"),
          to: path.resolve(__dirname, "build/assets/video"),
          noErrorOnMissing: true,
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: isDev ? `assets/css/[name].css` : `assets/css/[name].[fullhash].css`,
    }),
  ].concat(multipleHtmlPlugins);

  return plugins;
};

let conf = {
  entry: ["./src/assets/js/index.js"],
  output: {
    filename: isDev ? `assets/js/[name].js` : `assets/js/[name].[fullhash].js`,
    path: path.resolve(__dirname, "./build"),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  optimization: optimization(),
  devServer: {
    port: 4200,
    hot: false,
  },
  devtool: isDev ? "source-map" : "",
  plugins: plugins(),
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../../",
            },
          },
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.less$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../../",
            },
          },
          "css-loader",
          "less-loader",
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/img/[name][ext][query]",
        },
      },
      {
        test: /\.svg/,
        type: "asset/inline",
      },
      {
        test: /\.js$/,
        exclude: "/node_modules/",
        use: ["babel-loader"],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[name][ext][query]",
        },
      },
    ],
  },
};

module.exports = (env, argv) => {
  conf.devtool = isProd ? false : "eval-cheap-module-source-map";
  conf.target = isProd ? "browserslist" : "web";
  return conf;
};
