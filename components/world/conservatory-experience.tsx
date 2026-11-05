'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, Leaf, Sun, Droplets, Wind, LockKeyhole, Check, X, Sparkles } from 'lucide-react'
import { ArchiveFrame } from '@/components/ui/archive-frame'

type PlantId = 'silverleaf' | 'moonfern' | 'amberbell'
type PlaceId = 'sunroom' | 'stillcorner' | 'fountain'
type Plant = { id: PlantId; name: string; note: string; detail: string }
type Place = { id: PlaceId; name: string; description: string; symbol: string }

const plants: Plant[] = [
  { id: 'silverleaf', name: 'Silverleaf', note: 'The gardener notes that the soil around its roots should never become dry, and that the air around its leaves should remain damp from morning until evening.', detail: 'Its pale leaves hold their colour even after long days. The field notes focus on moisture that remains in the air and soil, rather than on direct sunlight.' },
  { id: 'moonfern', name: 'Moon Fern', note: 'The fronds scorch when the sun reaches them directly. The gardener’s margin note recommends a cool, sheltered place where the light is always softened.', detail: 'Its fine fronds are delicate but healthy. The notes warn against strong sunlight and sudden warmth, favouring a quiet, shaded environment.' },
  { id: 'amberbell', name: 'Amber Bell', note: 'Small bells gather along its stems. The gardener records that it flowers only after long, warm afternoons, and that it needs generous daylight to open fully.', detail: 'The plant seems unremarkable at first glance. Its field notes repeatedly mention warmth and long hours of natural light.' },
]
const places: Place[] = [
  { id: 'sunroom', name: 'The Sunlit Atrium', description: 'A bright stretch of glass. Light moves across the stone here for much of the day.', symbol: '☼' },
  { id: 'stillcorner', name: 'The Still Corner', description: 'A sheltered alcove beneath climbing leaves, away from the busiest paths.', symbol: '❧' },
  { id: 'fountain', name: 'The Fountain Walk', description: 'Cool air drifts from the water. The stone stays damp long after the sun has moved on.', symbol: '♧' },
]
// The answer is based on relationships between the notes and the locations, not visible plant damage.
const solution: Record<PlantId, PlaceId> = { silverleaf: 'fountain', moonfern: 'stillcorner', amberbell: 'sunroom' }

export function ConservatoryExperience({ onBack, onLibrary, onLibraryUnlocked }: { onBack: () => void; onLibrary: () => void; onLibraryUnlocked: () => void }) {
  const [positions, setPositions] = useState<Partial<Record<PlantId, PlaceId>>>({})
  const [selectedPlant, setSelectedPlant] = useState<PlantId | null>(null)
  const [inspecting, setInspecting] = useState<PlantId | null>(null)
  const [solved, setSolved] = useState(false)
  const [artifactFound, setArtifactFound] = useState(false)
  const [showArtifact, setShowArtifact] = useState(false)
  const [showSphere, setShowSphere] = useState(false)
  const [ambientNote, setAmbientNote] = useState<string | null>(null)
  const [placeChoice, setPlaceChoice] = useState<PlaceId>('sunroom')
  const [arrangementFeedback, setArrangementFeedback] = useState<string | null>(null)

  const movePlant = (placeId: PlaceId) => {
    if (!selectedPlant || solved) return
    const occupant = (Object.entries(positions) as [PlantId, PlaceId][]).find(([, place]) => place === placeId)?.[0]
    const next = { ...positions }
    const oldPlace = next[selectedPlant]
    if (occupant) next[occupant] = oldPlace
    next[selectedPlant] = placeId
    setPositions(next)
    setSelectedPlant(null)
    if (plants.every(plant => next[plant.id] === solution[plant.id])) {
      setSolved(true)
      setInspecting(null)
      window.setTimeout(() => setShowArtifact(true), 500)
    }
  }
  const checkArrangement = () => {
    if (plants.every(plant => positions[plant.id] === solution[plant.id])) {
      setSolved(true)
      setSelectedPlant(null)
      window.setTimeout(() => setShowArtifact(true), 850)
    }
  }

  return <main className="conservatory-screen">
    <div className="conservatory-backdrop" aria-hidden="true" />
    <div className="conservatory-debug-scene" aria-label="Conservatory hotspot placement view">
      <button className="conservatory-hotspot plant-hotspot plant-hotspot-1" onClick={() => { setInspecting('silverleaf'); setPlaceChoice(positions.silverleaf ?? 'sunroom') }} aria-label="Plant 1">X</button>
      <button className="conservatory-hotspot plant-hotspot plant-hotspot-2" onClick={() => { setInspecting('moonfern'); setPlaceChoice(positions.moonfern ?? 'stillcorner') }} aria-label="Plant 2">X</button>
      <button className="conservatory-hotspot plant-hotspot plant-hotspot-3" onClick={() => { setInspecting('amberbell'); setPlaceChoice(positions.amberbell ?? 'fountain') }} aria-label="Plant 3">X</button>
      <button className="conservatory-hotspot place-hotspot place-hotspot-1" onClick={() => setAmbientNote(`${places[0].name}: ${places[0].description}`)} aria-label="Inspect planting place O1">X</button>
      <button className="conservatory-hotspot place-hotspot place-hotspot-2 place-hotspot-guided" onClick={() => setAmbientNote(`${places[1].name}: ${places[1].description}`)} aria-label="Inspect planting place O2">X</button>
      <button className="conservatory-hotspot place-hotspot place-hotspot-3" onClick={() => setAmbientNote(`${places[2].name}: ${places[2].description}`)} aria-label="Inspect planting place O3">X</button>
      <button className="conservatory-hotspot sphere-hotspot" onClick={() => setShowSphere(true)} aria-label="Celestial sphere">X</button>
    </div>
    <header className="conservatory-header">
      <button className="back-button" onClick={onBack}><ArrowLeft aria-hidden="true" /> <span>Main Hall</span></button>
      <div className="conservatory-title">THE MANOR <i>·</i> CONSERVATORY</div>
      <div className="conservatory-progress">{solved ? 'ROOM RESTORED' : 'A STUDY IN GROWTH'}</div>
    </header>
    <section className="conservatory-intro">
      <p className="kicker">A sanctuary of life, growth, and connection</p>
      <h1>The Conservatory</h1>
      <p>Not all change is visible. Give it light. Give it care. Give it time.</p>
    </section>
    <section className="conservatory-workspace">
      <button className="conservatory-sphere-entry" onClick={() => setShowSphere(true)} aria-label="Examine the closed celestial sphere"><img src="/manor-conservatory/celestial-sphere-closed.png" alt="" /><span>Examine the celestial sphere</span></button>
      <div className="conservatory-note-panel">
        <p className="kicker">The Gardener’s notes</p>
        <p>Three plants await their places. Their leaves offer no clear answer. Read what was written, observe the places around them, and decide what each one needs.</p>
        <div className="conservatory-instruction"><Leaf aria-hidden="true" /><span>Study the plants and growing places, then decide where each belongs.</span></div>
      </div>
      <div className="plant-study-grid">
        {plants.map((plant, index) => <button key={plant.id} className={`plant-study-card ${selectedPlant === plant.id ? 'plant-selected' : ''} ${solved ? 'plant-settled' : ''}`} onClick={() => { setPlaceChoice(positions[plant.id] ?? 'sunroom'); setInspecting(plant.id) }}>
          <span className={`plant-illustration plant-illustration-${index + 1}`}><i /><i /><i /><b>✦</b></span>
          <span className="plant-card-index">SPECIMEN 0{index + 1}</span>
          <strong>{plant.name}</strong>
          <span className="plant-current-place">{positions[plant.id] ? places.find(place => place.id === positions[plant.id])?.name : 'Awaiting a place'}</span>
          <span className="plant-card-action">{solved ? <><Check size={14}/> Settled</> : 'Study specimen →'}</span>
        </button>)}
      </div>
      <div className="conservatory-places">
        <div className="conservatory-section-heading"><span>Places within the conservatory</span><span>Inspect each place for clues</span></div>
        <div className="place-grid">
          {places.map((place, index) => {
            const plant = plants.find(p => positions[p.id] === place.id)
            return <button key={place.id} className={`plant-place place-${index + 1} ${solved ? 'place-solved' : ''}`} onClick={() => setAmbientNote(`${place.name}: ${place.description}`)}>
              <span className="place-symbol">{place.symbol}</span><strong>{place.name}</strong><span>{place.description}</span>
              <span className="place-occupant">{plant ? <><Leaf size={14}/>{plant.name}</> : 'Awaiting a plant'}</span>
            </button>
          })}
        </div>
      </div>
      <div className="conservatory-footer">
        <span className="conservatory-footer-note">{solved ? 'The room has found its balance.' : 'The right conditions are rarely the loudest ones.'}</span>
        <button className="enter-button conservatory-check" onClick={checkArrangement} disabled={solved}><span>{solved ? 'The arrangement is complete' : 'Reflect on the arrangement'}</span>{solved ? <Check/> : <ArrowRight/>}</button>
      </div>
    </section>
    {inspecting && <div className="hall-modal-backdrop" onClick={() => setInspecting(null)} role="presentation">
      <section className="hall-modal conservatory-modal" role="dialog" aria-modal="true" aria-labelledby="plant-modal-title" onClick={event => event.stopPropagation()}>
        <button className="hall-modal-close" onClick={() => setInspecting(null)} aria-label="Close"><X/></button>
        <p className="kicker">The Gardener’s field notes</p><h2 id="plant-modal-title">{plants.find(p => p.id === inspecting)?.name}</h2>
        <p className="research-body">{plants.find(p => p.id === inspecting)?.detail}</p>
        <div className="plant-note-card"><Leaf/><p>{plants.find(p => p.id === inspecting)?.note}</p></div>
        <div className="plant-place-choice">
          <label className="kicker" htmlFor="plant-place-select">Choose its place</label>
          <select id="plant-place-select" className="plant-place-select" value={placeChoice} onChange={event => setPlaceChoice(event.target.value as PlaceId)} disabled={solved}>
            {places.map(place => <option key={place.id} value={place.id}>{place.name}</option>)}
          </select>
          <p className="plant-place-description">{places.find(place => place.id === placeChoice)?.description}</p>
          <button className="enter-button plant-place-confirm" disabled={solved} onClick={() => {
            const next = { ...positions, [inspecting]: placeChoice }
            const occupant = (Object.entries(positions) as [PlantId, PlaceId][]).find(([id, currentPlace]) => id !== inspecting && currentPlace === placeChoice)?.[0]
            if (occupant && positions[inspecting]) next[occupant] = positions[inspecting]
            else if (occupant) delete next[occupant]
            setPositions(next)
            setSelectedPlant(null)
            setInspecting(null)
            if (plants.every(plant => next[plant.id] === solution[plant.id])) {
              setSolved(true)
              setArrangementFeedback('THE CONSERVATORY HAS FOUND ITS BALANCE')
              window.setTimeout(() => setShowArtifact(true), 500)
            } else {
              setArrangementFeedback('THE ARRANGEMENT IS NOT YET IN BALANCE · REVISIT THE FIELD NOTES')
            }
          }}><span>Confirm growing place</span><ArrowRight/></button>
        </div>
      </section>
    </div>}
    {ambientNote && <div className="hall-modal-backdrop" onClick={() => setAmbientNote(null)} role="presentation"><section className="hall-modal conservatory-modal" role="dialog" aria-modal="true" onClick={event => event.stopPropagation()}><button className="hall-modal-close" onClick={() => setAmbientNote(null)} aria-label="Close"><X/></button><p className="kicker">A growing place</p><h2>{ambientNote}</h2><p className="research-body">Notice the conditions here: the light, the shelter and the moisture in the air. The right place will reveal itself through the gardener’s notes.</p><button className="enter-button hall-modal-action" onClick={() => setAmbientNote(null)}><span>Return to the room</span><ArrowRight/></button></section></div>}
    {showSphere && <div className="hall-modal-backdrop sphere-inspect-backdrop" role="presentation" onClick={() => setShowSphere(false)}><section className="hall-modal sphere-inspect-modal" role="dialog" aria-modal="true" aria-labelledby="sphere-inspect-title" onClick={event => event.stopPropagation()}><button className="hall-modal-close" onClick={() => setShowSphere(false)} aria-label="Close"><X/></button><p className="kicker">An instrument of forgotten skies</p><h2 id="sphere-inspect-title">The Celestial Sphere</h2><img src="/manor-conservatory/celestial-sphere-closed.png" alt="A closed ornate celestial sphere"/><p className="research-body">The ancient sphere rests in silence. Tiny constellations trace its burnished surface, their paths crossing in a pattern that almost makes sense. Whatever it keeps within remains undisturbed.</p><button className="enter-button hall-modal-action" onClick={() => setShowSphere(false)}><span>Leave it undisturbed</span><ArrowRight/></button></section></div>}
    {showArtifact && <div className="cabinet-reveal-backdrop conservatory-reveal-backdrop" role="presentation">
      <section className="cabinet-reveal-scene conservatory-reveal-scene" role="dialog" aria-modal="true" aria-labelledby="quill-title">
        <img className="cabinet-reveal-image" src="/manor-conservatory/celestial-sphere-open-quill.png" alt="The celestial sphere has opened to reveal the Archivist’s Quill"/>
        <div className="cabinet-reveal-vignette" aria-hidden="true"/>
        <div className="cabinet-reveal-copy"><p className="kicker">A secret entrusted</p><h2 id="quill-title">Archivist’s Quill</h2>
        <p>The sphere opens, revealing a feather-dark quill, its golden nib still marked with ink. It feels less like a tool than a witness to stories carefully kept.</p>
        <p>As you lift it free, something clicks far away — a small, deliberate sound from somewhere within the Main Hall. A long-sealed door has answered.</p>
        <button className="enter-button" onClick={() => { setArtifactFound(true); onLibraryUnlocked(); setShowArtifact(false) }}><span>Accept the Archivist’s Quill</span><ArrowRight/></button></div>
      </section></div>}
    <div className="conservatory-bottom-mark">EVERY LEAF WAS ONCE A BEGINNING · THE MANOR, UNWRITTEN</div>
  </main>
}
