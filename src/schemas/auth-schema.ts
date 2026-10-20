import { z } from "zod";

export const signInSchema = z
  .object({
    email: z.string().trim().email(),
    password: z.string().min(1, "Password is required."),
  })
  .strict();

export const signUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters.")
      .max(100),
    email: z.string().trim().email(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .max(128, "Password must be no more than 128 characters."),
  })
  .strict();

export const socialSignInSchema = z
  .object({
    provider: z.enum(["google", "twitter"]),
    callbackUrl: z.string(),
  })
  .strict();

const searchParamSchema = z.union([z.string(), z.array(z.string())]).optional();

export const authPageSearchParamsSchema = z
  .object({
    callbackUrl: searchParamSchema,
    customAlias: searchParamSchema,
  })
  .transform(({ callbackUrl, customAlias }) => {
    const requestedCallbackUrl = Array.isArray(callbackUrl)
      ? callbackUrl[0]
      : callbackUrl;
    const requestedAlias = Array.isArray(customAlias)
      ? customAlias[0]
      : customAlias;

    return {
      callbackUrl:
        requestedCallbackUrl?.startsWith("/") &&
        !requestedCallbackUrl.startsWith("//") &&
        !requestedCallbackUrl.includes("\\")
          ? requestedCallbackUrl
          : "/",
      customAlias: requestedAlias ?? null,
    };
  });
