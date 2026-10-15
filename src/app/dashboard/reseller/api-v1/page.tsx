"use client";

import { BottomNav } from "@/components/features/dashboard/bottom-nav";
import { V1ApiConsole } from "@/components/features/reseller/V1ApiConsole";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useResellerApiAccess } from "@/hooks/useReseller";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function V1ApiConsolePage() {
  const { user, isLoading } = useAuth();
  const { canAccessApi } = useResellerApiAccess();
  if (!isLoading && !canAccessApi) redirect("/dashboard");
  return <>
    <div className="container mx-auto max-w-6xl px-4 py-8 pb-24">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild><Link href="/dashboard/reseller" aria-label="Back to developer console"><ArrowLeft className="size-5" /></Link></Button>
        <div><p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">Nexus Public API · V1</p><h1 className="text-2xl font-bold">Data and airtime console</h1><p className="text-sm text-muted-foreground">Make a request and inspect its synchronous response.</p></div>
      </div>
      {!isLoading && user?.role === "api_user" ? <V1ApiConsole /> : null}
    </div>
    <BottomNav />
  </>;
}
