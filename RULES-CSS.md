# @a11yfred/neighbor  -  CSS Rules

Stylelint rules for CSS accessibility.

→ [Markup rules](RULES-MARKUP.md) · [Content rules](RULES-CONTENT.md) · [Back to RULES.md](RULES.md)

## Sources and credits

| Source | Reference |
| --- | --- |
| WCAG 2.1 SC 1.4.3 | [Contrast (Minimum)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum) |
| WCAG 2.1 SC 1.4.4 | [Resize Text](https://www.w3.org/WAI/WCAG21/Understanding/resize-text) |
| WCAG 2.1 SC 1.4.11 | [Non-text Contrast](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast) |
| WCAG 2.1 SC 2.3.3 | [Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions) |
| WCAG 2.1 SC 2.4.7 | [Focus Visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible) |
| Eric Eggert | [yatil.net](https://yatil.net)  -  forced colors and focus patterns |
| MDN Web Docs | [forced-color-adjust](https://developer.mozilla.org/en-US/docs/Web/CSS/forced-color-adjust) |
| double-great/stylelint-a11y | [github.com/double-great/stylelint-a11y](https://github.com/double-great/stylelint-a11y) |

---

## Rules

All CSS rules use the `ulam/` namespace and ship from `@a11yfred/neighbor` (the default entry point) and `@a11yfred/neighbor/stylelint`.

### Warnings  -  on by default

| Rule | What it flags | WCAG SC |
| --- | --- | --- |
| `ulam/user-preferences` | `opacity`, `animation`, `transition`, or alpha-channel colors used in `src/components/ui/` without a `@media (prefers-reduced-motion)`, `@media (prefers-reduced-transparency)`, or `@media (forced-colors)` counterpart | [SC 1.4.3](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum) / [SC 2.3.3](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions) |
| `ulam/no-outline-none` | `outline: none` or `outline: 0` in a base rule (outside a `:focus`, `:focus-visible`, or `:focus-within` selector)  -  removes the keyboard focus indicator for all users | [SC 2.4.7](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible) |
| `ulam/no-forced-colors-none` | `forced-color-adjust: none` inside `@media (forced-colors)`  -  actively opts out of Windows High Contrast Mode, removing the system-enforced visibility that users with low vision depend on | [SC 1.4.3](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum) / [SC 1.4.11](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast) |

---

## Notes

### `ulam/no-outline-none`

The rule allows `outline: none` inside `:focus`, `:focus-visible`, and `:focus-within` selectors  -  those are intentional restylings, not removals. The pattern for programmatic-focus-only targets (skip-link destinations, dialog headings) is:

```css
:focus:not(:focus-visible) { outline: none }
```

This suppresses the visible ring for JS `.focus()` calls while preserving it for keyboard-initiated focus. That pattern is not flagged.

### `ulam/no-forced-colors-none`

`forced-color-adjust: none` has a small number of valid uses (color pickers, custom border tricks) when placed *outside* a `@media (forced-colors)` block  -  those are not flagged. The rule only fires inside the media query, where the intent is explicitly to cancel High Contrast Mode for an element that needs it most.

---

## Rules considered and rejected

| Rule | Reason rejected |
| --- | --- |
| `prefer-focus-visible` | `:focus` alone satisfies [SC 2.4.7](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible); flagging it without `:focus-visible` fires constantly on legitimate code |
| `no-fixed-font-size-px` | Browser zoom satisfies [SC 1.4.4](https://www.w3.org/WAI/WCAG21/Understanding/resize-text) regardless of unit; WCAG is ambiguous on this; very high false-positive rate |
| `font-size-is-readable` / `no-spread-text` | No universal threshold  -  highly context-dependent; high false-positive rate on real design systems |
| `no-forced-colors-none` (global, not scoped to media query) | Legitimate narrow uses exist; rule is scoped to `@media (forced-colors)` blocks only |
