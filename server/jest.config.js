module.exports = {
  testEnvironment: 'node',
  transform: { // turns .ts to .js before running tests
    '^.+\\.ts$': 'ts-jest',
  },
};
