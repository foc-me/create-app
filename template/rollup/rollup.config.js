const terser = require("@rollup/plugin-terser")
const cleanup = require("rollup-plugin-cleanup")
const copy = require("rollup-plugin-copy")
const pick = require("@focme/rollup-plugin-pick")
const package = require("./package.json")

const banner = `/* banner */`
const globalName = "globalName"

module.exports = [
    {
        input: "./src/index.js",
        output: {
            file: `./dist/release/${globalName}.${package.version}.umd.js`,
            format: "umd",
            name: globalName,
            banner
        },
        plugins: [
            cleanup({ extensions: "ts" })
        ]
    },
    {
        input: "./src/index.js",
        output: {
            file: `./dist/release/${globalName}.${package.version}.umd.min.js`,
            format: "umd",
            name: globalName,
            banner
        },
        plugins: [
            terser()
        ]
    },
    {
    input: "./src/index.js",
    output: [
        { dir: "./dist/esm", format: "esm", banner },
        { dir: "./dist/dist", format: "cjs", banner }
    ],
    plugins: [
        cleanup(),
        copy({
            targets: [{
                src: ["./readme.md", "./LICENSE"],
                dest: "./dist"
            }]
        }),
        pick([
            "name",
            "version",
            "description",
            "keywords",
            ["main", "./dist/index.js"],
            ["module", "./esm/index.js"],
            ["exports", {
                ".": {
                    import: "./esm/index.js",
                    require: "./dist/index.js"
                }
            }],
            ["files", ["dist", "esm", "LICENSE", "package.json", "readme.md"]],
            "author",
            "repository",
            "license"
        ])
    ]
}]