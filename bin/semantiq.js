#!/usr/bin/env node

if (require.main !== module) {
    throw new Error("Executable-only module should not be required")
}

const packageJson = require("../package.json")
const runner = require("../lib/runner")
const publisher = require("../lib/publisher")
const async = require("async-kit")
const chalk = require("chalk")

const yargs = require("yargs")
    .scriptName("sem")
    .usage("$0 <cmd>")
    .command("next", "Gets next version")
    .help("h")
    .alias("h", "help")

const log = console.log

const argv = yargs.argv

if (argv.v || argv.version) {
    log(packageJson.version)
    process.exit(0)
}

;(async () => {
    try {
        let publish = runner(publisher)
        let release = await publish()

        if (!release) {
            process.exit(1)
        }

        log(release)
        async.exit()
    } catch (error) {
        log(chalk.red(error.message))
        async.exit(1)
    }
})()
