module.exports = {
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePathIgnorePatterns: ['.d.ts$', '<rootDir>/dist'],
  roots: ['<rootDir>'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['helpers?.ts', 'helpers?.js'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest',
  },
};
