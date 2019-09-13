const path = require('path')
const paths = require('./paths')
const ForkTsCheckerWebpackPlugin = require('react-dev-utils/ForkTsCheckerWebpackPlugin')
const typescriptFormatter = require('react-dev-utils/typescriptFormatter')

module.exports = env => {
  return {
    entry: './src/worker.ts',
    output: {
      filename: 'worker.js',
      path: paths.appSrc
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ],
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ]
    },
  }
}
