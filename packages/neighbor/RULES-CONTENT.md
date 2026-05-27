# @a11yfred/neighbor: Content Rules

Rules for accessible and inclusive web and app copy.

→ [Markup rules](RULES-MARKUP.md) · [CSS rules](RULES-CSS.md) · [Back to RULES.md](RULES.md)

---

## On Language

Language is sensitive and always changing. What is okay depends on who is talking, who is listening, and the culture. A word that is fine today might be offensive tomorrow.

A linter cannot solve this. Humans must check it.

Accessibility expert [Nicolas Steenhout](https://incl.ca/disability-language-is-a-nuanced-thing/) says we should not make strict language rules. Disabled people should decide what words to use, following the rule *[Nothing About Us Without Us](https://en.wikipedia.org/wiki/Nothing_About_Us_Without_Us)*. When people outside a community make up polite words (like "handicapable"), it often makes things worse.

As blind web standards engineer [Léonie Watson](https://tink.uk) says: *"There is no right or wrong answer because it is a matter of personal choice, and the choice depends on context."*

Because of this, these rules only warn you about words that experts agree are bad. We do not make rules for words that people still argue about. If a rule gives a warning in a safe place (like quoting someone or an internal tool), you can ignore it.

All content rules are set to `warn`, not `error`. A warning tells you to think. An error tells you the linter is 100% sure, and language is never 100% sure.

If these rules do not fit your project, you can turn them off, use the `allow` option, or submit a PR to change them.

---

## Rule Methodology

A rule is added only if:

1. WCAG says it is bad, **or** at least 3 expert guides say it is bad.
2. The linter can easily find it with a simple string match. No AI or guessing.
3. Experts agree it is bad. If experts disagree, we do not add the rule.

We do not include rules that are subjective or hard to check, like sentence length or passive voice. Tools like Grammarly or Hemingway are better for that.

---

## Sources

These rules are synthesized from **42 authoritative sources** across three main categories:

- **Government & Public Sector (20 sources)**: Guidelines from plainlanguage.gov, GOV.UK, Australian Government, GovTech Singapore, Government of Canada, digital.govt.nz (New Zealand), GCIS (South Africa), and various US/UK health and human services.
- **Journalism & Editorial (7 sources)**: Stylebooks and publishing standards including the AP Stylebook, Trans Journalists Association (TJA), National Association of Hispanic Journalists (NAHJ), BBC Academy / News style guides, and The New York Times Manual of Style and Usage.
- **Academic, Technical & Corporate (15 sources)**: Directives and style guides from the APA, SIGACCESS, Google, Microsoft, IBM, Salesforce, and Mailchimp.

Where sources conflict, W3C WAI wins.[View the full list of sources and URLs at the bottom of this page.](#full-source-list)

### Source Abbreviations

When rule tables cite sources, they use these abbreviations:

<details><summary>Show source abbreviations</summary>

| Abbreviation | Source |
| --- | --- |
| 18F | U.S. General Services Administration (18F) |
| A11y Collective | A11y Collective Accessible Writing |
| ADA NN | ADA National Network |
| AP | AP Stylebook (wire journalism standard) |
| APA | APA Style - Bias-free Language |
| BBC | BBC Academy / News style guide |
| Australian Gov | Australian Government Style Manual |
| Brandeis | Brandeis University |
| Canadian Gov | Government of Canada Accessible Documents Guidelines |
| CDC | Centers for Disease Control and Prevention (U.S.) |
| digital.gov | U.S. Digital.gov Plain Language Guide |
| DWP | DWP Accessibility Manual (UK) |
| GCIS | Government Communication and Information System (South Africa) |
| Google | Google Developer Style Guide - Accessibility |
| GOV.UK | GOV.UK Publishing Accessible Documents (UK) |
| GovTech Singapore | GovTech Singapore Style Guidelines |
| HHS | U.S. Department of Health and Human Services |
| HUD | U.S. Department of Housing and Urban Development |
| IBM | IBM Style Guide |
| IETF | Internet Engineering Task Force |
| Mailchimp | Mailchimp Content Style Guide |
| NAHJ | National Association of Hispanic Journalists |
| NCDJ | National Center for Disability Journalism |
| NIDA | National Institute on Drug Abuse (U.S.) |
| NIST | U.S. National Institute of Standards and Technology |
| NPR | National Public Radio (journalism) |
| NYT | The New York Times Manual of Style and Usage |
| NZ Gov | New Zealand Government digital.govt.nz guidelines |
| plainlanguage.gov | U.S. Plain Language Action and Information Network |
| SBA | SBA Content Style Guide (U.S.) |
| Salesforce | Salesforce Style Guide |
| Scope UK | Scope UK (disability rights organization) |
| Shopify | Shopify Polaris |
| Section 508 | Section 508.gov Alternative Text Guide |
| SIGACCESS | SIGACCESS Accessible Writing Guide |
| SJSU | SJSU Writing Center Accessible Writing Strategies |
| TJA | Trans Journalists Association |
| UK Gov | UK Government style and communications |
| UN | United Nations Gender-Inclusive and Disability-Inclusive Language Guidelines |
| US DOJ | U.S. Department of Justice |
| UX Content Co. | UX Content Co. Accessible UX Writing |
| W3C WAI | W3C WAI Writing Tips |
| WCAG 2.2 | WCAG 2.2 specification |
| WHO | World Health Organization |

</details>

---

## Rules

All rules ship from `@a11yfred/neighbor/content`. Most terms within these rules are set to `warn` by default, but highly culturally specific regional terms are set to `off` by default.

**Why warnings by default?** Content is subjective. A rule that warns on a metaphor inside a book, or on an idiom in an internal tool, is noise. Every rule has valid exceptions. `warn` lets your team decide if it matters. Upgrade rules to `error` if you want to be strict.

### Culturally Specific & Regional Language

By default, terms that are highly culturally specific or less common for general US/UK audiences are set to `off` (meaning they will not trigger lint warnings by default). These include terms like `untouchable` (India), `indio`/`squatter` (Philippines), `knacker`/`beyond the pale` (Ireland), `part-Aboriginal`/`dreamtime` (Australia), `part-Māori` (New Zealand), `tinker` (Scotland), `half-breed` (Canada), and `kaffir` (South Africa).

To enable warnings for all terms (including these culturally specific ones), pass the `enableOffTerms: true` option in your rule configuration:

```js
'@a11yfred/neighbor/content/no-exclusive-language': ['warn', {
  enableOffTerms: true
}]
```

---

### Disability Language

#### `No-ableist-language`

*Checks 37 terms.*

Finds offensive words and words that frame disability as suffering.

**WCAG basis:** SC 3.1.1 (Language of Page). While WCAG does not enumerate specific words, content that demeans or excludes users undermines the perceivable and understandable principles the spec is built on.

**Consensus:** Every disability language guide surveyed - NCDJ, AP Stylebook, ADA National Network, APA Style, SIGACCESS - independently prohibits these terms. No credible source defends them.

What it catches:

<details>
<summary>View term list and replacements</summary>

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
| mongol / mongoloid | person with Down's syndrome | Scope UK, NHS, DWP |
| retarded / retard | person with an intellectual disability | NCDJ, AP, ADA NN, APA |
| spastic / spaz | clumsy / energetic (highly offensive ableist slur in UK) | Scope UK |
| special needs | disability / person with a disability | NCDJ, AP, ADA NN, APA |
| suffers from | has / lives with | NCDJ, AP, ADA NN, APA |
| the disabled / the blind / the deaf | people with disabilities / blind people / deaf people | NCDJ, AP, ADA NN, APA, SIGACCESS |
| wheelchair-bound / confined to a wheelchair | wheelchair user | NCDJ, AP, ADA NN, APA, SIGACCESS |

</details>

**Identity-first vs person-first language:** "Autistic person" and "person with autism" are both used in disability communities. APA (2022) accepts both and recommends following individual preference. [Nicolas Steenhout](https://incl.ca/disability-language-is-a-nuanced-thing/) notes the current momentum in disability advocacy is toward identity-first language as reclamation, while person-first remains standard in many clinical and government contexts. [Léonie Watson](https://tink.uk), cited by Steenhout: *"There is no right or wrong answer because it is a matter of personal choice, and the choice depends on context."* This rule does not flag either form.

Configuration:

```js
'@a11yfred/neighbor/content/no-ableist-language': ['warn', {
  allow: ['crazy-good'] // strings to suppress
}]
```

---

#### `No-disability-metaphor`

*Checks 10 terms.*

Finds disability words used as metaphors.

**WCAG basis:** No direct SC. Grounded in NCDJ, A11y Collective, and APA guidance that these uses normalize disability as a negative even when not intended that way.

What it catches:

<details>
<summary>View term list and replacements</summary>

| Avoid | Instead use | Sources |
| --- | --- | --- |
| basket case | anxious / nervous / overwhelmed | NCDJ, APA, UW |
| blind spot | gap / oversight / unaware of | NCDJ, A11y Collective |
| crippling debt / crippling fear | devastating / crushing | NCDJ, A11y Collective |
| falling on deaf ears | being ignored / going unheard | NCDJ, A11y Collective |
| paralyzed by / paralyzed with | overwhelmed by / unable to act because of | NCDJ, A11y Collective |
| schizophrenic approach | contradictory / inconsistent | NCDJ, APA |
| tone deaf | out of touch / insensitive | NCDJ, A11y Collective |
| turning a blind eye | ignoring / overlooking | NCDJ, A11y Collective |

</details>

---

### Clarity and Plain Language

#### `No-english-idiom`

*Checks 52 terms.*

Finds English idioms and sports metaphors that are hard for ESL readers to understand.

**WCAG basis:** SC 3.1.5 (Reading Level). Idioms systematically fail this criterion for non-native English speakers because their meaning cannot be inferred from constituent words. No other accessibility linting tool flags idioms - this is the most novel rule in this set.

**Sources:** Canadian Government accessible documents guide, SJSU accessible writing strategies, UX Content Co., A11y Collective.

What it catches:

<details>
<summary>View term list and replacements</summary>

| Avoid | Instead use |
| --- | --- |
| back to square one | starting over / back to the beginning |
| ball park / ballpark | rough estimate / approximate |
| bandwidth | time / capacity / availability |
| best of breed | best / leading / top-performing |
| bite the bullet | endure something difficult / proceed despite difficulty |
| bleeding-edge | state-of-the-art / cutting-edge / pioneering |
| blue-sky thinking | open-ended brainstorming / creative thinking |
| boil the ocean | attempt everything at once / do too much |
| catch-22 | impossible situation / no-win situation |
| circle back | follow up / return to |
| deep dive | thorough review / detailed look |
| deliverable(s) | product / output / result |
| dogfood / eat your own dog food | test internally / use our own products |
| drill down | analyze further / investigate / look closer |
| drink the Kool-Aid | follow without question / accept uncritically |
| drop the ball | make a mistake / fail to follow through |
| ecosystem(s) | platform / suite / products / network |
| field a question | answer / respond to / address |
| game-changer | major shift / significant development |
| granular | detailed / specific |
| hit it out of the park | succeed greatly / do exceptionally well |
| hit the ground running | start immediately / begin without delay |
| in the ball park | approximately / roughly |
| in the pipeline | planned / coming soon / in progress |
| kick-off | start / begin / launch |
| level the playing field | create equal conditions / remove advantages |
| level-set | align / agree on expectations |
| low-hanging fruit | easiest tasks / quick wins |
| move the goalposts | change the requirements / shift the target |
| move the needle | make progress / have an impact |
| on the fence | undecided / uncertain |
| on the same page | in agreement / aligned |
| one-size-fits-all | universal / the same for everyone |
| open the kimono | share information / reveal details / be transparent |
| par for the course | expected / typical / normal |
| paradigm shift | significant change / transformation / new approach |
| peel back the onion | examine more closely / dig deeper |
| pinch-hitter | substitute / stand-in / backup |
| pivot | change direction / shift focus |
| push the envelope | go beyond limits / innovate |
| raise the bar | set a higher standard / improve expectations |
| slam dunk | certain success / easy win |
| synergy | collaboration / combined effect (or rewrite) |
| take it offline | discuss separately / talk privately |
| think outside the box | think creatively / find new approaches |
| thought leader(ship) | expert / specialist / pioneer |
| touch base | check in / reconnect / follow up |
| under the weather | unwell / sick / not feeling well |
| value-add(ed) | benefit / extra value / advantage |
| wheelhouse | area of expertise / specialty |
| whistle-stop | brief / quick |
| wrap your head around | understand / make sense of |

</details>

---

#### `No-directional-language`

*Checks 5 patterns.*

Finds instructions that tell users where things are on the screen (like "above" or "on the right").

**WCAG basis:** SC 1.3.3 (Sensory Characteristics) - instructions shall not rely solely on location or sensory characteristics. Position references break for screen reader users, keyboard users, and anyone who zooms or reflows the page.

**Sources:** SBA Content Style Guide, Google Developer Style Guide, WCAG SC 1.3.3.

**What it catches:** "see above", "in the right sidebar", "refer to the table below", "as shown above", "in the left column".

---

#### `No-unexplained-abbreviation`

*Checks abbreviations against contextual expansions.*

Finds short words or acronyms used before you explain them. **This rule is set to `off` by default.**

**WCAG basis:** SC 3.1.4 (Abbreviations) - a mechanism shall be available for identifying the expanded form of abbreviations.

**Sources:** Google Developer Style Guide, GOV.UK, wcag.com/authors, SBA, US Plain Language, Canadian Government.

**Configuration:** Add project-specific known abbreviations to suppress and enable the rule:

```js
'@a11yfred/neighbor/content/no-unexplained-abbreviation': ['warn', {
  known: ['CMS', 'HIPAA', 'FHIR']
}]
```

---

#### `No-typography-in-prose`

*Checks 2 patterns.*

Finds words in ALL CAPS and ampersands (`&`) used in place of "and" in prose. **This rule is set to `off` by default.**

**Why it matters:**

- **ALL CAPS:** Some screen readers using high verbosity settings read ALL CAPS letter-by-letter ("H-E-L-P" instead of "help"). Also reduces readability for users with dyslexia. `IMPORTANT`, `WARNING`, `NOTE`, and common acronyms are excluded by default.
- **Ampersands:** Screen readers may announce `&` as "ampersand" or skip it entirely - behavior is inconsistent across AT vendors and verbosity settings.

**Sources:** Google Developer Style Guide, GOV.UK publishing guide, Canadian Government guide, US Plain Language guide.

**Configuration:** Add project-specific known acronyms to allow and enable the rule:

```js
'@a11yfred/neighbor/content/no-typography-in-prose': ['warn', {
  known: ['GDPR', 'CCPA']
}]
```

---

---

### Inclusive Jargon & Decolonized Language

#### `No-exclusive-language`

*Checks 44 terms.*

Finds violent, culturally insensitive, or racist tech jargon.

**WCAG basis:** No direct SC. Grounded in Google, Microsoft, and public health style guides that emphasize the tech industry moving away from appropriated language.

What it catches:

<details>
<summary>View term list and replacements</summary>

| Avoid | Instead use | Sources |
| --- | --- | --- |
| beyond the pale | unacceptable / outside acceptable limits | Irish Gov, UK Gov \| (off by default) |
| blacklist / whitelist | denylist / allowlist | Google, MS, NIST, IBM, Salesforce |
| cakewalk | easy win / breeze / simple task | NPR, UW, Brandeis |
| caucasian | white / specific descent | UPenn |
| chav | working-class youth / (avoid derogatory slang) | UK Gov, BBC |
| colored people, coloured | people of color (avoid 'coloured' which is highly offensive in the UK) | APA, AP Style |
| coolie | (highly offensive racial slur, avoid entirely) | SAHRC, Oxford \| (off by default) |
| dreamtime | the Dreaming / [specific language group term] | Australian Gov \| (off by default) |
| dummy | placeholder, sample, or mock | Google |
| Eskimo | Alaska Native / Inuit | AP Style, Microsoft |
| foreign alien | foreign national / non-citizen | GovTech Singapore, US Gov |
| foreign talent | international employee / foreign worker | GovTech Singapore \| (off by default) |
| grandfather / grandfathered | legacy / pre-existing / retain | AP, 18F, UW, Harvard |
| guys | folks, everyone, or team | Google, MS, Mailchimp, Salesforce |
| gyp / gypped | cheat / swindle / rip off | AP, APA, Harvard, UK Gov |
| gypsy / gypsy cab | Romani (for people) / unlicensed taxi (for cab) | AP, APA, UK Gov |
| half-breed | Métis / person of mixed ancestry | Canadian Gov, UBC \| (off by default) |
| half-caste | Aboriginal / Māori / Indigenous person | Australian Gov, NZ Gov, UK Gov |
| indio | Filipino / native | NHCP \| (off by default) |
| kaffir | (highly offensive racial slur, avoid entirely) | SAHRC \| (off by default) |
| knacker | Irish Traveller (highly offensive slur, avoid entirely) | Irish Gov, Pavee Point \| (off by default) |
| master / slave | primary / replica or main / worker | Google, MS, IETF, IBM |
| Negro, Afro-American | Black / African American / specific descent | AP Style, APA |
| no can do | I cannot / impossible | AP, UW, Brandeis |
| non-white | people of color / historically marginalized groups | APA, UCT, CDC |
| off the reservation | unauthorized / unorthodox / deviant / off script | NPR, 18F, UW, Stanford |
| Oriental | Asian / specific descent | AP Style, Microsoft |
| Paki | specific descent (highly offensive slur in UK, avoid entirely) | UK Gov |
| part-Aboriginal | Aboriginal / Indigenous person | Australian Gov \| (off by default) |
| part-Māori / part-Maori | Māori / of Māori descent | NZ Gov \| (off by default) |
| peanut gallery | hecklers / unwelcome commentators | The Conversation, CDC, UW, Brandeis |
| pikey | Traveller / Gypsy (highly offensive slur, avoid entirely) | UK Gov, Irish Gov, AP |
| sanity check | quick check or confidence check | Google |
| sold down the river | betrayed / sold out | NPR, CDC, CSU, Brandeis |
| spirit animal, powwow, ninja, guru, tribe | remove, or use literal terms | MS, Google, APA, NPR, Brandeis |
| tinker | Gypsy/Traveller / (highly offensive slur, avoid entirely) | Scottish Gov, UK Gov \| (off by default) |
| untouchable | Dalit / marginalized communities | India Gov, HRW \| (off by default) |
| uppity | arrogant / snobbish / dismissive | AP, CDC, Harvard, Brandeis |

</details>

---

#### `No-colonial-and-violent-language`

*Checks 3 terms.*

Finds words based on colonialism or violence when talking about people.

**WCAG basis:** No direct SC.

What it catches:

<details>
<summary>View term list and replacements</summary>

| Avoid | Instead use | Sources |
| --- | --- | --- |
| stakeholder | partner, collaborator, contributor, community member | CDC, 18F, WHO |
| tackle / combat (communities/people) | address, collaborate with, eliminate (the issue) | CDC, WHO |
| target population / target audience | group of focus, intended audience, specific population | CDC, WHO |

</details>

*(Note: "stakeholder" originates from the colonial practice of planting a stake to claim land; "target" conjures a mark to shoot at).*

---

### Deficit Vs Strengths-Based Language

#### `No-deficit-language`

*Checks 10 terms.*

Finds words that reduce people to their bad situations.

**WCAG basis:** No direct SC. Grounded in modern public health and non-profit communications.

What it catches:

<details>
<summary>View term list and replacements</summary>

| Avoid | Instead use | Sources |
| --- | --- | --- |
| addict, drug abuse | person with a substance use disorder | APA, CDC, NIDA |
| at-risk youth, vulnerable groups | opportunity youth, groups experiencing vulnerability | CDC, WHO, HHS, ACECQA |
| illegal immigrant | undocumented immigrant | UPenn |
| inmate, felon, offender, convict | person with legal system involvement | AP, US DOJ |
| minority | historically marginalized group / people of color | APA, CDC |
| non-English speaking | multilingual learner | ACECQA |
| squatter | informal settler / resident without formal title | PH Gov \| (off by default) |
| the elderly, seniors | older adults | UPenn, SkilledWork |
| the homeless | people experiencing homelessness | AP, HUD, CDC |

</details>

---

#### `No-gendered-language`

*Checks 14 terms.*

Finds gendered pronouns when the gender is unknown.

What it catches:

<details>
<summary>View term list and replacements</summary>

| Avoid | Instead use | Sources |
| --- | --- | --- |
| born a man/woman, biologically male/female | assigned male/female at birth | UPenn, NAHJ |
| fireman, policeman, chairman, spokesman, spokeswoman, congressman | firefighter / police officer / chairperson / spokesperson / representative | GOV.UK, Canada, UN |
| he/she, he or she, his or her | they, their, you, the user | MS, Google |
| husband / wife, boyfriend / girlfriend | partner, spouse (when gender is unknown) | APA, Google, NAHJ |
| layman | layperson / non-expert | UN, Google |
| male-bodied, female-bodied | assigned male/female at birth | TJA |
| man-made | artificial / synthetic / manufactured / human-made | UN, Google, MS |
| mankind | humanity / human race | UN, Google, MS |
| manpower | workforce / personnel / staff | UN, Google, MS |
| mum and dad | families, parents, carers | ACECQA |
| opposite sex, opposite gender | different gender, another sex | APA, TJA |

</details>

---

### LGBTQ+ Language

#### `No-anti-lgbtq-language`

*Checks 18 terms.*

Finds old or offensive words about sexual orientation and gender.

**WCAG basis:** No direct SC. Grounded in APA, AP Style, and Trans Journalists Association guidelines.

What it catches:

<details>
<summary>View term list and replacements</summary>

| Avoid | Instead use | Sources |
| --- | --- | --- |
| faggot, fag | (highly offensive slur, avoid entirely. Note: 'fag' is slang for cigarette in UK but a slur in US) | AP Style |
| gender identity disorder | gender dysphoria / gender incongruence | APA, WHO |
| hermaphrodite | intersex / person with intersex traits | APA, UK Gov, Australian Gov |
| homosexual | gay, lesbian, bisexual | APA, AP Style, NAHJ |
| lifestyle choice | sexual orientation / gender identity | AP, APA |
| moffie | gay man (highly offensive homophobic slur in South Africa, avoid entirely) | SAHRC \| (off by default) |
| queer | (use only if referring to self-identification, otherwise avoid as it can be considered a slur) | AP Style, UK Gov |
| sex change | gender transition / gender-affirming surgery | AP, APA, TJA |
| sexual preference | sexual orientation | APA, AP Style, NAHJ |
| trans male, trans female | trans man, trans woman | TJA |
| trans-identified | transgender | TJA |
| transgendered, a transgender | transgender, a transgender person | TJA, APA, AP Style |
| transgenderism, trans ideology, gender ideology | transgender people, trans rights | TJA |
| transvestite, cross-dresser | transgender (or use specific terms as preferred) | NAHJ, TJA |

</details>

---

### Device-Agnostic Actions

#### `No-device-specific-action`

*Checks 3 terms.*

Finds instructions that only make sense for one device (like 'click' or 'swipe').

**WCAG basis:** Grounded in inclusive writing principles to not exclude touchscreen, keyboard, and alternative input users.

What it catches:

<details>
<summary>View term list and replacements</summary>

| Avoid | Instead use | Sources |
| --- | --- | --- |
| click on, click the | choose, select | Apple, Google |
| swipe the | choose, select, navigate | Apple |
| tap on, tap the | choose, select | Apple, Google |

</details>

---

### Cross-Dialect Clarity

#### `No-cross-dialect-confusion`

*Checks 32 terms.*

Finds words that cause confusion or inappropriate double entendre across English dialects (e.g. British, American, Indian, Australian English).

**WCAG basis:** Grounded in WCAG SC 3.1.5 (Reading Level) and global inclusivity principles to ensure copy is understandable and not unintentionally vulgar or offensive to international English speakers.

**Sources:** Oxford English Dictionary (OED), Cambridge Dictionary, Nihalani et al. ("Indian and British English Handbook"), Harvard Business Review (HBR), BBC Academy, The New York Times Manual of Style.

What it catches:

<details>
<summary>View term list and replacements</summary>

| Avoid | Instead use | Sources |
| --- | --- | --- |
| backside | rear / behind / back (in US/UK, 'backside' means buttocks) | OED |
| caskets / casket | coffin / jewelry box / (clarify to avoid confusion) | OED, NYT |
| chuffed | pleased / proud / happy | OED, BBC, NYT |
| co-brother | brother-in-law / wife's sister's husband | OED, Nihalani |
| cum | combined with / and / serving as both (avoid 'cum' due to slang/sexual connotation in US/UK/AU) | OED, Nihalani |
| do the needful | do what is necessary / take the necessary action (can sound archaic or passive-aggressive to US/UK speakers) | OED, HBR |
| fanny | waist bag / buttocks (avoid in UK/AU as it is vulgar slang for female genitalia) | OED, Cambridge |
| first floor | ground floor / second floor / (clarify physical floor level) | OED, BBC, NYT |
| fortnight | two weeks / 14 days | OED, BBC, NYT |
| homely | cozy / comfortable / homelike (means plain/unattractive in US, cozy/warm in UK/India) | OED, Cambridge |
| intimate | inform / notify / advise (if meaning to inform) | OED, Nihalani |
| knock up / knocked up | visit / wake up / get pregnant (in US, "knock up" means get pregnant) | OED |
| moot | arguable / irrelevant (means academic/irrelevant in US, open to debate in UK) | OED |
| nappy / nappies | diaper / (avoid in US due to racially offensive connotation) | OED, BBC, NYT |
| nonplussed | confused / unimpressed (avoid due to conflicting standard and informal meanings) | OED |
| out of station | out of town / away (perceived as station reference outside South Asia) | Nihalani |
| pants | trousers / underwear (in UK, 'pants' means underwear and slang for bad; in US, it means trousers) | OED, Cambridge |
| passed out | graduated (outside South Asia, 'passed out' means fainted/unconscious) | Cambridge |
| pecker / peckers | courage / spirits / (avoid to prevent vulgar double entendre in US) | OED, BBC, NYT |
| period | full stop / dot / punctuation mark (to avoid cross-dialect confusion with menstruation or timeframes) | OED, plain language guides |
| pissed | angry / drunk (means angry in US, drunk in UK/AU) | OED |
| prepone | bring forward / schedule earlier / advance | OED, Merriam-Webster |
| revert / reverts / reverted / reverting | reply / get back to / respond (if meaning reply; otherwise return to previous state) | OED, BBC, Nihalani |
| root / rooting | cheering for / supporting / (avoid in AU/NZ to prevent vulgar slang/broken connotation) | OED, BBC |
| rubber / rubbers | eraser / condom (means condom in US, eraser in UK/India) | OED |
| scheme / schemes | program / plan / project (implies a deceptive plot in US) | OED |
| shag / shagged / shags / shagging | exhausted / tired / (avoid due to vulgar slang connotation in UK/AU/NZ) | OED, BBC |
| stepney | spare tire / spare wheel | OED, Nihalani |
| suspenders | braces / garter belt (means trouser straps in US, garter belt in UK) | OED, Cambridge |
| table (verb, e.g. "to table") | postpone / shelve (in US) or bring forward / propose (in UK/Commonwealth) (avoid "table" as it has opposite meanings) | OED, Cambridge |
| trolley / trolleys | shopping cart / streetcar (means shopping cart in UK/AU, streetcar/cable car in US) | OED |
| vest / vests | waistcoat / undershirt (means waistcoat in US, undershirt in UK) | OED |

</details>

---

### UX Copy and Error Messages

#### `No-vague-cta`

*Checks 16 patterns.*

Finds confusing link and button text.

**WCAG basis:** SC 2.4.4 (Link Purpose, In Context) - link purpose shall be determinable from the link text alone. Patterns like "click here" or "read more" are the most-cited failure in the annual WebAIM Million report.

**Sources:** W3C WAI, wcag.com/authors, Google Developer Style Guide, SBA, UX Content Co., A11y Collective, GOV.UK, WebAIM Million.

**What it catches:** "click here", "here", "read more", "learn more", "more", "this", "link", "this link", "this page", "click", "tap here", "tap", "go", "details", "info", "information".

---

#### `No-vague-error-message`

*Checks 9 phrases.*

Finds error messages that do not explain what is wrong.

**WCAG basis:** SC 3.3.1 (Error Identification) - if an input error is detected, the item in error shall be described. SC 3.3.3 (Error Suggestion) - suggestions for correction shall be provided. "An error occurred" satisfies neither.

**Sources:** UX Content Co., Google Developer Style Guide.

**What it catches:** "An error occurred", "Something went wrong", "Error", "Unknown error", "Unexpected error", "Oops", "Request failed", "Operation failed", "Please try again".

---

## Rules Not Included

| Pattern | Reason not included |
| --- | --- |
| Adverbs and qualifiers ("very", "really", "quite") | Flagged by Grammarly and Hemingway as weak writing. Not an accessibility-specific issue and false-positive rate in code string literals is extremely high. |
| Cultural references | Too broad to enumerate reliably. No finite term list is possible. |
| Passive voice | Hemingway and Grammarly both flag this, and the plain language guides recommend active voice. However, passive voice has many legitimate uses in technical and legal writing. The false-positive rate is high enough that it would generate more noise than signal for most codebases. Recommended alternative: use Grammarly or Hemingway for prose review outside the linter. |
| Placeholder used as label | Overlaps with `jsx-a11y/label-has-associated-control`. Check that rule first before enabling here. |
| Reading grade level | Cannot be computed accurately from string literals in a JS AST without analysing full document context. Better measured by Hemingway on full page text. |
| Sentence length | A 25-word threshold is the most commonly cited guideline (Google Dev Style, GOV.UK). However, compound technical sentences often need to exceed this. A sentence-length rule would require calibration per content type and is better suited to a prose editor than a code linter. |

---

## Full Source List

### Global Standards

| Source | URL |
| --- | --- |
| W3C WAI Writing Tips | [w3.org/WAI/tips/writing](https://www.w3.org/WAI/tips/writing/) - primary authority |
| WCAG 2.2 | [w3.org/TR/WCAG22](https://www.w3.org/TR/WCAG22/) |
| wcag.com/authors | [wcag.com/authors](https://wcag.com/authors/) |
| United Nations | [un.org/en/gender-inclusive-language](https://www.un.org/en/gender-inclusive-language/) / [Disability-Inclusive Language Guidelines](https://www.un.org/en/content/disability-inclusive-language-guidelines/) |

### English-speaking Governments

| Country | Source |
| --- | --- |
| Australia | [Australian Government Style Manual - Accessible and Inclusive Content](https://www.stylemanual.gov.au/accessible-and-inclusive-content) |
| Canada | [Government of Canada - Guidelines for Creating Accessible Documents](https://accessible.canada.ca/guidelines-creating-accessible-documents) |
| Singapore | [GovTech Singapore Writing Style Guide](https://www.developer.tech.gov.sg/) |
| United Kingdom | [GOV.UK - Publishing Accessible Documents](https://www.gov.uk/guidance/publishing-accessible-documents) |
| United Kingdom | [DWP Accessibility Manual](https://accessibility-manual.dwp.gov.uk/best-practice/writing-content) |
| New Zealand | [digital.govt.nz - Content design guidance](https://www.digital.govt.nz/standards-and-guidance/design-and-ux/content-design-guidance/) / Plain Language Act 2022 |
| South Africa | [GCIS Style Guide for Government Communicators](https://www.gcis.gov.za/) / [SAHRC Equality Guidelines](https://www.sahrc.org.za/) |
| United Kingdom | [GOV.UK Communications - accessible communications resources](https://www.communications.gov.uk/guidance/accessible-communications/accessible-communications-learning-and-resources/) |
| United States | [plainlanguage.gov](https://www.plainlanguage.gov) / [digital.gov/guides/plain-language](https://digital.gov/guides/plain-language) |
| United States | [SBA Content Style Guide](https://advocacy.sba.gov/office-of-advocacy-content-style-guide/writing-accessible-content/) |

### Disability Language Authorities

| Source | URL | Notes |
| --- | --- | --- |
| ADA National Network | [adata.org/factsheet/ADANN-writing](https://adata.org/factsheet/ADANN-writing) | U.S. legal/advocacy context |
| AP Stylebook - Disability | [amdisrights.org/ap-stylebook-primer-on-disability](https://amdisrights.org/ap-stylebook-primer-on-disability) | Wire journalism standard |
| APA Style - Disability | [apastyle.apa.org - bias-free language](https://apastyle.apa.org/style-grammar-guidelines/bias-free-language/disability) | Academic publishing standard |
| Léonie Watson | [tink.uk](https://tink.uk) | Blind web standards engineer; cited by Steenhout: *"There is no right or wrong answer because it is a matter of personal choice, and the choice depends on context."* |
| NCDJ Disability Language Style Guide | [cronkite.asu.edu/ncdj](https://cronkite.asu.edu/ncdj/disability-language-style-guide) | Journalism standard; updated regularly |
| Nicolas Steenhout | [incl.ca - Disability Language Is a Nuanced Thing](https://incl.ca/disability-language-is-a-nuanced-thing/) | Practitioner perspective; *Nothing About Us Without Us* principle; identity-first vs person-first as community choice, not external rule; cites Léonie Watson |
| SIGACCESS Accessible Writing Guide | [sigaccess.org](https://www.sigaccess.org/welcome-to-sigaccess/resources/accessible-writing-guide/) | Computing research community |

### Technical and UX Writing

| Source | URL |
| --- | --- |
| A11y Collective | [a11y-collective.com - Accessible Writing](https://www.a11y-collective.com/blog/accessible-writing/) |
| Google Developer Style Guide | [developers.google.com/style/accessibility](https://developers.google.com/style/accessibility) |
| Grammarly | Clarity and passive voice patterns |
| Hemingway Editor | Sentence length and readability grade |
| IBM Style Guide | [ibm.com/design/language/writing](https://www.ibm.com/design/language/writing/) |
| Mailchimp Content Style Guide | [styleguide.mailchimp.com](https://styleguide.mailchimp.com/) |
| Salesforce Style Guide | [developer.salesforce.com/docs](https://developer.salesforce.com/docs/) |
| Section 508 | [section508.gov - Alternative Text](https://www.section508.gov/create/alternative-text/) |
| Shopify Polaris | [polaris.shopify.com/content](https://polaris.shopify.com/content/) |
| SJSU Writing Center | [sjsu.edu - Accessible Writing Strategies](https://www.sjsu.edu/writingcenter/docs/handouts/Accessible%20Writing%20Strategies.pdf) |
| UX Content Co. | [uxcontent.com - Accessible UX Writing](https://uxcontent.com/accessible-ux-writing-a-guide-for-inclusive-content-design/) |
