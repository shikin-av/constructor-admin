const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './admin/app/index',
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.svg$/, use: 'svg-inline-loader' },
    ],
  },
  output: {
    path: path.resolve(__dirname, '../public'),
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Constructor Admin',
    }),
  ],
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development', // development
  resolve: {
    fallback: { 
      'path': require.resolve('path-browserify'),
      'os': require.resolve('os-browserify/browser'),
      'util': require.resolve('util/'),
    },
  },
  target: 'web',
}
