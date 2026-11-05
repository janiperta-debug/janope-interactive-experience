'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Shield, Sparkles, BookOpen, LockKeyhole, ScanSearch, Check, X } from 'lucide-react'
import { artifacts, discoveries, firstRoom } from '@/content/world'
import { markDiscovered, readDiscoveries } from '@/lib/discovery-state'
import { ArchiveFrame } from '@/components/ui/archive-frame'
import { ConservatoryExperience } from '@/components/world/conservatory-experience'
import { LibraryExperience } from '@/components/world/library-experience'
import { ClockTowerExperience } from '@/components/world/clock-tower-experience'
import { UndergroundTempleExperience } from '@/components/world/underground-temple-experience'

const artifact = artifacts[0]
const discovery = discoveries.find((item) => item.id === artifact.discoveryId) ?? discoveries[0]

type View = 'arrival' | 'journey' | 'fragment' | 'threshold' | 'room' | 'conservatory' | 'library' | 'clockTower' | 'undergroundTemple'
type ResearchPoint = 'portrait' | 'staircase' | 'table' | 'cabinet' | 'seed' | null
type AmbientPoint = 'chandelier' | 'leftPlant' | 'crest' | 'window' | 'chair' | 'sofa' | null

const ambientCopy: Record<Exclude<AmbientPoint, null>, { title: string; body: string }> = {
  chandelier: { title: 'The Chandelier', body: 'Hundreds of small flames shimmer in the crystalwork. The brass frame bears the soft patina of generations of quiet evenings.' },
  leftPlant: { title: 'The Potted Fern', body: 'A broad-leafed plant stands beside the stairs, thriving in the warm, still air. Dust gathers on the rim of its heavy stone pot.' },
  crest: { title: 'The Manor Crest', body: 'A crowned lion is woven into the old hanging. Its colours have faded, but the emblem remains unmistakable.' },
  window: { title: 'The Tall Windows', body: 'Late light pours through the leaded glass. Beyond the windows, the distant rooftops disappear into a pale haze.' },
  chair: { title: 'The Reading Chair', body: 'The leather has softened with age and use. The chair faces the table, as though someone has just risen from it.' },
  sofa: { title: 'The Drawing-room Sofa', body: 'The dark leather sofa sits beneath the windows. Its worn arms and deep cushions suggest long conversations held here.' },
}

const fragmentTiles = [
  'manor_fragment_x6p2.png', 'manor_fragment_k8v3.png', 'manor_fragment_m4x9.png',
  'manor_fragment_r5t2.png', 'manor_fragment_b9n4.png', 'manor_fragment_743g.png',
  'manor_fragment_q7m2.png', 'manor_fragment_t3w8.png', 'manor_fragment_p2w6.png',
]
const researchCopy: Record<Exclude<ResearchPoint, null | 'seed'>, { title: string; eyebrow: string; body: string; hint: string; tiles: number[] }> = {
  portrait: { title: 'The Portrait', eyebrow: 'Research point 01', body: 'The portrait watches over the landing. The frame is older than the room around it, and faint marks catch the light beneath the varnish.', hint: 'Three fragments rest in the portrait frame.', tiles: [0, 1, 2] },
  staircase: { title: 'The Stonework', eyebrow: 'Research point 02', body: 'The carved pillar bears a pattern that continues across its worn edges. Someone once meant these marks to be read together.', hint: 'Three fragments are hidden among the carvings.', tiles: [3, 4, 5] },
  table: { title: 'The Open Book', eyebrow: 'Research point 03', body: 'The book lies open as if its reader has only just stepped away. The page is blank, save for the impression of something pressed against it.', hint: 'Three fragments have been left between the pages.', tiles: [6, 7, 8] },
  cabinet: { title: 'The Locked Cabinet', eyebrow: 'Research point 04', body: 'Nine empty recesses surround a sealed central panel. Their edges are worn smooth, as though the pieces have been handled many times.', hint: 'Arrange all nine fragments to reveal the shape the Manor has hidden.', tiles: [] },
}

export function WorldExperience() {
  const [view, setView] = useState<View>('arrival')
  const [isOpen, setIsOpen] = useState(false)
  const [discovered, setDiscovered] = useState<string[]>([])
  const [reducedMotion, setReducedMotion] = useState(false)
  const [researchPoint, setResearchPoint] = useState<ResearchPoint>(null)
  const [ambientPoint, setAmbientPoint] = useState<AmbientPoint>(null)
  const [foundGroups, setFoundGroups] = useState<string[]>([])
  const [selectedTile, setSelectedTile] = useState<number | null>(null)
  const [placedTiles, setPlacedTiles] = useState<(number | null)[]>(Array(9).fill(null))
  const [cabinetSolved, setCabinetSolved] = useState(false)
  const [cabinetReveal, setCabinetReveal] = useState(false)
  const [seedAccepted, setSeedAccepted] = useState(false)
  const [libraryUnlocked, setLibraryUnlocked] = useState(false)
  const [clockTowerUnlocked, setClockTowerUnlocked] = useState(false)
  const [undergroundTempleUnlocked, setUndergroundTempleUnlocked] = useState(false)

  useEffect(() => {
    setDiscovered(readDiscoveries())
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    if (view !== 'journey') return
    const duration = reducedMotion ? 0 : 21000
    const timer = window.setTimeout(() => setView('fragment'), duration)
    return () => window.clearTimeout(timer)
  }, [view, reducedMotion])

  const acceptFragment = () => {
    setDiscovered(markDiscovered(artifact.id))
    setView('threshold')
  }

  const skipArrival = () => setView('fragment')

  if (view === 'arrival' || view === 'journey') {
    const journeyStarted = view === 'journey'
    return (
      <main className={`arrival-screen ${journeyStarted ? 'journey-screen journey-started' : ''}`}>
        <div className="arrival-image" aria-hidden="true" />
        {journeyStarted && <>
          <div className="arrival-image journey-stage journey-stage-approach" aria-hidden="true" />
          <div className="arrival-image journey-stage journey-stage-entrance" aria-hidden="true" />
        </>}
        <div className={`arrival-vignette ${journeyStarted ? 'journey-vignette' : ''}`} aria-hidden="true" />
        {!journeyStarted && <>
          <header className="site-mark"><span className="mark-glyph">M</span><span>Janope</span></header>
          <div className="arrival-content">
            <p className="arrival-crest" aria-hidden="true">♔</p>
            <p className="kicker">An interactive mystery</p>
            <img className="arrival-logo" src="/brand/the-manor-unwritten.png" alt="The Manor — Unwritten" />
            <div className="arrival-divider" aria-hidden="true" />
            <p className="arrival-copy">Every place holds a story.<br />Every discovery reveals a deeper truth.<br />And some answers are still unwritten.</p>
            <ArchiveFrame weight="thin" cornerSize="sm" className="enter-frame"><button className="enter-button enter-button--framed" onClick={() => setView('journey')}>
              <span>Enter the manor</span><ArrowRight aria-hidden="true" />
            </button></ArchiveFrame>
          </div>
          <div className="arrival-footer"><span>THE MANOR · UNWRITTEN</span><span>01 / 07</span></div>
        </>}
        {journeyStarted && <>
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
        </>}
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
          <div className="fragment-art">
            <img className="first-fragment-image" src="/manor-arrival/first-fragment.png" alt="A weathered metal fragment bearing the Manor's crest" />
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
        <ArchiveFrame className="threshold-card" weight="hairline" corners cornerSize="sm">
          <p className="kicker">The Manor remembers</p>
          <div className="threshold-mark"><Sparkles aria-hidden="true" /></div>
          <h1>A fragment has been entrusted to you.</h1>
          <p>You do not yet know what it belongs to, or why it was given.</p>
          <p>There will be time for questions. For now, the Manor awaits.</p>
          <button className="enter-button" onClick={() => setView('room')}>
            <span>Enter the Main Hall</span><ArrowRight aria-hidden="true" />
          </button>
        </ArchiveFrame>
      </main>
    )
  }

  if (view === 'conservatory') {
    return <ConservatoryExperience onBack={() => setView('room')} onLibrary={() => setView('library')} onLibraryUnlocked={() => setLibraryUnlocked(true)} />
  }

  if (view === 'clockTower') {
    return <ClockTowerExperience onBack={() => setView('room')} onArtifactUnlocked={() => { setUndergroundTempleUnlocked(true); setView('room') }} />
  }

  if (view === 'undergroundTemple') {
    return <UndergroundTempleExperience onBack={() => setView('room')} />
  }

  if (view === 'library') {
    return <LibraryExperience onBack={() => setView('room')} onArtifactUnlocked={() => { setClockTowerUnlocked(true); setView('room') }} />
  }

  const collectGroup = (group: 'portrait' | 'staircase' | 'table') => {
    setFoundGroups((current) => current.includes(group) ? current : [...current, group])
  }

  // Plates 1 and 7 are intentionally exchanged: plate 7 belongs in slot 1,
  // and plate 1 belongs in slot 7.
  const correctPlateOrder = [6, 1, 2, 3, 4, 5, 0, 7, 8]
  const placeTile = (cell: number) => {
    if (selectedTile === null || cabinetSolved) return
    setPlacedTiles((current) => {
      const next = [...current]
      const previousCell = next.indexOf(selectedTile)
      if (previousCell >= 0) next[previousCell] = null
      next[cell] = selectedTile
      if (next.every((tile, index) => tile === correctPlateOrder[index])) {
        window.setTimeout(() => {
          setCabinetSolved(true)
          window.setTimeout(() => setCabinetReveal(true), 3400)
        }, 250)
      }
      return next
    })
    setSelectedTile(null)
  }

  const discoveredTiles = [
    ...(foundGroups.includes('portrait') ? [0, 1, 2] : []),
    ...(foundGroups.includes('staircase') ? [3, 4, 5] : []),
    ...(foundGroups.includes('table') ? [6, 7, 8] : []),
  ]

  return (
    <main className="main-hall-screen">
      <div className="main-hall-scene">
        <img className="main-hall-background" src="/manor-main-hall/main-hall.png" alt="The Manor's Main Hall" />
        <div className="main-hall-vignette" aria-hidden="true" />
        <header className="hall-header">
          <button className="back-button" onClick={() => setView('threshold')} aria-label="Return to the threshold"><ArrowLeft aria-hidden="true" /><span>The Threshold</span></button>
          <div className="hall-title">THE MANOR <i>·</i> MAIN HALL</div>
          {seedAccepted || libraryUnlocked ? <nav className="hall-room-list" aria-label="Unlocked rooms">{seedAccepted && <button className="hall-room-unlock" onClick={() => setView('conservatory')}><Sparkles aria-hidden="true" /><span>Enter the Conservatory</span><ArrowRight aria-hidden="true" /></button>}{libraryUnlocked && <button className="hall-room-unlock" onClick={() => setView('library')}><BookOpen aria-hidden="true" /><span>Enter the Library</span><ArrowRight aria-hidden="true" /></button>}{clockTowerUnlocked && <button className="hall-room-unlock" onClick={() => setView('clockTower')}><Sparkles aria-hidden="true" /><span>Enter the Clock Tower</span><ArrowRight aria-hidden="true" /></button>}{undergroundTempleUnlocked && <button className="hall-room-unlock" onClick={() => setView('undergroundTemple')}><LockKeyhole aria-hidden="true" /><span>Enter the Temple</span><ArrowRight aria-hidden="true" /></button>}</nav> : <div className="hall-progress">{discoveredTiles.length} <span>/ 9 fragments</span></div>}
        </header>
        <button className={`hall-hotspot hotspot-portrait ${foundGroups.includes('portrait') ? 'hotspot-complete' : ''}`} onClick={() => setResearchPoint('portrait')} aria-label="Examine portrait"><span aria-hidden="true">X</span></button>
        <button className={`hall-hotspot hotspot-staircase ${foundGroups.includes('staircase') ? 'hotspot-complete' : ''}`} onClick={() => setResearchPoint('staircase')} aria-label="Examine staircase stonework"><span aria-hidden="true">X</span></button>
        <button className={`hall-hotspot hotspot-table ${foundGroups.includes('table') ? 'hotspot-complete' : ''}`} onClick={() => setResearchPoint('table')} aria-label="Examine open book"><span aria-hidden="true">X</span></button>
        <button className={`hall-hotspot hotspot-cabinet ${cabinetSolved ? 'hotspot-complete' : ''}`} onClick={() => setResearchPoint('cabinet')} aria-label="Examine locked cabinet"><span aria-hidden="true">X</span></button>
        <button className="hall-hotspot hotspot-chandelier" onClick={() => setAmbientPoint('chandelier')} aria-label="Examine chandelier"><span aria-hidden="true">X</span></button>
        <button className="hall-hotspot hotspot-left-plant" onClick={() => setAmbientPoint('leftPlant')} aria-label="Examine potted fern"><span aria-hidden="true">X</span></button>
        <button className="hall-hotspot hotspot-crest" onClick={() => setAmbientPoint('crest')} aria-label="Examine Manor crest"><span aria-hidden="true">X</span></button>
        <button className="hall-hotspot hotspot-window" onClick={() => setAmbientPoint('window')} aria-label="Examine tall windows"><span aria-hidden="true">X</span></button>
        <button className="hall-hotspot hotspot-chair" onClick={() => setAmbientPoint('chair')} aria-label="Examine reading chair"><span aria-hidden="true">X</span></button>
        <button className="hall-hotspot hotspot-sofa" onClick={() => setAmbientPoint('sofa')} aria-label="Examine drawing-room sofa"><span aria-hidden="true">X</span></button>

      </div>

      {ambientPoint && <div className="hall-modal-backdrop" role="presentation" onClick={() => setAmbientPoint(null)}>
        <section className="hall-modal ambient-modal" role="dialog" aria-modal="true" aria-labelledby="ambient-title" onClick={(event) => event.stopPropagation()}>
          <button className="hall-modal-close" onClick={() => setAmbientPoint(null)} aria-label="Close"><X aria-hidden="true" /></button>
          <p className="kicker">MAIN HALL · OBSERVATION</p>
          <h2 id="ambient-title">{ambientCopy[ambientPoint].title}</h2>
          <p className="research-body">{ambientCopy[ambientPoint].body}</p>
          <button className="enter-button hall-modal-action" onClick={() => setAmbientPoint(null)}><span>Return to the hall</span><ArrowRight aria-hidden="true" /></button>
        </section>
      </div>}

      {researchPoint && researchPoint !== 'seed' && <div className="hall-modal-backdrop" role="presentation" onClick={() => setResearchPoint(null)}>
        <section className={`hall-modal ${researchPoint === 'cabinet' ? 'cabinet-modal' : 'research-modal'}`} role="dialog" aria-modal="true" aria-labelledby="research-title" onClick={(event) => event.stopPropagation()}>
          <button className="hall-modal-close" onClick={() => setResearchPoint(null)} aria-label="Close"><X aria-hidden="true" /></button>
          <p className="kicker">{researchCopy[researchPoint].eyebrow}</p>
          <h2 id="research-title">{researchCopy[researchPoint].title}</h2>
          {researchPoint !== 'cabinet' ? <>
            <div className="research-card-layout">
              <div className="research-visual-column">
                <img className="hall-detail-image" src={{
                  portrait: '/manor-main-hall/portrait-detail.png',
                  staircase: '/manor-main-hall/stonework-detail.png',
                  table: '/manor-main-hall/open-book-detail.png',
                }[researchPoint]} alt="" />
                <div className="research-tiles">{researchCopy[researchPoint].tiles.map((index) => <div className="research-tile" key={fragmentTiles[index]}><img src={`/manor-puzzle/fragments/${fragmentTiles[index]}`} alt={`Fragment ${index + 1}`} /><span>Fragment recovered</span></div>)}</div>
              </div>
              <div className="research-copy-column">
                <p className="research-body">{researchCopy[researchPoint].body}</p>
                <p className="research-hint">{researchCopy[researchPoint].hint}</p>
                <button className="enter-button hall-modal-action" onClick={() => { collectGroup(researchPoint); setResearchPoint(null) }}><span>{foundGroups.includes(researchPoint) ? 'Return to the hall' : 'Collect the fragments'}</span><ArrowRight aria-hidden="true" /></button>
              </div>
            </div>
          </> : <>
            <div className="cabinet-puzzle-layout">
              <div className="cabinet-modal-inventory cabinet-inventory-left">{fragmentTiles.slice(0, 5).map((filename, index) => ({ filename, index })).filter(({ index }) => discoveredTiles.includes(index) && !placedTiles.includes(index)).map(({ filename, index }) => <button key={filename} className={`inventory-tile tile-available ${selectedTile === index ? 'tile-selected' : ''}`} disabled={cabinetSolved} onClick={() => setSelectedTile(selectedTile === index ? null : index)} aria-label={`Select fragment ${index + 1}`}><img src={`/manor-puzzle/fragments/${filename}`} alt="" /></button>)}</div>
              <div className={`cabinet-artboard ${cabinetSolved ? 'cabinet-artboard-awakened' : ''}`}>
                <img className="cabinet-artwork" src="/manor-main-hall/locked-cabinet-detail.png" alt="The ornate cabinet with its nine-square puzzle" />
                <div className="cabinet-overlay-grid">{placedTiles.map((tile, cell) => <button key={cell} className={`cabinet-overlay-cell ${tile !== null ? 'cabinet-overlay-cell-filled' : ''} ${selectedTile !== null ? 'cabinet-overlay-cell-target' : ''}`} disabled={cabinetSolved || selectedTile === null} onClick={() => placeTile(cell)} aria-label={`Cabinet square ${cell + 1}`}>
                  {tile !== null && <img src={`/manor-puzzle/fragments/${fragmentTiles[tile]}`} alt="" />}
                </button>)}</div>
              </div>
              <div className="cabinet-modal-inventory cabinet-inventory-right">{fragmentTiles.slice(5).map((filename, offset) => ({ filename, index: offset + 5 })).filter(({ index }) => discoveredTiles.includes(index) && !placedTiles.includes(index)).map(({ filename, index }) => <button key={filename} className={`inventory-tile tile-available ${selectedTile === index ? 'tile-selected' : ''}`} disabled={cabinetSolved} onClick={() => setSelectedTile(selectedTile === index ? null : index)} aria-label={`Select fragment ${index + 1}`}><img src={`/manor-puzzle/fragments/${filename}`} alt="" /></button>)}</div>
            </div>
            {cabinetSolved && !cabinetReveal && <p className="cabinet-success cabinet-success-awakened">The hidden shape begins to glow…</p>}
          </>}
        </section>
      </div>}

      {cabinetReveal && <div className="cabinet-reveal-backdrop" role="presentation"><section className="cabinet-reveal-scene" role="dialog" aria-modal="true" aria-labelledby="cabinet-reveal-title"><img className="cabinet-reveal-image" src="/manor-main-hall/cabinet-open-seed.png" alt="The cabinet stands open, revealing the Seed of Harmony" /><div className="cabinet-reveal-vignette" aria-hidden="true" /><div className="cabinet-reveal-copy"><p className="kicker">The cabinet opens</p><h2 id="cabinet-reveal-title">Some things are kept until the right moment.</h2><p>Behind the carved doors, a small light stirs. A seed rests within the darkened cabinet, warm with a light that seems to breathe. The Manor has entrusted you with something that was meant to be found.</p><button className="enter-button" onClick={() => { setCabinetReveal(false); setResearchPoint('seed') }}><span>Discover what was hidden</span><ArrowRight aria-hidden="true" /></button></div></section></div>}\n\n      {researchPoint === 'seed' && <div className="hall-modal-backdrop seed-backdrop" role="presentation">
        <section className="hall-modal seed-modal" role="dialog" aria-modal="true" aria-labelledby="seed-title">
          <div className="seed-emblem"><Sparkles aria-hidden="true" /></div>
          <p className="kicker">The first room yields its secret</p>
          <h2 id="seed-title">Seed of Harmony</h2>
          <p className="research-body">Nestled within the cabinet is a delicate object, warm with a light that seems to breathe. The Manor has entrusted you with something that was meant to be found.</p>
          <div className="seed-art-placeholder"><img className="seed-art-image" src="/manor-artifacts/seed-of-harmony.png" alt="Seed of Harmony" /></div>
          <button className="enter-button hall-modal-action" onClick={() => { setSeedAccepted(true); setResearchPoint(null); setView('room') }}><span>{seedAccepted ? 'Return to the hall' : 'Accept the Seed'}</span><ArrowRight aria-hidden="true" /></button>
          <p className="seed-note">The Conservatory remains beyond the next door.</p>
        </section>
      </div>}
    </main>
  )
}
