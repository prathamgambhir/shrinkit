"use server";

import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import QRCode from "qrcode";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const reservedAliases = new Set(["api", "auth", "favicon.ico"]);

const getShortLinkUrl = (slug: string) => {
  const configuredBaseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.BETTER_AUTH_URL ??
    "http://localhost:3000";
  const baseUrl = new URL(configuredBaseUrl).origin;
  return new URL(`/${slug}`, baseUrl).toString();
};

export async function createShortLink(input: {
  url: string;
  customAlias?: string;
  generateQr?: boolean;
}) {
  if (!input || typeof input.url !== "string") {
    throw new Error("Enter a valid destination URL.");
  }

  const destination = input.url.trim();
  let destinationUrl: URL;

  try {
    destinationUrl = new URL(destination);
  } catch {
    throw new Error("Enter a valid destination URL.");
  }

  if (
    !["http:", "https:"].includes(destinationUrl.protocol) ||
    !destinationUrl.hostname ||
    destinationUrl.username ||
    destinationUrl.password
  ) {
    throw new Error(
      "Destination URLs must use HTTP or HTTPS and cannot contain credentials.",
    );
  }

  if (
    input.customAlias !== undefined &&
    typeof input.customAlias !== "string"
  ) {
    throw new Error("Enter a valid custom alias.");
  }

  const aliasInput = input.customAlias?.trim();
  const customAlias = aliasInput ? aliasInput.toLowerCase() : undefined;
  const generateQr = input.generateQr === true;

  if (customAlias && !/^[a-z0-9_-]{1,40}$/.test(customAlias)) {
    throw new Error(
      "Aliases may contain only letters, numbers, underscores, or hyphens (up to 40 characters).",
    );
  }

  if (customAlias && reservedAliases.has(customAlias)) {
    throw new Error("That alias is reserved. Please choose another one.");
  }

  const session = await auth.api.getSession({ headers: await headers() });

  if ((customAlias || generateQr) && !session?.user) {
    throw new Error("Sign in to create custom aliases or QR codes.");
  }

  const slug = customAlias ?? randomBytes(6).toString("hex");

  if (customAlias) {
    const existingLink = await prisma.link.findUnique({
      where: { shortUrl: customAlias },
      select: { id: true },
    });

    if (existingLink) {
      throw new Error(
        "That alias is already in use. Please choose another one.",
      );
    }
  }

  const shortUrl = getShortLinkUrl(slug);
  const qrCodeUrl = generateQr
    ? await QRCode.toDataURL(shortUrl, {
        errorCorrectionLevel: "H",
        margin: 2,
        width: 512,
      })
    : null;

  const link = await prisma.link.create({
    data: {
      longUrl: destinationUrl.toString(),
      shortUrl: slug,
      qrCodeUrl,
      userId: session?.user.id ?? null,
    },
  });

  return {
    id: link.id,
    longUrl: link.longUrl,
    slug,
    hasCustomAlias: Boolean(customAlias),
    isOwned: Boolean(session?.user),
    shortUrl,
    qrCodeUrl,
  };
}

export async function generateQrForLink(linkId: string): Promise<string> {
  if (typeof linkId !== "string" || linkId.length === 0) {
    throw new Error("A valid link is required to create a QR code.");
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error("Sign in to create and save a QR code.");
  }

  const link = await prisma.link.findFirst({
    where: { id: linkId, userId: session.user.id },
    select: { id: true, shortUrl: true, qrCodeUrl: true },
  });

  if (!link) {
    throw new Error("This link is not saved to your account.");
  }

  if (link.qrCodeUrl) {
    return link.qrCodeUrl;
  }

  const qrCodeUrl = await QRCode.toDataURL(getShortLinkUrl(link.shortUrl), {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 512,
  });

  const updated = await prisma.link.updateMany({
    where: { id: link.id, userId: session.user.id },
    data: { qrCodeUrl },
  });

  if (updated.count !== 1) {
    throw new Error("The link could not be updated with its QR code.");
  }

  return qrCodeUrl;
}
