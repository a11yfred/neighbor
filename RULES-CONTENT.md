# @a11yfred/neighbor: Content Rules

Rules for accessible and inclusive web and app copy.

→ [Markup rules](RULES-MARKUP.md) · [CSS rules](RULES-CSS.md) · [Back to RULES.md](RULES.md)

---

## On language

Language is sensitive and always changing. What is okay depends on who is talking, who is listening, and the culture. A word that is fine today might be offensive tomorrow.

A linter cannot solve this. Humans must check it.

Accessibility expert [Nicolas Steenhout](https://incl.ca/disability-language-is-a-nuanced-thing/) says we should not make strict language rules. Disabled people should decide what words to use, following the rule *[Nothing About Us Without Us](https://en.wikipedia.org/wiki/Nothing_About_Us_Without_Us)*. When people outside a community make up polite words (like "handicapable"), it often makes things worse.

As blind web standards engineer [Léonie Watson](https://tink.uk) says: *"There is no right or wrong answer because it is a matter of personal choice, and the choice depends on context."*

Because of this, these rules only warn you about words that experts agree are bad. We do not make rules for words that people still argue about. If a rule gives a warning in a safe place (like quoting someone or an internal tool), you can ignore it.

All content rules are set to `warn`, not `error`. A warning tells you to think. An error tells you the linter is 100% sure, and language is never 100% sure.

If these rules do not fit your project, you can turn them off, use the `allow` option, or submit a PR to change them.

---

## Rule methodology

A rule is added only if:

1. WCAG says it is bad, **or** at least 3 expert guides say it is bad.
2. The linter can easily find it with a simple string match. No AI or guessing.
3. Experts agree it is bad. If experts disagree, we do not add the rule.

We do not include rules that are subjective or hard to check, like sentence length or passive voice. Tools like Grammarly or Hemingway are better for that.

---

## Sources

These rules come from these sources. Where sources conflict, W3C WAI wins.

### Global standards

| Source | URL |
| --- | --- |
| W3C WAI Writing Tips | [w3.org/WAI/tips/writing](https://www.w3.org/WAI/tips/writing/) - primary authority |
| WCAG 2.2 | [w3.org/TR/WCAG22](https://www.w3.org/TR/WCAG22/) |
| wcag.com/authors | [wcag.com/authors](https://wcag.com/authors/) |

### English-speaking governments

| Country | Source |
| --- | --- |
| Australia | [Australian Government Style Manual - Accessible and Inclusive Content](https://www.stylemanual.gov.au/accessible-and-inclusive-content) |
| Canada | [Government of Canada - Guidelines for Creating Accessible Documents](https://accessible.canada.ca/guidelines-creating-accessible-documents) |
| United Kingdom | [GOV.UK - Publishing Accessible Documents](https://www.gov.uk/guidance/publishing-accessible-documents) |
| United Kingdom | [DWP Accessibility Manual](https://accessibility-manual.dwp.gov.uk/best-practice/writing-content) |
| United Kingdom | [GOV.UK Communications - accessible communications resources](https://www.communications.gov.uk/guidance/accessible-communications/accessible-communications-learning-and-resources/) |
| United States | [plainlanguage.gov](https://www.plainlanguage.gov) / [digital.gov/guides/plain-language](https://digital.gov/guides/plain-language) |
| United States | [SBA Content Style Guide](https://advocacy.sba.gov/office-of-advocacy-content-style-guide/writing-accessible-content/) |

### Disability language authorities

| Source | URL | Notes |
| --- | --- | --- |
| ADA National Network | [adata.org/factsheet/ADANN-writing](https://adata.org/factsheet/ADANN-writing) | U.S. legal/advocacy context |
| AP Stylebook - Disability | [amdisrights.org/ap-stylebook-primer-on-disability](https://amdisrights.org/ap-stylebook-primer-on-disability) | Wire journalism standard |
| APA Style - Disability | [apastyle.apa.org - bias-free language](https://apastyle.apa.org/style-grammar-guidelines/bias-free-language/disability) | Academic publishing standard |
| Léonie Watson | [tink.uk](https://tink.uk) | Blind web standards engineer; cited by Steenhout: *"There is no right or wrong answer because it is a matter of personal choice, and the choice depends on context."* |
| NCDJ Disability Language Style Guide | [cronkite.asu.edu/ncdj](https://cronkite.asu.edu/ncdj/disability-language-style-guide) | Journalism standard; updated regularly |
| Nicolas Steenhout | [incl.ca - Disability Language Is a Nuanced Thing](https://incl.ca/disability-language-is-a-nuanced-thing/) | Practitioner perspective; *Nothing About Us Without Us* principle; identity-first vs person-first as community choice, not external rule; cites Léonie Watson |
| SIGACCESS Accessible Writing Guide | [sigaccess.org](https://www.sigaccess.org/welcome-to-sigaccess/resources/accessible-writing-guide/) | Computing research community |

### Technical and UX writing

| Source | URL |
| --- | --- |
| A11y Collective | [a11y-collective.com - Accessible Writing](https://www.a11y-collective.com/blog/accessible-writing/) |
| Google Developer Style Guide | [developers.google.com/style/accessibility](https://developers.google.com/style/accessibility) |
| Grammarly | Clarity and passive voice patterns |
| Hemingway Editor | Sentence length and readability grade |
| Section 508 | [section508.gov - Alternative Text](https://www.section508.gov/create/alternative-text/) |
| SJSU Writing Center | [sjsu.edu - Accessible Writing Strategies](https://www.sjsu.edu/writingcenter/docs/handouts/Accessible%20Writing%20Strategies.pdf) |
| UX Content Co. | [uxcontent.com - Accessible UX Writing](https://uxcontent.com/accessible-ux-writing-a-guide-for-inclusive-content-design/) |

### Source abbreviations

When rule tables cite sources, they use these abbreviations:

| Abbreviation | Source |
| --- | --- |
| A11y Collective | A11y Collective Accessible Writing |
| ADA NN | ADA National Network |
| AP | AP Stylebook (wire journalism standard) |
| APA | APA Style - Bias-free Language |
| Australian Gov | Australian Government Style Manual |
| Canadian Gov | Government of Canada Accessible Documents Guidelines |
| digital.gov | U.S. Digital.gov Plain Language Guide |
| DWP | DWP Accessibility Manual (UK) |
| Google | Google Developer Style Guide - Accessibility |
| GOV.UK | GOV.UK Publishing Accessible Documents (UK) |
| NAHJ | National Association of Hispanic Journalists |
| NCDJ | National Center for Disability Journalism |
| plainlanguage.gov | U.S. Plain Language Action and Information Network |
| SBA | SBA Content Style Guide (U.S.) |
| Scope UK | Scope UK (disability rights organization) |
| Section 508 | Section 508.gov Alternative Text Guide |
| SIGACCESS | SIGACCESS Accessible Writing Guide |
| SJSU | SJSU Writing Center Accessible Writing Strategies |
| TJA | Trans Journalists Association |
| UK Gov | UK Government style and communications |
| UX Content Co. | UX Content Co. Accessible UX Writing |
| W3C WAI | W3C WAI Writing Tips |
| WCAG 2.2 | WCAG 2.2 specification |

---

## Rules

All rules ship from `@a11yfred/neighbor/content`. All ship as `warn` by default.

**Why all warnings?** Content is subjective. A rule that warns on a metaphor inside a book, or on an idiom in an internal tool, is noise. Every rule has valid exceptions. `warn` lets your team decide if it matters. Upgrade rules to `error` if you want to be strict.

---

### Disability language

#### `no-ableist-language`

Finds offensive words and words that frame disability as suffering.

**WCAG basis:** SC 3.1.1 (Language of Page). While WCAG does not enumerate specific words, content that demeans or excludes users undermines the perceivable and understandable principles the spec is built on.

**Consensus:** Every disability language guide surveyed - NCDJ, AP Stylebook, ADA National Network, APA Style, SIGACCESS - independently prohibits these terms. No credible source defends them.

What it catches:

| Avoid | Instead use | Sources |
| --- | --- | --- |
| afflicted with / victim of | has / lives with | NCDJ, AP, ADA NN, APA |
| committed suicide | died by suicide | ADA NN, APA, AP Stylebook 2022 |
| crazy / psycho | wild / reckless (in non-clinical use) | NCDJ, A11y Collective |
| cripple / crippled | person with a mobility disability | NCDJ, AP, ADA NN, APA |
| differently abled | person with a disability | NCDJ, AP, ADA NN, APA |
| dumb | mute / nonverbal | NCDJ, ADA NN |
| handi-capable / physically challenged | person with a disability | NCDJ, AP, ADA NN |
| handicapped | person with a disability / accessible (for spaces) | NCDJ, AP, ADA NN |
| hearing-impaired | deaf / hard of hearing | NCDJ, AP, ADA NN, APA |
| lame | weak / unconvincing | NCDJ, A11y Collective |
| normal people / normal hearing | people without disabilities / typical hearing | AP, ADA NN, APA, SIGACCESS |
| retarded / retard | person with an intellectual disability | NCDJ, AP, ADA NN, APA |
| spastic / spaz | clumsy / energetic (highly offensive ableist slur in UK) | Scope UK |
| special needs | disability / person with a disability | NCDJ, AP, ADA NN, APA |
| suffers from | has / lives with | NCDJ, AP, ADA NN, APA |
| the disabled / the blind / the deaf | people with disabilities / blind people / deaf people | NCDJ, AP, ADA NN, APA, SIGACCESS |
| wheelchair-bound / confined to a wheelchair | wheelchair user | NCDJ, AP, ADA NN, APA, SIGACCESS |

**Identity-first vs person-first language:** "Autistic person" and "person with autism" are both used in disability communities. APA (2022) accepts both and recommends following individual preference. [Nicolas Steenhout](https://incl.ca/disability-language-is-a-nuanced-thing/) notes the current momentum in disability advocacy is toward identity-first language as reclamation, while person-first remains standard in many clinical and government contexts. [Léonie Watson](https://tink.uk), cited by Steenhout: *"There is no right or wrong answer because it is a matter of personal choice, and the choice depends on context."* This rule does not flag either form.

Configuration:

```js
'@a11yfred/neighbor/content/no-ableist-language': ['warn', {
  allow: ['crazy-good'] // strings to suppress
}]
```

---

#### `no-disability-metaphor`

Finds disability words used as metaphors.

**WCAG basis:** No direct SC. Grounded in NCDJ, A11y Collective, and APA guidance that these uses normalise disability as a negative even when not intended that way.

What it catches:

| Avoid | Instead use | Sources |
| --- | --- | --- |
| blind spot | gap / oversight / unaware of | NCDJ, A11y Collective |
| crippling debt / crippling fear | devastating / crushing | NCDJ, A11y Collective |
| falling on deaf ears | being ignored / going unheard | NCDJ, A11y Collective |
| paralyzed by / paralyzed with | overwhelmed by / unable to act because of | NCDJ, A11y Collective |
| schizophrenic approach | contradictory / inconsistent | NCDJ, APA |
| tone deaf | out of touch / insensitive | NCDJ, A11y Collective |
| turning a blind eye | ignoring / overlooking | NCDJ, A11y Collective |

---

### Clarity and plain language

#### `no-english-idiom`

Finds English idioms and sports metaphors that are hard for ESL readers to understand.

**WCAG basis:** SC 3.1.5 (Reading Level). Idioms systematically fail this criterion for non-native English speakers because their meaning cannot be inferred from constituent words. No other accessibility linting tool flags idioms - this is the most novel rule in this set.

**Sources:** Canadian Government accessible documents guide, SJSU accessible writing strategies, UX Content Co., A11y Collective.

What it catches:

| Avoid | Instead use |
| --- | --- |
| back to square one | starting over |
| ballpark | rough estimate |
| bite the bullet | proceed despite difficulty |
| blue-sky thinking | open-ended brainstorming |
| boil the ocean | attempt everything at once |
| catch-22 | impossible situation |
| circle back | follow up / return to |
| deep dive | thorough review |
| drink the Kool-Aid | follow without question |
| drop the ball | make a mistake |
| game-changer | major shift |
| hit the ground running | start immediately |
| in the pipeline | planned / in progress |
| level the playing field | create equal conditions |
| level-set | align / agree on expectations |
| low-hanging fruit | easiest tasks / quick wins |
| move the goalposts | change the requirements |
| move the needle | make progress / have an impact |
| on the fence | undecided |
| on the same page | in agreement |
| slam dunk | certain success |
| take it offline | discuss separately |
| touch base | check in / follow up |
| under the weather | unwell / sick |

---

#### `no-directional-language`

Finds instructions that tell users where things are on the screen (like "above" or "on the right").

**WCAG basis:** SC 1.3.3 (Sensory Characteristics) - instructions shall not rely solely on location or sensory characteristics. Position references break for screen reader users, keyboard users, and anyone who zooms or reflows the page.

**Sources:** SBA Content Style Guide, Google Developer Style Guide, WCAG SC 1.3.3.

**What it catches:** "see above", "in the right sidebar", "refer to the table below", "as shown above", "in the left column".

---

#### `no-unexplained-abbreviation`

Finds short words or acronyms used before you explain them.

**WCAG basis:** SC 3.1.4 (Abbreviations) - a mechanism shall be available for identifying the expanded form of abbreviations.

**Sources:** Google Developer Style Guide, GOV.UK, wcag.com/authors, SBA, US Plain Language, Canadian Government.

**Configuration:** Add project-specific known abbreviations to suppress:

```js
'@a11yfred/neighbor/content/no-unexplained-abbreviation': ['warn', {
  known: ['CMS', 'HIPAA', 'FHIR']
}]
```

---

#### `no-all-caps-prose`

Finds words in ALL CAPS.

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

Finds `&` used instead of "and".

**Why it matters:** Screen readers may announce `&` as "ampersand" or skip it entirely - behavior is inconsistent across AT vendors and verbosity settings.

**Sources:** Google Developer Style Guide, US Plain Language guide.

---

---

### Inclusive Jargon & Decolonized Language

#### `no-exclusive-language`

Finds violent, culturally insensitive, or racist tech jargon.

**WCAG basis:** No direct SC. Grounded in Google, Microsoft, and public health style guides that emphasize the tech industry moving away from appropriated language.

What it catches:

| Avoid | Instead use | Sources |
| --- | --- | --- |
| blacklist / whitelist | denylist / allowlist | Google, MS, Prevention.org |
| caucasian | white / specific descent | UPenn |
| colored people, coloured | people of color (avoid 'coloured' which is highly offensive in the UK) | APA, AP Style |
| dummy | placeholder, sample, or mock | Google |
| Eskimo | Alaska Native / Inuit | AP Style, Microsoft |
| guys | folks, everyone, or team | Google, MS |
| master / slave | primary / replica or main / worker | Google, MS, Prevention.org |
| Negro, Afro-American | Black / African American / specific descent | AP Style, APA |
| Oriental | Asian / specific descent | AP Style, Microsoft |
| Paki | specific descent (highly offensive slur in UK, avoid entirely) | UK Gov |
| sanity check | quick check or confidence check | Google |
| spirit animal, powwow, ninja, guru, tribe | remove, or use literal terms | MS, Prevention.org |

---

#### `no-colonial-and-violent-language`

Finds words based on colonialism or violence when talking about people.

**WCAG basis:** No direct SC.

What it catches:

| Avoid | Instead use | Sources |
| --- | --- | --- |
| stakeholder | partner, collaborator, contributor, community member | SkilledWork |
| tackle / combat (communities/people) | address, collaborate with, eliminate (the issue) | Prevention.org |
| target population / target audience | group of focus, intended audience, specific population | SkilledWork, Prevention.org |

*(Note: "stakeholder" originates from the colonial practice of planting a stake to claim land; "target" conjures a mark to shoot at).*

---

### Deficit vs Strengths-Based Language

#### `no-deficit-language`

Finds words that reduce people to their bad situations.

**WCAG basis:** No direct SC. Grounded in modern public health and non-profit communications.

What it catches:

| Avoid | Instead use | Sources |
| --- | --- | --- |
| addict, drug abuse | person with a substance use disorder | Prevention.org |
| at-risk youth, vulnerable groups | opportunity youth, groups experiencing vulnerability | SkilledWork, Prevention.org, ACECQA |
| illegal immigrant | undocumented immigrant | UPenn |
| inmate, felon, offender, convict | person with legal system involvement | SkilledWork |
| minority | historically marginalized group / people of color | APA, Prevention.org |
| non-English speaking | multilingual learner | ACECQA |
| the elderly, seniors | older adults | UPenn, SkilledWork |
| the homeless | people experiencing homelessness | Prevention.org, SkilledWork |

---

#### `no-gendered-language`

Finds gendered pronouns when you don't know the gender.

What it catches:

| Avoid | Instead use | Sources |
| --- | --- | --- |
| born a man/woman, biologically male/female | assigned male/female at birth | UPenn, NAHJ |
| fireman, policeman, chairman | firefighter, police officer, chairperson | GOV.UK, Canada |
| he/she, he or she, his or her | they, their, you, the user | MS, Google |
| husband / wife, boyfriend / girlfriend | partner, spouse (when gender is unknown) | APA, Google, NAHJ |
| male-bodied, female-bodied | assigned male/female at birth | TJA |
| mum and dad | families, parents, carers | ACECQA |
| opposite sex, opposite gender | different gender, another sex | APA, TJA |

---

### LGBTQ+ Language

#### `no-anti-lgbtq-language`

Finds old or offensive words about sexual orientation and gender.

**WCAG basis:** No direct SC. Grounded in APA, AP Style, and Trans Journalists Association guidelines.

What it catches:

| Avoid | Instead use | Sources |
| --- | --- | --- |
| faggot, fag | (highly offensive slur, avoid entirely. Note: 'fag' is slang for cigarette in UK but a slur in US) | AP Style |
| homosexual | gay, lesbian, bisexual | APA, AP Style, NAHJ |
| queer | (use only if referring to self-identification, otherwise avoid as it can be considered a slur) | AP Style, UK Gov |
| sexual preference | sexual orientation | APA, AP Style, NAHJ |
| trans male, trans female | trans man, trans woman | TJA |
| trans-identified | transgender | TJA |
| transgendered, a transgender | transgender, a transgender person | TJA, APA, AP Style |
| transgenderism, trans ideology, gender ideology | transgender people, trans rights | TJA |
| transvestite, cross-dresser | transgender (or use specific terms as preferred) | NAHJ, TJA |

---

### Device-Agnostic Actions

#### `no-device-specific-action`

Finds instructions that only make sense for one device (like 'click' or 'swipe').

**WCAG basis:** Grounded in inclusive writing principles to not exclude touchscreen, keyboard, and alternative input users.

What it catches:

| Avoid | Instead use | Sources |
| --- | --- | --- |
| click on, click the | choose, select | Apple, Google |
| swipe the | choose, select, navigate | Apple |
| tap on, tap the | choose, select | Apple, Google |

---

### UX copy and error messages

#### `no-vague-cta`

Finds confusing link and button text.

**WCAG basis:** SC 2.4.4 (Link Purpose, In Context) - link purpose shall be determinable from the link text alone. Patterns like "click here" or "read more" are the most-cited failure in the annual WebAIM Million report.

**Sources:** W3C WAI, wcag.com/authors, Google Developer Style Guide, SBA, UX Content Co., A11y Collective, GOV.UK, WebAIM Million.

**What it catches:** "click here", "here", "read more", "learn more", "more", "this", "link", "tap here", "go", "details", "info", "information".

---

#### `no-vague-error-message`

Finds error messages that do not explain what is wrong.

**WCAG basis:** SC 3.3.1 (Error Identification) - if an input error is detected, the item in error shall be described. SC 3.3.3 (Error Suggestion) - suggestions for correction shall be provided. "An error occurred" satisfies neither.

**Sources:** UX Content Co., Google Developer Style Guide.

**What it catches:** "An error occurred", "Something went wrong", "Error", "Unknown error", "Unexpected error", "Oops", "Request failed", "Operation failed", "Please try again".

---

## Rules not included

| Pattern | Reason not included |
| --- | --- |
| Adverbs and qualifiers ("very", "really", "quite") | Flagged by Grammarly and Hemingway as weak writing. Not an accessibility-specific issue and false-positive rate in code string literals is extremely high. |
| Cultural references | Too broad to enumerate reliably. No finite term list is possible. |
| Passive voice | Hemingway and Grammarly both flag this, and the plain language guides recommend active voice. However, passive voice has many legitimate uses in technical and legal writing. The false-positive rate is high enough that it would generate more noise than signal for most codebases. Recommended alternative: use Grammarly or Hemingway for prose review outside the linter. |
| Placeholder used as label | Overlaps with `jsx-a11y/label-has-associated-control`. Check that rule first before enabling here. |
| Reading grade level | Cannot be computed accurately from string literals in a JS AST without analysing full document context. Better measured by Hemingway on full page text. |
| Sentence length | A 25-word threshold is the most commonly cited guideline (Google Dev Style, GOV.UK). However, compound technical sentences often need to exceed this. A sentence-length rule would require calibration per content type and is better suited to a prose editor than a code linter. |
