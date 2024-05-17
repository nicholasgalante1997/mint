const { transformSync } = require('@babel/core');
const BabelPluginReactCompiler = require('babel-plugin-react-compiler');
const BabelPresetEnv = require('@babel/preset-env');
const BabelPresetReact = require('@babel/preset-react');
const BabelPresetTs = require('@babel/preset-typescript');
const reactCompilerConfig = require('./babel-react-compiler.config.cjs');

function reactCompilerLoader(sourceCode, sourceMap) {
  const result = transformSync(sourceCode, {
    filename: this.resourcePath,
    presets: [BabelPresetEnv, BabelPresetReact, BabelPresetTs],
    plugins: [
      [BabelPluginReactCompiler, reactCompilerConfig],
    ],
  });

  if (result === null) {
    this.callback(
      Error(
        `Failed to transform "${this.resourcePath}"`
      )
    );
    return;
  }

  this.callback(
    null,
    result.code,
    result.map === null ? undefined : result.map
  );
}

module.exports = reactCompilerLoader;