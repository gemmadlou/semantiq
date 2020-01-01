const semver = require("semver")
const git = require("simple-git/promise")
const path = require("path")
const shell = require("shelljs")
const fs = require("fs")

/**
 * @typedef ReleaseType
 * @type {object}
 */
const releaseType = {
    feat: "minor",
    fix: "patch",
    docs: "patch",
    refactor: "patch",
    perf: "patch",
    test: "patch",
    chore: "patch",
}

/**
 * Gets the absolute path
 * @param {string} string
 * @returns {string}
 */
const getAbsPath = (string) => {
    let absPath = process.cwd()

    if (string && string.toString().length > 0 && path.isAbsolute(string)) {
        absPath = "/"
    }

    return path.join(absPath, ...(string ? string.split("/") : []))
}

/**
 * @property {object} [input]
 * @property {string} [input.packagePath]
 * @property {string} [input.gitDir]
 * @returns {{
 *  absolutePackagePath: string,
 *  absoluteGitDir: string
 * }}
 */
module.exports.sanitizeInputs = (input = {}) => {
    let absoluteGitDir = getAbsPath(input.gitDir)

    let gitDirBasePackagePath = input.gitDir
        ? input.gitDir + "/package.json"
        : null

    let defaultFile =
        input.packagePath || gitDirBasePackagePath || "package.json"
    let absolutePackagePath = getAbsPath(defaultFile)

    return {
        absolutePackagePath,
        absoluteGitDir,
    }
}

/**
 * Checks if app has path
 *
 * @param {string} absolutePackagePath
 * @return {boolean}
 * @throws {Error} Cannot find module
 */
module.exports.hasPath = (absolutePackagePath) => {
    if (!fs.existsSync(absolutePackagePath)) {
        throw new Error("Cannot find module")
    }

    return true
}

/**
 * Checks has last commit
 *
 * @param {string} absoluteGitDir
 * @return {boolean}
 * @throws {Error}
 */
module.exports.hasLastCommit = (absoluteGitDir) => {
    var { stderr } = shell.exec(`ls -l ${absoluteGitDir}/.git`, {
        silent: true,
    })

    if (stderr) {
        throw new Error("Git is not initalised")
    }

    var { stderr: error } = shell.exec(`(cd ${absoluteGitDir} && git log)`, {
        silent: true,
    })

    if (error) {
        throw new Error(error.toString())
    }

    return true
}

/**
 * Checks if package.json exists
 *
 * @param {string} absolutePackagePath
 * @throws {Error} Cannot find module
 */
module.exports.packageExists = (absolutePackagePath) => {
    if (!fs.existsSync(absolutePackagePath)) {
        throw new Error("Cannot find module")
    }
}

/**
 * Gets last commit
 *
 * @param {string} absoluteGitDir
 * @return {Promise<string>}
 */
module.exports.getLastCommit = async (absoluteGitDir) => {
    let repo = await git(absoluteGitDir)

    let { latest } = await repo.log()

    return latest.message
}

/**
 * Gets package
 *
 * @param {string} absolutePackagePath
 * @return {Promise<object>}
 */
module.exports.getPackage = async (absolutePackagePath) => {
    let file = fs.readFileSync(absolutePackagePath, {
        encoding: "utf8",
    })
    return JSON.parse(file)
}

/**
 * Creates a new version
 *
 * @param {string} commitMessage
 * @param {object} packaged
 * @param {string} packaged.version
 * @return {{
 *  version: string,
 *  release: ("minor"|"patch")
 * }}
 */
module.exports.createNewVersion = (commitMessage, packaged) => {
    let release = Object.keys(releaseType).join("|")
    let regex = new RegExp(`^(${release})`, "ig")
    let releaseMatch = commitMessage.match(regex)
    return {
        version: semver.inc(packaged.version, releaseType[releaseMatch]),
        release: releaseType[releaseMatch],
    }
}
