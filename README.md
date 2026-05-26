# @a11yfred/neighbor

The a11yfred accessibility linter ecosystem, **neighbor**. This repository contains tools for React, Vue, Angular, Remix, Web Components, CSS, text, iOS (SwiftUI), Android (Jetpack Compose), and Microsoft Word. It uses ESLint, Stylelint, textlint, Vale, SwiftLint, and Android Lint.

It adds new rules to base tools like `eslint-plugin-jsx-a11y`. It finds problems like bad ARIA code, wrong live regions, missing names, and bad CSS. It brings these strong checks to non-React frameworks like Vue, Angular, and Web Components.

**Beyond the web**, neighbor also ships:

- **[Native iOS linting](./apps/ios-app/README.md)** with 9 custom SwiftLint rules for SwiftUI accessibility.
- **[Native Android linting](./apps/android-app/README.md)** with 8 custom Android Lint rules for Jetpack Compose.
- **[A Microsoft Word add-in](./apps/word-addin/README.md)** that checks documents for exclusionary and ableist language while you type.

Some rules are only for **@ulam**, an upcoming JavaScript framework. These rules will not run unless you use @ulam. They are safe to keep in other projects.

> [!NOTE]
> **AI Assisted Development**
> All of the platform adaptations, browser extensions, native plugins, and ecosystem tooling in this repository were largely aided by AI. We could really use the community's help in testing these tools and verifying their real-world usefulness and quality!

## Why Use Neighbor?

Tools like axe-core and Lighthouse are great, but they only test your app *after* you build it. This makes fixing mistakes slow. **`neighbor` finds accessibility mistakes directly in your editor, while you type.**

Why choose `neighbor`?

1. **More Rules:** It checks for complex problems. Standard tools check simple things like missing `alt` text. `neighbor` checks for harder problems, like missing close buttons on dialogs, broken tab menus, or React Fragments silently dropping `aria-*` props.
2. **Same Rules for Every Framework:** If you switch from React to Vue or Angular, your linter often catches fewer mistakes. `neighbor` gives you the exact same strict rules for React, Vue, Angular, Remix, Lit Web Components, iOS, and Android.
3. **CSS Accessibility — A Gap No One Else Fills:** The only CSS accessibility linter — `stylelint-a11y` — has been unmaintained since 2019. `neighbor` picks up where it left off with **18 CSS rules** mapped to WCAG Success Criteria, catching problems like hidden focus rings, clipped zoomed text, smooth scrolling without motion fallbacks, and `list-style: none` stripping Safari semantics. No other maintained tool does this.
4. **Text and Content:** Accessibility is not just code. `neighbor` flags ableist language, vague calls-to-action, and confusing link text directly in your JS/TS string literals.
5. **Ecosystem Integration:** Works natively across your entire stack via ESLint, Stylelint, textlint, Vale, Microsoft Word, Xcode (iOS), and Android Studio.

## Contents

- [Install](#install)
- [Entry Points](#entry-points)
- [Setup](#setup)
  - [Vanilla JS / Web Components / Plain HTML](#vanilla-js--web-components--plain-html)
  - [React / JSX](#react--jsx)
  - [Remix 2](#remix-2)
  - [Remix 3](#remix-3)
  - [Vue](#vue)
  - [Angular](#angular)
  - [Stylelint](#stylelint)
  - [Content Linting](#content-linting)
- [Ecosystem & Integrations](#ecosystem--integrations)
- [Peer Dependencies](#peer-dependencies)
- [Working With Standard Linters](#working-with-standard-linters)
- [What Neighbor Adds](#what-neighbor-adds)
  - [ESLint - Markup](#eslint---markup)
  - [Stylelint - CSS](#stylelint---css)
  - [Content Linter](#content-linter)
- [Rule Severity](#rule-severity)
  - [Customizing Rule Severity](#customizing-rule-severity)
- [Roadmap](#roadmap)
- [Contributing](packages/neighbor/CONTRIBUTING.md)
- [See Also](#see-also)
- [License](#license)

## Install

All neighbor rules are packaged in a single install:

```bash
npm install --save-dev @a11yfred/neighbor
```

This gives you access to:

- **ESLint plugins** via different entry points (`/eslint`, `/eslint-vue`, `/eslint-angular`, `/webcomponents`) for markup accessibility rules in your framework
- **Stylelint plugin** via the default export or `/stylelint` alias for CSS accessibility rules
- **Content rules** via `/content` for textlint linting of prose in JS/TS/JSX/TSX files

**Optional: Vale configuration** (for standalone prose/content linting outside of JavaScript):

```bash
npm install --save-dev @a11yfred/vale-config-neighbor
vale config pull
```

## Entry Points

| Import | Use for |
| --- | --- |
| `@a11yfred/neighbor` | Stylelint - CSS rules |
| `@a11yfred/neighbor/content` | Any JS/TS/JSX/TSX: content and prose rules |
| `@a11yfred/neighbor/eslint` | React / JSX, Remix 2: markup rules |
| `@a11yfred/neighbor/eslint-angular` | Angular templates: markup rules |
| `@a11yfred/neighbor/eslint-vue` | Vue SFCs: markup rules |
| `@a11yfred/neighbor/lit` | Lit: markup rules |
| `@a11yfred/neighbor/stylelint` | Stylelint - CSS rules (explicit alias) |
| `@a11yfred/neighbor/webcomponents` | Web Components / Vanilla HTML: markup rules |

## Setup

### Vanilla JS / Web Components / Plain HTML

<details><summary>Show setup instructions</summary>

If you write plain HTML or Vanilla Web Components (like Lit), you can use the `@a11yfred/neighbor/webcomponents` configuration. It natively lints standard HTML syntax for accessibility violations!

What you get:

| Plugin | What it checks |
| --- | --- |
| Content linter (`@a11yfred/neighbor/content`) | JS strings: ableist language, vague CTAs, unexplained abbreviations, idioms, all-caps prose |
| ESLint (`@a11yfred/neighbor/webcomponents`) | Markup: Native HTML elements and Lit templates for ARIA misuse, missing labels, etc. |
| Stylelint (`@a11yfred/neighbor`) | CSS: 18 rules covering focus rings, High Contrast Mode, motion preferences, target size, text spacing, `list-style` semantics, overflow clipping, font sizing, and more |

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

</details>

---

### React / JSX

<details><summary>Show setup instructions</summary>

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

</details>

### Remix 2

<details><summary>Show setup instructions</summary>

Remix 2 uses React. Use the React setup. The special Remix rules turn on automatically when you import Remix.

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

</details>

### Remix 3

<details><summary>Show setup instructions</summary>

Remix 3 works with any framework. Neighbor does not have a special setup for Remix 3. Use the setup for your view framework (like React or Vue).

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

If you do not use React with Remix 3, the special Remix rules will not run.

</details>

### Vue

<details><summary>Show setup instructions</summary>

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

</details>

### Angular

<details><summary>Show setup instructions</summary>

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

</details>

### Stylelint

<details><summary>Show setup instructions</summary>

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

</details>

### Content Linting

<details><summary>Show setup instructions</summary>

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

</details>

## Ecosystem & Integrations

`neighbor` extends beyond traditional JavaScript IDE linters into standalone applications and native platform integrations.

- **[Web App](https://a11yfred.github.io/neighbor)**: A web interface for the neighbor ecosystem.
- **[Microsoft Word Add-in](./apps/word-addin/README.md)**: An Office.js add-in that checks documents for exclusionary language while you type.
- **[Vale Dictionary](./packages/neighbor/vale/neighbor)**: A compiled Vale-compatible dictionary containing our textlint content vocabulary for standalone Markdown checking.

*WIP & Pre-launch:*
- **[iOS App (SwiftUI)](./apps/ios-app/README.md)**: Custom SwiftLint rules for native iOS accessibility.
- **[Android App (Jetpack Compose)](./apps/android-app/README.md)**: A standard Gradle lint module for native Android accessibility.

*Upcoming:*
- **Browser Extensions**: Chrome and Firefox plugins.
- **Desktop App**: An Electron app that runs these checks.

## Peer Dependencies

| Peer | Required for |
| --- | --- |
| `@angular-eslint/eslint-plugin-template >= 17` | Angular config |
| `eslint >= 8` | Any ESLint entry point |
| `eslint-plugin-jsx-a11y >= 6` | React config - neighbor extends it, not replaces it |
| `eslint-plugin-vuejs-accessibility >= 2` | Vue config |
| `stylelint >= 14` | Stylelint config |

All peers are optional. Install only what your project uses.

## Working with Standard Linters

The JavaScript ecosystem already has great tools (`eslint-plugin-jsx-a11y` for React, `eslint-plugin-vuejs-accessibility` for Vue, `@angular-eslint` for Angular, and `eslint-plugin-lit-a11y` for Lit).

Neighbor is designed as a **gap-filler**. It automatically detects if you have the standard linter installed for your framework. If you do, it will disable any of its own redundant checks and only run the rules that the standard linter misses, ensuring you get maximum coverage without duplicate warnings. For a full list of omitted redundant rules, see the [Framework Omissions](packages/neighbor/RULES-MARKUP.md#framework-specific-omissions) section.

## What Neighbor Adds

Because `neighbor` is designed as a "gap-filler", it assumes you are running it alongside the standard linters for your framework.

| Framework | Standard A11y Linter | `neighbor` Gap Coverage (Rules not in standard linter) |
| :--- | :--- | :--- |
| **@ulam** | *N/A (Internal framework)* | **3 specific rules** <br/>*(Checks for `announce()` abuse in render loops and router collisions)* |
| **Android (Compose)** | Android Lint (built-in) | **8 custom UAST rules** <br/>*(Checks specifically for `Modifier` chain accessibility, `pointerInput` semantics, and TalkBack traversal groups)* |
| **Angular** | `@angular-eslint/eslint-plugin-template` | **~52 rules** <br/>*(30 core rules + 20 portability rules missing from Angular standard + 2 Angular-specific rules like host `tabindex`)* |
| **Lit / Web Components** | `eslint-plugin-lit-a11y` | **~51 rules** <br/>*(30 core rules + 20 portability rules + 1 Lit-specific autofocus rule)* |
| **React / JSX** | `eslint-plugin-jsx-a11y` | **~32 rules** <br/>*(30 core rules + 2 React-specific rules like `<Fragment>` ARIA drops and SPA focus)* |
| **Remix** | `eslint-plugin-jsx-a11y` | **~31 rules** <br/>*(30 core rules + Remix missing `meta` title)* |
| **Vanilla HTML** | `@html-eslint/eslint-plugin` | **~50 rules** <br/>*(30 core rules + 20 portability rules applied directly to `.html` AST)* |
| **Vue** | `eslint-plugin-vuejs-accessibility` | **~53 rules** <br/>*(30 core rules + 20 portability rules missing from Vue standard + 3 Vue-specific rules like `<Transition>` live regions)* |
| **CSS (Stylelint)** | *None maintained* | **18 rules** <br/>*(Focus rings, motion preferences, text spacing, target size, overflow clipping, list semantics, font sizing, and more — filling the gap left by the unmaintained `stylelint-a11y`)* |

## Rule Severity

| Severity | Meaning |
| --- | --- |
| `error` | This breaks screen readers or violates HTML rules. You must fix it. |
| `warn` | This is usually bad, but sometimes you have a good reason to do it. |
| `off` | This rule is turned off because it gives too many warnings. You can turn it on if you want. |

### Customizing Rule Severity

Yes! You have full control over the rules. If you want to change a rule to a warning, turn off a noisy rule, or enable a rule that is off by default, you can do so in your ESLint or Stylelint configuration:

<details><summary>ESLint (<code>eslint.config.js</code>)</summary>

```js
export default [
  // ... other config
  {
    rules: {
      // Turn a rule off completely
      '@a11yfred/neighbor/no-positive-tabindex': 'off',
      // Change an error to a warning
      '@a11yfred/neighbor/no-aria-label-on-generic': 'warn',
      // Turn on a rule that is off by default
      '@a11yfred/neighbor/prefer-aria-disabled': 'error',
      // Content rules
      '@a11yfred/neighbor/content/no-ableist-language': 'error'
    }
  }
]
```

</details>

<details><summary>Stylelint (<code>stylelint.config.js</code>)</summary>

```js
export default {
  // ... other config
  rules: {
    // Turn a rule off
    'neighbor/no-outline-none': null,
    // Change an error to a warning
    'neighbor/no-forced-colors-none': [true, { "severity": "warning" }]
  }
}
```

</details>

### ESLint - Markup

Neighbor's exact markup rule sets, including what is checked for each framework, which rules are errors vs warnings, and how they map to WCAG Success Criteria, are documented in our dedicated rule page.

See **[Markup Rules](packages/neighbor/RULES-MARKUP.md)** for ESLint rules covering React, Remix, Vue, Angular, Lit, and Web Components (ARIA, focus, semantic HTML).

### Stylelint - CSS

CSS accessibility linting has been an unsolved problem in the JavaScript ecosystem. The only dedicated tool — `stylelint-a11y` — went unmaintained in 2019 and no successor emerged. **Neighbor fills this gap** with 18 rules built from scratch for modern Stylelint (v14+), each mapped to a specific WCAG Success Criterion. It covers focus rings, High Contrast Mode, motion preferences, target size, text spacing, overflow clipping, list semantics, font sizing, screen-reader visibility, and more.

See **[CSS Rules](packages/neighbor/RULES-CSS.md)** for the full rule reference, WCAG mappings, and migration notes for `stylelint-a11y` users.

### Content Linter

Neighbor's exact content rule sets, including which rules are errors vs warnings and how they map to WCAG Success Criteria, are documented in our dedicated rule page.

See **[Content Rules](packages/neighbor/RULES-CONTENT.md)** for Textlint rules flagging ableist language, confusing CTAs, jargon, and inclusion problems in web and app copy (works on string literals and JSX text in JS/TS/JSX/TSX files).


## Roadmap

Future plans for neighbor:

### In Development

- [ ] **Browser extensions**: Chrome and Firefox plugins to check pages live.
- `[x]` **iOS app**: [Accessibility checking for iOS apps (SwiftUI)](./apps/ios-app/README.md).
- `[x]` **Android app**: [Accessibility checking for Android apps (Compose)](./apps/android-app/README.md).
- [ ] **Desktop app (Electron)**: A desktop app that runs these checks.
- `[x]` **Microsoft Word add-in**: [Check documents while you type in Word](./apps/word-addin/README.md).

### Planned

- [ ] More editor plugins (VS Code, Sublime Text, Xcode, Android Studio, etc.).

## See Also

- [RULES.md](packages/neighbor/RULES.md) - rule index across all domains
- [RULES-MARKUP.md](packages/neighbor/RULES-MARKUP.md) - full ESLint rule reference (markup)
- [RULES-CSS.md](packages/neighbor/RULES-CSS.md) - full Stylelint rule reference (CSS)
- [RULES-CONTENT.md](packages/neighbor/RULES-CONTENT.md) - full content rule reference with sources
- [iOS Rules](./apps/ios-app/README.md) - custom SwiftLint rules for native iOS accessibility
- [Android Rules](./apps/android-app/README.md) - custom Android Lint rules for Jetpack Compose
- `@a11yfred/vale-config-neighbor` - companion Vale package for prose linting in Markdown, MDX, and HTML. See `packages/vale-config-neighbor` in this monorepo.

## License

MIT
