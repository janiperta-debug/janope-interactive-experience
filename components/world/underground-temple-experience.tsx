'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, BookOpen, Sparkles, X } from 'lucide-react'

type MemoryId = 'fragment' | 'seed' | 'quill' | 'hourglass' | 'compass'

const memories: {
  id: MemoryId
  title: string
  room: string
  image: string
  recollection: string
  meaning: string
}[] = [
  {
    id: 'fragment',
    title: 'The First Fragment',
    room: 'THE ARRIVAL',
    image: '/manor-arrival/first-fragment.png',
    recollection: 'A small fragment was placed in your hands before you knew what it belonged to.',
    meaning: 'Every journey begins before its purpose is clear.',
  },
  {
    id: 'seed',
    title: 'Seed of Harmony',
    room: 'THE MAIN HALL',
    image: '/manor-main-hall/cabinet-open-seed.png',
    recollection: 'Nine scattered pieces became one, revealing what the locked cabinet had kept hidden.',
    meaning: 'What seems incomplete may still hold the shape of something whole.',
  },
  {
    id: 'quill',
    title: 'The Archivist’s Quill',
    room: 'THE CONSERVATORY',
    image: '/manor-conservatory/archivists-quill.png',
    recollection: 'Three plants found their proper places, and the Conservatory gave up one of its secrets.',
    meaning: 'Understanding often begins by noticing where things belong.',
  },
  {
    id: 'hourglass',
    title: 'Hourglass of Clarity',
    room: 'THE LIBRARY',
    image: '/manor-library/library-artifact.png',
    recollection: 'The Three Watchers revealed their order, and the Library entrusted you with the Hourglass of Clarity.',
    meaning: 'It sharpens perception, reveals the right moment, and grants the clarity to act when it matters most.',
  },
  {
    id: 'compass',
    title: 'Seeker’s Compass',
    room: 'THE CLOCK TOWER',
    image: '/manor-clock-tower/seekers-compass.png',
    recollection: 'Four memories were placed in the order in which the Manor entrusted them to you. The great clock began to turn, revealing the Seeker’s Compass.',
    meaning: 'It does not point north. It points towards the question you have not yet dared to ask.',
  },
]

export function UndergroundTempleExperience({ onBack }: { onBack: () => void }) {
  const [templeAwakened, setTempleAwakened] = useState(false)
  const [examined, setExamined] = useState<MemoryId[]>([])
  const [selected, setSelected] = useState<MemoryId | null>(null)
  const [bookRevealed, setBookRevealed] = useState(false)
  const [bookOpened, setBookOpened] = useState(false)

  const inspectMemory = (id: MemoryId) => {
    setSelected(id)
    setExamined(current => current.includes(id) ? current : [...current, id])
  }

  const allExamined = examined.length === memories.length

  return (
    <main className="temple-screen">
      <div className="temple-backdrop" aria-hidden="true" />
      <div className="temple-atmosphere" aria-hidden="true" />
      <header className="conservatory-header temple-header">
        <button className="back-button" onClick={onBack}><ArrowLeft aria-hidden="true" /><span>Main Hall</span></button>
        <div className="conservatory-title">THE MANOR <i>·</i> UNDERGROUND TEMPLE</div>
        <div className="conservatory-progress">THE FINAL CHAMBER</div>
      </header>

      <section className="temple-intro">
        <p className="kicker">BENEATH THE MANOR</p>
        <h1>The Underground Temple</h1>
        <p>Some places preserve what the world forgets to ask.</p>
      </section>

      {!templeAwakened && (
        <div className="temple-arrival-card">
          <p className="kicker">THE SEEKER’S COMPASS · THE FINAL PASSAGE</p>
          <h2>The Temple has been waiting.</h2>
          <p>The Seeker’s Compass rests in your hands. It does not point north, but towards the questions that still await you. The Temple begins to answer its call.</p>
          <button className="enter-button" onClick={() => setTempleAwakened(true)}><span>Awaken the Temple</span><Sparkles aria-hidden="true" /></button>
        </div>
      )}

      <div className="temple-memory-prompt" style={{ opacity: templeAwakened ? 1 : 0, pointerEvents: templeAwakened ? "auto" : "none" }}>
        <Sparkles aria-hidden="true" />
        <span>The journey has brought you here. The Temple remembers every step.</span>
      </div>

      <div className="temple-memory-orbit" aria-label="Memories from your journey" style={{ opacity: templeAwakened ? 1 : 0, pointerEvents: templeAwakened ? "auto" : "none" }}>
        {memories.map((memory, index) => (
          <button
            key={memory.id}
            className={`temple-memory-point temple-memory-point-${index + 1} ${examined.includes(memory.id) ? 'is-examined' : ''} ${selected === memory.id ? 'is-selected' : ''}`}
            onClick={() => inspectMemory(memory.id)}
            aria-label={`Examine ${memory.title}`}
          >
            <img className="temple-memory-symbol" src={memory.image} alt="" />
          </button>
        ))}
      </div>

      <div className="temple-progress-note" style={{ opacity: templeAwakened ? 1 : 0 }}>
        <span>MEMORIES REVISITED</span>
        <span>{examined.length} / 5</span>
        <div className="temple-progress-track"><span style={{ width: `${examined.length / memories.length * 100}%` }} /></div>
      </div>

      {selected && (
        <div className="hall-modal-backdrop temple-modal-backdrop" role="presentation" onClick={() => setSelected(null)}>
          <section className="hall-modal temple-memory-modal" role="dialog" aria-modal="true" aria-labelledby="temple-memory-title" onClick={event => event.stopPropagation()}>
            <button className="hall-modal-close" onClick={() => setSelected(null)} aria-label="Close"><X aria-hidden="true" /></button>
            <p className="kicker">{memories.find(item => item.id === selected)?.room} · A MEMORY</p>
            <h2 id="temple-memory-title">{memories.find(item => item.id === selected)?.title}</h2>
            <img src={memories.find(item => item.id === selected)?.image} alt="" className="temple-memory-artifact" />
            <p className="research-body">{memories.find(item => item.id === selected)?.recollection}</p>
            <blockquote className="temple-memory-meaning">{memories.find(item => item.id === selected)?.meaning}</blockquote>
            <button className="enter-button hall-modal-action" onClick={() => setSelected(null)}><span>Return to the Temple</span><ArrowRight aria-hidden="true" /></button>
          </section>
        </div>
      )}

      {allExamined && !bookRevealed && (
        <div className="temple-book-invitation">
          <p className="kicker">THE TEMPLE HAS REMEMBERED</p>
          <p>The five memories settle into the stone. Something long concealed begins to stir.</p>
          <button className="enter-button" onClick={() => setBookRevealed(true)}><span>Approach the altar</span><ArrowRight aria-hidden="true" /></button>
        </div>
      )}

      {bookRevealed && !bookOpened && (
        <div className="temple-book-backdrop">
          <section className="temple-book-reveal" role="dialog" aria-modal="true" aria-labelledby="temple-book-title">
            <div className="temple-book-glow" aria-hidden="true" />
            <p className="kicker">A FINAL DISCOVERY</p>
            <img src="/manor-underground-temple/the-unwritten-book.png" alt="An ancient book bearing the title The Unwritten" />
            <h2 id="temple-book-title">The Unwritten</h2>
            <p>The Temple has kept this book beyond the reach of time. Its pages hold more than this journey could reveal.</p>
            <button className="enter-button" onClick={() => setBookOpened(true)}><span>Open the book</span><BookOpen aria-hidden="true" /></button>
          </section>
        </div>
      )}

      {bookOpened && (
        <div className="temple-ending-backdrop">
          <section className="temple-ending" role="dialog" aria-modal="true" aria-labelledby="temple-ending-title">
            <p className="kicker">THE LAST PAGE · THE FIRST INVITATION</p>
            <h2 id="temple-ending-title">The Manor holds more than this journey could reveal.</h2>
            <div className="temple-ending-rule"><span>✧</span></div>
            <p>You have followed the fragments and uncovered what was hidden.</p>
            <p>Yet beyond these halls, other rooms remain. Other stories wait in the quiet. And somewhere, another door is ready to be found.</p>
            <blockquote>“This was never the whole story. It was an invitation.”</blockquote>
            <p className="temple-ending-signoff">Your next discovery is waiting.</p>
            <a className="enter-button temple-gametable-link" href="https://www.gametable.fi/" target="_blank" rel="noreferrer">
              <span>Continue your journey in GameTable</span><ArrowRight aria-hidden="true" />
            </a>
            <button className="temple-return-button" onClick={onBack}>Return to the Manor</button>
          </section>
        </div>
      )}
    </main>
  )
}
