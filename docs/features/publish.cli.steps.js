const { defineFeature, loadFeature } = require("jest-cucumber")
const feature = loadFeature("./docs/features/publish.feature")
const git = require("simple-git/promise")
const os = require("os")
const fs = require("fs")
const shell = require("shelljs")

defineFeature(feature, (test) => {
    let actual
    let repo
    let fileSetting = {
        encoding: "utf8",
    }
    let gitDir = os.tmpdir() + "/sempublish/tests/fake-cli-git"
    beforeEach(async () => {
        shell.exec(`mkdir -p ${gitDir}`)
        fs.writeFileSync(
            gitDir + "/package.json",
            JSON.stringify({
                version: "0.5.0",
            }),
            fileSetting
        )
        repo = git(gitDir)
    })
    afterEach(async () => {
        shell.rm("-rf", gitDir + "/.git")
    })
    test("Getting the next version number", ({ given, when, then }) => {
        given("a repository", async () => {
            await repo.init()
            await repo.add("./")
            await repo.commit("feat: some feature")
        })

        when("we publish the new release", async () => {
            actual = shell
                .exec(`cd ${gitDir} && ${process.cwd()}/bin/semantiq.js next`, {
                    silent: true,
                })
                .stdout.replace(/[\s]+/, "")
        })

        then("the new version should be returned", () => {
            let expected = "0.6.0"
            expect(actual).toEqual(expected)
        })
    })

    test("Getting the next release type", ({ given, when, then }) => {
        given("a repository", async () => {
            await repo.init()
            await repo.add("./")
            await repo.commit("feat: some feature")
        })

        when("we publish the new release", async () => {
            actual = shell
                .exec(
                    `cd ${gitDir} && ${process.cwd()}/bin/semantiq.js release`
                )
                .stdout.replace(/[\s]+/, "")
        })

        then("the release type should be returned", () => {
            let expected = "minor"
            expect(actual).toEqual(expected)
        })
    })
})
