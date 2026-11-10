import { TriangleAlert } from "lucide-react";
import { Button } from "./Button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry: () => void;
  retrying?: boolean;
}

export const ErrorState = ({
  title = "Something went wrong",
  message = "We could not load this data. Check your connection and try again.",
  onRetry,
  retrying,
}: ErrorStateProps) => (
  <div role="alert" className="flex flex-col items-center gap-3 px-6 py-12 text-center">
    <div className="flex size-12 items-center justify-center rounded-full bg-danger-soft text-danger-text">
      <TriangleAlert aria-hidden className="size-6" />
    </div>
    <div className="flex flex-col gap-1">
      <h3 className="text-base font-semibold text-text">{title}</h3>
      <p className="max-w-sm text-sm text-text-muted">{message}</p>
    </div>
    <Button variant="secondary" onClick={onRetry} loading={retrying}>
      Try again
    </Button>
  </div>
);
