import { ImageResponse } from 'next/og'
import { OGTemplate } from '@/components/og/OGTemplate'
import { getOGFonts } from '@/lib/og-fonts'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'RateYourProject — Evaluate the hireability of your project'

export default async function Image() {
  const fonts = await getOGFonts()
  return new ImageResponse(
    <OGTemplate
      title="RateYourProject"
      subtitle="Evaluate the hireability of your project"
    />,
    { ...size, fonts }
  )
}