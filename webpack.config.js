// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

module.exports = {
  target: 'web',
  mode: 'production',
  entry: './src/index.ts',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          compilerOptions: {
            outDir: './dist',
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  node: {
    // @payid-org/utils has a dependency on fs
    fs: 'empty',
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'XpringCommonJS',
    libraryTarget: 'umd',
    globalObject: "(typeof self !== 'undefined' ? self : this)",
  },
}
