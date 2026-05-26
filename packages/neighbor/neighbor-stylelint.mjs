/**
 * @a11yfred/neighbor  -  Stylelint plugin
 *
 * Rules:
 *   neighbor/user-preferences      -  Warn when motion, transparency, or alpha colors
 *                                  are used without @media (prefers-*) fallbacks.
 *   neighbor/no-outline-none       -  Disallow bare outline:none/0 outside :focus selectors.
 *   neighbor/no-forced-colors-none -  Disallow forced-color-adjust:none inside @media (forced-colors).
 *
 * Sources and credits:
 *   WCAG 2.1 / 2.2         w3.org/TR/WCAG21, w3.org/TR/WCAG22
 *   WebAIM                 webaim.org
 *   double-great/stylelint-a11y  github.com/double-great/stylelint-a11y
 */

import stylelint from 'stylelint';
const { utils: { report } } = stylelint;

const defined = (x) => x !== undefined && x !== null;

/** True if the node or any ancestor is a prefers-* / forced-colors media block */
function insidePreferencesMedia(node) {
  let current = node.parent;
  while (defined(current)) {
    if (
      current.type === 'atrule' &&
      current.name === 'media' &&
      /prefers-|forced-colors/.test(current.params)
    ) {
      return true;
    }
    current = current.parent;
  }
  return false;
}

/** True if the value string contains an alpha channel (rgb/hsl with slash, or 8-digit hex) */
function hasAlphaChannel(value) {
  // rgb(r g b / a) or rgba() or hsl(h s l / a)
  if (/\b(rgb|hsl)a?\s*\(/.test(value) && /\/\s*[01]?\.?\d+[^)]*\)/.test(value)) return true;
  // 8-digit hex #rrggbbaa
  if (/#[0-9a-fA-F]{8}\b/.test(value)) return true;
  return false;
}

/** True if the opacity value is a structural endpoint (0 or 1), not a dim */
function isStructuralOpacity(value) {
  const n = parseFloat(value.trim());
  return n === 0 || n === 1;
}

const ruleName = 'neighbor/user-preferences';

const messages = {
  opacity: (value) =>
    `opacity: ${value} creates a transparency effect. Add a fallback in @media (prefers-reduced-transparency: reduce) that uses an explicit color token instead. See src/components/ui/user-preferences.css.`,
  animation: (prop, value) =>
    `${prop}: ${value} uses motion. Add a fallback in @media (prefers-reduced-motion: reduce) that disables or stills this animation. See src/components/ui/user-preferences.css.`,
  alpha: (value) =>
    `Color value "${value}" uses an alpha channel. Add an opaque fallback in @media (prefers-reduced-transparency: reduce). See src/components/ui/user-preferences.css.`,
};

const meta = { url: 'https://github.com/a11yfred/neighbor' };

/**
 * Collect all selectors that appear inside a prefers-reduced-* or forced-colors
 * media block anywhere in the file. Used to suppress warnings when an override exists.
 * Splits comma-separated selector lists so each individual selector is tracked.
 */
function collectCoveredSelectors(root) {
  const covered = new Set();
  root.walkAtRules('media', (atRule) => {
    if (!/prefers-|forced-colors/.test(atRule.params)) return;
    atRule.walkRules((ruleNode) => {
      // Split comma-separated selector lists
      for (const part of ruleNode.selector.split(',')) {
        const sel = part.trim();
        covered.add(sel);
        // Also add bare selector without pseudo-classes/pseudo-elements
        covered.add(sel.replace(/::[^,\s{]+|:[^,\s{(]+(\([^)]*\))?/g, '').trim());
      }
    });
  });
  return covered;
}

/** True if the given selector (or its bare form) is in the covered set */
function isCovered(selector, covered) {
  // Split comma lists in the base selector too
  for (const part of selector.split(',')) {
    const norm = part.trim();
    if (covered.has(norm)) return true;
    const bare = norm.replace(/::[^,\s{]+|:[^,\s{(]+(\([^)]*\))?/g, '').trim();
    if (covered.has(bare)) return true;
  }
  return false;
}

/** @type {import('stylelint').Rule} */
function rule(primaryOption) {
  return (root, result) => {
    // Only enforce inside src/components/ui/
    const filePath = (root.source?.input?.file ?? '').replace(/\\/g, '/');
    if (!filePath.includes('src/components/ui')) return;
    // Never enforce inside user-preferences.css itself
    if (filePath.includes('user-preferences.css')) return;

    // Pre-scan: collect selectors already covered by prefers overrides in this file
    const covered = collectCoveredSelectors(root);

    root.walkDecls((decl) => {
      if (insidePreferencesMedia(decl)) return;

      // If the containing rule's selector is already overridden in a prefers block, skip
      const parentSelector = decl.parent?.selector ?? '';
      if (parentSelector && isCovered(parentSelector, covered)) return;

      const prop = decl.prop.toLowerCase();
      const value = decl.value;

      // opacity  -  warn on non-structural values (i.e. dims like 0.5, 0.75)
      if (prop === 'opacity' && !isStructuralOpacity(value)) {
        report(decl, messages.opacity(value));
        return;
      }

      // animation, transition, scroll-behavior
      if (prop === 'animation' || prop === 'transition' || prop === 'animation-name' || prop === 'scroll-behavior') {
        // Skip "none" and "auto" values  -  they're already the reduced state
        if (/^none\b/i.test(value.trim()) || /^auto\b/i.test(value.trim())) return;
        report(decl, messages.animation(prop, value));
        return;
      }

      // Alpha-channel color values on visual properties
      const visualProps = new Set([
        'background', 'background-color', 'color', 'border', 'border-color',
        'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color',
        'outline-color', 'box-shadow', 'text-shadow', 'fill', 'stroke',
      ]);
      if (visualProps.has(prop) && hasAlphaChannel(value)) {
        report(decl, messages.alpha(value));
      }
    });
  };
}

const userPreferences = { ruleName, rule, meta };

// ─── Rule: neighbor/no-outline-none ──────────────────────────────────────────
// outline: none / outline: 0 removes the browser's default keyboard focus
// indicator. This is one of the most common keyboard accessibility failures  - 
// keyboard users lose all visual indication of where focus is.
//
// Only fires when the declaration is NOT inside a :focus-visible, :focus, or
// :focus-within selector, and no sibling :focus-visible rule overrides it in
// the same block.
//
// Ref: WCAG 2.4.7 (Focus Visible); WebAIM; Roselli; cross-practitioner consensus

const noOutlineNoneRuleName = 'neighbor/no-outline-none';

const noOutlineNoneMessages = {
  removed: (value) =>
    `outline: ${value} removes the keyboard focus indicator. Add a :focus-visible rule with a visible outline or custom focus style. (WCAG 2.4.7 / WebAIM)`,
};

const noOutlineNoneMeta = { url: 'https://github.com/a11yfred/neighbor' };

/** Returns true if the selector string targets a focus state. */
function isFocusSelector(selector) {
  return /:focus(?:-visible|-within)?/i.test(selector);
}

/** Returns true if the node is inside a @media (pointer: fine/coarse) block - keyboard users are unaffected. */
function insidePointerMedia(node) {
  let current = node.parent;
  while (current) {
    if (
      current.type === 'atrule' &&
      current.name === 'media' &&
      /pointer\s*:\s*(fine|coarse)/.test(current.params)
    ) return true;
    current = current.parent;
  }
  return false;
}

/** Returns true if the decl or any ancestor rule node targets a focus state. */
function insideFocusSelector(decl) {
  let current = decl.parent;
  while (current) {
    if (current.type === 'rule' && isFocusSelector(current.selector ?? '')) return true;
    current = current.parent;
  }
  return false;
}

/** @type {import('stylelint').Rule} */
function noOutlineNoneRule(_primaryOption) {
  return (root, result) => {
    root.walkDecls(/^outline$/i, (decl) => {
      const value = decl.value.trim().toLowerCase();
      if (value !== 'none' && value !== '0') return;

      // Allow inside :focus / :focus-visible (author is intentionally restyling focus)
      if (insideFocusSelector(decl)) return;
      // Allow inside @media (pointer: fine/coarse) - keyboard users are unaffected
      if (insidePointerMedia(decl)) return;

      report({ message: noOutlineNoneMessages.removed(decl.value), node: decl, result, ruleName: noOutlineNoneRuleName });
    });
  };
}

const noOutlineNone = {
  ruleName: noOutlineNoneRuleName,
  rule: noOutlineNoneRule,
  meta: noOutlineNoneMeta,
};

// ─── Rule: neighbor/no-forced-colors-none ────────────────────────────────────
// forced-color-adjust: none inside @media (forced-colors) actively opts out of
// Windows High Contrast Mode and other forced-colors user settings. For users
// who depend on forced colors this is their last resort for viewing content  - 
// overriding it is a serious accessibility regression.
//
// Legitimate narrow exceptions exist (e.g. color pickers where all swatches
// would collapse to CanvasText). Those should be scoped tightly to the specific
// element, not a whole section, and are typically few enough to suppress inline.
//
// Ref: Sarah Higley  -  forced-color-adjust: none (sarahmhigley.com)
//      Adrian Roselli  -  WHCM and System Colors (adrianroselli.com)
//      WCAG SC 1.4.11 Non-text Contrast; SC 1.4.3 Contrast (Minimum)

const noForcedColorsNoneRuleName = 'neighbor/no-forced-colors-none';

const noForcedColorsNoneMessages = {
  none: (selector) =>
    `forced-color-adjust: none on "${selector}" inside @media (forced-colors) opts out of ` +
    `Windows High Contrast Mode, removing all forced-color overrides for these elements. ` +
    `Users who depend on forced colors lose visibility entirely. ` +
    `Remove forced-color-adjust: none, or scope it to the narrowest possible element ` +
    `(e.g. a color-picker swatch) and add a comment explaining why. ` +
    `(Higley / Roselli  -  WCAG SC 1.4.11 / SC 1.4.3)`,
};

const noForcedColorsNoneMeta = { url: 'https://github.com/a11yfred/neighbor' };

/** Returns true if the node is directly inside a @media (forced-colors) block. */
function insideForcedColorsMedia(node) {
  let current = node.parent;
  while (current) {
    if (
      current.type === 'atrule' &&
      current.name === 'media' &&
      /forced-colors/.test(current.params)
    ) return true;
    current = current.parent;
  }
  return false;
}

/** @type {import('stylelint').Rule} */
function noForcedColorsNoneRule(_primaryOption) {
  return (root, result) => {
    root.walkDecls(/^forced-color-adjust$/i, (decl) => {
      if (decl.value.trim().toLowerCase() !== 'none') return;
      if (!insideForcedColorsMedia(decl)) return;
      const selector = decl.parent?.selector ?? decl.parent?.name ?? '(unknown)';
      report({ message: noForcedColorsNoneMessages.none(selector), node: decl, result, ruleName: noForcedColorsNoneRuleName });
    });
  };
}

const noForcedColorsNone = {
  ruleName: noForcedColorsNoneRuleName,
  rule: noForcedColorsNoneRule,
  meta: noForcedColorsNoneMeta,
};

// ─── Rule: neighbor/no-text-justify ──────────────────────────────────────────
// text-align: justify creates inconsistent spacing ("rivers of white space").
// This makes it significantly harder for users with cognitive disabilities like dyslexia to read.
// Ref: WCAG SC 1.4.8 Visual Presentation (AAA)

const noTextJustifyRuleName = 'neighbor/no-text-justify';

const noTextJustifyMessages = {
  justify: () =>
    `text-align: justify creates uneven spacing that is difficult for users with dyslexia or cognitive disabilities to read. Use left, right, or center instead. (WCAG 1.4.8)`,
};

const noTextJustifyMeta = { url: 'https://github.com/a11yfred/neighbor' };

/** @type {import('stylelint').Rule} */
function noTextJustifyRule(_primaryOption) {
  return (root, result) => {
    root.walkDecls(/^text-align$/i, (decl) => {
      if (decl.value.trim().toLowerCase() !== 'justify') return;
      report({ message: noTextJustifyMessages.justify(), node: decl, result, ruleName: noTextJustifyRuleName });
    });
  };
}

const noTextJustify = {
  ruleName: noTextJustifyRuleName,
  rule: noTextJustifyRule,
  meta: noTextJustifyMeta,
};

// ─── Rule: neighbor/no-user-select-all-none ──────────────────────────────────
// user-select: none prevents users from highlighting text.
// This breaks screen readers, translation tools, and custom highlighting tools that users rely on.
// Allowed on global resets (*), html, body, p, h1-h6, span, div.

const noUserSelectAllNoneRuleName = 'neighbor/no-user-select-all-none';

const noUserSelectAllNoneMessages = {
  none: (selector) =>
    `user-select: none on "${selector}" prevents users from selecting text. This breaks translation tools, text-to-speech, and custom highlighting. Only use this on buttons or interactive UI elements, never on text elements or global selectors.`,
};

const noUserSelectAllNoneMeta = { url: 'https://github.com/a11yfred/neighbor' };

/** @type {import('stylelint').Rule} */
function noUserSelectAllNoneRule(_primaryOption) {
  return (root, result) => {
    const textSelectors = new Set(['*', 'html', 'body', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div', 'main', 'article', 'section']);
    root.walkDecls(/^user-select$/i, (decl) => {
      if (decl.value.trim().toLowerCase() !== 'none') return;
      
      const parentSelector = decl.parent?.selector ?? '';
      // Check if it's applying to a broad or text-specific tag
      const selectors = parentSelector.split(',').map(s => s.trim().toLowerCase());
      
      let violates = false;
      for (const sel of selectors) {
        // Strip pseudo-classes
        const baseSel = sel.replace(/:[a-z-]+(\([^)]+\))?/g, '');
        if (textSelectors.has(baseSel)) {
          violates = true;
          break;
        }
      }
      
      if (violates) {
        report({ message: noUserSelectAllNoneMessages.none(parentSelector), node: decl, result, ruleName: noUserSelectAllNoneRuleName });
      }
    });
  };
}

const noUserSelectAllNone = {
  ruleName: noUserSelectAllNoneRuleName,
  rule: noUserSelectAllNoneRule,
  meta: noUserSelectAllNoneMeta,
};

// ─── Rule: neighbor/no-absolute-viewport-text ────────────────────────────────
// font-size: 5vw does not scale when the user zooms in their browser.
// This violates WCAG 1.4.4 Resize Text.
// Must be used with calc() or clamp() alongside a fixed unit like rem/em.

const noAbsoluteViewportTextRuleName = 'neighbor/no-absolute-viewport-text';

const noAbsoluteViewportTextMessages = {
  viewport: (value) =>
    `font-size: ${value} uses pure viewport units. This text will not get bigger when users zoom in with their browser. Wrap it in calc() or clamp() with rem or em to allow resizing. (WCAG 1.4.4)`,
};

const noAbsoluteViewportTextMeta = { url: 'https://github.com/a11yfred/neighbor' };

/** @type {import('stylelint').Rule} */
function noAbsoluteViewportTextRule(_primaryOption) {
  return (root, result) => {
    root.walkDecls(/^font-size$/i, (decl) => {
      const value = decl.value.trim().toLowerCase();
      // If it has calc/clamp/max/min, it's likely mixing units, which is okay
      if (value.includes('calc(') || value.includes('clamp(') || value.includes('max(') || value.includes('min(')) return;
      
      // If it ends directly with vw, vh, vmin, or vmax
      if (/^\d*\.?\d+(vw|vh|vmin|vmax)$/.test(value)) {
        report({ message: noAbsoluteViewportTextMessages.viewport(value), node: decl, result, ruleName: noAbsoluteViewportTextRuleName });
      }
    });
  };
}

const noAbsoluteViewportText = {
  ruleName: noAbsoluteViewportTextRuleName,
  rule: noAbsoluteViewportTextRule,
  meta: noAbsoluteViewportTextMeta,
};

// ─── Rule: neighbor/require-hover-focus ──────────────────────────────────────
const requireHoverFocusRuleName = 'neighbor/require-hover-focus';
const requireHoverFocusMessages = {
  missing: (selector) =>
    `Selector "${selector}" has a :hover state but no corresponding :focus or :focus-visible state. Keyboard users must receive the same visual affordance as mouse users. (WCAG 2.1.1)`,
};
const requireHoverFocusMeta = { url: 'https://github.com/a11yfred/neighbor' };

/** @type {import('stylelint').Rule} */
function requireHoverFocusRule(_primaryOption) {
  return (root, result) => {
    const allSelectors = new Set();
    root.walkRules((rule) => {
      rule.selectors.forEach(s => allSelectors.add(s.trim()));
    });

    root.walkRules((rule) => {
      rule.selectors.forEach(selector => {
        const sel = selector.trim();
        if (sel.includes(':hover')) {
          const focusSel = sel.replace(/:hover\b/g, ':focus');
          const focusVisibleSel = sel.replace(/:hover\b/g, ':focus-visible');
          if (!allSelectors.has(focusSel) && !allSelectors.has(focusVisibleSel)) {
            const hasFocusInSameRule = rule.selectors.some(s => s.trim() === focusSel || s.trim() === focusVisibleSel);
            if (!hasFocusInSameRule) {
              report({ message: requireHoverFocusMessages.missing(sel), node: rule, result, ruleName: requireHoverFocusRuleName });
            }
          }
        }
      });
    });
  };
}
const requireHoverFocus = { ruleName: requireHoverFocusRuleName, rule: requireHoverFocusRule, meta: requireHoverFocusMeta };

// ─── Rule: neighbor/no-content-property-text ─────────────────────────────────
const noContentPropertyTextRuleName = 'neighbor/no-content-property-text';
const noContentPropertyTextMessages = {
  text: (value) =>
    `content: ${value} injects raw text via CSS. Screen reader support is inconsistent and it cannot be translated. Use the alt syntax 'content: ${value} / "alt text"' or move the text to the HTML DOM. (WCAG 1.1.1)`,
};
const noContentPropertyTextMeta = { url: 'https://github.com/a11yfred/neighbor' };

/** @type {import('stylelint').Rule} */
function noContentPropertyTextRule(_primaryOption) {
  return (root, result) => {
    root.walkDecls(/^content$/i, (decl) => {
      const value = decl.value.trim();
      if (value === '""' || value === "''" || value === 'none' || value === 'normal') return;
      if (/^(attr|url|counter|counters|var)\(/i.test(value)) return;
      if (value.includes('/')) return; // Uses CSS3 alt syntax
      if (/^["']/.test(value)) {
        report({ message: noContentPropertyTextMessages.text(value), node: decl, result, ruleName: noContentPropertyTextRuleName });
      }
    });
  };
}
const noContentPropertyText = { ruleName: noContentPropertyTextRuleName, rule: noContentPropertyTextRule, meta: noContentPropertyTextMeta };

// ─── Rule: neighbor/require-minimum-target-size ──────────────────────────────
const requireMinimumTargetSizeRuleName = 'neighbor/require-minimum-target-size';
const requireMinimumTargetSizeMessages = {
  small: (prop, value, selector) =>
    `${prop}: ${value} on "${selector}" is dangerously close to failing the WCAG 2.5.8 minimum target size of 24x24px. Ensure padding compensates, or increase this value.`,
};
const requireMinimumTargetSizeMeta = { url: 'https://github.com/a11yfred/neighbor' };

/** @type {import('stylelint').Rule} */
function requireMinimumTargetSizeRule(_primaryOption) {
  return (root, result) => {
    root.walkDecls(/^(width|height)$/i, (decl) => {
      const value = decl.value.trim().toLowerCase();
      const match = value.match(/^(\d*\.?\d+)px$/);
      if (match) {
        const num = parseFloat(match[1]);
        if (num > 0 && num < 24) {
          const selector = decl.parent?.selector ?? '';
          if (selector.includes('::before') || selector.includes('::after') || selector.includes('icon')) return;
          report({ message: requireMinimumTargetSizeMessages.small(decl.prop, value, selector), node: decl, result, ruleName: requireMinimumTargetSizeRuleName });
        }
      }
    });
  };
}
const requireMinimumTargetSize = { ruleName: requireMinimumTargetSizeRuleName, rule: requireMinimumTargetSizeRule, meta: requireMinimumTargetSizeMeta };

// ─── Rule: neighbor/require-minimum-text-spacing ─────────────────────────────
const requireMinimumTextSpacingRuleName = 'neighbor/require-minimum-text-spacing';
const requireMinimumTextSpacingMessages = {
  spacing: (prop, value) =>
    `${prop}: ${value} is too tight for users with cognitive or visual disabilities. WCAG 1.4.12 requires line-height to be at least 1.5, letter-spacing 0.12em, and word-spacing 0.16em.`,
};
const requireMinimumTextSpacingMeta = { url: 'https://github.com/a11yfred/neighbor' };

/** @type {import('stylelint').Rule} */
function requireMinimumTextSpacingRule(_primaryOption) {
  return (root, result) => {
    root.walkDecls(/^(line-height|letter-spacing|word-spacing)$/i, (decl) => {
      const prop = decl.prop.toLowerCase();
      const value = decl.value.trim().toLowerCase();
      
      if (prop === 'line-height') {
        const match = value.match(/^(\d*\.?\d+)$/);
        // Exclude 1 and 0 (often resets or heading styles)
        if (match && parseFloat(match[1]) < 1.2 && parseFloat(match[1]) > 0 && parseFloat(match[1]) !== 1) {
          report({ message: requireMinimumTextSpacingMessages.spacing(prop, value), node: decl, result, ruleName: requireMinimumTextSpacingRuleName });
        }
      } else if (prop === 'letter-spacing' || prop === 'word-spacing') {
        const matchPx = value.match(/^-\d*\.?\d+(px|em|rem)$/); // Negative spacing
        if (matchPx) {
           report({ message: requireMinimumTextSpacingMessages.spacing(prop, value), node: decl, result, ruleName: requireMinimumTextSpacingRuleName });
        }
      }
    });
  };
}
const requireMinimumTextSpacing = { ruleName: requireMinimumTextSpacingRuleName, rule: requireMinimumTextSpacingRule, meta: requireMinimumTextSpacingMeta };

// ─── Rule: neighbor/no-display-none-on-sr-only ───────────────────────────────
const noDisplayNoneOnSrOnlyRuleName = 'neighbor/no-display-none-on-sr-only';
const noDisplayNoneOnSrOnlyMessages = {
  hidden: (prop, selector) =>
    `Using \`${prop}\` on "${selector}" hides the text from screen readers too. If the goal is to visually hide text for screen readers, rely only on the \`clip\` or \`clip-path\` properties.`,
};
const noDisplayNoneOnSrOnlyMeta = { url: 'https://github.com/a11yfred/neighbor' };

/** @type {import('stylelint').Rule} */
function noDisplayNoneOnSrOnlyRule(_primaryOption) {
  return (root, result) => {
    root.walkDecls(/^(display|visibility)$/i, (decl) => {
      const prop = decl.prop.toLowerCase();
      const value = decl.value.trim().toLowerCase();
      if ((prop === 'display' && value === 'none') || (prop === 'visibility' && value === 'hidden')) {
        const selector = decl.parent?.selector ?? '';
        if (selector.includes('sr-only') || selector.includes('visually-hidden') || selector.includes('screen-reader')) {
          report({ message: noDisplayNoneOnSrOnlyMessages.hidden(prop, selector), node: decl, result, ruleName: noDisplayNoneOnSrOnlyRuleName });
        }
      }
    });
  };
}
const noDisplayNoneOnSrOnly = { ruleName: noDisplayNoneOnSrOnlyRuleName, rule: noDisplayNoneOnSrOnlyRule, meta: noDisplayNoneOnSrOnlyMeta };

// ─── Rule: neighbor/prefer-rem-for-font-size ─────────────────────────────────
const preferRemForFontSizeRuleName = 'neighbor/prefer-rem-for-font-size';
const preferRemForFontSizeMessages = {
  px: (value) =>
    `font-size: ${value} uses absolute units. This prevents text from scaling with the user's OS or browser-level default font size. Use \`rem\` or \`em\` instead.`,
};
const preferRemForFontSizeMeta = { url: 'https://github.com/a11yfred/neighbor' };

/** @type {import('stylelint').Rule} */
function preferRemForFontSizeRule(_primaryOption) {
  return (root, result) => {
    root.walkDecls(/^font-size$/i, (decl) => {
      const value = decl.value.trim().toLowerCase();
      if (/^\d*\.?\d+(px|pt)$/.test(value)) {
        report({ message: preferRemForFontSizeMessages.px(value), node: decl, result, ruleName: preferRemForFontSizeRuleName });
      }
    });
  };
}
const preferRemForFontSize = { ruleName: preferRemForFontSizeRuleName, rule: preferRemForFontSizeRule, meta: preferRemForFontSizeMeta };

// ─── Rule: neighbor/no-pointer-events-none ───────────────────────────────────
const noPointerEventsNoneRuleName = 'neighbor/no-pointer-events-none';
const noPointerEventsNoneMessages = {
  none: (selector) =>
    `pointer-events: none on "${selector}" makes it unclickable for mouse/touch users, but it remains fully focusable and "clickable" for keyboard users, creating a disparate experience. Disable the element with the HTML \`disabled\` attribute instead.`,
};
const noPointerEventsNoneMeta = { url: 'https://github.com/a11yfred/neighbor' };

/** @type {import('stylelint').Rule} */
function noPointerEventsNoneRule(_primaryOption) {
  return (root, result) => {
    root.walkDecls(/^pointer-events$/i, (decl) => {
      if (decl.value.trim().toLowerCase() !== 'none') return;
      
      const selector = decl.parent?.selector ?? '';
      // Warn if selector implies interactive element
      if (/\b(button|a|input|select|textarea)\b/i.test(selector) || /\.btn\b/i.test(selector) || /\.button\b/i.test(selector)) {
        report({ message: noPointerEventsNoneMessages.none(selector), node: decl, result, ruleName: noPointerEventsNoneRuleName });
      }
    });
  };
}
const noPointerEventsNone = { ruleName: noPointerEventsNoneRuleName, rule: noPointerEventsNoneRule, meta: noPointerEventsNoneMeta };

// ─── Rule: neighbor/no-text-transform-uppercase ──────────────────────────────
const noTextTransformUppercaseRuleName = 'neighbor/no-text-transform-uppercase';
const noTextTransformUppercaseMessages = {
  upper: () =>
    `text-transform: uppercase can cause screen readers to read words letter-by-letter as acronyms, and is significantly harder for users with dyslexia to read. Use sparingly for short headers only.`,
};
const noTextTransformUppercaseMeta = { url: 'https://github.com/a11yfred/neighbor' };

/** @type {import('stylelint').Rule} */
function noTextTransformUppercaseRule(_primaryOption) {
  return (root, result) => {
    root.walkDecls(/^text-transform$/i, (decl) => {
      if (decl.value.trim().toLowerCase() === 'uppercase') {
        report({ message: noTextTransformUppercaseMessages.upper(), node: decl, result, ruleName: noTextTransformUppercaseRuleName });
      }
    });
  };
}
const noTextTransformUppercase = { ruleName: noTextTransformUppercaseRuleName, rule: noTextTransformUppercaseRule, meta: noTextTransformUppercaseMeta };

// ─── Rule: neighbor/no-list-style-none ───────────────────────────────────────
const noListStyleNoneRuleName = 'neighbor/no-list-style-none';
const noListStyleNoneMessages = {
  none: (selector) =>
    `list-style: none on "${selector}" removes list semantics in WebKit/Safari for VoiceOver users. Ensure you add \`role="list"\` to the HTML element.`,
};
const noListStyleNoneMeta = { url: 'https://github.com/a11yfred/neighbor' };

/** @type {import('stylelint').Rule} */
function noListStyleNoneRule(_primaryOption) {
  return (root, result) => {
    root.walkDecls(/^list-style$/i, (decl) => {
      if (decl.value.trim().toLowerCase() === 'none') {
        const selector = decl.parent?.selector ?? '';
        report({ message: noListStyleNoneMessages.none(selector), node: decl, result, ruleName: noListStyleNoneRuleName });
      }
    });
  };
}
const noListStyleNone = { ruleName: noListStyleNoneRuleName, rule: noListStyleNoneRule, meta: noListStyleNoneMeta };

// ─── Rule: neighbor/no-word-break-all ────────────────────────────────────────
const noWordBreakAllRuleName = 'neighbor/no-word-break-all';
const noWordBreakAllMessages = {
  all: () =>
    `word-break: break-all splits words arbitrarily across lines, which is severely disruptive for users with cognitive disabilities or dyslexia. Use \`word-break: break-word\` or \`overflow-wrap: break-word\` instead.`,
};
const noWordBreakAllMeta = { url: 'https://github.com/a11yfred/neighbor' };

/** @type {import('stylelint').Rule} */
function noWordBreakAllRule(_primaryOption) {
  return (root, result) => {
    root.walkDecls(/^word-break$/i, (decl) => {
      if (decl.value.trim().toLowerCase() === 'break-all') {
        report({ message: noWordBreakAllMessages.all(), node: decl, result, ruleName: noWordBreakAllRuleName });
      }
    });
  };
}
const noWordBreakAll = { ruleName: noWordBreakAllRuleName, rule: noWordBreakAllRule, meta: noWordBreakAllMeta };

// ─── Rule: neighbor/no-outline-color-transparent ─────────────────────────────
const noOutlineColorTransparentRuleName = 'neighbor/no-outline-color-transparent';
const noOutlineColorTransparentMessages = {
  transparent: () =>
    `outline-color: transparent visually removes the focus ring. If you are hiding focus rings for mouse clicks, do it explicitly via \`:focus:not(:focus-visible) { outline: none }\` instead.`,
};
const noOutlineColorTransparentMeta = { url: 'https://github.com/a11yfred/neighbor' };

/** @type {import('stylelint').Rule} */
function noOutlineColorTransparentRule(_primaryOption) {
  return (root, result) => {
    root.walkDecls(/^outline-color$/i, (decl) => {
      if (decl.value.trim().toLowerCase() === 'transparent') {
        if (insideFocusSelector(decl)) return;
        report({ message: noOutlineColorTransparentMessages.transparent(), node: decl, result, ruleName: noOutlineColorTransparentRuleName });
      }
    });
  };
}
const noOutlineColorTransparent = { ruleName: noOutlineColorTransparentRuleName, rule: noOutlineColorTransparentRule, meta: noOutlineColorTransparentMeta };

// ─── Rule: neighbor/no-overflow-hidden-on-fixed-height ───────────────────────
const noOverflowHiddenOnFixedHeightRuleName = 'neighbor/no-overflow-hidden-on-fixed-height';
const noOverflowHiddenOnFixedHeightMessages = {
  hidden: (selector) =>
    `Combining \`overflow: hidden\` with a fixed \`height\` or \`max-height\` on "${selector}" means that if users increase text size (WCAG 1.4.4), the text will expand out of the box and be clipped and unreadable. Consider using \`min-height\` or allowing overflow.`,
};
const noOverflowHiddenOnFixedHeightMeta = { url: 'https://github.com/a11yfred/neighbor' };

/** @type {import('stylelint').Rule} */
function noOverflowHiddenOnFixedHeightRule(_primaryOption) {
  return (root, result) => {
    root.walkRules((rule) => {
      let hasOverflowHidden = false;
      let hasFixedHeight = false;

      rule.walkDecls((decl) => {
        const prop = decl.prop.toLowerCase();
        const value = decl.value.trim().toLowerCase();
        
        if (prop === 'overflow' || prop === 'overflow-y') {
          if (value === 'hidden') hasOverflowHidden = true;
        }
        
        if (prop === 'height' || prop === 'max-height') {
          if (/^\d*\.?\d+(px|rem|em|pt|vh)$/.test(value)) {
            hasFixedHeight = true;
          }
        }
      });

      if (hasOverflowHidden && hasFixedHeight) {
        report({ message: noOverflowHiddenOnFixedHeightMessages.hidden(rule.selector), node: rule, result, ruleName: noOverflowHiddenOnFixedHeightRuleName });
      }
    });
  };
}
const noOverflowHiddenOnFixedHeight = { ruleName: noOverflowHiddenOnFixedHeightRuleName, rule: noOverflowHiddenOnFixedHeightRule, meta: noOverflowHiddenOnFixedHeightMeta };

export default [
  userPreferences,
  noOutlineNone,
  noForcedColorsNone,
  noTextJustify,
  noUserSelectAllNone,
  noAbsoluteViewportText,
  requireHoverFocus,
  noContentPropertyText,
  requireMinimumTargetSize,
  requireMinimumTextSpacing,
  noDisplayNoneOnSrOnly,
  preferRemForFontSize,
  noPointerEventsNone,
  noTextTransformUppercase,
  noListStyleNone,
  noWordBreakAll,
  noOutlineColorTransparent,
  noOverflowHiddenOnFixedHeight,
];
