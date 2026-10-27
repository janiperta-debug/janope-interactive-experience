"use client"

import type { HTMLAttributes, ReactNode } from "react"

type ArchiveFrameProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  weight?: "regular" | "thin" | "hairline"
  corners?: boolean
  cornerSize?: "sm" | "md"
}

/** The Manor's local adaptation of GameTable's ornamental archive frame. */
export function ArchiveFrame({
  children,
  weight = "regular",
  corners = true,
  cornerSize = "md",
  className = "",
  ...props
}: ArchiveFrameProps) {
  return (
    <div className={`manor-archive-frame manor-archive-frame--${weight} manor-archive-frame--corners-${cornerSize} ${className}`} {...props}>
      <div className="manor-archive-frame__channel">
        <div className="manor-archive-frame__surface">
          {corners && <span className="manor-archive-frame__corner manor-archive-frame__corner--tl" aria-hidden="true" />}
          {corners && <span className="manor-archive-frame__corner manor-archive-frame__corner--tr" aria-hidden="true" />}
          {corners && <span className="manor-archive-frame__corner manor-archive-frame__corner--bl" aria-hidden="true" />}
          {corners && <span className="manor-archive-frame__corner manor-archive-frame__corner--br" aria-hidden="true" />}
          <div className="manor-archive-frame__content">{children}</div>
        </div>
      </div>
    </div>
  )
}
