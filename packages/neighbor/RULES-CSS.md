# @a11yfred/neighbor: CSS Rules

Stylelint rules that check your CSS for accessibility problems.

→ [Markup rules](RULES-MARKUP.md) · [Content rules](RULES-CONTENT.md) · [Back to RULES.md](RULES.md)

## Why This Exists

Accessibility is not just HTML. The CSS you write can silently break keyboard navigation, hide content from screen readers, clip zoomed text, trigger vestibular disorders, and strip semantic meaning from your markup — all without a single linting warning.

Until now, there has been no actively maintained Stylelint plugin dedicated to catching these problems. **Neighbor's Stylelint rules fill that gap.** They ship **18 CSS accessibility rules**, each mapped to a specific WCAG Success Criterion, built from scratch for modern Stylelint (v14+). They draw on research from axe-core, WCAG, and the accessibility community to catch issues that no other tool warns you about — from `list-style: none` silently stripping Safari semantics, to `overflow: hidden` clipping zoomed text, to smooth scrolling without motion-preference fallbacks.

> [!TIP]
> If you previously used `stylelint-a11y`, you can drop it entirely and replace it with `@a11yfred/neighbor`. Every rule it offered that was still valid has been reimplemented and improved here.

## Sources and Credits

We stand on the shoulders of these projects and standards. Thank you.

| Source | Reference |
| --- | --- |
| YozhikM/stylelint-a11y | [github.com/YozhikM/stylelint-a11y](https://github.com/YozhikM/stylelint-a11y) - the original Stylelint accessibility plugin that started it all |
| double-great/stylelint-a11y | [github.com/double-great/stylelint-a11y](https://github.com/double-great/stylelint-a11y) - maintained fork that kept the torch burning |
| axe-core (Deque) | [github.com/dequelabs/axe-core](https://github.com/dequelabs/axe-core) - target size, text spacing, hover-focus parity |
| Eric Eggert | [yatil.net](https://yatil.net) - forced colors and focus ring patterns |
| Scott O'Hara | [scottohara.me](https://scottohara.me) - list-style-none / VoiceOver research |
| Adrian Roselli | [adrianroselli.com](https://adrianroselli.com) - overflow clipping, resize text |
| Josh W. Comeau | [joshwcomeau.com](https://joshwcomeau.com) - rem vs px font sizing |
| MDN Web Docs | [forced-color-adjust](https://developer.mozilla.org/en-US/docs/Web/CSS/forced-color-adjust) |
| WCAG 2.1 | [SC 1.1.1](https://www.w3.org/WAI/WCAG21/Understanding/non-text-content), [1.3.1](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships), [1.4.3](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum), [1.4.4](https://www.w3.org/WAI/WCAG21/Understanding/resize-text), [1.4.8](https://www.w3.org/WAI/WCAG21/Understanding/visual-presentation), [1.4.11](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast), [1.4.12](https://www.w3.org/WAI/WCAG21/Understanding/text-spacing), [2.1.1](https://www.w3.org/WAI/WCAG21/Understanding/keyboard), [2.3.3](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions), [2.4.7](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible) |
| WCAG 2.2 | [SC 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum) |

---

## Rules

All CSS rules start with `neighbor/`. You can use them from `@a11yfred/neighbor` or `@a11yfred/neighbor/stylelint`.

### Errors (You Must Fix These)

These rules flag issues that objectively break WCAG requirements and block users from accessing your content. By default, Stylelint rules are configured as errors unless you explicitly set their severity to "warning".

| Rule | What it finds | WCAG SC |
| --- | --- | --- |
| `neighbor/no-forced-colors-none` | Using `forced-color-adjust: none` inside `@media (forced-colors)`. This blocks Windows High Contrast Mode. | [SC 1.4.3](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum) / [SC 1.4.11](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast) |
| `neighbor/no-outline-none` | Using `outline: none` or `outline: 0` without a `:focus` selector. This hides the focus ring. | [SC 2.4.7](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible) |
| `neighbor/no-outline-color-transparent` | Using `outline-color: transparent` outside `:focus:not(:focus-visible)`. Another way to sneak-hide the focus ring. | [SC 2.4.7](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible) |
| `neighbor/no-text-justify` | Using `text-align: justify`. Creates uneven word spacing that is very difficult for dyslexic users to read. | [SC 1.4.8](https://www.w3.org/WAI/WCAG21/Understanding/visual-presentation) |
| `neighbor/require-hover-focus` | A `:hover` selector without a matching `:focus` or `:focus-visible` state. Keyboard users get no visual feedback. | [SC 2.1.1](https://www.w3.org/WAI/WCAG21/Understanding/keyboard) |
| `neighbor/no-content-property-text` | Using the CSS `content` property to inject static text. Screen readers may skip it; it cannot be translated. | [SC 1.1.1](https://www.w3.org/WAI/WCAG21/Understanding/non-text-content) |
| `neighbor/require-minimum-target-size` | Hardcoding widths/heights below 24px on interactive elements (buttons, links, inputs). | [SC 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum) |
| `neighbor/require-minimum-text-spacing` | Hardcoding `line-height < 1.5`, or destructively tight `letter-spacing` / `word-spacing`. | [SC 1.4.12](https://www.w3.org/WAI/WCAG21/Understanding/text-spacing) |
| `neighbor/no-display-none-on-sr-only` | Using `display: none` or `visibility: hidden` on `.sr-only` / `.visually-hidden` classes — this hides text from screen readers too. | [SC 1.3.1](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships) |
| `neighbor/no-list-style-none` | `list-style: none` strips list semantics in Safari/VoiceOver. Must use `role="list"` to restore them. | [SC 1.3.1](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships) |
| `neighbor/no-word-break-all` | `word-break: break-all` splits words at arbitrary letters, severely disrupting reading for dyslexic users. | [SC 1.4.8](https://www.w3.org/WAI/WCAG21/Understanding/visual-presentation) |
| `neighbor/no-overflow-hidden-on-fixed-height` | `overflow: hidden` on a fixed `height` container clips text when users zoom to 200% (WCAG requires this to work). | [SC 1.4.4](https://www.w3.org/WAI/WCAG21/Understanding/resize-text) |

### Warnings (You Should Probably Fix These)

These rules catch patterns that are *usually* bad but sometimes have valid use cases. They default to warnings so you can promote them to errors in strict environments.

| Rule | What it finds | WCAG SC |
| --- | --- | --- |
| `neighbor/no-absolute-viewport-text` | Using pure viewport units (like `font-size: 5vw`). Text will not scale when users zoom. | [SC 1.4.4](https://www.w3.org/WAI/WCAG21/Understanding/resize-text) |
| `neighbor/no-user-select-all-none` | `user-select: none` on text. Blocks highlighting, translation tools, and screen reader copy. | [SC 1.4.4](https://www.w3.org/WAI/WCAG21/Understanding/resize-text) |
| `neighbor/user-preferences` | Missing `@media` fallbacks for `animation`, `transition`, `scroll-behavior: smooth`, `opacity`, or alpha colors. Users who need reduced motion, reduced transparency, or forced colors are left out. | [SC 1.4.3](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum) / [SC 2.3.3](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions) |
| `neighbor/prefer-rem-for-font-size` | Hardcoding `font-size` in `px` or `pt`. Prevents text from scaling with the user's OS or browser default font size. | [SC 1.4.4](https://www.w3.org/WAI/WCAG21/Understanding/resize-text) |
| `neighbor/no-pointer-events-none` | `pointer-events: none` on interactive elements. Makes them unclickable for mouse/touch but still fully active for keyboard — a broken, confusing experience. | [SC 2.1.1](https://www.w3.org/WAI/WCAG21/Understanding/keyboard) |
| `neighbor/no-text-transform-uppercase` | `text-transform: uppercase` causes screen readers to spell words letter-by-letter and is harder for dyslexic users to read. | [SC 1.4.8](https://www.w3.org/WAI/WCAG21/Understanding/visual-presentation) |

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

### `neighbor/no-list-style-none`

Safari/VoiceOver has a [long-standing behavior](https://bugs.webkit.org/show_bug.cgi?id=170179) where removing the list marker also removes list semantics from the accessibility tree. This means VoiceOver will not announce "list, 5 items" when the user navigates to the element. The fix is to add `role="list"` to the HTML element. This rule reminds you to do that.

---

## Rules Considered and Rejected

| Rule | Reason rejected |
| --- | --- |
| `font-size-is-readable` / `no-spread-text` | Readable font size changes based on design. We cannot make a rule that works everywhere. |
| `no-forced-colors-none` (global, not scoped to media query) | There are valid reasons to use this globally. We only check inside the `@media (forced-colors)` block. |
| `prefer-focus-visible` | Using `:focus` is enough for WCAG. Complaining about it gives too many false errors. |
| `no-display-none` (global) | `display: none` is fundamental CSS. Only warning on `.sr-only` / `.visually-hidden` selectors avoids drowning developers in noise. |
