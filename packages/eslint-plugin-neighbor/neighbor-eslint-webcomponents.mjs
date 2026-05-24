/**
 * @a11yfred/neighbor  -  ESLint plugin (Vanilla Web Components / HTML)
 *
 * Flags ARIA anti-patterns in vanilla HTML or Web Component templates.
 * Requires @html-eslint/parser as the project's ESLint parser for .html files.
 *
 * Usage in eslint.config.js:
 *   import htmlParser from '@html-eslint/parser'
 *   import neighbor from '@a11yfred/neighbor/webcomponents'
 *
 *   export default [
 *     {
 *       files: ['**/*.html'],
 *       languageOptions: { parser: htmlParser },
 *       plugins: { '@a11yfred/neighbor': neighbor },
 *       rules: neighbor.configs.recommended.rules,
 *     },
 *   ]
 */

import { h } from '@a11yfred/neighbor/lib/helpers-webcomponents.js'
import { buildRules, buildRecommendedRules } from '@a11yfred/neighbor/lib/rules.js'

const NS = '@a11yfred/neighbor'
const rules = buildRules(h)

const plugin = { meta: { name: `${NS}/webcomponents` }, rules }

export default {
  ...plugin,
  configs: {
    recommended: {
      plugins: {
        [NS]: plugin,
      },
      rules: {
        ...buildRecommendedRules(NS),
      },
    },
  },
}
