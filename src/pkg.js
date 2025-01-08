import fs from "node:fs"
import path from "node:path"
import stringify from "@focme/stringify-json"

function makePkg(pkgPath) {
    if (fs.existsSync(pkgPath)) {
        const stat = fs.statSync(pkgPath)
        if (stat.isFile()) {
            try {
                return JSON.parse(fs.readFileSync(pkgPath))
            } catch(error) {
                throw error
            }
        }
    }
}

export default async function(option) {
    const { position, project, description = "", author = "" } = option
    const pkgPath = path.join(position, "package.json")
    const content = Object.assign(makePkg(pkgPath), {
        name: project,
        description,
        author
    })
    fs.writeFileSync(pkgPath, stringify(content))
}