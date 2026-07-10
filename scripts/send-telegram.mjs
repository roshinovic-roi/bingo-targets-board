// Renders the branch board (?shot=1) and sends a screenshot to Telegram via sendPhoto.
// Env: TELEGRAM_TOKEN, TELEGRAM_CHAT_ID, [BRANCH=176], [BASE_URL], [FORCE=1 to bypass time window]
import { chromium } from 'playwright'

const TOKEN = process.env.TELEGRAM_TOKEN
const CHAT = process.env.TELEGRAM_CHAT_ID
const BRANCH = process.env.BRANCH || '176'
const BASE = process.env.BASE_URL || 'https://bingo-targets-board-roi-roshinovic-s-projects.vercel.app'
const FORCE = process.env.FORCE === '1' || process.env.GITHUB_EVENT_NAME === 'workflow_dispatch'

if (!TOKEN || !CHAT) { console.error('missing TELEGRAM_TOKEN / TELEGRAM_CHAT_ID'); process.exit(1) }

// --- Send window: Sun–Thu, 09:00–16:00 Israel time (DST-proof via Asia/Jerusalem) ---
function israelNow() {
  const p = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Jerusalem', weekday: 'short', hour: '2-digit', hour12: false }).formatToParts(new Date())
  const wd = p.find(x => x.type === 'weekday').value      // Sun,Mon,...
  const hour = parseInt(p.find(x => x.type === 'hour').value, 10)
  const days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
  return { day: days[wd], hour }
}
if (!FORCE) {
  const { day, hour } = israelNow()
  const inWindow = day >= 0 && day <= 4 && hour >= 9 && hour <= 16
  if (!inWindow) { console.log(`outside window (day=${day} hour=${hour}) — skipping`); process.exit(0) }
}

const url = `${BASE}/s/${BRANCH}?shot=1`
console.log('rendering', url)
const browser = await chromium.launch({ args: ['--no-sandbox'] })
const page = await browser.newPage({ viewport: { width: 1000, height: 1000}, deviceScaleFactor: 2 })
await page.goto(url, { waitUntil: 'networkidle' })
// wait until the table has rendered (loading text gone + real content present)
await page.waitForFunction(() => {
  const el = document.querySelector('#shotwrap')
  return el && !el.innerText.includes('\u05d8\u05d5\u05e2\u05df') && el.innerText.length > 40
}, { timeout: 30000 })
await page.waitForTimeout(600)
const buf = await page.locator('#shotwrap').screenshot({ type: 'png' })
await browser.close()
console.log('screenshot bytes:', buf.length)

// --- send to Telegram ---
const caption = `\ud83c\udfaf \u05dc\u05d5\u05d7 \u05d4\u05d9\u05e2\u05d3\u05d9\u05dd \u00b7 ${new Intl.DateTimeFormat('he-IL', { timeZone: 'Asia/Jerusalem', dateStyle: 'short', timeStyle: 'short' }).format(new Date())}`
const form = new FormData()
form.append('chat_id', CHAT)
form.append('caption', caption)
form.append('photo', new Blob([buf], { type: 'image/png' }), `board-${BRANCH}.png`)
const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendPhoto`, { method: 'POST', body: form })
const j = await res.json()
console.log('telegram ok:', j.ok, j.ok ? '' : JSON.stringify(j))
if (!j.ok) process.exit(1)
