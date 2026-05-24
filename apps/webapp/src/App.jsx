import { useState, useRef, useEffect } from 'react'
import {
  Button,
  ButtonBack,
  InfoBox,
  FormControlToggle,
  FormControlSelect,
  announce,
  applyTheme,
  useThemeManager
} from '@ulam/ube/react'
import { Settings, Info, Github } from 'lucide-react'
import './index.css'

import {
  ABLEIST_TERMS,
  DISABILITY_METAPHORS,
  ENGLISH_IDIOMS
} from '@a11yfred/neighbor/rules'

function checkList(fullText, list, ruleName) {
  const issues = []
  for (const { term, suggest, sources } of list) {
    const flags = term.flags.includes('g') ? term.flags : term.flags + 'g'
    const regex = new RegExp(term.source, flags)
    let m
    while ((m = regex.exec(fullText)) !== null) {
      if (m[0].length === 0) {
        regex.lastIndex++
        continue
      }
      issues.push({
        id: Math.random().toString(),
        match: m[0],
        index: m.index,
        length: m[0].length,
        suggest,
        sources,
        rule: ruleName
      })
    }
  }
  return issues
}

export default function App() {
  const [text, setText] = useState('')
  const [issues, setIssues] = useState([])
  const [sidebarView, setSidebarView] = useState('issues') // 'issues' | 'settings' | 'about'

  // Persistent settings
  const [checkAbleist, setCheckAbleist] = useState(() => localStorage.getItem('neighbor-check-ableist') !== 'false')
  const [checkMetaphors, setCheckMetaphors] = useState(() => localStorage.getItem('neighbor-check-metaphors') !== 'false')
  const [checkIdioms, setCheckIdioms] = useState(() => localStorage.getItem('neighbor-check-idioms') !== 'false')
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'auto')

  // Refs for custom toggle elements to bypass their event registration bug
  const ableistRef = useRef(null)
  const metaphorsRef = useRef(null)
  const idiomsRef = useRef(null)

  const textareaRef = useRef(null)
  const backdropRef = useRef(null)

  // Apply and manage theme (incorporating interactive random colors for Fiesta mode)
  useThemeManager(theme, {
    onFiestaActivated: () => {
      announce('Fiesta mode activated! Color theme is randomized!')
    },
    onFiestaClick: () => {
      applyTheme('fiesta')
    },
    onFiestaKey: () => {
      applyTheme('fiesta')
    },
    keyTargetId: 'editor-textarea'
  })

  // Save settings on change
  useEffect(() => {
    localStorage.setItem('neighbor-check-ableist', checkAbleist)
  }, [checkAbleist])

  useEffect(() => {
    localStorage.setItem('neighbor-check-metaphors', checkMetaphors)
  }, [checkMetaphors])

  useEffect(() => {
    localStorage.setItem('neighbor-check-idioms', checkIdioms)
  }, [checkIdioms])

  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  // Run scans when text or settings change
  useEffect(() => {
    const ableist = checkAbleist ? checkList(text, ABLEIST_TERMS, 'Ableist Language') : []
    const metaphors = checkMetaphors ? checkList(text, DISABILITY_METAPHORS, 'Disability Metaphor') : []
    const idioms = checkIdioms ? checkList(text, ENGLISH_IDIOMS, 'Opaque Idiom') : []

    const allIssues = [...ableist, ...metaphors, ...idioms].sort((a, b) => {
      if (a.index !== b.index) return a.index - b.index
      return b.length - a.length // prefer longer matches if at same index
    })

    // Filter out overlapping issues to prevent backdrop offset bugs
    const filteredIssues = []
    let lastEnd = 0
    for (const issue of allIssues) {
      if (issue.index >= lastEnd) {
        filteredIssues.push(issue)
        lastEnd = issue.index + issue.length
      }
    }

    setIssues(filteredIssues)
  }, [text, checkAbleist, checkMetaphors, checkIdioms])

  // Debounced announcements to prevent screen reader spam during active typing
  useEffect(() => {
    if (!text) return
    const timer = setTimeout(() => {
      if (issues.length > 0) {
        announce(`Scanner found ${issues.length} accessibility ${issues.length === 1 ? 'issue' : 'issues'}.`, { priority: 'polite' })
      } else {
        announce('Scanner found no accessibility issues.', { priority: 'polite' })
      }
    }, 1500)
    return () => clearTimeout(timer)
  }, [issues.length, text])

  const handleScroll = () => {
    if (backdropRef.current && textareaRef.current) {
      backdropRef.current.scrollTop = textareaRef.current.scrollTop
      backdropRef.current.scrollLeft = textareaRef.current.scrollLeft
    }
  }

  const highlightIssue = (issue) => {
    if (!textareaRef.current) return
    const el = textareaRef.current
    el.focus()
    el.setSelectionRange(issue.index, issue.index + issue.length)
  }

  const handleSetSidebarView = (view) => {
    setSidebarView(view)
    if (view === 'settings') {
      announce('Settings panel opened.')
    } else if (view === 'about') {
      announce('About panel opened.')
    } else {
      announce('Returned to issues list.')
    }
  }

  // Generate backdrop HTML with highlighted marks
  const generateHighlights = () => {
    if (!text) return ''
    if (issues.length === 0) {
      return escapeHtml(text) + (text.endsWith('\n') ? '\n' : '')
    }

    let html = ''
    let lastIndex = 0
    issues.forEach(issue => {
      html += escapeHtml(text.slice(lastIndex, issue.index))
      html += `<mark class="editor-highlight">${escapeHtml(text.slice(issue.index, issue.index + issue.length))}</mark>`
      lastIndex = issue.index + issue.length
    })
    html += escapeHtml(text.slice(lastIndex))
    if (text.endsWith('\n')) {
      html += '\n'
    }
    return html
  }

  const escapeHtml = (unsafe) => {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-header-left">
          <h1 id="app-title-h1" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Neighbor Web</h1>
        </div>
        <div className="app-header-right">
          <Button
            id="btn-nav-about"
            variant="secondary"
            icon={<Info size={16} />}
            active={sidebarView === 'about'}
            onClick={() => handleSetSidebarView(sidebarView === 'about' ? 'issues' : 'about')}
            label="About Neighbor"
          >
            About
          </Button>
          <Button
            id="btn-nav-settings"
            variant="secondary"
            icon={<Settings size={16} />}
            active={sidebarView === 'settings'}
            onClick={() => handleSetSidebarView(sidebarView === 'settings' ? 'issues' : 'settings')}
            label="Settings"
          >
            Settings
          </Button>
        </div>
      </header>

      <main className="app-main">
        <div className="editor-container">
          <div className="editor-wrapper">
            <div
              className="editor-backdrop"
              ref={backdropRef}
              dangerouslySetInnerHTML={{ __html: generateHighlights() }}
              aria-hidden="true"
            />
            <textarea
              id="editor-textarea"
              className="editor-textarea"
              ref={textareaRef}
              value={text}
              onChange={e => setText(e.target.value)}
              onScroll={handleScroll}
              placeholder="Paste or type your document here to check for accessible language..."
              aria-label="Text editor"
              spellCheck="false"
            />
          </div>
        </div>

        <aside className="sidebar">
          {sidebarView === 'issues' && (
            <>
              <div className="sidebar-header">
                <h2 id="sidebar-issues-h2" style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
                  {issues.length} {issues.length === 1 ? 'Issue' : 'Issues'} Found
                </h2>
              </div>
              <div className="issue-list">
                {issues.length === 0 && (
                  <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>
                    {text ? 'No issues found! Your document looks great.' : 'Type some text to start checking accessibility.'}
                  </p>
                )}
                {issues.map(issue => (
                  <div key={issue.id} className="issue-card">
                    <div style={{ fontWeight: 600 }}>{issue.rule}</div>
                    <hr style={{ margin: '4px 0', border: 'none', borderTop: '1px solid var(--color-border-subtle)' }} />
                    <div style={{ marginTop: '4px' }}>
                      <strong>Found:</strong> <span className="issue-match">"{issue.match}"</span>
                    </div>
                    <div style={{ marginTop: '4px' }}>
                      <strong>Suggestion:</strong> <span className="issue-suggest">{issue.suggest}</span>
                    </div>
                    <div className="issue-sources" style={{ marginTop: '6px' }}>Sources: {issue.sources}</div>
                    <div style={{ marginTop: '12px' }}>
                      <Button
                        id={`btn-highlight-${issue.id}`}
                        variant="outline"
                        size="compact"
                        onClick={() => highlightIssue(issue)}
                        label={`Highlight "${issue.match}" in text`}
                      >
                        Highlight
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {sidebarView === 'settings' && (
            <div className="panel-container" style={{ padding: '24px' }}>
              <div className="panel-header" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <ButtonBack id="btn-settings-back" label="Back to issues" onClick={() => handleSetSidebarView('issues')} />
                <h2 id="panel-settings-h2" className="panel-title" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Settings</h2>
              </div>
              <div className="panel-section">
                <div className="panel-field" style={{ marginBottom: '24px' }}>
                  <label htmlFor="theme-select" className="panel-field-label" style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>Color Theme</label>
                  <FormControlSelect id="theme-select" value={theme} onChange={e => setTheme(e.target.value)}>
                    <option value="auto">System Default (Auto)</option>
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode</option>
                    <option value="fiesta">Fiesta Mode! 🎉</option>
                  </FormControlSelect>
                </div>

                <h3 className="panel-section-heading" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.05em' }}>Rule Checks</h3>

                <div className="panel-toggle-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div style={{ paddingRight: '12px' }}>
                    <label htmlFor="toggle-ableist" className="panel-toggle-label" style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>Ableist Language</label>
                    <div className="panel-toggle-desc" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Flag words that demean people with disabilities (e.g. "crazy", "lame").</div>
                  </div>
                  <FormControlToggle ref={ableistRef} id="toggle-ableist" checked={checkAbleist} onChange={setCheckAbleist} />
                </div>

                <div className="panel-toggle-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div style={{ paddingRight: '12px' }}>
                    <label htmlFor="toggle-metaphors" className="panel-toggle-label" style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>Disability Metaphors</label>
                    <div className="panel-toggle-desc" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Flag metaphors misusing medical conditions (e.g. "blind spot").</div>
                  </div>
                  <FormControlToggle ref={metaphorsRef} id="toggle-metaphors" checked={checkMetaphors} onChange={setCheckMetaphors} />
                </div>

                <div className="panel-toggle-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div style={{ paddingRight: '12px' }}>
                    <label htmlFor="toggle-idioms" className="panel-toggle-label" style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>Opaque Idioms</label>
                    <div className="panel-toggle-desc" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Flag idioms opaque to neurodivergent readers or non-native speakers.</div>
                  </div>
                  <FormControlToggle ref={idiomsRef} id="toggle-idioms" checked={checkIdioms} onChange={setCheckIdioms} />
                </div>
              </div>
            </div>
          )}

          {sidebarView === 'about' && (
            <div className="panel-container" style={{ padding: '24px' }}>
              <div className="panel-header" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <ButtonBack id="btn-about-back" label="Back to issues" onClick={() => handleSetSidebarView('issues')} />
                <h2 id="panel-about-h2" className="panel-title" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>About</h2>
              </div>
              <div className="panel-section" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p className="panel-body" style={{ margin: 0, lineHeight: 1.6 }}>
                  <strong>Neighbor Web</strong> is an interactive accessibility writing assistant that flags exclusionary terminology, idioms, and metaphors.
                </p>
                <p className="panel-body" style={{ margin: 0, lineHeight: 1.6 }}>
                  By offering inclusive suggestions in real-time, Neighbor supports authors in crafting content that is both respectful and readable.
                </p>
                <InfoBox label="A11yFred Suite">
                  Neighbor is a core component of the A11yFred suite of tools, supporting digital inclusion and professional accessibility audits.
                </InfoBox>
              </div>
            </div>
          )}
        </aside>
      </main>

      <footer className="app-footer">
        <p>Released under the MIT License</p>
        <Button
          id="btn-footer-github"
          variant="tertiary"
          icon={<Github size={16} />}
          onClick={() => window.open('https://github.com/a11yfred/neighbor', '_blank')}
          label="View project on GitHub"
        >
          View this on GitHub
        </Button>
      </footer>
    </div>
  )
}
