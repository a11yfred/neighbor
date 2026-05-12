# @a11yfred/neighbor — Rule Reference

Complete catalogue of all rules across the ESLint and Stylelint plugins.

## Sources and credits

| Source | Reference |
|---|---|
| Adrian Roselli | adrianroselli.com |
| Heydon Pickering | heydonworks.com, inclusive-components.design |
| Scott O'Hara | scottohara.me |
| Patrick Lauke | splintered.co.uk, patrickhlauke.github.io/aria |
| Karl Groves | karlgroves.com |
| Marcy Sutton | marcysutton.com |
| Eric Eggert | yatil.net |
| WAI-ARIA APG | w3.org/WAI/ARIA/apg |
| ARIA 1.2 spec | w3.org/TR/wai-aria-1.2 |
| WebAIM Million | webaim.org/projects/million |
| Deque / axe-core | deque.com — rule concepts reimplemented under MPL-2.0 |
| WCAG 2.1 / 2.2 | w3.org/TR/WCAG21, w3.org/TR/WCAG22 |
| double-great/stylelint-a11y | github.com/double-great/stylelint-a11y |

---

## ESLint rules (`neighbor-eslint.mjs`, `neighbor-eslint-vue.mjs`, `neighbor-eslint-angular.mjs`)

All rules share the same logic via `lib/rules.js` with framework-specific AST helpers.

### Errors — definite breakage or phantom controls

| Rule | What it flags | Source |
|---|---|---|
| `no-aria-label-on-generic` | `aria-label`/`aria-labelledby` on `<div>`, `<span>`, `<p>` with no `role` — AT ignores it | Roselli / O'Hara |
| `no-assertive-live-overuse` | `aria-live="assertive"` without `role="alert"` — interrupts user unexpectedly | APG / Sutton / Eggert |
| `no-unblocked-aria-disabled` | `aria-disabled="true"` on an interactive element that still has an `onClick` — clicks still fire | ARIA 1.2 |
| `no-roles-without-name` | `role="region/dialog/alertdialog/application/marquee/searchbox"` without `aria-label`/`aria-labelledby` | APG / ARIA 1.2 |
| `no-group-without-name` | `role="group"` containing form controls without an accessible name | APG / Groves — WCAG 1.3.1 |
| `no-presentation-on-focusable` | `role="presentation"/"none"` on a focusable element — phantom control | Roselli / Lauke / O'Hara — WCAG 2.1 SC 2.1.1 |
| `no-log-with-interactive-children` | Interactive elements (`<button>`, `<input>`, etc.) nested inside `role="log"` | APG: Log Role |
| `no-aria-hidden-in-link` | `<a>` whose only content is `aria-hidden` elements — phantom link with no name | Roselli |
| `no-redundant-aria-hidden-with-presentation` | `aria-hidden="true"` combined with `role="none"/"presentation"` — redundant | O'Hara |
| `no-aria-owns-on-void` | `aria-owns` on void elements (`<img>`, `<input>`, `<br>`, etc.) — meaningless | O'Hara / ARIA 1.2 |
| `no-title-as-label` | `title` attribute as the sole accessible name on an `<input>` — not keyboard accessible | Groves / O'Hara |
| `no-tabs-without-structure` | `role="tab"` without `aria-selected`; `role="tabpanel"` without `aria-labelledby`; `role="tablist"` without an accessible name | APG: Tabs Pattern |
| `no-positive-tabindex` | `tabIndex` value greater than 0 — breaks natural DOM tab order | WebAIM / Lauke |
| `no-autoplay-without-controls` | `<video>`/`<audio autoPlay>` without `controls` | WCAG 1.4.2 / WebAIM / Deque axe-core |
| `no-heading-inside-interactive` | Heading elements (`<h1>`–`<h6>`) nested inside `<button>`, `<a>`, or interactive roles | Roselli / Pickering |
| `no-placeholder-only` | `<input placeholder>` with no `aria-label`, `aria-labelledby`, or paired `<label>` — WebAIM Million #3 failure | WebAIM Million / WCAG 1.3.1 |
| `no-empty-button` | `<button>` with only `aria-hidden` children and no accessible name | WebAIM Million #2 / WCAG 4.1.2 / Deque axe-core |
| `no-image-role-without-name` | `role="img"` without `aria-label`/`aria-labelledby` | APG / O'Hara — WCAG 4.1.2 |
| `no-spinbutton-without-range` | `role="spinbutton"` missing `aria-valuenow`, `aria-valuemin`, or `aria-valuemax` | ARIA 1.2 / APG: Spinbutton |
| `no-slider-without-range` | `role="slider"` missing `aria-valuenow`, `aria-valuemin`, or `aria-valuemax` | ARIA 1.2 / APG: Slider |
| `no-combobox-without-expanded` | `role="combobox"` without `aria-expanded` | ARIA 1.2 / APG: Combobox |
| `no-mouse-only-events` | `onMouseEnter`/`onMouseLeave`/`onMouseOver`/`onMouseOut` without `onFocus`/`onBlur` equivalents | WCAG 2.1.1 / MDN |
| `no-listbox-without-option` | `role="listbox"` with no `role="option"` children | ARIA 1.2 / APG |
| `no-tree-without-treeitem` | `role="tree"` with no `role="treeitem"` children | ARIA 1.2 / APG |
| `no-feed-without-article` | `role="feed"` with no `role="article"` children | ARIA 1.2 / APG |
| `no-aria-activedescendant-without-id` | `aria-activedescendant` with an empty or missing static ID | ARIA 1.2 / SC 4.1.2 |
| `no-duplicate-id` | Duplicate `id` values on elements referenced by `aria-labelledby`/`describedby`/`controls`/`owns`/`activedescendant` — AT uses first match | axe-core duplicate-id-aria / SC 1.3.1 / 4.1.2 |
| `no-summary-without-details` | `<summary>` outside `<details>` — phantom interactive element | HTML spec / SC 2.1.1 / 4.1.2 |
| `no-aria-required-on-non-form` | `aria-required` on an element whose role doesn't support it — AT ignores it | ARIA 1.2 §6.6.9 / SC 4.1.2 |
| `no-input-type-invalid` | `<input type="X">` with an invalid type — silently falls back to `type="text"`, losing mobile keyboard hints and autofill | HTML spec / SC 1.3.5 |
| `no-labelledby-missing-target` | `aria-labelledby`/`describedby`/`controls`/`owns`/`activedescendant` referencing an `id` that doesn't exist in the file — AT computes empty name | axe-core aria-labelledby / ARIA 1.2 §6.2.4 / SC 4.1.2 |
| `no-dynamic-content-without-live` | `dangerouslySetInnerHTML` / `v-html` / `[innerHTML]` on an element outside a live region — screen readers don't re-read replaced content | axe-core content-changes / SC 4.1.3 |
| `form-field-multiple-labels` | Multiple `<label for="…">` elements targeting the same input — AT reads all, producing verbose or conflicting output | axe-core form-field-multiple-labels / SC 1.3.1 |
| `no-empty-table-header` | `<th>` or `role="columnheader"/"rowheader"` with no accessible text or `aria-label` — column/row invisible to screen readers | axe-core empty-table-header / SC 1.3.1 |

### Warnings — on by default

| Rule | What it flags | Source |
|---|---|---|
| `no-tooltip-role-misuse` | `role="tooltip"` without an `id`; or `role="tooltip"` on an interactive element | APG: Tooltip Pattern |
| `no-menu-role-on-nav` | Menu/menubar/menuitem roles — triggers AT application-mode keyboard handling; especially wrong on `<nav>` | Roselli / Lauke / Groves |
| `no-button-type-missing` | `<button>` inside a `<form>` without an explicit `type` — defaults to `type="submit"`, causing accidental submission | HTML spec |

### Off by default — opt in

These rules are available but disabled in the recommended config. They flag real problems but have enough false positives or legitimate overrides in real codebases that leaving them on by default causes noise. Enable individually.

| Rule | What it flags | Source |
|---|---|---|
| `no-application-role` | `role="application"` — disables AT browse mode, requires author to implement all keyboard handling | Roselli / Sutton / Lauke / APG |
| `no-grid-role` | `role="grid"` — almost always wrong outside spreadsheet-like widgets | Roselli: ARIA Grid As an Anti-Pattern |
| `no-aria-roledescription` | `aria-roledescription` — overrides AT role label and does not auto-translate | Roselli: Avoid aria-roledescription |
| `no-aria-readonly` | `aria-readonly` — limited and inconsistent AT support; TalkBack has misread it as disabled | Roselli |
| `no-tab-without-controls` | `role="tab"` without `aria-controls` — APG recommends but does not require it | APG: Tabs Pattern |
| `no-href-hash` | `<a href="#">` used as a button — links navigate, buttons act | Sutton: Links vs Buttons |
| `warn-role-alert` | `role="alert"` — prompt to confirm the interruption is warranted; prefer `role="status"` for non-urgent updates | APG / Roselli / Sutton |
| `prefer-aria-disabled` | HTML `disabled` removes element from tab order; `aria-disabled` keeps it discoverable | Roselli: Don't Disable Form Controls |
| `no-target-blank-without-label` | `target="_blank"` without communicating the new-tab behaviour to AT users | WebAIM / WCAG 3.2.2 |
| `no-dialog-without-close` | `role="dialog"` or `<dialog>` without a visible close button | APG: Dialog Pattern |

---

## Portability rules (Vue and Angular only)

These rules cover gaps in `eslint-plugin-jsx-a11y` that have no equivalent in `eslint-plugin-vuejs-accessibility` or `@angular-eslint/eslint-plugin-template`. They are included in the Vue and Angular recommended configs only — React projects already get them from jsx-a11y.

| Rule | What it flags | Source |
|---|---|---|
| `no-anchor-ambiguous-text` | Ambiguous link text ("click here", "read more", "learn more") | WCAG 2.4.4 / SC 2.4.6 |
| `no-anchor-no-content` | `<a>` with no text content and no accessible name | WCAG 4.1.2 |
| `no-aria-activedescendant-no-tabindex` | `aria-activedescendant` on an element without `tabindex` — focus can never reach it | ARIA 1.2 |
| `no-invalid-aria-prop-value` | Invalid values on ARIA state/property attributes | WCAG 4.1.2 |
| `no-autocomplete-invalid` | Invalid `autocomplete` token values | SC 1.3.5 |
| `no-heading-no-content` | Headings (`<h1>`–`<h6>`) with no text content | WCAG 2.4.6 |
| `no-iframe-no-title` | `<iframe>` without a `title` attribute | WCAG 4.1.2 |
| `no-img-redundant-alt` | Alt text containing "image", "photo", or "picture" — screen readers already announce the element type | WCAG 1.1.1 |
| `no-access-key` | `accessKey` attribute — conflicts with AT and browser shortcuts | WCAG 2.1.4 |
| `no-noninteractive-to-interactive-role` | Non-interactive elements given interactive ARIA roles without keyboard handlers | WCAG 2.1.1 / 4.1.2 |
| `no-noninteractive-tabindex` | `tabindex` on a non-interactive element with no interactive role | WCAG 2.1.1 |
| `prefer-semantic-element` | `<div role="button">` and similar patterns where a native element would be correct | WCAG 4.1.2 |
| `no-role-supports-aria-props` | ARIA properties applied to roles that do not support them (e.g. `aria-checked` on `role="button"`) | ARIA 1.2 |
| `no-scope-on-td` | `scope` attribute on `<td>` — only valid on `<th>` | SC 1.3.1 |

---

## Framework-specific rules (React / Remix only)

These rules are specific to the @ulam framework's patterns and activate only when their trigger imports appear in the file being linted.

| Rule | Severity | What it flags |
|---|---|---|
| `no-announce-in-render` | error | `announce()` / `clearAnnouncements()` called directly in a component render body or Vue setup — fires on every render, spamming screen readers. Safe contexts: `useEffect` / `onMounted` / `watch` / event handlers. |
| `no-hash-router-in-remix` | warn | `@ulam` hash router import alongside `react-router` — signals an incomplete Remix migration |
| `no-use-page-title-in-remix` | warn | `usePageTitle()` alongside `react-router` imports — conflicts with Remix's declarative `meta` export |

The `no-announce-in-render` rule also runs in the Vue and Angular plugins, with safe contexts tuned for each framework:

- **Vue:** `onMounted`, `onUpdated`, `watch`, `watchEffect`, `nextTick`, and their variants
- **Angular:** `ngOnInit`, `ngAfterViewInit`, `ngAfterContentInit`, `ngOnChanges`, `ngDoCheck`, and class method event handlers

---

## Stylelint rules (`neighbor-stylelint.mjs`)

| Rule | Severity | What it flags | Source |
|---|---|---|---|
| `ulam/user-preferences` | warn | `opacity`, `animation`, `transition`, or alpha-channel colors in `src/components/ui/` without a `@media (prefers-*)` or `@media (forced-colors)` counterpart | WCAG 2.1 / WCAG 2.2 |
| `ulam/no-outline-none` | warn | `outline: none` or `outline: 0` in a base rule (outside a `:focus`/`:focus-visible`/`:focus-within` selector) — removes keyboard focus indicator | WCAG 2.4.7 / WebAIM / double-great/stylelint-a11y |
| `ulam/no-forced-colors-none` | warn | `forced-color-adjust: none` inside `@media (forced-colors)` — opts out of Windows High Contrast Mode, removing visibility for users who depend on it | Higley / Roselli — WCAG SC 1.4.11 / SC 1.4.3 |

### Notes on `ulam/no-outline-none`

The rule allows:
- `outline: none` inside `:focus`, `:focus-visible`, or `:focus-within` selectors — the author is intentionally restyling focus
- The correct pattern for programmatic-focus-only targets (dialogs, skip-link headings) is `:focus:not(:focus-visible) { outline: none }` which suppresses the ring for JS `.focus()` calls while preserving it for keyboard-initiated focus

---

## Rules considered and rejected

| Rule | Reason rejected |
|---|---|
| `no-aria-controls` | Support improved substantially since Pickering's 2014 post; APG *requires* it in the tabs pattern — conflicted with `no-tabs-without-structure` |
| `no-aria-label-on-link` | `aria-label` on `<a>` is the correct technique for ambiguous link text ("Read more"); can't detect the bad case (overriding good visible text) statically |
| `no-aria-live-on-carousel` | Class-name heuristic — `carousel` in a class doesn't mean auto-advancing; too many false positives |
| `no-figure-role-without-label` | `role="figure"` on `<figure>` is redundant (element already has the role implicitly); flags the wrong thing |
| `no-scrollable-without-focusable` | Class-name heuristic for scroll behaviour — can't read CSS from static analysis |
| `no-empty-heading` | Covered by jsx-a11y recommended |
| `aria-required-on-required-form-control` | AT already reads native `required`; adding `aria-required` is redundant, not required |
| `require-menu-owned-menuitem` / `require-listbox-owned-option` | Component-based code renders children conditionally — fires constantly on empty/loading states |
| `no-aria-owns-circular` | Cross-file ID graph required; vanishingly rare in practice |
| `no-dialog-without-modal` | Non-modal dialogs are a valid APG pattern; too much false-positive risk |
| `no-generated-content-text` | Decorative generated content is extremely common; can't tell if a string is decorative or meaningful |
| `font-size-is-readable` / `no-spread-text` | No universal threshold — context-dependent; high false-positive rate on real design systems |
| `prefer-focus-visible` | `:focus` alone is WCAG 2.4.7 compliant; flagging it without `:focus-visible` fires constantly on legitimate code |
| `no-fixed-font-size-px` | Browser zoom satisfies SC 1.4.4 regardless of unit; WCAG itself is ambiguous on this; very high false-positive rate |
| `no-forced-colors-none` (global) | Legitimate narrow uses exist (color pickers, border tricks); rule is scoped to `@media (forced-colors)` blocks only to avoid firing on those |
