module.exports = {
  verbose: true,
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./__setups__/jest.setup.ts'],
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{ts,js}',
    '!**/{dist,lib,coverage,__mocks__,__load__,__setups__,__e2e__,temp,node_modules}/**',
    '!*.config.{ts,js}',
    '!*.d.ts',
    '!.eslintrc.js',
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 90,
      lines: 70,
      statements: 70,
    },
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts'],
  roots: ['.'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleDirectories: ['node_modules'],
  transformIgnorePatterns: [],
  modulePathIgnorePatterns: ['bin', 'dist', 'lib'],
  globals: {},
};
