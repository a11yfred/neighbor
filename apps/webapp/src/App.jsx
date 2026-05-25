import { useState, useRef, useEffect, useMemo } from 'react'
import {
  Button,
  announce,
  useThemeManager
} from '@ulam/ube/react'
import { Drawer } from '@ulam/sili/react'
import { Settings, Info, Github } from 'lucide-react'
import Sidebar from './components/Sidebar.jsx'
import PanelAbout from './components/PanelAbout.jsx'
import PanelSettings from './components/PanelSettings.jsx'
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
  const [aboutOpen, setAboutOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Persistent settings
  const [checkAbleist, setCheckAbleist] = useState(() => localStorage.getItem('neighbor-check-ableist') !== 'false')
  const [checkMetaphors, setCheckMetaphors] = useState(() => localStorage.getItem('neighbor-check-metaphors') !== 'false')
  const [checkIdioms, setCheckIdioms] = useState(() => localStorage.getItem('neighbor-check-idioms') !== 'false')

  // Refs for custom toggle elements to bypass their event registration bug
  const ableistRef = useRef(null)
  const metaphorsRef = useRef(null)
  const idiomsRef = useRef(null)

  const textareaRef = useRef(null)
  const backdropRef = useRef(null)

  // Refs for drawer triggers to handle accessibility return focus
  const aboutTriggerRef = useRef(null)
  const settingsTriggerRef = useRef(null)

  // Apply and manage theme (strictly adopting the system auto theme)
  useThemeManager('auto')

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



  // Run scans when text or settings change
  const issues = useMemo(() => {
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

    return filteredIssues
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
      <header className="page-header">
        <h1 className="page-title">Neighbor</h1>
        <p className="page-tagline">
          <em>Inclusive and accessible writing assistant</em>
        </p>
        <div className="page-header__actions">
          <Button
            ref={aboutTriggerRef}
            id="btn-nav-about"
            variant="secondary"
            icon={<Info size={18} />}
            onClick={() => {
              setAboutOpen(true)
              announce('About panel opened.')
            }}
            label="About Neighbor"
          >
            About
          </Button>
          <Button
            ref={settingsTriggerRef}
            id="btn-nav-settings"
            variant="secondary"
            icon={<Settings size={18} />}
            onClick={() => {
              setSettingsOpen(true)
              announce('Settings panel opened.')
            }}
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

        <Sidebar issues={issues} onHighlight={highlightIssue} text={text} />
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

      <Drawer open={aboutOpen} onClose={() => { setAboutOpen(false); announce('About panel closed.') }} label="About Neighbor" focusOnClose={aboutTriggerRef}>
        <PanelAbout onClose={() => { setAboutOpen(false); announce('About panel closed.') }} />
      </Drawer>

      <Drawer open={settingsOpen} onClose={() => { setSettingsOpen(false); announce('Settings panel closed.') }} label="Settings" focusOnClose={settingsTriggerRef}>
        <PanelSettings
          checkAbleist={checkAbleist}
          setCheckAbleist={setCheckAbleist}
          checkMetaphors={checkMetaphors}
          setCheckMetaphors={setCheckMetaphors}
          checkIdioms={checkIdioms}
          setCheckIdioms={setCheckIdioms}
          ableistRef={ableistRef}
          metaphorsRef={metaphorsRef}
          idiomsRef={idiomsRef}
          onClose={() => { setSettingsOpen(false); announce('Settings panel closed.') }}
        />
      </Drawer>
    </div>
  )
}

