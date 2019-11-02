const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {
  entry: './src/js/index.js',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract(
          {
            fallback: 'style-loader',
            use: ['css-loader'],
          },
        ),
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        loader: 'url-loader',
        options: {
          limit: 8192,
        },
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin({ filename: 'style.css' }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Codejam Virtual Keyboard',
      template: './index.html',
    }),
  ],
  output: {
    filename: 'main.js', path: path.resolve(__dirname, 'dist'),
  },
};
