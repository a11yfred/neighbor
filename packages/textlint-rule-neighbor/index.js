import {
  ABLEIST_TERMS,
  DISABILITY_METAPHORS,
  ENGLISH_IDIOMS,
  DIRECTIONAL_PATTERNS,
  VAGUE_CTA_PATTERNS,
  EXCLUSIVE_TERMS,
  VIOLENT_COLONIAL_TERMS,
  DEFICIT_TERMS,
  GENDERED_PATTERNS,
  DEVICE_SPECIFIC_PATTERNS,
  ANTI_LGBTQ_TERMS,
  CROSS_DIALECT_TERMS
} from '@a11yfred/neighbor/rules';

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
]);

function reporter(context, options = {}) {
  const { Syntax, RuleError, report, getSource } = context;
  const allow = new Set((options.allow || []).map((s) => s.toLowerCase()));
  const enableOffTerms = options.enableOffTerms ?? false;
  const extraKnown = new Set(options.knownAcronyms || []);
  const isKnown = w => KNOWN_ACRONYMS.has(w) || extraKnown.has(w);

  function checkTermList(node, text, termList, ruleName) {
    for (const { term, suggest, sources, level } of termList) {
      if (level === 'off' && !enableOffTerms) continue;
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
      checkTermList(node, text, EXCLUSIVE_TERMS, "no-exclusive-language");
      checkTermList(node, text, VIOLENT_COLONIAL_TERMS, "no-colonial-and-violent-language");
      checkTermList(node, text, DEFICIT_TERMS, "no-deficit-language");
      checkTermList(node, text, GENDERED_PATTERNS, "no-gendered-language");
      checkTermList(node, text, DEVICE_SPECIFIC_PATTERNS, "no-device-specific-action");
      checkTermList(node, text, ANTI_LGBTQ_TERMS, "no-anti-lgbtq-language");
      checkTermList(node, text, CROSS_DIALECT_TERMS, "no-cross-dialect-confusion");

      // no-ampersand-in-prose check
      if (/\s&\s/.test(text)) {
        const regex = /\s&\s/g;
        let amM;
        while ((amM = regex.exec(text)) !== null) {
          report(
            node,
            new RuleError(
              `"&" may be announced inconsistently by screen readers. Use "and" in prose. (Google Dev Style)`,
              { index: amM.index + 1 }
            )
          );
        }
      }

      // no-all-caps-prose check
      const ALL_CAPS = /\b([A-Z]{3,})\b/g;
      let capM;
      ALL_CAPS.lastIndex = 0;
      while ((capM = ALL_CAPS.exec(text)) !== null) {
        const word = capM[1];
        if (isKnown(word) || allow.has(word.toLowerCase())) continue;
        report(
          node,
          new RuleError(
            `"${word}" is written in ALL CAPS. Screen readers using high verbosity may read it letter-by-letter. Use regular casing. (Google Dev Style, GOV.UK)`,
            { index: capM.index }
          )
        );
      }
    },
    [Syntax.Link](node) {
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

