## What this changes

<!-- One sentence. New rule, bug fix, doc update, etc. -->

## Accessibility basis

<!-- Link the WCAG SC, ARIA spec section, or expert source this is grounded in.
     e.g. SC 4.1.2 https://www.w3.org/WAI/WCAG21/Understanding/name-role-value
          ARIA 1.2 §6.6 https://www.w3.org/TR/wai-aria-1.2/#aria-required
          Roselli: https://adrianroselli.com/... -->

## Why static analysis and not axe-core

<!-- axe-core catches this at runtime — explain why a lint-time catch is still
     worth having, or confirm this is something axe-core cannot catch. -->

## False positive cases

<!-- Describe markup that would trigger this rule incorrectly.
     If false positives exist, explain why the signal-to-noise ratio is still
     worth the error/warn/off severity you chose. -->

## Framework coverage

- [ ] React / JSX
- [ ] Vue SFCs
- [ ] Angular templates
- [ ] Angular degrades gracefully (no ancestor walking required, or rule skips cleanly)

## Checklist

- [ ] Rule added to `RULE_FACTORIES` in `lib/rules.js`
- [ ] Rule added to `buildRecommendedRules()` or `buildPortabilityRules()` at correct severity
- [ ] Error message cites the source (SC number, spec section, or practitioner)
- [ ] `RULES.md` updated
- [ ] `CHANGELOG.md` updated
