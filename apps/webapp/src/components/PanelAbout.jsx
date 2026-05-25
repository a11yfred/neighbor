import { Panel, InfoBox } from '@ulam/ube/react'

export default function PanelAbout({ onClose }) {
  return (
    <Panel
      panelClassName="about-panel page-panel"
      headerClassName="panel-header"
      titleClassName="panel-title"
      heading="About"
      onClose={onClose}
      closeAriaLabel="Close about panel"
    >
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
    </Panel>
  )
}
