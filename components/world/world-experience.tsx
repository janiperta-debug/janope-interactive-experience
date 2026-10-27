'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Shield, Sparkles, BookOpen, LockKeyhole, ScanSearch, Check, X } from 'lucide-react'
import { artifacts, discoveries, firstRoom } from '@/content/world'
import { markDiscovered, readDiscoveries } from '@/lib/discovery-state'
import { ArchiveFrame } from '@/components/ui/archive-frame'
import { ConservatoryExperience } from '@/components/world/conservatory-experience'

const artifact = artifacts[0]
const discovery = discoveries.find((item) => item.id === artifact.discoveryId) ?? discoveries[0]

type View = 'arrival' | 'journey' | 'fragment' | 'threshold' | 'room' | 'conservatory' | 'library'
type ResearchPoint = 'portrait' | 'staircase' | 'table' | 'cabinet' | 'seed' | null

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
  const [foundGroups, setFoundGroups] = useState<string[]>([])
  const [selectedTile, setSelectedTile] = useState<number | null>(null)
  const [placedTiles, setPlacedTiles] = useState<(number | null)[]>(Array(9).fill(null))
  const [cabinetSolved, setCabinetSolved] = useState(false)
  const [seedAccepted, setSeedAccepted] = useState(false)

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
    return <ConservatoryExperience onBack={() => setView('room')} onLibrary={() => setView('library')} />
  }

  if (view === 'library') {
    return <main className="conservatory-screen library-unlocked-screen">
      <div className="conservatory-backdrop library-placeholder-backdrop" aria-hidden="true" />
      <header className="conservatory-header"><button className="back-button" onClick={() => setView('conservatory')}><ArrowLeft aria-hidden="true" /><span>Conservatory</span></button><div className="conservatory-title">THE MANOR <i>·</i> LIBRARY</div><div className="conservatory-progress">ROOM UNLOCKED</div></header>
      <section className="library-unlocked-card"><p className="kicker">The next door has opened</p><h1>The Library</h1><p>Within these walls, countless stories are preserved. Knowledge is the key that unlocks every other door.</p><ArchiveFrame weight="thin"><div className="library-placeholder-art"><BookOpen aria-hidden="true"/><span>LIBRARY SCENE ARTWORK PLACEHOLDER</span><small>/manor-library/library-scene.png</small></div></ArchiveFrame><p className="seed-note">The Archivist’s Quill has been added to your collection. The Library’s mystery awaits.</p><button className="enter-button" onClick={() => setView('room')}><span>Return to the Main Hall</span><ArrowRight/></button></section>
    </main>
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
        window.setTimeout(() => { setCabinetSolved(true); setResearchPoint('seed') }, 350)
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
      <div className="main-hall-scene" role="img" aria-label="Main Hall placeholder artwork">
        <div className="main-hall-placeholder">
          <span className="placeholder-moon" />
          <span className="placeholder-window placeholder-window-one" />
          <span className="placeholder-window placeholder-window-two" />
          <span className="placeholder-staircase" />
          <span className="placeholder-pillar" />
          <span className="placeholder-table"><BookOpen aria-hidden="true" /></span>
          <span className="placeholder-cabinet"><LockKeyhole aria-hidden="true" /></span>
          <p>MAIN HALL <small>SCENE ARTWORK PLACEHOLDER</small></p>
        </div>
        <div className="main-hall-vignette" />
        <header className="hall-header">
          <button className="back-button" onClick={() => setView('threshold')} aria-label="Return to the threshold"><ArrowLeft aria-hidden="true" /><span>The Threshold</span></button>
          <div className="hall-title">THE MANOR <i>·</i> MAIN HALL</div>
          <div className="hall-progress">{discoveredTiles.length} <span>/ 9 fragments</span></div>
        </header>
        <button className="hall-hotspot hotspot-portrait" onClick={() => setResearchPoint('portrait')} aria-label="Examine portrait"><span>01</span><b>Portrait</b>{foundGroups.includes('portrait') && <Check aria-hidden="true" />}</button>
        <button className="hall-hotspot hotspot-staircase" onClick={() => setResearchPoint('staircase')} aria-label="Examine staircase stonework"><span>02</span><b>Stonework</b>{foundGroups.includes('staircase') && <Check aria-hidden="true" />}</button>
        <button className="hall-hotspot hotspot-table" onClick={() => setResearchPoint('table')} aria-label="Examine open book"><span>03</span><b>Open book</b>{foundGroups.includes('table') && <Check aria-hidden="true" />}</button>
        <button className={`hall-hotspot hotspot-cabinet ${cabinetSolved ? 'hotspot-complete' : ''}`} onClick={() => setResearchPoint('cabinet')} aria-label="Examine locked cabinet"><span>04</span><b>{cabinetSolved ? 'Cabinet opened' : 'Locked cabinet'}</b>{cabinetSolved ? <Check aria-hidden="true" /> : <LockKeyhole aria-hidden="true" />}</button>
        <aside className="hall-inventory">
          <div className="inventory-heading"><span>Collected fragments</span><b>{discoveredTiles.length} / 9</b></div>
          <div className="inventory-tiles">
            {fragmentTiles.map((filename, index) => {
              const available = discoveredTiles.includes(index)
              return <button key={filename} className={`inventory-tile ${available ? 'tile-available' : ''} ${selectedTile === index ? 'tile-selected' : ''}`} disabled={!available || cabinetSolved} onClick={() => setSelectedTile(selectedTile === index ? null : index)} aria-label={available ? `Select fragment ${index + 1}` : 'Undiscovered fragment'}>
                {available ? <img src={`/manor-puzzle/fragments/${filename}`} alt="" /> : <span>?</span>}
              </button>
            })}
          </div>
          <p>{cabinetSolved ? 'The cabinet has yielded its secret.' : selectedTile !== null ? 'Choose a recess in the cabinet for this fragment.' : 'Investigate the room to find all nine fragments.'}</p>
          <button className="cabinet-open-button" onClick={() => setResearchPoint('cabinet')}><ScanSearch aria-hidden="true" /> Inspect the cabinet</button>
        </aside>
      </div>

      {researchPoint && researchPoint !== 'seed' && <div className="hall-modal-backdrop" role="presentation" onClick={() => setResearchPoint(null)}>
        <section className="hall-modal" role="dialog" aria-modal="true" aria-labelledby="research-title" onClick={(event) => event.stopPropagation()}>
          <button className="hall-modal-close" onClick={() => setResearchPoint(null)} aria-label="Close"><X aria-hidden="true" /></button>
          <p className="kicker">{researchCopy[researchPoint].eyebrow}</p>
          <h2 id="research-title">{researchCopy[researchPoint].title}</h2>
          <img className="hall-detail-image" src={{
            portrait: '/manor-main-hall/portrait-detail.png',
            staircase: '/manor-main-hall/stonework-detail.png',
            table: '/manor-main-hall/open-book-detail.png',
            cabinet: '/manor-main-hall/locked-cabinet-detail.png',
          }[researchPoint]} alt="" />
          <p className="research-body">{researchCopy[researchPoint].body}</p>
          {researchPoint !== 'cabinet' ? <>
            <p className="research-hint">{researchCopy[researchPoint].hint}</p>
            <div className="research-tiles">{researchCopy[researchPoint].tiles.map((index) => <div className="research-tile" key={fragmentTiles[index]}><img src={`/manor-puzzle/fragments/${fragmentTiles[index]}`} alt={`Fragment ${index + 1}`} /><span>Fragment recovered</span></div>)}</div>
            <button className="enter-button hall-modal-action" onClick={() => { collectGroup(researchPoint); setResearchPoint(null) }}><span>{foundGroups.includes(researchPoint) ? 'Return to the hall' : 'Collect the fragments'}</span><ArrowRight aria-hidden="true" /></button>
          </> : <>
            <p className="research-hint">{cabinetSolved ? 'The lock has released.' : selectedTile !== null ? 'Select a square below to place the chosen fragment.' : 'Select a discovered fragment, then choose its place in the frame.'}</p>
            <div className="cabinet-puzzle">
              <div className="cabinet-grid">{placedTiles.map((tile, cell) => <button key={cell} className={`cabinet-cell ${tile !== null ? 'cabinet-cell-filled' : ''} ${selectedTile !== null ? 'cabinet-cell-target' : ''}`} disabled={cabinetSolved || selectedTile === null} onClick={() => placeTile(cell)} aria-label={`Cabinet square ${cell + 1}`}>
                {tile !== null ? <img src={`/manor-puzzle/fragments/${fragmentTiles[tile]}`} alt="" /> : <span>＋</span>}
              </button>)}</div>
              <div className="cabinet-symbol" aria-hidden="true"><span>✧</span></div>
            </div>
            <div className="cabinet-modal-inventory">{fragmentTiles.map((filename, index) => <button key={filename} className={`inventory-tile ${discoveredTiles.includes(index) ? 'tile-available' : ''} ${selectedTile === index ? 'tile-selected' : ''}`} disabled={!discoveredTiles.includes(index) || cabinetSolved} onClick={() => setSelectedTile(selectedTile === index ? null : index)} aria-label={`Select fragment ${index + 1}`}>{discoveredTiles.includes(index) ? <img src={`/manor-puzzle/fragments/${filename}`} alt="" /> : <span>?</span>}</button>)}</div>
            {cabinetSolved && <p className="cabinet-success">The hidden shape is complete. The cabinet opens.</p>}
            <button className="enter-button hall-modal-action" onClick={() => setResearchPoint(null)}><span>Return to the hall</span><ArrowRight aria-hidden="true" /></button>
          </>}
        </section>
      </div>}

      {researchPoint === 'seed' && <div className="hall-modal-backdrop seed-backdrop" role="presentation">
        <section className="hall-modal seed-modal" role="dialog" aria-modal="true" aria-labelledby="seed-title">
          <div className="seed-emblem"><Sparkles aria-hidden="true" /></div>
          <p className="kicker">The first room yields its secret</p>
          <h2 id="seed-title">Seed of Harmony</h2>
          <p className="research-body">Nestled within the cabinet is a delicate object, warm with a light that seems to breathe. The Manor has entrusted you with something that was meant to be found.</p>
          <div className="seed-art-placeholder"><img className="seed-art-image" src="/manor-artifacts/seed-of-harmony.png" alt="Seed of Harmony" /></div>
          <button className="enter-button hall-modal-action" onClick={() => { setSeedAccepted(true); setResearchPoint(null); setView('conservatory') }}><span>{seedAccepted ? 'Return to the hall' : 'Accept the Seed'}</span><ArrowRight aria-hidden="true" /></button>
          <p className="seed-note">The Conservatory remains beyond the next door.</p>
        </section>
      </div>}
    </main>
  )
}
