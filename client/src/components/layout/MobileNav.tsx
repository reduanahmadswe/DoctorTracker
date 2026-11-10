"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Brand } from "./Brand";
import { NavLinks } from "./NavLinks";

// Collapsible drawer built on the native <dialog> (focus trap, Escape to close, inert page).
export const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={open}
      >
        <Menu aria-hidden className="size-5" />
      </Button>
      <dialog
        ref={dialogRef}
        aria-label="Navigation menu"
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === dialogRef.current) setOpen(false);
        }}
        className="m-0 h-full max-h-none w-72 max-w-[85vw] border-r border-border bg-surface p-0 shadow-overlay"
      >
        <div className="flex h-full flex-col gap-8 px-4 py-6">
          <div className="flex items-center justify-between px-2">
            <Brand />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              aria-label="Close navigation menu"
            >
              <X aria-hidden className="size-5" />
            </Button>
          </div>
          <NavLinks onNavigate={() => setOpen(false)} />
        </div>
      </dialog>
    </>
  );
};
