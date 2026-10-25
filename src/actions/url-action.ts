"use server";

import { createHash, randomBytes } from "node:crypto";
import { headers } from "next/headers";
import QRCode from "qrcode";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCachedLink, setCachedLink } from "@/lib/redis";
import {
  createShortLinkSchema,
  generateQrSchema,
  shortSlugSchema,
  type CachedShortLink,
} from "@/schemas/url-schema";

const CACHE_KEY_PREFIX = "clipath:v1";
const CUSTOM_ALIAS_TAKEN_ERROR = "Custom URL already taken.";

const getShortLinkUrl = (slug: string) => {
  const configuredBaseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.BETTER_AUTH_URL ??
    "http://localhost:3000";
  return new URL(`/${slug}`, new URL(configuredBaseUrl).origin).toString();
};

const getUrlCacheKey = (scope: string, longUrl: string) => {
  const urlHash = createHash("sha256").update(longUrl).digest("hex");
  return `${CACHE_KEY_PREFIX}:url:${scope}:${urlHash}`;
};

const getSlugCacheKey = (slug: string) => `${CACHE_KEY_PREFIX}:slug:${slug}`;

const getIdCacheKey = (id: string) => `${CACHE_KEY_PREFIX}:id:${id}`;

//convert data from prisma to cached data type like change date to iso string
const toCachedLink = (link: {
  id: string;
  longUrl: string;
  shortUrl: string;
  dedupeScope: string;
  userId: string | null;
  qrCodeUrl: string | null;
  createdAt: Date;
}): CachedShortLink => ({
  id: link.id,
  longUrl: link.longUrl,
  slug: link.shortUrl,
  dedupeScope: link.dedupeScope,
  userId: link.userId,
  qrCodeUrl: link.qrCodeUrl,
  createdAt: link.createdAt.toISOString(),
});

const toLinkResult = (link: CachedShortLink) => ({
  id: link.id,
  longUrl: link.longUrl,
  slug: link.slug,
  isOwned: link.userId !== null,
  shortUrl: getShortLinkUrl(link.slug),
  qrCodeUrl: link.qrCodeUrl,
});

function isUniqueConstraintError(error: unknown): error is { code: "P2002" } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

async function saveLinkCache(link: CachedShortLink) {
  await Promise.all([
    setCachedLink(getUrlCacheKey(link.dedupeScope, link.longUrl), link),
    setCachedLink(getSlugCacheKey(link.slug), link),
    setCachedLink(getIdCacheKey(link.id), link),
  ]);
}

async function ensureQrCode(link: CachedShortLink) {
  if (link.qrCodeUrl) {
    return link;
  }

  const generatedQrCode = await QRCode.toDataURL(getShortLinkUrl(link.slug), {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 512,
  });
  const updated = await prisma.link.updateMany({
    where: { id: link.id, qrCodeUrl: null },
    data: { qrCodeUrl: generatedQrCode },
  });

  if (updated.count === 1) {
    return { ...link, qrCodeUrl: generatedQrCode };
  }

  const savedLink = await prisma.link.findUnique({
    where: { id: link.id },
    select: {
      id: true,
      longUrl: true,
      shortUrl: true,
      dedupeScope: true,
      userId: true,
      qrCodeUrl: true,
      createdAt: true,
    },
  });

  if (!savedLink?.qrCodeUrl) {
    throw new Error("The QR code could not be saved to this link.");
  }

  return toCachedLink(savedLink);
}

export async function createShortLink(input: unknown) {
  const parsedInput = createShortLinkSchema.safeParse(input);
  if (!parsedInput.success) {
    throw new Error(
      parsedInput.error.issues[0]?.message ?? "Invalid link data.",
    );
  }

  const { url: longUrl, customAlias, generateQr } = parsedInput.data;
  const session = await auth.api.getSession({ headers: await headers() });
  if (generateQr && !session?.user) {
    throw new Error("Sign in to create and save a QR code.");
  }

  const userId = session?.user.id ?? null;
  const dedupeScope = userId ? `user:${userId}` : "anonymous";
  const urlCacheKey = getUrlCacheKey(dedupeScope, longUrl);

  // checks for link in cache
  let link = await getCachedLink(urlCacheKey);

  if (link && customAlias && customAlias !== link.slug) {
    throw new Error("This URL already has a different short link.");
  }

  // if link is not in cache, check for it in the database
  if (!link) {
    const existingLink = await prisma.link.findUnique({
      where: {
        dedupeScope_longUrl: { dedupeScope, longUrl },
      },
      select: {
        id: true,
        longUrl: true,
        shortUrl: true,
        dedupeScope: true,
        userId: true,
        qrCodeUrl: true,
        createdAt: true,
      },
    });

    if (existingLink) {
      link = toCachedLink(existingLink);
    }
  }

  // if link is found in cache or database, check if the custom alias is different from the existing one
  if (link && customAlias && customAlias !== link.slug) {
    throw new Error("This URL already has a different short link.");
  }

  // if link is not found in cache or database, create a new one
  if (!link) {
    // check if the custom alias is already taken
    if (customAlias) {
      const existingShortUrl = await prisma.link.findUnique({
        where: { shortUrl: customAlias },
        select: { id: true },
      });

      if (existingShortUrl) {
        throw new Error(CUSTOM_ALIAS_TAKEN_ERROR);
      }
    }

    const slug = customAlias ?? randomBytes(6).toString("hex");
    const newLink = {
      longUrl,
      dedupeScope,
      shortUrl: slug,
      userId,
      qrCodeUrl: null as string | null,
    };

    const qrCodeUrl = generateQr
      ? await QRCode.toDataURL(getShortLinkUrl(slug), {
          errorCorrectionLevel: "H",
          margin: 2,
          width: 512,
        })
      : null;

    try {
      // try to create the link
      const savedLink = await prisma.link.upsert({
        where: {
          dedupeScope_longUrl: { dedupeScope, longUrl },
        },
        create: { ...newLink, qrCodeUrl },
        update: {},
        select: {
          id: true,
          longUrl: true,
          shortUrl: true,
          dedupeScope: true,
          userId: true,
          qrCodeUrl: true,
          createdAt: true,
        },
      });
      link = toCachedLink(savedLink);
    } catch (error) {
      if (!isUniqueConstraintError(error)) {
        throw error;
      }
      // if error in creating link check for it in database
      const existingLink = await prisma.link.findUnique({
        where: {
          dedupeScope_longUrl: { dedupeScope, longUrl },
        },
        select: {
          id: true,
          longUrl: true,
          shortUrl: true,
          dedupeScope: true,
          userId: true,
          qrCodeUrl: true,
          createdAt: true,
        },
      });

      if (!existingLink) {
        if (customAlias) {
          throw new Error(CUSTOM_ALIAS_TAKEN_ERROR);
        }
        throw error;
      }
      link = toCachedLink(existingLink);
    }

    if (customAlias && customAlias !== link.slug) {
      throw new Error("This URL already has a different short link.");
    }
  }

  if (generateQr) {
    link = await ensureQrCode(link);
  }

  await saveLinkCache(link);
  return toLinkResult(link);
}

export async function generateQrForLink(input: unknown): Promise<string> {
  const parsedLinkId = generateQrSchema.safeParse(input);
  if (!parsedLinkId.success) {
    throw new Error("A valid link is required to create a QR code.");
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error("Sign in to create and save a QR code.");
  }

  //check for cache link
  const cachedEntry = await getCachedLink(getIdCacheKey(parsedLinkId.data));
  if (cachedEntry) {
    if (cachedEntry.userId !== session.user.id) {
      throw new Error("This link is not saved to your account.");
    }

    const linkWithQrCode = await ensureQrCode(cachedEntry);
    if (!linkWithQrCode.qrCodeUrl) {
      throw new Error("The QR code could not be saved to this link.");
    }
    await saveLinkCache(linkWithQrCode);
    return linkWithQrCode.qrCodeUrl;
  }

  // if not in cache create one
  const link = await prisma.link.findFirst({
    where: { id: parsedLinkId.data, userId: session.user.id },
    select: {
      id: true,
      longUrl: true,
      shortUrl: true,
      dedupeScope: true,
      userId: true,
      qrCodeUrl: true,
      createdAt: true,
    },
  });

  if (!link) {
    throw new Error("This link is not saved to your account.");
  }

  const cachedLink = await ensureQrCode(toCachedLink(link));
  await saveLinkCache(cachedLink);
  if (!cachedLink.qrCodeUrl) {
    throw new Error("The QR code could not be saved to this link.");
  }
  return cachedLink.qrCodeUrl;
}

export async function getShortLinkRedirect(input: unknown) {
  const parsedSlug = shortSlugSchema.safeParse(input);
  if (!parsedSlug.success) {
    return null;
  }
  const slug = parsedSlug.data;

  const cacheKey = getSlugCacheKey(slug);
  const cachedLink = await getCachedLink(cacheKey);
  if (cachedLink) {
    return { id: cachedLink.id, longUrl: cachedLink.longUrl };
  }

  const link = await prisma.link.findUnique({
    where: { shortUrl: slug },
    select: {
      id: true,
      longUrl: true,
      shortUrl: true,
      dedupeScope: true,
      userId: true,
      qrCodeUrl: true,
      createdAt: true,
    },
  });
  if (link) {
    const cacheRecord = toCachedLink(link);
    await saveLinkCache(cacheRecord);
    return { id: link.id, longUrl: link.longUrl };
  }

  return null;
}
