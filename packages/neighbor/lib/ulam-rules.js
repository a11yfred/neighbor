/**
 * neighbor/lib/ulam-rules.js
 * Lint rules specific to @ulam framework patterns.
 *
 * These rules operate on JS/JSX call expressions and import declarations,
 * not on JSX element visitors  -  they do not take the `h` adapter.
 *
 * Rules:
 *   no-announce-in-render         -  announce() called in component body, not effect/handler
 *   no-hash-router-in-remix       -  importing from siling-labuyo/hashRouter in a Remix project
 *   no-use-page-title-in-remix    -  usePageTitle() used alongside react-router imports
 */

// ─── no-announce-in-render ───────────────────────────────────────────────────
//
// announce() writes to a live region. Calling it directly in a component body
// fires on every render, spamming screen readers with repeated announcements.
// It must only be called inside a lifecycle hook, effect, or event handler.
//
// React:   useEffect / useLayoutEffect / event handlers (onClick={...} etc.)
// Vue:     onMounted / onUpdated / watch / watchEffect / nextTick callbacks
// Angular: ngOnInit / ngAfterViewInit / ngOnChanges / event methods on the class

const ANNOUNCE_FNS = new Set(['announce', 'clearAnnouncements'])

const REACT_SAFE_CALLS = new Set([
  'useEffect', 'useLayoutEffect', 'useInsertionEffect',
  'useCallback', 'useMemo',
])

const VUE_SAFE_CALLS = new Set([
  'onMounted', 'onUpdated', 'onBeforeMount', 'onBeforeUpdate',
  'onActivated', 'onDeactivated', 'watch', 'watchEffect', 'watchPostEffect',
  'watchSyncEffect', 'nextTick',
])

const ANGULAR_SAFE_METHODS = new Set([
  'ngOnInit', 'ngAfterViewInit', 'ngAfterContentInit',
  'ngOnChanges', 'ngDoCheck',
])

// Safe call names for each framework, merged for the combined check
function buildSafeCalls(framework) {
  if (framework === 'vue') return new Set([...REACT_SAFE_CALLS, ...VUE_SAFE_CALLS])
  if (framework === 'angular') return new Set([...REACT_SAFE_CALLS, ...ANGULAR_SAFE_METHODS])
  return REACT_SAFE_CALLS
}

function makeIsInsideSafeContext(safeCalls, framework) {
  return function isInsideSafeContext(node) {
    let cur = node.parent
    while (cur) {
      // Callback passed to useEffect / onMounted / watch etc.
      if (
        cur.type === 'CallExpression' &&
        cur.callee?.name &&
        safeCalls.has(cur.callee.name)
      ) return true

      // React JSX event handler: onClick={...}, onKeyDown={...}, etc.
      if (
        framework !== 'angular' &&
        cur.type === 'JSXExpressionContainer' &&
        cur.parent?.type === 'JSXAttribute' &&
        cur.parent?.name?.name?.startsWith('on')
      ) return true

      // Angular: method defined directly on the class body (e.g. handleClick() { announce() })
      // These are always safe  -  Angular calls them only in response to events or lifecycle.
      if (
        framework === 'angular' &&
        cur.type === 'MethodDefinition' &&
        !ANGULAR_SAFE_METHODS.has(cur.key?.name) // lifecycle methods are caught above via CallExpression
      ) return true

      // Regular function not passed as a callback  -  safe (event listener, async handler, etc.)
      if (
        cur.type === 'FunctionDeclaration' ||
        cur.type === 'FunctionExpression' ||
        cur.type === 'ArrowFunctionExpression'
      ) {
        const parent = cur.parent
        if (parent?.type !== 'CallExpression') return true
        if (parent.callee?.name && safeCalls.has(parent.callee.name)) return true
        // Event handler function passed as a prop / method call
        if (parent.callee?.type === 'MemberExpression') return true
        // Keep traversing  -  may be a nested callback inside an onClick
      }

      cur = cur.parent
    }
    return false
  }
}

function makeAnnounceMessage(framework) {
  if (framework === 'vue') {
    return (
      '`{{fn}}()` called outside onMounted / watch / an event handler will fire on every ' +
      'component setup, spamming screen readers. Move it into onMounted(() => { {{fn}}(...) }) ' +
      'or call it from an event handler. (@ulam/taho)'
    )
  }
  if (framework === 'angular') {
    return (
      '`{{fn}}()` called outside ngOnInit / ngAfterViewInit / an event method will fire on ' +
      'every change-detection cycle, spamming screen readers. Move it into ngOnInit() or ' +
      'call it from an event handler method. (@ulam/taho)'
    )
  }
  return (
    '`{{fn}}()` called outside a useEffect or event handler will fire on every render, ' +
    'spamming screen readers. Move it into useEffect(() => { {{fn}}(...) }, [dep]) ' +
    'or call it from an event handler. (@ulam/taho)'
  )
}

export function makeNoAnnounceInRender({ framework = 'react' } = {}) {
  const safeCalls = buildSafeCalls(framework)
  const isInsideSafeContext = makeIsInsideSafeContext(safeCalls, framework)

  return {
    meta: {
      type: 'problem',
      docs: { description: 'Disallow announce() called directly in a component render body or setup' },
      messages: { inRender: makeAnnounceMessage(framework) },
      schema: [],
    },
    create(context) {
      return {
        CallExpression(node) {
          const name = node.callee?.name
          if (!name || !ANNOUNCE_FNS.has(name)) return
          if (isInsideSafeContext(node)) return
          context.report({ node, messageId: 'inRender', data: { fn: name } })
        },
      }
    },
  }
}

// ─── no-hash-router-in-remix ─────────────────────────────────────────────────
//
// The @ulam hash router (siling-labuyo/hashRouter, @ulam/sili/hashRouter) is a
// fallback for plain SPA builds. In Remix, file-based routing replaces it.
// Importing from the hash router in a file that also uses react-router means
// the migration to siling-mahaba is incomplete.

const HASH_ROUTER_PATHS = new Set([
  'siling-labuyo/hashRouter',
  '@ulam/sili/hashRouter',
  '@ulam/siling-labuyo/hashRouter',
])

const REMIX_PATHS = new Set([
  'react-router',
  '@remix-run/react',
  'react-router-dom',
])

export function makeNoHashRouterInRemix() {
  return {
    meta: {
      type: 'suggestion',
      docs: { description: 'Disallow @ulam hash router imports alongside react-router' },
      messages: {
        hashRouter:
          'Importing from the @ulam hash router alongside react-router means the Remix migration ' +
          'is incomplete. Replace hash router usage with siling-mahaba equivalents: ' +
          'useRouter/useRouteMatch from @ulam/siling-mahaba. (@ulam/siling-mahaba)',
      },
      schema: [],
    },
    create(context) {
      let hasRemixImport = false
      const hashRouterNodes = []

      return {
        ImportDeclaration(node) {
          const src = node.source.value
          if (REMIX_PATHS.has(src)) hasRemixImport = true
          if (HASH_ROUTER_PATHS.has(src) || src.includes('/hashRouter')) {
            hashRouterNodes.push(node)
          }
        },
        'Program:exit'() {
          if (!hasRemixImport) return
          for (const node of hashRouterNodes) {
            context.report({ node, messageId: 'hashRouter' })
          }
        },
      }
    },
  }
}

// ─── no-use-page-title-in-remix ──────────────────────────────────────────────
//
// usePageTitle() from siling-labuyo sets document.title imperatively.
// In Remix, page titles are set via the `meta` export on each route module.
// Using usePageTitle() alongside react-router imports means the migration shim
// has not been cleaned up.

const USE_PAGE_TITLE_SOURCES = new Set([
  'siling-labuyo/hooks/usePageTitle',
  '@ulam/sili',
  '@ulam/siling-labuyo',
  '@ulam/siling-mahaba',
])

export function makeNoUsePageTitleInRemix() {
  return {
    meta: {
      type: 'suggestion',
      docs: { description: 'Disallow usePageTitle() in Remix  -  use the meta export instead' },
      messages: {
        usePageTitle:
          '`usePageTitle()` sets document.title imperatively, which conflicts with Remix\'s ' +
          'declarative `meta` export. Export a `meta` function from each route module instead: ' +
          '`export const meta = () => [{ title: "App | Page" }]`. ' +
          'Then remove this import. (@ulam/siling-mahaba)',
      },
      schema: [],
    },
    create(context) {
      let hasRemixImport = false
      const usePageTitleNodes = []

      return {
        ImportDeclaration(node) {
          const src = node.source.value
          if (REMIX_PATHS.has(src)) hasRemixImport = true
          const importsUsePageTitle = node.specifiers.some(
            s => s.type === 'ImportSpecifier' && s.imported?.name === 'usePageTitle'
          )
          if (importsUsePageTitle && USE_PAGE_TITLE_SOURCES.has(src)) {
            usePageTitleNodes.push(node)
          }
          // Also catch wildcard re-exports like @ulam/siling-mahaba (which re-exports it)
          if (importsUsePageTitle) usePageTitleNodes.push(node)
        },
        'Program:exit'() {
          if (!hasRemixImport) return
          // Deduplicate (wildcard catch above may double-push)
          const seen = new Set()
          for (const node of usePageTitleNodes) {
            if (seen.has(node)) continue
            seen.add(node)
            context.report({ node, messageId: 'usePageTitle' })
          }
        },
      }
    },
  }
}

// ─── no-disabled-and-aria-disabled ───────────────────────────────────────────
//
// HTML5 disabled attribute and aria-disabled should not be used together on the
// same element or nested within each other (e.g., element with disabled containing
// a child with aria-disabled or vice versa). This creates conflicting semantics:
// - Native disabled (on form controls) is a concrete state
// - aria-disabled (on any element) is an accessibility annotation
// Using both leads to inconsistent screen reader announcements and styling conflicts.
//
// Solution: Use only aria-disabled on all custom controls; use only disabled on
// native form controls (button, input, select, textarea).

function hasDisabledInChildren(node) {
  if (!node.children) return false
  for (const child of node.children) {
    if (child.type === 'JSXElement') {
      const attrs = child.openingElement?.attributes || []
      if (attrs.some(attr => attr.type === 'JSXAttribute' && attr.name?.name === 'disabled')) {
        return true
      }
      if (hasDisabledInChildren(child)) return true
    } else if (child.type === 'JSXFragment') {
      if (hasDisabledInChildren(child)) return true
    }
  }
  return false
}

function hasAriaDisabledInChildren(node) {
  if (!node.children) return false
  for (const child of node.children) {
    if (child.type === 'JSXElement') {
      const attrs = child.openingElement?.attributes || []
      if (attrs.some(attr => attr.type === 'JSXAttribute' && attr.name?.name === 'aria-disabled')) {
        return true
      }
      if (hasAriaDisabledInChildren(child)) return true
    } else if (child.type === 'JSXFragment') {
      if (hasAriaDisabledInChildren(child)) return true
    }
  }
  return false
}

export function makeNoDisabledAndAriaDisabled() {
  return {
    meta: {
      type: 'problem',
      docs: {
        description: 'Disallow disabled and aria-disabled used together on same element or nested',
        url: 'https://www.w3.org/WAI/ARIA/apg/'
      },
      messages: {
        sameElement:
          'Element has both `disabled` and `aria-disabled="true"`. Use only `aria-disabled` for custom controls ' +
          'or only `disabled` for native form controls (button, input, select, textarea), not both.',
        nestedDisabledInAriaDis:
          'Element with `aria-disabled="true"` contains a descendant with native `disabled` attribute. ' +
          'Use either `aria-disabled` consistently across the tree or `disabled` on native controls only, ' +
          'not nested combinations.',
        nestedAriaDisInDisabled:
          'Element with `disabled` contains a descendant with `aria-disabled="true"`. ' +
          'Use either `disabled` on native form controls or `aria-disabled` consistently, not both nested.',
      },
      schema: [],
    },
    create(context) {
      return {
        'JSXOpeningElement, JSXSelfClosingElement'(node) {
          const attrs = node.attributes || []
          const hasDisabled = attrs.some(attr =>
            attr.type === 'JSXAttribute' && attr.name?.name === 'disabled'
          )
          const hasAriaDis = attrs.some(attr =>
            attr.type === 'JSXAttribute' && attr.name?.name === 'aria-disabled'
          )

          // Check: both on same element
          if (hasDisabled && hasAriaDis) {
            context.report({ node, messageId: 'sameElement' })
            return
          }

          // Check: aria-disabled parent with disabled child
          if (hasAriaDis && hasDisabledInChildren(node.parent)) {
            context.report({ node, messageId: 'nestedDisabledInAriaDis' })
            return
          }

          // Check: disabled parent with aria-disabled child
          if (hasDisabled && hasAriaDisabledInChildren(node.parent)) {
            context.report({ node, messageId: 'nestedAriaDisInDisabled' })
            return
          }
        },
      }
    },
  }
}

// ─── All ulam rule factories ──────────────────────────────────────────────────

export const ULAM_RULE_FACTORIES = {
  'no-announce-in-render':           makeNoAnnounceInRender,
  'no-hash-router-in-remix':         makeNoHashRouterInRemix,
  'no-use-page-title-in-remix':      makeNoUsePageTitleInRemix,
  'no-disabled-and-aria-disabled':   makeNoDisabledAndAriaDisabled,
}

/** React plugin: all ulam rules. */
export function buildUlamRules() {
  return {
    'no-announce-in-render':           makeNoAnnounceInRender({ framework: 'react' }),
    'no-hash-router-in-remix':         makeNoHashRouterInRemix(),
    'no-use-page-title-in-remix':      makeNoUsePageTitleInRemix(),
    'no-disabled-and-aria-disabled':   makeNoDisabledAndAriaDisabled(),
  }
}

/** Vue plugin: only the announce rule, tuned for Vue lifecycle hooks. */
export function buildUlamRulesVue() {
  return {
    'no-announce-in-render': makeNoAnnounceInRender({ framework: 'vue' }),
  }
}

/** Angular plugin: only the announce rule, tuned for Angular lifecycle methods. */
export function buildUlamRulesAngular() {
  return {
    'no-announce-in-render': makeNoAnnounceInRender({ framework: 'angular' }),
  }
}

export function buildUlamRecommendedRules(ns) {
  return {
    [`${ns}/no-announce-in-render`]:         'error',
    [`${ns}/no-hash-router-in-remix`]:       'warn',
    [`${ns}/no-use-page-title-in-remix`]:    'warn',
    [`${ns}/no-disabled-and-aria-disabled`]: 'error',
  }
}

/** Recommended rules for Vue/Angular  -  only the announce rule applies. */
export function buildUlamRecommendedRulesFramework(ns) {
  return {
    [`${ns}/no-announce-in-render`]: 'error',
  }
}
