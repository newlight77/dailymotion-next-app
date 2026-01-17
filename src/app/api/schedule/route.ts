import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const SOURCES = [
  {
    name: 'lucifer donghua',
    searchUrl: (q: string) => `https://luciferdonghua.com/?s=${q}`,
  },
  {
    name: 'bilibili',
    searchUrl: (q: string) => `https://www.bilibili.com/search?keyword=${q}`,
  },
  {
    name: 'youku',
    searchUrl: (q: string) => `https://so.youku.com/search_video/q_${q}`,
  },
  {
    name: 'animedonghua',
    searchUrl: (q: string) => `https://animedonghua.com/?s=${q}`,
  },
  {
    name: 'donghuazone',
    searchUrl: (q: string) => `https://donghuazone.com/?s=${q}`,
  },
  {
    name: 'donghuastream',
    searchUrl: (q: string) => `https://donghuastream.org/?s=${q}`,
  },
  {
    name: 'anime4i',
    searchUrl: (q: string) => `https://anime4i.com/?s=${q}`,
  },
  {
    name: 'animecube live',
    searchUrl: (q: string) => `https://animecube.live/?s=${q}`,
  },
];

const datePatterns = [
  /\b(20\d{2}[\/-]\d{1,2}[\/-]\d{1,2})\b/,
  /\b(\d{1,2}[\/-]\d{1,2}[\/-]20\d{2})\b/,
  /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+20\d{2}\b/i,
];

const episodePatterns = [
  /\bEpisode\s*([0-9]{1,4})\b/i,
  /\bEP\s*([0-9]{1,4})\b/i,
  /第\s*([0-9]{1,4})\s*集/,
  /第\s*([0-9]{1,4})\s*话/,
];

function parseDateCandidate(text: string): string | undefined {
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      const date = new Date(match[1]);
      if (!Number.isNaN(date.getTime())) return date.toISOString();
    }
  }
  return undefined;
}

function parseEpisodeCandidate(text: string): number | string | undefined {
  for (const pattern of episodePatterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      const num = Number(match[1]);
      return Number.isNaN(num) ? match[1] : num;
    }
  }
  return undefined;
}

function parseUnixDateCandidate(value?: string): string | undefined {
  if (!value) return undefined;
  const num = Number(value);
  if (Number.isNaN(num)) return undefined;
  const ms = num > 1e12 ? num : num * 1000;
  const date = new Date(ms);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function stripHtml(html: string): string {
  return html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractMetaDate(html: string): string | undefined {
  const metaMatch = html.match(/property="article:(modified_time|published_time)" content="([^"]+)"/i)
    || html.match(/property="og:(updated_time|published_time)" content="([^"]+)"/i)
    || html.match(/name="date" content="([^"]+)"/i)
    || html.match(/name="pubdate" content="([^"]+)"/i);
  const raw = metaMatch?.[2] || metaMatch?.[3] || metaMatch?.[1];
  if (!raw) return undefined;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function extractWordpressSignals(html: string): { date?: string, episode?: number | string } {
  const dateMatch = html.match(/class="entry-date"[^>]*datetime="([^"]+)"/i)
    || html.match(/class="entry-date"[^>]*>([^<]+)</i)
    || html.match(/datetime="([^"]+)"/i);
  const date = dateMatch ? parseDateCandidate(dateMatch[1]) || parseDateCandidate(dateMatch[2] || '') : undefined;

  const titleMatch = html.match(/property="og:title" content="([^"]+)"/i)
    || html.match(/<title>([^<]+)<\/title>/i);
  const titleText = titleMatch?.[1] || '';
  const episode = parseEpisodeCandidate(titleText) || undefined;

  return { date, episode };
}

function extractBilibiliSignals(html: string): { date?: string, episode?: number | string } {
  const pubDateMatch = html.match(/"pubdate"\s*:\s*"?([0-9]{10,13}|[0-9\-:T+ ]+)"?/i);
  const date = parseUnixDateCandidate(pubDateMatch?.[1]) || parseDateCandidate(pubDateMatch?.[1] || '');

  const episodeMatch = html.match(/"index"\s*:\s*"([^"]+)"/i)
    || html.match(/"title"\s*:\s*"([^"]+第\s*\d+\s*[话集][^"]*)"/i);
  const episode = parseEpisodeCandidate(episodeMatch?.[1] || '');

  return { date, episode };
}

function extractYoukuSignals(html: string): { date?: string, episode?: number | string } {
  const releaseMatch = html.match(/"releaseDate"\s*:\s*"([^"]+)"/i)
    || html.match(/"publishTime"\s*:\s*"([^"]+)"/i);
  const date = parseDateCandidate(releaseMatch?.[1] || '');

  const updateMatch = html.match(/"updateInfo"\s*:\s*"([^"]+)"/i)
    || html.match(/更新至\s*([0-9]{1,4})\s*[集话]/);
  const episode = parseEpisodeCandidate(updateMatch?.[1] || updateMatch?.[0] || '');

  return { date, episode };
}

function extractAnimecubeSignals(html: string): { date?: string, episode?: number | string } {
  const nextMatch = html.match(/Next\s*Episode\s*[:\-]?\s*([0-9]{1,4})/i)
    || html.match(/Episode\s*([0-9]{1,4})\s*\|\s*([0-9]{4}[\/-][0-9]{1,2}[\/-][0-9]{1,2})/i);
  const episode = parseEpisodeCandidate(nextMatch?.[0] || '');
  const date = parseDateCandidate(nextMatch?.[2] || nextMatch?.[0] || '');
  return { date, episode };
}

function extractFromSource(html: string, sourceName: string): { date?: string, episode?: number | string } {
  switch (sourceName) {
    case 'bilibili':
      return extractBilibiliSignals(html);
    case 'youku':
      return extractYoukuSignals(html);
    case 'animecube live':
      return extractAnimecubeSignals(html);
    case 'lucifer donghua':
    case 'animedonghua':
    case 'donghuazone':
    case 'donghuastream':
    case 'anime4i':
      return extractWordpressSignals(html);
    default:
      return {};
  }
}

async function fetchUpcomingFromSource(source: { name: string, searchUrl: (q: string) => string }, title: string) {
  const url = source.searchUrl(encodeURIComponent(title));
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; schedule-bot/1.0)' } });
  if (!res.ok) return null;
  const html = await res.text();

  const sourceSignals = extractFromSource(html, source.name);
  const metaDate = extractMetaDate(html);
  const bodyText = stripHtml(html);
  const date = sourceSignals.date || metaDate || parseDateCandidate(bodyText);
  const episode = sourceSignals.episode || parseEpisodeCandidate(bodyText);

  if (!date && !episode) return null;

  return {
    title,
    source: source.name,
    episode,
    date,
    url
  };
}

async function fetchUpcomingFromSources(title: string) {
  for (const source of SOURCES) {
    try {
      const result = await fetchUpcomingFromSource(source, title);
      if (result) return result;
    } catch {
      // ignore errors and continue
    }
  }
  return null;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const items = Array.isArray(body?.items) ? body.items : [];

  const results = await Promise.all(
    items.map(async (item: { title?: string, originalTitle?: string }) => {
      const title = (item?.title || '').trim();
      const originalTitle = (item?.originalTitle || '').trim();
      if (!title && !originalTitle) return null;
      const primary = title || originalTitle;
      const found = (title ? await fetchUpcomingFromSources(title) : null)
        || (originalTitle ? await fetchUpcomingFromSources(originalTitle) : null);
      return found || { title: primary, source: 'estimate', isEstimate: true };
    })
  );

  return NextResponse.json({
    items: results.filter(Boolean)
  });
}
