import terser from "@rollup/plugin-terser"
import copy from "rollup-plugin-copy"
import pick from "@focme/rollup-plugin-pick"

export default {
    input: "./lib/index.js",
    output: [
        { dir: "./dist/esm", format: "esm" },
        // should change the name "project-name"
        { dir: "./dist/dist", format: "umd", name: "project-name" }
    ],
    plugins: [
        terser(),
        copy({
            targets: [{ src: "readme.md", dest: "./dist" }]
        }),
        copy({
            targets: [{
                src: ["lib/**/index.js", "lib/**/src/**"],
                dest: "./dist/lib"
            }],
            flatten: false
        }),
        pick([
            "name",
            "version",
            ["main", "dist/index.js"],
            ["module", "esm/index.js"],
            "description",
            "keywords",
            ["files", ["dist", "esm", "lib", "readme.md", "package.json"]],
            "author",
            "repository",
            "license"
        ])
    ]
}