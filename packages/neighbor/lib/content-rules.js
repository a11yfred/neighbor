/**
 * neighbor/lib/content-rules.js
 * Content and prose accessibility rules for web and app copy.
 *
 * These rules operate on plain text, markdown AST nodes, and JSX string literals.
 * Each rule targets a gap not covered by jsx-a11y, stylelint, or existing markup linters.
 *
 * ─── Rule methodology ────────────────────────────────────────────────────────
 *
 * Rules were included only when all three conditions held:
 *   1. A WCAG Success Criterion directly applies, OR the rule appears in ≥3
 *      independent authoritative style guides.
 *   2. The rule can be expressed as a finite pattern (string match, count, or
 *      AST shape) without requiring NLP or runtime context.
 *   3. Expert consensus is unambiguous  -  no credible accessibility authority
 *      argues the opposite.
 *
 * Rules that require subjective reading (tone, cultural sensitivity beyond a
 * term list) or are under active community debate are excluded.
 *
 * ─── Primary sources ────────────────────────────────────────────────────────
 *
 *   WCAG 2.2 / 3.x     w3.org/WAI/WCAG22/Understanding
 *   W3C WAI Tips        w3.org/WAI/tips/writing/
 *   wcag.com/authors    wcag.com/authors/
 *   Google Dev Style    developers.google.com/style/accessibility
 *   US Plain Language   plainlanguage.gov / digital.gov/guides/plain-language
 *   SBA Style Guide     advocacy.sba.gov/…/writing-accessible-content/
 *   GOV.UK Publishing   gov.uk/guidance/publishing-accessible-documents
 *   NCDJ Style Guide    cronkite.asu.edu/ncdj/disability-language-style-guide
 *   AP Stylebook        amdisrights.org/ap-stylebook-primer-on-disability
 *   ADA National Network adata.org/factsheet/ADANN-writing
 *   APA Style           apastyle.apa.org/style-grammar-guidelines/bias-free-language/disability
 *   SIGACCESS Guide     sigaccess.org/welcome-to-sigaccess/resources/accessible-writing-guide/
 *   Nicolas Steenhout  incl.ca/disability-language-is-a-nuanced-thing/  -  "Nothing About Us Without Us"; language as community choice, not external rule
 *   Léonie Watson      tink.uk  -  cited by Steenhout: "There is no right or wrong answer because it is a matter of personal choice, and the choice depends on context."
 *   A11y Collective     a11y-collective.com/blog/accessible-writing/
 *   UX Content Co.      uxcontent.com/accessible-ux-writing-a-guide-for-inclusive-content-design/
 *   Canadian Gov        accessible.canada.ca/guidelines-creating-accessible-documents
 *   SJSU Writing Center sjsu.edu/writingcenter/docs/handouts/Accessible Writing Strategies.pdf
 *   Section 508         section508.gov/create/alternative-text/
 */

// ─── Shared term lists ───────────────────────────────────────────────────────

/**
 * Ableist terms with suggested replacements.
 *
 * Methodology: union of NCDJ, AP Stylebook, ADA National Network, APA Style,
 * and SIGACCESS guides. Each term appears in ≥2 independent sources. Metaphorical
 * uses ("blind to") are tracked separately in DISABILITY_METAPHORS.
 *
 * Note: identity-first vs person-first (e.g. "autistic person" vs "person with
 * autism") is contested within disability communities  -  this linter does not flag
 * either form. See NCDJ § "Identity-first language" for context.
 */
export const ABLEIST_TERMS = [
  // Slurs  -  universal consensus across all sources
  { term: /\bcrip+le[sd]?\b/i, suggest: 'person who uses a wheelchair / person with a mobility disability', sources: 'NCDJ, AP, ADA NN, APA' },
  { term: /\bretard(ed|s)?\b/i, suggest: 'person with an intellectual disability', sources: 'NCDJ, AP, ADA NN, APA' },
  { term: /\bimbecile[s]?\b/i, suggest: 'person with an intellectual disability', sources: 'ADA NN, APA' },
  { term: /\bmoron[s]?\b/i, suggest: 'person with an intellectual disability', sources: 'ADA NN' },
  { term: /\bdumb\b/i, suggest: 'mute / nonverbal / does not use speech', sources: 'NCDJ, ADA NN' },
  { term: /\blame\b/i, suggest: 'weak / unconvincing (for the non-disability sense)', sources: 'NCDJ, A11y Collective' },
  { term: /\bvegetable[s]?\b/i, suggest: 'person in a persistent vegetative state', sources: 'ADA NN' },
  { term: /\bfreak[s]?\b/i, suggest: '(rewrite)', sources: 'ADA NN' },
  { term: /\bspastic[s]?\b/i, suggest: 'clumsy / energetic (highly offensive ableist slur in UK)', sources: 'Scope UK' },
  { term: /\bspaz(zes|zed)?\b/i, suggest: 'clumsy / energetic (highly offensive ableist slur in UK)', sources: 'Scope UK' },

  // Condescending euphemisms  -  ≥3 sources each
  { term: /\bspecial needs\b/i, suggest: 'disability / person with a disability', sources: 'NCDJ, AP, ADA NN, APA' },
  { term: /\bdifferently[- ]abled\b/i, suggest: 'person with a disability', sources: 'NCDJ, AP, ADA NN, APA' },
  { term: /\bhandi[- ]?capable\b/i, suggest: 'person with a disability', sources: 'NCDJ, AP, ADA NN' },
  { term: /\bphysically challenged\b/i, suggest: 'person with a physical disability', sources: 'NCDJ, AP, ADA NN, APA' },
  { term: /\bmentally challenged\b/i, suggest: 'person with an intellectual or cognitive disability', sources: 'ADA NN, APA' },
  { term: /\bspecial\b(?=\s+(ed|education|class|school))/i, suggest: 'special education (acceptable in formal context) / disability services', sources: 'NCDJ' },

  // Suffering / tragedy framing  -  ≥3 sources each
  { term: /\bconfined to (a |their )?wheelchair\b/i, suggest: 'wheelchair user / person who uses a wheelchair', sources: 'NCDJ, AP, ADA NN, APA, SIGACCESS' },
  { term: /\bwheelchair[- ]bound\b/i, suggest: 'wheelchair user / person who uses a wheelchair', sources: 'NCDJ, AP, ADA NN, APA, SIGACCESS' },
  { term: /\bsuffers? from\b/i, suggest: 'has / lives with / is diagnosed with', sources: 'NCDJ, AP, ADA NN, APA' },
  { term: /\bafflicted (with|by)\b/i, suggest: 'has / lives with', sources: 'NCDJ, AP, ADA NN, APA, SIGACCESS' },
  { term: /\bvictim of\b/i, suggest: 'person who has / person with', sources: 'NCDJ, AP, ADA NN, APA' },
  { term: /\bbound to (a |the )?(bed|chair|wheelchair)\b/i, suggest: 'uses a bed / uses a wheelchair', sources: 'ADA NN, APA' },
  { term: /\bstricken (with|by)\b/i, suggest: 'has / lives with', sources: 'ADA NN' },
  { term: /\bcrippling\b(?!\s+(blow|defeat|loss))/i, suggest: 'devastating / severe / debilitating', sources: 'NCDJ, A11y Collective' },

  // Mental health  -  specific clinical terms misused colloquially
  { term: /\bcommitted suicide\b/i, suggest: 'died by suicide', sources: 'ADA NN, APA (clinical consensus, AP Stylebook 2022)' },
  { term: /\bcra+zy\b/i, suggest: 'wild / unexpected / intense (for non-clinical uses)', sources: 'NCDJ, A11y Collective' },
  { term: /\bpsycho\b/i, suggest: 'reckless / erratic / (rewrite)', sources: 'NCDJ, ADA NN' },
  { term: /\bschizophrenic\b(?!\s+(disorder|diagnosis|symptom))/i, suggest: 'contradictory / inconsistent (for non-clinical uses)', sources: 'NCDJ, APA' },
  { term: /\b(a\s+)?manic[- ]depressive\b/i, suggest: 'person with bipolar disorder', sources: 'ADA NN, APA' },
  { term: /\bjunkie[s]?\b/i, suggest: 'person with a substance use disorder', sources: 'ADA NN, APA' },
  { term: /\baddict[s]?\b(?!\s+up)/i, suggest: 'person with a substance use disorder / person in recovery', sources: 'ADA NN, APA' },

  // Normalcy framing  -  ≥3 sources each
  { term: /\bnormal (people|person|individuals?|users?)\b/i, suggest: 'people without disabilities / non-disabled people', sources: 'AP, ADA NN, APA, SIGACCESS' },
  { term: /\bnormal (hearing|vision|sight)\b/i, suggest: 'typical hearing / full hearing / unimpaired vision', sources: 'AP, SIGACCESS' },
  { term: /\bhearing[- ]impaired\b/i, suggest: 'deaf / hard of hearing', sources: 'NCDJ, AP, ADA NN, APA' },
  { term: /\bthe (disabled|blind|deaf|mentally ill)\b/i, suggest: 'people with disabilities / blind people / deaf people / people with mental illness', sources: 'NCDJ, AP, ADA NN, APA, SIGACCESS' },
  { term: /\bhandicapped\b/i, suggest: 'person with a disability / accessible (for facilities)', sources: 'NCDJ, AP, ADA NN' },
]

/**
 * Disability metaphors  -  disability used figuratively in non-clinical prose.
 *
 * Methodology: identified in NCDJ, A11y Collective, APA, and UX Content Co.
 * as patterns that reinforce ableism even when used innocuously. Each metaphor
 * listed appears in ≥2 sources. This is the most novel rule in the set  -  no
 * existing a11y linter flags these.
 */
export const DISABILITY_METAPHORS = [
  { term: /\bblind (spot|eye|to)\b/i, suggest: 'gap / oversight / unaware of', sources: 'NCDJ, A11y Collective' },
  { term: /\bturning a blind eye\b/i, suggest: 'ignoring / overlooking', sources: 'NCDJ, A11y Collective' },
  { term: /\btone[- ]deaf\b/i, suggest: 'out of touch / insensitive / unaware', sources: 'NCDJ, A11y Collective' },
  { term: /\bfalling on deaf ears\b/i, suggest: 'being ignored / going unheard', sources: 'NCDJ, A11y Collective' },
  { term: /\bdeaf ears\b/i, suggest: 'ignored / unheard', sources: 'A11y Collective' },
  { term: /\bparalyzed (with|by)\b/i, suggest: 'overwhelmed by / unable to act because of', sources: 'NCDJ, A11y Collective' },
  { term: /\bcrippling (debt|fear|blow|anxiety)\b/i, suggest: 'devastating / crushing / severe', sources: 'NCDJ, A11y Collective' },
  { term: /\bschizophrenic (approach|strategy|policy|market)\b/i, suggest: 'contradictory / inconsistent / unpredictable', sources: 'NCDJ, APA' },
  { term: /\bstands? on its own two feet\b/i, suggest: 'self-sufficient / independent', sources: 'A11y Collective' },
]

/**
 * English idioms that are opaque to ESL readers and international audiences.
 *
 * Methodology: compiled from Canadian Gov accessible docs guide, SJSU accessible
 * writing strategies, UX Content Co., and A11y Collective. This is the largest
 * gap in existing a11y linting  -  no other tool flags idioms. Terms are those
 * where a fluent English idiom has no transparent literal meaning.
 *
 * Excludes idioms with obvious constituent meaning ("stand up for yourself").
 */
export const ENGLISH_IDIOMS = [
  // Business jargon idioms  -  appear in ≥2 accessible writing guides
  { term: /\bboil the ocean\b/i, suggest: 'attempt everything at once / do too much', sources: 'SJSU, UX Content Co.' },
  { term: /\bmove the needle\b/i, suggest: 'make progress / have an impact', sources: 'SJSU, Canadian Gov' },
  { term: /\bblue[- ]?sky thinking\b/i, suggest: 'open-ended brainstorming / creative thinking', sources: 'SJSU, A11y Collective' },
  { term: /\bdrink the (kool[- ]?aid|cool[- ]?aid)\b/i, suggest: 'follow without question / accept uncritically', sources: 'SJSU, Canadian Gov' },
  { term: /\bpeel back the onion\b/i, suggest: 'examine more closely / dig deeper', sources: 'SJSU' },
  { term: /\blow[- ]hanging fruit\b/i, suggest: 'easiest tasks / quick wins', sources: 'SJSU, UX Content Co.' },
  { term: /\bsynergy\b/i, suggest: 'collaboration / combined effect (or rewrite)', sources: 'SJSU, plain language guides' },
  { term: /\bpivot\b(?!\s+(table|point))/i, suggest: 'change direction / shift focus', sources: 'UX Content Co.' },
  { term: /\bbandwidth\b(?!\s*(of|for|between|connection|limit|cap))/i, suggest: 'time / capacity / availability', sources: 'UX Content Co., SJSU' },
  { term: /\bcircle back\b/i, suggest: 'follow up / return to', sources: 'SJSU, Canadian Gov' },
  { term: /\btake (it )?offline\b/i, suggest: 'discuss separately / talk privately', sources: 'SJSU' },
  { term: /\bdeep[- ]?dive\b/i, suggest: 'thorough review / detailed look', sources: 'SJSU, Canadian Gov' },
  { term: /\bgranular\b/i, suggest: 'detailed / specific', sources: 'SJSU' },
  { term: /\blevel[- ]?set\b/i, suggest: 'align / agree on expectations', sources: 'SJSU' },
  { term: /\bpush the envelope\b/i, suggest: 'go beyond limits / innovate', sources: 'SJSU, A11y Collective' },
  { term: /\bthink outside the box\b/i, suggest: 'think creatively / find new approaches', sources: 'SJSU, A11y Collective' },
  { term: /\bwrap (my|your|our|their) head[s]? around\b/i, suggest: 'understand / make sense of', sources: 'A11y Collective' },
  { term: /\bone[- ]?size[- ]?fits[- ]?all\b/i, suggest: 'universal / the same for everyone', sources: 'Canadian Gov' },
  { term: /\bback to square one\b/i, suggest: 'starting over / back to the beginning', sources: 'SJSU, A11y Collective' },
  { term: /\bin the pipeline\b/i, suggest: 'planned / coming soon / in progress', sources: 'SJSU, A11y Collective' },
  { term: /\bon the same page\b/i, suggest: 'in agreement / aligned', sources: 'SJSU, Canadian Gov' },
  { term: /\bcatch[- ]22\b/i, suggest: 'impossible situation / no-win situation', sources: 'SJSU, A11y Collective' },
  { term: /\bwhistle[- ]?stop\b/i, suggest: 'brief / quick', sources: 'Canadian Gov' },
  { term: /\braise the bar\b/i, suggest: 'set a higher standard / improve expectations', sources: 'SJSU' },
  { term: /\bhit the ground running\b/i, suggest: 'start immediately / begin without delay', sources: 'SJSU, A11y Collective' },
  { term: /\bon the fence\b/i, suggest: 'undecided / uncertain', sources: 'SJSU, A11y Collective' },
  { term: /\bbite the bullet\b/i, suggest: 'endure something difficult / proceed despite difficulty', sources: 'SJSU, A11y Collective' },
  { term: /\bunder the weather\b/i, suggest: 'unwell / sick / not feeling well', sources: 'SJSU, A11y Collective' },
  { term: /\bball ?park (figure|estimate|number)?\b/i, suggest: 'rough estimate / approximate', sources: 'SJSU, Canadian Gov' },
  { term: /\bin the ball ?park\b/i, suggest: 'approximately / roughly', sources: 'SJSU, Canadian Gov' },

  // Sports idioms  -  opaque to non-sports audiences, appear in ≥2 guides
  { term: /\bhit it out of the park\b/i, suggest: 'succeed greatly / do exceptionally well', sources: 'SJSU, A11y Collective' },
  { term: /\bslam[- ]?dunk\b/i, suggest: 'certain success / easy win', sources: 'SJSU, A11y Collective' },
  { term: /\bdrop the ball\b/i, suggest: 'make a mistake / fail to follow through', sources: 'SJSU, A11y Collective' },
  { term: /\bgame[- ]?changer\b/i, suggest: 'major shift / significant development', sources: 'SJSU, Canadian Gov' },
  { term: /\blevel (the |a )?playing field\b/i, suggest: 'create equal conditions / remove advantages', sources: 'SJSU, A11y Collective' },
  { term: /\bmove the goal[- ]?posts\b/i, suggest: 'change the requirements / shift the target', sources: 'SJSU, A11y Collective' },
  { term: /\bpinch[- ]?hitter\b/i, suggest: 'substitute / stand-in / backup', sources: 'SJSU' },
  { term: /\bkick[- ]?off\b(?!\s+(meeting|call|event))/i, suggest: 'start / begin / launch', sources: 'A11y Collective' },
  { term: /\btouch ?base\b/i, suggest: 'check in / reconnect / follow up', sources: 'SJSU, Canadian Gov' },
  { term: /\bpar for the course\b/i, suggest: 'expected / typical / normal', sources: 'SJSU' },
  { term: /\bfield (a |the )?question\b/i, suggest: 'answer / respond to / address', sources: 'SJSU' },
]

/**
 * Vague link and button text patterns.
 *
 * Methodology: WCAG SC 2.4.4 (Link Purpose in Context) requires link text to be
 * understandable out of context. These patterns are the most-cited failures in
 * WebAIM Million annual reports and appear in every accessible writing guide
 * surveyed. Highest-confidence rules in this linter.
 *
 * Sources: W3C WAI, wcag.com/authors, Google Dev Style, SBA, UX Content Co.,
 * A11y Collective, GOV.UK.
 */
export const VAGUE_CTA_PATTERNS = [
  /^click here$/i,
  /^here$/i,
  /^read more$/i,
  /^learn more$/i,
  /^more$/i,
  /^this$/i,
  /^link$/i,
  /^this link$/i,
  /^this page$/i,
  /^click$/i,
  /^tap here$/i,
  /^tap$/i,
  /^go$/i,
  /^details$/i,
  /^info$/i,
  /^information$/i,
]

/**
 * Alt text anti-patterns.
 *
 * Methodology: WCAG SC 1.1.1 requires text alternatives for non-text content.
 * These specific patterns appear in W3C WAI Tips, Section 508 alt text guide,
 * Google Dev Style, and double-great/alt-text (11-rule library). Independently
 * validated against the WebAIM Million report's most common alt text failures.
 */
export const ALT_TEXT_PREFIXES = [
  /^image of\s/i,
  /^photo of\s/i,
  /^picture of\s/i,
  /^graphic of\s/i,
  /^icon of\s/i,
  /^illustration of\s/i,
  /^screenshot of\s/i,
  /^thumbnail of\s/i,
  /^an image of\s/i,
  /^a photo of\s/i,
  /^a picture of\s/i,
]

export const ALT_TEXT_FILENAME_PATTERN = /\.(png|jpe?g|gif|svg|webp|bmp|avif|tiff?|ico)(\s.*)?$/i

/**
 * Directional language patterns.
 *
 * Methodology: content that references layout position breaks when users zoom,
 * use screen readers, or view on small screens. Appears in SBA Style Guide and
 * Google Dev Style as an explicit rule. Also aligns with WCAG SC 1.3.3
 * (Sensory Characteristics).
 */
export const DIRECTIONAL_PATTERNS = [
  { term: /\b(the )?(right[- ]hand |left[- ]hand )?(side)?bar\b/i, suggest: 'use a heading or section name instead', sources: 'SBA, Google Dev Style' },
  { term: /\bin the (right|left) (column|panel|sidebar|navigation|nav|menu)\b/i, suggest: 'use a heading or section name instead', sources: 'SBA, Google Dev Style' },
  { term: /\b(see|refer to|check|click) (the )?(above|below)\b/i, suggest: '"see [section name]" or restructure', sources: 'SBA, Google Dev Style' },
  { term: /as (shown|seen|described|mentioned|noted) (above|below)\b/i, suggest: '"as described in [section]" or restructure', sources: 'SBA, Google Dev Style' },
  { term: /\bthe following (image|figure|table|chart|diagram) (above|below)\b/i, suggest: 'refer to the item by its caption or figure number', sources: 'SBA' },
]

// ─── Rule factories ───────────────────────────────────────────────────────────

/**
 * no-ableist-language
 *
 * Flags slurs, condescending euphemisms, suffering/tragedy framing, and
 * normalcy framing when writing about disability.
 *
 * WCAG basis: SC 3.1.1 (Language of Page)  -  content must be perceivable and
 * understandable. While WCAG does not enumerate specific words, the intent of
 * SC 3.1.1 and the WCAG understanding document explicitly notes that language
 * that demeans or excludes users undermines accessibility.
 *
 * Expert consensus: Every disability language guide surveyed (NCDJ, AP, ADA NN,
 * APA, SIGACCESS) independently prohibits these terms. Zero credible sources
 * defend them. Severity: error for slurs, warn for euphemisms.
 *
 * Sources: NCDJ, AP Stylebook, ADA National Network, APA Style, SIGACCESS,
 * A11y Collective.
 */
export function createNoAbleistLanguageRule() {
  return {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Disallow ableist language, slurs, and suffering-framing when writing about disability',
        url: 'https://github.com/a11yfred/neighbor#no-ableist-language',
      },
      messages: {
        ableist: '"{{term}}" is ableist language. Suggestion: {{suggest}}. ({{sources}})',
      },
      schema: [
        {
          type: 'object',
          properties: {
            allow: { type: 'array', items: { type: 'string' } },
          },
          additionalProperties: false,
        },
      ],
    },
    create(context) {
      const allow = new Set((context.options[0]?.allow ?? []).map(s => s.toLowerCase()))
      return {
        Literal(node) {
          if (typeof node.value !== 'string') return
          checkTermList(node, node.value, ABLEIST_TERMS, allow, context, 'ableist')
        },
        TemplateLiteral(node) {
          for (const quasi of node.quasis) {
            checkTermList(quasi, quasi.value.raw, ABLEIST_TERMS, allow, context, 'ableist')
          }
        },
      }
    },
  }
}

/**
 * no-disability-metaphor
 *
 * Flags figurative uses of disability-related language ("blind spot",
 * "tone deaf", "paralyzed by").
 *
 * WCAG basis: No direct SC. Rule is grounded in expert consensus across ≥2
 * independent authoritative disability language guides (NCDJ, A11y Collective,
 * APA) and the W3C WAI guidance on inclusive writing. Severity: warn  -  these
 * are common and authors may need context to revise.
 *
 * Sources: NCDJ, A11y Collective, APA Style.
 */
export function createNoDisabilityMetaphorRule() {
  return {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Disallow figurative use of disability-related terms (e.g. "blind spot", "tone deaf")',
        url: 'https://github.com/a11yfred/neighbor#no-disability-metaphor',
      },
      messages: {
        metaphor: '"{{term}}" uses disability as a metaphor. Suggestion: {{suggest}}. ({{sources}})',
      },
      schema: [
        {
          type: 'object',
          properties: {
            allow: { type: 'array', items: { type: 'string' } },
          },
          additionalProperties: false,
        },
      ],
    },
    create(context) {
      const allow = new Set((context.options[0]?.allow ?? []).map(s => s.toLowerCase()))
      return {
        Literal(node) {
          if (typeof node.value !== 'string') return
          checkTermList(node, node.value, DISABILITY_METAPHORS, allow, context, 'metaphor')
        },
        TemplateLiteral(node) {
          for (const quasi of node.quasis) {
            checkTermList(quasi, quasi.value.raw, DISABILITY_METAPHORS, allow, context, 'metaphor')
          }
        },
      }
    },
  }
}

/**
 * no-english-idiom
 *
 * Flags English-language idioms and sports metaphors that are opaque to
 * ESL readers, non-native English speakers, and international audiences.
 *
 * WCAG basis: SC 3.1.5 (Reading Level)  -  content should not require reading
 * ability beyond lower secondary education level. Idioms systematically
 * fail this requirement for non-native English speakers because their meaning
 * cannot be inferred from constituent words.
 *
 * Expert consensus: Flagged in Canadian Gov accessible documents guide, SJSU
 * accessible writing strategies, UX Content Co., and A11y Collective as a
 * significant barrier for international and ESL users. This is the most novel
 * rule in this linter  -  no existing a11y linting tool covers it.
 *
 * Sources: Canadian Gov, SJSU, UX Content Co., A11y Collective.
 */
export function createNoEnglishIdiomRule() {
  return {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Disallow English idioms and sports metaphors that are opaque to ESL and international readers',
        url: 'https://github.com/a11yfred/neighbor#no-english-idiom',
      },
      messages: {
        idiom: '"{{term}}" is an idiom that may be unclear to ESL readers. Suggestion: {{suggest}}. ({{sources}})',
      },
      schema: [
        {
          type: 'object',
          properties: {
            allow: { type: 'array', items: { type: 'string' } },
          },
          additionalProperties: false,
        },
      ],
    },
    create(context) {
      const allow = new Set((context.options[0]?.allow ?? []).map(s => s.toLowerCase()))
      return {
        Literal(node) {
          if (typeof node.value !== 'string') return
          checkTermList(node, node.value, ENGLISH_IDIOMS, allow, context, 'idiom')
        },
        TemplateLiteral(node) {
          for (const quasi of node.quasis) {
            checkTermList(quasi, quasi.value.raw, ENGLISH_IDIOMS, allow, context, 'idiom')
          }
        },
      }
    },
  }
}

/**
 * no-vague-cta
 *
 * Flags vague call-to-action and link text like "click here", "read more",
 * "learn more", or "here" used as the visible text of a link or button.
 *
 * WCAG basis: SC 2.4.4 (Link Purpose, In Context)  -  link purpose shall be
 * determinable from the link text alone or from the link text together with
 * its programmatically determined context. These patterns systematically fail
 * the "link text alone" criterion.
 *
 * Expert consensus: Most-cited failure in WebAIM Million annual reports.
 * Present in every accessible writing guide surveyed. Severity: error.
 *
 * Sources: W3C WAI, wcag.com/authors (SC 2.4.4), Google Dev Style, SBA,
 * UX Content Co., A11y Collective, GOV.UK, WebAIM Million.
 */
export function createNoVagueCTARule() {
  return {
    meta: {
      type: 'problem',
      docs: {
        description: 'Disallow vague link and button text like "click here", "read more", or "here" (WCAG 2.4.4)',
        url: 'https://github.com/a11yfred/neighbor#no-vague-cta',
      },
      messages: {
        vagueCta:
          '"{{text}}" is vague link or button text that fails WCAG 2.4.4. Screen reader users navigating by links will hear "{{text}}" with no context. Use descriptive text that explains the destination or action. (W3C WAI, WebAIM Million)',
      },
      schema: [
        {
          type: 'object',
          properties: {
            allow: { type: 'array', items: { type: 'string' } },
          },
          additionalProperties: false,
        },
      ],
    },
    create(context) {
      const allow = new Set((context.options[0]?.allow ?? []).map(s => s.toLowerCase()))
      return {
        JSXElement(node) {
          const opening = node.openingElement
          const tag = opening.name?.name
          if (tag !== 'a' && tag !== 'button' && tag !== 'Link') return
          const text = extractJSXText(node).trim()
          if (!text || allow.has(text.toLowerCase())) return
          if (VAGUE_CTA_PATTERNS.some(p => p.test(text))) {
            context.report({ node: opening, messageId: 'vagueCta', data: { text } })
          }
        },
      }
    },
  }
}

/**
 * no-directional-language
 *
 * Flags content that references position on screen using layout-dependent
 * direction ("above", "in the right sidebar", "see below").
 *
 * WCAG basis: SC 1.3.3 (Sensory Characteristics)  -  instructions shall not
 * rely solely on sensory characteristics of components, including location.
 * Directional references fail for screen reader users, keyboard users, and
 * users who zoom or reflowed the page.
 *
 * Expert consensus: Explicit rule in SBA Style Guide and Google Dev Style.
 * Also covered in US Plain Language guide and A11y Collective.
 *
 * Sources: SBA Style Guide, Google Dev Style, A11y Collective, WCAG SC 1.3.3.
 */
export function createNoDirectionalLanguageRule() {
  return {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Disallow layout-dependent directional references ("above", "in the right sidebar") (WCAG 1.3.3)',
        url: 'https://github.com/a11yfred/neighbor#no-directional-language',
      },
      messages: {
        directional:
          '{{match}} uses layout position to give instructions. Position-based references break when users zoom, reflow, or use screen readers. {{suggest}} (SBA, Google Dev Style, WCAG SC 1.3.3)',
      },
      schema: [],
    },
    create(context) {
      return {
        Literal(node) {
          if (typeof node.value !== 'string') return
          for (const { term, suggest } of DIRECTIONAL_PATTERNS) {
            const m = node.value.match(term)
            if (m) {
              context.report({ node, messageId: 'directional', data: { match: m[0], suggest } })
            }
          }
        },
      }
    },
  }
}

/**
 * no-unexplained-abbreviation
 *
 * Flags abbreviations and acronyms used without a prior explanation in the
 * same file.
 *
 * WCAG basis: SC 3.1.4 (Abbreviations)  -  a mechanism is available for
 * identifying the expanded form or meaning of abbreviations. Also SC 3.1.5
 * (Reading Level)  -  unexplained jargon raises effective reading level.
 *
 * Expert consensus: Present in Google Dev Style, GOV.UK, wcag.com/authors,
 * SBA Style Guide, US Plain Language guide, and Canadian Gov guide.
 *
 * Note: This rule tracks first use within each file and exempts known common
 * abbreviations. Authors may configure additional exemptions.
 *
 * Sources: Google Dev Style, GOV.UK, wcag.com/authors (SC 3.1.4), SBA, US PL,
 * Canadian Gov.
 */
export function createNoUnexplainedAbbreviationRule() {
  // Abbreviations universally understood without expansion per plain language guides
  const ALWAYS_KNOWN = new Set([
    'HTML', 'CSS', 'JS', 'URL', 'API', 'PDF', 'UI', 'UX', 'ID', 'FAQ',
    'OK', 'US', 'UK', 'EU', 'UN', 'NATO', 'NASA', 'FBI', 'CIA', 'CDC',
    'WHO', 'GPS', 'WIFI', 'USB', 'HDMI', 'TV', 'PC', 'AM', 'PM', 'EST',
    'PST', 'GMT', 'UTC', 'HTTP', 'HTTPS', 'FTP', 'SSH', 'SQL', 'JSON',
    'XML', 'SVG', 'PNG', 'JPG', 'GIF', 'MP4', 'MP3', 'AI', 'ML', 'CEO',
    'CFO', 'CTO', 'HR', 'IT', 'PR', 'ROI', 'KPI', 'SLA', 'MVP', 'Q1',
    'Q2', 'Q3', 'Q4', 'BC', 'AD', 'AKA', 'ETA', 'RSVP', 'DIY', 'ADA',
    'WCAG', 'ARIA', 'WAI', 'W3C', 'ISO', 'RFC', 'IPv4', 'IPv6', 'DNS',
    'VPN', 'RAM', 'CPU', 'GPU', 'SSD', 'iOS', 'macOS', 'ARIA',
  ])

  return {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Require abbreviations and acronyms to be expanded on first use (WCAG 3.1.4)',
        url: 'https://github.com/a11yfred/neighbor#no-unexplained-abbreviation',
      },
      messages: {
        unexplained:
          '"{{abbr}}" is used without explanation. Expand it on first use: "{{abbr}} (full name)" or "full name ({{abbr}})". (WCAG SC 3.1.4, Google Dev Style, GOV.UK)',
      },
      schema: [
        {
          type: 'object',
          properties: {
            known: { type: 'array', items: { type: 'string' } },
          },
          additionalProperties: false,
        },
      ],
    },
    create(context) {
      const extraKnown = new Set(context.options[0]?.known ?? [])
      const isKnown = abbr => ALWAYS_KNOWN.has(abbr) || extraKnown.has(abbr)
      const defined = new Set()
      const EXPANSION_PATTERN = /\b([A-Z][A-Z0-9]{1,9})\s*\(([^)]{3,})\)|\b([^()]{3,})\s*\(([A-Z][A-Z0-9]{1,9})\)/g
      const ABBR_PATTERN = /\b([A-Z][A-Z0-9]{1,9})\b/g

      return {
        Program() {
          defined.clear()
        },
        Literal(node) {
          if (typeof node.value !== 'string') return
          const text = node.value
          let m
          EXPANSION_PATTERN.lastIndex = 0
          while ((m = EXPANSION_PATTERN.exec(text)) !== null) {
            defined.add(m[1] ?? m[4])
          }
          ABBR_PATTERN.lastIndex = 0
          while ((m = ABBR_PATTERN.exec(text)) !== null) {
            const abbr = m[1]
            if (isKnown(abbr) || defined.has(abbr)) continue
            context.report({
              node,
              messageId: 'unexplained',
              data: { abbr },
              loc: {
                start: { line: node.loc.start.line, column: node.loc.start.column + 1 + m.index },
                end: { line: node.loc.start.line, column: node.loc.start.column + 1 + m.index + abbr.length },
              },
            })
            defined.add(abbr)
          }
        },
      }
    },
  }
}

/**
 * no-all-caps-prose
 *
 * Flags words written in ALL CAPS in prose content.
 *
 * WCAG basis: No direct SC. However, screen readers using certain verbosity
 * settings read ALL CAPS letter-by-letter (Google Dev Style cites this
 * explicitly). Also degrades readability for users with dyslexia and cognitive
 * disabilities.
 *
 * Expert consensus: Explicit rule in Google Dev Style, GOV.UK publishing guide,
 * and Canadian Gov guide. Excluded: known uppercase acronyms (HTML, CSS, etc.)
 * and words < 3 characters.
 *
 * Sources: Google Dev Style, GOV.UK, Canadian Gov.
 */
export function createNoAllCapsProse() {
  const KNOWN_ACRONYMS = new Set([
    'HTML', 'CSS', 'JS', 'URL', 'API', 'PDF', 'UI', 'UX', 'ID', 'FAQ',
    'OK', 'US', 'UK', 'EU', 'UN', 'NATO', 'NASA', 'FBI', 'CIA', 'CDC',
    'WHO', 'GPS', 'USB', 'HDMI', 'TV', 'PC', 'AM', 'PM', 'EST', 'PST',
    'GMT', 'UTC', 'HTTP', 'HTTPS', 'FTP', 'SSH', 'SQL', 'JSON', 'XML',
    'SVG', 'PNG', 'JPG', 'GIF', 'MP4', 'MP3', 'AI', 'ML', 'CEO', 'CFO',
    'CTO', 'HR', 'IT', 'PR', 'ROI', 'KPI', 'SLA', 'MVP', 'ADA', 'WCAG',
    'ARIA', 'WAI', 'W3C', 'ISO', 'RFC', 'VPN', 'RAM', 'CPU', 'GPU', 'SSD',
    'DIY', 'AKA', 'ETA', 'RSVP', 'TBD', 'TBA', 'FYI', 'ASAP', 'NOTE',
    'IMPORTANT', 'WARNING', 'CAUTION', 'DEPRECATED', 'TODO',
  ])
  const ALL_CAPS = /\b([A-Z]{3,})\b/g

  return {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Disallow ALL CAPS in prose content  -  screen readers may spell it out letter by letter',
        url: 'https://github.com/a11yfred/neighbor#no-all-caps-prose',
      },
      messages: {
        allCaps:
          '"{{word}}" is written in ALL CAPS. Screen readers using high verbosity may read it letter-by-letter. Use regular casing; add to the `known` option if this is a recognized acronym. (Google Dev Style, GOV.UK)',
      },
      schema: [
        {
          type: 'object',
          properties: {
            known: { type: 'array', items: { type: 'string' } },
          },
          additionalProperties: false,
        },
      ],
    },
    create(context) {
      const extraKnown = new Set(context.options[0]?.known ?? [])
      const isKnown = w => KNOWN_ACRONYMS.has(w) || extraKnown.has(w)

      return {
        Literal(node) {
          if (typeof node.value !== 'string') return
          let m
          ALL_CAPS.lastIndex = 0
          while ((m = ALL_CAPS.exec(node.value)) !== null) {
            const word = m[1]
            if (isKnown(word)) continue
            context.report({
              node,
              messageId: 'allCaps',
              data: { word },
              loc: {
                start: { line: node.loc.start.line, column: node.loc.start.column + 1 + m.index },
                end: { line: node.loc.start.line, column: node.loc.start.column + 1 + m.index + word.length },
              },
            })
          }
        },
      }
    },
  }
}

/**
 * no-vague-error-message
 *
 * Flags error messages that do not explain what went wrong.
 *
 * WCAG basis: SC 3.3.1 (Error Identification)  -  if an input error is automatically
 * detected, the item in error shall be described to the user. A message like
 * "An error occurred" fails this because it identifies no item. SC 3.3.3
 * (Error Suggestion)  -  if input error is detected, suggestions for correction
 * shall be provided.
 *
 * Expert consensus: UX Content Co. and Google Dev Style both explicitly call out
 * these patterns. Severity: warn  -  false positives possible when the string is
 * a template partial.
 *
 * Sources: UX Content Co., Google Dev Style, WCAG SC 3.3.1, SC 3.3.3.
 */
export function createNoVagueErrorMessageRule() {
  const VAGUE_ERRORS = [
    /^an? error occurred\.?$/i,
    /^something went wrong\.?$/i,
    /^error\.?$/i,
    /^unknown error\.?$/i,
    /^unexpected error\.?$/i,
    /^oops[!.]?$/i,
    /^oops,? something went wrong[!.]?$/i,
    /^request failed\.?$/i,
    /^operation failed\.?$/i,
    /^failed\.?$/i,
    /^try again later\.?$/i,
    /^please try again\.?$/i,
  ]

  return {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Disallow vague error messages that do not explain what went wrong (WCAG 3.3.1)',
        url: 'https://github.com/a11yfred/neighbor#no-vague-error-message',
      },
      messages: {
        vagueError:
          '"{{text}}" does not explain what went wrong or how to fix it, failing WCAG SC 3.3.1 and 3.3.3. Describe the specific error and provide a corrective action. (UX Content Co., Google Dev Style)',
      },
      schema: [],
    },
    create(context) {
      return {
        Literal(node) {
          if (typeof node.value !== 'string') return
          const text = node.value.trim()
          if (text.length > 120) return
          if (VAGUE_ERRORS.some(p => p.test(text))) {
            context.report({ node, messageId: 'vagueError', data: { text } })
          }
        },
      }
    },
  }
}

/**
 * no-ampersand-in-prose
 *
 * Flags `&` used in place of "and" in prose text.
 *
 * WCAG basis: No direct SC. Screen readers may announce `&` inconsistently
 * across AT vendors  -  some say "ampersand", some skip it. Google Dev Style
 * cites this as an explicit accessibility concern.
 *
 * Expert consensus: Google Dev Style is the primary source; also noted in
 * plain language guides as informal register that reduces clarity.
 * Excludes legitimate code/UI uses (checking for literal `&` not `&amp;`).
 *
 * Sources: Google Dev Style, US Plain Language guide.
 */
export function createNoAmpersandInProseRule() {
  return {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Disallow & as a substitute for "and" in prose  -  screen readers may not announce it consistently',
        url: 'https://github.com/a11yfred/neighbor#no-ampersand-in-prose',
      },
      messages: {
        ampersand:
          '"&" may be announced inconsistently by screen readers. Use "and" in prose. (Google Dev Style)',
      },
      schema: [],
    },
    create(context) {
      return {
        Literal(node) {
          if (typeof node.value !== 'string') return
          if (/\s&\s/.test(node.value)) {
            context.report({ node, messageId: 'ampersand' })
          }
        },
      }
    },
  }
}


/**
 * no-exclusive-language
 */
export const EXCLUSIVE_TERMS = [
  { term: /\bblack[- ]?list[s]?\b/i, suggest: 'denylist / blocklist', sources: 'Google, MS, Prevention.org' },
  { term: /\bwhite[- ]?list[s]?\b/i, suggest: 'allowlist / safelist', sources: 'Google, MS, Prevention.org' },
  { term: /\bmaster(?! (node|degree|class))\b/i, suggest: 'primary / main / leader', sources: 'Google, MS, Prevention.org' },
  { term: /\bslave\b/i, suggest: 'replica / worker / follower', sources: 'Google, MS, Prevention.org' },
  { term: /\bdummy\b/i, suggest: 'placeholder / mock / sample', sources: 'Google' },
  { term: /\bsanity check\b/i, suggest: 'quick check / confidence check', sources: 'Google' },
  { term: /\bspirit animal\b/i, suggest: 'remove / favorite (avoid cultural appropriation)', sources: 'MS, Prevention.org' },
  { term: /\bpowwow\b/i, suggest: 'meeting / gathering (avoid cultural appropriation)', sources: 'MS, Prevention.org' },
  { term: /\bninja[s]?\b/i, suggest: 'expert / specialist', sources: 'MS, Prevention.org' },
  { term: /\bguru[s]?\b/i, suggest: 'expert / leader', sources: 'MS, Prevention.org' },
  { term: /\btribe\b/i, suggest: 'team / network / community', sources: 'Prevention.org' },
  { term: /\bguys\b/i, suggest: 'folks / everyone / team', sources: 'Google, MS' },
  { term: /\bcolou?red people\b/i, suggest: 'people of color (avoid coloured which is highly offensive in the UK)', sources: 'APA, AP Style' },
  { term: /\boriental[s]?\b/i, suggest: 'Asian / specific descent', sources: 'AP Style, Microsoft' },
  { term: /\beskimo[s]?\b/i, suggest: 'Alaska Native / Inuit', sources: 'AP Style, Microsoft' },
  { term: /\bnegro[s]?\b/i, suggest: 'Black / African American / specific descent', sources: 'AP Style, APA' },
  { term: /\bafro[- ]american[s]?\b/i, suggest: 'Black / African American / specific descent', sources: 'AP Style, APA' },
  { term: /\bpaki[s]?\b/i, suggest: 'specific descent (highly offensive slur in UK, avoid entirely)', sources: 'UK Gov' },
]

export function createNoExclusiveLanguageRule() {
  return {
    meta: { type: 'suggestion', docs: { description: 'Disallow non-inclusive tech jargon and cultural appropriation', url: 'https://github.com/a11yfred/neighbor#no-exclusive-language' }, messages: { exclusive: '"{{term}}" is non-inclusive or culturally appropriated. Suggestion: {{suggest}}. ({{sources}})' }, schema: [{ type: 'object', properties: { allow: { type: 'array', items: { type: 'string' } } }, additionalProperties: false }] },
    create(context) {
      const allow = new Set((context.options[0]?.allow ?? []).map(s => s.toLowerCase()))
      return {
        Literal(node) {
          if (typeof node.value !== 'string') return
          checkTermList(node, node.value, EXCLUSIVE_TERMS, allow, context, 'exclusive')
        },
        TemplateLiteral(node) {
          for (const quasi of node.quasis) { checkTermList(quasi, quasi.value.raw, EXCLUSIVE_TERMS, allow, context, 'exclusive') }
        }
      }
    }
  }
}

/**
 * no-colonial-and-violent-language
 */
export const VIOLENT_COLONIAL_TERMS = [
  { term: /\bstakeholder[s]?\b/i, suggest: 'partner / collaborator / contributor / community member', sources: 'SkilledWork' },
  { term: /\btarget (population|audience)\b/i, suggest: 'group of focus / intended audience / specific population', sources: 'SkilledWork, Prevention.org' },
  { term: /\b(combat|tackle)\b(?! (the|this) (issue|problem|disease))/i, suggest: 'address / collaborate with / eliminate', sources: 'Prevention.org' }
]

export function createNoColonialAndViolentLanguageRule() {
  return {
    meta: { type: 'suggestion', docs: { description: 'Disallow terms rooted in colonialism or violent imagery applied to people', url: 'https://github.com/a11yfred/neighbor#no-colonial-and-violent-language' }, messages: { violentColonial: '"{{term}}" has violent or colonial origins. Suggestion: {{suggest}}. ({{sources}})' }, schema: [{ type: 'object', properties: { allow: { type: 'array', items: { type: 'string' } } }, additionalProperties: false }] },
    create(context) {
      const allow = new Set((context.options[0]?.allow ?? []).map(s => s.toLowerCase()))
      return {
        Literal(node) {
          if (typeof node.value !== 'string') return
          checkTermList(node, node.value, VIOLENT_COLONIAL_TERMS, allow, context, 'violentColonial')
        },
        TemplateLiteral(node) {
          for (const quasi of node.quasis) { checkTermList(quasi, quasi.value.raw, VIOLENT_COLONIAL_TERMS, allow, context, 'violentColonial') }
        }
      }
    }
  }
}

/**
 * no-deficit-language
 */
export const DEFICIT_TERMS = [
  { term: /\bthe homeless\b/i, suggest: 'people experiencing homelessness', sources: 'Prevention.org, SkilledWork' },
  { term: /\b(inmate|felon|convict|ex-con)[s]?\b/i, suggest: 'person with legal system involvement / formerly incarcerated person', sources: 'SkilledWork' },
  { term: /\boffender[s]?\b/i, suggest: 'person with legal system involvement', sources: 'SkilledWork' },
  { term: /\baddict[s]?\b/i, suggest: 'person with a substance use disorder', sources: 'Prevention.org' },
  { term: /\b(drug|substance) abuse\b/i, suggest: 'substance use disorder', sources: 'Prevention.org' },
  { term: /\bminority\b/i, suggest: 'historically marginalized group / people of color', sources: 'APA, Prevention.org' },
  { term: /\bat-risk youth\b/i, suggest: 'opportunity youth', sources: 'SkilledWork' },
  { term: /\b(vulnerable|high-risk) (group|population)[s]?\b/i, suggest: 'groups experiencing vulnerability / historically marginalized communities', sources: 'SkilledWork, Prevention.org' },
  { term: /\bnon-English speaking\b/i, suggest: 'multilingual learner', sources: 'ACECQA' },
]

export function createNoDeficitLanguageRule() {
  return {
    meta: { type: 'suggestion', docs: { description: 'Disallow language that reduces people to their circumstances or behaviors', url: 'https://github.com/a11yfred/neighbor#no-deficit-language' }, messages: { deficit: '"{{term}}" is deficit-based language. Suggestion: {{suggest}}. ({{sources}})' }, schema: [{ type: 'object', properties: { allow: { type: 'array', items: { type: 'string' } } }, additionalProperties: false }] },
    create(context) {
      const allow = new Set((context.options[0]?.allow ?? []).map(s => s.toLowerCase()))
      return {
        Literal(node) {
          if (typeof node.value !== 'string') return
          checkTermList(node, node.value, DEFICIT_TERMS, allow, context, 'deficit')
        },
        TemplateLiteral(node) {
          for (const quasi of node.quasis) { checkTermList(quasi, quasi.value.raw, DEFICIT_TERMS, allow, context, 'deficit') }
        }
      }
    }
  }
}

/**
 * no-gendered-language
 */
export const GENDERED_PATTERNS = [
  { term: /\b(he\/she|she\/he|he or she|she or he)\b/i, suggest: 'they / their / you / the user', sources: 'MS, Google' },
  { term: /\b(his\/her|her\/his|his or her|her or his)\b/i, suggest: 'their / your', sources: 'MS, Google' },
  { term: /\bmum and dad\b/i, suggest: 'families / parents / carers', sources: 'ACECQA' },
  { term: /\b(born a man|born a woman)\b/i, suggest: 'assigned male/female at birth', sources: 'UPenn, NAHJ' },
  { term: /\b(biologically male|biologically female)\b/i, suggest: 'assigned male/female at birth', sources: 'UPenn, NAHJ' },
  { term: /\b(opposite sex|opposite gender)\b/i, suggest: 'different gender / another sex', sources: 'APA, TJA' },
  { term: /\b(husband|wife)\b/i, suggest: 'partner / spouse (when gender is unknown)', sources: 'APA, Google, NAHJ' },
  { term: /\b(boyfriend|girlfriend)\b/i, suggest: 'partner (when gender is unknown)', sources: 'APA, Google, NAHJ' },
  { term: /\b(male-bodied|female-bodied)\b/i, suggest: 'assigned male/female at birth', sources: 'TJA' },
  { term: /\b(fireman|policeman|chairman)\b/i, suggest: 'firefighter / police officer / chairperson', sources: 'GOV.UK, Canada' },
]

export function createNoGenderedLanguageRule() {
  return {
    meta: { type: 'suggestion', docs: { description: 'Disallow gendered pronoun patterns in generic references', url: 'https://github.com/a11yfred/neighbor#no-gendered-language' }, messages: { gendered: '"{{term}}" is a generic gendered pattern. Suggestion: {{suggest}}. ({{sources}})' }, schema: [{ type: 'object', properties: { allow: { type: 'array', items: { type: 'string' } } }, additionalProperties: false }] },
    create(context) {
      const allow = new Set((context.options[0]?.allow ?? []).map(s => s.toLowerCase()))
      return {
        Literal(node) {
          if (typeof node.value !== 'string') return
          checkTermList(node, node.value, GENDERED_PATTERNS, allow, context, 'gendered')
        },
        TemplateLiteral(node) {
          for (const quasi of node.quasis) { checkTermList(quasi, quasi.value.raw, GENDERED_PATTERNS, allow, context, 'gendered') }
        }
      }
    }
  }
}

/**
 * no-device-specific-action
 */
export const DEVICE_SPECIFIC_PATTERNS = [
  { term: /\bclick(ing|ed)? (on|the|this)\b/i, suggest: 'choose / select', sources: 'Apple, Google' },
  { term: /\btap(ping|ped)? (on|the|this)\b/i, suggest: 'choose / select', sources: 'Apple, Google' },
  { term: /\bswipe (the|this)\b/i, suggest: 'choose / select / navigate', sources: 'Apple' }
]

export function createNoDeviceSpecificActionRule() {
  return {
    meta: { type: 'suggestion', docs: { description: 'Disallow device-specific action verbs', url: 'https://github.com/a11yfred/neighbor#no-device-specific-action' }, messages: { deviceAction: '"{{term}}" assumes a specific input device (mouse, touch screen). Suggestion: {{suggest}}. ({{sources}})' }, schema: [{ type: 'object', properties: { allow: { type: 'array', items: { type: 'string' } } }, additionalProperties: false }] },
    create(context) {
      const allow = new Set((context.options[0]?.allow ?? []).map(s => s.toLowerCase()))
      return {
        Literal(node) {
          if (typeof node.value !== 'string') return
          checkTermList(node, node.value, DEVICE_SPECIFIC_PATTERNS, allow, context, 'deviceAction')
        },
        TemplateLiteral(node) {
          for (const quasi of node.quasis) { checkTermList(quasi, quasi.value.raw, DEVICE_SPECIFIC_PATTERNS, allow, context, 'deviceAction') }
        }
      }
    }
  }
}

/**
 * no-anti-lgbtq-language
 */
export const ANTI_LGBTQ_TERMS = [
  { term: /\bhomosexual[s]?\b/i, suggest: 'gay / lesbian / bisexual', sources: 'APA, AP Style, NAHJ' },
  { term: /\bsexual preference[s]?\b/i, suggest: 'sexual orientation', sources: 'APA, AP Style, NAHJ' },
  { term: /\btransgendered\b/i, suggest: 'transgender', sources: 'TJA, APA, AP Style' },
  { term: /\ba transgender\b/i, suggest: 'a transgender person', sources: 'TJA, APA, AP Style' },
  { term: /\btransgenderism\b/i, suggest: 'transgender people / trans rights', sources: 'TJA' },
  { term: /\b(trans ideology|gender ideology)\b/i, suggest: 'transgender rights', sources: 'TJA' },
  { term: /\btrans-identified\b/i, suggest: 'transgender', sources: 'TJA' },
  { term: /\b(trans male|trans female)\b/i, suggest: 'trans man / trans woman', sources: 'TJA' },
  { term: /\btransvestite[s]?\b/i, suggest: 'transgender (or use specific terms as preferred)', sources: 'NAHJ, TJA' },
  { term: /\bcross[- ]dresser[s]?\b/i, suggest: 'transgender (or use specific terms as preferred)', sources: 'NAHJ, TJA' },
  { term: /\bfaggot[s]?\b/i, suggest: '(highly offensive slur, avoid entirely)', sources: 'AP Style' },
  { term: /\bfag[s]?\b/i, suggest: '(highly offensive slur, avoid entirely. Note: slang for cigarette in UK but slur in US)', sources: 'AP Style' },
  { term: /\bqueer\b/i, suggest: '(use only if referring to self-identification, otherwise avoid as it can be a slur)', sources: 'AP Style, UK Gov' },
]

export function createNoAntiLgbtqLanguageRule() {
  return {
    meta: { type: 'suggestion', docs: { description: 'Disallow outdated, pathologizing, or offensive terms regarding sexual orientation and gender identity', url: 'https://github.com/a11yfred/neighbor#no-anti-lgbtq-language' }, messages: { antiLgbtq: '"{{term}}" is outdated or offensive regarding LGBTQ+ identity. Suggestion: {{suggest}}. ({{sources}})' }, schema: [{ type: 'object', properties: { allow: { type: 'array', items: { type: 'string' } } }, additionalProperties: false }] },
    create(context) {
      const allow = new Set((context.options[0]?.allow ?? []).map(s => s.toLowerCase()))
      return {
        Literal(node) {
          if (typeof node.value !== 'string') return
          checkTermList(node, node.value, ANTI_LGBTQ_TERMS, allow, context, 'antiLgbtq')
        },
        TemplateLiteral(node) {
          for (const quasi of node.quasis) { checkTermList(quasi, quasi.value.raw, ANTI_LGBTQ_TERMS, allow, context, 'antiLgbtq') }
        }
      }
    }
  }
}

// ─── Rule export map ─────────────────────────────────────────────────────────


export const CONTENT_RULE_FACTORIES = {
  'no-ableist-language': createNoAbleistLanguageRule,
  'no-disability-metaphor': createNoDisabilityMetaphorRule,
  'no-english-idiom': createNoEnglishIdiomRule,
  'no-vague-cta': createNoVagueCTARule,
  'no-directional-language': createNoDirectionalLanguageRule,
  'no-unexplained-abbreviation': createNoUnexplainedAbbreviationRule,
  'no-all-caps-prose': createNoAllCapsProse,
  'no-vague-error-message': createNoVagueErrorMessageRule,
  'no-ampersand-in-prose': createNoAmpersandInProseRule,
  'no-exclusive-language': createNoExclusiveLanguageRule,
  'no-colonial-and-violent-language': createNoColonialAndViolentLanguageRule,
  'no-deficit-language': createNoDeficitLanguageRule,
  'no-gendered-language': createNoGenderedLanguageRule,
  'no-device-specific-action': createNoDeviceSpecificActionRule,
  'no-anti-lgbtq-language': createNoAntiLgbtqLanguageRule,
}

/**
 * Recommended severity config.
 *
 * Tiers:
 *   error   -  WCAG statutory basis + universal expert consensus + low false-positive rate
 *   warn    -  strong expert consensus but higher false-positive risk or context-dependence
 *   off     -  valid rule but too noisy for most codebases; opt in individually
 */
export function buildContentRecommendedRules(ns) {
  return {
    [`${ns}/no-ableist-language`]: 'warn',
    [`${ns}/no-disability-metaphor`]: 'warn',
    [`${ns}/no-english-idiom`]: 'warn',
    [`${ns}/no-vague-cta`]: 'warn',
    [`${ns}/no-directional-language`]: 'warn',
    [`${ns}/no-unexplained-abbreviation`]: 'warn',
    [`${ns}/no-all-caps-prose`]: 'warn',
    [`${ns}/no-vague-error-message`]: 'warn',
    [`${ns}/no-ampersand-in-prose`]: 'warn',
    [`${ns}/no-exclusive-language`]: 'warn',
    [`${ns}/no-colonial-and-violent-language`]: 'warn',
    [`${ns}/no-deficit-language`]: 'warn',
    [`${ns}/no-gendered-language`]: 'warn',
    [`${ns}/no-device-specific-action`]: 'warn',
    [`${ns}/no-anti-lgbtq-language`]: 'warn',
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function checkTermList(node, text, termList, allow, context, messageId) {
  for (const { term, suggest, sources } of termList) {
    const m = text.match(term)
    if (!m) continue
    const matched = m[0]
    if (allow.has(matched.toLowerCase())) continue
    context.report({
      node,
      messageId,
      data: { term: matched, suggest, sources },
    })
  }
}

function extractJSXText(node) {
  let text = ''
  for (const child of node.children ?? []) {
    if (child.type === 'JSXText') {
      text += child.value
    } else if (child.type === 'JSXExpressionContainer' && child.expression.type === 'Literal') {
      text += String(child.expression.value)
    } else if (child.type === 'JSXElement') {
      text += extractJSXText(child)
    }
  }
  return text
}
