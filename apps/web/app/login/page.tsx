"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { RiFlashlightLine, RiGithubLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/reviewers";
  const error = searchParams.get("error");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-sm space-y-8 px-4">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 shadow-lg shadow-violet-500/25">
            <RiFlashlightLine className="h-7 w-7 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold tracking-tight">Critique Lens</h1>
            <p className="mt-1 text-sm text-muted-foreground">Design Intelligence System</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border bg-card p-8 shadow-sm space-y-6">
          <div className="text-center">
            <h2 className="text-base font-semibold">Sign in to continue</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              This workspace is private.
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/8 border border-destructive/20 px-4 py-3 text-sm text-destructive text-center">
              Access denied. This account is not authorized.
            </div>
          )}

          <Button
            className="w-full gap-2.5"
            size="lg"
            onClick={() => signIn("github", { callbackUrl })}
          >
            <RiGithubLine className="h-4 w-4" />
            Continue with GitHub
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
