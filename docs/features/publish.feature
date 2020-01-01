Feature: Publishing
    The CI build script should be able to publish a new release version automatically

    Scenario: Getting the next version number
        Given a repository
        When we publish the new release
        Then the new version should be returned
