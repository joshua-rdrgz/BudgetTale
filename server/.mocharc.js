module.exports = {
  recursive: true,
  require: ['ts-node/register', 'tsconfig-paths/register', 'dotenv/config'],
  file: './test/setup.test.ts',
  spec: ['./test/**/*.test.ts'],
  watch: true,
  'watch-files': ['./src/**/*.ts', './test/**/*.test.ts'],
  watchDelay: 2000,
};
