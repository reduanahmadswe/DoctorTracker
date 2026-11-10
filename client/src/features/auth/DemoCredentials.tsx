import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DEMO_CREDENTIALS } from "@/lib/demo-credentials";
import type { LoginValues } from "./auth.schemas";

interface DemoCredentialsProps {
  onFill: (values: LoginValues) => void;
}

export const DemoCredentials = ({ onFill }: DemoCredentialsProps) => {
  const credentials = DEMO_CREDENTIALS;
  if (!credentials) return null;

  return (
    <div className="flex flex-col gap-3 rounded-control border border-border bg-primary-soft p-4">
      <div className="flex items-start gap-3">
        <KeyRound aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
        <dl className="flex min-w-0 flex-col gap-0.5 text-sm">
          <dt className="font-medium text-text">Demo admin account</dt>
          <dd className="truncate text-text-muted">{credentials.email}</dd>
          <dd className="truncate text-text-muted">{credentials.password}</dd>
        </dl>
      </div>
      <Button variant="secondary" size="sm" onClick={() => onFill(credentials)}>
        Fill demo credentials
      </Button>
    </div>
  );
};
