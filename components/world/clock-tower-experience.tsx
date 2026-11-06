'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Sparkles, X } from 'lucide-react'

type GearId = 'arrival' | 'key' | 'plant' | 'bird'
type AmbientId = 'pendulum' | 'telescope' | 'starChart'

const ambientDiscoveries: Record<AmbientId, { title: string; body: string }> = {
  pendulum: {
    title: 'The Silent Pendulum',
    body: 'A long brass weight hangs in the stillness. Its surface bears the soft marks of countless years, as though time itself has rested here between one movement and the next.',
  },
  telescope: {
    title: 'The Old Telescope',
    body: 'The telescope is turned towards the dark beyond the glass. A thin film of dust softens its polished brass, but the eyepiece has been kept clear by a careful hand.',
  },
  starChart: {
    title: 'The Astronomer’s Chart',
    body: 'Faded constellations cross the parchment in delicate ink. Some of the annotations have nearly disappeared, leaving the quiet impression of a sky remembered rather than observed.',
  },
}

const gears: {
  id: GearId
  name: string
  relic: string
  memory: string
  image: string
}[] = [
  {
    id: 'arrival',
    name: 'The First Fragment',
    relic: 'The Manor’s first gift',
    memory: 'A fragment was placed in your hands before you knew what it belonged to.',
    image: '/manor-clock-tower/gear-first-fragment.png',
  },
  {
    id: 'key',
    name: 'Seed of Harmony',
    relic: 'The gift of the Main Hall',
    memory: 'The cabinet opened only after the nine fragments had become one.',
    image: '/manor-clock-tower/gear-seed-of-harmony.png',
  },
  {
    id: 'plant',
    name: 'Archivist’s Quill',
    relic: 'The secret of the Conservatory',
    memory: 'The celestial sphere yielded its secret when every plant found its place.',
    image: '/manor-clock-tower/gear-archivists-quill.png',
  },
  {
    id: 'bird',
    name: 'The Three Watchers',
    relic: 'The restored page of the Library',
    memory: 'The missing page was restored when the watchers found their order.',
    image: '/manor-clock-tower/gear-three-watchers.png',
  },
]

const solution: GearId[] = ['arrival', 'key', 'plant', 'bird']

export function ClockTowerExperience({ onBack, onArtifactUnlocked }: { onBack: () => void; onArtifactUnlocked: () => void }) {
  const [found, setFound] = useState<GearId[]>([])
  const [activeGear, setActiveGear] = useState<GearId | null>(null)
  const [activeAmbient, setActiveAmbient] = useState<AmbientId | null>(null)
  const [selectedGear, setSelectedGear] = useState<GearId | null>(null)
  const [selectedFromSlot, setSelectedFromSlot] = useState<number | null>(null)
  const [placed, setPlaced] = useState<(GearId | null)[]>([null, null, null, null])
  const [showPuzzle, setShowPuzzle] = useState(false)
  const [showInscription, setShowInscription] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [solved, setSolved] = useState(false)
  const [awakening, setAwakening] = useState(false)
  const [reveal, setReveal] = useState(false)

  const collect = (id: GearId) => {
    setFound(current => current.includes(id) ? current : [...current, id])
    setActiveGear(null)
  }

  const place = (slot: number) => {
    if (solved) return
    setFeedback('')

    if (selectedGear === null) {
      const existing = placed[slot]
      if (existing) {
        setSelectedGear(existing)
        setSelectedFromSlot(slot)
        setPlaced(current => current.map((value, index) => index === slot ? null : value))
      }
      return
    }

    setPlaced(current => {
      const next = [...current]
      const displaced = next[slot]
      next[slot] = selectedGear
      if (selectedFromSlot !== null && selectedFromSlot !== slot) next[selectedFromSlot] = displaced
      return next
    })
    setSelectedGear(null)
    setSelectedFromSlot(null)
  }

  const check = () => {
    if (placed.every((id, index) => id === solution[index])) {
      setSolved(true)
      setFeedback('THE FOUR MEMORIES HAVE FOUND THEIR PLACE')
      setAwakening(true)
      window.setTimeout(() => {
        setShowPuzzle(false)
        setAwakening(false)
        setReveal(true)
      }, 2600)
    } else {
      setFeedback('The mechanism resists. The memories are not yet in the right order.')
    }
  }

  return (
    <main className="clock-tower-screen">
      <div className="clock-tower-backdrop" aria-hidden="true" />
      <div className="clock-tower-shade" aria-hidden="true" />
      <header className="conservatory-header clock-tower-header">
        <button className="back-button" onClick={onBack}><ArrowLeft aria-hidden="true" /><span>Main Hall</span></button>
        <div className="conservatory-title">THE MANOR <i>·</i> CLOCK TOWER</div>
        <div className="conservatory-progress">{solved ? 'THE CLOCK AWAKENS' : 'THE FOUR MEMORIES'}</div>
      </header>

      <div className="clock-tower-hotspots">
        {gears.map((gear, index) => (
          <button
            key={gear.id}
            className={`clock-tower-hotspot clock-tower-hotspot-${index + 1} ${found.includes(gear.id) ? 'is-found' : ''}`}
            onClick={() => setActiveGear(gear.id)}
            aria-label={`Examine ${gear.name}`}
          >
            <span>{found.includes(gear.id) ? <Check aria-hidden="true" /> : '✧'}</span>
          </button>
        ))}
        <button className="clock-tower-hotspot clock-tower-hotspot-clock" onClick={() => setShowPuzzle(true)} aria-label="Examine the clock mechanism">
          <span>⚙</span>
        </button>
        <button className="clock-tower-hotspot clock-tower-hotspot-ambient-1" onClick={() => setActiveAmbient('pendulum')} aria-label="Examine the silent pendulum"><span>✧</span></button>
        <button className="clock-tower-hotspot clock-tower-hotspot-ambient-2" onClick={() => setActiveAmbient('telescope')} aria-label="Examine the old telescope"><span>✧</span></button>
        <button className="clock-tower-hotspot clock-tower-hotspot-ambient-3" onClick={() => setActiveAmbient('starChart')} aria-label="Examine the astronomer’s chart"><span>✧</span></button>
      </div>
      <div className="clock-tower-tuning-note">CLOCK TOWER · HOTSPOT PLACEMENT MODE</div>

      {activeGear && (() => {
        const gear = gears.find(item => item.id === activeGear)!
        const alreadyFound = found.includes(activeGear)
        return (
          <div className="hall-modal-backdrop clockwork-modal-backdrop" role="presentation" onClick={() => setActiveGear(null)}>
            <section className="hall-modal clockwork-discovery" role="dialog" aria-modal="true" aria-labelledby="clockwork-discovery-title" onClick={event => event.stopPropagation()}>
              <button className="hall-modal-close" onClick={() => setActiveGear(null)} aria-label="Close"><X /></button>
              <p className="kicker">CLOCK TOWER · MEMORY {String(gears.indexOf(gear) + 1).padStart(2, '0')}</p>
              <img className="clockwork-discovery-gear" src={gear.image} alt="" />
              <h2 id="clockwork-discovery-title">{gear.name}</h2>
              <p className="research-body">{gear.memory}</p>
              <p className="clockwork-discovery-relic">{gear.relic}</p>
              <button className="enter-button hall-modal-action" onClick={() => collect(activeGear)}>
                <span>{alreadyFound ? 'Return to the clock tower' : 'Recover this memory'}</span><ArrowRight />
              </button>
            </section>
          </div>
        )
      })()}

      {activeAmbient && (
        <div className="hall-modal-backdrop clockwork-modal-backdrop" role="presentation" onClick={() => setActiveAmbient(null)}>
          <section className="hall-modal clockwork-discovery clock-tower-ambient-discovery" role="dialog" aria-modal="true" aria-labelledby="clock-tower-ambient-title" onClick={event => event.stopPropagation()}>
            <button className="hall-modal-close" onClick={() => setActiveAmbient(null)} aria-label="Close"><X /></button>
            <p className="kicker">CLOCK TOWER · A CLOSER LOOK</p>
            <div className="clockwork-discovery-symbol" aria-hidden="true">✧</div>
            <h2 id="clock-tower-ambient-title">{ambientDiscoveries[activeAmbient].title}</h2>
            <p className="research-body">{ambientDiscoveries[activeAmbient].body}</p>
            <button className="enter-button hall-modal-action" onClick={() => setActiveAmbient(null)}><span>Return to the clock tower</span><ArrowRight /></button>
          </section>
        </div>
      )}

      {showPuzzle && (
        <div className="hall-modal-backdrop clockwork-modal-backdrop" role="presentation" onClick={() => { if (!solved) { setShowPuzzle(false); setSelectedGear(null); setSelectedFromSlot(null) } }}>
          <section className={`hall-modal clockwork-puzzle-modal ${awakening ? 'is-awakening' : ''}`} role="dialog" aria-modal="true" aria-labelledby="clockwork-title" onClick={event => event.stopPropagation()}>
            {!awakening && <button className="hall-modal-close" onClick={() => { setShowPuzzle(false); setSelectedGear(null); setSelectedFromSlot(null) }} aria-label="Close"><X /></button>}
            <div className="clockwork-heading">
              <p className="kicker">THE MECHANISM OF REMEMBRANCE</p>
              <h2 id="clockwork-title">{awakening ? 'The Clock Awakens' : 'The Four Gears'}</h2>
              <p>{awakening ? 'The memories fall into place. Deep within the tower, the great mechanism begins to turn.' : 'Place the four recovered gears in the order in which the Manor entrusted its memories to you.'}</p>
            </div>

            <div className={`clock-face-board ${awakening ? 'is-glowing' : ''}`}>
              <img className="clock-face-image" src="/manor-clock-tower/clock-face-empty.png" alt="The empty clock face with four places for the recovered gears" />
              {placed.map((id, index) => {
                const gear = gears.find(item => item.id === id)
                return (
                  <button
                    key={index}
                    className={`clock-face-slot clock-face-slot-${index + 1} ${gear ? 'has-gear' : ''} ${selectedGear ? 'slot-ready' : ''}`}
                    style={{
                      left: `${[49.5, 68.3, 49.5, 30.9][index]}%`,
                      top: `${[28.4, 47.5, 67.9, 47.5][index]}%`,
                    }}
                    onClick={() => place(index)}
                    disabled={solved}
                    aria-label={gear ? `Gear position ${index + 1}: ${gear.name}` : `Empty gear position ${index + 1}`}
                  >
                    {gear ? <img src={gear.image} alt={gear.name} /> : <span>{String(index + 1).padStart(2, '0')}</span>}
                  </button>
                )
              })}
              {awakening && <div className="clock-face-awakening-flash" aria-hidden="true"><Sparkles /></div>}
            </div>

            {!awakening && (
              <>
                <div className="clockwork-inventory">
                  <div className="clockwork-inventory-heading"><span>RECOVERED GEARS</span><span>{placed.filter(Boolean).length} / 4 PLACED</span></div>
                  <div className="clockwork-gear-list">
                    {gears.map(gear => found.includes(gear.id) && (
                      <button
                        key={gear.id}
                        className={`clockwork-gear-card ${selectedGear === gear.id ? 'is-selected' : ''} ${placed.includes(gear.id) ? 'is-placed' : ''}`}
                        onClick={() => { setSelectedGear(selectedGear === gear.id ? null : gear.id); setSelectedFromSlot(null) }}
                        disabled={solved}
                      >
                        <img src={gear.image} alt="" />
                        <span><strong>{gear.name}</strong><small>{gear.relic}</small></span>
                        {selectedGear === gear.id && <Check />}
                      </button>
                    ))}
                  </div>
                </div>
                {selectedGear && <p className="clockwork-placement-hint">Choose a position on the clock face. Selecting an occupied position exchanges the gears.</p>}
                <div className="clockwork-actions">
                  <button className="clockwork-inscription-button" onClick={() => setShowInscription(true)}>Read the inscription</button>
                  <button className="enter-button" onClick={check} disabled={found.length !== 4 || placed.some(id => id === null) || solved}>
                    <span>Set the mechanism in motion</span><ArrowRight />
                  </button>
                </div>
                {feedback && <p className={`clockwork-feedback ${solved ? 'is-solved' : ''}`}>{feedback}</p>}
              </>
            )}
          </section>
        </div>
      )}

      {showInscription && (
        <div className="hall-modal-backdrop clockwork-modal-backdrop clockwork-inscription-layer" role="presentation" onClick={() => setShowInscription(false)}>
          <section className="hall-modal clockwork-inscription" role="dialog" aria-modal="true" aria-labelledby="clockwork-inscription-title" onClick={event => event.stopPropagation()}>
            <button className="hall-modal-close" onClick={() => setShowInscription(false)} aria-label="Close"><X /></button>
            <p className="kicker">AN INSCRIPTION ON THE CLOCK</p>
            <h2 id="clockwork-inscription-title">The order of remembrance</h2>
            <blockquote>“Every beginning carries the seed of what follows. What is received becomes the means to open the next door. Let no gift be separated from the moment that gave it.”</blockquote>
            <p className="research-body">The four gears bear familiar marks. Some recall the trials you completed; others, the gifts that followed. Remember not only what you found, but when it was entrusted to you.</p>
            <button className="enter-button hall-modal-action" onClick={() => setShowInscription(false)}><span>Return to the mechanism</span><ArrowRight /></button>
          </section>
        </div>
      )}

      {reveal && (
        <div className="cabinet-reveal-backdrop clock-tower-reveal">
          <section className="cabinet-reveal-scene clock-tower-reveal-scene" role="dialog" aria-modal="true" aria-labelledby="clock-tower-reveal-title">
            <img className="cabinet-reveal-image" src="/manor-clock-tower/compass-rose-open.png" alt="The compass rose in the tower floor has opened, revealing the Seeker’s Compass" />
            <div className="cabinet-reveal-vignette" aria-hidden="true" />
            <div className="cabinet-reveal-copy">
              <p className="kicker">THE MANOR REMEMBERS</p>
              <h2 id="clock-tower-reveal-title">Seeker’s Compass</h2>
              <p>The four gears begin to turn. One awakens the next, until the entire mechanism moves as a single living thing. Its motion travels through the tower and reaches the compass rose beneath your feet. The stone opens, revealing what it has guarded.</p>
              <img className="clock-tower-artifact" src="/manor-clock-tower/seekers-compass.png" alt="Seeker’s Compass artifact" />
              <button className="enter-button" onClick={onArtifactUnlocked}><span>Receive the Seeker’s Compass</span><ArrowRight /></button>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}
