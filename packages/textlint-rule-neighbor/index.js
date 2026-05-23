import {
  ABLEIST_TERMS,
  DISABILITY_METAPHORS,
  ENGLISH_IDIOMS,
  DIRECTIONAL_PATTERNS,
  VAGUE_CTA_PATTERNS
} from '@a11yfred/neighbor/rules';

function reporter(context, options = {}) {
  const { Syntax, RuleError, report, getSource } = context;
  const allow = new Set((options.allow || []).map((s) => s.toLowerCase()));

  function checkTermList(node, text, termList, ruleName) {
    for (const { term, suggest, sources } of termList) {
      let m;
      term.lastIndex = 0;
      const flags = term.flags.includes('g') ? term.flags : term.flags + 'g';
      const regex = new RegExp(term.source, flags);
      
      while ((m = regex.exec(text)) !== null) {
        const matchText = m[0];
        if (allow.has(matchText.toLowerCase())) continue;

        let message = `"${matchText}" violates ${ruleName}.`;
        if (suggest) message += ` Suggestion: ${suggest}.`;
        if (sources) message += ` (${sources})`;

        report(node, new RuleError(message, { index: m.index }));
      }
    }
  }

  return {
    [Syntax.Str](node) {
      const text = getSource(node);
      
      checkTermList(node, text, ABLEIST_TERMS, "no-ableist-language");
      checkTermList(node, text, DISABILITY_METAPHORS, "no-disability-metaphor");
      checkTermList(node, text, ENGLISH_IDIOMS, "no-english-idiom");
      checkTermList(node, text, DIRECTIONAL_PATTERNS, "no-directional-language");
    },
    [Syntax.Link](node) {
      // In textlint, link text is contained within the children of the Link node.
      // We extract the pure text to check for vague link text like "click here"
      const text = node.children
        .map(child => child.value || '')
        .join('')
        .trim();
        
      if (!text || allow.has(text.toLowerCase())) return;
      
      for (const pattern of VAGUE_CTA_PATTERNS) {
        if (pattern.test(text)) {
          report(
            node,
            new RuleError(`"${text}" is vague link text that fails WCAG 2.4.4. Use descriptive text that explains the destination or action.`, {
              index: 0
            })
          );
          break;
        }
      }
    }
  };
}

export default {
  linter: reporter,
  fixer: reporter
};
