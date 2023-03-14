import { Config } from "jest";

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['__tests__/utils/'],
  coveragePathIgnorePatterns: ['/node_modules/', '__tests__/utils/', 'src/migrations/']
}

export default config;