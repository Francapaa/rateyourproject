import { readFile } from 'node:fs/promises'
import path from 'node:path'

export async function getOGFonts() {
  const [file600, file800] = await Promise.all([
    readFile(path.join(process.cwd(), 'public/fonts/bricolage-600.ttf')),
    readFile(path.join(process.cwd(), 'public/fonts/bricolage-800.ttf')),
  ])

  const toArrayBuffer = (file: Buffer): ArrayBuffer =>
    file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength) as ArrayBuffer

  return [
    { name: 'Bricolage', data: toArrayBuffer(file600), weight: 600 as const },
    { name: 'Bricolage', data: toArrayBuffer(file800), weight: 800 as const },
  ]
}