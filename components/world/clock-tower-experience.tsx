'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, LockKeyhole, X } from 'lucide-react'

type GearId = 'arrival' | 'key' | 'plant' | 'bird'
const gears: { id: GearId; symbol: string; name: string; relic: string; memory: string }[] = [
  { id: 'arrival', symbol: '✧', name: 'The First Fragment', relic: 'The Manor’s first gift', memory: 'A fragment was placed in your hands before you knew what it belonged to.' },
  { id: 'key', symbol: '⚿', name: 'The Key', relic: 'Seed of Harmony', memory: 'The cabinet opened only after the nine fragments had become one.' },
  { id: 'plant', symbol: '❧', name: 'The Living Leaf', relic: 'Archivist’s Quill', memory: 'The celestial sphere yielded its secret when every plant found its place.' },
  { id: 'bird', symbol: '♧', name: 'The Watcher', relic: 'The Library artifact', memory: 'The missing page was restored when the watchers found their order.' },
]
const solution: GearId[] = ['arrival', 'key', 'plant', 'bird']

export function ClockTowerExperience({ onBack, onArtifactUnlocked }: { onBack: () => void; onArtifactUnlocked: () => void }) {
  const [found, setFound] = useState<GearId[]>([])
  const [selected, setSelected] = useState<GearId | null>(null)
  const [placed, setPlaced] = useState<(GearId | null)[]>([null, null, null, null])
  const [showInscription, setShowInscription] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [solved, setSolved] = useState(false)
  const [reveal, setReveal] = useState(false)

  const collect = (id: GearId) => {
    setFound(current => current.includes(id) ? current : [...current, id])
    setSelected(id)
    setFeedback('')
  }
  const place = (slot: number) => {
    if (!selected || solved) return
    setPlaced(current => {
      const next = [...current]
      const old = next.indexOf(selected)
      if (old >= 0) next[old] = null
      next[slot] = selected
      return next
    })
    setSelected(null)
    setFeedback('')
  }
  const check = () => {
    if (placed.every((id, index) => id === solution[index])) {
      setSolved(true)
      setFeedback('THE FOUR MEMORIES HAVE FOUND THEIR PLACE')
      window.setTimeout(() => setReveal(true), 2600)
    } else {
      setFeedback('The mechanism resists. The memories are not yet in the right order.')
    }
  }

  return <main className="clock-tower-screen">
    <div className="clock-tower-backdrop" aria-hidden="true" />
    <div className="clock-tower-shade" aria-hidden="true" />
    <header className="conservatory-header clock-tower-header">
      <button className="back-button" onClick={onBack}><ArrowLeft aria-hidden="true"/><span>Main Hall</span></button>
      <div className="conservatory-title">THE MANOR <i>·</i> CLOCK TOWER</div>
      <div className="conservatory-progress">{solved ? 'THE CLOCK AWAKENS' : 'THE FOUR MEMORIES'}</div>
    </header>

    <div className="clock-tower-hotspots">
      {gears.map((gear, index) => <button key={gear.id} className={`clock-tower-hotspot clock-tower-hotspot-${index + 1} ${found.includes(gear.id) ? 'is-found' : ''}`} onClick={() => collect(gear.id)} aria-label={`Examine ${gear.name}`}>
        <span>{found.includes(gear.id) ? '✓' : index + 1}</span>
      </button>)}
      <button className="clock-tower-hotspot clock-tower-hotspot-clock" onClick={() => setShowInscription(true)} aria-label="Examine the great clock"><span>✧</span></button>
    </div>
    <div className="clock-tower-tuning-note">CLOCK TOWER · HOTSPOT PLACEMENT MODE</div>

    <section className="clockwork-panel">
      <div className="clockwork-heading">
        <p className="kicker">THE MECHANISM OF REMEMBRANCE</p>
        <h1>The Four Gears</h1>
        <p>Four memories brought you here. Place them in the order in which the Manor entrusted them to you.</p>
      </div>
      <div className="clockwork-slots">
        {placed.map((id, index) => {
          const gear = gears.find(item => item.id === id)
          return <button key={index} className={`clockwork-slot ${gear ? 'has-gear' : ''} ${selected ? 'slot-ready' : ''}`} onClick={() => place(index)} disabled={!selected || solved}>
            <span className="clockwork-slot-number">0{index + 1}</span>
            {gear ? <><span className="clockwork-gear-symbol">{gear.symbol}</span><strong>{gear.name}</strong><small>{gear.relic}</small></> : <><span className="clockwork-empty">⚙</span><small>Place a gear</small></>}
          </button>
        })}
      </div>
      <div className="clockwork-inventory">
        <div className="clockwork-inventory-heading"><span>RECOVERED GEARS</span><span>{found.length} / 4</span></div>
        <div className="clockwork-gear-list">
          {gears.map(gear => found.includes(gear.id) && <button key={gear.id} className={`clockwork-gear-card ${selected === gear.id ? 'is-selected' : ''} ${placed.includes(gear.id) ? 'is-placed' : ''}`} onClick={() => setSelected(selected === gear.id ? null : gear.id)} disabled={solved || placed.includes(gear.id)}>
            <span className="clockwork-gear-medallion">{gear.symbol}</span><span><strong>{gear.name}</strong><small>{gear.relic}</small></span>{selected === gear.id && <Check/>}
          </button>)}
        </div>
      </div>
      <div className="clockwork-actions">
        <button className="clockwork-inscription-button" onClick={() => setShowInscription(true)}>Read the inscription</button>
        <button className="enter-button" onClick={check} disabled={found.length !== 4 || placed.some(id => id === null) || solved}><span>{solved ? 'The mechanism is aligned' : 'Set the mechanism in motion'}</span><ArrowRight/></button>
      </div>
      {feedback && <p className={`clockwork-feedback ${solved ? 'is-solved' : ''}`}>{feedback}</p>}
    </section>

    {showInscription && <div className="hall-modal-backdrop clockwork-modal-backdrop" role="presentation" onClick={() => setShowInscription(false)}>
      <section className="hall-modal clockwork-inscription" role="dialog" aria-modal="true" aria-labelledby="clockwork-inscription-title" onClick={event => event.stopPropagation()}>
        <button className="hall-modal-close" onClick={() => setShowInscription(false)} aria-label="Close"><X/></button>
        <p className="kicker">AN INSCRIPTION ON THE CLOCK</p><h2 id="clockwork-inscription-title">The order of remembrance</h2>
        <blockquote>“Every beginning carries the seed of what follows. What is received becomes the means to open the next door. Let no gift be separated from the moment that gave it.”</blockquote>
        <p className="research-body">The four gears bear familiar marks. Some recall the trials you completed; others, the gifts that followed. Remember not only what you found, but when it was entrusted to you.</p>
        <button className="enter-button hall-modal-action" onClick={() => setShowInscription(false)}><span>Return to the mechanism</span><ArrowRight/></button>
      </section>
    </div>}

    {reveal && <div className="cabinet-reveal-backdrop clock-tower-reveal">
      <section className="cabinet-reveal-scene clock-tower-reveal-scene" role="dialog" aria-modal="true" aria-labelledby="clock-tower-reveal-title">
        <img className="cabinet-reveal-image" src="/manor-clock-tower/clockwork-awakened.png" alt="The great clock has awakened and revealed the Heart of Time"/>
        <div className="cabinet-reveal-vignette" aria-hidden="true"/>
        <div className="cabinet-reveal-copy">
          <p className="kicker">THE MANOR REMEMBERS</p>
          <h2 id="clock-tower-reveal-title">The Heart of Time</h2>
          <p>The four gears begin to turn. One awakens the next, until the entire mechanism moves as a single living thing. The great clock strikes for the first time in many years. At its heart, something has been waiting for you.</p>
          <img className="clock-tower-artifact" src="/manor-clock-tower/heart-of-time.png" alt="The Heart of Time artifact"/>
          <button className="enter-button" onClick={onArtifactUnlocked}><span>Receive the Heart of Time</span><ArrowRight/></button>
        </div>
      </section>
    </div>}
  </main>
}
