import { Panel, FormControlSelect, FormControlToggle } from '@ulam/ube/react'

export default function PanelSettings({
  theme,
  setTheme,
  checkAbleist,
  setCheckAbleist,
  checkMetaphors,
  setCheckMetaphors,
  checkIdioms,
  setCheckIdioms,
  ableistRef,
  metaphorsRef,
  idiomsRef,
  onClose
}) {
  return (
    <Panel
      panelClassName="settings-panel page-panel"
      headerClassName="panel-header"
      titleClassName="panel-title"
      heading="Settings"
      onClose={onClose}
      closeAriaLabel="Close settings panel"
    >
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

        <div className="panel-toggle-row" style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'start', marginBottom: '20px' }}>
          <div style={{ paddingRight: '12px' }}>
            <label htmlFor="toggle-ableist" className="panel-toggle-label" style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>Ableist Language</label>
            <div className="panel-toggle-desc" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>Flag words that demean people with disabilities (e.g. "crazy", "lame").</div>
          </div>
          <FormControlToggle ref={ableistRef} id="toggle-ableist" checked={checkAbleist} onChange={setCheckAbleist} />
        </div>

        <div className="panel-toggle-row" style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'start', marginBottom: '20px' }}>
          <div style={{ paddingRight: '12px' }}>
            <label htmlFor="toggle-metaphors" className="panel-toggle-label" style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>Disability Metaphors</label>
            <div className="panel-toggle-desc" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>Flag metaphors misusing medical conditions (e.g. "blind spot").</div>
          </div>
          <FormControlToggle ref={metaphorsRef} id="toggle-metaphors" checked={checkMetaphors} onChange={setCheckMetaphors} />
        </div>

        <div className="panel-toggle-row" style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'start', marginBottom: '20px' }}>
          <div style={{ paddingRight: '12px' }}>
            <label htmlFor="toggle-idioms" className="panel-toggle-label" style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>Opaque Idioms</label>
            <div className="panel-toggle-desc" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>Flag idioms opaque to neurodivergent readers or non-native speakers.</div>
          </div>
          <FormControlToggle ref={idiomsRef} id="toggle-idioms" checked={checkIdioms} onChange={setCheckIdioms} />
        </div>
      </div>
    </Panel>
  )
}
