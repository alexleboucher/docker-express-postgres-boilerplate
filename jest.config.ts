import { Config } from "jest";

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['src/tests/helpers/'],
  coveragePathIgnorePatterns: ['/node_modules/', 'src/tests/helpers/', 'src/infra/database/migrations/'],
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.[cm]?[tj]sx?$': ['ts-jest', { isolatedModules: true }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(?:\\.pnpm/)?(?:inversify|@inversifyjs)/)',
  ],
}

export default config;