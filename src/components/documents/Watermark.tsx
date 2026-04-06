'use client'

interface PageWatermarkProps {
  opacity?: number // 1-100, maps to 0.01-1.0
}

export function PageWatermark({ opacity = 6 }: PageWatermarkProps) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      style={{ zIndex: 20 }}
    >
      <span
        style={{
          fontSize: '120px',
          fontWeight: 700,
          letterSpacing: '20px',
          color: `rgba(0, 0, 0, ${opacity / 100})`,
          transform: 'rotate(-30deg)',
          whiteSpace: 'nowrap',
          userSelect: 'none',
          width: '100%',
          textAlign: 'center',
        }}
      >
        influunt
      </span>
    </div>
  )
}
