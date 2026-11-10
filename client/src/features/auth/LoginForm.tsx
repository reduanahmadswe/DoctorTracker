"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { ApiError } from "@/lib/api-client";
import { getSafeRedirectPath } from "@/lib/safe-redirect";
import { authKeys, login } from "./auth.api";
import { type LoginValues, loginSchema } from "./auth.schemas";

const TOO_MANY_ATTEMPTS_STATUS = 429;
const UNAUTHORIZED_STATUS = 401;

export const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me, user);
      router.replace(getSafeRedirectPath(searchParams.get("next")));
    },
    onError: (error) => {
      if (!(error instanceof ApiError)) {
        toast.error("Unable to reach the server. Please try again.");
        return;
      }
      if (error.status === UNAUTHORIZED_STATUS || error.status === TOO_MANY_ATTEMPTS_STATUS) {
        toast.error(error.message);
        return;
      }
      const fieldErrors = error.errors ?? [];
      for (const { field, message } of fieldErrors) {
        if (field === "email" || field === "password") setError(field, { message });
      }
      if (fieldErrors.length === 0) toast.error(error.message);
    },
  });

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      className="flex flex-col gap-4"
    >
      <Input
        id="email"
        type="email"
        label="Email"
        autoComplete="email"
        placeholder="you@hospital.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        id="password"
        type={showPassword ? "text" : "password"}
        label="Password"
        autoComplete="current-password"
        placeholder="Enter your password"
        error={errors.password?.message}
        endAdornment={
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="flex size-8 items-center justify-center rounded-control text-text-muted hover:text-text"
          >
            {showPassword ? (
              <EyeOff aria-hidden className="size-4" />
            ) : (
              <Eye aria-hidden className="size-4" />
            )}
          </button>
        }
        {...register("password")}
      />
      <Button type="submit" loading={mutation.isPending} className="mt-2 w-full">
        {mutation.isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
};
