#!/usr/bin/env node
/*
  scripts/add-anime.js
  - Usage: node scripts/add-anime.js --title "The Other Side of Deep Space" [--seed] [--dry-run]
  - What it does:
    1. Try to fetch metadata from AniList (primary) and fall back to lightweight scrapers
       for common donghua sites (best-effort, selectors are brittle and optional).
    2. Normalize the result to the project's AnimeType shape.
    3. Insert the anime into `prisma/animelist.json` (skip if duplicate by title/originalTitle).
    4. Optionally run `make seed` when --seed is provided.

  Notes:
  - The script is resilient: missing fields are tolerated and left empty.
  - For production-grade scraping you should add robust selectors and respect robots.txt / site TOS.
*/

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

async function maybeImportFetch() {
  if (typeof fetch !== 'undefined') return fetch;
  try {
    const v = await import('node-fetch');
    return v.default;
  } catch (err) {
    throw new Error('fetch is not available and node-fetch could not be loaded');
  }
}

const argv = require('minimist')(process.argv.slice(2), {
  string: ['title'],
  boolean: ['seed', 'dry-run', 'help'],
  alias: { t: 'title' }
});

if (argv.help || !argv.title) {
  console.log('Usage: node scripts/add-anime.js --title "The Other Side of Deep Space" [--seed] [--dry-run]');
  process.exit(argv.help ? 0 : 1);
}

const ANIMELIST_PATH = path.resolve(__dirname, '../prisma/animelist.json');
const fetchP = maybeImportFetch();

const { v4: uuidv4 } = require('uuid');
const cheerio = require('cheerio');

function stripHtml(html = '') {
  return html.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').trim();
}

async function queryAniList(title) {
  const fetch = await fetchP;
  const query = `query ($search: String) { Media(search: $search, type: ANIME) { id title { romaji english native } synonyms description episodes coverImage { large medium } startDate { year month day } status } }`;
  const res = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { search: title } })
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json?.data?.Media || null;
}

async function tryScrapeDonghuaSites(title) {
  const fetch = await fetchP;
  const encoded = encodeURIComponent(title);
  const candidates = [
    `https://donghuastream.org/?s=${encoded}`,
    `https://donghuazone.com/?s=${encoded}`,
    `https://animedonghua.com/?s=${encoded}`,
    `https://anime4i.com/?s=${encoded}`,
    `https://www.bilibili.com/search?keyword=${encoded}`
  ];
  for (const url of candidates) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'node.js (+https://github.com)' } } );
      if (!res.ok) continue;
      const body = await res.text();
      const $ = cheerio.load(body);
      // best-effort selectors (very site-specific) - return partial data when found
      const titleEl = $('h1.entry-title, .post-title, .video-title').first().text().trim() || $("meta[property='og:title']").attr('content');
      const desc = $("meta[name='description']").attr('content') || $("meta[property='og:description']").attr('content') || $('.entry-summary, .summary').first().text();
      const thumb = $("meta[property='og:image']").attr('content') || $('img').first().attr('src');
      if (titleEl || desc || thumb) {
        return { title: titleEl, summary: stripHtml(desc || ''), thumbnail: thumb };
      }
    } catch (err) {
      // ignore and continue
    }
  }
  return null;
}

function normalizeAniListResult(a) {
  if (!a) return null;
  const title = a.title?.english || a.title?.romaji || a.title?.native || '';
  const originalTitle = a.title?.native || a.title?.romaji || '';
  const summary = stripHtml(a.description || '');
  const thumbnail = (a.coverImage && (a.coverImage.large || a.coverImage.medium)) || '';
  const episodes = a.episodes || 0;
  const start = a.startDate && a.startDate.year ? new Date(a.startDate.year, (a.startDate.month||1)-1, a.startDate.day||1).toISOString() : null;
  const status = (a.status || '').toLowerCase();
  return { title, originalTitle, summary, thumbnail, episodes, start, status };
}

function choosePrimary(obj) {
  // prefer AniList, then scrapers
  return obj || {};
}

async function buildAnimeObject(title) {
  const al = await queryAniList(title).catch(()=>null);
  const aln = normalizeAniListResult(al);
  let scraped = null;
  if (!aln || !aln.summary || !aln.thumbnail) {
    scraped = await tryScrapeDonghuaSites(title).catch(()=>null);
  }
  const primary = choosePrimary(aln) || {};
  const summary = primary.summary || (scraped && scraped.summary) || '';
  const thumbnail = primary.thumbnail || (scraped && scraped.thumbnail) || '';
  const originalTitle = primary.originalTitle || '';
  const totalEpisodes = primary.episodes || 0;
  const releaseAt = primary.start || new Date().toISOString();
  const updateAt = new Date().toISOString();
  const uid = uuidv4();

  return {
    uid,
    title: primary.title || title,
    updateDays: '',
    type: 'series',
    status: primary.status === 'FINISHED' || primary.status === 'RELEASED' ? 'completed' : (primary.status || 'ongoing'),
    summary,
    thumbnail: thumbnail || '',
    thumbnailFilename: thumbnail ? `${title.replace(/[^a-z0-9]+/gi,'-').replace(/(^-|-$)/g,'')}.jpg` : null,
    studio: '',
    releaseAt,
    updatedAt: updateAt,
    publishedAt: releaseAt,
    publishedBy: '',
    subtitle: '',
    originalTitle: originalTitle || '',
    firstSeasonEpisode: 1,
    lastSeasonEpisode: totalEpisodes,
    totalSeasonEpisodes: totalEpisodes,
    lastEpisode: totalEpisodes,
    totalEpisodes: totalEpisodes
  };
}

function loadAnimelist() {
  const raw = fs.readFileSync(ANIMELIST_PATH, 'utf-8');
  return JSON.parse(raw);
}

function saveAnimelist(list) {
  fs.writeFileSync(ANIMELIST_PATH, JSON.stringify(list, null, 2) + '\n', 'utf-8');
}

async function main() {
  const title = String(argv.title).trim();
  console.log(`searching metadata for: ${title}`);

  const anime = await buildAnimeObject(title);
  // allow user to override minimal fields via CLI in future (not implemented now)

  const list = loadAnimelist();
  const exists = list.find(a => (a.title && a.title.toLowerCase() === anime.title.toLowerCase()) || (a.originalTitle && anime.originalTitle && a.originalTitle === anime.originalTitle));
  if (exists) {
    console.log('skipped — an entry with same title/originalTitle already exists (no-op):', exists.uid);
    process.exit(0);
  }

  // insert at top for visibility
  list.unshift(anime);

  if (argv['dry-run']) {
    console.log('dry-run: the following object would be written to prisma/animelist.json:\n');
    console.log(JSON.stringify(anime, null, 2));
    process.exit(0);
  }

  saveAnimelist(list);
  console.log(`wrote ${ANIMELIST_PATH} — added uid=${anime.uid}`);

  if (argv.seed) {
    console.log('running `make seed` to update database...');
    const r = spawnSync('make', ['seed'], { stdio: 'inherit' });
    process.exit(r.status || 0);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
