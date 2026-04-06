'use client'

interface PageWatermarkProps {
  investorName: string
  investorEmail: string
  opacity?: number
}

export function PageWatermark({ investorName, investorEmail, opacity = 6 }: PageWatermarkProps) {
  const text = `${investorName} — ${investorEmail}`

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      style={{ zIndex: 20 }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: 'rotate(-45deg)',
          transformOrigin: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '120px',
            marginTop: '-50%',
            marginLeft: '-50%',
            width: '200%',
            height: '200%',
          }}
        >
          {Array.from({ length: 12 }).map((_, row) => (
            <div key={row} style={{ display: 'flex', gap: '80px', whiteSpace: 'nowrap' }}>
              {Array.from({ length: 6 }).map((_, col) => (
                <span
                  key={col}
                  style={{
                    fontSize: '120px',
                    fontWeight: 700,
                    color: `rgba(0, 0, 0, ${opacity / 100})`,
                    userSelect: 'none',
                  }}
                >
                  {text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
