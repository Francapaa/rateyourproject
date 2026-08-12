const HEXAGON_URI = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#d4a853" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5"/></svg>`
)}`

const GHOST_HEXAGON_URI = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="0.6"><polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5"/><polygon points="12,5 19.5,10.2 19.5,13.8 12,19 4.5,13.8 4.5,10.2"/></svg>`
)}`

export interface OGTemplateProps {
  title: string
  subtitle?: string
  eyebrow?: string
}

export function OGTemplate({ title, subtitle, eyebrow }: OGTemplateProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0a0a0b',
        backgroundImage: 'linear-gradient(135deg, #0a0a0b 0%, #16161b 100%)',
        padding: 72,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <img src={HEXAGON_URI} width={44} height={44} alt="" />
        <div
          style={{
            fontFamily: 'Bricolage',
            fontSize: 30,
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.5px',
          }}
        >
          RateYourProject
        </div>
      </div>

      <img
        src={GHOST_HEXAGON_URI}
        width={280}
        height={280}
        style={{ position: 'absolute', right: -40, bottom: -40, opacity: 0.14 }}
        alt=""
      />

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
        {eyebrow && (
          <div
            style={{
              color: '#d4a853',
              fontFamily: 'Bricolage',
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: '4px',
              textTransform: 'uppercase',
            }}
          >
            {eyebrow}
          </div>
        )}
        <div
          style={{
            color: '#ffffff',
            fontFamily: 'Bricolage',
            fontSize: 66,
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-1.5px',
            marginTop: eyebrow ? 18 : 0,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              color: '#b4b4c2',
              fontFamily: 'Bricolage',
              fontSize: 26,
              fontWeight: 600,
              lineHeight: 1.35,
              marginTop: 20,
              maxWidth: 820,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      <div style={{ width: '100%', height: 5, backgroundColor: '#d4a853', borderRadius: 4 }} />
    </div>
  )
}