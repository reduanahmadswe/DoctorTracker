"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LogOut, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { LOGIN_PATH } from "@/lib/constants";
import { logout } from "./auth.api";
import { useCurrentUser } from "./useCurrentUser";

export const UserMenu = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  const mutation = useMutation({
    mutationFn: logout,
    // Leave even if the request fails, and never keep another session's data in the cache.
    onSettled: () => {
      queryClient.clear();
      router.replace(LOGIN_PATH);
    },
  });

  return (
    <div className="flex items-center gap-3">
      {user && (
        <div className="hidden items-center gap-2 sm:flex">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary-soft text-primary">
            <UserRound aria-hidden className="size-4" />
          </div>
          <span className="max-w-40 truncate text-sm font-medium text-text">{user.name}</span>
        </div>
      )}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => mutation.mutate()}
        loading={mutation.isPending}
      >
        <LogOut aria-hidden className="size-4" />
        Logout
      </Button>
    </div>
  );
};
