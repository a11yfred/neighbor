# Neighbor - Android App (Work in Progress)

> [!NOTE]
> This directory contains `neighbor`'s custom Android Lint module, specifically designed to check Jetpack Compose code for accessibility gaps.

## How It Works

Android accessibility checking in `neighbor` has two parts. This is similar to how standard Android tools work:

### Part 1: Android Lint (Views and XML)

Android Lint comes with built-in accessibility checks. You can run them in any Android project by typing `./gradlew lint` in your terminal. They also show up as warnings directly inside Android Studio.

| Lint Check | What it finds |
| --- | --- |
| `ClickableViewAccessibility` | Custom views use `onTouchEvent` but do not use `performClick()`. |
| `ContentDescription` | `ImageView` is missing a `contentDescription`. |
| `KeyboardInaccessibleWidget` | Users cannot reach interactive elements with a keyboard. |
| `LabelFor` | `EditText` is missing a `labelFor`. |
| `SpUsage` | Flags `dp` text sizes in XML instead of `sp` (Text Scaling). |
| `TouchTargetSizeCheck` | Flags XML widgets smaller than 48dp (Touch Targets). |

These built-in tools already do a massive amount of work for legacy XML Views. Because standard tooling covers XML so thoroughly, **`neighbor` intentionally ignores XML layouts and defers entirely to standard Android Lint.** We strongly suggest that you use standard Android Lint in your project.

### Part 2: Custom Compose Rules (the Missing Piece)

Jetpack Compose, however, does not have adequate accessibility checking built into standard tools yet. There is no standard tool that properly checks `Modifier` chains for text scaling, touch targets, or complex semantics. This is the massive gap that `neighbor` fills.

We are building custom Android Lint rules specifically for Jetpack Compose. These rules are **directly adapted from `jsx-a11y` and our `neighbor` web rules**. We are simply translating web accessibility concepts into native Android concepts.

Look at [`NeighborLintDetector.kt`](./src/main/java/neighbor/android/lint/NeighborLintDetector.kt) for our new Android Lint rules. When finished, these rules will find:

| Rule | Adapted From | Why it's important | Default Severity |
| --- | --- | --- | --- |
| `ComposeAssertiveLiveRegion` | Web `aria-live="assertive"` | Assertive live regions aggressively flush the speech queue. Use `Polite` instead so users don't miss previous context. | Warning |
| `ComposeClickableNoOnClickLabel` | `neighbor/button-name` | `clickable()` needs an `onClickLabel` to explain what happens when activated (e.g., "Open settings"). | Warning |
| `ComposeClickableNoRole` | `jsx-a11y/aria-role` | `Modifier.clickable()` without a `role` leaves screen readers guessing. TalkBack will just say "double-tap to activate" with no context. | Warning |
| `ComposeClickableNotMerged` | Web `aria-labelledby` concepts | Clickable containers (like Rows) with multiple children (like an icon and text) will fragment TalkBack focus unless `mergeDescendants = true` is used. | Warning |
| `ComposeClickableText` | Web HTML semantics | Clickable `Text()` elements are handled poorly by some OEM screen readers. Wrap them in `TextButton` instead. | Warning |
| `ComposeContentViolation` | Textlint Jargon Rules | Hardcoding confusing CTAs ("click here") or ableist language directly into `contentDescription` is forbidden. Use descriptive actions. | Warning |
| `ComposeDynamicContentNoLiveRegion` | `jsx-a11y/aria-live` | When error messages or status text changes dynamically, screen readers need a `liveRegion` to announce the change. | Warning |
| `ComposeImageNoContentDescription` | `jsx-a11y/alt-text` | `Image()` and `Icon()` require a `contentDescription` parameter. Omitting it results in unpredictable TalkBack behavior. Pass `null` if decorative! | Warning |
| `ComposeInsufficientRippleFocus` | `stylelint-a11y/no-outline-none` | Android's default ripple has low contrast and is insufficient for keyboard focus visualization (WCAG 2.4.7 Focus Visible). | Warning |
| `ComposePointerInputNoSemantics` | `jsx-a11y/click-events-have-key-events` | Custom gestures via `pointerInput()` are completely invisible to keyboards and screen readers unless paired with a `semantics` block. | Warning |
| `ComposeRedundantContentDescription` | `jsx-a11y/redundant-alt` | Hardcoding roles ("button") or states ("enabled") into `contentDescription` creates confusing double-announcements. **Note: This rule also catches international dialect variants like "ticked/not ticked" (instead of "checked") to ensure global inclusion!** | Warning |
| `ComposeSmallTouchTarget` | WCAG 2.5.8 Target Size | Interactive elements must have a minimum touch target size of 48x48dp. | Warning |
| `ComposeStatefulNoStateDescription` | Web `aria-expanded` / state props | Stateful elements (expanded/collapsed) need a `stateDescription` so TalkBack can announce the current state. | Warning |
| `ComposeToggleableNoRole` | `jsx-a11y/aria-role` | `Modifier.toggleable()` needs a role (like Switch or Checkbox) so users know what state they are toggling. | Warning |
| `ComposeUnscalableTextUnit` | WCAG 1.4.4 Resize Text | Using `.dp` or `.px` instead of `.sp` prevents text from scaling with user settings. | Warning |
| `ComposeForcedLightMode` | WCAG 1.4.8 Visual Presentation | Disabling dark mode restricts usability for users with light sensitivity or photophobia. Avoid hardcoding `darkTheme = false`. | **Off** |

#### Customizing Severity

Just like ESLint, you can change these rules to **Error**, **Warning**, or **Off** in your `lint.xml` file depending on your team's needs. By default, all rules are set to Warning (except for `ComposeForcedLightMode` which is Off).

```xml
<lint>
    <!-- Turn a warning into an error -->
    <issue id="NeighborComposeClickableNoRole" severity="error" />
    
    <!-- Turn off a rule entirely -->
    <issue id="NeighborComposeDynamicContentNoLiveRegion" severity="ignore" />
</lint>
```

> [!NOTE]
> **Why not use the Accessibility Test Framework (ATF)?**
> [Google's ATF](https://github.com/google/Accessibility-Test-Framework-for-Android) is a great tool. It tests the app while it is running. But, like `@axe-core/react`, it needs a running app to work. `neighbor` finds problems *before* you run the app, while you write the code.

## Content Linting for Android

Most native linters ignore the actual words being presented to the user. `neighbor` changes this by bringing our web Content Linting strategy to Android.

### The Clean Way (Recommended)

You should never hardcode strings into your UI components (like `Text("Click here")`). Instead, extract them into `res/values/strings.xml`.
You can then run the `@a11yfred/neighbor/textlint` package directly against your `strings.xml` file. It will automatically scan your app's localization files for jargon, ableist language, and confusing CTAs.

### The Fallback Way

If a developer bypasses standard practices and hardcodes strings directly into `contentDescription` modifiers, the standard Android Lint `ComposeContentViolation` rule (documented above) will catch common violations like "click here", "swipe left", or ableist jargon directly in the code.

## How to Build (Future)

We have published these rules as a standard Android Lint module. You can build it by navigating to this directory and running:

```bash
./gradlew jar
```

This will produce a lint `.jar` file that you can include in your Android projects.

## More Reading

- [Appt.org - Android Accessibility](https://appt.org/en/docs/android/samples)
- [Google Developer Guide - Testing Accessibility](https://developer.android.com/guide/topics/ui/accessibility/testing)
- [Jetpack Compose Semantics](https://developer.android.com/jetpack/compose/semantics)
- [Google Accessibility Test Framework](https://github.com/google/Accessibility-Test-Framework-for-Android)
- [slack/compose-lints](https://github.com/slackhq/compose-lints) - Other Compose lint rules (not only for accessibility).
