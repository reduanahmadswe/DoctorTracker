"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/Toast";
import { getQueryClient } from "@/lib/query-client";

export const Providers = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={getQueryClient()}>
    <ToastProvider>{children}</ToastProvider>
  </QueryClientProvider>
);
