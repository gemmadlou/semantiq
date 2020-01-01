/**
 * @typedef {import("./publisher")} publisher
 */

/**
 * @typedef {object} Input
 * @property {string} [packagePath]
 * @property {string} [gitDir]
 */

/**
 * Publishes new release
 * @param {publisher} [publisher]
 * @returns {(input?: Input) => Promise<string|null>}
 */
module.exports = (publisher) => async (input) => {
    let config = publisher.sanitizeInputs(input)

    publisher.hasPath(config.absolutePackagePath)
    publisher.hasLastCommit(config.absoluteGitDir)
    publisher.packageExists(config.absolutePackagePath)

    let current = {}
    current.commitMessage = await publisher.getLastCommit(config.absoluteGitDir)
    current.package = await publisher.getPackage(config.absolutePackagePath)

    return publisher.createNewVersion(current.commitMessage, current.package)
}
