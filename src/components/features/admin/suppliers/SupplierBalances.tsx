"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminSupplierBalances, useRefreshAdminSupplierBalance } from "@/hooks/admin/useAdminSuppliers";
import { RefreshCw, Wallet } from "lucide-react";

const labels: Record<string, string> = { nexus: "Nexus", quicklysim: "QuicklySim", maskawa: "Maskawa", smeplug: "Smeplug" };

export function SupplierBalances() {
  const { data, isLoading, isError, refetch } = useAdminSupplierBalances();
  const refresh = useRefreshAdminSupplierBalance();
  const balances = data?.data?.balances || [];
  if (isLoading) return <Card><CardContent className="space-y-3 py-6"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></CardContent></Card>;
  if (isError) return <Card><CardContent className="py-8 text-center"><p>Failed to load supplier balances</p><Button className="mt-4" variant="outline" onClick={() => refetch()}>Retry</Button></CardContent></Card>;
  return <div className="grid gap-4 md:grid-cols-2">
    {balances.map(item => <Card key={item.supplier}><CardHeader className="flex flex-row items-center justify-between space-y-0"><CardTitle className="flex items-center gap-2 text-base"><Wallet className="h-4 w-4" />{labels[item.supplier] || item.supplier}</CardTitle><Button size="sm" variant="outline" onClick={() => refresh.mutate(item.supplier)} disabled={refresh.isPending && refresh.variables === item.supplier}><RefreshCw className={`mr-2 h-4 w-4 ${refresh.isPending && refresh.variables === item.supplier ? "animate-spin" : ""}`} />Refresh</Button></CardHeader><CardContent><div className="text-2xl font-semibold">{item.balance === null ? "—" : new Intl.NumberFormat("en-NG", { style: "currency", currency: item.currency }).format(item.balance)}</div><div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">{item.isStale ? <Badge variant="destructive">Stale</Badge> : <Badge>Current</Badge>}{item.lastUpdated ? `Updated ${new Date(item.lastUpdated).toLocaleString()}` : "Not fetched"}</div>{item.error && <p className="mt-2 text-sm text-destructive">{item.error}</p>}</CardContent></Card>)}
  </div>;
}
