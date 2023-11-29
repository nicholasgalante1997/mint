const dotenv = require('dotenv');
const path = require('path');
const { merge } = require('webpack-merge');

const AppConfig = require('../config/app.json');

const common = require('./webpack.common');

dotenv.config();

function getEntryObject() {
  const webpackEntry = {};
  const { entrypoints } = AppConfig;
  for (const configEntrypoint of entrypoints) {
    const { path: entrypointPath, out } = configEntrypoint;
    Object.assign(webpackEntry, {
      [out.bundle]: path.resolve(process.cwd(), 'src', ...entrypointPath.split('/'))
    });
  }
  return webpackEntry;
}

const prod = {
  mode: 'production',
  entry: getEntryObject(),
  output: {
    clean: false,
    path: path.resolve(process.cwd(), 'build'),
    filename: '[name].bundle.js',
    module: true,
    chunkFormat: 'module'
  },
  experiments: {
    outputModule: true
  }
};

module.exports = merge(common, prod);
