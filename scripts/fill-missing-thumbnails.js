#!/usr/bin/env node
/**
 * scripts/fill-missing-thumbnails.js
 *
 * Finds missing local thumbnails in public/uploads and attempts to fetch cover images
 * from the following sources:
 * - luciferdonghua.com
 * - bilibili.com
 * - youku.com
 * - animedonghua.com
 * - donghuazone.com
 * - donghuastream.com
 * - anime4i.com
 * - animecube.live
 *
 * Usage:
 *   node scripts/fill-missing-thumbnails.js [--dry-run] [--limit N] [--concurrency N]
 *
 * Notes:
 * - Updates prisma/animelist.json in-place unless --dry-run is provided.
 * - Downloads images to public/uploads and rewrites thumbnail/thumbnailFilename to local files.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const minimist = require('minimist');
const cheerio = require('cheerio');

const fetch = global.fetch || require('node-fetch');
const argv = minimist(process.argv.slice(2), {
  boolean: ['dry-run'],
  string: ['limit', 'concurrency'],
});

const ANIMELIST_PATH = path.resolve(__dirname, '../prisma/animelist.json');
const UPLOADS_DIR = path.resolve(process.cwd(), 'public/uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const CONCURRENCY = Number(argv.concurrency || Math.max(4, Math.floor(os.cpus().length / 2)));
const LIMIT = argv.limit ? Number(argv.limit) : undefined;

const DEFAULT_HEADERS = {
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'accept-language': 'en-US,en;q=0.9',
  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
};

const SOURCES = [
  { name: 'lucifer donghua', type: 'wp', base: 'https://luciferdonghua.in' },
  // { name: 'lucifer donghua', type: 'wp', base: 'https://luciferdonghua.com' },
  // { name: 'animedonghua', type: 'wp', base: 'https://animedonghua.com' },
  // { name: 'donghuazone', type: 'wp', base: 'https://donghuazone.com' },
  // { name: 'donghuastream', type: 'wp', base: 'https://donghuastream.com' },
  // { name: 'anime4i', type: 'wp', base: 'https://anime4i.com' },
  // { name: 'animecube live', type: 'wp', base: 'https://animecube.live' },
  // { name: 'bilibili', type: 'bilibili' },
  // { name: 'youku', type: 'youku' },
];

function loadList() {
  return JSON.parse(fs.readFileSync(ANIMELIST_PATH, 'utf-8'));
}
function saveList(list) {
  fs.writeFileSync(ANIMELIST_PATH, JSON.stringify(list, null, 2) + '\n', 'utf-8');
}

function safeFilename(title, ext = '.jpg') {
  const base = String(title || 'cover')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 120);
  return `${base}${ext}`;
}

function normalizeUrl(url, base) {
  if (!url) return null;
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (base) return new URL(url, base).toString();
  return null;
}

async function fetchHtml(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(url, { headers: DEFAULT_HEADERS, signal: controller.signal });
    if (!res.ok) return null;
    const text = await res.text();
    return text;
  } catch (err) {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function extractOgImage(html) {
  if (!html) return null;
  const $ = cheerio.load(html);
  const og = $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content');
  if (og) return og;
  const img = $('img').first().attr('src');
  return img || null;
}

async function searchWordpressSite(base, query) {
  const searchUrl = `${base}/?s=${encodeURIComponent(query)}`;
  const html = await fetchHtml(searchUrl);
  if (!html) return null;
  const $ = cheerio.load(html);
  const links = new Set();
  $('a').each((_, el) => {
    const href = $(el).attr('href');
    if (!href) return;
    const full = normalizeUrl(href, base);
    if (!full) return;
    if (!full.startsWith(base)) return;
    if (/\?s=/.test(full)) return;
    if (full.includes('#')) return;
    links.add(full);
  });

  for (const link of links) {
    const page = await fetchHtml(link);
    const og = extractOgImage(page);
    const img = normalizeUrl(og, base);
    if (img) return img;
  }
  return null;
}

async function searchBilibili(query) {
  const searchUrl = `https://search.bilibili.com/all?keyword=${encodeURIComponent(query)}`;
  const html = await fetchHtml(searchUrl);
  if (!html) return null;
  const $ = cheerio.load(html);
  const links = new Set();
  $('a').each((_, el) => {
    const href = $(el).attr('href');
    if (!href) return;
    if (!href.includes('bilibili.com')) return;
    const full = normalizeUrl(href, 'https://www.bilibili.com');
    if (!full) return;
    if (!full.includes('/video/') && !full.includes('/bangumi/')) return;
    links.add(full);
  });

  for (const link of links) {
    const page = await fetchHtml(link);
    const og = extractOgImage(page);
    const img = normalizeUrl(og, 'https://www.bilibili.com');
    if (img) return img;
  }
  return null;
}

async function searchYouku(query) {
  const searchUrl = `https://so.youku.com/search_video/q_${encodeURIComponent(query)}`;
  const html = await fetchHtml(searchUrl);
  if (!html) return null;
  const $ = cheerio.load(html);
  const links = new Set();
  $('a').each((_, el) => {
    const href = $(el).attr('href');
    if (!href) return;
    const full = normalizeUrl(href, 'https://v.youku.com');
    if (!full) return;
    if (!full.includes('v.youku.com')) return;
    if (!/v_show/.test(full)) return;
    links.add(full);
  });

  for (const link of links) {
    const page = await fetchHtml(link);
    const og = extractOgImage(page);
    const img = normalizeUrl(og, 'https://v.youku.com');
    if (img) return img;
  }
  return null;
}

async function downloadImage(url, dest) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(url, { headers: DEFAULT_HEADERS, signal: controller.signal });
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('image')) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buffer);
    return ct;
  } catch (err) {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function extFromContentType(ct) {
  if (!ct) return '.jpg';
  if (ct.includes('png')) return '.png';
  if (ct.includes('webp')) return '.webp';
  if (ct.includes('gif')) return '.gif';
  return '.jpg';
}

async function findImageForEntry(entry) {
  const query = entry.originalTitle || entry.title;
  if (!query) return null;

  for (const source of SOURCES) {
    let img = null;
    if (source.type === 'wp') {
      img = await searchWordpressSite(source.base, query);
    } else if (source.type === 'bilibili') {
      img = await searchBilibili(query);
    } else if (source.type === 'youku') {
      img = await searchYouku(query);
    }
    if (img) return { url: img, source: source.name };
  }
  return null;
}

function listMissingEntries(list) {
  return list.filter(entry => {
    const thumb = String(entry.thumbnail || '');
    const filename = String(entry.thumbnailFilename || '').trim();
    if (!thumb.startsWith('/uploads/') && filename === '') return false;
    const file = filename || thumb.replace('/uploads/', '');
    if (!file) return false;
    const localPath = path.join(UPLOADS_DIR, file);
    return !fs.existsSync(localPath);
  });
}

async function processEntry(entry) {
  const found = await findImageForEntry(entry);
  if (!found) return { status: 'not-found' };

  const extFromUrl = (() => {
    try {
      const p = new URL(found.url).pathname;
      const ext = path.extname(p);
      return ext || null;
    } catch {
      return null;
    }
  })();

  const filename = safeFilename(entry.title || entry.originalTitle || 'cover', extFromUrl || '.jpg');
  const dest = path.join(UPLOADS_DIR, filename);

  if (fs.existsSync(dest)) {
    entry.thumbnail = `/uploads/${filename}`;
    entry.thumbnailFilename = filename;
    entry.updatedAt = new Date().toISOString();
    return { status: 'reused', source: found.source, filename };
  }

  const ct = await downloadImage(found.url, dest);
  if (!ct) return { status: 'download-failed', source: found.source };

  // if content-type indicates different extension, rename
  const ext = extFromContentType(ct);
  if (ext && !filename.endsWith(ext)) {
    const renamed = safeFilename(entry.title || entry.originalTitle || 'cover', ext);
    const newDest = path.join(UPLOADS_DIR, renamed);
    fs.renameSync(dest, newDest);
    entry.thumbnail = `/uploads/${renamed}`;
    entry.thumbnailFilename = renamed;
  } else {
    entry.thumbnail = `/uploads/${filename}`;
    entry.thumbnailFilename = filename;
  }

  entry.updatedAt = new Date().toISOString();
  return { status: 'downloaded', source: found.source, filename: entry.thumbnailFilename };
}

async function run() {
  const list = loadList();
  const missing = listMissingEntries(list);
  const targets = typeof LIMIT === 'number' ? missing.slice(0, LIMIT) : missing;

  if (targets.length === 0) {
    console.log('no missing thumbnails detected');
    return;
  }

  console.log(`missing thumbnails: ${targets.length}`);
  const results = [];
  let ptr = 0;

  const workers = new Array(CONCURRENCY).fill(null).map(async () => {
    while (ptr < targets.length) {
      const i = ptr++;
      const entry = targets[i];
      try {
        const res = await processEntry(entry);
        results.push({ title: entry.title, uid: entry.uid, res });
        console.log(`[${res.status}] ${entry.title} (${res.source || 'n/a'})`);
      } catch (err) {
        results.push({ title: entry.title, uid: entry.uid, res: { status: 'error', error: String(err) } });
        console.log(`[error] ${entry.title}`);
      }
    }
  });

  await Promise.all(workers);

  const changed = results.filter(r => r.res && (r.res.status === 'downloaded' || r.res.status === 'reused'));
  console.log(`updated: ${changed.length}/${targets.length}`);

  if (!argv['dry-run'] && changed.length > 0) {
    saveList(list);
    console.log('wrote updates to prisma/animelist.json');
  } else if (argv['dry-run']) {
    console.log('dry-run: no file written');
  }
}

run().catch(err => { console.error(err); process.exit(1); });
