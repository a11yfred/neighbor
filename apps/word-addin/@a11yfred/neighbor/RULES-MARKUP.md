# @a11yfred/neighbor  -  Markup Rules

ESLint rules for React / JSX, Vue SFCs, and Angular templates.

→ [CSS rules](RULES-CSS.md) · [Content rules](RULES-CONTENT.md) · [Back to RULES.md](RULES.md)

## Sources and credits

| Source | Reference |
| --- | --- |
| Adrian Roselli | [adrianroselli.com](https://adrianroselli.com) |
| Heydon Pickering | [heydonworks.com](https://heydonworks.com), [inclusive-components.design](https://inclusive-components.design) |
| Scott O'Hara | [scottohara.me](https://scottohara.me) |
| Patrick Lauke | [splintered.co.uk](https://splintered.co.uk), [patrickhlauke.github.io/aria](https://patrickhlauke.github.io/aria) |
| Karl Groves | [karlgroves.com](https://karlgroves.com) |
| Marcy Sutton | [marcysutton.com](https://marcysutton.com) |
| Eric Eggert | [yatil.net](https://yatil.net) |
| WAI-ARIA APG | [w3.org/WAI/ARIA/apg](https://www.w3.org/WAI/ARIA/apg/) |
| ARIA 1.2 spec | [w3.org/TR/wai-aria-1.2](https://www.w3.org/TR/wai-aria-1.2/) |
| WebAIM Million | [webaim.org/projects/million](https://webaim.org/projects/million/) |
| Deque / axe-core | deque.com  -  rule concepts reimplemented independently under MPL-2.0 |
| WCAG 2.1 | [w3.org/TR/WCAG21](https://www.w3.org/TR/WCAG21/) |
| WCAG 2.2 | [w3.org/TR/WCAG22](https://www.w3.org/TR/WCAG22/) |
| HTML Living Standard | [html.spec.whatwg.org](https://html.spec.whatwg.org/) |

---

## Core rules  -  all frameworks

All rules run on React, Vue, and Angular unless noted.

### Errors  -  definite breakage or phantom controls

| Rule | What it flags | Source |
| --- | --- | --- |
| `no-aria-label-on-generic` | `aria-label`/`aria-labelledby` on `<div>`, `<span>`, `<p>` with no `role`  -  AT ignores it | Roselli / O'Hara |
| `no-assertive-live-overuse` | `aria-live="assertive"` without `role="alert"`  -  interrupts user unexpectedly | [APG](https://www.w3.org/WAI/ARIA/apg/) / Sutton / Eggert |
| `no-unblocked-aria-disabled` | `aria-disabled="true"` on an interactive element that still has an `onClick`  -  clicks still fire | [ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) |
| `no-roles-without-name` | `role="region/dialog/alertdialog/application/marquee/searchbox"` without `aria-label`/`aria-labelledby` | [APG](https://www.w3.org/WAI/ARIA/apg/) / [ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) |
| `no-group-without-name` | `role="group"` containing form controls without an accessible name | [APG](https://www.w3.org/WAI/ARIA/apg/) / Groves  -  [SC 1.3.1](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships) |
| `no-presentation-on-focusable` | `role="presentation"/"none"` on a focusable element  -  phantom control | Roselli / Lauke / O'Hara  -  [SC 2.1.1](https://www.w3.org/WAI/WCAG21/Understanding/keyboard) |
| `no-log-with-interactive-children` | Interactive elements nested inside `role="log"` | [APG: Log Role](https://www.w3.org/WAI/ARIA/apg/patterns/) |
| `no-aria-hidden-in-link` | `<a>` whose only content is `aria-hidden` elements  -  phantom link with no name | Roselli  -  [SC 4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `no-redundant-aria-hidden-with-presentation` | `aria-hidden="true"` combined with `role="none"/"presentation"`  -  redundant | O'Hara |
| `no-aria-owns-on-void` | `aria-owns` on void elements (`<img>`, `<input>`, `<br>`, etc.)  -  meaningless | O'Hara / [ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) |
| `no-title-as-label` | `title` attribute as the sole accessible name on an `<input>`  -  not keyboard accessible | Groves / O'Hara  -  [SC 2.4.6](https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels) |
| `no-tabs-without-structure` | `role="tab"` without `aria-selected`; `role="tabpanel"` without `aria-labelledby`; `role="tablist"` without an accessible name | [APG: Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)  -  [SC 4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `no-positive-tabindex` | `tabIndex` value greater than 0  -  breaks natural DOM tab order | WebAIM / Lauke  -  [SC 2.4.3](https://www.w3.org/WAI/WCAG21/Understanding/focus-order) |
| `no-autoplay-without-controls` | `<video>`/`<audio autoPlay>` without `controls` | [SC 1.4.2](https://www.w3.org/WAI/WCAG21/Understanding/audio-control) |
| `no-heading-inside-interactive` | Heading elements (`<h1>`-`<h6>`) nested inside `<button>`, `<a>`, or interactive roles | Roselli / Pickering  -  [SC 4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `no-placeholder-only` | `<input placeholder>` with no `aria-label`, `aria-labelledby`, or paired `<label>`  -  WebAIM Million #3 failure | [WebAIM Million](https://webaim.org/projects/million/)  -  [SC 1.3.1](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships) |
| `no-empty-button` | `<button>` with only `aria-hidden` children and no accessible name | [WebAIM Million](https://webaim.org/projects/million/)  -  [SC 4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `no-image-role-without-name` | `role="img"` without `aria-label`/`aria-labelledby` | [APG](https://www.w3.org/WAI/ARIA/apg/) / O'Hara  -  [SC 4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `no-spinbutton-without-range` | `role="spinbutton"` missing `aria-valuenow`, `aria-valuemin`, or `aria-valuemax` | [ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) / [APG: Spinbutton](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/) |
| `no-slider-without-range` | `role="slider"` missing `aria-valuenow`, `aria-valuemin`, or `aria-valuemax` | [ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) / [APG: Slider](https://www.w3.org/WAI/ARIA/apg/patterns/slider/) |
| `no-combobox-without-expanded` | `role="combobox"` without `aria-expanded` | [ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) / [APG: Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) |
| `no-mouse-only-events` | `onMouseEnter`/`onMouseLeave`/`onMouseOver`/`onMouseOut` without `onFocus`/`onBlur` equivalents | [SC 2.1.1](https://www.w3.org/WAI/WCAG21/Understanding/keyboard) |
| `no-listbox-without-option` | `role="listbox"` with no `role="option"` children | [ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) / [APG: Listbox](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/) |
| `no-tree-without-treeitem` | `role="tree"` with no `role="treeitem"` children | [ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) / [APG: Tree View](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/) |
| `no-feed-without-article` | `role="feed"` with no `role="article"` children | [ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) / [APG: Feed](https://www.w3.org/WAI/ARIA/apg/patterns/feed/) |
| `no-aria-activedescendant-without-id` | `aria-activedescendant` with an empty or missing static ID | [ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/)  -  [SC 4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `no-duplicate-id` | Duplicate `id` values on elements referenced by `aria-labelledby`/`describedby`/`controls`/`owns`/`activedescendant` | [SC 1.3.1](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships) / [SC 4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `no-summary-without-details` | `<summary>` outside `<details>`  -  phantom interactive element | [HTML spec](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-summary-element)  -  [SC 2.1.1](https://www.w3.org/WAI/WCAG21/Understanding/keyboard) |
| `no-aria-required-on-non-form` | `aria-required` on an element whose role doesn't support it  -  AT ignores it | [ARIA 1.2 §6.6.9](https://www.w3.org/TR/wai-aria-1.2/#aria-required)  -  [SC 4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `no-input-type-invalid` | `<input type="X">` with an invalid type  -  silently falls back to `type="text"` | [HTML spec §4.10.18](https://html.spec.whatwg.org/multipage/input.html#the-input-element)  -  [SC 1.3.5](https://www.w3.org/WAI/WCAG21/Understanding/identify-input-purpose) |
| `no-labelledby-missing-target` | `aria-labelledby`/`describedby`/`controls`/`owns`/`activedescendant` referencing an `id` that doesn't exist in the file | [ARIA 1.2 §6.2.4](https://www.w3.org/TR/wai-aria-1.2/#mapping_additional_nd_name)  -  [SC 4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `no-dynamic-content-without-live` | `dangerouslySetInnerHTML` / `v-html` / `[innerHTML]` on an element outside a live region | [SC 4.1.3](https://www.w3.org/WAI/WCAG21/Understanding/status-messages) |
| `form-field-multiple-labels` | Multiple `<label for="…">` elements targeting the same input | [SC 1.3.1](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships) |
| `no-empty-table-header` | `<th>` or `role="columnheader"/"rowheader"` with no accessible text or `aria-label` | [SC 1.3.1](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships) |
| `prefer-aria-disabled` | HTML `disabled` removes element from tab order; `aria-disabled` keeps it discoverable | Roselli: Don't Disable Form Controls  -  [SC 2.1.1](https://www.w3.org/WAI/WCAG21/Understanding/keyboard) |
| `no-disabled-and-aria-disabled` | Element has both `disabled` and `aria-disabled`  -  causes conflicting states in assistive tech | [ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) |

### Warnings  -  on by default

| Rule | What it flags | Source |
| --- | --- | --- |
| `no-tooltip-role-misuse` | `role="tooltip"` without an `id`; or `role="tooltip"` on an interactive element | [APG: Tooltip Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/)  -  [SC 4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `no-menu-role-on-nav` | Menu/menubar/menuitem roles  -  triggers AT application-mode keyboard handling; especially wrong on `<nav>` | Roselli / Lauke / Groves  -  [SC 2.1.1](https://www.w3.org/WAI/WCAG21/Understanding/keyboard) |
| `no-button-type-missing` | `<button>` inside a `<form>` without an explicit `type`  -  defaults to `type="submit"` | [HTML spec §4.10.18](https://html.spec.whatwg.org/multipage/form-elements.html#the-button-element) |

### Off by default  -  opt in

These rules flag real problems but generate enough noise in typical codebases that they ship off. Enable individually.

| Rule | What it flags | Source |
| --- | --- | --- |
| `no-application-role` | `role="application"`  -  disables AT browse mode | Roselli / Sutton / Lauke / [APG](https://www.w3.org/WAI/ARIA/apg/) |
| `no-grid-role` | `role="grid"`  -  almost always wrong outside spreadsheet-like widgets | Roselli: ARIA Grid As an Anti-Pattern |
| `no-aria-roledescription` | `aria-roledescription`  -  overrides AT role label, does not auto-translate | Roselli: Avoid aria-roledescription |
| `no-aria-readonly` | `aria-readonly`  -  limited and inconsistent AT support | Roselli |
| `no-tab-without-controls` | `role="tab"` without `aria-controls` | [APG: Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) |
| `no-href-hash` | `<a href="#">` used as a button | Sutton: Links vs Buttons  -  [SC 2.1.1](https://www.w3.org/WAI/WCAG21/Understanding/keyboard) |
| `warn-role-alert` | `role="alert"`  -  prefer `role="status"` for non-urgent updates | [APG](https://www.w3.org/WAI/ARIA/apg/) / Roselli / Sutton  -  [SC 4.1.3](https://www.w3.org/WAI/WCAG21/Understanding/status-messages) |
| `no-target-blank-without-label` | `target="_blank"` without communicating the new-tab behaviour | WebAIM  -  [SC 3.2.2](https://www.w3.org/WAI/WCAG21/Understanding/on-input) |
| `no-dialog-without-close` | `role="dialog"` or `<dialog>` without a visible close button | [APG: Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)  -  [SC 2.1.2](https://www.w3.org/WAI/WCAG21/Understanding/no-keyboard-trap) |

---

## Portability rules  -  Vue and Angular only

These rules cover gaps in `eslint-plugin-jsx-a11y` that have no equivalent in `eslint-plugin-vuejs-accessibility` or `@angular-eslint/eslint-plugin-template`. React projects get these from jsx-a11y already.

| Rule | What it flags | Source |
| --- | --- | --- |
| `no-anchor-ambiguous-text` | Ambiguous link text ("click here", "read more", "learn more") | [SC 2.4.4](https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context) |
| `no-anchor-no-content` | `<a>` with no text content and no accessible name | [SC 4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `no-aria-activedescendant-no-tabindex` | `aria-activedescendant` on an element without `tabindex` | [ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) |
| `no-invalid-aria-prop-value` | Invalid values on ARIA state/property attributes | [SC 4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `no-autocomplete-invalid` | Invalid `autocomplete` token values | [SC 1.3.5](https://www.w3.org/WAI/WCAG21/Understanding/identify-input-purpose) |
| `no-heading-no-content` | Headings (`<h1>`-`<h6>`) with no text content | [SC 2.4.6](https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels) |
| `no-iframe-no-title` | `<iframe>` without a `title` attribute | [SC 4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `no-img-redundant-alt` | Alt text containing "image", "photo", or "picture" | [SC 1.1.1](https://www.w3.org/WAI/WCAG21/Understanding/non-text-content) |
| `no-access-key` | `accessKey` attribute  -  conflicts with AT and browser shortcuts | [SC 2.1.4](https://www.w3.org/WAI/WCAG21/Understanding/character-key-shortcuts) |
| `no-noninteractive-to-interactive-role` | Non-interactive elements given interactive ARIA roles without keyboard handlers | [SC 2.1.1](https://www.w3.org/WAI/WCAG21/Understanding/keyboard) / [SC 4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `no-noninteractive-tabindex` | `tabindex` on a non-interactive element with no interactive role | [SC 2.1.1](https://www.w3.org/WAI/WCAG21/Understanding/keyboard) |
| `prefer-semantic-element` | `<div role="button">` where a native element would be correct | [SC 4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value) |
| `no-role-supports-aria-props` | ARIA properties applied to roles that don't support them | [ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) |
| `no-scope-on-td` | `scope` attribute on `<td>`  -  only valid on `<th>` | [SC 1.3.1](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships) |

---

## Framework-specific rules  -  @ulam only

These rules are specific to the @ulam framework and activate only when @ulam-related imports are detected.

| Rule | Severity | What it flags |
| --- | --- | --- |
| `no-announce-in-render` | error | `announce()` / `clearAnnouncements()` called in a component render body or Vue setup  -  fires on every render, spamming screen readers. Safe contexts: `useEffect` / `onMounted` / `watch` / event handlers |
| `no-hash-router-in-remix` | warn | @ulam hash router alongside `react-router`  -  signals an incomplete Remix migration |
| `no-use-page-title-in-remix` | warn | `usePageTitle()` alongside `react-router`  -  conflicts with Remix's declarative `meta` export |

The `no-announce-in-render` rule runs in all three plugins with safe contexts per framework:

- **React:** `useEffect`, `useLayoutEffect`, `useCallback`, `useMemo`, and event handlers
- **Vue:** `onMounted`, `onUpdated`, `watch`, `watchEffect`, `nextTick`, and their variants
- **Angular:** `ngOnInit`, `ngAfterViewInit`, `ngAfterContentInit`, `ngOnChanges`, `ngDoCheck`, and class method event handlers

**Known Angular limitation:** Angular's template parser does not attach parent pointers to AST nodes. Rules that walk up the tree (`no-summary-without-details`, `no-button-type-missing`, `no-log-with-interactive-children`, `no-menu-role-on-nav`, `no-heading-inside-interactive`) will silently pass in Angular templates. The `no-dynamic-content-without-live` rule only checks the element itself (no ancestor walk) in Angular.

---

## Rules considered and rejected

| Rule | Reason rejected |
| --- | --- |
| `no-aria-controls` | Support improved substantially since Pickering's 2014 post; APG *requires* it in the tabs pattern  -  conflicted with `no-tabs-without-structure` |
| `no-aria-label-on-link` | `aria-label` on `<a>` is the correct technique for ambiguous link text; can't detect the bad case (overriding good visible text) statically |
| `no-aria-live-on-carousel` | Class-name heuristic  -  `carousel` in a class doesn't mean auto-advancing; too many false positives |
| `no-figure-role-without-label` | `role="figure"` on `<figure>` is redundant (element already has the role implicitly); flags the wrong thing |
| `no-scrollable-without-focusable` | Class-name heuristic for scroll behaviour  -  can't read CSS from static analysis |
| `no-empty-heading` | Covered by jsx-a11y recommended |
| `aria-required-on-required-form-control` | AT already reads native `required`; adding `aria-required` is redundant, not required |
| `require-menu-owned-menuitem` / `require-listbox-owned-option` | Component-based code renders children conditionally  -  fires constantly on empty/loading states |
| `no-aria-owns-circular` | Cross-file ID graph required; vanishingly rare in practice |
| `no-dialog-without-modal` | Non-modal dialogs are a valid APG pattern; too much false-positive risk |
| `no-generated-content-text` | Decorative generated content is extremely common; can't distinguish decorative from meaningful statically |
| DevTools console output for accessibility | Requires runtime execution; belongs in a browser devtools extension, not a static linter |
