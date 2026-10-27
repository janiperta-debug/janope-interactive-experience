import type { Artifact, Discovery, Puzzle, Room } from '@/types/world'

export const firstRoom: Room = {
  id: 'threshold',
  name: { en: 'The Threshold' },
  eyebrow: { en: 'Janope / Field Note 001' },
  description: { en: 'A quiet room between what was known and what has yet to be found.' },
  accent: '#c3a36b',
}

export const artifacts: Artifact[] = [
  {
    id: 'first-fragment',
    name: { en: 'The First Fragment' },
    roomId: 'threshold',
    hint: { en: 'A fragment of something greater. Its purpose is unknown.' },
    discoveryId: 'first-fragment-lore',
  },
]

export const discoveries: Discovery[] = [
  {
    id: 'first-fragment-lore',
    artifactId: 'first-fragment',
    title: { en: 'The First Fragment' },
    body: { en: 'A small metal fragment bearing the seal of the Manor. Its edges are broken, and its original form is unknown. No explanation accompanies it. Yet the Manor gives one to every guest upon arrival.' },
    inscription: { en: '“Perhaps some things are easier to understand once you know what is missing.”' },
  },
]

export const puzzles: Puzzle[] = [
  {
    id: 'threshold-riddle',
    roomId: 'threshold',
    status: 'planned',
    prompt: { en: 'What can be opened only after it has been found?' },
  },
]
