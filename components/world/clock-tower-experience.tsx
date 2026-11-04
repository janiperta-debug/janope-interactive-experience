'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react'

type GearId = 'arrival' | 'key' | 'plant' | 'bird'
const gears: { id: GearId; symbol: string; name: string; relic: string; memory: string; meaning: string }[] = [
  { id: 'arrival', symbol: '✧', name: 'The First Fragment', relic: 'The Manor’s first gift', memory: 'A fragment was placed in your hands before you knew what it belonged to.', meaning: 'Every journey begins with something small. The first fragment was the Manor’s invitation to look closer.' },
  { id: 'key', symbol: '⚿', name: 'The Key', relic: 'Seed of Harmony', memory: 'The cabinet opened only after the nine fragments had become one.', meaning: 'What seemed broken became whole. The Seed of Harmony was entrusted to you when the hidden shape was restored.' },
  { id: 'plant', symbol: '❧', name: 'The Living Leaf', relic: 'Archivist’s Quill', memory: 'The celestial sphere yielded its secret when every plant found its place.', meaning: 'The Conservatory taught that every living thing has its place, and every place has its purpose.' },
  { id: 'bird', symbol: '♧', name: 'The Watcher', relic: 'The Library artifact', memory: 'The missing page was restored when the watchers found their order.', meaning: 'The three watchers revealed their message only when their verses were brought together.' },
]
const solution: GearId[] = ['arrival', 'key', 'plant', 'bird']

export function ClockTowerExperience({ onBack, onArtifactUnlocked }: { onBack: () => void; onArtifactUnlocked: () => void }) {
  const [found, setFound] = useState<GearId[]>([])
  const [activeGear, setActiveGear] = useState<GearId | null>(null)
  const [placed, setPlaced] = useState<(GearId | null)[]>([null, null, null, null])
  const [showPuzzle, setShowPuzzle] = useState(false)
  const [showInscription, setShowInscription] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [solved, setSolved] = useState(false)
  const [reveal, setReveal] = useState(false)

  const collect = (id: GearId) => {
    setFound(current => current.includes(id) ? current : [...current, id])
    setActiveGear(null)
  }
  const place = (slot: number) => {
    if (!activeGear || solved) return
    setPlaced(current => {
      const next = [...current]
      const previous = next.indexOf(activeGear)
      if (previous >= 0) next[previous] = null
      next[slot] = activeGear
      return next
    })
    setActiveGear(null)
    setFeedback('')
  }
  const check = () => {
    if (placed.every((id, index) => id === solution[index])) {
      setSolved(true)
      setFeedback('THE FOUR MEMORIES HAVE FOUND THEIR PLACE')
      window.setTimeout(() => {
        setShowPuzzle(false)
        setReveal(true)
      }, 1800)
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
      {gears.map((gear, index) => <button key={gear.id} className={`clock-tower-hotspot clock-tower-hotspot-${index + 1} ${found.includes(gear.id) ? 'is-found' : ''}`} onClick={() => setActiveGear(gear.id)} aria-label={`Examine ${gear.name}`}>
        <span>{found.includes(gear.id) ? '✓' : '✧'}</span>
      </button>)}
      <button className="clock-tower-hotspot clock-tower-hotspot-clock" onClick={() => setShowPuzzle(true)} aria-label="Examine the clock mechanism"><span>⚙</span></button>
    </div>
    <div className="clock-tower-tuning-note">CLOCK TOWER · HOTSPOT PLACEMENT MODE</div>

    {activeGear && (() => {
      const gear = gears.find(item => item.id === activeGear)!
      const alreadyFound = found.includes(activeGear)
      return <div className="hall-modal-backdrop clockwork-modal-backdrop" role="presentation" onClick={() => setActiveGear(null)}>
        <section className="hall-modal clockwork-discovery" role="dialog" aria-modal="true" aria-labelledby="clockwork-discovery-title" onClick={event => event.stopPropagation()}>
          <button className="hall-modal-close" onClick={() => setActiveGear(null)} aria-label="Close"><X/></button>
          <p className="kicker">CLOCK TOWER · MEMORY {String(gears.indexOf(gear) + 1).padStart(2, '0')}</p>
          <div className="clockwork-discovery-symbol">{gear.symbol}</div>
          <h2 id="clockwork-discovery-title">{gear.name}</h2>
          <p className="research-body">{gear.memory}</p>
          <p className="clockwork-discovery-relic">{gear.relic}</p>
          <button className="enter-button hall-modal-action" onClick={() => collect(activeGear)}><span>{alreadyFound ? 'Return to the clock tower' : 'Recover this memory'}</span><ArrowRight/></button>
        </section>
      </div>
    })()}

    {showPuzzle && <div className="hall-modal-backdrop clockwork-modal-backdrop" role="presentation" onClick={() => { setShowPuzzle(false); setActiveGear(null) }}>
      <section className="hall-modal clockwork-puzzle-modal" role="dialog" aria-modal="true" aria-labelledby="clockwork-title" onClick={event => event.stopPropagation()}>
        <button className="hall-modal-close" onClick={() => setShowPuzzle(false)} aria-label="Close"><X/></button>
        <div className="clockwork-heading">
          <p className="kicker">THE MECHANISM OF REMEMBRANCE</p>
          <h2 id="clockwork-title">The Four Gears</h2>
          <p>Four memories brought you here. Place them in the order in which the Manor entrusted them to you.</p>
        </div>
        <div className="clockwork-slots">
          {placed.map((id, index) => {
            const gear = gears.find(item => item.id === id)
            return <button key={index} className={`clockwork-slot ${gear ? 'has-gear' : ''} ${activeGear ? 'slot-ready' : ''}`} onClick={() => {
              if (activeGear) place(index)
              else if (id) {
                setActiveGear(id)
                setPlaced(current => current.map((value, slot) => slot === index ? null : value))
              }
            }} disabled={solved}>
              <span className="clockwork-slot-number">0{index + 1}</span>
              {gear ? <><span className="clockwork-gear-symbol">{gear.symbol}</span><strong>{gear.name}</strong><small>{gear.relic}</small></> : <><span className="clockwork-empty">⚙</span><small>{activeGear ? 'Place memory here' : 'Empty gear'}</small></>}
            </button>
          })}
        </div>
        <div className="clockwork-inventory">
          <div className="clockwork-inventory-heading"><span>RECOVERED MEMORIES</span><span>{found.length} / 4</span></div>
          <div className="clockwork-gear-list">
            {gears.map(gear => found.includes(gear.id) && <button key={gear.id} className={`clockwork-gear-card ${activeGear === gear.id ? 'is-selected' : ''} ${placed.includes(gear.id) ? 'is-placed' : ''}`} onClick={() => setActiveGear(activeGear === gear.id ? null : gear.id)} disabled={solved || placed.includes(gear.id)}>
              <span className="clockwork-gear-medallion">{gear.symbol}</span><span><strong>{gear.name}</strong><small>{gear.relic}</small></span>{activeGear === gear.id && <Check/>}
            </button>)}
          </div>
        </div>
        <div className="clockwork-actions">
          <button className="clockwork-inscription-button" onClick={() => setShowInscription(true)}>Read the inscription</button>
          <button className="enter-button" onClick={check} disabled={found.length !== 4 || placed.some(id => id === null) || solved}><span>{solved ? 'The mechanism is aligned' : 'Set the mechanism in motion'}</span><ArrowRight/></button>
        </div>
        {feedback && <p className={`clockwork-feedback ${solved ? 'is-solved' : ''}`}>{feedback}</p>}
      </section>
    </div>}

    {showInscription && <div className="hall-modal-backdrop clockwork-modal-backdrop clockwork-inscription-layer" role="presentation" onClick={() => setShowInscription(false)}>
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
          <h2 id="clock-tower-reveal-title">The Hourglass of Clarity</h2>
          <p>The four gears begin to turn. One awakens the next, until the entire mechanism moves as a single living thing. The great clock strikes for the first time in many years. At its heart, the Hourglass of Clarity has been waiting for you.</p>
          <img className="clock-tower-artifact" src="/manor-clock-tower/hourglass-of-clarity.png" alt="The Hourglass of Clarity artifact"/>
          <button className="enter-button" onClick={onArtifactUnlocked}><span>Receive the Heart of Time</span><ArrowRight/></button>
        </div>
      </section>
    </div>}
  </main>
}
