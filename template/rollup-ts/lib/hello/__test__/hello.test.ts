import hello from "../src/hello"

describe("test hello", () => {
    test("hello world", () => {
        expect(hello("world")).toEqual("hello world")
    })
})