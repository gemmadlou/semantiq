const { defineFeature, loadFeature } = require("jest-cucumber")
const feature = loadFeature("./docs/features/publish.feature")
const git = require("simple-git/promise")
const os = require("os")
const fs = require("fs")
const shell = require("shelljs")

defineFeature(feature, (test) => {
    let expected = "0.6.0"
    let actual
    let fileSetting = {
        encoding: "utf8",
    }
    let gitDir = os.tmpdir() + "/sempublish/tests/fake-cli-git"

    afterEach(async () => {
        shell.rm("-rf", gitDir + "/.git")
    })
    test("Getting the next version number", ({ given, when, then }) => {
        given("a repository", async () => {
            shell.exec(`mkdir -p ${gitDir}`)
            fs.writeFileSync(
                gitDir + "/package.json",
                JSON.stringify({
                    version: "0.5.0",
                }),
                fileSetting
            )
            let repo = git(gitDir)
            await repo.init()
            await repo.add("./")
            await repo.commit("feat: some feature")
        })

        when("we publish the new release", async () => {
            actual = shell
                .exec(`cd ${gitDir} && ${process.cwd()}/bin/semantiq.js next`)
                .stdout.replace(/[\s]+/, "")
        })

        then("the new version should be returned", () => {
            expect(actual).toEqual(expected)
        })
    })
})
