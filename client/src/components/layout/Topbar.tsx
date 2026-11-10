"use client";

import { usePathname } from "next/navigation";
import { UserMenu } from "@/features/auth/UserMenu";
import { getPageTitle } from "@/lib/navigation";
import { MobileNav } from "./MobileNav";

export const Topbar = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-surface/90 px-4 backdrop-blur sm:px-6 lg:px-8">
      <MobileNav />
      <p className="flex-1 truncate text-base font-semibold text-text">{getPageTitle(pathname)}</p>
      <UserMenu />
    </header>
  );
};
