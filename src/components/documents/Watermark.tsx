'use client'

interface PageWatermarkProps {
  opacity?: number
}

export function PageWatermark({ opacity = 6 }: PageWatermarkProps) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      style={{ zIndex: 20 }}
    >
      <span
        style={{
          fontSize: '180px',
          fontWeight: 700,
          letterSpacing: '10px',
          color: `rgba(180, 180, 180, ${opacity / 100})`,
          transform: 'rotate(-45deg)',
          whiteSpace: 'nowrap',
          userSelect: 'none',
          textAlign: 'center',
        }}
      >
        influunt
      </span>
    </div>
  )
}
