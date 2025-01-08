import path from "node:path"
import createArgv from "@focme/argv"
import { makePrompts, appTypes } from "./base.js"

async function makePosition() {
    const value = await makePrompts({
        type: "text",
        initial: "test-project",
        message: "project name: "
    })
    if (path.isAbsolute(value)) return value
    else return path.resolve(process.cwd(), value)
}

async function makeDescription() {
    return await makePrompts({
        type: "text",
        initial: "",
        message: "project description: "
    })
}

async function makeAuthor() {
    return await makePrompts({
        type: "text",
        initial: "",
        message: "project auther: "
    })
}

function makeAppType() {
    return makePrompts({
        type: "select",
        message: "app type: ",
        choices: [
            { title: "rollup library", value: appTypes.rollup },
            { title: "koa service", value: appTypes.koa },
            { title: "webpack spa", value: appTypes.webpack },
            { title: "electron application", value: appTypes.electron },
            { title: "not sure", description: "only create a direction", value: appTypes.direction }
        ]
    })
}

async function makeTypescript() {
    return makePrompts({
        type: "confirm",
        name: "value",
        initial: true,
        message: "use typescript: "
    })
}

async function makeReactSSR() {
    return makePrompts({
        type: "confirm",
        name: "value",
        initial: true,
        message: "use react SSR: "
    })
}

export default async function() {
    const { _: [position, project] = [] } = createArgv().opt()
    const option = { current: { position, project } }

    if (!option.current.position) {
        option.current.position = await makePosition()
    }
    if (!option.current.project) {
        option.current.project = option.current.position.split(/[\\\/]/g).pop()
    }
    option.current.description = await makeDescription()
    option.current.author = await makeAuthor()
    option.current.appType = await makeAppType()
    option.current.typescript = await makeTypescript()

    switch (option.current.appType) {
        case appTypes.koa:
            option.current.react = await makeReactSSR()
        default: break
    }

    return option.current
}