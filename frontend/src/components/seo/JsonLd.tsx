type JsonLdData = Record<string, unknown> | Record<string, unknown>[]

interface JsonLdProps {
  data: JsonLdData
}

export function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}