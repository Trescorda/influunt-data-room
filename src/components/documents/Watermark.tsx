'use client'

export function PageWatermark() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      style={{ zIndex: 20 }}
    >
      <span
        style={{
          fontSize: '80px',
          fontWeight: 700,
          color: 'rgba(0, 0, 0, 0.07)',
          transform: 'rotate(-30deg)',
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}
      >
        influunt
      </span>
    </div>
  )
}
