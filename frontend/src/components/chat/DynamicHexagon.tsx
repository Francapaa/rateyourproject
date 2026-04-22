'use client'

import { useMemo, useState } from 'react'

interface Dimension {
  label: string
  value: number
}

interface DynamicHexagonProps {
  dimensions: Record<string, number>
  size?: 'sm' | 'md' | 'lg'
  maxValue?: number
}

const DIMENSION_KEY_MAP: Record<string, string> = {
  architecture: 'Architecture',
  code_quality: 'Code quality',
  testing: 'Testing',
  documentation: 'Documentation',
  product_idea: 'Product idea',
  maintainability: 'Maintainability',
}

const DIMENSION_ORDER = [
  'Architecture',
  'Code quality',
  'Testing',
  'Documentation',
  'Product idea',
  'Maintainability',
]

const sizeMap = {
  sm: { container: 'w-52 h-52', label: 'text-[9px]', value: 'text-[8px]' },
  md: { container: 'w-72 h-72', label: 'text-xs', value: 'text-[10px]' },
  lg: { container: 'w-96 h-96', label: 'text-sm', value: 'text-xs' },
}

export function DynamicHexagon({
  dimensions,
  size = 'md',
  maxValue = 100,
}: DynamicHexagonProps) {
  const sizes = sizeMap[size]
  const [hovered, setHovered] = useState<number | null>(null)

  const dimensionData: Dimension[] = useMemo(() => {
    return DIMENSION_ORDER.map((label) => {
      const backendKey = Object.keys(DIMENSION_KEY_MAP).find(
        (key) => DIMENSION_KEY_MAP[key] === label
      )
      return {
        label,
        value: backendKey ? dimensions[backendKey] ?? 0 : 0,
      }
    })
  }, [dimensions])

  const totalScore = useMemo(() => {
    return (
      dimensionData.reduce((sum, d) => sum + d.value, 0) /
      dimensionData.length
    )
  }, [dimensionData])

  const center = 100
  const maxRadius = 85

  const getPoint = (i: number, value: number) => {
    const angle = (i * 60 - 90) * (Math.PI / 180)
    const radius = (value / maxValue) * maxRadius
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
      angle,
    }
  }

  const polygonPoints = dimensionData
    .map((d, i) => {
      const p = getPoint(i, d.value)
      return `${p.x},${p.y}`
    })
    .join(' ')

  return (
    <div className={`relative ${sizes.container} select-none`}>
      
      {/* GRID */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
        {[20, 40, 60, 80, 100].map((lvl) => {
          const r = (lvl / 100) * maxRadius
          const points = Array.from({ length: 6 }, (_, i) => {
            const angle = (i * 60 - 90) * (Math.PI / 180)
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`
          }).join(' ')

          return (
            <polygon
              key={lvl}
              points={points}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-amber-500/20"
            />
          )
        })}

        {Array.from({ length: 6 }, (_, i) => {
          const angle = (i * 60 - 90) * (Math.PI / 180)
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={center + maxRadius * Math.cos(angle)}
              y2={center + maxRadius * Math.sin(angle)}
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-amber-500/20"
            />
          )
        })}
      </svg>

      {/* DATA POLYGON */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
        <polygon
          points={polygonPoints}
          className="text-amber-500/20 transition-all duration-500"
          fill="currentColor"
        />

        <polygon
          points={polygonPoints}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-amber-500"
        />

        {dimensionData.map((d, i) => {
          const p = getPoint(i, d.value)

          return (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={hovered === i ? 5 : 3}
              className="text-amber-500 cursor-pointer transition-all"
              fill="currentColor"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          )
        })}
      </svg>

      {/* SCORE */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="text-amber-500 text-3xl font-bold">
            {Math.round(totalScore)}
          </div>
          <div className="text-amber-500/60 text-xs tracking-widest uppercase">
            Score
          </div>
        </div>
      </div>

      {/* LABELS */}
      <div className="absolute inset-0">
        {dimensionData.map((d, i) => {
          const angle = (i * 60 - 90) * (Math.PI / 180)
          const r = 60

          const x = 50 + r * Math.cos(angle)
          const y = 50 + r * Math.sin(angle)

          const isLeft = Math.cos(angle) < -0.3
          const isRight = Math.cos(angle) > 0.3
          const isTop = Math.sin(angle) < -0.3
          const isBottom = Math.sin(angle) > 0.3
          
          let translateX = '-50%'
          if (isLeft) translateX = '-30%'
          if (isRight) translateX = '-100%'
          
          let translateY = '-50%'
          if (isTop) translateY = '50%'       // empuja hacia abajo (evita que se corte arriba)
          if (isBottom) translateY = '-150%' // empuja hacia arriba (evita que se corte abajo)

          const align = isLeft
            ? 'text-left'
            : isRight
            ? 'text-right'
            : 'text-center'

          return (
            <div
              key={i}
              className={`absolute px-2 ${align}`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: `translate(${translateX}, ${translateY})`,
                maxWidth: '120px',
                textAlign: 'center'
              }}
            >
              <div className={`${sizes.label} text-amber-500/70`}>
                {d.label}
              </div>
              <div className={`${sizes.value} text-amber-500 font-semibold`}>
                {d.value}%
              </div>

              {/* TOOLTIP */}
              {hovered === i && (
                <div className="absolute mt-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                  {d.label}: {d.value}%
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}