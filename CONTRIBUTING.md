# Contributing to @a11yfred/neighbor

Neighbor is maintained by [@a11yfred](https://github.com/a11yfred). We welcome help from the accessibility community: experts, screen reader users, spec readers, and anyone who sees something missing in other tools.

## What belongs here

A rule belongs in neighbor if it meets all three checks:

1. **Easy to find in code**: The linter can find the problem just by looking at the code, without needing a browser. Things like color contrast belong in `axe-core`.
2. **Not in other tools**: Plugins like `jsx-a11y` or `vuejs-accessibility` do not already check it.
3. **Expert-backed**: A rule must come from WCAG, ARIA specs, or accessibility experts.

If you are not sure, open an issue before writing the rule. Just describe the idea and where it comes from to start a conversation.

## What doesn't belong here

- Rules that need a browser to run (like checking CSS layout).
- Rules already in the standard accessibility linter for your framework (e.g., `jsx-a11y`, `vuejs-accessibility`, `@angular-eslint/template`, or `lit-a11y`). Neighbor works with them, it doesn't replace them.
- Code style rules that do not affect accessibility.
- Rules that give too many false warnings on real projects (see rejected rules in [RULES.md](RULES.md)).

## Setup

```bash
git clone https://github.com/a11yfred/neighbor.git
cd neighbor
npm install
```

There is no build step. Rules are simple JavaScript files. You can edit them and run ESLint directly.

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

The `h` helper gives you a single way to check code across React, Vue, and Angular:

| Helper | Returns |
| --- | --- |
| `h.getAttr(node, name)` | attribute node or `null` |
| `h.getAttrStringValue(attr)` | string or `null` (null for dynamic expressions) |
| `h.getElementName(node)` | lowercase tag name, or `null` for custom components |
| `h.hasAttr(node, name)` | boolean |
| `h.getRoleValue(node)` | role string or `null` |
| `h.hasAccessibleName(node)` | boolean: checks `aria-label` / `aria-labelledby` |
| `h.isInteractiveElement(node)` | boolean |
| `h.getParent(node)` | parent element node or `null` |
| `h.getAncestors(node)` | iterable of ancestor element nodes, root-ward |
| `h.getChildOpeningElements(node)` | iterable of direct child element nodes |
| `h.getInnerHtmlAttr(node)` | `dangerouslySetInnerHTML` / `v-html` / `[innerHTML]` node or `null` |
| `h.elementVisitor` | AST node type string for `create()` visitor key |
| `h.elementWithChildrenVisitor` | visitor key for rules that need child access |

**Angular warning:** `getParent()` and `getAncestors()` return `null` in Angular. The parser does not link child nodes to parent nodes. If your rule needs to look at parent nodes, it should fail quietly (skip the check, do not throw an error).

After writing your rule function:

1. Add it to `RULE_FACTORIES` at the bottom of `lib/rules.js`.
2. Add it to `buildRecommendedRules()` and set the severity (`'error'`, `'warn'`, or `'off'`).
3. If the rule is only for Vue or Angular, add it to `buildPortabilityRules()` instead.

Stylelint rules live in [`neighbor-stylelint.mjs`](neighbor-stylelint.mjs). They use PostCSS. Look at the existing rules to see how they work.

## Severity guidance

| Severity | When to use |
| --- | --- |
| `error` | This breaks screen readers or violates HTML rules. There is no good reason to do this. |
| `warn` | This is usually bad, but sometimes there is a good reason to do it. |
| `off` | This rule gives too many warnings on normal code to be turned on by default. Users can turn it on if they want. |

If you are not sure, start with `warn`. It is easier to change a `warn` to an `error` later.

## Commit style

```text
feat: add no-my-new-rule (short description)
fix: correct false positive in no-existing-rule
docs: update RULES.md for no-my-new-rule
```

You do not need to include issue ticket numbers in your commit messages.

## Opening a PR

Please use the PR template. Here are the most important things:

- **What problem does this find?** Link to WCAG, ARIA specs, or an expert guide.
- **Why can't axe-core catch this?** If `axe-core` can catch it, the rule probably belongs there.
- **When will this give false warnings?** Be honest. We prefer to set a rule to `off` instead of rejecting your PR.
- **Does it fail quietly in Angular?** Remember that parent-walking does not work in Angular.

## Questions

Open an issue or talk to us in the [Web A11y Slack](https://web-a11y.slack.com). The `#tools` channel is a great place to talk about rule ideas before you start writing code.
