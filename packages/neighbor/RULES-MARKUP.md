# @A11yfred/neighbor: Markup Rules

ESLint rules for React, Remix, Vue, Angular, Lit, and plain HTML.

→ [CSS rules](RULES-CSS.md) · [Content rules](RULES-CONTENT.md) · [Back to RULES.md](RULES.md)

## Sources and Credits

| Source | Reference |
| --- | --- |
| Adrian Roselli | [adrianroselli.com](https://adrianroselli.com) |
| ARIA 1.2 spec | [w3.org/TR/wai-aria-1.2](https://www.w3.org/TR/wai-aria-1.2/) |
| Deque / axe-core | deque.com: rule concepts reimplemented independently under MPL-2.0 |
| Eric Eggert | [yatil.net](https://yatil.net) |
| Heydon Pickering | [heydonworks.com](https://heydonworks.com), [inclusive-components.design](https://inclusive-components.design) |
| HTML Living Standard | [html.spec.whatwg.org](https://html.spec.whatwg.org/) |
| Karl Groves | [karlgroves.com](https://karlgroves.com) |
| Marcy Sutton | [marcysutton.com](https://marcysutton.com) |
| Patrick Lauke | [splintered.co.uk](https://splintered.co.uk), [patrickhlauke.github.io/aria](https://patrickhlauke.github.io/aria) |
| Scott O'Hara | [scottohara.me](https://scottohara.me) |
| WAI-ARIA APG | [w3.org/WAI/ARIA/apg](https://www.w3.org/WAI/ARIA/apg/) |
| WCAG 2.1 | [w3.org/TR/WCAG21](https://www.w3.org/TR/WCAG21/) |
| WCAG 2.2 | [w3.org/TR/WCAG22](https://www.w3.org/TR/WCAG22/) |
| WebAIM Million | [webaim.org/projects/million](https://webaim.org/projects/million/) |

---

## Core Rules: All Frameworks

All rules run on React, Remix, Vue, Angular, and Web Components unless noted.

### Errors (You Must Fix These)

| Rule | What it finds | Source |
| --- | --- | --- |
| `form-field-multiple-labels` | More than one `<label>` pointing to the same `<input>`. | [SC 1.3.1](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships) |
| `no-aria-activedescendant-without-id` | `aria-activedescendant` without a valid ID. | [ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) - [SC 4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `no-aria-hidden-in-link` | A link (`<a>`) that only contains hidden elements. It has no name. | Roselli - [SC 4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `no-aria-hidden-on-main` | Using `aria-hidden="true"` on `<body>` or `<main>`. This hides your whole app. | [APG](https://www.w3.org/WAI/ARIA/apg/) |
| `no-aria-label-on-generic` | `aria-label` or `aria-labelledby` on `<div>`, `<span>`, or `<p>` without a `role`. Screen readers ignore this. | Roselli / O'Hara |
| `no-aria-owns-on-void` | Using `aria-owns` on elements that cannot have children (like `<img>` or `<input>`). | O'Hara / [ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) |
| `no-aria-required-on-non-form` | Using `aria-required` on something that is not a form input. | [ARIA 1.2 §6.6.9](https://www.w3.org/TR/wai-aria-1.2/#aria-required) - [SC 4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `no-assertive-live-overuse` | `aria-live="assertive"` without `role="alert"`. This interrupts the user when they do not expect it. | [APG](https://www.w3.org/WAI/ARIA/apg/) / Sutton / Eggert |
| `no-autoplay-without-controls` | Autoplaying video or audio without giving the user controls to stop it. | [SC 1.4.2](https://www.w3.org/WAI/WCAG21/Understanding/audio-control) |
| `no-combobox-without-expanded` | `role="combobox"` without `aria-expanded`. | [ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) / [APG: Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) |
| `no-disabled-and-aria-disabled` | Using both `disabled` and `aria-disabled` at the same time. | [ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) |
| `no-duplicate-id` | Using the same `id` twice when ARIA is trying to point to it. | [SC 1.3.1](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships) / [SC 4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `no-dynamic-content-without-live` | Adding HTML dynamically without using a live region to tell the screen reader. | [SC 4.1.3](https://www.w3.org/WAI/WCAG21/Understanding/status-messages) |
| `no-empty-button` | A `<button>` that only has hidden children and no name. | [WebAIM Million](https://webaim.org/projects/million/) - [SC 4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `no-empty-table-header` | A table header (`<th>`) with no text. | [SC 1.3.1](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships) |
| `no-feed-without-article` | `role="feed"` without any `role="article"` inside it. | [ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) / [APG: Feed](https://www.w3.org/WAI/ARIA/apg/patterns/feed/) |
| `no-group-without-name` | `role="group"` with form inputs, but no accessible name. | [APG](https://www.w3.org/WAI/ARIA/apg/) / Groves - [SC 1.3.1](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships) |
| `no-heading-inside-interactive` | Putting a heading inside a button or link. | Roselli / Pickering - [SC 4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `no-image-role-without-name` | `role="img"` without an accessible name. | [APG](https://www.w3.org/WAI/ARIA/apg/) / O'Hara - [SC 4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `no-input-type-invalid` | Using an `<input>` type that does not exist. | [HTML spec §4.10.18](https://html.spec.whatwg.org/multipage/input.html#the-input-element) - [SC 1.3.5](https://www.w3.org/WAI/WCAG21/Understanding/identify-input-purpose) |
| `no-labelledby-missing-target` | ARIA pointing to an `id` that does not exist. | [ARIA 1.2 §6.2.4](https://www.w3.org/TR/wai-aria-1.2/#mapping_additional_nd_name) - [SC 4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `no-listbox-without-option` | `role="listbox"` without any `role="option"` inside it. | [ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) / [APG: Listbox](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/) |
| `no-log-with-interactive-children` | Buttons or links inside `role="log"`. | [APG: Log Role](https://www.w3.org/WAI/ARIA/apg/patterns/) |
| `no-meter-without-valuenow` | `role="meter"` missing `aria-valuenow`. | [APG: Meter](https://www.w3.org/WAI/ARIA/apg/patterns/meter/) |
| `no-mouse-only-events` | Using mouse events (like `onMouseEnter`) without adding keyboard events (like `onFocus`). | [SC 2.1.1](https://www.w3.org/WAI/WCAG21/Understanding/keyboard) |
| `no-placeholder-only` | Using only a `placeholder` to label an `<input>`. | [WebAIM Million](https://webaim.org/projects/million/) - [SC 1.3.1](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships) |
| `no-positive-tabindex` | Using a `tabIndex` greater than 0. This breaks the normal keyboard tab order. | WebAIM / Lauke - [SC 2.4.3](https://www.w3.org/WAI/WCAG21/Understanding/focus-order) |
| `no-presentation-on-focusable` | Using `role="presentation"` on something you can focus on. | Roselli / Lauke / O'Hara - [SC 2.1.1](https://www.w3.org/WAI/WCAG21/Understanding/keyboard) |
| `no-roles-without-name` | Using `role="dialog"` or similar roles without giving them an accessible name. | [APG](https://www.w3.org/WAI/ARIA/apg/) / [ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) |
| `no-slider-without-range` | `role="slider"` missing range values (`aria-valuenow`, etc.). | [ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) / [APG: Slider](https://www.w3.org/WAI/ARIA/apg/patterns/slider/) |
| `no-spinbutton-without-range` | `role="spinbutton"` missing range values (`aria-valuenow`, etc.). | [ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) / [APG: Spinbutton](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/) |
| `no-summary-without-details` | Using `<summary>` outside of a `<details>` element. | [HTML spec](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-summary-element) - [SC 2.1.1](https://www.w3.org/WAI/WCAG21/Understanding/keyboard) |
| `no-tabs-without-structure` | Missing pieces in a tab menu (like a tab without `aria-selected`). | [APG: Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) - [SC 4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `no-title-as-label` | Using only the `title` attribute to name an `<input>`. Keyboard users cannot see this. | Groves / O'Hara - [SC 2.4.6](https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels) |
| `no-toggle-without-checked` | A switch, checkbox, or radio button missing `aria-checked`. | [APG: Checkbox](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/) |
| `no-tree-without-treeitem` | `role="tree"` without any `role="treeitem"` inside it. | [ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) / [APG: Tree View](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/) |
| `no-unblocked-aria-disabled` | `aria-disabled="true"` on a button or link that still has an `onClick`. The button still works even though it says it is disabled. | [ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) |

### Warnings (These Are Usually Bad)

| Rule | What it finds | Source |
| --- | --- | --- |
| `no-button-type-missing` | A `<button>` inside a `<form>` missing `type="button"` or `type="submit"`. | [HTML spec §4.10.18](https://html.spec.whatwg.org/multipage/form-elements.html#the-button-element) |
| `no-expanded-without-controls` | `aria-expanded` without `aria-controls`. | [APG: Disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) |
| `no-menu-role-on-nav` | Using menu roles (like `role="menu"`). This changes how keyboards work and is usually wrong. | Roselli / Lauke / Groves - [SC 2.1.1](https://www.w3.org/WAI/WCAG21/Understanding/keyboard) |
| `no-multiple-main` | Having more than one `<main>` element. | [Axe: landmark-one-main](https://dequeuniversity.com/rules/axe/4.8/landmark-one-main) |
| `no-redundant-aria-hidden-with-presentation` | Using both `aria-hidden="true"` and `role="presentation"`. You only need one. | O'Hara |
| `no-skipped-heading-levels` | Skipping heading levels (like going from `<h1>` straight to `<h3>`). | [Axe: heading-order](https://dequeuniversity.com/rules/axe/4.8/heading-order) - [SC 1.3.1](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships) |
| `no-tooltip-role-misuse` | `role="tooltip"` without an `id`, or putting it on a button/link. | [APG: Tooltip Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/) - [SC 4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |

> **Note on components:** `no-skipped-heading-levels` and `no-multiple-main` are only checked in a single file. They cannot promise that your headings are perfect across your entire app. To test the whole app, use a tool like `@axe-core/react`.

### Off by Default (You Can Turn These On)

These rules find real problems, but they complain a lot in most projects. You can turn them on if you want.

| Rule | What it finds | Source |
| --- | --- | --- |
| `no-application-role` | `role="application"` (disables normal screen reader reading). | Roselli / Sutton / Lauke / [APG](https://www.w3.org/WAI/ARIA/apg/) |
| `no-aria-readonly` | `aria-readonly` (screen readers do not support this well). | Roselli |
| `no-aria-roledescription` | `aria-roledescription` (does not translate to other languages). | Roselli: Avoid aria-roledescription |
| `no-dialog-without-close` | A dialog without a close button. | [APG: Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) - [SC 2.1.2](https://www.w3.org/WAI/WCAG21/Understanding/no-keyboard-trap) |
| `no-grid-role` | `role="grid"` (almost always wrong unless building a spreadsheet). | Roselli: ARIA Grid As an Anti-Pattern |
| `no-href-hash` | Using `<a href="#">` instead of a `<button>`. | Sutton: Links vs Buttons - [SC 2.1.1](https://www.w3.org/WAI/WCAG21/Understanding/keyboard) |
| `no-tab-without-controls` | `role="tab"` missing `aria-controls`. | [APG: Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) |
| `no-target-blank-without-label` | Using `target="_blank"` without telling the user it will open a new tab. | WebAIM - [SC 3.2.2](https://www.w3.org/WAI/WCAG21/Understanding/on-input) |
| `prefer-aria-disabled` | Using HTML `disabled` (which hides it from the keyboard). You should use `aria-disabled` instead. | Roselli: Don't Disable Form Controls - [SC 2.1.1](https://www.w3.org/WAI/WCAG21/Understanding/keyboard) |
| `warn-role-alert` | Using `role="alert"`. You should use `role="status"` for things that are not urgent. | [APG](https://www.w3.org/WAI/ARIA/apg/) / Roselli / Sutton - [SC 4.1.3](https://www.w3.org/WAI/WCAG21/Understanding/status-messages) |

---

## Portability Rules: Vue and Angular Only

These rules cover gaps in `eslint-plugin-jsx-a11y` that have no equivalent in `eslint-plugin-vuejs-accessibility` or `@angular-eslint/eslint-plugin-template`. React projects get these from jsx-a11y already.

| Rule | What it flags | Source |
| --- | --- | --- |
| `no-access-key` | `accessKey` attribute - conflicts with AT and browser shortcuts | [SC 2.1.4](https://www.w3.org/WAI/WCAG21/Understanding/character-key-shortcuts) |
| `no-anchor-ambiguous-text` | Ambiguous link text ("click here", "read more", "learn more") | [SC 2.4.4](https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context) |
| `no-anchor-no-content` | `<a>` with no text content and no accessible name | [SC 4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `no-aria-activedescendant-no-tabindex` | `aria-activedescendant` on an element without `tabindex` | [ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) |
| `no-autocomplete-invalid` | Invalid `autocomplete` token values | [SC 1.3.5](https://www.w3.org/WAI/WCAG21/Understanding/identify-input-purpose) |
| `no-heading-no-content` | Headings (`<h1>`-`<h6>`) with no text content | [SC 2.4.6](https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels) |
| `no-iframe-no-title` | `<iframe>` without a `title` attribute | [SC 4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `no-img-redundant-alt` | Alt text containing "image", "photo", or "picture" | [SC 1.1.1](https://www.w3.org/WAI/WCAG21/Understanding/non-text-content) |
| `no-invalid-aria-prop-value` | Invalid values on ARIA state/property attributes | [SC 4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `no-noninteractive-tabindex` | `tabindex` on a non-interactive element with no interactive role | [SC 2.1.1](https://www.w3.org/WAI/WCAG21/Understanding/keyboard) |
| `no-noninteractive-to-interactive-role` | Non-interactive elements given interactive ARIA roles without keyboard handlers | [SC 2.1.1](https://www.w3.org/WAI/WCAG21/Understanding/keyboard) / [SC 4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `no-role-supports-aria-props` | ARIA properties applied to roles that do not support them | [ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) |
| `no-scope-on-td` | `scope` attribute on `<td>` - only valid on `<th>` | [SC 1.3.1](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships) |
| `prefer-semantic-element` | `<div role="button">` where a native element would be correct | [SC 4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |

## Framework-specific Rules: React, Vue, Angular, Remix, Lit

These rules apply only to specific frameworks using their respective parser plugins.

| Rule | Severity | What it finds |
| --- | --- | --- |
| `angular-host-a11y` | error | Setting `role: 'button'` on an Angular component without setting a `tabindex`. |
| `lit-no-autofocus` | error | Using `autofocus` inside a Lit `html` template. |
| `remix-route-title-missing` | error | Remix route missing a `title` in its `meta` export. |
| `vue-click-key-events` | error | Adding `@click` to something that is not a button, but forgetting to add keyboard events. |
| `react-fragment-ruins-aria` | warn | React `<Fragment>` (or `<>`) with ARIA attributes. The attributes get deleted when the HTML is created. |
| `react-spa-focus-management` | warn | Using `useNavigate` or `<Link>` without managing focus. Keyboard users get lost when the page changes. |
| `vue-transition-live-region` | warn | `<Transition>` around a live region. Screen readers will not announce this correctly. |
| `angular-router-focus-management` | off | `<router-outlet>` without managing focus when the page changes. |
| `vue-router-focus-management` | off | `<RouterView>` without managing focus or using `aria-live`. |

## Framework-Specific Omissions

Neighbor is designed to run alongside standard accessibility linters (like `eslint-plugin-jsx-a11y`, `eslint-plugin-vuejs-accessibility`, `@angular-eslint/eslint-plugin-template`, and `eslint-plugin-lit-a11y`).

If you have these standard linters installed, Neighbor will automatically **turn off** its own redundant base rules to prevent duplicate warnings. If you choose *not* to install the standard linters, Neighbor will keep these base rules enabled to protect your codebase.

### Vue (`Eslint-plugin-vuejs-accessibility`)

Omitted base rules: `no-heading-no-content`, `no-iframe-no-title`, `no-access-key`, `no-img-redundant-alt`, `no-anchor-no-content`, `no-invalid-aria-prop-value`, `no-role-supports-aria-props`.

### Angular (`@Angular-eslint/eslint-plugin-template`)

Omitted base rules: `no-heading-no-content`, `no-anchor-no-content`, `no-img-redundant-alt`, `no-scope-on-td`, `no-invalid-aria-prop-value`.

### Lit (`Eslint-plugin-lit-a11y`)

Omitted base rules: `no-heading-no-content`, `no-iframe-no-title`, `no-img-redundant-alt`, `no-access-key`, `no-aria-activedescendant-no-tabindex`, `no-anchor-no-content`, `no-invalid-aria-prop-value`, `no-role-supports-aria-props`, `no-scope-on-td`.

---

## Vue / Angular / Lit Specific Rules

These rules are added specifically to handle framework-specific ASTs or behaviors.

| Rule | What it finds | Framework |
| --- | --- | --- |
| `angular-host-a11y` | Angular component missing `tabindex` for interactive host role | Angular |
| `angular-router-focus-management` | SPA route without focus management | Angular |
| `lit-no-autofocus` | `autofocus` attribute used inside a Lit template | Lit |
| `no-access-key` | `accessKey` attribute | Vue, Angular, Lit |
| `no-anchor-ambiguous-text` | Ambiguous link text ("click here") | Vue, Angular |
| `no-anchor-no-content` | `<a>` with no content | Vue, Angular |
| `no-aria-activedescendant-no-tabindex` | `aria-activedescendant` without `tabindex` | Vue, Angular |
| `no-autocomplete-invalid` | Invalid `autocomplete` token | Vue, Angular |
| `no-heading-no-content` | Heading with no content | Vue, Angular |
| `no-iframe-no-title` | `<iframe>` with no `title` | Vue, Angular |
| `no-img-redundant-alt` | `<img>` alt text contains "image of" | Vue, Angular |
| `no-invalid-aria-prop-value` | Invalid ARIA attribute values | Vue, Angular |
| `no-noninteractive-tabindex` | Non-interactive element with `tabindex` | Vue, Angular |
| `no-noninteractive-to-interactive-role` | Non-interactive element with interactive role | Vue, Angular |
| `no-role-supports-aria-props` | Using an ARIA attribute not supported by the role | Vue, Angular |
| `no-scope-on-td` | `scope` on `<td>` | Vue, Angular, Lit |
| `prefer-semantic-element` | Use native HTML tags instead of roles | Vue, Angular |
| `vue-click-key-events` | `v-on:click` without key equivalent | Vue |
| `vue-router-focus-management` | SPA route without focus management | Vue |
| `vue-transition-live-region` | `<Transition>` changing live regions | Vue |

---

## Framework-specific Rules: @Ulam Only

These rules are specific to the @ulam framework and activate only when @ulam-related imports are detected.

| Rule | Severity | What it finds |
| --- | --- | --- |
| `no-announce-in-render` | error | Calling `announce()` during a render. This will spam screen readers. Only call it inside `useEffect`, `onMounted`, or event handlers. |
| `no-hash-router-in-remix` | warn | Using the @ulam hash router with `react-router`. This means your Remix migration is not finished. |
| `no-use-page-title-in-remix` | warn | Using `usePageTitle()` with `react-router`. This breaks Remix's `meta` export. |

The `no-announce-in-render` rule runs in React, Vue, and Angular plugins with safe contexts per framework:

- **React:** `useEffect`, `useLayoutEffect`, `useCallback`, `useMemo`, and event handlers
- **Vue:** `onMounted`, `onUpdated`, `watch`, `watchEffect`, `nextTick`, and their variants
- **Angular:** `ngOnInit`, `ngAfterViewInit`, `ngAfterContentInit`, `ngOnChanges`, `ngDoCheck`, and class method event handlers

**Known problems with parsers:**

- **Angular templates:** The parser does not let us look up the tree. Some rules that need to look at parent elements will not work in Angular.
- **Web Components:** The `@html-eslint/parser` has the same problem. Rules cannot look at parent elements.

---

## Rules Considered and Rejected

| Rule | Reason rejected |
| --- | --- |
| `aria-required-on-required-form-control` | Screen readers already know what HTML `required` means. Adding `aria-required` is not needed. |
| DevTools console output for accessibility | This belongs in a browser extension, not a code linter. |
| `no-aria-controls` | Screen reader support is better now. It is required for tabs. |
| `no-aria-label-on-link` | Using `aria-label` on `<a>` is the right way to fix bad link text. A linter cannot check if you are doing it correctly. |
| `no-aria-live-on-carousel` | Just because a class says `carousel` does not mean it moves by itself. This gives too many false errors. |
| `no-aria-owns-circular` | This requires checking across different files, which is too hard for a simple linter. |
| `no-dialog-without-modal` | Non-modal dialogs are allowed. This would give too many false errors. |
| `no-empty-heading` | Another plugin (`jsx-a11y`) already checks this. |
| `no-figure-role-without-label` | Putting `role="figure"` on a `<figure>` is redundant. It flags the wrong problem. |
| `no-generated-content-text` | We cannot tell if CSS generated content is decorative or important. |
| `no-scrollable-without-focusable` | We cannot read CSS to see if an element scrolls. |
| `require-menu-owned-menuitem` / `require-listbox-owned-option` | In React/Vue, children are often hidden while loading. This would give too many false errors. |
