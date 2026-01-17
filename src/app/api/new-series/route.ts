import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

const SOURCES = [
  { name: 'lucifer donghua', url: 'https://luciferdonghua.com' },
  { name: 'bilibili', url: 'https://www.bilibili.com' },
  { name: 'youku', url: 'https://www.youku.com' },
  { name: 'animedonghua', url: 'https://animedonghua.com' },
  { name: 'donghuazone', url: 'https://donghuazone.com' },
  { name: 'donghuastream', url: 'https://donghuastream.org' },
  { name: 'anime4i', url: 'https://anime4i.com' },
  { name: 'animecube live', url: 'https://animecube.live' },
];

const ANIMELIST_GQL = 'https://graphql.anilist.co';

function decodeHtml(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&ndash;/g, '-')
    .replace(/&mdash;/g, '-')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_m, n) => String.fromCharCode(Number(n)));
}

function stripTags(text: string): string {
  return text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 120);
}

function extractTitles(html: string): string[] {
  const titles = new Set<string>();
  const anchorTitleRegex = /<a[^>]+title="([^"]{2,120})"/gi;
  const ariaLabelRegex = /aria-label="([^"]{2,120})"/gi;
  const h2Regex = /<h2[^>]*>([^<]{2,120})<\/h2>/gi;

  const collect = (regex: RegExp) => {
    let match;
    while ((match = regex.exec(html)) !== null) {
      const raw = decodeHtml(match[1] || '');
      const cleaned = stripTags(raw).trim();
      if (cleaned.length >= 2 && cleaned.length <= 120) {
        titles.add(cleaned);
      }
    }
  };

  collect(anchorTitleRegex);
  collect(ariaLabelRegex);
  collect(h2Regex);

  return Array.from(titles)
    .map(t => t.replace(/\s+Episode\s+\d+/i, '').trim())
    .filter(t => !/episode|trailer|preview|full\s*movie/i.test(t));
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; new-series-bot/1.0)' } });
  if (!res.ok) return '';
  return await res.text();
}

async function aniListDetails(title: string) {
  const query = `query ($search: String) { Media(search: $search, type: ANIME) { title { romaji english native } description coverImage { large medium } } }`;
  const res = await fetch(ANIMELIST_GQL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { search: title } })
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json?.data?.Media || null;
}

function normalizeAniList(media: any) {
  if (!media) return null;
  const title = media?.title?.english || media?.title?.romaji || media?.title?.native || '';
  const originalTitle = media?.title?.native || media?.title?.romaji || '';
  const summary = stripTags(decodeHtml(media?.description || '')).slice(0, 500);
  const thumbnail = media?.coverImage?.large || media?.coverImage?.medium || '';
  return { title, originalTitle, summary, thumbnail };
}

export async function GET() {
  const animelistPath = path.resolve(process.cwd(), 'prisma/animelist.json');
  const list = JSON.parse(fs.readFileSync(animelistPath, 'utf8')) as { title?: string, originalTitle?: string }[];
  const existing = new Set<string>(list.flatMap(a => [a.title, a.originalTitle]).filter(Boolean).map(v => String(v).toLowerCase()));

  const collected = new Set<string>();

  for (const source of SOURCES) {
    try {
      const html = await fetchHtml(source.url);
      extractTitles(html).forEach(title => collected.add(title));
    } catch {
      // ignore per-source failures
    }
  }

  const candidates = Array.from(collected)
    .filter(t => t.length >= 2)
    .filter(t => !existing.has(t.toLowerCase()))
    .slice(0, 24);

  const items = [] as Array<{ uid: string, title: string, originalTitle?: string, summary?: string, thumbnail?: string }>;
  for (const title of candidates) {
    const media = await aniListDetails(title).catch(() => null);
    const normalized = normalizeAniList(media);
    const finalTitle = normalized?.title || title;
    if (existing.has(finalTitle.toLowerCase())) continue;
    items.push({
      uid: slugify(finalTitle),
      title: finalTitle,
      originalTitle: normalized?.originalTitle,
      summary: normalized?.summary,
      thumbnail: normalized?.thumbnail,
    });
  }

  return NextResponse.json({ items });
}
