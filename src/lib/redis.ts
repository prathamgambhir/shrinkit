import { Redis } from "@upstash/redis";
import {
  cachedShortLinkSchema,
  type CachedShortLink,
} from "@/schemas/url-schema";

const CACHE_TTL_SECONDS = 60 * 60 * 24;
const redisUrl =
  process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const redisToken =
  process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
const redis =
  redisUrl && redisToken
    ? new Redis({ url: redisUrl, token: redisToken })
    : null;

let missingRedisConfigurationLogged = false;

function getRedisClient() {
  if (!redis && !missingRedisConfigurationLogged) {
    console.warn(
      "Upstash Redis is not configured. Link requests will use the database without caching.",
    );
    missingRedisConfigurationLogged = true;
  }

  return redis;
}

export async function getCachedLink(
  key: string,
): Promise<CachedShortLink | null> {
  const client = getRedisClient();
  if (!client) {
    return null;
  }

  let cached: unknown;
  try {
    cached = await client.get<unknown>(key);
  } catch (error) {
    console.error("Could not read the short-link cache.", error);
    return null;
  }

  if (cached === null) {
    return null;
  }

  const result = cachedShortLinkSchema.safeParse(cached);
  if (result.success) {
    return result.data;
  }

  // if not safe parse deleting the existing invalid entry from redis
  console.error("Discarding an invalid short-link cache entry.", result.error);
  try {
    await client.del(key);
  } catch (error) {
    console.error("Could not remove an invalid short-link cache entry.", error);
  }
  return null;
}

export async function setCachedLink(key: string, value: CachedShortLink) {
  const client = getRedisClient();
  if (!client) {
    return;
  }

  try {
    await client.set(key, value, { ex: CACHE_TTL_SECONDS });
  } catch (error) {
    console.error("Could not write the short-link cache.", error);
  }
}
