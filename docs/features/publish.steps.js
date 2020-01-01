const { defineFeature, loadFeature } = require("jest-cucumber")
const feature = loadFeature("./docs/features/publish.feature")
const runner = require("../../lib/runner")
const publisher = require("../../lib/publisher")
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
    let gitDir = os.tmpdir() + "/sempublish/tests/fake-git"

    beforeEach(async () => {
        shell.exec(`mkdir -p ${gitDir}`)
        fs.writeFileSync(
            gitDir + "/package.json",
            JSON.stringify({
                version: "4.6.1",
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
            let publish = runner(publisher)
            actual = await publish({
                gitDir,
            })
        })

        then("the new version should be returned", () => {
            let expected = "4.7.0"
            expect(actual.version).toEqual(expected)
        })
    })

    test("Getting the next release type", ({ given, when, then }) => {
        given("a repository", async () => {
            await repo.init()
            await repo.add("./")
            await repo.commit("feat: some feature")
        })

        when("we publish the new release", async () => {
            let publish = runner(publisher)
            actual = await publish({
                gitDir,
            })
        })

        then("the release type should be returned", () => {
            let expected = "minor"
            expect(actual.release).toEqual(expected)
        })
    })
})
