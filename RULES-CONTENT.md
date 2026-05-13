# @a11yfred/neighbor  -  Content Rules

Rules for accessible and inclusive web and app copy.

→ [Markup rules](RULES-MARKUP.md) · [CSS rules](RULES-CSS.md) · [Back to RULES.md](RULES.md)

---

## On language

Language is inherently sensitive. What is appropriate  -  or inappropriate  -  is never fixed. It shifts depending on who is speaking, who is listening, the relationship between them, the cultural context, the time period, and how communities themselves evolve. A term that was clinical yesterday may be reclaimed tomorrow. A word considered polite in one country may carry different weight in another. What one person finds empowering another may find reductive.

This is not a problem that a linter can fully solve. It is a problem that requires ongoing human attention.

Accessibility practitioner [Nicolas Steenhout](https://incl.ca/disability-language-is-a-nuanced-thing/) argues against prescriptive language rules: disabled people must lead conversations about disability language rather than having terminology imposed by well-meaning non-disabled people  -  the foundational disability rights principle *[Nothing About Us Without Us](https://en.wikipedia.org/wiki/Nothing_About_Us_Without_Us)*. Well-intentioned euphemisms ("handicapable", "physically challenged") have historically increased stigma rather than reduced it, precisely because they were invented by people outside the community they were meant to serve.

Steenhout cites [Léonie Watson](https://tink.uk), blind web standards engineer: *"There is no right or wrong answer because it is a matter of personal choice, and the choice depends on context."*

With that framing in mind, these rules exist to flag patterns where expert consensus across multiple independent disability-led sources is clear and consistent  -  not to arbitrate language for every situation. Where consensus is genuinely contested (identity-first vs person-first language being the clearest example), no rule is applied. Where context matters more than pattern (a slur used in direct quotation, a metaphor in a novel excerpt, internal tooling with a known audience), suppress the rule.

All content rules ship as `warn`, not `error`, for exactly this reason. A warning is an invitation to think. An error is a claim of certainty that language does not deserve.

If the defaults feel wrong for your community, context, or codebase  -  use the `allow` option, open an issue, or submit a PR. These lists should be a living document maintained by the people who use them.

---

## Rule methodology

A rule is included only when all three conditions hold:

1. A WCAG Success Criterion directly applies, **or** the pattern appears in ≥ 3 independent authoritative sources as an explicit problem.
2. The rule can be expressed as a finite, deterministic pattern  -  a string match, token count, or AST shape. No NLP, no runtime context required.
3. Expert consensus is clear and consistent across sources. Where credible authorities disagree, the rule is excluded.

Rules that require subjective reading, that depend on the relationship between speaker and audience, or that are under active community debate are not included.

Grammarly and the Hemingway Editor informed the sentence-structure patterns: both flag passive voice, sentences over ~25 words, and words with simpler alternatives. Those patterns are consistent with the plain language guides surveyed. They are noted in the "Rules not included" section because, while valid as prose guidance, their false-positive rate in code string literals is too high to ship by default.

---

## Sources

These rules were synthesized from the following sources. Where sources conflict, W3C WAI takes precedence.

### Global standards

| Source | URL |
| --- | --- |
| W3C WAI Writing Tips | [w3.org/WAI/tips/writing](https://www.w3.org/WAI/tips/writing/)  -  primary authority |
| wcag.com/authors | [wcag.com/authors](https://wcag.com/authors/) |
| WCAG 2.2 | [w3.org/TR/WCAG22](https://www.w3.org/TR/WCAG22/) |

### English-speaking governments

| Country | Source |
| --- | --- |
| United States | [plainlanguage.gov](https://www.plainlanguage.gov) / [digital.gov/guides/plain-language](https://digital.gov/guides/plain-language) |
| United States | [SBA Content Style Guide](https://advocacy.sba.gov/office-of-advocacy-content-style-guide/writing-accessible-content/) |
| United Kingdom | [GOV.UK  -  Publishing Accessible Documents](https://www.gov.uk/guidance/publishing-accessible-documents) |
| United Kingdom | [DWP Accessibility Manual](https://accessibility-manual.dwp.gov.uk/best-practice/writing-content) |
| United Kingdom | [GOV.UK Communications  -  accessible communications resources](https://www.communications.gov.uk/guidance/accessible-communications/accessible-communications-learning-and-resources/) |
| Australia | [Australian Government Style Manual  -  Accessible and Inclusive Content](https://www.stylemanual.gov.au/accessible-and-inclusive-content) |
| Canada | [Government of Canada  -  Guidelines for Creating Accessible Documents](https://accessible.canada.ca/guidelines-creating-accessible-documents) |

### Disability language authorities

| Source | URL | Notes |
| --- | --- | --- |
| NCDJ Disability Language Style Guide | [cronkite.asu.edu/ncdj](https://cronkite.asu.edu/ncdj/disability-language-style-guide) | Journalism standard; updated regularly |
| AP Stylebook  -  Disability | [amdisrights.org/ap-stylebook-primer-on-disability](https://amdisrights.org/ap-stylebook-primer-on-disability) | Wire journalism standard |
| ADA National Network | [adata.org/factsheet/ADANN-writing](https://adata.org/factsheet/ADANN-writing) | U.S. legal/advocacy context |
| APA Style  -  Disability | [apastyle.apa.org  -  bias-free language](https://apastyle.apa.org/style-grammar-guidelines/bias-free-language/disability) | Academic publishing standard |
| SIGACCESS Accessible Writing Guide | [sigaccess.org](https://www.sigaccess.org/welcome-to-sigaccess/resources/accessible-writing-guide/) | Computing research community |
| Nicolas Steenhout | [incl.ca  -  Disability Language Is a Nuanced Thing](https://incl.ca/disability-language-is-a-nuanced-thing/) | Practitioner perspective; *Nothing About Us Without Us* principle; identity-first vs person-first as community choice, not external rule; cites Léonie Watson |
| Léonie Watson | [tink.uk](https://tink.uk) | Blind web standards engineer; cited by Steenhout: *"There is no right or wrong answer because it is a matter of personal choice, and the choice depends on context."* |

### Technical and UX writing

| Source | URL |
| --- | --- |
| Google Developer Style Guide | [developers.google.com/style/accessibility](https://developers.google.com/style/accessibility) |
| UX Content Co. | [uxcontent.com  -  Accessible UX Writing](https://uxcontent.com/accessible-ux-writing-a-guide-for-inclusive-content-design/) |
| A11y Collective | [a11y-collective.com  -  Accessible Writing](https://www.a11y-collective.com/blog/accessible-writing/) |
| SJSU Writing Center | [sjsu.edu  -  Accessible Writing Strategies](https://www.sjsu.edu/writingcenter/docs/handouts/Accessible%20Writing%20Strategies.pdf) |
| Section 508 | [section508.gov  -  Alternative Text](https://www.section508.gov/create/alternative-text/) |
| Grammarly | Clarity and passive voice patterns |
| Hemingway Editor | Sentence length and readability grade |

---

## Rules

All rules ship from `@a11yfred/neighbor/content`. All ship as `warn` by default.

**Why all warnings?** Content is subjective in ways markup is not. A rule that fires on a metaphor inside a novel excerpt, or on an idiom in a developer-facing internal tool, is noise. Every content rule has legitimate exceptions  -  `warn` lets teams decide which matter for their context rather than forcing blanket errors. Upgrade individual rules to `error` in your own config where the stakes are higher.

---

### Disability language

#### `no-ableist-language`

Flags slurs, condescending euphemisms, and suffering-framing when writing about disability.

**WCAG basis:** SC 3.1.1 (Language of Page). While WCAG does not enumerate specific words, content that demeans or excludes users undermines the perceivable and understandable principles the spec is built on.

**Consensus:** Every disability language guide surveyed  -  NCDJ, AP Stylebook, ADA National Network, APA Style, SIGACCESS  -  independently prohibits these terms. No credible source defends them.

What it catches:

| Avoid | Instead use | Sources |
| --- | --- | --- |
| cripple / crippled | person with a mobility disability | NCDJ, AP, ADA NN, APA |
| retarded / retard | person with an intellectual disability | NCDJ, AP, ADA NN, APA |
| dumb | mute / nonverbal | NCDJ, ADA NN |
| lame | weak / unconvincing | NCDJ, A11y Collective |
| special needs | disability / person with a disability | NCDJ, AP, ADA NN, APA |
| differently abled | person with a disability | NCDJ, AP, ADA NN, APA |
| handi-capable / physically challenged | person with a disability | NCDJ, AP, ADA NN |
| wheelchair-bound / confined to a wheelchair | wheelchair user | NCDJ, AP, ADA NN, APA, SIGACCESS |
| suffers from | has / lives with | NCDJ, AP, ADA NN, APA |
| afflicted with / victim of | has / lives with | NCDJ, AP, ADA NN, APA |
| committed suicide | died by suicide | ADA NN, APA, AP Stylebook 2022 |
| crazy / psycho | wild / reckless (in non-clinical use) | NCDJ, A11y Collective |
| hearing-impaired | deaf / hard of hearing | NCDJ, AP, ADA NN, APA |
| the disabled / the blind / the deaf | people with disabilities / blind people / deaf people | NCDJ, AP, ADA NN, APA, SIGACCESS |
| normal people / normal hearing | people without disabilities / typical hearing | AP, ADA NN, APA, SIGACCESS |
| handicapped | person with a disability / accessible (for spaces) | NCDJ, AP, ADA NN |

**Identity-first vs person-first language:** "Autistic person" and "person with autism" are both used in disability communities. APA (2022) accepts both and recommends following individual preference. [Nicolas Steenhout](https://incl.ca/disability-language-is-a-nuanced-thing/) notes the current momentum in disability advocacy is toward identity-first language as reclamation, while person-first remains standard in many clinical and government contexts. [Léonie Watson](https://tink.uk), cited by Steenhout: *"There is no right or wrong answer because it is a matter of personal choice, and the choice depends on context."* This rule does not flag either form.

Configuration:

```js
'@a11yfred/neighbor/content/no-ableist-language': ['warn', {
  allow: ['crazy-good'] // strings to suppress
}]
```

---

#### `no-disability-metaphor`

Flags figurative uses of disability language  -  disability used as a metaphor in non-clinical prose.

**WCAG basis:** No direct SC. Grounded in NCDJ, A11y Collective, and APA guidance that these uses normalise disability as a negative even when not intended that way.

What it catches:

| Avoid | Instead use | Sources |
| --- | --- | --- |
| blind spot | gap / oversight / unaware of | NCDJ, A11y Collective |
| turning a blind eye | ignoring / overlooking | NCDJ, A11y Collective |
| tone deaf | out of touch / insensitive | NCDJ, A11y Collective |
| falling on deaf ears | being ignored / going unheard | NCDJ, A11y Collective |
| paralyzed by / paralyzed with | overwhelmed by / unable to act because of | NCDJ, A11y Collective |
| crippling debt / crippling fear | devastating / crushing | NCDJ, A11y Collective |
| schizophrenic approach | contradictory / inconsistent | NCDJ, APA |

---

### Clarity and plain language

#### `no-english-idiom`

Flags English idioms and sports metaphors that are opaque to ESL readers and international audiences.

**WCAG basis:** SC 3.1.5 (Reading Level). Idioms systematically fail this criterion for non-native English speakers because their meaning cannot be inferred from constituent words. No other accessibility linting tool flags idioms  -  this is the most novel rule in this set.

**Sources:** Canadian Government accessible documents guide, SJSU accessible writing strategies, UX Content Co., A11y Collective.

What it catches:

| Avoid | Instead use |
| --- | --- |
| boil the ocean | attempt everything at once |
| move the needle | make progress / have an impact |
| blue-sky thinking | open-ended brainstorming |
| drink the Kool-Aid | follow without question |
| low-hanging fruit | easiest tasks / quick wins |
| circle back | follow up / return to |
| take it offline | discuss separately |
| deep dive | thorough review |
| level-set | align / agree on expectations |
| back to square one | starting over |
| in the pipeline | planned / in progress |
| on the same page | in agreement |
| catch-22 | impossible situation |
| hit the ground running | start immediately |
| on the fence | undecided |
| bite the bullet | proceed despite difficulty |
| under the weather | unwell / sick |
| ballpark | rough estimate |
| slam dunk | certain success |
| drop the ball | make a mistake |
| game-changer | major shift |
| level the playing field | create equal conditions |
| move the goalposts | change the requirements |
| touch base | check in / follow up |

---

#### `no-directional-language`

Flags content that gives instructions using screen position ("above", "in the right sidebar").

**WCAG basis:** SC 1.3.3 (Sensory Characteristics)  -  instructions shall not rely solely on location or sensory characteristics. Position references break for screen reader users, keyboard users, and anyone who zooms or reflows the page.

**Sources:** SBA Content Style Guide, Google Developer Style Guide, WCAG SC 1.3.3.

**What it catches:** "see above", "in the right sidebar", "refer to the table below", "as shown above", "in the left column".

---

#### `no-unexplained-abbreviation`

Flags abbreviations and acronyms used without a prior expansion in the same file.

**WCAG basis:** SC 3.1.4 (Abbreviations)  -  a mechanism shall be available for identifying the expanded form of abbreviations.

**Sources:** Google Developer Style Guide, GOV.UK, wcag.com/authors, SBA, US Plain Language, Canadian Government.

**Configuration:** Add project-specific known abbreviations to suppress:

```js
'@a11yfred/neighbor/content/no-unexplained-abbreviation': ['warn', {
  known: ['CMS', 'HIPAA', 'FHIR']
}]
```

---

#### `no-all-caps-prose`

Flags ALL CAPS words in prose content.

**Why it matters:** Some screen readers using high verbosity settings read ALL CAPS letter-by-letter ("H-E-L-P" instead of "help"). Also reduces readability for users with dyslexia. IMPORTANT, WARNING, NOTE, and common acronyms are excluded by default.

**Sources:** Google Developer Style Guide, GOV.UK publishing guide, Canadian Government guide.

Configuration:

```js
'@a11yfred/neighbor/content/no-all-caps-prose': ['warn', {
  known: ['GDPR', 'CCPA'] // additional known acronyms to allow
}]
```

---

#### `no-ampersand-in-prose`

Flags `&` used in place of "and" in prose.

**Why it matters:** Screen readers may announce `&` as "ampersand" or skip it entirely  -  behaviour is inconsistent across AT vendors and verbosity settings.

**Sources:** Google Developer Style Guide, US Plain Language guide.

---

### UX copy and error messages

#### `no-vague-cta`

Flags vague call-to-action and link text.

**WCAG basis:** SC 2.4.4 (Link Purpose, In Context)  -  link purpose shall be determinable from the link text alone. Patterns like "click here" or "read more" are the most-cited failure in the annual WebAIM Million report.

**Sources:** W3C WAI, wcag.com/authors, Google Developer Style Guide, SBA, UX Content Co., A11y Collective, GOV.UK, WebAIM Million.

**What it catches:** "click here", "here", "read more", "learn more", "more", "this", "link", "tap here", "go", "details", "info", "information".

---

#### `no-vague-error-message`

Flags error messages that do not explain what went wrong.

**WCAG basis:** SC 3.3.1 (Error Identification)  -  if an input error is detected, the item in error shall be described. SC 3.3.3 (Error Suggestion)  -  suggestions for correction shall be provided. "An error occurred" satisfies neither.

**Sources:** UX Content Co., Google Developer Style Guide.

**What it catches:** "An error occurred", "Something went wrong", "Error", "Unknown error", "Unexpected error", "Oops", "Request failed", "Operation failed", "Please try again".

---

## Rules not included

| Pattern | Reason not included |
| --- | --- |
| Passive voice | Hemingway and Grammarly both flag this, and the plain language guides recommend active voice. However, passive voice has many legitimate uses in technical and legal writing. The false-positive rate is high enough that it would generate more noise than signal for most codebases. Recommended alternative: use Grammarly or Hemingway for prose review outside the linter. |
| Sentence length | A 25-word threshold is the most commonly cited guideline (Google Dev Style, GOV.UK). However, compound technical sentences often need to exceed this. A sentence-length rule would require calibration per content type and is better suited to a prose editor than a code linter. |
| Reading grade level | Cannot be computed accurately from string literals in a JS AST without analysing full document context. Better measured by Hemingway on full page text. |
| Adverbs and qualifiers ("very", "really", "quite") | Flagged by Grammarly and Hemingway as weak writing. Not an accessibility-specific issue and false-positive rate in code string literals is extremely high. |
| Cultural references | Too broad to enumerate reliably. No finite term list is possible. |
| Placeholder used as label | Overlaps with `jsx-a11y/label-has-associated-control`. Check that rule first before enabling here. |
