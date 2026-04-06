'use client'

interface WatermarkProps {
  name: string
  email: string
  opacity: number
}

export function Watermark({ name, email, opacity }: WatermarkProps) {
  const text = `${name} — ${email}`

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-10"
      style={{ opacity: opacity / 100 }}
    >
      <div className="absolute inset-0" style={{ transform: 'rotate(-45deg)', transformOrigin: 'center' }}>
        <div className="flex flex-col gap-16 -mt-[50%] -ml-[50%]" style={{ width: '200%', height: '200%' }}>
          {Array.from({ length: 20 }).map((_, row) => (
            <div key={row} className="flex gap-24 whitespace-nowrap">
              {Array.from({ length: 10 }).map((_, col) => (
                <span
                  key={col}
                  className="text-brand-muted text-lg font-medium"
                  style={{ fontSize: '18px' }}
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
