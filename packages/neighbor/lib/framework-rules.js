export function makeReactFragmentNoAriaProps(h) {
  return {
    meta: {
      type: 'problem',
      docs: { description: 'Disallow ARIA props and roles on React Fragments' },
      messages: {
        fragmentAria: 'React Fragments (<>...</> or <React.Fragment>) do not render a DOM node, so they silently drop `role` and `aria-*` props. Use a <div> or <span> instead to attach ARIA semantics.',
      },
      schema: [],
    },
    create(context) {
      return {
        [h.elementVisitor](node) {
          const el = h.getElementName(node);
          if (el !== 'Fragment' && el !== 'React.Fragment' && el !== null && el !== undefined) return;
          const attrs = node.openingElement?.attributes ?? node.startTag?.attributes ?? [];
          for (const a of attrs) {
            const name = a.name?.name ?? a.name?.toString() ?? '';
            if (name === 'role' || name.startsWith('aria-')) {
              context.report({ node: a, messageId: 'fragmentAria' });
            }
          }
        },
      }
    },
  }
}

export function makeReactSpaFocusManagement(_h) {
  return {
    meta: {
      type: 'suggestion',
      docs: { description: 'Warn if React Router is used without a known route announcer or focus manager' },
      messages: {
        missingFocus: 'This component uses React Router but does not appear to manage focus on navigation. SPA navigations must manage focus (e.g. sending focus to a heading) or use a Route Announcer so screen readers know the page changed.',
      },
      schema: [],
    },
    create(context) {
      let usesRouter = false;
      let hasFocusManagement = false;
      return {
        ImportDeclaration(node) {
          if (node.source.value.includes('react-router')) usesRouter = true;
          const src = node.source.value.toLowerCase();
          if (src.includes('focus') || src.includes('announce')) hasFocusManagement = true;
        },
        CallExpression(node) {
          const name = node.callee?.name?.toLowerCase() || '';
          if (name.includes('focus') || name.includes('announce')) hasFocusManagement = true;
        },
        JSXIdentifier(node) {
          const name = node.name?.toLowerCase() || '';
          if (name.includes('announcer') || name.includes('livereload')) hasFocusManagement = true;
        },
        'Program:exit'(node) {
          if (usesRouter && !hasFocusManagement) {
            context.report({ node, messageId: 'missingFocus' });
          }
        }
      }
    },
  }
}

export function makeRemixRouteAnnouncerMissing(h) {
  return {
    meta: {
      type: 'problem',
      docs: { description: 'Ensure Remix root.tsx includes a Route Announcer' },
      messages: {
        missingAnnouncer: 'Remix `root.tsx` must render an accessible route announcer (or `<LiveReload>` which includes one) so screen readers know when the page changes.',
      },
      schema: [],
    },
    create(context) {
      const filename = context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename();
      if (!/root\.(tsx|jsx|js|ts)$/.test(filename)) return {};
      
      let hasAnnouncer = false;
      return {
        [h.elementVisitor](node) {
          const el = h.getElementName(node) || '';
          if (el.includes('Announcer') || el === 'LiveReload' || el === 'ScrollRestoration') {
            hasAnnouncer = true;
          }
        },
        'Program:exit'(node) {
          if (!hasAnnouncer) {
            context.report({ node, messageId: 'missingAnnouncer' });
          }
        }
      }
    },
  }
}

export function makeVueRouterFocusManagement(_h) {
  return {
    meta: {
      type: 'suggestion',
      docs: { description: 'Warn if vue-router is used without focus management' },
      messages: {
        missingFocus: 'This component uses vue-router but does not manage focus on route changes. Send focus to the new page heading or a route announcer so screen readers can track the navigation.',
      },
      schema: [],
    },
    create(context) {
      let usesRouter = false;
      let hasFocusManagement = false;
      return {
        ImportDeclaration(node) {
          if (node.source.value.includes('vue-router')) usesRouter = true;
        },
        Identifier(node) {
          if (node.name === '$router' || node.name === 'useRouter') usesRouter = true;
          if (node.name.toLowerCase().includes('focus') || node.name.toLowerCase().includes('announce')) hasFocusManagement = true;
        },
        'Program:exit'(node) {
          if (usesRouter && !hasFocusManagement) {
            context.report({ node, messageId: 'missingFocus' });
          }
        }
      }
    },
  }
}

export function makeAngularRouteAnnouncer(_h) {
  return {
    meta: {
      type: 'problem',
      docs: { description: 'Ensure Angular routing uses Title service or aria-live outlet' },
      messages: {
        missingAnnouncer: 'Angular `RouterModule` is used without an `aria-live` route announcer or explicit `Title` service updates. Screen readers will not announce route changes.',
      },
      schema: [],
    },
    create(context) {
      let usesRouter = false;
      let managesTitle = false;
      return {
        ImportDeclaration(node) {
          if (node.source.value.includes('@angular/router')) usesRouter = true;
          if (node.source.value.includes('@angular/platform-browser') && node.specifiers.some(s => s.imported?.name === 'Title')) managesTitle = true;
        },
        'Program:exit'(node) {
          if (usesRouter && !managesTitle) {
            context.report({ node, messageId: 'missingAnnouncer' });
          }
        }
      }
    },
  }
}

export function makeAngularClickKeyEvents(h) {
  return {
    meta: {
      type: 'problem',
      docs: { description: 'Ensure Angular (click) elements have (keydown.space) or (keydown.enter)' },
      messages: {
        missingKey: 'Elements with `(click)` must also have `(keydown.space)` or `(keydown.enter)` to be accessible to keyboard users.',
      },
      schema: [],
    },
    create(context) {
      return {
        [h.elementVisitor](node) {
          if (!h.hasAttr(node, '(click)')) return;
          const el = h.getElementName(node);
          const nativeInteractive = new Set(['button', 'a', 'input', 'select', 'textarea', 'details']);
          if (nativeInteractive.has(el)) return;
          
          if (!h.hasAttr(node, '(keydown.space)') && !h.hasAttr(node, '(keydown.enter)') && !h.hasAttr(node, '(keyup.space)') && !h.hasAttr(node, '(keyup.enter)')) {
            context.report({ node: h.getAttr(node, '(click)'), messageId: 'missingKey' });
          }
        },
      }
    },
  }
}

export function makeWcDelegatesFocus(_h) {
  return {
    meta: {
      type: 'suggestion',
      docs: { description: 'Suggest delegatesFocus for Web Components rendering interactive elements' },
      messages: {
        delegatesFocus: 'This shadow root seems to render interactive elements. Consider passing `{ delegatesFocus: true }` to `attachShadow` to ensure proper focus delegation and outline styling.',
      },
      schema: [],
    },
    create(context) {
      return {
        CallExpression(node) {
          if (node.callee?.property?.name === 'attachShadow') {
            const arg = node.arguments[0];
            if (arg && arg.type === 'ObjectExpression') {
              const hasDelegatesFocus = arg.properties.some(p => p.key?.name === 'delegatesFocus');
              if (!hasDelegatesFocus) {
                context.report({ node, messageId: 'delegatesFocus' });
              }
            }
          }
        }
      }
    },
  }
}

export function makeWcShadowAriaIdref(h) {
  return {
    meta: {
      type: 'problem',
      docs: { description: 'Warn against ARIA ID references crossing the Shadow DOM boundary' },
      messages: {
        shadowIdref: 'ARIA attributes like `aria-controls` or `aria-labelledby` cannot reference IDs outside their own Shadow DOM tree. Use Element reflection or encapsulate the relationship.',
      },
      schema: [],
    },
    create(context) {
      return {
        [h.elementVisitor](node) {
          const attrs = node.openingElement?.attributes ?? node.startTag?.attributes ?? [];
          for (const a of attrs) {
            const name = a.name?.name ?? a.name?.toString() ?? '';
            if (name === 'aria-controls' || name === 'aria-labelledby' || name === 'aria-describedby') {
              const val = h.getAttrStringValue(a) || '';
              if (val.includes('props.') || val.includes('this.')) {
                context.report({ node: a, messageId: 'shadowIdref' });
              }
            }
          }
        }
      }
    },
  }
}
