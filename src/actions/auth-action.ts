"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

type SocialProvider = "google" | "twitter";

function getSafeCallbackUrl(callbackUrl: string) {
  if (
    callbackUrl.startsWith("/") &&
    !callbackUrl.startsWith("//") &&
    !callbackUrl.includes("\\")
  ) {
    return callbackUrl;
  }

  return "/";
}

export async function hasAuthSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  return Boolean(session?.user);
}

export async function signInWithEmail(input: {
  email: string;
  password: string;
}) {
  if (
    !input ||
    typeof input.email !== "string" ||
    typeof input.password !== "string"
  ) {
    throw new Error("Enter a valid email and password.");
  }

  const result = await auth.api.signInEmail({
    body: {
      email: input.email,
      password: input.password,
    },
  });

  return {
    id: result.user.id,
    name: result.user.name,
    email: result.user.email,
  };
}

export async function signUpWithEmail(input: {
  name: string;
  email: string;
  password: string;
}) {
  if (
    !input ||
    typeof input.name !== "string" ||
    typeof input.email !== "string" ||
    typeof input.password !== "string"
  ) {
    throw new Error("Enter your name, email, and password.");
  }

  const result = await auth.api.signUpEmail({
    body: {
      name: input.name,
      email: input.email,
      password: input.password,
    },
  });

  return {
    id: result.user.id,
    name: result.user.name,
    email: result.user.email,
  };
}

export async function signInWithSocial(input: {
  provider: SocialProvider;
  callbackUrl: string;
}) {
  if (
    !input ||
    !["google", "twitter"].includes(input.provider) ||
    typeof input.callbackUrl !== "string"
  ) {
    throw new Error("Choose a valid sign-in provider.");
  }

  const result = await auth.api.signInSocial({
    body: {
      provider: input.provider,
      callbackURL: getSafeCallbackUrl(input.callbackUrl),
      disableRedirect: true,
    },
    headers: await headers(),
  });

  if (!result.url) {
    throw new Error("The identity provider did not return a sign-in URL.");
  }

  return { url: result.url };
}

export async function signOutUser() {
  await auth.api.signOut({ headers: await headers() });
  return { success: true };
}
