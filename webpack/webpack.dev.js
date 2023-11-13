const path = require('path');
const { merge } = require('webpack-merge');
const dotenv = require('dotenv');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require('./webpack.common');

dotenv.config();

const dev = {
  mode: 'development',
  entry: path.resolve(process.cwd(), 'src', 'development', 'index.tsx'),
  devServer: {
    hot: true,
    port: 3000,
    https: false,
    open: true,
    static: [
      {
        directory: path.resolve(process.cwd(), 'src', 'styles')
      },
      {
        directory: path.resolve(process.cwd(), 'assets')
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin({ template: 'html/index.html' })]
};

module.exports = merge(common, dev);

/**
 * SECTION Related Links
 * https://webpack.js.org/guides/code-splitting/#dynamic-imports (Chunking output for optimization)
 * https://webpack.js.org/configuration/entry-context/#naming (Chunking shared deps in entry object)
 * https://web.dev/publish-modern-javascript/?utm_source=lighthouse&utm_medium=devtools
 */
