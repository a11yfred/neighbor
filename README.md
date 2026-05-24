# @a11yfred/neighbor

The a11yfred accessibility linter ecosystem. This monorepo houses a suite of plugins covering React, Vue, Angular, Remix, Vanilla Web Components, CSS, and prose content across ESLint, Stylelint, textlint, and Vale.

It builds on foundational tools like `eslint-plugin-jsx-a11y` to cover gaps: bad ARIA patterns, live region misuse, missing names on roles, and CSS that removes focus indicators. It also brings that robust coverage to non-React frameworks like Vue, Angular, and Vanilla Web Components.

Some rules are specific to **@ulam** — an upcoming JavaScript framework by the same author. Those rules are prefixed `no-announce-in-render`, `no-hash-router-in-remix`, and `no-use-page-title-in-remix`. They activate only when @ulam-related imports are detected and are harmless in non-@ulam projects.

## Contents

- [Install](#install)
- [Entry points](#entry-points)
- [Setup](#setup)
  - [Vanilla JS / Web Components / plain HTML](#vanilla-js--web-components--plain-html)
  - [React / JSX](#react-jsx)
  - [Remix 2](#remix-2)
  - [Remix 3](#remix-3)
  - [Vue](#vue)
  - [Angular](#angular)
  - [Stylelint](#stylelint)
  - [Content linting](#content-linting)
- [Peer dependencies](#peer-dependencies)
- [What neighbor adds](#what-neighbor-adds)
  - [ESLint  -  React / JSX](#eslint-react-jsx)
  - [ESLint  -  Remix 2](#eslint-remix-2)
  - [ESLint  -  Vue SFCs](#eslint-vue-sfcs)
  - [ESLint  -  Angular templates](#eslint-angular-templates)
  - [Stylelint  -  CSS](#stylelint-css)
  - [Content linter](#content-linter)
- [Rule severity](#rule-severity)
- [Contributing](CONTRIBUTING.md)
- [See also](#see-also)
- [License](#license)

## Install

```bash
npm install --save-dev @a11yfred/neighbor
```

## Entry points

| Import | Use for |
| --- | --- |
| `@a11yfred/neighbor/eslint` | React / JSX, Remix 2  -  markup rules |
| `@a11yfred/neighbor/eslint-vue` | Vue SFCs  -  markup rules |
| `@a11yfred/neighbor/eslint-angular` | Angular templates  -  markup rules |
| `@a11yfred/neighbor/content` | Any JS/TS/JSX/TSX  -  content and prose rules |
| `@a11yfred/neighbor` | Stylelint  -  CSS rules |
| `@a11yfred/neighbor/stylelint` | Stylelint  -  CSS rules (explicit alias) |

## Setup

### Vanilla JS / Web Components / plain HTML

If you write plain HTML or Vanilla Web Components (like Lit), you can use the `@a11yfred/neighbor/webcomponents` configuration. It natively lints standard HTML syntax for accessibility violations!

What you get:

| Plugin | What it checks |
| --- | --- |
| ESLint (`@a11yfred/neighbor/webcomponents`) | Markup: Native HTML elements and Lit templates for ARIA misuse, missing labels, etc. |
| Stylelint (`@a11yfred/neighbor`) | CSS: bare `outline: none`, forced-colors opt-out, motion/transparency without `prefers-*` fallbacks |
| Content linter (`@a11yfred/neighbor/content`) | JS strings: ableist language, vague CTAs, unexplained abbreviations, idioms, all-caps prose |

**Stylelint setup** (CSS only, no framework needed):

```bash
npm install --save-dev stylelint stylelint-config-standard @a11yfred/neighbor
```

```json
// .stylelintrc.json
{
  "extends": ["stylelint-config-standard"],
  "plugins": ["@a11yfred/neighbor"],
  "rules": {
    "neighbor/no-outline-none": true,
    "neighbor/no-forced-colors-none": true,
    "neighbor/user-preferences": true
  }
}
```

Run it:

```bash
npx stylelint "**/*.css"
```

**Content linter setup** (plain JS string literals, no framework needed):

```bash
npm install --save-dev eslint @a11yfred/neighbor
```

```js
// eslint.config.js  (ESLint flat config, ESLint >= 8)
import neighborContent from '@a11yfred/neighbor/content'

export default [
  {
    files: ['**/*.js'],
    plugins: { ...neighborContent.configs.recommended.plugins },
    rules:   { ...neighborContent.configs.recommended.rules },
  },
]
```

Run it:

```bash
npx eslint src/
```

Both together:

```js
// eslint.config.js
import neighborContent from '@a11yfred/neighbor/content'

export default [
  {
    files: ['**/*.js'],
    plugins: { ...neighborContent.configs.recommended.plugins },
    rules:   { ...neighborContent.configs.recommended.rules },
  },
]
```

```json
// .stylelintrc.json
{
  "extends": ["stylelint-config-standard"],
  "plugins": ["@a11yfred/neighbor"],
  "rules": {
    "neighbor/no-outline-none": true,
    "neighbor/no-forced-colors-none": true,
    "neighbor/user-preferences": true
  }
}
```

The ESLint markup rules (`@a11yfred/neighbor/eslint` and variants) require a template syntax to parse (like JSX, Vue templates, or HTML strings). For vanilla HTML or Web Components, you should use the `@a11yfred/neighbor/webcomponents` plugin along with the `@html-eslint/parser`!

---

### React / JSX

Neighbor works alongside `eslint-plugin-jsx-a11y`. Install both.

```bash
npm install --save-dev eslint-plugin-jsx-a11y @a11yfred/neighbor
```

```js
// eslint.config.js
import neighbor from '@a11yfred/neighbor/eslint'

export default [
  {
    plugins: { ...neighbor.configs.recommended.plugins },
    rules:   { ...neighbor.configs.recommended.rules },
  },
]
```

### Remix 2

Remix 2 is React-based. Use the React entry point. The `no-hash-router-in-remix` and `no-use-page-title-in-remix` rules activate automatically when Remix imports are detected.

```bash
npm install --save-dev eslint-plugin-jsx-a11y @a11yfred/neighbor
```

```js
// eslint.config.js
import neighbor from '@a11yfred/neighbor/eslint'

export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: { ...neighbor.configs.recommended.plugins },
    rules:   { ...neighbor.configs.recommended.rules },
  },
]
```

### Remix 3

Remix 3 is framework-agnostic and does not require React. Neighbor does not have a dedicated Remix 3 entry point  -  use the entry point that matches your renderer.

If you are using React with Remix 3:

```bash
npm install --save-dev eslint-plugin-jsx-a11y @a11yfred/neighbor
```

```js
import neighbor from '@a11yfred/neighbor/eslint'

export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: { ...neighbor.configs.recommended.plugins },
    rules:   { ...neighbor.configs.recommended.rules },
  },
]
```

If you are not using React with Remix 3, neighbor does not currently have a template-level entry point for your renderer. The Remix-specific rules (`no-hash-router-in-remix`, `no-use-page-title-in-remix`) only apply to React-based Remix projects.

### Vue

```bash
npm install --save-dev eslint-plugin-vuejs-accessibility @a11yfred/neighbor
```

```js
import vueParser from 'vue-eslint-parser'
import neighbor from '@a11yfred/neighbor/eslint-vue'

export default [
  {
    files: ['**/*.vue'],
    languageOptions: { parser: vueParser },
    plugins: { ...neighbor.configs.recommended.plugins },
    rules:   { ...neighbor.configs.recommended.rules },
  },
]
```

### Angular

```bash
npm install --save-dev @angular-eslint/eslint-plugin-template @a11yfred/neighbor
```

```js
import angularTemplateParser from '@angular-eslint/template-parser'
import neighbor from '@a11yfred/neighbor/eslint-angular'

export default [
  {
    files: ['**/*.html'],
    languageOptions: { parser: angularTemplateParser },
    plugins: { ...neighbor.configs.recommended.plugins },
    rules:   { ...neighbor.configs.recommended.rules },
  },
  {
    // Also lint component TypeScript files for the announce() rule
    files: ['**/*.ts'],
    plugins: { '@a11yfred/neighbor': neighbor },
    rules: {
      '@a11yfred/neighbor/no-announce-in-render': 'error',
    },
  },
]
```

### Stylelint

```json
// .stylelintrc.json
{
  "plugins": ["@a11yfred/neighbor"],
  "rules": {
    "neighbor/user-preferences": true,
    "neighbor/no-outline-none": true,
    "neighbor/no-forced-colors-none": true
  }
}
```

### Content linting

The content plugin lints string literals and JSX text in JavaScript, TypeScript, JSX, and TSX files. It is separate from the markup plugins and can be used alongside any of them.

```bash
npm install --save-dev @a11yfred/neighbor
```

```js
// eslint.config.js
import neighborContent from '@a11yfred/neighbor/content'

export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: { ...neighborContent.configs.recommended.plugins },
    rules:   { ...neighborContent.configs.recommended.rules },
  },
]
```

To use alongside the React markup plugin:

```js
// eslint.config.js
import neighbor from '@a11yfred/neighbor/eslint'
import neighborContent from '@a11yfred/neighbor/content'

export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      ...neighbor.configs.recommended.plugins,
      ...neighborContent.configs.recommended.plugins,
    },
    rules: {
      ...neighbor.configs.recommended.rules,
      ...neighborContent.configs.recommended.rules,
    },
  },
]
```

## Peer dependencies

| Peer | Required for |
| --- | --- |
| `eslint >= 8` | Any ESLint entry point |
| `eslint-plugin-jsx-a11y >= 6` | React config  -  neighbor extends it, not replaces it |
| `eslint-plugin-vuejs-accessibility >= 2` | Vue config |
| `@angular-eslint/eslint-plugin-template >= 17` | Angular config |
| `stylelint >= 14` | Stylelint config |

All peers are optional. Install only what your project uses.

## What neighbor adds

### ESLint  -  React / JSX

Base: `eslint-plugin-jsx-a11y`

| What it checks | Rule | Severity | WCAG SC |
| --- | --- | --- | --- |
| `aria-disabled` keeps element reachable | `prefer-aria-disabled` | off | [2.1.1](https://www.w3.org/WAI/WCAG21/Understanding/keyboard) |
| `aria-disabled` must block click handler | `no-unblocked-aria-disabled` | error | [2.1.1](https://www.w3.org/WAI/WCAG21/Understanding/keyboard) |
| `aria-label` on a generic element with no role | `no-aria-label-on-generic` | error | [1.3.1](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships) |
| `role="alert"` overuse | `warn-role-alert` | off | [4.1.3](https://www.w3.org/WAI/WCAG21/Understanding/status-messages) |
| `aria-live="assertive"` outside `role="alert"` | `no-assertive-live-overuse` | error | [4.1.3](https://www.w3.org/WAI/WCAG21/Understanding/status-messages) |
| `role="dialog"` requires accessible name | `no-roles-without-name` | error | [4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `role="group"` with form controls requires name | `no-group-without-name` | error | [1.3.1](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships) |
| `role="tooltip"` requires `id` on the tooltip | `no-tooltip-role-misuse` | warn | [4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `role="application"` disables AT browse mode | `no-application-role` | off | - |
| `role="grid"` almost always wrong | `no-grid-role` | off | - |
| `role="menu"` on nav triggers wrong AT mode | `no-menu-role-on-nav` | warn | [2.1.1](https://www.w3.org/WAI/WCAG21/Understanding/keyboard) |
| `role="presentation"` on a focusable element | `no-presentation-on-focusable` | error | [2.1.1](https://www.w3.org/WAI/WCAG21/Understanding/keyboard) |
| `role="log"` must not contain interactive children | `no-log-with-interactive-children` | error | [4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `role="img"` requires accessible name | `no-image-role-without-name` | error | [4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `role="tab"` requires `aria-selected` | `no-tabs-without-structure` | error | [4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `role="tab"` should declare `aria-controls` | `no-tab-without-controls` | off | [4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `role="combobox"` requires `aria-expanded` | `no-combobox-without-expanded` | error | [4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `role="slider"` requires value range attributes | `no-slider-without-range` | error | [4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `role="spinbutton"` requires value range attributes | `no-spinbutton-without-range` | error | [4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `role="listbox"` requires `role="option"` children | `no-listbox-without-option` | error | [4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `role="tree"` requires `role="treeitem"` children | `no-tree-without-treeitem` | error | [4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `role="feed"` requires `role="article"` children | `no-feed-without-article` | error | [4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `aria-hidden="true"` + `role="none"` is redundant | `no-redundant-aria-hidden-with-presentation` | error | - |
| `aria-roledescription` does not translate | `no-aria-roledescription` | off | - |
| `aria-readonly` has poor AT support | `no-aria-readonly` | off | - |
| `aria-owns` on a void element | `no-aria-owns-on-void` | error | [4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `aria-activedescendant` requires a non-empty static ID | `no-aria-activedescendant-without-id` | error | [4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `aria-required` only valid on form-control roles | `no-aria-required-on-non-form` | error | [4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `<a>` with only aria-hidden children | `no-aria-hidden-in-link` | error | [4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `<button>` with only aria-hidden children | `no-empty-button` | error | [4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `<input>` placeholder used as sole label | `no-placeholder-only` | error | [1.3.1](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships) |
| `<input>` with invalid type value | `no-input-type-invalid` | error | [1.3.5](https://www.w3.org/WAI/WCAG21/Understanding/identify-input-purpose) |
| `<button>` in a form missing explicit type | `no-button-type-missing` | warn | [HTML spec](https://html.spec.whatwg.org/multipage/form-elements.html#the-button-element) |
| `<summary>` outside `<details>` | `no-summary-without-details` | error | [2.1.1](https://www.w3.org/WAI/WCAG21/Understanding/keyboard) |
| `<a href="#">` used as a button | `no-href-hash` | off | [2.1.1](https://www.w3.org/WAI/WCAG21/Understanding/keyboard) |
| `target="_blank"` without new-tab disclosure | `no-target-blank-without-label` | off | [3.2.2](https://www.w3.org/WAI/WCAG21/Understanding/on-input) |
| Duplicate `id` breaks ARIA relationships | `no-duplicate-id` | error | [1.3.1](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships) |
| Positive `tabIndex` breaks tab order | `no-positive-tabindex` | error | [2.4.3](https://www.w3.org/WAI/WCAG21/Understanding/focus-order) |
| Heading inside an interactive element | `no-heading-inside-interactive` | error | [4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `title` attribute as the only accessible name | `no-title-as-label` | error | [2.4.6](https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels) |
| `<video>` or `<audio autoplay>` without controls | `no-autoplay-without-controls` | error | [1.4.2](https://www.w3.org/WAI/WCAG21/Understanding/audio-control) |
| Mouse-only events without keyboard equivalents | `no-mouse-only-events` | error | [2.1.1](https://www.w3.org/WAI/WCAG21/Understanding/keyboard) |
| `aria-labelledby`/`describedby` references missing `id` | `no-labelledby-missing-target` | error | [4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `dangerouslySetInnerHTML` outside a live region | `no-dynamic-content-without-live` | error | [4.1.3](https://www.w3.org/WAI/WCAG21/Understanding/status-messages) |
| Multiple `<label>` elements for the same control | `form-field-multiple-labels` | error | [1.3.1](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships) |
| `<th>` or header role with no accessible text | `no-empty-table-header` | error | [1.3.1](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships) |
| `announce()` called in component render body | `no-announce-in-render` | error | [4.1.3](https://www.w3.org/WAI/WCAG21/Understanding/status-messages) |

### ESLint  -  Remix 2

Same as React / JSX. Additional rules activate when Remix imports are detected in the file being linted:

| What it checks | Rule | Severity |
| --- | --- | --- |
| `@ulam` hash router alongside `react-router` | `no-hash-router-in-remix` | warn |
| `usePageTitle()` alongside `react-router` | `no-use-page-title-in-remix` | warn |

### ESLint  -  Vue SFCs

Base: `eslint-plugin-vuejs-accessibility`

Neighbor adds everything in the React table above, adapted for Vue's AST (`v-html` instead of `dangerouslySetInnerHTML`), plus:

| What it checks | Rule | Severity | WCAG SC |
| --- | --- | --- | --- |
| Ambiguous link text ("click here", "read more") | `no-anchor-ambiguous-text` | error | [2.4.4](https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context) |
| `<a>` with no content and no accessible name | `no-anchor-no-content` | error | [4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| Invalid ARIA attribute values | `no-invalid-aria-prop-value` | error | [4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| Invalid `autocomplete` token | `no-autocomplete-invalid` | error | [1.3.5](https://www.w3.org/WAI/WCAG21/Understanding/identify-input-purpose) |
| Heading with no content | `no-heading-no-content` | error | [2.4.6](https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels) |
| `<iframe>` without `title` | `no-iframe-no-title` | error | [4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| Alt text contains "image", "photo" | `no-img-redundant-alt` | warn | [1.1.1](https://www.w3.org/WAI/WCAG21/Understanding/non-text-content) |
| `accessKey` attribute | `no-access-key` | warn | [2.1.4](https://www.w3.org/WAI/WCAG21/Understanding/character-key-shortcuts) |
| `scope` on `<td>` (only valid on `<th>`) | `no-scope-on-td` | error | [1.3.1](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships) |
| `announce()` called outside `onMounted`/`watch`/handler | `no-announce-in-render` | error | [4.1.3](https://www.w3.org/WAI/WCAG21/Understanding/status-messages) |

### ESLint  -  Angular templates

Base: `@angular-eslint/eslint-plugin-template`

Neighbor adds the same rule set as Vue, adapted for Angular's template AST (`[innerHTML]` instead of `dangerouslySetInnerHTML`). The `no-announce-in-render` rule also lints Angular component TypeScript files  -  see the setup instructions for how to configure it for `.ts` files alongside `.html` templates.

**Known limitation:** Angular's template parser does not attach parent pointers to AST nodes. Rules that need to walk up the tree (`no-summary-without-details`, `no-button-type-missing`, `no-log-with-interactive-children`, `no-menu-role-on-nav`, `no-heading-inside-interactive`) will silently pass in Angular templates. The `no-dynamic-content-without-live` rule only checks the element itself for Angular (no ancestor walk).

### Stylelint  -  CSS

| Rule | Severity | What it checks |
| --- | --- | --- |
| `neighbor/user-preferences` | warn | Warns when motion, transparency, or alpha colors are used without `@media (prefers-*)` fallbacks  -  [SC 1.4.3](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum) / [SC 2.3.3](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions) |
| `neighbor/no-outline-none` | error | Disallows bare `outline: none` or `outline: 0` outside `:focus` selectors  -  [SC 2.4.7](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible) |
| `neighbor/no-forced-colors-none` | error | Disallows `forced-color-adjust: none` inside `@media (forced-colors)`  -  opts out of Windows High Contrast Mode  -  [SC 1.4.11](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast) |

### Content linter

Rules that flag accessibility and inclusion problems in web and app copy. Works on string literals and JSX text in JS/TS/JSX/TSX files.

| Rule | What it flags | Severity | WCAG SC |
| --- | --- | --- | --- |
| `no-ableist-language` | Slurs, condescending euphemisms, suffering-framing ("suffers from", "wheelchair-bound", "special needs") | warn | [3.1.1](https://www.w3.org/WAI/WCAG22/Understanding/language-of-page) |
| `no-disability-metaphor` | Figurative use of disability language ("blind spot", "tone deaf", "paralyzed by") | warn | - |
| `no-english-idiom` | Idioms and sports metaphors opaque to ESL readers ("ball park", "slam dunk", "boil the ocean") | warn | [3.1.5](https://www.w3.org/WAI/WCAG22/Understanding/reading-level) |
| `no-vague-cta` | Vague link and button text ("click here", "read more", "here") | warn | [2.4.4](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context) |
| `no-directional-language` | Layout-dependent position references ("see above", "in the right sidebar") | warn | [1.3.3](https://www.w3.org/WAI/WCAG22/Understanding/sensory-characteristics) |
| `no-unexplained-abbreviation` | Acronyms used without a prior expansion in the same file | warn | [3.1.4](https://www.w3.org/WAI/WCAG22/Understanding/abbreviations) |
| `no-all-caps-prose` | ALL CAPS words in prose that screen readers may spell out letter-by-letter | warn | - |
| `no-vague-error-message` | Error messages that don't explain what went wrong ("An error occurred", "Something went wrong") | warn | [3.3.1](https://www.w3.org/WAI/WCAG22/Understanding/error-identification) |
| `no-ampersand-in-prose` | `&` used in place of "and" in prose  -  announced inconsistently by screen readers | warn | - |
| `no-exclusive-language` | Tech jargon and culturally appropriated terms (blacklist, master/slave, sanity check, spirit animal) | warn | - |
| `no-colonial-and-violent-language` | Terms rooted in colonialism or violence applied to people (stakeholder, target population, tackle) | warn | - |
| `no-deficit-language` | Language that reduces people to their circumstances (the homeless, inmate, addict, at-risk youth) | warn | - |
| `no-gendered-language` | Generic gendered pronoun patterns (he/she, his or her, mum and dad) | warn | - |
| `no-anti-lgbtq-language` | Outdated or pathologizing terms regarding sexual orientation and gender identity | warn | - |
| `no-device-specific-action` | Device-specific input actions (click, tap, swipe) | warn | - |

See [RULES-CONTENT.md](RULES-CONTENT.md) for the full rule reference including sources, methodology, and the language-evolution note.

## Rule severity

| Severity | Meaning |
| --- | --- |
| `error` | Definite AT breakage or HTML spec violation |
| `warn` | Strong guidance, occasional legitimate overrides exist |
| `off` | Available but disabled  -  too noisy for most codebases, enable if it fits your project |

All rules can be overridden in your config.

## Roadmap

Planned improvements and extensions to neighbor:

### In development

- [ ] **iOS app** — Accessibility linting for native iOS applications (Swift)
- [ ] **Android app** — Accessibility linting for native Android applications (Kotlin)
- [ ] **Desktop app (Electron)** — Standalone desktop application for cross-platform linting
- [ ] **Microsoft Word add-in** — Native Word add-in for accessibility linting in document authoring
- [ ] **Browser extensions** — Chrome and Firefox extensions for live page linting with real-time violation highlighting

### Planned

- [ ] Additional editor integrations (VS Code, Sublime Text, etc.) for embedded accessibility linting

## See also

- [RULES.md](RULES.md)  -  rule index across all domains
- [RULES-MARKUP.md](RULES-MARKUP.md)  -  full ESLint rule reference (markup)
- [RULES-CSS.md](RULES-CSS.md)  -  full Stylelint rule reference (CSS)
- [RULES-CONTENT.md](RULES-CONTENT.md)  -  full content rule reference with sources
- `@a11yfred/vale-config-neighbor`  -  companion Vale package for prose linting in Markdown, MDX, and HTML. See `packages/vale-config-neighbor` in this monorepo.

## License

MIT

---

*Built with help from Claude.*
