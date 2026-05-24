// neighbor — Android Accessibility Lint Detector
// Jetpack Compose - Custom Android Lint API (UAST / KtCallExpression)
//
// Part of @a11yfred/neighbor  |  github.com/a11yfred/neighbor
//
// Rules researched from:
//   - Google Android Accessibility docs  developer.android.com/guide/topics/ui/accessibility
//   - Appt Foundation                    appt.org/en/docs/android/samples
//   - Stack Overflow reports             stackoverflow.com (tagged: android accessibility, talkback)
//   - ProAndroidDev / Medium articles    2023-2024 Android a11y deep-dives
//   - Deque axe DevTools Mobile          deque.com/axe/mobile
//   - Android Lint built-in issues       source.android.com/docs/core/tests/development/lint
//   - WCAG 2.2                           w3.org/TR/WCAG22
//
// NOTE: This file is a WIP stub. The Issue definitions and detector structure
//       are complete and buildable with the Android Lint API. The UAST visitor
//       bodies are stubbed with TODO comments that document the exact detection
//       logic to implement.
//
// Build: com.android.tools.lint:lint-api (see README.md for Gradle config)

package neighbor.android.lint

import com.android.tools.lint.client.api.IssueRegistry
import com.android.tools.lint.detector.api.*
import org.jetbrains.uast.*

// ─── Issue Definitions ───────────────────────────────────────────────────────

val ISSUE_CLICKABLE_NO_ROLE = Issue.create(
    id = "NeighborComposeClickableNoRole",
    briefDescription = "Modifier.clickable() used without a Role",
    explanation = """
        TalkBack announces interactive elements by their role (Button, Checkbox, etc.).
        When `Modifier.clickable()` is used without specifying a `role`, TalkBack simply
        says "double-tap to activate" with no context. Voice Access users also rely on
        roles to generate labels for their grid overlay.

        Fix:
        ```kotlin
        Modifier.clickable(role = Role.Button) { /* action */ }
        ```

        **Source:** Android Accessibility docs, Appt.org, Stack Overflow
        **WCAG:** 4.1.2 Name, Role, Value
    """,
    category = Category.A11Y,
    priority = 8,
    severity = Severity.WARNING,
    implementation = Implementation(NeighborClickableRoleDetector::class.java, Scope.JAVA_FILE_SCOPE)
)

val ISSUE_POINTER_INPUT_NO_SEMANTICS = Issue.create(
    id = "NeighborComposePointerInputNoSemantics",
    briefDescription = "Modifier.pointerInput() used without a semantics{} block",
    explanation = """
        `Modifier.pointerInput()` defines custom gesture interactions that are completely
        invisible to TalkBack, Switch Access, and Voice Access unless paired with a
        `semantics {}` block that declares the equivalent accessibility action.

        Fix:
        ```kotlin
        Modifier
            .pointerInput(Unit) { detectTapGestures { /* ... */ } }
            .semantics { onClick(label = "Perform action") { true } }
        ```

        **Source:** ProAndroidDev, Android developer blog, Deque axe DevTools Mobile
        **WCAG:** 2.1.1 Keyboard, 4.1.2 Name, Role, Value
    """,
    category = Category.A11Y,
    priority = 9,
    severity = Severity.ERROR,
    implementation = Implementation(NeighborPointerInputSemanticsDetector::class.java, Scope.JAVA_FILE_SCOPE)
)

val ISSUE_IMAGE_NO_CONTENT_DESCRIPTION = Issue.create(
    id = "NeighborComposeImageNoContentDescription",
    briefDescription = "Image() or Icon() called without contentDescription",
    explanation = """
        `Image()` and `Icon()` composables require a `contentDescription` argument so
        TalkBack and VoiceOver can describe them to users. If the image is purely
        decorative, pass `contentDescription = null` explicitly to suppress screen
        reader focus. Omitting the argument entirely results in unpredictable AT behaviour.

        Fix:
        ```kotlin
        Image(painter, contentDescription = "User profile photo")  // meaningful
        Image(painter, contentDescription = null)                   // decorative
        ```

        **Source:** Google Lint check ContentDescription, Appt.org, Deque axe DevTools Mobile
        **WCAG:** 1.1.1 Non-text Content
    """,
    category = Category.A11Y,
    priority = 9,
    severity = Severity.ERROR,
    implementation = Implementation(NeighborImageContentDescriptionDetector::class.java, Scope.JAVA_FILE_SCOPE)
)

val ISSUE_TOGGLEABLE_NO_ROLE = Issue.create(
    id = "NeighborComposeToggleableNoRole",
    briefDescription = "Modifier.toggleable() or Modifier.selectable() used without a Role",
    explanation = """
        `Modifier.toggleable()` and `Modifier.selectable()` represent stateful interactions
        (on/off, selected). Without a `role` parameter, TalkBack cannot tell users what
        kind of control they are interacting with (Switch, Checkbox, RadioButton), and
        Switch Access cannot present the correct interaction hint.

        Fix:
        ```kotlin
        Modifier.toggleable(
            value = isChecked,
            role = Role.Switch,
            onValueChange = { isChecked = it }
        )
        ```

        **Source:** Stack Overflow (android accessibility), Android developer docs
        **WCAG:** 4.1.2 Name, Role, Value
    """,
    category = Category.A11Y,
    priority = 8,
    severity = Severity.WARNING,
    implementation = Implementation(NeighborToggleableRoleDetector::class.java, Scope.JAVA_FILE_SCOPE)
)

val ISSUE_CLICKABLE_NO_ON_CLICK_LABEL = Issue.create(
    id = "NeighborComposeClickableNoOnClickLabel",
    briefDescription = "Modifier.clickable() used without an onClickLabel",
    explanation = """
        The `onClickLabel` parameter of `Modifier.clickable()` provides a human-readable
        description of what happens when the user activates the element (e.g., "Open settings").
        Without it, TalkBack only says "double-tap to activate", Switch Access shows no
        action hint, and Voice Access may generate an unhelpful label from surrounding text.

        Fix:
        ```kotlin
        Modifier.clickable(onClickLabel = "Open settings") { /* action */ }
        ```

        **Source:** Appt.org Android samples, ProAndroidDev, Medium 2024
        **WCAG:** 2.4.4 Link Purpose, 4.1.2 Name, Role, Value
    """,
    category = Category.A11Y,
    priority = 5,
    severity = Severity.WARNING,
    implementation = Implementation(NeighborClickableOnClickLabelDetector::class.java, Scope.JAVA_FILE_SCOPE)
)

val ISSUE_DYNAMIC_CONTENT_NO_LIVE_REGION = Issue.create(
    id = "NeighborComposeDynamicContentNoLiveRegion",
    briefDescription = "Dynamic content updated without liveRegion semantics",
    explanation = """
        When content changes dynamically (e.g., error messages, loading states, count
        updates), screen readers need a `liveRegion` annotation to announce the change.
        Without it, TalkBack and VoiceOver users are never notified that the UI changed.

        Fix:
        ```kotlin
        Text(
            text = statusMessage,
            modifier = Modifier.semantics {
                liveRegion = LiveRegionMode.Polite
            }
        )
        ```

        **Source:** Android developer blog, Medium (Compose a11y), Deque axe DevTools Mobile
        **WCAG:** 4.1.3 Status Messages
    """,
    category = Category.A11Y,
    priority = 7,
    severity = Severity.WARNING,
    implementation = Implementation(NeighborDynamicContentLiveRegionDetector::class.java, Scope.JAVA_FILE_SCOPE)
)

val ISSUE_CUSTOM_CLICKABLE_NO_MERGE_DESCENDANTS = Issue.create(
    id = "NeighborComposeClickableNotMerged",
    briefDescription = "Clickable container without mergeDescendants = true",
    explanation = """
        When a container (Row, Column, Box) is made clickable but contains multiple
        child elements (text + icon, title + subtitle, etc.), TalkBack will navigate
        to each child individually unless `mergeDescendants = true` is set. This causes
        a fragmented, repetitive experience for TalkBack and Switch Access users.

        Fix:
        ```kotlin
        Row(
            modifier = Modifier
                .semantics(mergeDescendants = true) { }
                .clickable { /* action */ }
        ) {
            Icon(...)
            Text("Item label")
        }
        ```

        **Source:** Stack Overflow (most upvoted Compose a11y answers), ProAndroidDev
        **WCAG:** 1.3.1 Info and Relationships
    """,
    category = Category.A11Y,
    priority = 7,
    severity = Severity.WARNING,
    implementation = Implementation(NeighborClickableNotMergedDetector::class.java, Scope.JAVA_FILE_SCOPE)
)

val ISSUE_STATE_NO_STATE_DESCRIPTION = Issue.create(
    id = "NeighborComposeStatefulNoStateDescription",
    briefDescription = "Stateful Modifier used without stateDescription in semantics",
    explanation = """
        Components with custom states (expanded/collapsed, loading/loaded, enabled/disabled)
        should declare `stateDescription` in their `semantics {}` block so TalkBack can
        announce the current state. Without it, users only hear the element label with
        no state context — particularly broken for external keyboard and Switch Access users.

        Fix:
        ```kotlin
        Modifier.semantics {
            stateDescription = if (isExpanded) "Expanded" else "Collapsed"
        }
        ```

        **Source:** Android Accessibility docs, Medium 2024 (Compose state semantics)
        **WCAG:** 4.1.2 Name, Role, Value
    """,
    category = Category.A11Y,
    priority = 6,
    severity = Severity.WARNING,
    implementation = Implementation(NeighborStateDescriptionDetector::class.java, Scope.JAVA_FILE_SCOPE)
)

val ISSUE_INSUFFICIENT_RIPPLE_FOCUS = Issue.create(
    id = "NeighborComposeInsufficientRippleFocus",
    briefDescription = "Default ripple effect is insufficient for keyboard focus",
    explanation = """
        Android's default ripple effect is often insufficient as a keyboard focus indicator because
        it relies on a subtle background color change with low contrast. This violates WCAG guidelines
        for Focus Visible. You should provide a custom `Indication` with a high-contrast focus border,
        or explicitly override `LocalIndication` globally and suppress this warning.

        Fix:
        ```kotlin
        Modifier.clickable(indication = myHighContrastFocusIndication) { /* action */ }
        ```

        **Source:** Web stylelint-a11y/no-outline-none adaptation, WCAG guidelines
        **WCAG:** 2.4.7 Focus Visible, 1.4.11 Non-text Contrast
    """,
    category = Category.A11Y,
    priority = 8,
    severity = Severity.WARNING,
    implementation = Implementation(NeighborInsufficientRippleFocusDetector::class.java, Scope.JAVA_FILE_SCOPE)
)

val ISSUE_REDUNDANT_CONTENT_DESCRIPTION = Issue.create(
    id = "NeighborComposeRedundantContentDescription",
    briefDescription = "ContentDescription contains hardcoded states or roles",
    explanation = """
        Screen readers announce roles and states natively in the user's preferred language and dialect
        (e.g. Indian English TalkBack says "ticked" instead of "checked"). Hardcoding words like "button",
        "checkbox", "enabled", or "ticked" inside `contentDescription` creates confusing
        double-announcements and breaks localization. State should use `stateDescription` and roles
        should use the `role` parameter.

        Fix:
        ```kotlin
        // Bad
        Image(contentDescription = "Bluetooth, enabled")

        // Good
        Image(
            contentDescription = "Bluetooth",
            modifier = Modifier.semantics { stateDescription = "enabled" }
        )
        ```

        **Source:** jsx-a11y/redundant-alt, Android OEM compat guidelines
        **WCAG:** 1.3.1 Info and Relationships, 4.1.2 Name, Role, Value
    """,
    category = Category.A11Y,
    priority = 7,
    severity = Severity.WARNING,
    implementation = Implementation(NeighborRedundantContentDescriptionDetector::class.java, Scope.JAVA_FILE_SCOPE)
)

val ISSUE_ASSERTIVE_LIVE_REGION = Issue.create(
    id = "NeighborComposeAssertiveLiveRegion",
    briefDescription = "Assertive live regions drop previous announcements",
    explanation = """
        Assertive live regions flush the speech queue. On heavily customized Android OEM
        devices, this can drop important previous announcements. You should use `LiveRegionMode.Polite`
        unless it is an absolute emergency (like a ringing phone or critical security alert).

        Fix:
        ```kotlin
        Modifier.semantics { liveRegion = LiveRegionMode.Polite }
        ```

        **Source:** OEM Screen Reader Compat guidelines
        **WCAG:** 4.1.3 Status Messages
    """,
    category = Category.A11Y,
    priority = 5,
    severity = Severity.WARNING,
    implementation = Implementation(NeighborAssertiveLiveRegionDetector::class.java, Scope.JAVA_FILE_SCOPE)
)

val ISSUE_CLICKABLE_TEXT = Issue.create(
    id = "NeighborComposeClickableText",
    briefDescription = "Clickable Modifier applied directly to Text",
    explanation = """
        Many OEM screen readers handle bare clickable text differently than true buttons.
        Wrapping text in a `TextButton` or `Surface` ensures better native focus bounds
        and semantic treatment.

        Fix:
        ```kotlin
        TextButton(onClick = { /* action */ }) {
            Text("Click me")
        }
        ```

        **Source:** Android Developer guidelines, OEM Compat
        **WCAG:** 4.1.2 Name, Role, Value
    """,
    category = Category.A11Y,
    priority = 6,
    severity = Severity.WARNING,
    implementation = Implementation(NeighborClickableTextDetector::class.java, Scope.JAVA_FILE_SCOPE)
)

val ISSUE_FORCED_LIGHT_MODE = Issue.create(
    id = "NeighborComposeForcedLightMode",
    briefDescription = "Dark mode support is explicitly disabled",
    explanation = """
        Forcing an app or screen into Light Mode prevents users from using Dark Mode, which is
        essential for users with light sensitivity, photophobia, or certain visual impairments.
        Avoid hardcoding `darkTheme = false` in your theme wrappers.

        Fix:
        ```kotlin
        // Use the system preference
        MyTheme(darkTheme = isSystemInDarkTheme()) { ... }
        ```

        **Source:** WCAG Accessibility best practices
        **WCAG:** 1.4.8 Visual Presentation
    """,
    category = Category.A11Y,
    priority = 4,
    severity = Severity.WARNING,
    implementation = Implementation(NeighborForcedLightModeDetector::class.java, Scope.JAVA_FILE_SCOPE)
).setEnabledByDefault(false)

val ISSUE_HARDCODED_CONTENT_VIOLATION = Issue.create(
    id = "NeighborComposeContentViolation",
    briefDescription = "ContentDescription contains confusing CTAs or jargon",
    explanation = """
        Avoid hardcoding confusing directional CTAs (like "click here", "tap here") or
        ableist jargon into `contentDescription`. Screen reader users need descriptive actions
        that explain what the element does, not how to physically interact with it.

        Ideally, all copy should be placed in `strings.xml` and checked by `@a11yfred/neighbor/textlint`.

        **Source:** Content linting best practices
        **WCAG:** 3.1.5 Reading Level, 3.3.2 Labels or Instructions
    """,
    category = Category.A11Y,
    priority = 6,
    severity = Severity.WARNING,
    implementation = Implementation(NeighborContentViolationDetector::class.java, Scope.JAVA_FILE_SCOPE)
)

val ISSUE_UNSCALABLE_TEXT_UNIT = Issue.create(
    id = "NeighborComposeUnscalableTextUnit",
    briefDescription = "Using dp or px instead of sp for text sizing",
    explanation = """
        When setting `fontSize` or `lineHeight` in Compose, using `.dp` or `.px` prevents
        the text from scaling when the user changes their system font size preferences. This
        violates WCAG guidelines for resizable text. Always use `.sp` (scalable pixels) for text.

        Fix:
        ```kotlin
        Text("Hello", fontSize = 16.sp) // Good
        ```

        **Source:** Android SpUsage Lint Check
        **WCAG:** 1.4.4 Resize Text
    """,
    category = Category.A11Y,
    priority = 8,
    severity = Severity.ERROR,
    implementation = Implementation(NeighborUnscalableTextDetector::class.java, Scope.JAVA_FILE_SCOPE)
)

val ISSUE_SMALL_TOUCH_TARGET = Issue.create(
    id = "NeighborComposeSmallTouchTarget",
    briefDescription = "Interactive element has a touch target smaller than 48dp",
    explanation = """
        Interactive elements (like buttons or clickable modifiers) must have a minimum touch
        target size of 48x48dp to ensure they are easily tappable by users with motor impairments.
        Avoid overriding `Modifier.size()` to values smaller than 48dp on clickable elements.

        **Source:** Android Accessibility Guidelines
        **WCAG:** 2.5.8 Target Size (Minimum)
    """,
    category = Category.A11Y,
    priority = 7,
    severity = Severity.WARNING,
    implementation = Implementation(NeighborSmallTouchTargetDetector::class.java, Scope.JAVA_FILE_SCOPE)
)

// ─── Detector Stubs ──────────────────────────────────────────────────────────
// Each detector body is stubbed. The TODO comments document the exact UAST
// traversal logic needed to implement the detection.

class NeighborClickableRoleDetector : Detector(), SourceCodeScanner {
    override fun getApplicableUastTypes() = listOf(UCallExpression::class.java)
    override fun createUastHandler(context: JavaContext) = object : UElementHandler() {
        override fun visitCallExpression(node: UCallExpression) {
            if (node.methodName != "clickable") return
            // TODO: resolve() → confirm it's androidx.compose.foundation.clickable
            // TODO: check valueArguments for a named arg "role"
            // TODO: if absent → context.report(ISSUE_CLICKABLE_NO_ROLE, node, ...)
        }
    }
}

class NeighborPointerInputSemanticsDetector : Detector(), SourceCodeScanner {
    override fun getApplicableUastTypes() = listOf(UCallExpression::class.java)
    override fun createUastHandler(context: JavaContext) = object : UElementHandler() {
        override fun visitCallExpression(node: UCallExpression) {
            if (node.methodName != "pointerInput") return
            // TODO: Walk the parent UQualifiedReferenceExpression (Modifier chain)
            // TODO: Check if any sibling call in the chain is "semantics"
            // TODO: if no semantics sibling → context.report(ISSUE_POINTER_INPUT_NO_SEMANTICS, ...)
        }
    }
}

class NeighborImageContentDescriptionDetector : Detector(), SourceCodeScanner {
    override fun getApplicableUastTypes() = listOf(UCallExpression::class.java)
    override fun createUastHandler(context: JavaContext) = object : UElementHandler() {
        override fun visitCallExpression(node: UCallExpression) {
            if (node.methodName != "Image" && node.methodName != "Icon") return
            // TODO: resolve() → confirm it's androidx.compose.foundation.Image / material Icon
            // TODO: check valueArguments for named arg "contentDescription"
            //       Note: null is acceptable (decorative) but the arg must be PRESENT
            // TODO: if arg is absent entirely → context.report(ISSUE_IMAGE_NO_CONTENT_DESCRIPTION, ...)
        }
    }
}

class NeighborToggleableRoleDetector : Detector(), SourceCodeScanner {
    override fun getApplicableUastTypes() = listOf(UCallExpression::class.java)
    override fun createUastHandler(context: JavaContext) = object : UElementHandler() {
        override fun visitCallExpression(node: UCallExpression) {
            if (node.methodName != "toggleable" && node.methodName != "selectable") return
            // TODO: check valueArguments for named arg "role"
            // TODO: if absent → context.report(ISSUE_TOGGLEABLE_NO_ROLE, ...)
        }
    }
}

class NeighborClickableOnClickLabelDetector : Detector(), SourceCodeScanner {
    override fun getApplicableUastTypes() = listOf(UCallExpression::class.java)
    override fun createUastHandler(context: JavaContext) = object : UElementHandler() {
        override fun visitCallExpression(node: UCallExpression) {
            if (node.methodName != "clickable") return
            // TODO: check valueArguments for named arg "onClickLabel"
            // TODO: if absent → context.report(ISSUE_CLICKABLE_NO_ON_CLICK_LABEL, ...)
        }
    }
}

class NeighborDynamicContentLiveRegionDetector : Detector(), SourceCodeScanner {
    override fun getApplicableUastTypes() = listOf(UCallExpression::class.java)
    override fun createUastHandler(context: JavaContext) = object : UElementHandler() {
        override fun visitCallExpression(node: UCallExpression) {
            // TODO: Heuristic - look for Text() composable whose `text` arg is a non-literal
            //       (i.e. a variable reference or expression, suggesting dynamic content)
            // TODO: Walk the Modifier chain for a .semantics { liveRegion = ... } call
            // TODO: if absent → context.report(ISSUE_DYNAMIC_CONTENT_NO_LIVE_REGION, ...)
            //       Note: High false-positive risk. Restrict to Text() calls where the text
            //             arg is a MutableState read (e.g. remember { mutableStateOf("") }.value)
        }
    }
}

class NeighborClickableNotMergedDetector : Detector(), SourceCodeScanner {
    override fun getApplicableUastTypes() = listOf(UCallExpression::class.java)
    override fun createUastHandler(context: JavaContext) = object : UElementHandler() {
        override fun visitCallExpression(node: UCallExpression) {
            if (node.methodName != "clickable") return
            // TODO: Walk the parent composable call to check if it has multiple child
            //       composable children (Row/Column/Box with 2+ children)
            // TODO: Traverse the Modifier chain to check for semantics(mergeDescendants = true)
            // TODO: if clickable container has 2+ children and no mergeDescendants
            //       → context.report(ISSUE_CUSTOM_CLICKABLE_NO_MERGE_DESCENDANTS, ...)
        }
    }
}

class NeighborStateDescriptionDetector : Detector(), SourceCodeScanner {
    override fun getApplicableUastTypes() = listOf(UCallExpression::class.java)
    override fun createUastHandler(context: JavaContext) = object : UElementHandler() {
        override fun visitCallExpression(node: UCallExpression) {
            // TODO: Heuristic - look for Modifier.clickable or toggleable where a boolean
            //       state variable is passed (suggesting stateful behaviour)
            // TODO: Walk modifier chain to check for semantics { stateDescription = ... }
            // TODO: if stateful clickable without stateDescription
            //       → context.report(ISSUE_STATE_NO_STATE_DESCRIPTION, ...)
        }
    }
}

class NeighborInsufficientRippleFocusDetector : Detector(), SourceCodeScanner {
    override fun getApplicableUastTypes() = listOf(UCallExpression::class.java)
    override fun createUastHandler(context: JavaContext) = object : UElementHandler() {
        override fun visitCallExpression(node: UCallExpression) {
            if (node.methodName != "clickable" && node.methodName != "toggleable" && node.methodName != "selectable") return
            // TODO: Check if the `indication` argument is explicitly provided.
            // TODO: If absent, flag ISSUE_INSUFFICIENT_RIPPLE_FOCUS (Warning).
        }
    }
}

class NeighborRedundantContentDescriptionDetector : Detector(), SourceCodeScanner {
    override fun getApplicableUastTypes() = listOf(UCallExpression::class.java)
    override fun createUastHandler(context: JavaContext) = object : UElementHandler() {
        override fun visitCallExpression(node: UCallExpression) {
            // TODO: Check arguments named `contentDescription` in Image, Icon, or semantics block.
            // TODO: If the string contains "button", "checkbox", "radio", "switch", "link",
            //       "enabled", "disabled", "checked", "selected", "ticked", "unticked", "dimmed",
            //       or "toggle" (case-insensitive to catch English dialect variants),
            //       flag ISSUE_REDUNDANT_CONTENT_DESCRIPTION.
        }
    }
}

class NeighborAssertiveLiveRegionDetector : Detector(), SourceCodeScanner {
    override fun getApplicableUastTypes() = listOf(UCallExpression::class.java)
    override fun createUastHandler(context: JavaContext) = object : UElementHandler() {
        override fun visitCallExpression(node: UCallExpression) {
            // TODO: Look for assignments to `liveRegion` property in a semantics block.
            // TODO: If assigned `LiveRegionMode.Assertive`, flag ISSUE_ASSERTIVE_LIVE_REGION.
        }
    }
}

class NeighborClickableTextDetector : Detector(), SourceCodeScanner {
    override fun getApplicableUastTypes() = listOf(UCallExpression::class.java)
    override fun createUastHandler(context: JavaContext) = object : UElementHandler() {
        override fun visitCallExpression(node: UCallExpression) {
            if (node.methodName != "Text") return
            // TODO: Check the modifier chain of the Text composable.
            // TODO: If it contains `.clickable()`, flag ISSUE_CLICKABLE_TEXT.
        }
    }
}

class NeighborForcedLightModeDetector : Detector(), SourceCodeScanner {
    override fun getApplicableUastTypes() = listOf(UCallExpression::class.java)
    override fun createUastHandler(context: JavaContext) = object : UElementHandler() {
        override fun visitCallExpression(node: UCallExpression) {
            // TODO: Look for Theme composable calls (e.g. MaterialTheme, or custom themes)
            // TODO: If `darkTheme` parameter is explicitly passed as `false` instead of
            //       dynamically reading `isSystemInDarkTheme()`, flag ISSUE_FORCED_LIGHT_MODE.
            // Note: This rule is disabled by default.
        }
    }
}

class NeighborContentViolationDetector : Detector(), SourceCodeScanner {
    override fun getApplicableUastTypes() = listOf(UCallExpression::class.java)
    override fun createUastHandler(context: JavaContext) = object : UElementHandler() {
        override fun visitCallExpression(node: UCallExpression) {
            // TODO: Check arguments named `contentDescription`.
            // TODO: Scan string literals for words like "click here", "tap here", "swipe left",
            //       "swipe right", "blind to", "crazy", "insane", "dumb", "crippled".
            // TODO: If found, flag ISSUE_HARDCODED_CONTENT_VIOLATION.
        }
    }
}

class NeighborUnscalableTextDetector : Detector(), SourceCodeScanner {
    override fun getApplicableUastTypes() = listOf(UCallExpression::class.java)
    override fun createUastHandler(context: JavaContext) = object : UElementHandler() {
        override fun visitCallExpression(node: UCallExpression) {
            // TODO: Check assignments to `fontSize` or `lineHeight` in Text() calls.
            // TODO: If the unit is `.dp` or `.px`, flag ISSUE_UNSCALABLE_TEXT_UNIT.
        }
    }
}

class NeighborSmallTouchTargetDetector : Detector(), SourceCodeScanner {
    override fun getApplicableUastTypes() = listOf(UCallExpression::class.java)
    override fun createUastHandler(context: JavaContext) = object : UElementHandler() {
        override fun visitCallExpression(node: UCallExpression) {
            // TODO: Look for `.size(x.dp)`, `.height(x.dp)`, or `.width(x.dp)` modifiers
            //       where x < 48f, AND the element is clickable/toggleable/selectable.
            // TODO: Flag ISSUE_SMALL_TOUCH_TARGET.
        }
    }
}

// ─── Issue Registry ───────────────────────────────────────────────────────────

class NeighborIssueRegistry : IssueRegistry() {
    override val issues = listOf(
        ISSUE_CLICKABLE_NO_ROLE,
        ISSUE_POINTER_INPUT_NO_SEMANTICS,
        ISSUE_IMAGE_NO_CONTENT_DESCRIPTION,
        ISSUE_TOGGLEABLE_NO_ROLE,
        ISSUE_CLICKABLE_NO_ON_CLICK_LABEL,
        ISSUE_DYNAMIC_CONTENT_NO_LIVE_REGION,
        ISSUE_CUSTOM_CLICKABLE_NO_MERGE_DESCENDANTS,
        ISSUE_STATE_NO_STATE_DESCRIPTION,
        ISSUE_INSUFFICIENT_RIPPLE_FOCUS,
        ISSUE_REDUNDANT_CONTENT_DESCRIPTION,
        ISSUE_ASSERTIVE_LIVE_REGION,
        ISSUE_CLICKABLE_TEXT,
        ISSUE_FORCED_LIGHT_MODE,
        ISSUE_HARDCODED_CONTENT_VIOLATION,
        ISSUE_UNSCALABLE_TEXT_UNIT,
        ISSUE_SMALL_TOUCH_TARGET,
    )
    override val api = CURRENT_API
}
