# stylelint-plugin-neighbor

Stylelint rules that check your CSS for accessibility problems. This is part of the [@a11yfred/neighbor](https://github.com/a11yfred/neighbor) ecosystem.

Accessibility is not just HTML. The CSS you write can silently break keyboard navigation, hide content from screen readers, clip zoomed text, trigger vestibular disorders, and strip semantic meaning from your markup — all without a single linting warning.

**Neighbor's Stylelint rules fill that gap.** They ship **18 CSS accessibility rules**, each mapped to a specific WCAG Success Criterion, built from scratch for modern Stylelint (v14+).

## Installation

```bash
npm install --save-dev stylelint @a11yfred/neighbor
```

*(Note: The stylelint rules are bundled directly into the main `@a11yfred/neighbor` package, so you install that instead of `stylelint-plugin-neighbor` directly).*

## Setup

Add it to your Stylelint configuration:

```json
{
  "plugins": ["@a11yfred/neighbor"],
  "rules": {
    "neighbor/no-outline-none": true,
    "neighbor/no-forced-colors-none": true,
    "neighbor/user-preferences": true,
    "neighbor/require-minimum-target-size": true,
    "neighbor/no-text-justify": true
  }
}
```

## Rules Overview

All rules are prefixed with `neighbor/`. For the complete list of rules, detailed explanations, WCAG mappings, and examples, please read the full [CSS Rules Documentation](https://github.com/a11yfred/neighbor/blob/main/packages/neighbor/RULES-CSS.md).

### Key Rules Include:

- **Focus Rings**: Warns if `outline: none` is used outside of `:focus` states.
- **High Contrast Mode**: Prevents `forced-color-adjust: none` inside forced-colors media queries.
- **Motion & Preferences**: Enforces media query fallbacks for animations (`prefers-reduced-motion`) and transparency.
- **Zoom & Text Scaling**: Warns on pure viewport units (`vw`, `vh`) for text sizing which breaks browser zoom.
- **Readability**: Disallows `text-align: justify` which creates uneven spacing for dyslexic users.
- **Touch Targets**: Enforces minimum target sizes on interactive elements (WCAG 2.2).

## License

MIT
