"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  signInSchema,
  signUpSchema,
  socialSignInSchema,
} from "@/schemas/auth-schema";

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

export async function signInWithEmail(input: unknown) {
  const { email, password } = signInSchema.parse(input);

  const result = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  return {
    id: result.user.id,
    name: result.user.name,
    email: result.user.email,
  };
}

export async function signUpWithEmail(input: unknown) {
  const { name, email, password } = signUpSchema.parse(input);

  const result = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });

  return {
    id: result.user.id,
    name: result.user.name,
    email: result.user.email,
  };
}

export async function signInWithSocial(input: unknown) {
  const { provider, callbackUrl } = socialSignInSchema.parse(input);

  const result = await auth.api.signInSocial({
    body: {
      provider,
      callbackURL: getSafeCallbackUrl(callbackUrl),
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
