# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2026-05-24

### Added

- **Remix 3 Support**: Added a dedicated ESLint configuration (`@a11yfred/neighbor/remix3`) that warns against `usePageTitle()` and hash router imports to ensure smooth transition to file-based routing.
- **Web Components / Vanilla HTML Support**: Added a dedicated ESLint configuration (`@a11yfred/neighbor/webcomponents`) and AST adapter utilizing `@html-eslint/parser` to natively lint vanilla HTML elements and Lit templates.
- **App Stubs**: Scaffolded workspace directories for `webapp`, `chrome-extension`, `firefox-extension`, and `electron-app`.

### Changed

- **Rule Severities**: All recommended framework ARIA rules and Vale content rules are now set to `'warn'` by default to reduce friction on initial adoption.
- **Rule Severities**: The `prefer-aria-disabled` rule is explicitly set to `'error'`, as previously documented.
- **Linter Dependencies**: Dropped `eslint-plugin-jsx-a11y` as a direct dependency. It is now an optional `peerDependency`, meaning teams using only Web Components or text linting aren't forced to install React accessibility rules. `eslint-plugin-vuejs-accessibility` and `@angular-eslint/eslint-plugin-template` have also been properly registered as optional.
- **Vale Configs**: Automatically generated and packaged the latest 10 content rules for `@a11yfred/vale-config-neighbor`.

## 1.1.0  -  2026-05-23

### Added

- **New rule:** `no-disabled-and-aria-disabled` — Elements with both `disabled` and `aria-disabled` attributes cause conflicting states in assistive tech

### Changed

- **Severity change:** `prefer-aria-disabled` moved from `off` to `error` by default to enforce discoverable form controls in tab order.

---

## 1.0.6  -  2026-05-13

### Changed

- **Documentation:** Add severity column to all rule tables in README
- **Docs cleanup:** Remove em dashes, fix MD036/MD040 markdownlint issues across all docs

### Fixed

- **`no-placeholder-only`**: no longer false-positives on `<input>` elements inside a `role="search"` landmark with an accessible name. The input is correctly labeled at the group level in that pattern.
- **`no-dialog-without-close`**: no longer false-positives on `role="dialog"` elements whose children are passed dynamically (`{children}`). When a close button cannot be statically detected, the rule skips rather than reporting.

---

## 1.0.0  -  2026-05-12

### Breaking change

CSS rules renamed from `ulam/` to `neighbor/` namespace:

| Old | New |
| --- | --- |
| `ulam/user-preferences` | `neighbor/user-preferences` |
| `ulam/no-outline-none` | `neighbor/no-outline-none` |
| `ulam/no-forced-colors-none` | `neighbor/no-forced-colors-none` |

Update your `.stylelintrc.json` to use the new names.

### Added

- **New rule:** `neighbor/no-forced-colors-none` — `forced-color-adjust: none` inside `@media (forced-colors)` actively opts out of Windows High Contrast Mode

- **New entry point:** `@a11yfred/neighbor/content` — An ESLint plugin for accessibility and inclusion problems in web and app copy. Lints string literals and JSX text in JS/TS/JSX/TSX files.

- **New content rules (all `warn`):**

| Rule | What it flags |
| --- | --- |
| `no-ableist-language` | Slurs, suffering-framing, and condescending euphemisms when writing about disability ("wheelchair-bound", "suffers from", "special needs", "differently abled") |
| `no-disability-metaphor` | Figurative uses of disability language ("blind spot", "tone deaf", "paralyzed by", "crippling debt") |
| `no-english-idiom` | English idioms and sports metaphors opaque to ESL and international readers ("slam dunk", "boil the ocean", "circle back", "touch base") |
| `no-vague-cta` | Vague link and button text ("click here", "read more", "here", "learn more") |
| `no-directional-language` | Layout-dependent position instructions ("see above", "in the right sidebar", "as shown below") |
| `no-unexplained-abbreviation` | Acronyms used without a prior expansion in the same file |
| `no-all-caps-prose` | ALL CAPS words that screen readers may spell out letter-by-letter |
| `no-vague-error-message` | Error messages that don't explain what went wrong ("An error occurred", "Something went wrong") |
| `no-ampersand-in-prose` | `&` in place of "and" in prose  -  announced inconsistently across AT vendors |

Rules are synthesised from 17 sources spanning W3C WAI, government plain language guides (US, UK, Australia, Canada), and disability language authorities (NCDJ, AP Stylebook, ADA National Network, APA Style, SIGACCESS). See [RULES-CONTENT.md](RULES-CONTENT.md) for full methodology and source citations.

- **New rule reference pages:** RULES.md is now an index. Full references split into:
  - [RULES-MARKUP.md](RULES-MARKUP.md)  -  ESLint markup rules
  - [RULES-CSS.md](RULES-CSS.md)  -  Stylelint CSS rules
  - [RULES-CONTENT.md](RULES-CONTENT.md)  -  content rules with sources and methodology

- **New entry point alias:** `@a11yfred/neighbor/stylelint` added as an explicit stylelint alias alongside the default export.

### Changed

- **Severity changes:** 10 rules moved from `warn` to `off` in the recommended config  -  they flag real problems but are too noisy for most codebases by default. All remain available to opt in individually:
  - `no-application-role`, `no-grid-role`, `no-aria-roledescription`, `no-aria-readonly`, `no-tab-without-controls`, `no-href-hash`, `warn-role-alert`, `prefer-aria-disabled`, `no-target-blank-without-label`, `no-dialog-without-close`
  - `no-tooltip-role-misuse` and `no-menu-role-on-nav` remain on as warns.

### Documentation

- WCAG SC and HTML spec links added throughout README and RULES.md
- CONTRIBUTING.md, PR template, and issue templates added
- README table of contents added
- @ulam described as a JavaScript framework (not React-based)

---

## 0.2.0  -  2026-05-12

### New rules

| Rule | What it catches |
| --- | --- |
| `no-labelledby-missing-target` | `aria-labelledby`/`describedby`/`controls`/`owns`/`activedescendant` referencing an `id` that doesn't exist in the file |
| `no-dynamic-content-without-live` | `dangerouslySetInnerHTML` / `v-html` / `[innerHTML]` on an element outside a live region |
| `form-field-multiple-labels` | Multiple `<label for="…">` elements targeting the same input |
| `no-empty-table-header` | `<th>` or `role="columnheader"/"rowheader"` with no accessible text |

All four rules run on React, Vue, and Angular.

### Extended rules

**`no-announce-in-render`** now runs in the Vue and Angular plugins, not just React. Safe contexts are tuned per framework  -  Vue recognises `onMounted`, `watch`, `watchEffect`, `nextTick`; Angular recognises `ngOnInit`, `ngAfterViewInit`, `ngOnChanges`, and class method event handlers.

### Setup improvements

README now includes correct parser snippets for Vue and Angular, and separate setup sections for Remix 2 and Remix 3.

---

## 0.1.0  -  2026-04-30

Initial release.
