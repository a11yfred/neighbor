# Changelog

## 0.3.0 — 2026-05-12

### New rule

| Rule | What it catches |
|---|---|
| `ulam/no-forced-colors-none` | `forced-color-adjust: none` inside `@media (forced-colors)` — actively opts out of Windows High Contrast Mode |

### Severity changes

10 rules moved from `warn` to `off` in the recommended config — they flag real problems but are too noisy for most codebases by default. All remain available to opt in individually:

`no-application-role`, `no-grid-role`, `no-aria-roledescription`, `no-aria-readonly`, `no-tab-without-controls`, `no-href-hash`, `warn-role-alert`, `prefer-aria-disabled`, `no-target-blank-without-label`, `no-dialog-without-close`

`no-tooltip-role-misuse` and `no-menu-role-on-nav` remain on as warns.

### Docs

- WCAG SC and HTML spec links added throughout README and RULES.md
- CONTRIBUTING.md, PR template, and issue templates added
- README table of contents added
- @ulam described as a JavaScript framework (not React-based)

---

## 0.2.0 — 2026-05-12

### New rules

| Rule | What it catches |
|---|---|
| `no-labelledby-missing-target` | `aria-labelledby`/`describedby`/`controls`/`owns`/`activedescendant` referencing an `id` that doesn't exist in the file |
| `no-dynamic-content-without-live` | `dangerouslySetInnerHTML` / `v-html` / `[innerHTML]` on an element outside a live region |
| `form-field-multiple-labels` | Multiple `<label for="…">` elements targeting the same input |
| `no-empty-table-header` | `<th>` or `role="columnheader"/"rowheader"` with no accessible text |

All four rules run on React, Vue, and Angular.

### Extended rules

**`no-announce-in-render`** now runs in the Vue and Angular plugins, not just React. Safe contexts are tuned per framework — Vue recognises `onMounted`, `watch`, `watchEffect`, `nextTick`; Angular recognises `ngOnInit`, `ngAfterViewInit`, `ngOnChanges`, and class method event handlers.

### Setup improvements

README now includes correct parser snippets for Vue and Angular, and separate setup sections for Remix 2 and Remix 3.

---

## 0.1.0 — 2026-04-30

Initial release.
