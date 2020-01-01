const {
    hasPath,
    hasLastCommit,
    sanitizeInputs,
    createNewVersion,
    packageExists,
} = require("./publisher")
const shell = require("shelljs")

describe(".sanitizeInputs", () => {
    describe("Given no inputs", () => {
        let actual = sanitizeInputs()

        test("Expect package json to be package.json of absolute calling directory", () => {
            let expected = process.cwd() + "/package.json"
            expect(actual.absolutePackagePath).toEqual(expected)
        })

        test("Expect git directory to be the absolute calling directory", () => {
            let expected = process.cwd()
            expect(actual.absoluteGitDir).toEqual(expected)
        })
    })

    describe("Given only the git directory", () => {
        let actual = sanitizeInputs({
            gitDir: "tests/storage/fake-git",
        })

        test("Expect git directory to be the absolute path directory provided", () => {
            let expected = process.cwd() + "/tests/storage/fake-git"
            expect(actual.absoluteGitDir).toEqual(expected)
        })

        test("Expect package path to be in the absolute git directory provided", () => {
            let expected =
                process.cwd() + "/tests/storage/fake-git/package.json"
            expect(actual.absolutePackagePath).toEqual(expected)
        })
    })

    describe("Given only the package path", () => {
        let actual = sanitizeInputs({
            packagePath: "tests/storage/fixtures/package.json",
        })
        test("Expect package path to be the absolute path provided", () => {
            let expected =
                process.cwd() + "/tests/storage/fixtures/package.json"
            expect(actual.absolutePackagePath).toEqual(expected)
        })
    })
})

describe(".hasPath", () => {
    test("Given path exists, it should return true", () => {
        let expected = true
        let actual = hasPath(process.cwd())
        expect(actual).toBe(expected)
    })

    test("Given path does not exist, it should throw an error", () => {
        expect.assertions(1)
        let expected = new Error("Cannot find module")
        expect(() => {
            hasPath("/path/does/not/exist")
        }).toThrow(expected)
    })
})

describe(".createNewVersion", () => {
    describe("Given a commit and a package", () => {
        let packaged = {
            version: "1.0.0",
        }
        let actual = createNewVersion("feat: something", packaged)

        test("expect new release package to have new version", () => {
            let expected = "1.1.0"
            expect(actual.version).toEqual(expected)
        })

        test("expect new release package to have release type", () => {
            let expected = "minor"
            expect(actual.release).toEqual(expected)
        })
    })
})

describe(".hasLastCommit", () => {
    test("Given git is not initalised, expect an error", () => {
        afterEach(() => {
            shell.exec("rm -r tests/storage/init-git/.git", {
                silent: true,
            })
        })
        let expected = Error
        expect(() => {
            hasLastCommit(process.cwd() + "/tests/storage/fake-git")
        }).toThrow(expected)
    })

    test("Given git is initalised but there are commits, expect an error", () => {
        let expected = Error
        shell.exec("(cd tests/storage/init-git && git init)", {
            silent: true,
        })
        expect(() => {
            hasLastCommit(process.cwd() + "/tests/storage/init-git")
        }).toThrow(expected)
    })

    test("Given there is a commit, expect no error", () => {
        let expected = true
        let actual = hasLastCommit(process.cwd())
        expect(actual).toBe(expected)
    })
})

describe(".packageExists", () => {
    test("Given package exists, expect an error", () => {
        let expected = Error
        expect(() => {
            packageExists(process.cwd() + "/tests/storage/not/a/real/directory")
        }).toThrow(expected)
    })
})
