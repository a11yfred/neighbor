/**
 * @a11yfred/neighbor  -  ESLint plugin (Vue SFCs)
 *
 * Flags the same ARIA anti-patterns as neighbor-eslint.mjs but for Vue templates.
 * Requires vue-eslint-parser as the project's ESLint parser for .vue files.
 *
 * Usage in eslint.config.js:
 *   import vueParser from 'vue-eslint-parser'
 *   import neighbor from '@a11yfred/neighbor/vue'
 *
 *   export default [
 *     {
 *       files: ['**\/*.vue'],
 *       languageOptions: { parser: vueParser },
 *       plugins: { '@a11yfred/neighbor': neighbor },
 *       rules: neighbor.configs.recommended.rules,
 *     },
 *   ]
 */

import { h } from '@a11yfred/neighbor/lib/helpers-vue.js'
import { buildRules, buildRecommendedRules, buildPortabilityRules, buildVueFrameworkRules } from '@a11yfred/neighbor/lib/rules.js'
import { buildUlamRulesVue, buildUlamRecommendedRulesFramework } from '@a11yfred/neighbor/lib/ulam-rules.js'

const NS = '@a11yfred/neighbor'
const rules = { ...buildRules(h), ...buildUlamRulesVue() }
const plugin = { meta: { name: `${NS}/vue` }, rules }

let vueA11y = null
try { vueA11y = (await import('eslint-plugin-vuejs-accessibility')).default } catch {}

const vueRecommended = {
  ...buildRecommendedRules(NS),
  ...buildPortabilityRules(NS),
  ...buildUlamRecommendedRulesFramework(NS),
  ...buildVueFrameworkRules(NS),
}

// Omit rules that are already covered by vuejs-accessibility (if installed):
if (vueA11y) {
  delete vueRecommended[`${NS}/no-heading-no-content`] // covered by vuejs-accessibility/heading-has-content
  delete vueRecommended[`${NS}/no-iframe-no-title`] // covered by vuejs-accessibility/iframe-has-title
  delete vueRecommended[`${NS}/no-access-key`] // covered by vuejs-accessibility/no-access-key
  delete vueRecommended[`${NS}/no-img-redundant-alt`] // covered by vuejs-accessibility/alt-text
  delete vueRecommended[`${NS}/no-anchor-no-content`] // covered by vuejs-accessibility/anchor-has-content
  delete vueRecommended[`${NS}/no-invalid-aria-prop-value`] // covered by vuejs-accessibility/aria-props
  delete vueRecommended[`${NS}/no-role-supports-aria-props`] // covered by vuejs-accessibility/aria-role
}

export default {
  ...plugin,
  configs: {
    recommended: {
      plugins: {
        [NS]: plugin,
        ...(vueA11y ? { 'vuejs-accessibility': vueA11y } : {}),
      },
      rules: {
        ...(vueA11y ? vueA11y.configs['flat/recommended'].rules : {}),
        'vuejs-accessibility/accessible-emoji': 'off',
        'vuejs-accessibility/no-autofocus': 'off',
        'vuejs-accessibility/no-distracting-elements': 'off',
        'vuejs-accessibility/no-redundant-roles': 'off',
        ...vueRecommended,
      },
    },
  },
}
