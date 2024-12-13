module.exports = {
  roots: ['<rootDir>/tests'],
  transform: {
    '^.+\\.js$': 'babel-jest', // Use babel to transform ES6 to commonjs
  },
  testEnvironment: 'node', // Node.js environment for tests
  moduleFileExtensions: ['js'],
};
