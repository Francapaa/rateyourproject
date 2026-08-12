import type { PostBlock } from '@/content/posts'

export function PostBlocks({ blocks }: { blocks: PostBlock[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'h3':
            return (
              <h3 key={index} className="pt-2 font-display font-600 text-xl text-white">
                {block.text}
              </h3>
            )
          case 'quote':
            return (
              <blockquote
                key={index}
                className="border-l-2 border-accent/50 pl-5 italic text-base text-muted-light leading-relaxed"
              >
                {block.text}
              </blockquote>
            )
          case 'list':
            return (
              <ul key={index} className="space-y-2.5 pl-6 list-disc text-muted-light leading-relaxed">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            )
          case 'table':
            return (
              <div key={index} className="rounded-xl border border-surface-700/50 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-surface-900">
                      {block.headers.map((header, headerIndex) => (
                        <th key={headerIndex} className="px-5 py-4 font-display font-600 text-white">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-700/30">
                    {block.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="bg-surface-950/50">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-5 py-4 text-muted-light align-top">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          case 'p':
          default:
            return (
              <p key={index} className="text-muted-light leading-relaxed">
                {block.text}
              </p>
            )
        }
      })}
    </div>
  )
}