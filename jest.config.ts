import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

const config: import('jest').Config = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },

  moduleDirectories: ['node_modules', '<rootDir>/src'],
};

export default createJestConfig(config);
