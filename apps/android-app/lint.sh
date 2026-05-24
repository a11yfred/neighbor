#!/bin/bash
echo "⚠️ [WIP] neighbor — Android linting is currently a Work In Progress."
echo ""
echo "The neighbor Android linting strategy covers two layers:"
echo "  1. Android Lint (gradlew lint)  - for View-based XML layouts"
echo "  2. Custom Lint Detector (Kotlin/UAST)  - for Jetpack Compose semantics"
echo ""

# ── Layer 1: Gradle Lint ──────────────────────────────────────────────────────
# Check if gradlew exists (i.e. we're inside an actual Android project)
if [ -f "./gradlew" ]; then
    echo "Running Android Lint via Gradle..."
    ./gradlew lint
else
    echo "Notice: No gradlew found. Android Lint requires a Gradle project."
    echo "To run it in your Android Studio project:"
    echo "  ./gradlew lint"
    echo ""
    echo "Android Lint built-in a11y checks include:"
    echo "  - ContentDescription (missing on ImageView)"
    echo "  - LabelFor (missing on EditText)"
    echo "  - ClickableViewAccessibility (custom views missing performClick)"
    echo "  - KeyboardInaccessibleWidget"
fi

echo ""

# ── Layer 2: Custom Compose Lint Detector (neighbor) ─────────────────────────
# Check if the custom lint jar has been built
LINT_JAR="./build/libs/neighbor-lint.jar"
if [ -f "$LINT_JAR" ]; then
    echo "Running neighbor custom Compose lint detector..."
    java -jar "$LINT_JAR" .
else
    echo "Notice: neighbor-lint.jar not yet built."
    echo "The neighbor Compose lint detector is a WIP. When built, it will check:"
    echo "  - Modifier.clickable() without Role (TalkBack/Voice Access announce element type)"
    echo "  - Modifier.pointerInput() without semantics{} block"
    echo "  - Image() without contentDescription argument"
    echo "  - Modifier.toggleable() without Role"
    echo "  - Clickable containers without mergeDescendants (TalkBack fragmentation)"
    echo "  - Dynamic Text() without liveRegion semantics"
    echo "  - Stateful components without stateDescription"
    echo ""
    echo "See README.md for build instructions."
fi

exit 0
