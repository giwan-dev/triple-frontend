const { defaults: tsjPreset } = require('ts-jest/presets')

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  transform: {
    ...tsjPreset.transform,
  },
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['<rootDir>/lib', '<rootDir>/node_modules'],
}
