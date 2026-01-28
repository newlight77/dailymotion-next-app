import type { PrismaClient } from '@prisma/client';

type RatingsMap = Record<string, { average: number; count: number }>;

type CacheEntry<T> = {
  expiresAt: number;
  value: T;
};

const DEFAULT_TTL_MS = 60 * 1000;

const ratingsMapCache = new Map<string, CacheEntry<RatingsMap>>();
const ratingSingleCache = new Map<string, CacheEntry<{ average: number; count: number }>>();

const now = () => Date.now();

const getCacheKey = (animeIds: string[]) => animeIds.slice().sort().join('|');

const readCache = <T>(cache: Map<string, CacheEntry<T>>, key: string): T | null => {
  const entry = cache.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= now()) {
    cache.delete(key);
    return null;
  }
  return entry.value;
};

const writeCache = <T>(cache: Map<string, CacheEntry<T>>, key: string, value: T, ttlMs: number) => {
  cache.set(key, { value, expiresAt: now() + ttlMs });
};

export const getRatingsMap = async (
  prisma: PrismaClient,
  animeIds: string[],
  ttlMs: number = DEFAULT_TTL_MS
): Promise<RatingsMap> => {
  if (!animeIds || animeIds.length === 0) return {};
  const key = getCacheKey(animeIds);
  const cached = readCache(ratingsMapCache, key);
  if (cached) return cached;

  const ratingGroups = await prisma.rating.groupBy({
    by: ['animeId'],
    where: { animeId: { in: animeIds } },
    _avg: { value: true },
    _count: { value: true },
  });

  const map: RatingsMap = {};
  ratingGroups.forEach(rg => {
    map[rg.animeId] = { average: rg._avg.value ?? 0, count: rg._count.value ?? 0 };
  });

  writeCache(ratingsMapCache, key, map, ttlMs);
  return map;
};

export const getRatingForAnime = async (
  prisma: PrismaClient,
  animeId: string,
  ttlMs: number = DEFAULT_TTL_MS
): Promise<{ average: number; count: number }> => {
  if (!animeId) return { average: 0, count: 0 };
  const cached = readCache(ratingSingleCache, animeId);
  if (cached) return cached;

  const aggregate = await prisma.rating.aggregate({
    where: { animeId },
    _avg: { value: true },
    _count: { value: true },
  });

  const result = { average: aggregate._avg.value ?? 0, count: aggregate._count.value ?? 0 };
  writeCache(ratingSingleCache, animeId, result, ttlMs);
  return result;
};

export const invalidateRatingCache = (animeId?: string) => {
  if (animeId) {
    ratingSingleCache.delete(animeId);
  }
  ratingsMapCache.clear();
};
