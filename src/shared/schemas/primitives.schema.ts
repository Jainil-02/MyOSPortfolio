import { z } from "zod";

export const identifierSchema = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const slugSchema = identifierSchema;

export const nonEmptyTextSchema = z.string().trim().min(1);

export const externalUrlSchema = z
  .url()
  .refine((value) => value.startsWith("https://") || value.startsWith("http://"), {
    message: "URL must use HTTP or HTTPS.",
  });

export const assetPathSchema = z
  .string()
  .trim()
  .startsWith("/")
  .refine((value) => !value.includes(".."), {
    message: "Asset paths cannot traverse parent directories.",
  });

export const isoDateTimeSchema = z.string().datetime({ offset: true });
