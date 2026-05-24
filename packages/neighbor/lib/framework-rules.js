/**
 * neighbor/lib/framework-rules.js
 * Framework-specific ESLint rules using standard JS/TS AST visitors.
 *
 * Unlike rules.js (which uses template AST visitors via helpers-jsx/vue/angular),
 * these rules target the JavaScript/TypeScript AST and are scoped to specific
 * frameworks via their dedicated plugin config files.
 *
 * Rules:
 *   remix-route-title-missing   → neighbor-eslint-remix3.mjs only
 *   angular-host-a11y           → neighbor-eslint-angular.mjs only (TS files)
 */

// ─── remix-route-title-missing ───────────────────────────────────────────────

/**
 * Ensures every Remix v2/v3 route module exports a meta() function
 * that includes a title property. Without this, navigating to the route
 * leaves the document title unchanged - screen readers announce nothing.
 *
 * Applies only to files matching: app/routes/**
 */
export const remixRouteTitleMissing = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require a `title` in the exported `meta` function in Remix route files  -  screen readers announce the document title on navigation.',
    },
    messages: {
      missingMeta:
        'Remix route is missing an exported `meta` function. Screen readers announce the document title on page navigation  -  add `export const meta = () => [{ title: "Page Name" }]`. (WCAG SC 2.4.2)',
      missingTitle:
        'Remix route `meta` export must include a `{ title: "..." }` entry. Screen readers announce the document title on page navigation. (WCAG SC 2.4.2)',
    },
    schema: [],
  },
  create(context) {
    const filename = context.getFilename?.() ?? context.filename ?? ''
    // Only apply in Remix route files
    const isRoute =
      /[/\\]app[/\\]routes[/\\]/.test(filename) ||
      /[/\\]routes[/\\]/.test(filename)
    if (!isRoute) return {}

    let metaExportFound = false
    let titleFound = false

    function checkObjectHasTitle(node) {
      if (node.type === 'ObjectExpression') {
        return node.properties.some(
          (p) =>
            p.type === 'Property' &&
            (p.key?.name === 'title' || p.key?.value === 'title')
        )
      }
      return false
    }

    function checkForTitle(node) {
      // Array: return [{ title: "..." }, ...]
      if (node.type === 'ArrayExpression') {
        return node.elements.some((el) => el && checkObjectHasTitle(el))
      }
      // Object: return { title: "..." }  (Remix v1 compat)
      if (node.type === 'ObjectExpression') {
        return checkObjectHasTitle(node)
      }
      // Arrow with implicit return: () => [...]
      if (node.type === 'ArrowFunctionExpression' && node.expression) {
        return checkForTitle(node.body)
      }
      return false
    }

    return {
      // export const meta = ...
      ExportNamedDeclaration(node) {
        const decl = node.declaration
        if (!decl || decl.type !== 'VariableDeclaration') return
        for (const declarator of decl.declarations) {
          if (declarator.id?.name !== 'meta') continue
          metaExportFound = true
          if (declarator.init && checkForTitle(declarator.init)) {
            titleFound = true
          }
        }
      },
      // export function meta() { return [...] }
      'ExportNamedDeclaration > FunctionDeclaration'(node) {
        if (node.id?.name !== 'meta') return
        metaExportFound = true
        // Walk return statements in the function body
        const body = node.body?.body ?? []
        for (const stmt of body) {
          if (
            stmt.type === 'ReturnStatement' &&
            stmt.argument &&
            checkForTitle(stmt.argument)
          ) {
            titleFound = true
          }
        }
      },
      'Program:exit'(node) {
        if (!metaExportFound) {
          context.report({ node, messageId: 'missingMeta' })
        } else if (!titleFound) {
          context.report({ node, messageId: 'missingTitle' })
        }
      },
    }
  },
}

// ─── angular-host-a11y ───────────────────────────────────────────────────────

/**
 * Ensures Angular @Component({ host: {...} }) decorators don't apply
 * interactive roles to the host element without also providing tabindex.
 *
 * Without tabindex="0", a custom Angular component with role="button" set
 * in the host binding will appear in the accessibility tree but won't be
 * reachable via keyboard Tab navigation.
 */

const INTERACTIVE_HOST_ROLES = new Set([
  'button', 'link', 'checkbox', 'radio', 'switch', 'tab',
  'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option',
  'slider', 'spinbutton', 'treeitem', 'gridcell',
])

export const angularHostA11y = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow interactive `role` in Angular @Component host bindings without `tabindex`',
    },
    messages: {
      missingTabindex:
        'Angular @Component host binding has `role="{{ role }}"` but is missing `tabindex: "0"`. Without tabindex, the element will not be reachable via keyboard navigation. (ARIA 1.2 / APG)',
    },
    schema: [],
  },
  create(context) {
    return {
      // Matches: @Component({ host: { role: 'button' } })
      Decorator(node) {
        if (
          node.expression?.type !== 'CallExpression' ||
          node.expression.callee?.name !== 'Component'
        ) return

        const args = node.expression.arguments ?? []
        const configObj = args.find((a) => a.type === 'ObjectExpression')
        if (!configObj) return

        const hostProp = configObj.properties.find(
          (p) =>
            p.type === 'Property' &&
            (p.key?.name === 'host' || p.key?.value === 'host')
        )
        if (!hostProp || hostProp.value?.type !== 'ObjectExpression') return

        const hostProps = hostProp.value.properties
        let hostRole = null
        let hasTabindex = false

        for (const prop of hostProps) {
          const key =
            prop.key?.name ?? prop.key?.value ?? ''
          const val =
            prop.value?.value ?? prop.value?.quasis?.[0]?.value?.raw ?? ''

          if (key === 'role' && INTERACTIVE_HOST_ROLES.has(val)) {
            hostRole = val
          }
          if (key === 'tabindex' || key === 'tabIndex') {
            hasTabindex = true
          }
        }

        if (hostRole && !hasTabindex) {
          context.report({
            node: hostProp,
            messageId: 'missingTabindex',
            data: { role: hostRole },
          })
        }
      },
    }
  },
}

// ─── angular-router-focus-management ─────────────────────────────────────────

export const angularRouterFocusManagement = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Warn if <router-outlet> is used without focus management.' },
    messages: {
      noFocus: 'SPA route transitions via <router-outlet> require manual focus management (e.g., using a skip-link or programmatic focus).'
    },
    schema: [],
  },
  create(context) {
    return {
      Element(node) {
        if (node.name === 'router-outlet') {
          context.report({ node, messageId: 'noFocus' })
        }
      }
    }
  }
}

// ─── lit-no-autofocus ────────────────────────────────────────────────────────

export const litNoAutofocus = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Disallow autofocus in Lit templates.' },
    messages: {
      noAutofocus: 'The autofocus attribute disrupts focus flow and disorients screen reader users.'
    },
    schema: [],
  },
  create(context) {
    return {
      TaggedTemplateExpression(node) {
        if (node.tag && node.tag.name === 'html') {
          const raw = node.quasi.quasis.map(q => q.value.raw).join('')
          // Simple regex to catch autofocus attribute
          if (/\bautofocus\b/.test(raw)) {
            context.report({ node, messageId: 'noAutofocus' })
          }
        }
      }
    }
  }
}

// ─── Exports ─────────────────────────────────────────────────────────────────

export function buildRemixRules() {
  return {
    'remix-route-title-missing': remixRouteTitleMissing,
  }
}

export function buildRemixRecommendedRules(ns) {
  return {
    [`${ns}/remix-route-title-missing`]: 'error',
  }
}

export function buildAngularFrameworkRules() {
  return {
    'angular-host-a11y': angularHostA11y,
    'angular-router-focus-management': angularRouterFocusManagement,
  }
}

export function buildAngularHostRecommendedRules(ns) {
  return {
    [`${ns}/angular-host-a11y`]: 'error',
    [`${ns}/angular-router-focus-management`]: 'off',
  }
}

export function buildLitRules() {
  return {
    'lit-no-autofocus': litNoAutofocus,
  }
}

export function buildLitRecommendedRules(ns) {
  return {
    [`${ns}/lit-no-autofocus`]: 'error',
  }
}
