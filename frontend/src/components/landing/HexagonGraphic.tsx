'use client'

import { HEX_DIMENSIONS, HEX_CENTER_SCORE } from '@/const/hexagon'

const hexPoints = '50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%'

export function HexagonGraphic() {
  return (
    <div className="relative w-72 h-72 md:w-96 md:h-96 flex-shrink-0">
      <div className="absolute inset-0 animate-hex-spin opacity-20">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <polygon
            points="100,10 180,55 180,145 100,190 20,145 20,55"
            fill="none"
            stroke="#d4a853"
            strokeWidth="0.5"
          />
          <polygon
            points="100,30 160,60 160,140 100,170 40,140 40,60"
            fill="none"
            stroke="#d4a853"
            strokeWidth="0.3"
          />
          <polygon
            points="100,50 140,70 140,130 100,150 60,130 60,70"
            fill="none"
            stroke="#d4a853"
            strokeWidth="0.3"
          />
        </svg>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-accent/10 to-accent/5 animate-pulse-glow"
          style={{ clipPath: hexPoints }}
        >
          <div
            className="w-full h-full bg-surface-900/80 border border-accent/20"
            style={{ clipPath: hexPoints }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center px-6">
                <div className="text-3xl md:text-4xl font-display font-bold text-accent">
                  {HEX_CENTER_SCORE}
                </div>
                <div className="text-xs md:text-sm text-muted tracking-widest uppercase mt-1">
                  Score
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0">
        {HEX_DIMENSIONS.map((dim, i) => {
          const angle = (i * 60 - 90) * (Math.PI / 180)
          const radius = 42
          const x = 50 + radius * Math.cos(angle)
          const y = 50 + radius * Math.sin(angle)

          return (
            <div
              key={dim.label}
              className="absolute text-center"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="text-[10px] md:text-xs text-muted-light font-body">
                {dim.label}
              </div>
              <div className="text-[9px] md:text-[10px] text-accent font-display font-semibold">
                {dim.value}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
