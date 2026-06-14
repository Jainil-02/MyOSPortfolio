import type { z } from "zod";

export class ContentValidationError extends Error {
  constructor(
    readonly source: string,
    readonly issues: readonly z.core.$ZodIssue[],
  ) {
    const details = issues
      .map((issue) => {
        const path = issue.path.length > 0 ? issue.path.join(".") : "<root>";
        return `${path}: ${issue.message}`;
      })
      .join("\n");

    super(`Invalid content in ${source}\n${details}`);
    this.name = "ContentValidationError";
  }
}

export function validateContent<TSchema extends z.ZodType>(
  source: string,
  schema: TSchema,
  input: unknown,
): z.output<TSchema> {
  const result = schema.safeParse(input);

  if (!result.success) {
    throw new ContentValidationError(source, result.error.issues);
  }

  return result.data;
}
