"use client";

import { BottomNav } from "@/components/features/dashboard/bottom-nav";
import { AdexCredentialsPanel } from "@/components/features/reseller/AdexCredentialsPanel";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useResellerApiAccess } from "@/hooks/useReseller";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function AdexCredentialsPage() {
  const { user, isLoading } = useAuth();
  const { canAccessApi } = useResellerApiAccess();
  if (!isLoading && !canAccessApi) redirect("/dashboard");
  return <>
    <div className="container mx-auto max-w-4xl px-4 py-8 pb-24">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild><Link href="/dashboard/reseller" aria-label="Back to developer console"><ArrowLeft className="size-5" /></Link></Button>
        <div><p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">ADEX-compatible access</p><h1 className="text-2xl font-bold">Client credentials</h1><p className="text-sm text-muted-foreground">Create credentials for a client that accepts ADEX username/password login.</p></div>
      </div>
      {!isLoading && user?.role === "api_user" ? <AdexCredentialsPanel /> : null}
    </div>
    <BottomNav />
  </>;
}
