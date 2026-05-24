/**
 * @a11yfred/neighbor  -  ESLint plugin (Remix 3)
 *
 * Flags the same ARIA anti-patterns as neighbor-eslint.mjs, plus specific
 * ulam rules tailored for Remix (e.g., no-use-page-title-in-remix).
 *
 * Usage in eslint.config.js:
 *   import neighbor from '@a11yfred/neighbor/remix3'
 *
 *   export default [
 *     {
 *       files: ['**/*.tsx', '**/*.jsx'],
 *       plugins: { '@a11yfred/neighbor': neighbor },
 *       rules: neighbor.configs.recommended.rules,
 *     },
 *   ]
 */

import { h } from '@a11yfred/neighbor/lib/helpers-jsx.js'
import { buildRules, buildRecommendedRules, buildReactFrameworkRules } from '@a11yfred/neighbor/lib/rules.js'
import { buildUlamRules, buildUlamRecommendedRules } from '@a11yfred/neighbor/lib/ulam-rules.js'
import { buildRemixRules, buildRemixRecommendedRules } from '@a11yfred/neighbor/lib/framework-rules.js'

const NS = '@a11yfred/neighbor'
const rules = { ...buildRules(h), ...buildUlamRules(), ...buildRemixRules() }

const plugin = { meta: { name: `${NS}/remix3` }, rules }

let jsxA11y = null
try { jsxA11y = (await import('eslint-plugin-jsx-a11y')).default } catch {}

export default {
  ...plugin,
  configs: {
    recommended: {
      plugins: {
        [NS]: plugin,
        ...(jsxA11y ? { 'jsx-a11y': jsxA11y } : {}),
      },
      rules: {
        ...(jsxA11y ? jsxA11y.configs.recommended.rules : {}),
        ...buildRecommendedRules(NS),
        ...buildUlamRecommendedRules(NS),
        ...buildReactFrameworkRules(NS),
        ...buildRemixRecommendedRules(NS),
      },
    },
  },
}
