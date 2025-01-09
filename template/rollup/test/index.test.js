const sayHi = require("../src/index.js")

describe("check sayHi", () => {
    test("check hello world", () => {
        expect(sayHi("world")).toEqual("hello world")
    })
})