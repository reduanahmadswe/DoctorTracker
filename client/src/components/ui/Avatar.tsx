import { getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  className?: string;
}

export const Avatar = ({ name, className }: AvatarProps) => (
  <span
    aria-hidden
    className={cn(
      "flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary-hover",
      className,
    )}
  >
    {getInitials(name)}
  </span>
);
