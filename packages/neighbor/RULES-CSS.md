# @a11yfred/neighbor: CSS Rules

Stylelint rules that check your CSS for accessibility problems.

→ [Markup rules](RULES-MARKUP.md) · [Content rules](RULES-CONTENT.md) · [Back to RULES.md](RULES.md)

## Sources and credits

| Source | Reference |
| --- | --- |
| double-great/stylelint-a11y | [github.com/double-great/stylelint-a11y](https://github.com/double-great/stylelint-a11y) |
| Eric Eggert | [yatil.net](https://yatil.net) - forced colors and focus patterns |
| MDN Web Docs | [forced-color-adjust](https://developer.mozilla.org/en-US/docs/Web/CSS/forced-color-adjust) |
| WCAG 2.1 SC 1.4.11 | [Non-text Contrast](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast) |
| WCAG 2.1 SC 1.4.3 | [Contrast (Minimum)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum) |
| WCAG 2.1 SC 1.4.4 | [Resize Text](https://www.w3.org/WAI/WCAG21/Understanding/resize-text) |
| WCAG 2.1 SC 2.3.3 | [Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions) |
| WCAG 2.1 SC 2.4.7 | [Focus Visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible) |

---

## Rules

All CSS rules start with `neighbor/`. You can use them from `@a11yfred/neighbor` or `@a11yfred/neighbor/stylelint`.

### Errors (you must fix these)

These rules flag issues that objectively break WCAG requirements and block users from accessing your content. By default, Stylelint rules are configured as errors unless you explicitly set their severity to "warning".

| Rule | What it finds | WCAG SC |
| --- | --- | --- |
| `neighbor/no-forced-colors-none` | Using `forced-color-adjust: none` inside `@media (forced-colors)`. This blocks Windows High Contrast Mode, which hurts users with low vision. | [SC 1.4.3](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum) / [SC 1.4.11](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast) |
| `neighbor/no-outline-none` | Using `outline: none` or `outline: 0` without a `:focus` selector. This hides the focus ring for keyboard users. | [SC 2.4.7](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible) |
| `neighbor/no-text-justify` | Using `text-align: justify`. This creates uneven spaces between words that are very difficult for users with dyslexia to read. | [SC 1.4.8](https://www.w3.org/WAI/WCAG21/Understanding/visual-presentation) |

### Warnings (configure these in your stylelint config)

| Rule | What it finds | WCAG SC |
| --- | --- | --- |
| `neighbor/no-absolute-viewport-text` | Using pure viewport units (like `font-size: 5vw`). This stops the text from getting bigger when users zoom in with their browser. | [SC 1.4.4](https://www.w3.org/WAI/WCAG21/Understanding/resize-text) |
| `neighbor/no-user-select-all-none` | Using `user-select: none` on text. This stops users from highlighting text, which breaks translation and screen reading tools. | [SC 1.4.4](https://www.w3.org/WAI/WCAG21/Understanding/resize-text) |
| `neighbor/user-preferences` | Using `opacity`, `animation`, `transition`, or see-through colors without a `@media` fallback for users who need less motion, less transparency, or forced colors. | [SC 1.4.3](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum) / [SC 2.3.3](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions) |

---

## `stylelint-a11y` Integration

If you already have [`stylelint-a11y`](https://github.com/double-great/stylelint-a11y) installed in your project, `neighbor` will automatically detect it and **turn off** the following rules to prevent duplicate warnings:

- `neighbor/no-outline-none` (handled by `a11y/no-outline-none`)
- `neighbor/no-text-justify` (handled by `a11y/no-text-align-justify`)
- Motion checks in `neighbor/user-preferences` (handled by `a11y/media-prefers-reduced-motion`)

You will still get `neighbor`'s unique checks for forced colors, text selection, and viewport sizing!

---

## Notes

### `neighbor/no-outline-none`

This rule allows `outline: none` inside `:focus`, `:focus-visible`, and `:focus-within`. This is because you are usually changing the style, not removing it completely. A common pattern for elements focused by JavaScript is:

```css
:focus:not(:focus-visible) { outline: none }
```

This hides the focus ring when JavaScript focuses an element, but keeps it when a user uses the keyboard. This rule will not complain about this pattern.

### `neighbor/no-forced-colors-none`

Using `forced-color-adjust: none` is sometimes okay (like for color pickers) if it is *outside* a `@media (forced-colors)` block. This rule will only complain if you use it inside the media query, because that means you are trying to turn off High Contrast Mode.

---

## Rules considered and rejected

| Rule | Reason rejected |
| --- | --- |
| `font-size-is-readable` / `no-spread-text` | Readable font size changes based on design. We cannot make a rule that works everywhere. |
| `no-fixed-font-size-px` | Browser zoom works with `px`. WCAG does not clearly forbid `px`. Complaining about `px` gives too many false errors. |
| `no-forced-colors-none` (global, not scoped to media query) | There are valid reasons to use this globally. We only check inside the `@media (forced-colors)` block. |
| `prefer-focus-visible` | Using `:focus` is enough for WCAG. Complaining about it gives too many false errors. |
