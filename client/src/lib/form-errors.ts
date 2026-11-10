import type { FieldPath, FieldValues, UseFormSetError } from "react-hook-form";
import { ApiError } from "@/lib/api-client";

const CONFLICT_STATUS = 409;

interface ServerErrorHandlers<T extends FieldValues> {
  setError: UseFormSetError<T>;
  fields: readonly FieldPath<T>[];
  toastError: (message: string) => void;
  // Field that a 409 (duplicate value) belongs to, with the message to show on it.
  conflict?: { field: FieldPath<T>; message: string };
}

// Puts server validation messages on the matching form fields; anything else becomes a toast.
export const applyServerError = <T extends FieldValues>(
  error: unknown,
  { setError, fields, toastError, conflict }: ServerErrorHandlers<T>,
): void => {
  if (!(error instanceof ApiError)) {
    toastError("Unable to reach the server. Please try again.");
    return;
  }
  if (error.status === CONFLICT_STATUS && conflict) {
    setError(conflict.field, { message: conflict.message });
    return;
  }
  const matched = (error.errors ?? []).filter(({ field }) =>
    fields.includes(field as FieldPath<T>),
  );
  for (const { field, message } of matched) setError(field as FieldPath<T>, { message });
  if (matched.length === 0) toastError(error.message);
};
