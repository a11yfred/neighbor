# @A11yfred/neighbor: Rule Index

Neighbor has rules for four different areas. Each area has its own page.

| Area | Setup | Rules page |
| --- | --- | --- |
| HTML / Markup | `@a11yfred/neighbor/eslint`, `/eslint-vue`, `/eslint-angular`, `/webcomponents` | [RULES-MARKUP.md](RULES-MARKUP.md) |
| CSS | `@a11yfred/neighbor`, `@a11yfred/neighbor/stylelint` | [RULES-CSS.md](RULES-CSS.md) |
| Text / Content | `@a11yfred/neighbor/content` | [RULES-CONTENT.md](RULES-CONTENT.md) |
| Native Mobile | `apps/ios-app`, `apps/android-app` | [iOS Rules](apps/ios-app/README.md) / [Android Rules](apps/android-app/README.md) |

---

## Markup Rules: Summary

ESLint rules that find bad ARIA code, missing names, keyboard traps, and HTML mistakes in React, Vue, Angular, Lit, and plain HTML. Full list → [RULES-MARKUP.md](RULES-MARKUP.md)

**Errors (you must fix these):** `no-aria-label-on-generic`, `no-assertive-live-overuse`, `no-unblocked-aria-disabled`, `no-roles-without-name`, `no-group-without-name`, `no-presentation-on-focusable`, `no-log-with-interactive-children`, `no-aria-hidden-in-link`, `no-redundant-aria-hidden-with-presentation`, `no-aria-owns-on-void`, `no-title-as-label`, `no-tabs-without-structure`, `no-positive-tabindex`, `no-autoplay-without-controls`, `no-heading-inside-interactive`, `no-placeholder-only`, `no-empty-button`, `no-image-role-without-name`, `no-spinbutton-without-range`, `no-slider-without-range`, `no-combobox-without-expanded`, `no-mouse-only-events`, `no-listbox-without-option`, `no-tree-without-treeitem`, `no-feed-without-article`, `no-aria-activedescendant-without-id`, `no-duplicate-id`, `no-summary-without-details`, `no-aria-required-on-non-form`, `no-input-type-invalid`, `no-labelledby-missing-target`, `no-dynamic-content-without-live`, `form-field-multiple-labels`, `no-empty-table-header`, `no-disabled-and-aria-disabled`, `prefer-aria-disabled`

**Warnings (these are usually bad):** `no-tooltip-role-misuse`, `no-menu-role-on-nav`, `no-button-type-missing`

**Off by default (you can turn these on):** `no-application-role`, `no-grid-role`, `no-aria-roledescription`, `no-aria-readonly`, `no-tab-without-controls`, `no-href-hash`, `warn-role-alert`, `no-target-blank-without-label`, `no-dialog-without-close`

**Vue / Angular only:** `no-anchor-ambiguous-text`, `no-anchor-no-content`, `no-aria-activedescendant-no-tabindex`, `no-invalid-aria-prop-value`, `no-autocomplete-invalid`, `no-heading-no-content`, `no-iframe-no-title`, `no-img-redundant-alt`, `no-access-key`, `no-noninteractive-to-interactive-role`, `no-noninteractive-tabindex`, `prefer-semantic-element`, `no-role-supports-aria-props`, `no-scope-on-td`

**@ulam only:** `no-announce-in-render`, `no-hash-router-in-remix`, `no-use-page-title-in-remix`

---

## CSS Rules: Summary

Stylelint rules that find bad CSS. They check if you hide focus rings, block High Contrast Mode, or ignore user preferences for motion. Full list → [RULES-CSS.md](RULES-CSS.md)

| Rule | What it finds |
| --- | --- |
| `neighbor/no-forced-colors-none` | `forced-color-adjust: none` inside `@media (forced-colors)` - this blocks Windows High Contrast Mode |
| `neighbor/no-outline-none` | `outline: none` outside `:focus` - this removes keyboard focus rings |
| `neighbor/no-text-justify` | `text-align: justify` - this creates uneven word spacing that is hard for dyslexic users to read |
| `neighbor/no-absolute-viewport-text` | Pure viewport units (`vw`, `vh`) for text sizing - this stops browser zoom from working |
| `neighbor/no-user-select-all-none` | `user-select: none` on text - this stops users from highlighting, copying, and translating text |
| `neighbor/user-preferences` | Animation, motion, and transparency without `@media (prefers-*)` fallbacks |

---

## Content Rules: Summary

ESLint rules that find problems in your text. They check for ableist language, hard-to-understand English idioms, confusing links, and unexplained short words. Most terms within these rules are set to `warn` by default, but highly culturally specific regional terms and noisy rules (like unexplained abbreviations and typography formatting) are set to `off` by default. Full list → [RULES-CONTENT.md](RULES-CONTENT.md)

| Rule | What it finds | WCAG SC |
| --- | --- | --- |
| `no-ableist-language` | Offensive words about disability or framing disability as suffering ("wheelchair-bound", "suffers from", "special needs") | 3.1.1 |
| `no-disability-metaphor` | Using disability as a metaphor ("blind spot", "tone deaf", "paralyzed by") | - |
| `no-english-idiom` | Phrases or sports metaphors that are hard for non-native English speakers to understand ("slam dunk", "boil the ocean", "circle back") | 3.1.5 |
| `no-vague-cta` | Confusing link or button text ("click here", "read more", "here") | 2.4.4 |
| `no-directional-language` | Instructions based on where things are on the screen ("see above", "in the right sidebar") | 1.3.3 |
| `no-unexplained-abbreviation` | Short words or acronyms used before you explain what they mean (off by default) | 3.1.4 |
| `no-typography-in-prose` | Typography and casing issues: ALL CAPS words (read letter-by-letter) and ampersands (`&`) in prose (off by default) | - |
| `no-vague-error-message` | Error messages that do not explain what is wrong ("An error occurred") | 3.3.1 |
| `no-exclusive-language` | Tech jargon and culturally insensitive words (blacklist, master/slave, spirit animal) | - |
| `no-colonial-and-violent-language` | Words based on colonialism or violence (stakeholder, target population, tackle) | - |
| `no-deficit-language` | Words that reduce people to their bad situations (the homeless, inmate, addict) | - |
| `no-gendered-language` | Gendered pronouns when the gender is unknown (he/she, his or her, mum and dad) | - |
| `no-anti-lgbtq-language` | Old or offensive words about sexual orientation and gender | - |
| `no-device-specific-action` | Words that only make sense on a desktop computer ("click here", "press enter") | - |
| `no-cross-dialect-confusion` | Words causing confusion or inappropriate double entendre across English dialects ("pants", "cum") (off by default) | - |

---

## Native Mobile: Summary

`neighbor` includes strict rule implementations translated directly from our core web libraries for native iOS (SwiftUI) and Android (Jetpack Compose). They flag issues like missing Roles, unscaled text, broken touch targets, and improper semantics directly inside Xcode and Android Studio.

- **[iOS Rules](apps/ios-app/README.md):** 9 Custom SwiftLint Rules for SwiftUI (via `.swiftlint.yml`).
- **[Android Rules](apps/android-app/README.md):** 16 Custom Android Lint Rules for Jetpack Compose (via standard Gradle module).
