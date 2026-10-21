"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  signInSchema,
  signUpSchema,
  socialSignInSchema,
} from "@/schemas/auth-schema";

// Checks if the url is safe or not
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

// checks if user has auth session or not
export async function hasAuthSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  return Boolean(session?.user);
}

// signin with email and password
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

// signup with email and password
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

// signin with social login
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

// signout the user
export async function signOutUser() {
  await auth.api.signOut({ headers: await headers() });
  return { success: true };
}
