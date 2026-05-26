# @a11yfred/neighbor: Rule Index

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

### The Gap We're Filling

While React has enjoyed excellent accessibility linting through `eslint-plugin-jsx-a11y`, other frameworks like Vue, Angular, and Lit have historically lagged behind. `neighbor` bridges this gap. We've taken the most critical checks—along with new, advanced anti-patterns—and built a suite of framework-agnostic ESLint rules that bring native web components and non-React frameworks to full parity. 

Beyond standard checks, `neighbor` looks for complex interactions that other tools miss: broken focus management during single-page app routing, components dropping ARIA properties, and improper live region implementations.

### Rule Development & Sources

Our markup rules are not based on opinion; they are synthesized directly from authoritative specifications and accessibility practitioners:

- **Specifications**: Directly mapped to [WCAG 2.1](https://www.w3.org/TR/WCAG21/) and [WCAG 2.2](https://www.w3.org/TR/WCAG22/) Success Criteria, the [WAI-ARIA 1.2 Specification](https://www.w3.org/TR/wai-aria-1.2/), and the [ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/).
- **Practitioners**: Based on documented research and edge-case discoveries from accessibility experts including Adrian Roselli, Scott O'Hara, Heydon Pickering, Marcy Sutton, Patrick Lauke, and Karl Groves.
- **Standards Integration**: Rule concepts originally spearheaded by Deque's `axe-core` and the `jsx-a11y` project were studied and reimplemented to work consistently across multiple framework ASTs (Vue templates, Angular templates, JSX, and Lit template literals).

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
