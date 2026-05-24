/**
 * @a11yfred/neighbor  -  ESLint plugin (Angular templates)
 *
 * Flags the same ARIA anti-patterns as neighbor-eslint.mjs but for Angular
 * component templates. Requires @angular-eslint/template-parser.
 *
 * Rules that require ancestor walking (no-log-with-interactive-children,
 * no-menu-role-on-nav, no-heading-inside-interactive) are limited because
 * @angular-eslint/template-parser does not attach parent references to nodes.
 * Those rules will still fire for direct matches but cannot walk the tree.
 *
 * Usage in eslint.config.js:
 *   import angularTemplateParser from '@angular-eslint/template-parser'
 *   import neighbor from '@a11yfred/neighbor/angular'
 *
 *   export default [
 *     {
 *       files: ['**\/*.html'],
 *       languageOptions: { parser: angularTemplateParser },
 *       plugins: { '@a11yfred/neighbor': neighbor },
 *       rules: neighbor.configs.recommended.rules,
 *     },
 *   ]
 */

import { h } from '@a11yfred/neighbor/lib/helpers-angular.js'
import { buildRules, buildRecommendedRules, buildPortabilityRules } from '@a11yfred/neighbor/lib/rules.js'
import { buildUlamRulesAngular, buildUlamRecommendedRulesFramework } from '@a11yfred/neighbor/lib/ulam-rules.js'
import { buildAngularFrameworkRules, buildAngularHostRecommendedRules } from '@a11yfred/neighbor/lib/framework-rules.js'

const NS = '@a11yfred/neighbor'
const rules = { ...buildRules(h), ...buildUlamRulesAngular(), ...buildAngularFrameworkRules() }
const plugin = { meta: { name: `${NS}/angular` }, rules }

let angularA11y = null
try { angularA11y = (await import('@angular-eslint/eslint-plugin-template')).default } catch {}

const ANGULAR_A11Y_RULES = [
  'alt-text', 'click-events-have-key-events', 'elements-content',
  'interactive-supports-focus', 'label-has-associated-control',
  'mouse-events-have-key-events', 'no-autofocus', 'no-distracting-elements',
  'no-positive-tabindex', 'role-has-required-aria', 'table-scope', 'valid-aria',
]

const UNLIKELY_ANGULAR_RULES = new Set([
  'no-autofocus', 'no-distracting-elements'
])

function getAngularA11yRules(plugin) {
  const out = {}
  for (const rule of ANGULAR_A11Y_RULES) {
    if (plugin.rules?.[rule]) {
      out[`@angular-eslint/template/${rule}`] = UNLIKELY_ANGULAR_RULES.has(rule) ? 'off' : 'error'
    }
  }
  return out
}

const angularRecommended = {
  ...buildRecommendedRules(NS),
  ...buildPortabilityRules(NS),
  ...buildUlamRecommendedRulesFramework(NS),
  ...buildAngularHostRecommendedRules(NS),
}

// Omit rules that are already covered by @angular-eslint/template (if installed):
if (angularA11y) {
  delete angularRecommended[`${NS}/no-heading-no-content`] // covered by @angular-eslint/template/elements-content
  delete angularRecommended[`${NS}/no-anchor-no-content`] // covered by @angular-eslint/template/elements-content
  delete angularRecommended[`${NS}/no-img-redundant-alt`] // covered by @angular-eslint/template/alt-text
  delete angularRecommended[`${NS}/no-scope-on-td`] // covered by @angular-eslint/template/table-scope
  delete angularRecommended[`${NS}/no-invalid-aria-prop-value`] // covered by @angular-eslint/template/valid-aria
}

export default {
  ...plugin,
  configs: {
    recommended: {
      plugins: {
        [NS]: plugin,
        ...(angularA11y ? { '@angular-eslint/template': angularA11y } : {}),
      },
      rules: {
        ...(angularA11y ? getAngularA11yRules(angularA11y) : {}),
        ...angularRecommended,
      },
    },
  },
}
