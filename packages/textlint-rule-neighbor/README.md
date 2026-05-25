# @A11yfred/textlint-rule-neighbor

Textlint prose linting rules for accessibility and inclusive language. This plugin runs the exact same content rules as `@a11yfred/neighbor` for ESLint, but tailored natively for Textlint.

## Installation

You need to install both `textlint` and this rule package. Because this rule shares dictionaries with the main `neighbor` package, you must install both:

```bash
npm install -D textlint @a11yfred/neighbor @a11yfred/textlint-rule-neighbor
```

## Usage

Add `neighbor` to your `.textlintrc` or `.textlintrc.json`:

```json
{
  "rules": {
    "@a11yfred/neighbor": true
  }
}
```

### What It Checks

This rule analyzes your markdown and text nodes for:

* **Ableist Language**: Flags slurs, condescending euphemisms, and suffering-framing.
* **Disability Metaphors**: Flags figurative uses of disability ("blind spot", "tone deaf").
* **English Idioms**: Flags opaque business jargon and sports metaphors that are inaccessible to ESL readers.
* **Directional Language**: Flags layout-dependent position references ("see the right sidebar").
* **Vague Call-To-Action**: Flags unhelpful link text like "click here" or "read more".
* **Exclusive Language**: Flags non-inclusive jargon and culturally appropriated terms ("blacklist", "spirit animal").
* **Colonial & Violent Language**: Flags terms rooted in colonialism or violence when applied to people ("stakeholder", "target audience").
* **Deficit Language**: Flags language reducing people to their circumstances ("the homeless", "addict").
* **Gendered Language**: Flags generic gendered pronouns and occupation names ("he/she", "fireman", "manpower").
* **Anti-LGBTQ+ Language**: Flags outdated or pathologizing terms regarding sexual orientation and gender identity.
* **Device-Specific Actions**: Flags verbs assuming a specific input device ("click on", "tap the").
* **Typography in Prose**: Flags words in ALL CAPS (which screen readers may spell out letter-by-letter) and raw `&` used in place of "and" in prose (off by default).
* **Cross-Dialect Confusion**: Flags terms causing confusion or double entendre across English dialects (e.g. "pants", "cum") (off by default).

## Options

You can configure options in your `.textlintrc`. The rule accepts options to customize behavior:

* `allow` (array of strings): A list of matched terms to ignore/allow.
* `enableOffTerms` (boolean, default: `false`): Set to `true` to enable checking of highly culturally specific regional terms that are disabled by default (e.g. `beyond the pale`, `dreamtime`, `part-Aboriginal`).
* `knownAcronyms` (array of strings): Additional ALL CAPS acronyms/words to allow under the ALL CAPS rule.

Example configuration in `.textlintrc.json`:

```json
{
  "rules": {
    "@a11yfred/neighbor": {
      "allow": ["acceptable idiom"],
      "enableOffTerms": true,
      "knownAcronyms": ["GDPR", "CCPA"]
    }
  }
}
```

