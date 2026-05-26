/**
 * @a11yfred/neighbor  -  ESLint plugin (React / JSX)
 *
 * Flags ARIA patterns that are widely derided, semantically wrong, or have
 * poor/no AT support  -  but are not caught by eslint-plugin-jsx-a11y recommended.
 *
 * Sources and credits:
 *   Adrian Roselli         adrianroselli.com
 *   Heydon Pickering       heydonworks.com, inclusive-components.design
 *   Scott O'Hara           scottohara.me
 *   Patrick Lauke          splintered.co.uk, patrickhlauke.github.io/aria
 *   Karl Groves            karlgroves.com
 *   Marcy Sutton           marcysutton.com
 *   Eric Eggert            yatil.net
 *   WAI-ARIA APG           w3.org/WAI/ARIA/apg
 *   ARIA 1.2 spec          w3.org/TR/wai-aria-1.2
 *
 * Rules already covered by jsx-a11y recommended (not duplicated here):
 *   aria-hidden on focusable           → jsx-a11y/no-aria-hidden-on-focusable
 *   presentation/none on interactive   → jsx-a11y/no-interactive-element-to-noninteractive-role
 *   redundant role                     → jsx-a11y/no-redundant-roles
 *   prefer semantic element            → jsx-a11y/prefer-tag-over-role
 *   invalid role value                 → jsx-a11y/aria-role
 *   invalid aria prop                  → jsx-a11y/aria-props
 *   tabindex > 0                       → jsx-a11y/tabindex-no-positive
 *   tabindex on non-interactive        → jsx-a11y/no-noninteractive-tabindex
 *   img missing alt                    → jsx-a11y/alt-text
 *   input missing label                → jsx-a11y/label-has-associated-control
 */

import { h } from '@a11yfred/neighbor/lib/helpers-jsx.js'
import { buildRules, buildRecommendedRules, buildReactFrameworkRules, buildRemixFrameworkRules, buildVueFrameworkRules, buildAngularFrameworkRules, buildWebComponentsFrameworkRules } from '@a11yfred/neighbor/lib/rules.js'
import { buildUlamRules, buildUlamRecommendedRules } from '@a11yfred/neighbor/lib/ulam-rules.js'

const NS = '@a11yfred/neighbor'
const rules = { ...buildRules(h), ...buildUlamRules() }

const plugin = { meta: { name: NS }, rules }

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
        'jsx-a11y/accessible-emoji': 'off',
        'jsx-a11y/no-autofocus': 'off',
        'jsx-a11y/no-distracting-elements': 'off',
        'jsx-a11y/no-redundant-roles': 'off',
        ...buildRecommendedRules(NS),
        ...buildUlamRecommendedRules(NS),
      },
    },
    react: {
      plugins: { [NS]: plugin },
      rules: { ...buildReactFrameworkRules(NS) },
    },
    remix: {
      plugins: { [NS]: plugin },
      rules: { ...buildRemixFrameworkRules(NS) },
    },
    vue: {
      plugins: { [NS]: plugin },
      rules: { ...buildVueFrameworkRules(NS) },
    },
    angular: {
      plugins: { [NS]: plugin },
      rules: { ...buildAngularFrameworkRules(NS) },
    },
    webcomponents: {
      plugins: { [NS]: plugin },
      rules: { ...buildWebComponentsFrameworkRules(NS) },
    },
  },
}
