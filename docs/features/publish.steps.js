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
    let fileSetting = {
        encoding: "utf8",
    }
    let gitDir = os.tmpdir() + "/sempublish/tests/fake-git"

    afterEach(async () => {
        shell.rm("-rf", gitDir + "/.git")
    })
    test("Getting the next version number", ({ given, when, then }) => {
        let expected = "4.7.0"
        given("a repository", async () => {
            shell.exec(`mkdir -p ${gitDir}`)
            fs.writeFileSync(
                gitDir + "/package.json",
                JSON.stringify({
                    version: "4.6.1",
                }),
                fileSetting
            )
            let repo = git(gitDir)
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
            expect(actual).toEqual(expected)
        })
    })
})
