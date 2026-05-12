# Contributing to @a11yfred/neighbor

Neighbor is maintained by [@a11yfred](https://github.com/a11yfred). Contributions are welcome from the accessibility community  -  practitioners, AT users, spec readers, and people who have found a gap in existing tooling.

## What belongs here

A rule belongs in neighbor if it meets all three criteria:

1. **Statically detectable**  -  the violation can be identified from markup/code alone, without a browser or AT. Runtime-only failures (color contrast, focus order in the DOM) belong in axe-core.
2. **Not already covered**  -  jsx-a11y, vuejs-accessibility, @angular-eslint/template, or axe-core doesn't already flag it in a recommended config.
3. **Expert-backed**  -  there's a WCAG SC, ARIA spec citation, or clear consensus from accessibility practitioners (Roselli, O'Hara, Lauke, Sutton, Pickering, Groves, Eggert, etc.).

If you're unsure, open an issue before writing a rule. A brief description and a source is enough to start a conversation.

## What doesn't belong here

- Rules that require runtime information (computed styles, DOM layout, AT output)
- Rules already in jsx-a11y recommended  -  neighbor extends it, not replaces it
- Opinionated style rules without a clear accessibility impact
- Rules with very high false-positive rates on real codebases (see the rejected rules list in [RULES.md](RULES.md))

## Setup

```bash
git clone https://github.com/a11yfred/neighbor.git
cd neighbor
npm install
```

No build step. Rules are plain ES modules  -  edit and run ESLint directly.

## How rules are structured

All ESLint rules live in [`lib/rules.js`](lib/rules.js) as factory functions:

```js
export function makeMyNewRule(h) {
  return {
    meta: {
      type: 'problem',             // 'problem' | 'suggestion'
      docs: { description: '...' },
      messages: { myMessage: '...' },
      schema: [],
    },
    create(context) {
      return {
        [h.elementVisitor](node) {
          // h adapts the rule to React/Vue/Angular ASTs
        },
      }
    },
  }
}
```

The `h` adapter gives you a uniform interface across all three frameworks:

| Helper | Returns |
|---|---|
| `h.getAttr(node, name)` | attribute node or `null` |
| `h.getAttrStringValue(attr)` | string or `null` (null for dynamic expressions) |
| `h.getElementName(node)` | lowercase tag name, or `null` for custom components |
| `h.hasAttr(node, name)` | boolean |
| `h.getRoleValue(node)` | role string or `null` |
| `h.hasAccessibleName(node)` | boolean  -  checks `aria-label` / `aria-labelledby` |
| `h.isInteractiveElement(node)` | boolean |
| `h.getParent(node)` | parent element node or `null` |
| `h.getAncestors(node)` | iterable of ancestor element nodes, root-ward |
| `h.getChildOpeningElements(node)` | iterable of direct child element nodes |
| `h.getInnerHtmlAttr(node)` | `dangerouslySetInnerHTML` / `v-html` / `[innerHTML]` node or `null` |
| `h.elementVisitor` | AST node type string for `create()` visitor key |
| `h.elementWithChildrenVisitor` | visitor key for rules that need child access |

**Angular caveat:** `getParent()` and `getAncestors()` return `null`/nothing for Angular  -  the template parser doesn't attach parent pointers. Rules that require ancestor walking should degrade gracefully (skip the check, don't throw).

After writing your factory:

1. Add it to `RULE_FACTORIES` at the bottom of `lib/rules.js`
2. Add it to `buildRecommendedRules()` at the appropriate severity (`'error'` / `'warn'` / `'off'`)
3. If it's Vue/Angular-only (porting a jsx-a11y gap), add it to `buildPortabilityRules()` instead

Stylelint rules live in [`neighbor-stylelint.mjs`](neighbor-stylelint.mjs) and use the PostCSS AST directly. See the existing rules for the pattern.

## Severity guidance

| Severity | When to use |
|---|---|
| `error` | Unambiguous AT breakage  -  a phantom control, broken name computation, HTML spec violation. No legitimate override. |
| `warn` | Strong guidance with a clear accessibility basis, but real codebases occasionally have justified exceptions. |
| `off` | Real problem, but fires too often on legitimate patterns to be on by default. Make it available; let teams opt in. |

When in doubt, start at `warn`. It's easier to promote a rule to `error` than to demote it after people have already configured it.

## Commit style

```
feat: add no-my-new-rule (short description)
fix: correct false positive in no-existing-rule
docs: update RULES.md for no-my-new-rule
```

No ticket numbers required.

## Opening a PR

Use the PR template. The key things:

- **What problem does this flag?** Link a WCAG SC, ARIA spec section, or expert source.
- **Why can't axe-core catch it at runtime instead?** (If it can, it probably belongs there.)
- **What are the false-positive cases?** Be honest  -  we'd rather move a rule to `off` than reject it.
- **Does it degrade gracefully for Angular?** (Parent walking unavailable.)

## Questions

Open an issue or reach out in the [Web A11y Slack](https://web-a11y.slack.com). The `#tools` channel is a good place to discuss rule ideas before writing code.
