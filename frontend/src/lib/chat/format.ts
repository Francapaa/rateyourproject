import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export function formatMessageTime(date: Date): string {
  return format(date, 'HH:mm', { locale: es })
}
