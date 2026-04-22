import Link from 'next/link'
import type { Conversation } from '@/types/conversation'
import { formatDate } from '@/components/dashboard/utils'

interface ConversationListProps {
  conversations: Conversation[]
}

export function ConversationList({ conversations }: ConversationListProps) {
  return (
    <ul className="space-y-3" role="list">
      {conversations.map((conversation) => (
        <ConversationItem key={conversation.id} conversation={conversation} />
      ))}
    </ul>
  )
}

interface ConversationItemProps {
  conversation: Conversation
}

function ConversationItem({ conversation }: ConversationItemProps) {
  return (
    <li>
      <Link
        href={`/chat/${conversation.id}`}
        className="block p-4 rounded-xl bg-surface-900 border border-surface-700/50 hover:border-accent/40 transition-colors group"
      >
        <h3 className="font-body font-semibold text-white group-hover:text-accent transition-colors truncate">
          {conversation.title}
        </h3>
        <time className="mt-1 block text-xs text-muted" dateTime={conversation.updated_at}>
          {formatDate(conversation.updated_at)}
        </time>
      </Link>
    </li>
  )
}
