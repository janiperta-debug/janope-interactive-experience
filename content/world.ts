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
    id: 'brass-eye',
    name: { en: 'The Brass Eye' },
    roomId: 'threshold',
    hint: { en: 'Something watches from beneath the dust.' },
    discoveryId: 'first-light',
  },
]

export const discoveries: Discovery[] = [
  {
    id: 'first-light',
    artifactId: 'brass-eye',
    title: { en: 'A light that remembers' },
    body: { en: 'The eye is warm. When your hand closes around it, a thin line of gold travels through the room — not illuminating it, but revealing where the walls have been listening.' },
    inscription: { en: '“Begin where the silence is deepest.”' },
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
