const path = require('path');

const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MomentTimezoneDataPlugin = require('moment-timezone-data-webpack-plugin');

const FORCE_DISABLE_HOT_UPDATE = false;
const ENABLE_DEBUG_INFO = false;

module.exports = (enviroment) => {
  const env = process.env.NODE_ENV || (enviroment && enviroment.NODE_ENV);
  const self = {
    mode: 'production',
    devtool: false,
    entry: {
      main: [
        './src/main.js'
      ]
    },
    output: {
      path: path.resolve(__dirname, 'public', 'dist'),
      filename: '[name].js'
    },
    module: {
      rules: [{
          enforce: 'pre',
          test: /\.(js|vue)$/,
          exclude: /node_modules/,
          loader: 'eslint-loader',
          options: {
            emitError: true,
            emitWarning: true,
            failOnWarning: true,
            failOnError: true
          }
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.(scss|css)$/,
          use: [
            'vue-style-loader',
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg|mp4)(\?v=\d+\.\d+\.\d+)?$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: 'assets/[name].[ext]?[hash]'
            }
          }]
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/i,
          use: [{
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: "assets/[name].[ext]?[hash]"
            }
          }]
        },
        {
          test: /\.js$/,
          exclude: file => (/node_modules/.test(file) && !/\.vue\.js/.test(file)),
          loader: 'babel-loader'
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: `[name].css`,
        chunkFilename: `[name].css`,
      }),
      new VueLoaderPlugin(),
      new webpack.ProvidePlugin({
        Promise: '@babel/runtime-corejs2/core-js/promise',
      }),
      new MomentTimezoneDataPlugin({
        matchZones: /^Europe'/
      }),
    ],
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          test: /\.js($|\?)/i,
          exclude: /(node_modules)/,
          parallel: true,
          sourceMap: false
        })
      ]
    }
  };

  if (env === 'local') {
    self.mode = 'development';
    if (enviroment && enviroment.NODE_ENV) {
      self.watch = true;
    }
    self.watchOptions = {
      poll: 300,
      ignored: /node_modules/
    };
    delete self.devtool;

    let rulesLength = self.module.rules.length;
    while (rulesLength--) {
      if (!!~['eslint-loader'].indexOf(self.module.rules[rulesLength].loader)) {
        self.module.rules.splice(rulesLength, 1);
      }
    }

    let hotUpdate = true;

    try {
      let {
        local
      } = require(path.resolve(__dirname, 'config', 'hotUpdate.js'));
      const localHotUpdate = local.hotUpdate();
      if (localHotUpdate && !localHotUpdate.enabled) {
        hotUpdate = false;
      }
    } catch (e) {
      // error message place here
    }

    if (enviroment && enviroment.NODE_ENV) {
      hotUpdate = false;
    }

    if (!FORCE_DISABLE_HOT_UPDATE && hotUpdate) {
      Object.values(self.entry)
        .forEach((entryPoint) => {
          if (Array.isArray(entryPoint)) {
            entryPoint.push(`webpack-hot-middleware/client?name=ah6` +
              `&path=http${['true', '1'].includes(process.env.HTTPS_ENABLED || false) ? 's' : ''}://` +
              `localhost:${process.env.PORT || 8080}/api/hotUpdate&timeout=750` +
              `${ENABLE_DEBUG_INFO ? '' : '&noInfo=true&reload=true&quiet=true'}`);
          }
        });
      self.plugins.push(new webpack.HotModuleReplacementPlugin());
    }
  }
  return self;
};