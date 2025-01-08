import fs from "node:fs"
import path from "node:path"
import { makePrompts } from "./base.js"

const { stdout: output } = process
const templateHome = path.resolve(import.meta.dirname, "../template")

async function makeDirection(director) {
    if (!fs.existsSync(director) || !fs.statSync(director).isDirectory()) {
        fs.mkdirSync(director, { recursive: true })
    }
}

function makeTemplateFiles(itemPath) {
    const result = []
    for (const item of fs.readdirSync(itemPath)) {
        const stat = fs.statSync(path.resolve(itemPath, item))
        if (stat.isFile()) result.push(item)
        if (stat.isDirectory()) {
            const next = makeTemplateFiles(path.resolve(itemPath, item))
            result.push(...next.map(nextItem => {
                if (Array.isArray(nextItem)) {
                    return [nextItem[0], [item, ...nextItem[1]]]
                }
                return [nextItem, [item]]
            }))
        }
    }
    return result
}

async function copyFile(files, target) {
    const count = files.length
    let replace = undefined
    let current = 0
    for (const [name, [template, ...dir], origin = name] of files) {
        const originItemPath = path.resolve(templateHome, template, ...dir, origin)

        const targetPath = path.resolve(target, ...dir)
        const targetItemPath = path.resolve(targetPath, name)
        await makeDirection(targetPath)

        const exist = fs.existsSync(targetItemPath)
        if (exist && fs.statSync(targetItemPath).isFile()) {
            if (!["replace-all", "skip-all"].includes(replace)) {
                const result = await makePrompts({
                    type: "text",
                    initial: "r",
                    message: `file '${targetItemPath}' already exist. \nreplace it? (r: replace / ra: replace all / s: skip / sa: skip all): `
                })
                if (result === "r") replace = "replace"
                if (result === "ra") replace = "replace-all"
                if (result === "s") replace = "skip"
                if (result === "sa") replace = "skip-all"
            }
        }
        if (!exist || ["replace", "replace-all"].includes(replace)) {
            fs.copyFileSync(originItemPath, targetItemPath)
        }
        output.clearLine(0)
        output.cursorTo(0)
        output.write(`[${++current}/${count}] ${targetItemPath}`)
        await new Promise(resolve => {
            setTimeout(() => resolve(), 10)
        })
    }
    output.clearLine(0)
    output.cursorTo(0)
}

export default async function(option) {
    const { position, template, gitignore } = option
    const templatePath = path.resolve(templateHome, template)
    const templateFiles = makeTemplateFiles(templatePath).filter(item => {
        return item !== ".gitignore"
    }).map(item => {
        if (Array.isArray(item)) {
            return [item[0], [template, ...item[1]]]
        }
        return [item, [template]]
    })
    const ignorePath = path.resolve(templateHome, "ignore", gitignore)
    if (fs.existsSync(ignorePath) && fs.statSync(ignorePath).isFile()) {
        templateFiles.push([".gitignore", ["ignore"], gitignore])
    }
    await copyFile(templateFiles, position)
}