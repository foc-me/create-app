export default {
    testEnvironment: "jsdom",
    moduleNameMapper: {
        "^lib/(.*)$": "<rootDir>/lib/$1",
        "^lib/": "<rootDir>/lib"
    }
}