import type { Metadata } from 'next'
import { ChatClient } from './_ChatClient'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return {
    title: 'Project analysis',
    description: 'Hireability analysis results for your project.',
    robots: { index: false, follow: false },
  }
}

export default function ChatPage({ params }: Props) {
  return <ChatClient params={params} />
}
