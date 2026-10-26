const STORAGE_KEY = 'janope-discoveries'

export function readDiscoveries(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    const parsed: unknown = value ? JSON.parse(value) : []
    return Array.isArray(parsed) && parsed.every((item) => typeof item === 'string') ? parsed : []
  } catch {
    return []
  }
}

export function markDiscovered(id: string): string[] {
  const current = readDiscoveries()
  const next = current.includes(id) ? current : [...current, id]
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Discovery remains available for the current session when storage is blocked.
  }
  return next
}
