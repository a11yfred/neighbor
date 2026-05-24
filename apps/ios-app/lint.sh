#!/bin/bash
echo "⚠️ [WIP] iOS Linting is currently a Work In Progress."

# Check if a11y-check is installed
if ! command -v a11y-check &> /dev/null
then
    echo "Notice: a11y-check is not installed on this machine."
    echo "Because this tool is macOS-only via Homebrew, this step is safely skipped."
    echo "To lint Swift files on a Mac, install via:"
    echo "  brew tap cvs-health/ios-swiftui-accessibility-techniques https://github.com/cvs-health/ios-swiftui-accessibility-techniques.git"
    echo "  brew install --HEAD cvs-health/ios-swiftui-accessibility-techniques/a11y-check"
    exit 0
fi

# Run a11y-check on the current directory
echo "Running a11y-check..."
a11y-check .
