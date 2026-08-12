import { request } from 'node:https'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://rateyourproject.com').replace(/\/$/, '')
const KEY = process.env.NEXT_PUBLIC_INDEXNOW_KEY || process.env.INDEXNOW_KEY || ''

const URLS = [
  SITE_URL,
  `${SITE_URL}/blog`,
  `${SITE_URL}/blog/what-is-hireability`,
  `${SITE_URL}/blog/how-to-evaluate-your-project`,
  `${SITE_URL}/blog/what-companies-look-for-in-your-code`,
  `${SITE_URL}/blog/six-dimensions-hireable-project`,
  `${SITE_URL}/login`,
]

function main() {
  if (!KEY) {
    console.log('[indexnow] SKIP: NEXT_PUBLIC_INDEXNOW_KEY not set')
    return
  }

  const keyLocation = `${SITE_URL}/${KEY}.txt`
  let pingUrl = `https://api.indexnow.org/indexnow?key=${KEY}&keyLocation=${encodeURIComponent(keyLocation)}`
  for (const url of URLS) {
    pingUrl += `&url=${encodeURIComponent(url)}`
  }

  const req = request(new URL(pingUrl), (res) => {
    res.resume()
    res.on('end', () => {
      console.log(`[indexnow] submitted ${URLS.length} urls (HTTP ${res.statusCode})`)
    })
  })

  req.on('error', (err) => {
    console.error(`[indexnow] ping failed (${err.message}) — build continues`)
  })

  req.end()
}

main()