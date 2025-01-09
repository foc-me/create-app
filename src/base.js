import prompts from "prompts"

export function makePrompts(option) {
    option.name = "value"
    return prompts(option).then(result => {
        if (result.value === undefined) process.exit(1)
        return result.value
    })
}

export const appTypes = {
    rollup: "rollup",
    koa: "koa",
    webpack: "webpack",
    electron: "electron",
    direction: "direction"
}

export const viewTypes = {
    react: "react",
    vue: "vue"
}