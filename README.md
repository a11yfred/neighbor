# @a11yfred/neighbor

Neighbor is an accessibility linting plugin for ESLint and Stylelint that builds on jsx-a11y. It looks to cover gaps: bad ARIA patterns, live region misuse, missing names on roles, and CSS that removes focus indicators. It also brings that coverage to Vue and Angular, where jsx-a11y does not apply.

## Install

```bash
npm install --save-dev @a11yfred/neighbor
```

## Entry points

| Import | Use for |
| --- | --- |
| `@a11yfred/neighbor/eslint` | React / JSX, Remix 2 |
| `@a11yfred/neighbor/eslint-vue` | Vue SFCs |
| `@a11yfred/neighbor/eslint-angular` | Angular templates |
| `@a11yfred/neighbor` | Stylelint — CSS user-preference fallbacks |

## Setup

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

Remix 3 is framework-agnostic and does not require React. Neighbor does not have a dedicated Remix 3 entry point — use the entry point that matches your renderer.

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

```js
// .stylelintrc.json
{
  "plugins": ["@a11yfred/neighbor"],
  "rules": {
    "ulam/user-preferences": true,
    "ulam/no-outline-none": true
  }
}
```

## Peer dependencies

| Peer | Required for |
| --- | --- |
| `eslint >= 8` | Any ESLint entry point |
| `eslint-plugin-jsx-a11y >= 6` | React config — neighbor extends it, not replaces it |
| `eslint-plugin-vuejs-accessibility >= 2` | Vue config |
| `@angular-eslint/eslint-plugin-template >= 17` | Angular config |
| `stylelint >= 14` | Stylelint config |

All peers are optional. Install only what your project uses.

## What neighbor adds

### ESLint — React / JSX

Base: `eslint-plugin-jsx-a11y`

| What it checks | Rule | WCAG SC |
| --- | --- | --- |
| `aria-disabled` keeps element reachable | `prefer-aria-disabled` | 2.1.1 |
| `aria-disabled` must block click handler | `no-unblocked-aria-disabled` | 2.1.1 |
| `aria-label` on a generic element with no role | `no-aria-label-on-generic` | 1.3.1 |
| `role="alert"` overuse | `warn-role-alert` | 4.1.3 |
| `aria-live="assertive"` outside `role="alert"` | `no-assertive-live-overuse` | 4.1.3 |
| `role="dialog"` requires accessible name | `no-roles-without-name` | 4.1.2 |
| `role="group"` with form controls requires name | `no-group-without-name` | 1.3.1 |
| `role="tooltip"` requires `id` on the tooltip | `no-tooltip-role-misuse` | 4.1.2 |
| `role="application"` disables AT browse mode | `no-application-role` | — |
| `role="grid"` almost always wrong | `no-grid-role` | — |
| `role="menu"` on nav triggers wrong AT mode | `no-menu-role-on-nav` | 2.1.1 |
| `role="presentation"` on a focusable element | `no-presentation-on-focusable` | 2.1.1 |
| `role="log"` must not contain interactive children | `no-log-with-interactive-children` | 4.1.2 |
| `role="img"` requires accessible name | `no-image-role-without-name` | 4.1.2 |
| `role="tab"` requires `aria-selected` | `no-tabs-without-structure` | 4.1.2 |
| `role="tab"` should declare `aria-controls` | `no-tab-without-controls` | 4.1.2 |
| `role="combobox"` requires `aria-expanded` | `no-combobox-without-expanded` | 4.1.2 |
| `role="slider"` requires value range attributes | `no-slider-without-range` | 4.1.2 |
| `role="spinbutton"` requires value range attributes | `no-spinbutton-without-range` | 4.1.2 |
| `role="listbox"` requires `role="option"` children | `no-listbox-without-option` | 4.1.2 |
| `role="tree"` requires `role="treeitem"` children | `no-tree-without-treeitem` | 4.1.2 |
| `role="feed"` requires `role="article"` children | `no-feed-without-article` | 4.1.2 |
| `aria-hidden="true"` + `role="none"` is redundant | `no-redundant-aria-hidden-with-presentation` | — |
| `aria-roledescription` does not translate | `no-aria-roledescription` | — |
| `aria-readonly` has poor AT support | `no-aria-readonly` | — |
| `aria-owns` on a void element | `no-aria-owns-on-void` | 4.1.2 |
| `aria-activedescendant` requires a non-empty static ID | `no-aria-activedescendant-without-id` | 4.1.2 |
| `aria-required` only valid on form-control roles | `no-aria-required-on-non-form` | 4.1.2 |
| `<a>` with only aria-hidden children | `no-aria-hidden-in-link` | 4.1.2 |
| `<button>` with only aria-hidden children | `no-empty-button` | 4.1.2 |
| `<input>` placeholder used as sole label | `no-placeholder-only` | 1.3.1 |
| `<input>` with invalid type value | `no-input-type-invalid` | 1.3.5 |
| `<button>` in a form missing explicit type | `no-button-type-missing` | HTML spec |
| `<summary>` outside `<details>` | `no-summary-without-details` | 2.1.1 |
| `<a href="#">` used as a button | `no-href-hash` | 2.1.1 |
| `target="_blank"` without new-tab disclosure | `no-target-blank-without-label` | 3.2.2 |
| Duplicate `id` breaks ARIA relationships | `no-duplicate-id` | 1.3.1 |
| Positive `tabIndex` breaks tab order | `no-positive-tabindex` | 2.4.3 |
| Heading inside an interactive element | `no-heading-inside-interactive` | 4.1.2 |
| `title` attribute as the only accessible name | `no-title-as-label` | 2.4.6 |
| `<video>` or `<audio autoplay>` without controls | `no-autoplay-without-controls` | 1.4.2 |
| Mouse-only events without keyboard equivalents | `no-mouse-only-events` | 2.1.1 |
| `aria-labelledby`/`describedby` references missing `id` | `no-labelledby-missing-target` | 4.1.2 |
| `dangerouslySetInnerHTML` outside a live region | `no-dynamic-content-without-live` | 4.1.3 |
| Multiple `<label>` elements for the same control | `form-field-multiple-labels` | 1.3.1 |
| `<th>` or header role with no accessible text | `no-empty-table-header` | 1.3.1 |
| `announce()` called in component render body | `no-announce-in-render` | 4.1.3 |

### ESLint — Remix 2

Same as React / JSX. Additional rules activate when Remix imports are detected in the file being linted:

| What it checks | Rule | Severity |
| --- | --- | --- |
| `@ulam` hash router alongside `react-router` | `no-hash-router-in-remix` | warn |
| `usePageTitle()` alongside `react-router` | `no-use-page-title-in-remix` | warn |

### ESLint — Vue SFCs

Base: `eslint-plugin-vuejs-accessibility`

Neighbor adds everything in the React table above, adapted for Vue's AST (`v-html` instead of `dangerouslySetInnerHTML`), plus:

| What it checks | Rule | WCAG SC |
| --- | --- | --- |
| Ambiguous link text ("click here", "read more") | `no-anchor-ambiguous-text` | 2.4.4 |
| `<a>` with no content and no accessible name | `no-anchor-no-content` | 4.1.2 |
| Invalid ARIA attribute values | `no-invalid-aria-prop-value` | 4.1.2 |
| Invalid `autocomplete` token | `no-autocomplete-invalid` | 1.3.5 |
| Heading with no content | `no-heading-no-content` | 2.4.6 |
| `<iframe>` without `title` | `no-iframe-no-title` | 4.1.2 |
| Alt text contains "image", "photo" | `no-img-redundant-alt` | 1.1.1 |
| `accessKey` attribute | `no-access-key` | 2.1.4 |
| `scope` on `<td>` (only valid on `<th>`) | `no-scope-on-td` | 1.3.1 |
| `announce()` called outside `onMounted`/`watch`/handler | `no-announce-in-render` | 4.1.3 |

### ESLint — Angular templates

Base: `@angular-eslint/eslint-plugin-template`

Neighbor adds the same rule set as Vue, adapted for Angular's template AST (`[innerHTML]` instead of `dangerouslySetInnerHTML`). The `no-announce-in-render` rule also lints Angular component TypeScript files — see the setup instructions for how to configure it for `.ts` files alongside `.html` templates.

**Known limitation:** Angular's template parser does not attach parent pointers to AST nodes. Rules that need to walk up the tree (`no-summary-without-details`, `no-button-type-missing`, `no-log-with-interactive-children`, `no-menu-role-on-nav`, `no-heading-inside-interactive`) will silently pass in Angular templates. The `no-dynamic-content-without-live` rule only checks the element itself for Angular (no ancestor walk).

### Stylelint — CSS

| Rule | What it checks |
| --- | --- |
| `ulam/user-preferences` | Warns when motion, transparency, or alpha colors are used without `@media (prefers-*)` fallbacks |
| `ulam/no-outline-none` | Disallows bare `outline: none` or `outline: 0` outside `:focus` selectors |

## Rule severity

| Severity | Meaning |
| --- | --- |
| `error` | Definite AT breakage or HTML spec violation |
| `warn` | Strong guidance, occasional legitimate overrides exist |

All rules can be overridden in your config.

## See also

- [RULES.md](RULES.md) — full rule list with descriptions

## License

MIT

---

*Built with help from Claude.*
