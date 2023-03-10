const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: {
    main: './src/server.ts',
  },
  mode: process.env.NODE_ENV,
  target: 'node',
  watch: process.env.NODE_ENV === 'development',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@types': path.resolve(__dirname, 'types/types.ts'),
      '@errorMessages': path.resolve(
        __dirname,
        '../errorMessages/errorMessages.ts'
      ),
      '@models': path.resolve(__dirname, 'src/models'),
      '@routes': path.resolve(__dirname, 'src/routes'),
      '@controllers': path.resolve(__dirname, 'src/controllers'),
      '@errors': path.resolve(__dirname, 'src/errors'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader'],
        exclude: /node_modules/,
      },
    ],
  },
};
