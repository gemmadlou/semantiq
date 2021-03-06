#!/usr/bin/env node

if (require.main !== module) {
    throw new Error("Executable-only module should not be required")
}

const log = console.info

const packageJson = require("../package.json")
const runner = require("../lib/runner")
const publisher = require("../lib/publisher")
const async = require("async-kit")
const chalk = require("chalk")

const yargs = require("yargs")
    .scriptName("sem")
    .usage("$0 <cmd>")
    .command("", "Gets next version")
    .command("release", "Gets release type")
    .help("h")
    .alias("h", "help")

const argv = yargs.argv

if (argv.v || argv.version) {
    log(packageJson.version)
    process.exit(0)
}

;(async () => {
    try {
        let publish = runner(publisher)
        let release = await publish()

        if (!release.release) {
            async.exit(1)
        }

        switch (argv._[0]) {
            case "release":
                log(release.release)
                break
            default:
                log(release.version)
                break
        }
        async.exit()
    } catch (error) {
        log(chalk.red(error.message))
        async.exit(1)
    }
})()
