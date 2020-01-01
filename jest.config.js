module.exports = {
    clearMocks: true,

    collectCoverageFrom: ["lib/**/*.js"],

    coverageDirectory: "coverage",

    setupFilesAfterEnv: ["jest-expect-message"],

    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
        },
    },

    testEnvironment: "node",

    testMatch: ["**/*.steps.js", "**/*.test.js", "**/*.test.io.js"],

    transform: {
        "^.+\\.jsx?$": "babel-jest",
    },

    watchPathIgnorePatterns: ["<rootDir>/node_modules/", "__mocks__"],
}
