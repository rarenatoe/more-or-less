module.exports = {
  preset: '@testing-library/react-native',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.spec.json',
    },
  },
  modulePathIgnorePatterns: ['<rootDir>/example/node_modules', '<rootDir>/lib/'],
  transform: {
    '^.+\\.jsx$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  cacheDirectory: '.jest/cache',
  moduleNameMapper: {
    src: '<rootDir>/src',
  },
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
};
