# Vale Rules for neighbor

Vale prose linting rules for accessibility. A companion to the [neighbor](https://github.com/a11yfred/neighbor) ESLint and Stylelint package.

Flags language patterns that affect readability, comprehension, and inclusion - ableist terms, disability metaphors, English idioms opaque to ESL readers, directional layout references, ALL CAPS prose, and bare ampersands.

All rules are warnings. Language is context-dependent - these are prompts to reflect, not verdicts.

---

## Installation

Requires [Vale](https://vale.sh) v3 or later.

Add to your `.vale.ini`:

```ini
Packages = https://github.com/a11yfred/neighbor/releases/latest/download/neighbor.zip
StylesPath = .vale/styles

[*.{md,mdx,html,txt}]
BasedOnStyles = neighbor
```

Then run:

```sh
vale sync
```

Vale will download the package from the GitHub Release and install it into your `StylesPath`.

> If you manage styles manually, copy the `vale/neighbor/` directory from this package into your `StylesPath`.

---

## Rules

| Rule | What it flags | WCAG / basis |
| --- | --- | --- |
| `AbleistLanguage` | Slurs, condescending euphemisms, suffering framing, normalcy framing | SC 3.1.1 |
| `DisabilityMetaphor` | Disability used figuratively ("blind spot", "tone deaf") | NCDJ, APA |
| `EnglishIdiom` | Business jargon and sports idioms opaque to ESL readers | SC 3.1.5 |
| `DirectionalLanguage` | Layout position references ("see above", "right sidebar") | SC 1.3.3 |
| `AllCapsProse` | Words written in ALL CAPS (excludes known acronyms) | GOV.UK, Google |
| `AmpersandInProse` | `&` used as a substitute for "and" | Plain language guides |

Full rule documentation: [RULES-CONTENT.md](https://github.com/a11yfred/neighbor/blob/main/packages/neighbor/RULES-CONTENT.md) in the monorepo.

Three rules from the neighbor ESLint content plugin are not included here because they require JSX context that Vale cannot access:

| Rule | Why Vale can't cover it |
| --- | --- |
| `no-vague-cta` | Needs to know text is inside an `<a>` or `<button>` element |
| `no-vague-error-message` | Needs to know text is inside an error state component |
| `no-unexplained-abbreviation` | Needs to track abbreviation expansions across JSX nodes in a file |

Use the [neighbor](https://github.com/a11yfred/neighbor) ESLint plugin alongside this Vale package for full coverage.

---

## On language

Language changes. What is appropriate depends on the speaker, audience, context, culture, and time period. These rules represent a snapshot of consensus across the sources listed below - they are not final answers.

Nicolas Steenhout ([incl.ca](https://incl.ca/disability-language-is-a-nuanced-thing/)) and Léonie Watson put it well: "There is no right or wrong answer because it is a matter of personal choice, and the choice depends on context."

---

## Sources

Rules were included only when the pattern appeared in three or more independent authoritative sources, or a WCAG Success Criterion directly applied.

- WCAG 2.2 - w3.org/WAI/WCAG22/Understanding
- W3C WAI Writing Tips - w3.org/WAI/tips/writing/
- Google Developer Style Guide - developers.google.com/style/accessibility
- US Plain Language Guide - plainlanguage.gov
- SBA Office of Advocacy Style Guide - advocacy.sba.gov
- GOV.UK Publishing Accessible Documents - gov.uk/guidance/publishing-accessible-documents
- Government of Canada Accessible Documents - accessible.canada.ca
- NCDJ Disability Language Style Guide - cronkite.asu.edu/ncdj/disability-language-style-guide
- AP Stylebook - amdisrights.org/ap-stylebook-primer-on-disability
- ADA National Network - adata.org/factsheet/ADANN-writing
- APA Style Bias-Free Language - apastyle.apa.org/style-grammar-guidelines/bias-free-language/disability
- SIGACCESS Accessible Writing Guide - sigaccess.org/welcome-to-sigaccess/resources/accessible-writing-guide/
- A11y Collective - a11y-collective.com/blog/accessible-writing/
- UX Content Co. - uxcontent.com/accessible-ux-writing-a-guide-for-inclusive-content-design/
- SJSU Writing Center - sjsu.edu/writingcenter/
- Nicolas Steenhout - incl.ca/disability-language-is-a-nuanced-thing/

---

## Maintainer notes

The term lists for `AbleistLanguage`, `DisabilityMetaphor`, `EnglishIdiom`, and `DirectionalLanguage` are defined in the `neighbor` package at `packages/neighbor/lib/content-rules.js`. The YAML files here are generated from those lists.

To regenerate after updating the term lists:

```sh
# from the monorepo root
node packages/neighbor/scripts/generate-vale.mjs
```

`AllCapsProse.yml` and `AmpersandInProse.yml` are hand-authored and not generated.

---

## License

MIT
