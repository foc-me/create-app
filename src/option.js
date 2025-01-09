import path from "node:path"
import createArgv from "@focme/argv"
import { makePrompts, appTypes, viewTypes } from "./base.js"

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
        message: "select app type: ",
        choices: [
            { title: "rollup library", value: appTypes.rollup },
            { title: "koa service", value: appTypes.koa },
            // { title: "webpack project", value: appTypes.webpack },
            // { title: "electron application", value: appTypes.electron },
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

async function makeView() {
    return makePrompts({
        type: "select",
        message: "select view type: ",
        choices: [
            { title: "react", value: viewTypes.react },
            { title: "vue", value: viewTypes.vue }
        ]
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

    switch (option.current.appType) {
        case appTypes.rollup:
            option.current.typescript = await makeTypescript()
            break
        case appTypes.koa:
            option.current.react = await makeReactSSR()
            option.current.typescript = await makeTypescript()
            break
        // case appTypes.webpack:
        //     option.current.view = await makeView()
        //     option.current.typescript = await makeTypescript()
        //     break
        // case appTypes.electron:
        //     option.current.view = await makeView()
        //     if (option.current.view === viewTypes.react) {
        //         option.current.typescript = await makeTypescript()
        //     }
        //     break
        default: break
    }

    return option.current
}