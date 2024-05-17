const path = require('path');
const { merge } = require('webpack-merge');
const webpack = require('webpack');

const buildScript = {
  mode: 'production',
  entry: path.resolve(process.cwd(), 'src', 'xng', 'index.ts'),
  output: {
    path: path.resolve(process.cwd(), '.xng'),
    filename: 'main.cjs'
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: path.resolve(process.cwd(), 'webpack', 'babel-react-compiler.loader.cjs'),
          // options: {
          //   presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"]
          // }
        }
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(process.cwd(), 'src')
    }
  },
  target: 'node',
  node: {
    global: false
  },
  plugins: [new webpack.EnvironmentPlugin({ ...process.env })]
};

module.exports = merge({}, buildScript);
