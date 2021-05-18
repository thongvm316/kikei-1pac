module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,vue}',
    '!src/main.js',
    '!src/router/index.js',
    '!**/node_modules/**'
  ],
  coverageDirectory: '<rootDir>/src/test/unit/coverage',
  moduleFileExtensions: [
    'js',
    'json',
    'vue'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/test/unit/jest.setup.js'],
  testEnvironment: 'jsdom',
  testMatch: [
    '**/?(*.)+(spec|test).js',
  ],
  testPathIgnorePatterns: [
    '\\\\node_modules\\\\'
  ],
  testURL: 'http://localhost',
  transform: {
    '^.+\\.js$': 'babel-jest',
    '.*\\.(vue)$': 'vue-jest',
    '^.+\\.svg$': '<rootDir>/src/test/unit/fileTransformer.js',
  },
  transformIgnorePatterns: ['/node_modules/'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  snapshotSerializers: ['jest-serializer-vue'],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // ".+\\.(css|styl|less|sass|scss)$": "identity-obj-proxy",
    // ".+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/src/__mocks__/fileMock.js"
  }
}
