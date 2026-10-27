'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, Leaf, Sun, Droplets, Wind, LockKeyhole, Check, X, Sparkles } from 'lucide-react'
import { ArchiveFrame } from '@/components/ui/archive-frame'

type PlantId = 'silverleaf' | 'moonfern' | 'amberbell'
type PlaceId = 'sunroom' | 'stillcorner' | 'fountain'
type Plant = { id: PlantId; name: string; note: string; detail: string }
type Place = { id: PlaceId; name: string; description: string; symbol: string }

const plants: Plant[] = [
  { id: 'silverleaf', name: 'Silverleaf', note: 'Its pale leaves hold their colour even after long days. The gardener’s note mentions that its roots prefer a steady rhythm, undisturbed by sudden changes.', detail: 'A quiet, silver-green plant. The note beside it speaks of consistency and a dislike of abrupt changes, but says little about light.' },
  { id: 'moonfern', name: 'Moon Fern', note: 'The fronds open slowly. A margin note observes that it has always grown best where the day passes without drawing attention to itself.', detail: 'Its fine fronds are delicate but healthy. A short note refers to the gentler hours of the day and a place where the light does not linger.' },
  { id: 'amberbell', name: 'Amber Bell', note: 'Small bells gather along its stems. The gardener writes that it responds to the world around it, though not always at once.', detail: 'The plant seems unremarkable at first glance. Its notes mention warmth, patience and the importance of noticing changes over time.' },
]
const places: Place[] = [
  { id: 'sunroom', name: 'The Sunlit Atrium', description: 'A bright stretch of glass. Light moves across the stone here for much of the day.', symbol: '☼' },
  { id: 'stillcorner', name: 'The Still Corner', description: 'A sheltered alcove beneath climbing leaves, away from the busiest paths.', symbol: '❧' },
  { id: 'fountain', name: 'The Fountain Walk', description: 'Cool air drifts from the water. The stone stays damp long after the sun has moved on.', symbol: '♧' },
]
// The answer is based on relationships between the notes and the locations, not visible plant damage.
const solution: Record<PlantId, PlaceId> = { silverleaf: 'fountain', moonfern: 'stillcorner', amberbell: 'sunroom' }

export function ConservatoryExperience({ onBack, onLibrary }: { onBack: () => void; onLibrary: () => void }) {
  const [positions, setPositions] = useState<Record<PlantId, PlaceId>>({ silverleaf: 'sunroom', moonfern: 'fountain', amberbell: 'stillcorner' })
  const [selectedPlant, setSelectedPlant] = useState<PlantId | null>(null)
  const [inspecting, setInspecting] = useState<PlantId | null>(null)
  const [solved, setSolved] = useState(false)
  const [artifactFound, setArtifactFound] = useState(false)
  const [showArtifact, setShowArtifact] = useState(false)
  const [transitioning, setTransitioning] = useState(false)

  const movePlant = (placeId: PlaceId) => {
    if (!selectedPlant || solved) return
    const occupant = (Object.entries(positions) as [PlantId, PlaceId][]).find(([, place]) => place === placeId)?.[0]
    setPositions(current => {
      const next = { ...current }
      const oldPlace = next[selectedPlant]
      if (occupant) next[occupant] = oldPlace
      next[selectedPlant] = placeId
      return next
    })
    setSelectedPlant(null)
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
      <div className="conservatory-note-panel">
        <p className="kicker">The Gardener’s notes</p>
        <p>Three plants have been left where they were last tended. Their leaves offer no clear answer. Read what was written, observe the places around them, and decide what each one needs.</p>
        <div className="conservatory-instruction"><Leaf aria-hidden="true" /><span>{selectedPlant ? 'Choose a place to move the selected plant.' : 'Select a plant to study it, then choose where it should grow.'}</span></div>
      </div>
      <div className="plant-study-grid">
        {plants.map((plant, index) => <button key={plant.id} className={`plant-study-card ${selectedPlant === plant.id ? 'plant-selected' : ''} ${solved ? 'plant-settled' : ''}`} onClick={() => { if (!solved) setSelectedPlant(selectedPlant === plant.id ? null : plant.id); setInspecting(plant.id) }}>
          <span className={`plant-illustration plant-illustration-${index + 1}`}><i /><i /><i /><b>✦</b></span>
          <span className="plant-card-index">SPECIMEN 0{index + 1}</span>
          <strong>{plant.name}</strong>
          <span className="plant-current-place">{places.find(place => place.id === positions[plant.id])?.name}</span>
          <span className="plant-card-action">{solved ? <><Check size={14}/> Settled</> : 'Study specimen →'}</span>
        </button>)}
      </div>
      <div className="conservatory-places">
        <div className="conservatory-section-heading"><span>Places within the conservatory</span><span>{selectedPlant ? `Moving: ${plants.find(p => p.id === selectedPlant)?.name}` : 'Choose a place'}</span></div>
        <div className="place-grid">
          {places.map((place, index) => {
            const plant = plants.find(p => positions[p.id] === place.id)
            return <button key={place.id} className={`plant-place place-${index + 1} ${selectedPlant ? 'place-target' : ''} ${solved ? 'place-solved' : ''}`} onClick={() => movePlant(place.id)} disabled={!selectedPlant || solved}>
              <span className="place-symbol">{place.symbol}</span><strong>{place.name}</strong><span>{place.description}</span>
              <span className="place-occupant">{plant ? <><Leaf size={14}/>{plant.name}</> : 'Undisturbed'}</span>
            </button>
          })}
        </div>
      </div>
      <div className="conservatory-footer">
        <span className="conservatory-footer-note">{solved ? 'The room has found its balance.' : 'The right conditions are rarely the loudest ones.'}</span>
        <button className="enter-button conservatory-check" onClick={checkArrangement} disabled={solved}><span>{solved ? 'The arrangement is complete' : 'Reflect on the arrangement'}</span>{solved ? <Check/> : <ArrowRight/>}</button>
      </div>
    </section>
    {inspecting && <div className="hall-modal-backdrop" onClick={() => setInspecting(null)} role="presentation}>
      <section className="hall-modal conservatory-modal" role="dialog" aria-modal="true" aria-labelledby="plant-modal-title" onClick={event => event.stopPropagation()}>
        <button className="hall-modal-close" onClick={() => setInspecting(null)} aria-label="Close"><X/></button>
        <p className="kicker">The Gardener’s field notes</p><h2 id="plant-modal-title">{plants.find(p => p.id === inspecting)?.name}</h2>
        <p className="research-body">{plants.find(p => p.id === inspecting)?.detail}</p>
        <div className="plant-note-card"><Leaf/><p>{plants.find(p => p.id === inspecting)?.note}</p></div>
        <button className="enter-button hall-modal-action" onClick={() => { setSelectedPlant(inspecting); setInspecting(null) }}><span>Choose this plant</span><ArrowRight/></button>
      </section>
    </div>}
    {showArtifact && <div className="hall-modal-backdrop seed-backdrop" role="presentation">
      <section className="hall-modal seed-modal conservatory-artifact" role="dialog" aria-modal="true" aria-labelledby="quill-title">
        <div className="seed-emblem"><Sparkles/></div><p className="kicker">The hidden compartment opens</p>
        <h2 id="quill-title">Archivist’s Quill</h2>
        <p className="research-body">Behind the old planting ledger lies a feather-dark quill, its golden nib still marked with ink. It feels less like a tool than a witness to stories carefully kept.</p>
        <div className="quill-art-placeholder"><span>✒</span><b>ARCHIVIST’S QUILL</b><small>ARTWORK PLACEHOLDER · /manor-artifacts/archivists-quill.png</small></div>
        <p className="seed-note">A new room waits beyond the Conservatory.</p>
        <button className="enter-button hall-modal-action" onClick={() => { setArtifactFound(true); setShowArtifact(false); setTransitioning(true); window.setTimeout(onLibrary, 1200) }}><span>{artifactFound ? 'Continue to the Library' : 'Keep the artefact and continue'}</span><ArrowRight/></button>
      </section>
    </div>}
    {transitioning && <div className="manor-room-transition" aria-live="polite"><span>THE MANOR REMEMBERS</span><strong>The next door is ready to open.</strong><i/></div>}
    <div className="conservatory-bottom-mark">EVERY LEAF WAS ONCE A BEGINNING · THE MANOR, UNWRITTEN</div>
  </main>
}
