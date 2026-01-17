#!/usr/bin/env node
/**
 * scripts/update-official-thumbs.js
 * - Usage: node scripts/update-official-thumbs.js --titles "Title1,Title2" [--seed] [--dry-run]
 * - Looks up AniList (no API key) and optionally TMDB (requires TMDB_API_KEY env var)
 *   and replaces `thumbnail` + `thumbnailFilename` in prisma/animelist.json for matching titles.
 * - Matching rules: case-insensitive match on `title` or `originalTitle`.
 * - Outputs a summary and can run `make seed` when --seed is provided.
 *
 * Notes:
 * - AniList often contains Chinese/Asian titles; TMDB gives higher-res posters when available.
 * - Provide TMDB_API_KEY in your environment to prefer TMDB posters.
 */

const fs = require('fs');
const path = require('path');
const spawnSync = require('child_process').spawnSync;
const argv = require('minimist')(process.argv.slice(2), { string: ['titles'], boolean: ['seed', 'dry-run'] });

if (!argv.titles) {
  console.error('Usage: node scripts/update-official-thumbs.js --titles "Title A,Title B" [--seed] [--dry-run]');
  process.exit(1);
}

const ANIMELIST_PATH = path.resolve(__dirname, '../prisma/animelist.json');
const TMDB_KEY = process.env.TMDB_API_KEY || '';

async function fetchAniListCover(title) {
  try {
    const query = `query($search: String){ Media(search:$search, type:ANIME){ id title { romaji english native } coverImage { large extraLarge } siteUrl } }`;
    const res = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query, variables: { search: title } })
    });
    if (!res.ok) return null;
    const json = await res.json();
    const media = json?.data?.Media;
    if (!media) return null;
    const url = media.coverImage?.extraLarge || media.coverImage?.large || null;
    return { url, source: 'anilist', siteUrl: media.siteUrl };
  } catch (err) {
    return null;
  }
}

async function fetchTmdbPoster(title) {
  if (!TMDB_KEY) return null;
  try {
    const q = encodeURIComponent(title);
    const res = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${TMDB_KEY}&query=${q}`);
    if (!res.ok) return null;
    const json = await res.json();
    const result = (json.results || [])[0];
    if (!result || !result.poster_path) return null;
    return { url: `https://image.tmdb.org/t/p/original${result.poster_path}`, source: 'tmdb', tmdbId: result.id };
  } catch (err) {
    return null;
  }
}

function loadList() {
  return JSON.parse(fs.readFileSync(ANIMELIST_PATH, 'utf-8'));
}

function saveList(list) {
  fs.writeFileSync(ANIMELIST_PATH, JSON.stringify(list, null, 2) + '\n', 'utf-8');
}

function filenameFromUrl(url, title) {
  try {
    const ext = path.extname(new URL(url).pathname) || '.jpg';
    const safe = title.replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)/g, '').toLowerCase();
    return `${safe}${ext}`;
  } catch (err) {
    return title.replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)/g, '').toLowerCase() + '.jpg';
  }
}

async function main() {
  const titles = String(argv.titles).split(',').map(s => s.trim()).filter(Boolean);
  if (titles.length === 0) {
    console.error('no titles provided');
    process.exit(1);
  }

  const list = loadList();
  const changes = [];

  for (const t of titles) {
    const foundIdx = list.findIndex(i => (i.title && i.title.toLowerCase() === t.toLowerCase()) || (i.originalTitle && i.originalTitle.toLowerCase() === t.toLowerCase()));
    if (foundIdx === -1) {
      console.warn(`no local entry found for "${t}" — skipping`);
      continue;
    }
    const entry = list[foundIdx];
    process.stdout.write(`looking up official cover for "${t}" ... `);

    // prefer AniList
    const ani = await fetchAniListCover(t).catch(()=>null);
    let chosen = ani;

    // fallback/augment with TMDB if key present
    if ((!chosen || !chosen.url) && TMDB_KEY) {
      const tm = await fetchTmdbPoster(t).catch(()=>null);
      if (tm && tm.url) chosen = tm;
    }

    if (!chosen || !chosen.url) {
      console.log('not found on AniList/TMDB');
      continue;
    }

    const newThumb = chosen.url;
    const newFilename = filenameFromUrl(newThumb, entry.title || t);

    if (entry.thumbnail && entry.thumbnail === newThumb) {
      console.log('already up-to-date');
      continue;
    }

    console.log(`found (${chosen.source})`);
    const before = { thumbnail: entry.thumbnail, thumbnailFilename: entry.thumbnailFilename };
    entry.thumbnail = newThumb;
    entry.thumbnailFilename = newFilename;
    entry.updatedAt = new Date().toISOString();

    changes.push({ title: t, uid: entry.uid, before, after: { thumbnail: entry.thumbnail, thumbnailFilename: entry.thumbnailFilename } });
    list[foundIdx] = entry;
  }

  if (changes.length === 0) {
    console.log('no changes to write');
    return;
  }

  console.log('---\nchanges:');
  changes.forEach(c => console.log(`- ${c.title} (${c.uid})\n    from: ${c.before.thumbnail}\n    to:   ${c.after.thumbnail}\n`));

  if (argv['dry-run']) {
    console.log('\nDry-run: no file written.');
    return;
  }

  saveList(list);
  console.log('\nWritten updates to prisma/animelist.json');

  if (argv.seed) {
    console.log('running `make seed`...');
    const r = spawnSync('make', ['seed'], { stdio: 'inherit' });
    process.exit(r.status || 0);
  }
}

// ensure global fetch available
(async()=>{
  if (typeof fetch === 'undefined') {
    try { global.fetch = (await import('node-fetch')).default; } catch(e) { /* continue - script will fail later with helpful message */ }
  }
  await main();
})();
