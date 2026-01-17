#!/usr/bin/env node
/**
 * scripts/batch-download-covers.js
 * - Downloads official covers from AniList (primary) and TMDB (optional) for recent entries
 *   in prisma/animelist.json and saves them to public/uploads/.
 * - Default: process entries with releaseAt or updatedAt >= 2023-01-01 and with remote thumbnails.
 * - Usage: node scripts/batch-download-covers.js [--since YYYY] [--concurrency N] [--dry-run] [--seed]
 *
 * Notes:
 * - TMDB is optional; set TMDB_API_KEY in env to enable TMDB searches.
 * - The script is conservative: skips entries already pointing to /uploads/.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');
const argv = require('minimist')(process.argv.slice(2), { string: ['since'], boolean: ['dry-run', 'seed'], default: { since: '2023' } });

const fetch = global.fetch || require('node-fetch');
const ANIMELIST_GQL = 'https://graphql.anilist.co';
const TMDB_KEY = process.env.TMDB_API_KEY || '';
const CONCURRENCY = Number(argv.concurrency || Math.max(4, Math.floor(os.cpus().length)));
const SINCE_YEAR = Number(argv.since || '2023');
const CUTOFF = new Date(`${SINCE_YEAR}-01-01T00:00:00.000Z`).getTime();

const ANIMELIST_PATH = path.resolve(__dirname, '../prisma/animelist.json');
const UPLOADS_DIR = path.resolve(process.cwd(), 'public/uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

function safeFilename(title, ext = '.jpg') {
  const base = String(title || 'cover').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 120);
  return `${base}${ext}`;
}

async function aniListCover(title) {
  const query = `query($search: String){ Media(search:$search, type:ANIME){ id title { romaji english native } coverImage { extraLarge large medium } siteUrl } }`;
  try {
    const res = await fetch(ANIMELIST_GQL, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ query, variables: { search: title } }) });
    if (!res.ok) return null;
    const json = await res.json();
    const m = json?.data?.Media;
    if (!m) return null;
    return m.coverImage?.extraLarge || m.coverImage?.large || m.coverImage?.medium || null;
  } catch (err) {
    return null;
  }
}

async function tmdbPoster(title) {
  if (!TMDB_KEY) return null;
  try {
    const q = encodeURIComponent(title);
    const res = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${TMDB_KEY}&query=${q}`);
    if (!res.ok) return null;
    const json = await res.json();
    const r = (json.results || [])[0];
    if (!r || !r.poster_path) return null;
    return `https://image.tmdb.org/t/p/original${r.poster_path}`;
  } catch (err) {
    return null;
  }
}

async function download(url, dest) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('image')) throw new Error('not-image');
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buffer);
    return true;
  } catch (err) {
    return false;
  }
}

function loadList() { return JSON.parse(fs.readFileSync(ANIMELIST_PATH, 'utf-8')); }
function saveList(list) { fs.writeFileSync(ANIMELIST_PATH, JSON.stringify(list, null, 2) + '\n', 'utf-8'); }

async function processEntry(entry) {
  // skip if already local
  if (!entry) return { skipped: true };
  if (String(entry.thumbnail || '').startsWith('/uploads/')) return { skipped: true };
  const rel = (dateStr) => { try { return Date.parse(dateStr); } catch { return 0; } };
  const shouldProcess = (rel(entry.releaseAt) >= CUTOFF) || (rel(entry.updatedAt) >= CUTOFF);
  if (!shouldProcess) return { skipped: true };

  const title = entry.title || entry.originalTitle || '';
  if (!title) return { skipped: true };

  // try AniList
  const al = await aniListCover(title).catch(() => null);
  let chosen = al;
  // fallback TMDB
  if (!chosen && TMDB_KEY) chosen = await tmdbPoster(title).catch(() => null);
  // fallback to existing remote thumbnail if it's already external and valid
  if (!chosen && entry.thumbnail && /^https?:\/\//.test(entry.thumbnail)) chosen = entry.thumbnail;
  if (!chosen) return { skipped: true };

  const ext = path.extname(new URL(chosen).pathname).split('?')[0] || '.jpg';
  const filename = safeFilename(title, ext);
  const dest = path.join(UPLOADS_DIR, filename);
  if (fs.existsSync(dest)) {
    // already downloaded
    entry.thumbnail = `/uploads/${filename}`;
    entry.thumbnailFilename = filename;
    entry.updatedAt = new Date().toISOString();
    return { downloaded: false, reused: true, filename };
  }

  const ok = await download(chosen, dest);
  if (!ok) return { skipped: true, reason: 'download-failed' };
  entry.thumbnail = `/uploads/${filename}`;
  entry.thumbnailFilename = filename;
  entry.updatedAt = new Date().toISOString();
  return { downloaded: true, filename };
}

async function run() {
  const list = loadList();
  const tasks = [];
  for (const entry of list) {
    tasks.push(entry);
  }

  const results = [];
  let ptr = 0;
  const workers = new Array(CONCURRENCY).fill(null).map(async () => {
    while (ptr < tasks.length) {
      const i = ptr++;
      try {
        const res = await processEntry(tasks[i]);
        results.push({ title: tasks[i]?.title, uid: tasks[i]?.uid, res });
      } catch (err) {
        results.push({ title: tasks[i]?.title, uid: tasks[i]?.uid, res: { error: String(err) } });
      }
    }
  });
  await Promise.all(workers);

  const changed = results.filter(r => r.res && (r.res.downloaded || r.res.reused));
  console.log(`processed ${results.length} entries — updated ${changed.length} covers`);

  if (!argv['dry-run'] && changed.length > 0) {
    // save modifications
    saveList(list);
    console.log('wrote updates to prisma/animelist.json');
  }

  // summary
  const downloadList = changed.map(c => ({ title: c.title, uid: c.uid, filename: c.res.filename, downloaded: c.res.downloaded }));
  console.table(downloadList.slice(0, 200));

  if (argv.seed && !argv['dry-run']) {
    console.log('running make seed...');
    const r = spawnSync('make', ['seed'], { stdio: 'inherit' });
    process.exit(r.status || 0);
  }
}

run().catch(err => { console.error(err); process.exit(1); });
