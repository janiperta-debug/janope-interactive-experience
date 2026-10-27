'use client'

import { useCallback, useEffect, useState } from 'react'

export function OrientationGuard() {
  const [portrait, setPortrait] = useState(false)

  const updateOrientation = useCallback(() => {
    if (typeof window === 'undefined') return
    const isSmallScreen = window.matchMedia('(max-width: 900px), (pointer: coarse)').matches
    setPortrait(isSmallScreen && window.innerHeight > window.innerWidth)
  }, [])

  const tryLandscapeLock = useCallback(async () => {
    try {
      const orientation = screen.orientation as ScreenOrientation & { lock?: (orientation: string) => Promise<void> }
      if (typeof orientation?.lock === 'function') await orientation.lock('landscape')
    } catch {
      // iOS Safari and some browser contexts do not permit orientation locking.
      // The orientation prompt remains the graceful fallback.
    }
  }, [])

  useEffect(() => {
    updateOrientation()
    window.addEventListener('resize', updateOrientation)
    window.addEventListener('orientationchange', updateOrientation)
    return () => {
      window.removeEventListener('resize', updateOrientation)
      window.removeEventListener('orientationchange', updateOrientation)
    }
  }, [updateOrientation])

  useEffect(() => {
    if (!portrait) return
    const handleFirstGesture = () => { void tryLandscapeLock() }
    window.addEventListener('pointerdown', handleFirstGesture, { once: true })
    return () => window.removeEventListener('pointerdown', handleFirstGesture)
  }, [portrait, tryLandscapeLock])

  if (!portrait) return null

  return (
    <div className="orientation-guard" role="dialog" aria-modal="true" aria-labelledby="orientation-title">
      <div className="orientation-card">
        <div className="orientation-emblem" aria-hidden="true">
          <span className="orientation-phone"><i /></span>
          <span className="orientation-arrow">↻</span>
        </div>
        <p className="orientation-kicker">The Manor — Unwritten</p>
        <h1 id="orientation-title">A different perspective awaits.</h1>
        <p className="orientation-copy">Turn your device sideways to enter the Manor.</p>
        <div className="orientation-rule" />
        <p className="orientation-footnote">The story is best experienced in landscape.</p>
      </div>
    </div>
  )
}
