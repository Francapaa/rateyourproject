import { type NextRequest } from 'next/server'
import { updateSession } from './src/lib/supabase/middleware'
import { requestFormReset } from 'react-dom'

export async function middleware(request: NextRequest) {
  console.log("MIDDLEWARE EJECUTANDOSE EN: ", request.url)
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
