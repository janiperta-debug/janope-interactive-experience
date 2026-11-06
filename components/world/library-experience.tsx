'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, BookOpen, Check, X } from 'lucide-react'
import { ArchiveFrame } from '@/components/ui/archive-frame'

type ResearchPoint = 'book' | 'backDesk' | 'staircase' | 'bookshelf' | 'readingChair' | 'globe' | 'window' | null

const fragments = [
  {
    id: 'eagle',
    image: '/manor-library/poem-fragment-1.png',
    text: 'Where stars look down on realms below,\nA watchful gaze surveys the world.',
    clue: 'The watchful gaze reaches from the highest skies.',
  },
  {
    id: 'swallow',
    image: '/manor-library/poem-fragment-2.png',
    text: 'Where wandering winds embrace the air,\nA fleeting shadow dances there.',
    clue: 'A fleeting shadow moves with the wandering winds.',
  },
  {
    id: 'raven',
    image: '/manor-library/poem-fragment-3.png',
    text: 'Where roots entwine beneath the stone,\nA silent guardian watches alone.',
    clue: 'The silent guardian belongs where roots and stone meet.',
  },
]

const ambientPoints: Record<'readingChair' | 'globe' | 'window', { title: string; body: string }> = {
  readingChair: {
    title: 'The Reading Chair',
    body: 'The leather is worn smooth at the arms, and a narrow ribbon rests between the cushions. Someone seems to have left a book here in the middle of a thought. There is nothing to take, but the quiet corner feels well used.',
  },
  globe: {
    title: 'The Brass Globe',
    body: 'A brass meridian circles the old globe. The countries are drawn with a careful hand, though several names have faded almost beyond reading. It turns with a soft, measured movement before settling again.',
  },
  window: {
    title: 'The Tall Window',
    body: 'Beyond the glass, the grounds lie still. Dust catches in the narrow beam of light that reaches across the shelves. From here, the library feels far removed from the rest of the Manor.',
  },
}

const fragmentPoints: Record<'backDesk' | 'staircase' | 'bookshelf', { title: string; body: string; fragment: number; image: string }> = {
  backDesk: {
    title: 'The Writing Desk',
    body: 'Beneath a neat stack of correspondence, a narrow piece of old parchment catches against the wood. Its edges are torn, as though it once belonged to a larger page.',
    fragment: 2,
    image: '/manor-library/poem-fragment-3.png',
  },
  staircase: {
    title: 'The Spiral Staircase',
    body: 'A loose ornament in the balustrade reveals a folded scrap of parchment. The ink has faded, but the verse remains legible.',
    fragment: 0,
    image: '/manor-library/poem-fragment-1.png',
  },
  bookshelf: {
    title: 'The Bookshelf',
    body: 'A slim volume sits out of line with the others. Between its pages lies a fragment of a handwritten poem.',
    fragment: 1,
    image: '/manor-library/poem-fragment-2.png',
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
  const [readingFragment, setReadingFragment] = useState<number | null>(null)

  const collect = (index: number) => {
    setFound((current) => current.includes(index) ? current : [...current, index])
    setPoint(null)
  }

  const placeFragment = (slot: number) => {
    if (solved) return
    setWrongOrder(false)

    if (selected === null) {
      const existing = order[slot]
      if (existing !== null) setSelected(existing)
      return
    }

    const next = [...order]
    const sourceSlot = next.indexOf(selected)
    const displaced = next[slot]

    if (sourceSlot >= 0) next[sourceSlot] = displaced
    next[slot] = selected

    setOrder(next)
    setSelected(null)

    if (next.every((value) => value !== null)) {
      const correct = next[0] === 2 && next[1] === 1 && next[2] === 0
      if (correct) {
        setSolved(true)
      } else {
        setWrongOrder(true)
      }
    }
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
        <button className={`library-hotspot library-hotspot-book library-hotspot-guided ${solved ? 'is-complete' : ''}`} onClick={() => setPoint('book')} aria-label="Examine the open book"><span>Book</span></button>
        <button className="library-hotspot library-hotspot-back-desk" onClick={() => setPoint('backDesk')} aria-label="Search the writing desk"><span>Find</span></button>
        <button className="library-hotspot library-hotspot-staircase" onClick={() => setPoint('staircase')} aria-label="Search the spiral staircase"><span>Find</span></button>
        <button className="library-hotspot library-hotspot-bookshelf" onClick={() => setPoint('bookshelf')} aria-label="Search the bookshelf"><span>Find</span></button>
        <button className="library-hotspot library-hotspot-reading-chair" onClick={() => setPoint('readingChair')} aria-label="Examine the reading chair"><span>Look</span></button>
        <button className="library-hotspot library-hotspot-globe" onClick={() => setPoint('globe')} aria-label="Examine the brass globe"><span>Look</span></button>
        <button className="library-hotspot library-hotspot-window" onClick={() => setPoint('window')} aria-label="Look through the tall window"><span>Look</span></button>
      </div>

      {point && <div className="hall-modal-backdrop library-modal-backdrop" role="presentation" onClick={() => setPoint(null)}>
        <section className="hall-modal library-modal" role="dialog" aria-modal="true" aria-labelledby="library-modal-title" onClick={(event) => event.stopPropagation()}>
          <button className="hall-modal-close" onClick={() => setPoint(null)} aria-label="Close"><X aria-hidden="true" /></button>
          {point === 'book' ? <>
            <p className="kicker">LIBRARY · THE MISSING PAGE</p>
            <h2 id="library-modal-title">The Three Watchers</h2>
            {!solved ? <>
              <div className="library-book-layout">
                <img className="library-book-detail" src="/manor-library/open-book-detail.png" alt="An old open book with a page missing" />
                <div className="library-book-clue">
                  <p>Three verses have been torn from the book. Their meaning is incomplete. The scattered fragments may restore what is missing.</p>
                  <blockquote>“Read the watchers as they rise, from the silent earth to the endless sky.”</blockquote>
                </div>
              </div>
              <p className="library-puzzle-instruction">Place the recovered verses in order, from the lowest watcher to the highest.</p>
              <div className="library-puzzle-workspace">
                <div className="library-assembly">
                  {order.map((fragmentIndex, slot) => <button key={slot} className={`library-assembly-slot ${fragmentIndex !== null ? 'has-fragment' : ''} ${selected !== null ? 'slot-ready' : ''} ${fragmentIndex === selected ? 'is-selected' : ''}`} onClick={() => placeFragment(slot)} aria-label={fragmentIndex !== null ? `Select or exchange verse in position ${slot + 1}` : `Place verse in position ${slot + 1}`}>
                    {fragmentIndex === null ? <span>{['I · LOWEST','II · MIDDLE','III · HIGHEST'][slot]}</span> : <span className="library-verse-preview">{fragments[fragmentIndex].text}</span>}
                  </button>)}
                </div>
                <aside className="library-fragment-inventory" aria-label="Recovered fragments">
                  <p className="library-inventory-heading">RECOVERED VERSES</p>
                  {found.map((index) => <button key={index} className={`library-fragment-card ${selected === index ? 'selected' : ''}`} onClick={() => setReadingFragment(index)}>
                    <img src={fragments[index].image} alt="" />
                    <span>Read fragment {index + 1}</span>
                  </button>)}
                </aside>
              </div>
              {selected !== null && <p className="library-puzzle-instruction">Choose a position to place the selected verse. Selecting an occupied position exchanges the verses.</p>}
              {wrongOrder && <p className="library-wrong-order">The verses do not yet follow the order of the watchers. You can rearrange them.</p>}
            </> : <>
              <img className="library-completed-page" src="/manor-library/bird-order-illustration.png" alt="The restored page of The Three Watchers, with all three verses in their correct order" />
              <p className="library-solved-note"><Check aria-hidden="true" /> The missing page has been restored.</p>
              <button className="enter-button hall-modal-action" onClick={() => { setPoint(null); setReveal(true) }}><span>Continue to the opened drawer</span><ArrowRight aria-hidden="true" /></button>
            </>}
          </> : point === 'backDesk' || point === 'staircase' || point === 'bookshelf' ? <>
            <p className="kicker">LIBRARY · RESEARCH POINT</p>
            <h2 id="library-modal-title">{fragmentPoints[point].title}</h2>
            <div className="library-discovery-layout library-paper-discovery">
              <p className="research-body">{fragmentPoints[point].body}</p>
              <div className="library-found-fragment library-found-fragment-large">
                <img src={fragments[fragmentPoints[point].fragment].image} alt="A torn piece of the missing handwritten page" />
                <span>THE THREE WATCHERS · TORN PAGE</span>
              </div>
              <button className="enter-button hall-modal-action" onClick={() => collect(fragmentPoints[point].fragment)}><span>{found.includes(fragmentPoints[point].fragment) ? 'Return to the library' : 'Keep the page fragment'}</span><ArrowRight aria-hidden="true" /></button>
            </div>
          </> : <>
            <p className="kicker">LIBRARY · A CLOSER LOOK</p>
            <h2 id="library-modal-title">{ambientPoints[point].title}</h2>
            <p className="research-body library-ambient-note">{ambientPoints[point].body}</p>
            <button className="enter-button hall-modal-action" onClick={closeBook}><span>Return to the library</span><ArrowRight aria-hidden="true" /></button>
          </>}
        </section>
      </div>}

      {readingFragment !== null && <div className="library-fragment-reader-backdrop" role="presentation" onClick={() => setReadingFragment(null)}>
        <section className="library-fragment-reader" role="dialog" aria-modal="true" aria-labelledby="library-fragment-reader-title" onClick={(event) => event.stopPropagation()}>
          <button className="hall-modal-close" onClick={() => setReadingFragment(null)} aria-label="Close"><X aria-hidden="true" /></button>
          <p className="kicker">A PIECE OF THE MISSING PAGE</p>
          <h2 id="library-fragment-reader-title">The Three Watchers</h2>
          <img src={fragments[readingFragment].image} alt="A torn piece of handwritten poetry" />
          <blockquote>{fragments[readingFragment].text}</blockquote>
          <button className="enter-button hall-modal-action" onClick={() => { setSelected(readingFragment); setReadingFragment(null) }}><span>Use this verse</span><ArrowRight aria-hidden="true" /></button>
        </section>
      </div>}
      {reveal && <div className="cabinet-reveal-backdrop library-reveal-backdrop">
        <section className="cabinet-reveal-scene library-reveal-scene" role="dialog" aria-modal="true" aria-labelledby="library-reveal-title">
          <img className="cabinet-reveal-image" src="/manor-library/writing-desk-open-artifact.png" alt="The writing desk drawer opens to reveal an artifact" />
          <div className="cabinet-reveal-vignette" aria-hidden="true" />
          <div className="cabinet-reveal-copy">
            <p className="kicker">THE LIBRARY HAS REVEALED ITS SECRET</p>
            <h2 id="library-reveal-title">The page remembers.</h2>
            <p>The verses have found their place. Somewhere in the old desk, a hidden mechanism answers. The drawer opens, revealing the Hourglass of Clarity, entrusted to the next part of your journey.</p>
            <img className="library-artifact-reveal" src="/manor-library/library-artifact.png" alt="The Hourglass of Clarity discovered in the Library" />
            <button className="enter-button" onClick={onArtifactUnlocked}><span>Receive the Hourglass of Clarity</span><ArrowRight aria-hidden="true" /></button>
          </div>
        </section>
      </div>}
    </main>
  )
}
