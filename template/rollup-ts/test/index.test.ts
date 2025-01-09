import sayHi from "../src"

describe("check sayHi", () => {
    test("check hello world", () => {
        expect(sayHi("world")).toEqual("hello world")
    })
})