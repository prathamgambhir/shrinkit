import { z } from "zod";

const reservedAliases = new Set(["api", "auth", "favicon.ico"]);
const aliasTextSchema = z
  .string()
  .trim()
  .max(40)
  .refine(
    (value) => value === "" || /^[a-z0-9_-]+$/i.test(value),
    "Aliases may contain only letters, numbers, underscores, or hyphens.",
  )
  .refine(
    (value) => value === "" || !reservedAliases.has(value.toLowerCase()),
    "That alias is reserved. Please choose another one.",
  );

export const destinationUrlSchema = z
  .string()
  .trim()
  .url("Enter a valid destination URL.")
  .transform((value, context) => {
    const url = new URL(value);

    if (
      !["http:", "https:"].includes(url.protocol) ||
      !url.hostname ||
      url.username ||
      url.password
    ) {
      context.addIssue({
        code: "custom",
        message:
          "Destination URLs must use HTTP or HTTPS and cannot contain credentials.",
      });
      return z.NEVER;
    }

    return url.toString();
  });

export const customAliasSchema = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  z
    .string()
    .trim()
    .toLowerCase()
    .min(1)
    .max(40)
    .regex(
      /^[a-z0-9_-]+$/,
      "Aliases may contain only letters, numbers, underscores, or hyphens.",
    )
    .refine(
      (value) => !reservedAliases.has(value),
      "That alias is reserved. Please choose another one.",
    )
    .optional(),
);

export const urlFormSchema = z
  .object({
    url: destinationUrlSchema,
    customText: aliasTextSchema,
  })
  .strict();

export const createShortLinkSchema = z
  .object({
    url: destinationUrlSchema,
    customAlias: customAliasSchema,
    generateQr: z.boolean().optional().default(false),
  })
  .strict();

export const generateQrSchema = z.string().uuid();
export const shortSlugSchema = z.string().regex(/^[a-zA-Z0-9_-]{1,40}$/);

export const cachedShortLinkSchema = z
  .object({
    id: z.string().uuid(),
    longUrl: destinationUrlSchema,
    slug: z.string().min(1),
    dedupeScope: z.string().min(1),
    userId: z.string().nullable(),
    qrCodeUrl: z.string().nullable(),
    createdAt: z.string().datetime(),
  })
  .strict();

export const pendingLinkSchema = z
  .object({
    url: destinationUrlSchema,
    customText: aliasTextSchema,
    generateQr: z.boolean(),
  })
  .strict();

export type UrlFormInput = z.input<typeof urlFormSchema>;
export type UrlFormData = z.output<typeof urlFormSchema>;
export type CachedShortLink = z.infer<typeof cachedShortLinkSchema>;
export type PendingLink = z.infer<typeof pendingLinkSchema>;
