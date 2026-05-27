# Changelog

<!-- markdownlint-disable MD024 -->

All notable changes to this project will be documented in this file.

## [2.2.1] - 2026-05-27

### Refactored

- **Rules Optimization**: Cleaned up unused helper functions (`hasDisabledInAncestors` and `hasAriaDisabledInAncestors`) in the `@ulam` rules implementation (`ulam-rules.js`).

## [2.2.0] - 2026-05-26

### Documentation

- **README Rewrite**: Reframed the README to emphasize `neighbor` as a comprehensive, cross-platform accessibility ecosystem rather than just a gap-filler.
- **Framework Selling Points**: Added explicit context to the Vue and Angular setup sections explaining how their standard accessibility plugins lag behind React, and how `neighbor` bridges that gap.
- **Rules Formatting**: Moved "Sources and Credits" tables to the bottom of `RULES-MARKUP.md`, `RULES-CSS.md`, and `RULES-CONTENT.md` for better readability, adding anchor links and collapsible abbreviations.
- **Ecosystem Updates**: Linked Vale package, marked native iOS and Android tools as WIP, and added Browser Extensions and Desktop App to the in-works list.

## [2.1.1] - 2026-05-25

### Changed

- **Publish Workflow**: Fixed npm publish workflow to include all packages and allow manual triggers.
- **Documentation**: Lowercased `@a11yfred` mentions across documentation.

## [2.1.0] - 2026-05-25

### Added

- **Vale Configuration**: Added initial Vale configuration file (`vale.ini`).

### Changed

- **Housekeeping**: Monorepo cleanup, including removing tracked turbo caches, removing vendored `uri-js`, and normalizing CRLF to LF.
- **Dependencies**: Configured Dependabot and updated npm, turbo, and other dependencies to resolve security vulnerabilities.
- **CI/CD**: Refactored CodeQL workflows to prevent duplicate scanning and exclude `node_modules`. Added npm install and build steps to publish workflow.

## [2.0.1] - 2026-05-24

### Added

- **Neighbor Web App**: Created the standalone web application (`apps/webapp`) using `@ulam/ube` and rules integration for live testing.
- **GitHub Pages**: Added deployment workflow and relative base path configuration to automatically publish the web app.

### Changed

- **Web App Enhancements**: Adopted system theme, improved mobile layout (stacked editor with scroll limits, resolved height collapse), and polished general UI (drawers, headers, persistent sidebar).
- **Refactoring**: Improved code structure for readability and maintainability.

## [2.0.0] - 2026-05-24

### Added

- **Native iOS Linting (SwiftUI)**: 9 custom SwiftLint rules for SwiftUI accessibility, distributed via `.swiftlint.yml`. Checks for disabled focus effects, hardcoded font sizes, redundant accessibility labels, small touch targets, restrictive orientation locks, and more. See [apps/ios-app/README.md](apps/ios-app/README.md).
- **Native Android Linting (Jetpack Compose)**: 8 custom Android Lint detector rules for Jetpack Compose, distributed as a standard Gradle lint module. Checks for missing `contentDescription`, hardcoded `sp` text, small touch targets, missing `stateDescription`, `pointerInput` without semantics, disabled traversal groups, restrictive orientation, and forced light mode. See [apps/android-app/README.md](apps/android-app/README.md).
- **Microsoft Word Add-in**: An Office.js add-in that checks Word documents for exclusionary and ableist language while you type. Built with React, Fluent UI, and Vite. See [apps/word-addin/README.md](apps/word-addin/README.md).
- **New Stylelint Rules**:
  - `neighbor/no-text-justify` (error): Disallows `text-align: justify` which creates uneven word spacing that is hard for dyslexic users to read (SC 1.4.8).
  - `neighbor/no-absolute-viewport-text` (warn): Warns on pure viewport units (`vw`, `vh`) for text sizing which block browser zoom (SC 1.4.4).
  - `neighbor/no-user-select-all-none` (warn): Warns on `user-select: none` which prevents text selection and translation (SC 1.4.4).
- **New Content Rules**:
  - `no-exclusive-language`: Tech jargon and culturally appropriated terms (blacklist, master/slave, sanity check, spirit animal).
  - `no-colonial-and-violent-language`: Words rooted in colonialism or violence applied to people (stakeholder, target population, tackle).
  - `no-deficit-language`: Words that reduce people to their circumstances (the homeless, inmate, addict, at-risk youth).
  - `no-gendered-language`: Gendered pronouns when gender is unknown (he/she, his or her, mum and dad).
  - `no-anti-lgbtq-language`: Outdated or pathologizing terms about sexual orientation and gender identity.
  - `no-device-specific-action`: Device-specific input actions (click, tap, swipe).
- **New Markup Rules**:
  - `vue-router-focus-management` (off): Warns if a Vue Router view transition happens without managing focus.
  - `react-spa-focus-management` (warn): Warns if a React Router or Remix transition happens without managing focus.
- **Remix 3 Support**: Added a dedicated ESLint configuration (`@a11yfred/neighbor/remix3`) for file-based routing.
- **Web Components / Vanilla HTML Support**: Added a dedicated ESLint configuration (`@a11yfred/neighbor/webcomponents`) using `@html-eslint/parser`.
- **App Stubs**: Scaffolded workspace directories for `webapp`, `chrome-extension`, `firefox-extension`, and `electron-app`.
- **Vale Dictionary**: Compiled Vale-compatible dictionary containing textlint content vocabulary for standalone Markdown checking.

### Changed

- **Rule Severities**: All recommended framework ARIA rules and Vale content rules are now set to `warn` by default to reduce friction on initial adoption.
- **Rule Severities**: The `prefer-aria-disabled` rule is explicitly set to `error`, as previously documented.
- **Linter Dependencies**: Dropped `eslint-plugin-jsx-a11y` as a direct dependency. It is now an optional `peerDependency`, meaning teams using only Web Components or text linting are not forced to install React accessibility rules. `eslint-plugin-vuejs-accessibility` and `@angular-eslint/eslint-plugin-template` have also been properly registered as optional.
- **Vale Configs**: Automatically generated and packaged the latest content rules for `@a11yfred/vale-config-neighbor`.
- **CI/CD**: Fixed publish workflow to publish from `packages/neighbor/` and `packages/textlint-rule-neighbor/` instead of the monorepo root. Fixed Vale zip path.

### Documentation

- Comprehensive 6-pass documentation audit for markdownlint compliance, accuracy, plain language, and ESL friendliness.
- All rule tables sorted by severity (most severe first) then alphabetically.
- Contractions replaced with full forms across all authored documentation.
- All ecosystem tools (ESLint, Stylelint, textlint, Vale, SwiftLint, Android Lint, Word Add-in) documented in README.
- Grammatical em dashes and en dashes replaced with hyphens across the entire codebase.
- AI-assisted development disclaimer added to README.

## 1.1.0 - 2026-05-23

- **New rule:** `no-disabled-and-aria-disabled`: Elements with both `disabled` and `aria-disabled` attributes cause conflicting states in assistive tech
- **Severity change:** `prefer-aria-disabled` moved from `off` to `error` by default to enforce discoverable form controls in tab order.

---

## 1.0.6 - 2026-05-13

**Changed:**

- **Documentation:** Add severity column to all rule tables in README
- **Docs cleanup:** Remove em dashes, fix MD036/MD040 markdownlint issues across all docs

**Fixed:**

- **`no-placeholder-only`**: no longer false-positives on `<input>` elements inside a `role="search"` landmark with an accessible name. The input is correctly labeled at the group level in that pattern.
- **`no-dialog-without-close`**: no longer false-positives on `role="dialog"` elements whose children are passed dynamically (`{children}`). When a close button cannot be statically detected, the rule skips rather than reporting.

---

## 1.0.0 - 2026-05-12

### Breaking Change

CSS rules renamed from `ulam/` to `neighbor/` namespace:

| Old | New |
| --- | --- |
| `ulam/user-preferences` | `neighbor/user-preferences` |
| `ulam/no-outline-none` | `neighbor/no-outline-none` |
| `ulam/no-forced-colors-none` | `neighbor/no-forced-colors-none` |

Update your `.stylelintrc.json` to use the new names.

### Added

- **New rule:** `neighbor/no-forced-colors-none`: `forced-color-adjust: none` inside `@media (forced-colors)` actively opts out of Windows High Contrast Mode
- **New entry point:** `@a11yfred/neighbor/content`: An ESLint plugin for accessibility and inclusion problems in web and app copy. Lints string literals and JSX text in JS/TS/JSX/TSX files.
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
| `no-ampersand-in-prose` | `&` in place of "and" in prose - announced inconsistently across AT vendors |

Rules are synthesised from 17 sources spanning W3C WAI, government plain language guides (US, UK, Australia, Canada), and disability language authorities (NCDJ, AP Stylebook, ADA National Network, APA Style, SIGACCESS). See [RULES-CONTENT.md](RULES-CONTENT.md) for full methodology and source citations.

- **New rule reference pages:** RULES.md is now an index. Full references split into:
  - [RULES-MARKUP.md](RULES-MARKUP.md): ESLint markup rules
  - [RULES-CSS.md](RULES-CSS.md): Stylelint CSS rules
  - [RULES-CONTENT.md](RULES-CONTENT.md): content rules with sources and methodology
- **New entry point alias:** `@a11yfred/neighbor/stylelint` added as an explicit stylelint alias alongside the default export.
- **Additional rules:** `no-labelledby-missing-target`, `no-dynamic-content-without-live`, `form-field-multiple-labels`, `no-empty-table-header` added to core markup rules (all run on React, Vue, and Angular).

### Changed

- **Severity changes:** 10 rules moved from `warn` to `off` in the recommended config. They flag real problems but are too noisy for most codebases by default. All remain available to opt in individually:
  - `no-application-role`, `no-grid-role`, `no-aria-roledescription`, `no-aria-readonly`, `no-tab-without-controls`, `no-href-hash`, `warn-role-alert`, `prefer-aria-disabled`, `no-target-blank-without-label`, `no-dialog-without-close`
  - `no-tooltip-role-misuse` and `no-menu-role-on-nav` remain on as warns.
- **Extended rules:** `no-announce-in-render` now runs in Vue and Angular plugins (not just React). Safe contexts are tuned per framework: Vue recognizes `onMounted`, `watch`, `watchEffect`, `nextTick`; Angular recognizes `ngOnInit`, `ngAfterViewInit`, `ngOnChanges`, and class method event handlers.

### Documentation

- WCAG SC and HTML spec links added throughout README and RULES.md
- CONTRIBUTING.md, PR template, and issue templates added
- README table of contents added
- README now includes correct parser snippets for Vue and Angular, and separate setup sections for Remix 2 and Remix 3
- @ulam described as a JavaScript framework (not React-based)

---

## 0.1.0 - 2026-04-30

Initial release.
