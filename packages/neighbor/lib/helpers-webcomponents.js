/**
 * neighbor/lib/helpers-webcomponents.js
 * Helpers for Vanilla Web Components and static HTML AST via @html-eslint/parser.
 *
 * Parser: @html-eslint/parser provides a generic HTML AST.
 * Node type for elements: 'Tag'
 * The node has:
 *   node.name           - tag name string
 *   node.attributes     - Attribute[]
 *   node.children       - Array of Tag | Text
 *   node.parent         - parent Tag
 */

import {
  INTERACTIVE_ELEMENTS,
  INTERACTIVE_ROLES,
} from './helpers.js'

export function getAttr(node, name) {
  return (node.attributes ?? []).find(a => a.key?.value === name) ?? null
}

export function getAttrStringValue(attr) {
  if (!attr) return null
  return typeof attr.value?.value === 'string' ? attr.value.value : null
}

export function getElementName(node) {
  const raw = node.name ?? ''
  if (!raw) return null
  // HTML tags are case-insensitive, but Web Component tags usually have a dash.
  return raw.toLowerCase()
}

export function hasAttr(node, name) {
  return getAttr(node, name) !== null
}

export function getRoleValue(node) {
  return getAttrStringValue(getAttr(node, 'role'))
}

export function hasAccessibleName(node) {
  return hasAttr(node, 'aria-label') || hasAttr(node, 'aria-labelledby')
}

export function isInteractiveElement(node) {
  const el = getElementName(node)
  if (el && INTERACTIVE_ELEMENTS.has(el)) return true
  const role = getRoleValue(node)
  return !!(role && INTERACTIVE_ROLES.has(role))
}

export function hasOnlyHiddenChildren(node) {
  const children = node.children ?? []
  if (children.length === 0) return false
  return children.every(child => {
    if (child.type === 'Text') return (child.value ?? '').trim() === ''
    if (child.type === 'Tag') {
      return (child.attributes ?? []).some(a => a.key?.value === 'aria-hidden')
    }
    return false
  })
}

const NEW_TAB_PATTERN = /new.tab|new.window|opens in/i

function collectHtmlText(node) {
  if (!node) return ''
  if (node.type === 'Text') return node.value ?? ''
  if (node.type === 'Tag') return (node.children ?? []).map(collectHtmlText).join('')
  return ''
}

export function hasNewTabWarning(node) {
  const labelVal = (getAttrStringValue(getAttr(node, 'aria-label')) ?? '').toLowerCase()
  if (NEW_TAB_PATTERN.test(labelVal)) return true
  const childText = (node.children ?? []).map(collectHtmlText).join('')
  return NEW_TAB_PATTERN.test(childText)
}

export function getParent(node) {
  return node.parent?.type === 'Tag' ? node.parent : null
}

export function* getAncestors(node) {
  let cur = getParent(node)
  while (cur) {
    yield cur
    cur = getParent(cur)
  }
}

export function* getChildOpeningElements(node) {
  for (const child of node.children ?? []) {
    if (child.type === 'Tag') yield child
  }
}

export function getClassName(node) {
  return getAttrStringValue(getAttr(node, 'class'))
}

export function getInnerHtmlAttr(node) {
  // Vanilla HTML has no innerHTML attribute directive
  return null
}

export function getInnerHtmlAttrName(_node) {
  return null
}

export const h = {
  getAttr,
  getAttrStringValue,
  getElementName,
  hasAttr,
  getRoleValue,
  hasAccessibleName,
  isInteractiveElement,
  hasOnlyHiddenChildren,
  hasNewTabWarning,
  getParent,
  getAncestors,
  getChildOpeningElements,
  getClassName,
  getInnerHtmlAttr,
  getInnerHtmlAttrName,
  elementVisitor: 'Tag',
  elementWithChildrenVisitor: 'Tag',
  getOpeningElement: (node) => node,
  getChildOpeningElementsFromWrapper: (node) =>
    (node.children ?? []).filter(c => c.type === 'Tag'),
}
