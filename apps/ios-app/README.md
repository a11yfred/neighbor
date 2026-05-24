# neighbor - iOS App (Work in Progress)

> [!WARNING]
> **Work in Progress**
> This directory is a starting point for testing iOS accessibility in the `neighbor` project. It is not a complete Xcode project yet.

This folder shows how `neighbor` checks native iOS apps (built with SwiftUI) for accessibility mistakes before you even run your code.

We use **SwiftLint** to enforce accessibility rules directly in your Xcode project. `neighbor` provides a set of custom regex-based SwiftLint rules that catch common accessibility mistakes in SwiftUI views.

## What rules are checked?

These rules are fundamentally the same concepts as the web. They are **directly adapted from the same principles as `jsx-a11y` and `neighbor` web rules**, translating web accessibility into native iOS concepts:

| iOS SwiftUI Concept | Adapted Web Rule | Why it is important |
| --- | --- | --- |
| **Focus Effect Disabled** | `stylelint-a11y/no-outline-none` | Removing `.focusEffectDisabled()` removes the tvOS/iPadOS focus ring, which hurts keyboard users. |
| **Missing Accessibility Label** (`.accessibilityLabel`) | `jsx-a11y/alt-text` or missing `aria-label` | Images or custom views without labels cannot be announced by VoiceOver. |
| **Missing Accessibility Traits** (`.accessibilityAddTraits`) | `jsx-a11y/aria-role` | Interactive elements need traits (like `.isButton`) so VoiceOver knows how to interact with them. |
| **Missing Accessibility Value** (`.accessibilityValue`) | `aria-valuenow` | Sliders and progress bars need to announce their current value. |
| **Redundant Hidden/Decorative** | `neighbor/no-redundant-aria-hidden-with-presentation` | Mixing `Image(decorative:)` with `.accessibilityHidden(true)` is confusing and redundant. |

## Neighbor Custom SwiftLint Rules

To catch bad habits-like typing the word "button" into a label-`neighbor` gives you a custom set of **SwiftLint** rules.

You can find these custom rules inside the [`.swiftlint.yml`](./.swiftlint.yml) file in this folder. All of our custom rules are set to **Warning** by default.

### Custom Rules Included

| Rule Name | What it catches | Why it's important | Default |
| --- | --- | --- | --- |
| `disabled_focus_effect` | `.focusEffectDisabled()` | Disabling the focus effect hurts keyboard users on tvOS/iPadOS. Custom high-contrast borders must be provided. | Warning |
| `hardcoded_content_violation` | Hardcoded CTAs ("click here") or ableist jargon in `.accessibilityLabel()`. | Enforces inclusive language and descriptive actions directly in UI code. | Warning |
| `hardcoded_font_size` | `.font(.system(size:)` | Hardcoded system sizes do not scale with Dynamic Type. Use semantic sizes (like `.body`) instead (WCAG 1.4.4 Resize Text). | Warning |
| `redundant_accessibility_hidden` | `Image(decorative:)` combined with `.accessibilityHidden(true)`. | Using both modifiers to hide an image is confusing code duplication. | Warning |
| `redundant_accessibility_label` | Hardcoded roles ("button") or states ("enabled") inside `.accessibilityLabel()`. | VoiceOver says traits out loud automatically. Hardcoding them causes double-announcements (e.g. "Submit button, Button"). **Note: This rule also catches international dialect variants like "ticked/not ticked" (instead of "checked") to ensure global inclusion!** | Warning |
| `restrictive_orientation_lock` | Programmatic orientation locks (e.g. `interfaceOrientations: .portrait`). | WCAG SC 1.3.4 (Orientation) requires supporting both portrait and landscape modes unless strictly essential, ensuring usability for wheelchair-mounted devices. | Warning |
| `small_touch_target` | `.frame(width/height: < 44)` | Interactive elements must be at least 44x44pt (WCAG 2.5.8 Target Size). | Warning |
| `text_fixed_size` | `.fixedSize()` applied to text | Prevents text from wrapping/expanding when users increase font size, causing truncation (WCAG 1.4.4 Resize Text). | Warning |
| `forced_light_mode` | `.preferredColorScheme(.light)` | Forcing light mode overrides system settings and prevents use of Dark Mode, which is essential for users with photophobia or light sensitivity. | **Off** |

### How to install and change severity

If you already use SwiftLint in your iOS app, just copy the `custom_rules` block from our `.swiftlint.yml` file and paste it into your own project's `.swiftlint.yml` file.

To change a rule's severity from Warning to Error (or to turn it off completely), just edit the `severity` line inside your config file:

```yaml
  redundant_accessibility_label:
    name: "Redundant Accessibility Label"
    regex: '...'
    severity: error # Change this from warning to error
```

## Content Linting for iOS

Most native linters ignore the actual words being presented to the user. `neighbor` changes this by bringing our web Content Linting strategy to iOS.

### The Clean Way (Recommended)

You should never hardcode strings into your UI components. Instead, extract them into `Localizable.strings` or `Localizable.xcstrings`.
You can then run the `@a11yfred/neighbor/textlint` package directly against your localized string files. It will automatically scan your app's translation catalogs for jargon, ableist language, and confusing CTAs.

### The Fallback Way

If a developer bypasses standard practices and hardcodes strings directly into `.accessibilityLabel()` modifiers, the `hardcoded_content_violation` SwiftLint rule (documented above) acts as a safety net to catch common violations directly in the code.
