"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
    },
  });
}

export async function getUserLinks() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    throw new Error("You must be signed in to view your links.");
  }

  return prisma.link.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      longUrl: true,
      shortUrl: true,
      clickCount: true,
      qrCodeUrl: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}
