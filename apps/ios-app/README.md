# iOS App Stub (WIP)

> [!WARNING]
> **Work In Progress**
> This directory is currently a stub for testing and linting iOS accessibility via the a11yfred monorepo. It is not yet a complete Xcode project.

This directory demonstrates how `a11yfred` integrates with native iOS SwiftUI projects to lint for accessibility violations statically. 

We utilize the open-source **[CVS Health a11y-check](https://cvs-health.github.io/ios-swiftui-accessibility-techniques/#a11y-checker-a11y-check)** static analyzer for Swift.

## Linting

To run the linter as part of the monorepo pipeline, simply use:
```bash
npm run lint
```
*(Note: If you are running on Windows or Linux, the linter script will safely skip execution and output a warning since `a11y-check` requires macOS).*

## Installation (Mac only)

If you are developing on a Mac and want to see the accessibility warnings locally:

```bash
brew tap cvs-health/ios-swiftui-accessibility-techniques https://github.com/cvs-health/ios-swiftui-accessibility-techniques.git
brew install --HEAD cvs-health/ios-swiftui-accessibility-techniques/a11y-check
```

## Credits
The static analyzer used in this stub is generously provided by the open source project [iOS SwiftUI Accessibility Techniques](https://github.com/cvs-health/ios-swiftui-accessibility-techniques) by CVS Health.
