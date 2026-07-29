import type { Metadata } from 'next'
import { ChatClient } from './_ChatClient'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return {
    title: 'Análisis de proyecto',
    description: `Resultados del análisis de hireabilidad para tu proyecto.`,
  }
}

export default function ChatPage({ params }: Props) {
  return <ChatClient params={params} />
}
