'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Shield, Sparkles } from 'lucide-react'
import { artifacts, discoveries, firstRoom } from '@/content/world'
import { markDiscovered, readDiscoveries } from '@/lib/discovery-state'
import { ArchiveFrame } from '@/components/ui/archive-frame'

const artifact = artifacts[0]
const discovery = discoveries.find((item) => item.id === artifact.discoveryId) ?? discoveries[0]

type View = 'arrival' | 'journey' | 'fragment' | 'threshold' | 'room'

export function WorldExperience() {
  const [view, setView] = useState<View>('arrival')
  const [isOpen, setIsOpen] = useState(false)
  const [discovered, setDiscovered] = useState<string[]>([])
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setDiscovered(readDiscoveries())
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    if (view !== 'journey') return
    const duration = reducedMotion ? 0 : 15500
    const timer = window.setTimeout(() => setView('fragment'), duration)
    return () => window.clearTimeout(timer)
  }, [view, reducedMotion])

  const acceptFragment = () => {
    setDiscovered(markDiscovered(artifact.id))
    setView('threshold')
  }

  const skipArrival = () => setView('fragment')

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
          <ArchiveFrame weight="thin" cornerSize="sm" className="enter-frame"><button className="enter-button enter-button--framed" onClick={() => setView('journey')}>
            <span>Enter the manor</span><ArrowRight aria-hidden="true" />
          </button></ArchiveFrame>
        </div>
        <div className="arrival-footer"><span>THE MANOR · UNWRITTEN</span><span>01 / 07</span></div>
      </main>
    )
  }

  if (view === 'journey') {
    return (
      <main className="arrival-screen journey-screen">
        <div className="arrival-image journey-stage journey-stage-gates" aria-hidden="true" /><div className="arrival-image journey-stage journey-stage-approach" aria-hidden="true" /><div className="arrival-image journey-stage journey-stage-entrance" aria-hidden="true" />
        <div className="arrival-vignette journey-vignette" aria-hidden="true" />
        <div className="journey-text" aria-live="polite">
          <p className="journey-line journey-line-one">Every journey begins with a first step.</p>
          <p className="journey-line journey-line-two">You have found your way to this place.<br />Perhaps by choice, perhaps by chance.<br />The reason does not matter. Not yet.</p>
          <div className="journey-line journey-line-three">
            <p>Some stories have been told.<br />Others remain unfinished.</p>
            <p className="journey-last-line">And some have been waiting for someone to continue them.</p>
            <p className="journey-emphasis">Your journey begins with a fragment.</p>
          </div>
        </div>
        <button className="skip-intro" onClick={skipArrival}>Skip intro <ArrowRight aria-hidden="true" /></button>
        <div className="arrival-footer"><span>THE MANOR · UNWRITTEN</span><span>THE ARRIVAL</span></div>
      </main>
    )
  }

  if (view === 'fragment') {
    return (
      <main className="fragment-screen">
        <div className="fragment-backdrop" aria-hidden="true" />
        <ArchiveFrame className="fragment-frame"><div className="fragment-panel">
          <p className="kicker">A gift from the Manor</p>
          <p className="fragment-overline">Artifact · 001</p>
          <h1>The First Fragment</h1>
          <div className="fragment-art" role="img" aria-label="A weathered metal fragment bearing the Manor's crest">
            <div className="fragment-stone"><span className="fragment-crest"><Shield aria-hidden="true" /><b>G</b></span></div>
          </div>
          <p className="fragment-description">A small metal fragment bearing the seal of the Manor.<br />Its purpose is unknown.</p>
          <p className="fragment-lore">Every guest receives one upon entering.</p>
          <button className="enter-button fragment-accept" onClick={acceptFragment}>
            <span>Accept the fragment</span><ArrowRight aria-hidden="true" />
          </button>
          <button className="skip-intro fragment-skip" onClick={acceptFragment}>Continue <ArrowRight aria-hidden="true" /></button>
        </div></ArchiveFrame>
      </main>
    )
  }

  if (view === 'threshold') {
    return (
      <main className="threshold-screen">
        <div className="threshold-glow" aria-hidden="true" />
        <div className="threshold-card">
          <p className="kicker">The Manor remembers</p>
          <div className="threshold-mark"><Sparkles aria-hidden="true" /></div>
          <h1>A fragment has been entrusted to you.</h1>
          <p>You do not yet know what it belongs to, or why it was given.</p>
          <p>There will be time for questions. For now, the Manor awaits.</p>
          <button className="enter-button" onClick={() => setView('room')}>
            <span>Enter the Main Hall</span><ArrowRight aria-hidden="true" />
          </button>
        </div>
      </main>
    )
  }

  const revealArtifact = () => {
    setIsOpen(true)
    setDiscovered(markDiscovered(artifact.id))
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
            <span className="artifact-core"><Shield aria-hidden="true" /></span>
            <span className="artifact-shadow" aria-hidden="true" />
          </button>
          <p className="artifact-label"><span>{artifact.name.en}</span><small>{isOpen ? 'Discovered' : artifact.hint.en}</small></p>
        </div>
      </section>
      <footer className="room-footer">
        <span><Sparkles aria-hidden="true" /> More doors remain sealed</span>
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
