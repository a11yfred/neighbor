/**
 * @a11yfred/neighbor  -  ESLint plugin (Lit)
 *
 * Flags Lit-specific accessibility issues like autofocus within html`...` templates.
 *
 * Usage in eslint.config.js:
 *   import neighborLit from '@a11yfred/neighbor/lit'
 *
 *   export default [
 *     {
 *       files: ['**/*.ts', '**/*.js'],
 *       plugins: { '@a11yfred/neighbor': neighborLit },
 *       rules: neighborLit.configs.recommended.rules,
 *     },
 *   ]
 */

import { buildLitRules, buildLitRecommendedRules } from '@a11yfred/neighbor/lib/framework-rules.js'
import { buildRecommendedRules, buildPortabilityRules } from '@a11yfred/neighbor/lib/rules.js'

const NS = '@a11yfred/neighbor'
const rules = buildLitRules()
const plugin = { meta: { name: `${NS}/lit` }, rules }

let litA11y = null
try { litA11y = (await import('eslint-plugin-lit-a11y')).default } catch {}

const LIT_A11Y_RULES = [
  'accessible-emoji', 'alt-text', 'anchor-is-valid', 'aria-activedescendant-has-tabindex',
  'aria-attr-valid-value', 'aria-attrs', 'aria-role', 'aria-unsupported-elements',
  'click-events-have-key-events', 'heading-has-content', 'iframe-title',
  'img-redundant-alt', 'mouse-events-have-key-events', 'no-access-key',
  'no-autofocus', 'no-distracting-elements', 'no-redundant-role',
  'role-has-required-aria-props', 'role-supports-aria-props', 'scope', 'tabindex-no-positive',
  'valid-lang'
]

const UNLIKELY_LIT_RULES = new Set([
  'accessible-emoji', 'no-autofocus', 'no-distracting-elements', 'no-redundant-role'
])

function getLitA11yRules(plugin) {
  const out = {}
  for (const rule of LIT_A11Y_RULES) {
    if (plugin.rules?.[rule]) {
      out[`lit-a11y/${rule}`] = UNLIKELY_LIT_RULES.has(rule) ? 'off' : 'error'
    }
  }
  return out
}

const litRecommended = {
  ...buildRecommendedRules(NS),
  ...buildPortabilityRules(NS),
  ...buildLitRecommendedRules(NS),
}

// Omit rules that are already covered by lit-a11y (if installed):
if (litA11y) {
  delete litRecommended[`${NS}/no-heading-no-content`] // covered by lit-a11y/heading-has-content
  delete litRecommended[`${NS}/no-iframe-no-title`] // covered by lit-a11y/iframe-title
  delete litRecommended[`${NS}/no-img-redundant-alt`] // covered by lit-a11y/img-redundant-alt
  delete litRecommended[`${NS}/no-access-key`] // covered by lit-a11y/no-access-key
  delete litRecommended[`${NS}/no-aria-activedescendant-no-tabindex`] // covered by lit-a11y/aria-activedescendant-has-tabindex
  delete litRecommended[`${NS}/no-anchor-no-content`] // covered by lit-a11y/anchor-is-valid
  delete litRecommended[`${NS}/no-invalid-aria-prop-value`] // covered by lit-a11y/aria-attr-valid-value
  delete litRecommended[`${NS}/no-role-supports-aria-props`] // covered by lit-a11y/role-supports-aria-props
  delete litRecommended[`${NS}/no-scope-on-td`] // covered by lit-a11y/scope
}

export default {
  ...plugin,
  configs: {
    recommended: {
      plugins: {
        [NS]: plugin,
        ...(litA11y ? { 'lit-a11y': litA11y } : {}),
      },
      rules: {
        ...(litA11y ? getLitA11yRules(litA11y) : {}),
        ...litRecommended,
      },
    },
  },
}
