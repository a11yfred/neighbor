# @a11yfred/neighbor  -  Rule Index

Neighbor ships rules across three separate domains. Each has its own reference page.

| Domain | Entry point | Rules page |
| --- | --- | --- |
| Markup | `@a11yfred/neighbor/eslint`, `/eslint-vue`, `/eslint-angular` | [RULES-MARKUP.md](RULES-MARKUP.md) |
| CSS | `@a11yfred/neighbor` (default), `@a11yfred/neighbor/stylelint` | [RULES-CSS.md](RULES-CSS.md) |
| Content | `@a11yfred/neighbor/content` | [RULES-CONTENT.md](RULES-CONTENT.md) |

---

## Markup rules  -  summary

ESLint rules that flag bad ARIA patterns, missing accessible names, keyboard traps, and structural errors in JSX, Vue SFCs, and Angular templates. Full reference → [RULES-MARKUP.md](RULES-MARKUP.md)

**Errors (definite breakage):** `no-aria-label-on-generic`, `no-assertive-live-overuse`, `no-unblocked-aria-disabled`, `no-roles-without-name`, `no-group-without-name`, `no-presentation-on-focusable`, `no-log-with-interactive-children`, `no-aria-hidden-in-link`, `no-redundant-aria-hidden-with-presentation`, `no-aria-owns-on-void`, `no-title-as-label`, `no-tabs-without-structure`, `no-positive-tabindex`, `no-autoplay-without-controls`, `no-heading-inside-interactive`, `no-placeholder-only`, `no-empty-button`, `no-image-role-without-name`, `no-spinbutton-without-range`, `no-slider-without-range`, `no-combobox-without-expanded`, `no-mouse-only-events`, `no-listbox-without-option`, `no-tree-without-treeitem`, `no-feed-without-article`, `no-aria-activedescendant-without-id`, `no-duplicate-id`, `no-summary-without-details`, `no-aria-required-on-non-form`, `no-input-type-invalid`, `no-labelledby-missing-target`, `no-dynamic-content-without-live`, `form-field-multiple-labels`, `no-empty-table-header`, `no-disabled-and-aria-disabled`, `prefer-aria-disabled`

**Warnings (on by default):** `no-tooltip-role-misuse`, `no-menu-role-on-nav`, `no-button-type-missing`

**Off by default (opt in):** `no-application-role`, `no-grid-role`, `no-aria-roledescription`, `no-aria-readonly`, `no-tab-without-controls`, `no-href-hash`, `warn-role-alert`, `no-target-blank-without-label`, `no-dialog-without-close`

**Vue / Angular only:** `no-anchor-ambiguous-text`, `no-anchor-no-content`, `no-aria-activedescendant-no-tabindex`, `no-invalid-aria-prop-value`, `no-autocomplete-invalid`, `no-heading-no-content`, `no-iframe-no-title`, `no-img-redundant-alt`, `no-access-key`, `no-noninteractive-to-interactive-role`, `no-noninteractive-tabindex`, `prefer-semantic-element`, `no-role-supports-aria-props`, `no-scope-on-td`

**@ulam only:** `no-announce-in-render`, `no-hash-router-in-remix`, `no-use-page-title-in-remix`

---

## CSS rules  -  summary

Stylelint rules that flag CSS that removes focus indicators, opts out of High Contrast Mode, or fails to provide user-preference media query fallbacks. Full reference → [RULES-CSS.md](RULES-CSS.md)

| Rule | What it flags |
| --- | --- |
| `neighbor/user-preferences` | Animation, motion, and transparency without `@media (prefers-*)` fallbacks |
| `neighbor/no-outline-none` | `outline: none` outside `:focus` selectors  -  removes keyboard focus ring |
| `neighbor/no-forced-colors-none` | `forced-color-adjust: none` inside `@media (forced-colors)`  -  opts out of Windows High Contrast Mode |

---

## Content rules  -  summary

ESLint rules that flag accessibility and inclusion problems in string literals and JSX text  -  ableist language, disability metaphors, English idioms, vague link and button text, directional references, unexplained abbreviations, ALL CAPS prose, vague error messages, and exclusive/decolonized language. All ship as `warn`. Full reference → [RULES-CONTENT.md](RULES-CONTENT.md)

| Rule | What it flags | WCAG SC |
| --- | --- | --- |
| `no-ableist-language` | Slurs, suffering-framing, condescending euphemisms ("wheelchair-bound", "suffers from", "special needs") | 3.1.1 |
| `no-disability-metaphor` | Disability used figuratively ("blind spot", "tone deaf", "paralyzed by") | - |
| `no-english-idiom` | Idioms and sports metaphors opaque to ESL readers ("slam dunk", "boil the ocean", "circle back") | 3.1.5 |
| `no-vague-cta` | Vague link/button text ("click here", "read more", "here") | 2.4.4 |
| `no-directional-language` | Position-based instructions ("see above", "in the right sidebar") | 1.3.3 |
| `no-unexplained-abbreviation` | Acronyms used without prior expansion in the file | 3.1.4 |
| `no-all-caps-prose` | ALL CAPS words that screen readers may spell out letter-by-letter | - |
| `no-vague-error-message` | Error messages that don't say what went wrong ("An error occurred") | 3.3.1 |
| `no-ampersand-in-prose` | `&` in place of "and"  -  announced inconsistently by screen readers | - |
| `no-exclusive-language` | Tech jargon and culturally appropriated terms (blacklist, master/slave, spirit animal) | - |
| `no-colonial-and-violent-language` | Terms rooted in colonialism or violence (stakeholder, target population, tackle) | - |
| `no-deficit-language` | Language that reduces people to their circumstances (the homeless, inmate, addict) | - |
| `no-gendered-language` | Generic gendered pronouns (he/she, his or her, mum and dad) | - |
| `no-anti-lgbtq-language` | Outdated or pathologizing terms regarding sexual orientation and gender identity | - |
| `no-device-specific-action` | Device-specific input actions (click, tap, swipe) | - |
