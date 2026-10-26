'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Eye, LockKeyhole, Sparkles } from 'lucide-react'
import { artifacts, discoveries, firstRoom } from '@/content/world'
import { markDiscovered, readDiscoveries } from '@/lib/discovery-state'

const artifact = artifacts[0]
const discovery = discoveries.find((item) => item.id === artifact.discoveryId) ?? discoveries[0]

type View = 'arrival' | 'room'

export function WorldExperience() {
  const [view, setView] = useState<View>('arrival')
  const [isOpen, setIsOpen] = useState(false)
  const [discovered, setDiscovered] = useState<string[]>([])

  useEffect(() => setDiscovered(readDiscoveries()), [])

  const revealArtifact = () => {
    setIsOpen(true)
    setDiscovered(markDiscovered(discovery.id))
  }

  if (view === 'arrival') {
    return (
      <main className="arrival-screen">
        <div className="arrival-image" aria-hidden="true" />
        <div className="arrival-vignette" aria-hidden="true" />
        <header className="site-mark"><span className="mark-glyph">M</span><span>Janope</span></header>
        <div className="arrival-content">
          <p className="arrival-crest" aria-hidden="true">♔</p>
          <p className="kicker">An interactive mystery</p>
          <h1><span>The</span> Manor</h1>
          <p className="arrival-subtitle">Unwritten</p>
          <div className="arrival-divider" aria-hidden="true" />
          <p className="arrival-copy">Every place holds a story.<br />Every discovery reveals a deeper truth.<br />And some answers are still unwritten.</p>
          <button className="enter-button" onClick={() => setView('room')}>
            <span>Enter the manor</span><ArrowRight aria-hidden="true" />
          </button>
        </div>
        <div className="arrival-footer"><span>THE MANOR · UNWRITTEN</span><span>01 / 07</span></div>
      </main>
    )
  }

  return (
    <main className="world-shell">
      <div className="room-light" aria-hidden="true" />
      <div className="room-grid" aria-hidden="true" />
      <header className="room-header">
        <button className="back-button" onClick={() => setView('arrival')} aria-label="Return to opening screen"><ArrowLeft aria-hidden="true" /><span>Exit to surface</span></button>
        <div className="room-counter"><span className="counter-dot" /> Discoveries {discovered.length} / 1</div>
      </header>
      <section className="room-content" aria-labelledby="room-title">
        <div className="room-copy">
          <p className="kicker">{firstRoom.eyebrow.en}</p>
          <h1 id="room-title">{firstRoom.name.en}</h1>
          <p>{firstRoom.description.en}</p>
          <div className="room-rule" />
          <p className="instruction"><span className="instruction-number">01</span> Look closely. The room gives back what you bring to it.</p>
        </div>
        <div className="artifact-stage">
          <button className={`artifact ${isOpen ? 'artifact-open' : ''}`} onClick={revealArtifact} aria-label={`Inspect ${artifact.name.en}`}>
            <span className="artifact-halo" aria-hidden="true" />
            <span className="artifact-orbit orbit-one" aria-hidden="true" />
            <span className="artifact-orbit orbit-two" aria-hidden="true" />
            <span className="artifact-core"><Eye aria-hidden="true" /></span>
            <span className="artifact-shadow" aria-hidden="true" />
          </button>
          <p className="artifact-label"><span>{artifact.name.en}</span><small>{isOpen ? 'Discovered' : artifact.hint.en}</small></p>
        </div>
      </section>
      <footer className="room-footer">
        <span><LockKeyhole aria-hidden="true" /> More doors remain sealed</span>
        <span className="room-location">The Threshold <i>•</i> North Wing</span>
      </footer>
      {isOpen && <div className="discovery-overlay" role="dialog" aria-modal="true" aria-labelledby="discovery-title">
        <div className="discovery-card">
          <button className="close-discovery" onClick={() => setIsOpen(false)} aria-label="Close discovery">×</button>
          <div className="discovery-icon"><Sparkles aria-hidden="true" /></div>
          <p className="kicker">Discovery 001 / The Threshold</p>
          <h2 id="discovery-title">{discovery.title.en}</h2>
          <p className="discovery-body">{discovery.body.en}</p>
          <blockquote>{discovery.inscription.en}</blockquote>
          <button className="continue-button" onClick={() => setIsOpen(false)}>Continue exploring <ArrowRight aria-hidden="true" /></button>
        </div>
      </div>}
    </main>
  )
}
