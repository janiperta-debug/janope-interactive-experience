export type LocalizedText = { en: string }

export type Room = {
  id: string
  name: LocalizedText
  eyebrow: LocalizedText
  description: LocalizedText
  accent: string
}

export type Artifact = {
  id: string
  name: LocalizedText
  roomId: string
  hint: LocalizedText
  discoveryId: string
}

export type Discovery = {
  id: string
  artifactId: string
  title: LocalizedText
  body: LocalizedText
  inscription: LocalizedText
}

export type Puzzle = {
  id: string
  roomId: string
  status: 'planned' | 'available'
  prompt: LocalizedText
}
