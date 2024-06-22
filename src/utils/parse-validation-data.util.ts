import z from 'zod';

export default function parseValidationData<T extends z.ZodTypeAny>(
  data: unknown,
  schema: T
): string[] {
  const validationErrors: string[] = [];
  try {
    schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.issues.forEach((issue) => {
        validationErrors.push(issue.message);
      });
    }
  }
  return validationErrors;
}
