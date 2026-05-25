import { Button } from '@ulam/ube/react'

export default function Sidebar({ issues, onHighlight, text }) {
  return (
    <aside className="sidebar" aria-labelledby="sidebar-issues-h2">
      <div className="sidebar-header">
        <h2 id="sidebar-issues-h2" style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
          {issues.length} {issues.length === 1 ? 'Issue' : 'Issues'} Found
        </h2>
      </div>
      <div className="issue-list">
        {issues.length === 0 && (
          <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>
            {text ? 'No issues found! Your document looks great.' : 'Type or paste some text in the editor to check for accessible language.'}
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
                onClick={() => onHighlight(issue)}
                label={`Highlight "${issue.match}" in text`}
              >
                Highlight
              </Button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
