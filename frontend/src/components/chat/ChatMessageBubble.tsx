import { ChatMessage } from '@/types/chat'
import { formatMessageTime } from '@/lib/chat/format'

interface ChatMessageBubbleProps {
  message: ChatMessage
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[75%] md:max-w-[65%] px-4 py-3 rounded-2xl ${
          isUser
            ? 'bg-accent text-surface-950 rounded-br-sm'
            : 'bg-surface-800 text-white rounded-bl-sm'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </p>
        <span
          className={`text-xs mt-1 block ${
            isUser ? 'text-surface-950/60' : 'text-muted'
          }`}
        >
          {formatMessageTime(message.timestamp)}
        </span>
      </div>
    </div>
  )
}
