import copy from "rollup-plugin-copy"
import resolve from "@rollup/plugin-node-resolve"
import cleanup from "rollup-plugin-cleanup"
import pick from "@focme/rollup-plugin-pick"

export default {
    external: [
        "prompts",
        "@focme/argv",
        "@focme/stringify-json"
    ],
    input: "./src/index.js",
    output: {
        file: "./dist/index.js",
        format: "esm",
        banner: "#!/usr/bin/env node"
    },
    plugins: [
        resolve(),
        cleanup(),
        copy({
            targets: [
                { src: ["./template"], dest: "./dist" },
                { src: ["./readme.md"], dest: "./dist" }
            ]
        }),
        pick([
            "name",
            "version",
            ["bin", { "create-app": "./index.js" }],
            "description",
            "keywords",
            "type",
            ["files", ["index.js", "readme.md", "package.json", "template"]],
            "author",
            "repository",
            "license",
            "dependencies"
        ])
    ]
}