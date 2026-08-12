import { ImageResponse } from 'next/og'
import { OGTemplate } from '@/components/og/OGTemplate'
import { getPostBySlug } from '@/content/posts'
import { getOGFonts } from '@/lib/og-fonts'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function Image({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  const fonts = await getOGFonts()

  return new ImageResponse(
    <OGTemplate
      eyebrow="RateYourProject · Blog"
      title={post?.title ?? 'RateYourProject'}
      subtitle={post?.description}
    />,
    { ...size, fonts }
  )
}