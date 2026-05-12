#!/usr/bin/env node
/**
 * scripts/generate-vale.mjs
 *
 * Generates Vale YAML rule files for neighbor-vale from the term lists
 * defined in lib/content-rules.js.
 *
 * This keeps lib/content-rules.js as the single source of truth. Run this
 * script after updating any of the exported term lists or directional patterns:
 *
 *   node scripts/generate-vale.mjs
 *
 * Output: ../neighbor-vale/neighbor/{AbleistLanguage,DisabilityMetaphor,EnglishIdiom,DirectionalLanguage}.yml
 *
 * The two hand-authored rules (AllCapsProse, AmpersandInProse) are NOT
 * generated here - they use raw regex patterns not derivable from JS lists.
 */

import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  ABLEIST_TERMS,
  DISABILITY_METAPHORS,
  ENGLISH_IDIOMS,
  DIRECTIONAL_PATTERNS,
} from '../lib/content-rules.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = resolve(__dirname, '../../neighbor-vale/neighbor')

mkdirSync(OUT_DIR, { recursive: true })

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Converts a JS RegExp to a Vale-compatible pattern string.
 *
 * Vale uses Go's RE2 engine. The conversions applied:
 *   - Strip leading/trailing /  and flags
 *   - Remove lookaheads (?!...) - RE2 does not support them; we leave
 *     the base pattern and note this in a comment
 *   - \b word boundaries are supported in RE2 (as \b)
 *   - (?:...) non-capturing groups are supported
 *   - Character classes, quantifiers, alternation all compatible
 *
 * Returns { pattern: string, hasLookahead: boolean }
 */
function jsRegexToVale(re) {
  let src = re.source

  // Detect and strip lookahead assertions - RE2 doesn't support them.
  // We keep the base pattern (everything before the lookahead) so the rule
  // still fires on the core term; false positives from stripped exceptions
  // are accepted in exchange for RE2 compatibility.
  const hasLookahead = /\(\?!/.test(src)
  if (hasLookahead) {
    // Strip (?!...) groups tracking nested parens depth so inner groups
    // like (?!\s+(blow|defeat)) are fully removed (not just up to first `)`).
    src = stripLookaheads(src)
    // Clean up any trailing/leading alternation artifacts
    src = src.replace(/\|\s*$/, '').replace(/^\s*\|/, '')
    // Clean up double spaces and trailing whitespace
    src = src.replace(/\s{2,}/g, ' ').trim()
  }

  return { pattern: src, hasLookahead }
}

/** Remove all (?!...) lookahead groups, respecting nested parens. */
function stripLookaheads(src) {
  let result = ''
  let i = 0
  while (i < src.length) {
    if (src[i] === '(' && src[i + 1] === '?' && src[i + 2] === '!') {
      // Skip past the entire lookahead group by tracking depth
      let depth = 1
      i += 3 // move past `(?!`
      while (i < src.length && depth > 0) {
        if (src[i] === '\\') { i += 2; continue } // skip escaped char
        if (src[i] === '(') depth++
        else if (src[i] === ')') depth--
        i++
      }
    } else {
      result += src[i]
      i++
    }
  }
  return result
}

/**
 * Builds a YAML substitution rule file from a term list.
 *
 * Each entry in termList is: { term: RegExp, suggest: string, sources: string }
 * The swap map key is the Vale pattern; the value is the suggestion string.
 */
function buildSubstitutionRule({ header, message, termList }) {
  const swapLines = termList.map(({ term, suggest, sources }) => {
    const { pattern, hasLookahead } = jsRegexToVale(term)
    const lookaheadNote = hasLookahead
      ? `  # Note: JS lookahead stripped for RE2 compatibility (sources: ${sources})\n`
      : ''
    // Vale substitution values cannot contain colons at the start of the value
    // when unquoted. Wrap in quotes to be safe.
    const escapedSuggest = suggest.includes("'") ? `"${suggest}"` : `'${suggest}'`
    return `${lookaheadNote}  ${pattern}: ${escapedSuggest}`
  })

  return `${header}
extends: substitution
message: "${message}"
level: warning
link: https://github.com/a11yfred/neighbor-vale
ignorecase: true
swap:
${swapLines.join('\n')}
`
}

/**
 * Builds a YAML existence rule file from a term list.
 *
 * Each entry in termList is: { term: RegExp, suggest: string, sources: string }
 * Vale existence rules fire on any match; the message carries the suggestion.
 * Because existence rules can't carry per-token suggestions, we embed the
 * suggestion in the file as a comment above each token.
 */
function buildExistenceRule({ header, message, termList }) {
  const tokenLines = termList.map(({ term, suggest, sources }) => {
    const { pattern, hasLookahead } = jsRegexToVale(term)
    const lookaheadNote = hasLookahead
      ? `  # Note: JS lookahead stripped for RE2 compat (${sources})\n`
      : ''
    return `${lookaheadNote}  # Suggest: ${suggest}\n  - '${pattern}'`
  })

  return `${header}
extends: existence
message: "${message}"
level: warning
link: https://github.com/a11yfred/neighbor-vale
ignorecase: true
tokens:
${tokenLines.join('\n')}
`
}

// ─── AbleistLanguage.yml ──────────────────────────────────────────────────────

const ableistHeader = `# neighbor/AbleistLanguage.yml  [GENERATED - do not edit by hand]
#
# Source of truth: lib/content-rules.js ABLEIST_TERMS
# Regenerate: node scripts/generate-vale.mjs
#
# Flags ableist terms, condescending euphemisms, and suffering-framing
# when writing about disability.
#
# Why all warnings, not errors:
#   Language is context-dependent. A term flagged here may be appropriate
#   in a direct quotation, a clinical context, or when used by a person
#   describing their own experience. Nicolas Steenhout (incl.ca) and
#   Leonie Watson remind us: "There is no right or wrong answer because
#   it is a matter of personal choice, and the choice depends on context."
#   These rules are suggestions to think, not verdicts.
#
# Sources:
#   NCDJ Disability Language Style Guide
#     cronkite.asu.edu/ncdj/disability-language-style-guide
#   AP Stylebook - Disability
#     amdisrights.org/ap-stylebook-primer-on-disability
#   ADA National Network
#     adata.org/factsheet/ADANN-writing
#   APA Style - Bias-Free Language
#     apastyle.apa.org/style-grammar-guidelines/bias-free-language/disability
#   SIGACCESS Accessible Writing Guide
#     sigaccess.org/welcome-to-sigaccess/resources/accessible-writing-guide/
#   Nicolas Steenhout
#     incl.ca/disability-language-is-a-nuanced-thing/
#
# Each term listed here appears in at least two independent sources above.

`

writeFileSync(
  resolve(OUT_DIR, 'AbleistLanguage.yml'),
  buildSubstitutionRule({
    header: ableistHeader,
    message: "'%s' may be ableist language. Consider: %s",
    termList: ABLEIST_TERMS,
  }),
)
console.log('wrote AbleistLanguage.yml')

// ─── DisabilityMetaphor.yml ───────────────────────────────────────────────────

const metaphorHeader = `# neighbor/DisabilityMetaphor.yml  [GENERATED - do not edit by hand]
#
# Source of truth: lib/content-rules.js DISABILITY_METAPHORS
# Regenerate: node scripts/generate-vale.mjs
#
# Flags figurative uses of disability-related language - disability used
# as a metaphor in non-clinical prose.
#
# These uses are often unintentional. The goal is not to shame but to
# prompt reflection: does using disability as a shorthand for something
# negative reinforce assumptions about what disability means?
#
# Sources:
#   NCDJ Disability Language Style Guide
#     cronkite.asu.edu/ncdj/disability-language-style-guide
#   A11y Collective - Accessible Writing
#     a11y-collective.com/blog/accessible-writing/
#   APA Style - Bias-Free Language
#     apastyle.apa.org/style-grammar-guidelines/bias-free-language/disability
#   Nicolas Steenhout
#     incl.ca/disability-language-is-a-nuanced-thing/
#
# Each metaphor listed here appears in at least two independent sources.

`

writeFileSync(
  resolve(OUT_DIR, 'DisabilityMetaphor.yml'),
  buildSubstitutionRule({
    header: metaphorHeader,
    message: "'%s' uses disability as a metaphor. Consider: %s",
    termList: DISABILITY_METAPHORS,
  }),
)
console.log('wrote DisabilityMetaphor.yml')

// ─── EnglishIdiom.yml ────────────────────────────────────────────────────────

const idiomHeader = `# neighbor/EnglishIdiom.yml  [GENERATED - do not edit by hand]
#
# Source of truth: lib/content-rules.js ENGLISH_IDIOMS
# Regenerate: node scripts/generate-vale.mjs
#
# Flags English idioms and sports metaphors that are opaque to ESL readers
# and international audiences.
#
# Idioms fail readers whose first language is not English because their
# meaning cannot be inferred from their constituent words. "Boil the ocean"
# contains no clues that it means "attempt too much at once."
#
# This is the most novel rule in the neighbor set. No other accessibility
# linting tool flags idioms. It is grounded in WCAG SC 3.1.5 (Reading Level):
# content should not require reading ability beyond lower secondary education.
# For non-native English speakers, idioms systematically raise the effective
# reading level regardless of word complexity.
#
# Sources:
#   Government of Canada - Accessible Documents
#     accessible.canada.ca/guidelines-creating-accessible-documents
#   SJSU Writing Center - Accessible Writing Strategies
#     sjsu.edu/writingcenter/
#   UX Content Co. - Accessible UX Writing
#     uxcontent.com/accessible-ux-writing-a-guide-for-inclusive-content-design/
#   A11y Collective - Accessible Writing
#     a11y-collective.com/blog/accessible-writing/
#   WCAG SC 3.1.5 - Reading Level
#     w3.org/WAI/WCAG22/Understanding/reading-level
#
# Each idiom listed here appears in at least two independent sources as
# a barrier to ESL readers.

`

writeFileSync(
  resolve(OUT_DIR, 'EnglishIdiom.yml'),
  buildSubstitutionRule({
    header: idiomHeader,
    message: "'%s' is an idiom that may be unclear to ESL and international readers. Consider: %s",
    termList: ENGLISH_IDIOMS,
  }),
)
console.log('wrote EnglishIdiom.yml')

// ─── DirectionalLanguage.yml ──────────────────────────────────────────────────

const directionalHeader = `# neighbor/DirectionalLanguage.yml  [GENERATED - do not edit by hand]
#
# Source of truth: lib/content-rules.js DIRECTIONAL_PATTERNS
# Regenerate: node scripts/generate-vale.mjs
#
# Flags content that gives instructions using screen position references
# ("see above", "in the right sidebar", "the table below").
#
# WCAG basis: SC 1.3.3 (Sensory Characteristics) - instructions shall not
# rely solely on sensory characteristics of components, including location.
# Position references break for screen reader users, keyboard users, and
# anyone who zooms, reflows, or resizes the page.
#
# Sources:
#   SBA Office of Advocacy Content Style Guide
#     advocacy.sba.gov/office-of-advocacy-content-style-guide/
#   Google Developer Style Guide
#     developers.google.com/style/accessibility
#   WCAG SC 1.3.3 - Sensory Characteristics
#     w3.org/WAI/WCAG22/Understanding/sensory-characteristics

`

writeFileSync(
  resolve(OUT_DIR, 'DirectionalLanguage.yml'),
  buildExistenceRule({
    header: directionalHeader,
    message: "'%s' uses layout position to give instructions. Position-based references break when users zoom, reflow, or use a screen reader. Reference content by name or heading instead.",
    termList: DIRECTIONAL_PATTERNS,
  }),
)
console.log('wrote DirectionalLanguage.yml')

console.log(`\nDone. Files written to ${OUT_DIR}`)
console.log('Note: AllCapsProse.yml and AmpersandInProse.yml are hand-authored and were not overwritten.')
