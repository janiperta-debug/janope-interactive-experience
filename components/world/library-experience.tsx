'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, BookOpen, Check, X } from 'lucide-react'
import { ArchiveFrame } from '@/components/ui/archive-frame'

type ResearchPoint = 'book' | 'backDesk' | 'staircase' | 'bookshelf' | 'leftDesk' | null

const fragments = [
  {
    id: 'raven',
    image: '/manor-library/poem-fragment-1.png',
    text: 'Where roots entwine beneath the stone,\nA silent guardian watches alone.',
    clue: 'The silent guardian belongs where roots and stone meet.',
  },
  {
    id: 'swallow',
    image: '/manor-library/poem-fragment-2.png',
    text: 'Where wandering winds embrace the air,\nA fleeting shadow dances there.',
    clue: 'A fleeting shadow moves with the wandering winds.',
  },
  {
    id: 'eagle',
    image: '/manor-library/poem-fragment-3.png',
    text: 'Where stars look down on realms below,\nA watchful gaze surveys the world.',
    clue: 'The watchful gaze reaches from the highest skies.',
  },
]

const fragmentPoints: Record<'backDesk' | 'staircase' | 'bookshelf', { title: string; body: string; fragment: number; image: string }> = {
  backDesk: {
    title: 'The Writing Desk',
    body: 'Beneath a neat stack of correspondence, a narrow piece of old parchment catches against the wood. Its edges are torn, as though it once belonged to a larger page.',
    fragment: 0,
    image: '/manor-library/back-desk-detail.png',
  },
  staircase: {
    title: 'The Spiral Staircase',
    body: 'A loose ornament in the balustrade reveals a folded scrap of parchment. The ink has faded, but the verse remains legible.',
    fragment: 1,
    image: '/manor-library/spiral-staircase-detail.png',
  },
  bookshelf: {
    title: 'The Bookshelf',
    body: 'A slim volume sits out of line with the others. Between its pages lies a fragment of a handwritten poem.',
    fragment: 2,
    image: '/manor-library/bookshelf-detail.png',
  },
}

export function LibraryExperience({ onBack, onArtifactUnlocked }: { onBack: () => void; onArtifactUnlocked: () => void }) {
  const [point, setPoint] = useState<ResearchPoint>(null)
  const [found, setFound] = useState<number[]>([])
  const [order, setOrder] = useState<(number | null)[]>([null, null, null])
  const [selected, setSelected] = useState<number | null>(null)
  const [solved, setSolved] = useState(false)
  const [reveal, setReveal] = useState(false)
  const [wrongOrder, setWrongOrder] = useState(false)

  const collect = (index: number) => {
    setFound((current) => current.includes(index) ? current : [...current, index])
    setPoint(null)
  }

  const placeFragment = (slot: number) => {
    if (solved) return
    setWrongOrder(false)
    if (selected === null) {
      const existing = order[slot]
      if (existing !== null) {
        setSelected(existing)
        setOrder((current) => current.map((value, index) => index === slot ? null : value))
      }
      return
    }
    setOrder((current) => {
      const next = [...current]
      const previous = next.indexOf(selected)
      if (previous >= 0) next[previous] = null
      next[slot] = selected
      if (next.every((value) => value !== null)) {
        const correct = next[0] === 0 && next[1] === 1 && next[2] === 2
        if (correct) {
          window.setTimeout(() => {
            setSolved(true)
            window.setTimeout(() => setReveal(true), 1800)
          }, 250)
        } else {
          setWrongOrder(true)
        }
      }
      return next
    })
    setSelected(null)
  }

  const closeBook = () => {
    setPoint(null)
    setWrongOrder(false)
  }

  return (
    <main className="conservatory-screen library-screen">
      <div className="library-backdrop" aria-hidden="true" />
      <header className="conservatory-header library-header">
        <button className="back-button" onClick={onBack}><ArrowLeft aria-hidden="true" /><span>Main Hall</span></button>
        <div className="conservatory-title">THE MANOR <i>·</i> LIBRARY</div>
        <div className="conservatory-progress">{found.length} <span>/ 3 FRAGMENTS</span></div>
      </header>

      <div className="library-hotspots" aria-label="Library research points">
        <button className={`library-hotspot library-hotspot-book ${solved ? 'is-complete' : ''}`} onClick={() => setPoint('book')} aria-label="Examine the open book"><span>1</span></button>
        <button className={`library-hotspot library-hotspot-back-desk ${found.includes(0) ? 'is-complete' : ''}`} onClick={() => setPoint('backDesk')} aria-label="Examine the back writing desk"><span>2</span></button>
        <button className={`library-hotspot library-hotspot-staircase ${found.includes(1) ? 'is-complete' : ''}`} onClick={() => setPoint('staircase')} aria-label="Examine the spiral staircase"><span>3</span></button>
        <button className={`library-hotspot library-hotspot-bookshelf ${found.includes(2) ? 'is-complete' : ''}`} onClick={() => setPoint('bookshelf')} aria-label="Examine the right bookshelf"><span>4</span></button>
        <button className={`library-hotspot library-hotspot-left-desk ${reveal ? 'is-complete' : ''}`} onClick={() => setPoint('leftDesk')} aria-label="Examine the left writing desk"><span>5</span></button>
      </div>
      <div className="library-tuning-note">LIBRARY · HOTSPOT PLACEMENT MODE</div>

      {point && <div className="hall-modal-backdrop library-modal-backdrop" role="presentation" onClick={() => setPoint(null)}>
        <section className="hall-modal library-modal" role="dialog" aria-modal="true" aria-labelledby="library-modal-title" onClick={(event) => event.stopPropagation()}>
          <button className="hall-modal-close" onClick={() => setPoint(null)} aria-label="Close"><X aria-hidden="true" /></button>
          {point === 'book' ? <>
            <p className="kicker">LIBRARY · THE MISSING PAGE</p>
            <h2 id="library-modal-title">The Three Watchers</h2>
            <div className="library-book-layout">
              <img className="library-book-detail" src="/manor-library/open-book-detail.png" alt="An old open book with a page missing" />
              <div className="library-book-clue">
                <p>Three verses have been torn from the book. Their meaning is incomplete, but the original page offers a clue.</p>
                <img src="/manor-library/bird-order-illustration.png" alt="A raven near the earth, a swallow in the middle air, and an eagle high above" />
                <blockquote>“Read the watchers as they rise, from the silent earth to the endless sky.”</blockquote>
              </div>
            </div>
            <p className="library-puzzle-instruction">Place the recovered verses in the order shown by the illustration, from the lowest watcher to the highest.</p>
            <div className="library-assembly">
              {order.map((fragmentIndex, slot) => <button key={slot} className={`library-assembly-slot ${fragmentIndex !== null ? 'has-fragment' : ''} ${selected !== null ? 'slot-ready' : ''}`} onClick={() => placeFragment(slot)} disabled={solved || selected === null} aria-label={`Place verse in position ${slot + 1}`}>
                {fragmentIndex === null ? <span>{['I · LOWEST','II · MIDDLE','III · HIGHEST'][slot]}</span> : <span className="library-verse-preview">{fragments[fragmentIndex].text}</span>}
              </button>)}
            </div>
            <div className="library-fragment-inventory">
              {found.map((index) => order.includes(index) ? null : <button key={index} className={`library-fragment-card ${selected === index ? 'selected' : ''}`} onClick={() => setSelected(selected === index ? null : index)} disabled={solved}>
                <img src={fragments[index].image} alt={`Recovered poem fragment ${index + 1}`} />
                <span>{selected === index ? 'SELECTED' : 'SELECT VERSE'}</span>
              </button>)}
            </div>
            {wrongOrder && <p className="library-wrong-order">The verses do not yet follow the order of the watchers. Study the illustration again.</p>}
            {solved && <p className="library-solved-note"><Check aria-hidden="true" /> The missing page has been restored.</p>}
            <button className="enter-button hall-modal-action" onClick={closeBook}><span>Close the book</span><ArrowRight aria-hidden="true" /></button>
          </> : point === 'leftDesk' ? <>
            <p className="kicker">LIBRARY · THE WRITING DESK</p>
            <h2 id="library-modal-title">A Sealed Drawer</h2>
            <img className="library-point-detail" src="/manor-library/writing-desk-detail.png" alt="An ornate antique writing desk" />
            <p className="research-body">{solved ? 'A faint mark has appeared on the drawer, matching the symbol revealed on the restored page. The lock is no longer holding.' : 'The desk is beautifully made, but its central drawer is sealed. A small emblem is carved into the brass escutcheon.'}</p>
            <button className="enter-button hall-modal-action" onClick={() => setPoint(null)}><span>Return to the library</span><ArrowRight aria-hidden="true" /></button>
          </> : <>
            <p className="kicker">LIBRARY · RESEARCH POINT</p>
            <h2 id="library-modal-title">{fragmentPoints[point].title}</h2>
            <div className="library-discovery-layout">
              <img className="library-point-detail" src={fragmentPoints[point].image} alt="" />
              <div>
                <p className="research-body">{fragmentPoints[point].body}</p>
                <div className="library-found-fragment">
                  <img src={fragments[fragmentPoints[point].fragment].image} alt="A recovered fragment of the poem" />
                  <span>THE THREE WATCHERS · FRAGMENT RECOVERED</span>
                </div>
                <button className="enter-button hall-modal-action" onClick={() => collect(fragmentPoints[point].fragment)}><span>{found.includes(fragmentPoints[point].fragment) ? 'Return to the library' : 'Collect the fragment'}</span><ArrowRight aria-hidden="true" /></button>
              </div>
            </div>
          </>}
        </section>
      </div>}

      {reveal && <div className="cabinet-reveal-backdrop library-reveal-backdrop">
        <section className="cabinet-reveal-scene library-reveal-scene" role="dialog" aria-modal="true" aria-labelledby="library-reveal-title">
          <img className="cabinet-reveal-image" src="/manor-library/writing-desk-open-artifact.png" alt="The writing desk drawer opens to reveal an artifact" />
          <div className="cabinet-reveal-vignette" aria-hidden="true" />
          <div className="cabinet-reveal-copy">
            <p className="kicker">THE LIBRARY HAS REVEALED ITS SECRET</p>
            <h2 id="library-reveal-title">The page remembers.</h2>
            <p>The verses have found their place. Somewhere in the old desk, a hidden mechanism answers. The drawer opens, revealing an artifact entrusted to the next part of your journey.</p>
            <img className="library-artifact-reveal" src="/manor-library/library-artifact.png" alt="The artifact discovered in the Library" />
            <button className="enter-button" onClick={onArtifactUnlocked}><span>Receive the artifact</span><ArrowRight aria-hidden="true" /></button>
          </div>
        </section>
      </div>}
    </main>
  )
}
