/**
 * @a11yfred/neighbor  -  Content linting plugin
 *
 * Flags accessibility and inclusion problems in web and app copy: ableist
 * language, disability metaphors, English idioms that exclude ESL readers,
 * vague link text, directional layout references, unexplained abbreviations,
 * ALL CAPS prose, and vague error messages.
 *
 * These rules operate on string literals and JSX text in JavaScript,
 * TypeScript, JSX, and TSX files. They target the gap between markup
 * accessibility (jsx-a11y, neighbor ESLint) and prose accessibility  - 
 * no existing a11y linting tool covers this space.
 *
 * Entry point: @a11yfred/neighbor/content
 *
 * ─── Rule methodology ────────────────────────────────────────────────────────
 *
 * A rule is included only when all three conditions hold:
 *   1. A WCAG Success Criterion directly applies, OR the rule appears in ≥3
 *      independent authoritative style guides.
 *   2. The rule can be expressed as a finite, deterministic pattern (string
 *      match, token count, or AST shape)  -  no NLP, no runtime context.
 *   3. Expert consensus is unambiguous across sources. No credible authority
 *      argues the opposite.
 *
 * Rules that require subjective reading (tone, full cultural sensitivity
 * beyond a term list) or are under active community debate are excluded.
 *
 * ─── Sources ────────────────────────────────────────────────────────────────
 *
 * International accessible writing guides:
 *   United States   plain language.gov, digital.gov/guides/plain-language
 *   United States   advocacy.sba.gov  -  SBA Content Style Guide
 *   United Kingdom  gov.uk/guidance/publishing-accessible-documents
 *   United Kingdom  accessibility-manual.dwp.gov.uk/best-practice/writing-content
 *   Australia       stylemanual.gov.au/accessible-and-inclusive-content
 *   Canada          accessible.canada.ca/guidelines-creating-accessible-documents
 *   Global (W3C)    w3.org/WAI/tips/writing/  -  primary authority
 *   Global (W3C)    wcag.com/authors/
 *
 * Disability language authorities:
 *   NCDJ            cronkite.asu.edu/ncdj/disability-language-style-guide
 *   AP Stylebook    amdisrights.org/ap-stylebook-primer-on-disability
 *   ADA Nat. Network adata.org/factsheet/ADANN-writing
 *   APA Style       apastyle.apa.org/style-grammar-guidelines/bias-free-language/disability
 *   SIGACCESS       sigaccess.org/…/accessible-writing-guide/
 *   Nicolas Steenhout incl.ca/disability-language-is-a-nuanced-thing/  -  Nothing About Us Without Us; language as community choice
 *   Léonie Watson      tink.uk  -  "There is no right or wrong answer because it is a matter of personal choice, and the choice depends on context." (cited by Steenhout)
 *
 * Technical writing:
 *   Google Dev Style developers.google.com/style/accessibility
 *   Section 508     section508.gov/create/alternative-text/
 *
 * UX and content design:
 *   UX Content Co.  uxcontent.com/accessible-ux-writing-a-guide-for-inclusive-content-design/
 *   A11y Collective  a11y-collective.com/blog/accessible-writing/
 *   SJSU Writing Ctr sjsu.edu/writingcenter/docs/handouts/Accessible Writing Strategies.pdf
 */

import { CONTENT_RULE_FACTORIES, buildContentRecommendedRules } from './lib/content-rules.js'

const NS = '@a11yfred/neighbor/content'

const rules = Object.fromEntries(
  Object.entries(CONTENT_RULE_FACTORIES).map(([name, factory]) => [name, factory()])
)

const plugin = { meta: { name: NS }, rules }

export default {
  ...plugin,
  configs: {
    recommended: {
      plugins: {
        [NS]: plugin,
      },
      rules: buildContentRecommendedRules(NS),
    },
  },
}
