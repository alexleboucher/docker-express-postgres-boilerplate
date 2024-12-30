import { Config } from "jest";

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['src/tests/helpers/'],
  coveragePathIgnorePatterns: ['/node_modules/', 'src/tests/helpers/', 'src/migrations/'],
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1',
  },
}

export default config;