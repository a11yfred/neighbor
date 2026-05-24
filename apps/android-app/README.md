# neighbor — Android App Stub (WIP)

> [!WARNING]
> **Work In Progress**
> This directory is a WIP stub for `neighbor`'s custom Android accessibility lint detector targeting Jetpack Compose. It is not yet a complete Android Studio project or publishable Gradle module.

## Strategy

Android accessibility linting in `a11yfred` is split into two layers, mirroring the real-world Android toolchain:

### Layer 1 — Android Lint (View system + XML layouts)

Android Lint ships built-in a11y checks that run via `./gradlew lint` in any Android project and integrate directly into Android Studio:

| Lint Check | What It Flags |
|---|---|
| `ContentDescription` | `ImageView` missing `contentDescription` |
| `LabelFor` | `EditText` missing associated `labelFor` |
| `ClickableViewAccessibility` | Custom views overriding `onTouchEvent` without `performClick()` |
| `KeyboardInaccessibleWidget` | Interactive elements unreachable by keyboard/switch |

These are already well-covered by the built-in tooling. Run them with:
```bash
./gradlew lint
```

### Layer 2 — Custom Compose Lint Detector (the real gap)

Jetpack Compose a11y static analysis is **critically underserved**. There is no widely-adopted tool that checks `Modifier` chains for accessibility correctness. This is what `a11yfred` aims to build.

See [`NeighborLintDetector.kt`](./NeighborLintDetector.kt) for the WIP custom Android Lint Detector stubs. When complete, these will catch:

| Rule | What It Flags | Reference |
|---|---|---|
| `ComposeClickableNoRole` | `Modifier.clickable()` without a `role` parameter — TalkBack has no context | [Compose Semantics](https://developer.android.com/jetpack/compose/semantics) |
| `ComposePointerInputNoSemantics` | `Modifier.pointerInput()` without a paired `semantics {}` block | [WCAG 2.1.1](https://www.w3.org/WAI/WCAG21/Understanding/keyboard) |

> [!NOTE]
> **Why not use ATF (Accessibility Test Framework)?**
> [Google's ATF](https://github.com/google/Accessibility-Test-Framework-for-Android) is an excellent *runtime* tool — it runs against a rendered `AccessibilityNodeInfo` tree and catches contrast, touch target size, and label issues. However, like `@axe-core/react`, it requires a running UI. The goal of `a11yfred` is to catch these issues *statically at lint time* before the code even compiles.

## Build Instructions (future)

The custom lint detector will be built as a standard Android Lint module:

```groovy
// build.gradle
dependencies {
    compileOnly "com.android.tools.lint:lint-api:$lintVersion"
    compileOnly "com.android.tools.lint:lint-checks:$lintVersion"
}

jar {
    manifest {
        attributes("Lint-Registry-v2": "neighbor.android.lint.NeighborIssueRegistry")
    }
}
```

## Additional Resources

- [Appt.org — Android Accessibility](https://appt.org/en/docs/android/samples)
- [Google Developer Guide — Testing Accessibility](https://developer.android.com/guide/topics/ui/accessibility/testing)
- [Jetpack Compose Semantics](https://developer.android.com/jetpack/compose/semantics)
- [Google Accessibility Test Framework](https://github.com/google/Accessibility-Test-Framework-for-Android)
- [slack/compose-lints](https://github.com/slackhq/compose-lints) — community Compose lint rules (adjacent, not a11y-specific)
