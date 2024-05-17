const dotenv = require('dotenv');
const path = require('path');
const webpack = require('webpack');

const reactCompilerConfig = require('./babel-react-compiler.config.cjs');

dotenv.config();

module.exports = {
  cache: false,
  target: ['web', 'es2022'],
  module: {
    rules: [
      {
        test: /\.m?js/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: path.resolve(process.cwd(), 'webpack', 'babel-react-compiler.loader.cjs'),
          // options: {
          //   presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
          //   plugins: [['babel-plugin-react-compiler', reactCompilerConfig]]
          // }
        }
      },
      {
        test: /\.png/,
        type: 'asset/resource'
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    alias: {
      '@': path.resolve(process.cwd(), 'src')
    },
    fallback: {
      path: false,
      process: false,
      fs: false
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser'
    }),
    new webpack.EnvironmentPlugin({ ...process.env }),
    new webpack.ProgressPlugin()
  ]
};
