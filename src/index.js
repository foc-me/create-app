import fs from "node:fs"
import makeOption from "./option.js"
import { makePrompts, appTypes } from "./base.js"
import makeCopy from "./copy.js"
import makePkg from "./pkg.js"

async function makeDirection(position) {
    if (fs.existsSync(position)) {
        if (fs.statSync(position).isDirectory()) {
            const value = await makePrompts({
                type: "confirm",
                name: "value",
                initial: true,
                message: "direction already exists, continue to create?: "
            })
            if (!value) {
                process.exit(1)
            }
            return
        }
    }
    fs.mkdirSync(position, { recursive: true })
}

function makeTemplate(option) {
    const { appType, typescript, react } = option
    switch (appType) {
        case appTypes.rollup:
            if (typescript) return "rollup-ts"
            else return "rollup"
        case appTypes.koa:
            if (react && typescript) return "koa-react-ts"
            else if (react) return "koa-react"
            else if (typescript) return "koa-ts"
            else return "koa"
        default: return undefined
    }
}

function makeIgnore(template) {
    switch (template) {
        case "rollup-ts":
        case "rollup": return "rollup.gitignore"
        case "koa-react-ts": return "koa-react-ts.gitignore"
        case "koa-react": return "koa-react.gitignore"
        case "koa-ts": return "koa-ts.gitignore"
        case "koa": return "koa.gitignore"
        default: return
    }
}

async function createApp() {
    try {
        const option = await makeOption()
        await makeDirection(option.position)
        option.template = makeTemplate(option)
        if (option.template) {
            option.gitignore = makeIgnore(option.template)
            await makeCopy(option)
            await makePkg(option)
        }
        process.stdout.write("done")
        process.exit(0)
    }catch(error) {
        console.error(error)
        process.exit(1)
    }
}

await createApp()