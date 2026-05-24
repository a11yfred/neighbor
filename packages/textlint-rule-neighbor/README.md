# @a11yfred/textlint-rule-neighbor

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

### What it checks

This rule analyzes your markdown and text nodes for:

* **Ableist Language**: Flags slurs, condescending euphemisms, and suffering-framing.
* **Disability Metaphors**: Flags figurative uses of disability ("blind spot", "tone deaf").
* **English Idioms**: Flags opaque business jargon and sports metaphors that are inaccessible to ESL readers.
* **Directional Language**: Flags layout-dependent position references ("see the right sidebar").
* **Vague Call-To-Action**: Flags unhelpful link text like "click here" or "read more".

## Options

You can configure options in your `.textlintrc`. The rule accepts an `allow` array to ignore specific strings.

```json
{
  "rules": {
    "@a11yfred/neighbor": {
      "allow": ["acceptable idiom", "some specific term"]
    }
  }
}
```
