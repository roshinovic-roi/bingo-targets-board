// Renders the branch board (?shot=1) and sends a screenshot to Telegram via sendPhoto.
// Env: TELEGRAM_TOKEN, TELEGRAM_CHAT_ID, [BRANCH=176], [BASE_URL], [FORCE=1 to bypass time window]
import { chromium } from 'playwright'

const TOKEN = process.env.TELEGRAM_TOKEN
const CHAT = process.env.TELEGRAM_CHAT_ID
const BRANCH = process.env.BRANCH || '176'
const BASE = process.env.BASE_URL || 'https://bingo-targets-board-roi-roshinovic-s-projects.vercel.app'
const FORCE = process.env.FORCE === '1' || process.env.GITHUB_EVENT_NAME === 'workflow_dispatch'

if (!TOKEN || !CHAT) { console.error('missing TELEGRAM_TOKEN / TELEGRAM_CHAT_ID'); process.exit(1) }

// --- Supabase (public anon) for once-per-hour dedupe across schedule + external triggers ---
const SB_URL = 'https://ftfaporbookulrspamjn.supabase.co'
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0ZmFwb3Jib29rdWxyc3BhbWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5MjY0MTQsImV4cCI6MjA5ODUwMjQxNH0.g8Vso3wfdYGwALUB9hFkzqX1gXMcLrz8yPGBGWOhXEw'
const SENT_KEY = `b:${BRANCH}:tgsent`
async function sbGet(key){try{const r=await fetch(`${SB_URL}/rest/v1/bingo_kv?key=eq.${encodeURIComponent(key)}&select=value`,{headers:{apikey:SB_KEY,Authorization:`Bearer ${SB_KEY}`}});const a=await r.json();return Array.isArray(a)&&a.length?a[0].value:null}catch(e){return null}}
async function sbSet(key,value){try{await fetch(`${SB_URL}/rest/v1/bingo_kv`,{method:'POST',headers:{apikey:SB_KEY,Authorization:`Bearer ${SB_KEY}`,'Content-Type':'application/json',Prefer:'resolution=merge-duplicates'},body:JSON.stringify({key,value})})}catch(e){}}

// --- Send window: Sun–Thu, 09:00–16:00 Israel time (DST-proof via Asia/Jerusalem) ---
function israelNow() {
  const p = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Jerusalem', weekday: 'short', hour: '2-digit', hour12: false }).formatToParts(new Date())
  const wd = p.find(x => x.type === 'weekday').value      // Sun,Mon,...
  const hour = parseInt(p.find(x => x.type === 'hour').value, 10)
  const days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
  return { day: days[wd], hour }
}
function israelBucket() {
  const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false }).formatToParts(new Date())
  const g = t => p.find(x => x.type === t).value
  return `${g('year')}-${g('month')}-${g('day')}T${g('hour')}`
}

if (!FORCE) {
  const { day, hour } = israelNow()
  const inWindow = day >= 0 && day <= 4 && hour >= 9 && hour <= 16
  if (!inWindow) { console.log(`outside window (day=${day} hour=${hour}) — skipping`); process.exit(0) }
}

// dedupe: only one send per Israel-hour (unless forced). Prevents duplicates when both
// the GitHub schedule and an external trigger (cron-job.org) fire in the same hour.
const bucket = israelBucket()
if (!FORCE) {
  const last = await sbGet(SENT_KEY)
  if (last === bucket) { console.log(`already sent this hour (${bucket}) — skipping`); process.exit(0) }
}
// claim this hour BEFORE sending to avoid a race between two near-simultaneous runs
await sbSet(SENT_KEY, bucket)

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
if (!j.ok) { await sbSet(SENT_KEY, 'send-failed:' + bucket); process.exit(1) }
