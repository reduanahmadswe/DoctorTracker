import { Brand } from "./Brand";
import { NavLinks } from "./NavLinks";

// Fixed navigation for desktop; below the lg breakpoint MobileNav takes over.
export const Sidebar = () => (
  <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col gap-8 border-r border-border bg-surface px-4 py-6 lg:flex">
    <div className="px-2">
      <Brand />
    </div>
    <NavLinks />
  </aside>
);
