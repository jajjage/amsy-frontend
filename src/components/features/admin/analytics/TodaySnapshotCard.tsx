"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTodaySnapshot } from "@/hooks/admin/useAdminAnalytics";
import { ArrowDownRight, ArrowUpRight, DollarSign, ReceiptText, TrendingUp, Users, Wallet } from "lucide-react";
import type { ReactNode } from "react";

export function TodaySnapshotCard() {
  const { data: snapshot, isLoading, error } = useTodaySnapshot();
  const money = (value: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);
  const number = (value: number) => value.toLocaleString();
  const deltaColor = (value: string) => value.startsWith("+") ? "text-green-600" : value.startsWith("-") ? "text-red-600" : "text-muted-foreground";
  const deltaIcon = (value: string) => value.startsWith("+") ? <ArrowUpRight className="h-4 w-4 text-green-600" /> : value.startsWith("-") ? <ArrowDownRight className="h-4 w-4 text-red-600" /> : null;
  const delta = (value?: string) => value || "0%";

  if (error) return <Card><CardContent className="text-destructive py-8 text-center">Failed to load today&apos;s snapshot</CardContent></Card>;
  if (isLoading) return <Card><CardHeader><Skeleton className="h-6 w-40" /></CardHeader><CardContent><div className="grid grid-cols-2 gap-4 md:grid-cols-5">{[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-24" />)}</div></CardContent></Card>;

  const stat = (label: string, value: string, icon?: ReactNode, detail?: ReactNode) => <div className="bg-muted/50 space-y-1 rounded-lg p-4"><div className="flex items-center gap-2">{icon}<p className="text-muted-foreground text-xs tracking-wide uppercase">{label}</p></div><p className="text-2xl font-bold">{value}</p>{detail}</div>;
  const transactionDelta = delta(snapshot?.comparedToYesterday.transactionsDeltaPercent);
  const volumeDelta = delta(snapshot?.comparedToYesterday.volumeDeltaPercent);

  return <Card>
    <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-lg"><TrendingUp className="text-primary h-5 w-5" />Today&apos;s Snapshot</CardTitle></CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {stat("Attempted Tx", number(snapshot?.transactions.attemptedCount ?? snapshot?.transactions.count ?? 0), undefined, <div className="flex items-center gap-1 text-sm">{deltaIcon(transactionDelta)}<span className={deltaColor(transactionDelta)}>{transactionDelta}</span><span className="text-muted-foreground">vs yesterday</span></div>)}
        {stat("Volume", money(snapshot?.transactions.attemptedVolume ?? snapshot?.transactions.volume ?? 0), undefined, <div className="flex items-center gap-1 text-sm">{deltaIcon(volumeDelta)}<span className={deltaColor(volumeDelta)}>{volumeDelta}</span><span className="text-muted-foreground">vs yesterday</span></div>)}
        {stat("Revenue Est.", money(snapshot?.revenueEstimate || 0), <DollarSign className="h-4 w-4 text-green-600" />, <p className="text-muted-foreground text-xs">Profit: {money(snapshot?.transactions.profit || 0)}</p>)}
        {stat("Bills Paid", number(snapshot?.billPayments?.successCount ?? snapshot?.billPayments?.successful ?? 0), <ReceiptText className="h-4 w-4 text-indigo-600" />, <div className="flex items-center gap-1 text-sm"><span className={deltaColor(delta(snapshot?.comparedToYesterday.successfulBillPaymentsDeltaPercent))}>{delta(snapshot?.comparedToYesterday.successfulBillPaymentsDeltaPercent)}</span><span className="text-muted-foreground">vs yesterday</span></div>)}
        {stat("Users", `${number(snapshot?.activeUsers || 0)} active`, <Users className="h-4 w-4 text-blue-600" />, <p className="text-xs text-blue-600">+{number(snapshot?.newUsers || 0)} new today</p>)}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[["Successful", snapshot?.transactions.successCount ?? snapshot?.transactions.successful ?? 0, "green"], ["Failed", snapshot?.transactions.failedCount ?? snapshot?.transactions.failed ?? 0, "red"], ["Pending", snapshot?.transactions.pendingCount ?? snapshot?.transactions.pending ?? 0, "amber"], ["Reversed", snapshot?.transactions.reversedCount ?? snapshot?.transactions.reversed ?? 0, "purple"]].map(([label, value, color]) => <div key={String(label)} className="flex items-center gap-3"><div className={`flex h-8 w-8 items-center justify-center rounded-full bg-${color}-100 dark:bg-${color}-900/30`}><span className={`text-sm font-bold text-${color}-600`}>{number(Number(value))}</span></div><span className="text-muted-foreground text-sm">{label}</span></div>)}
        <div className="grid grid-cols-1 gap-4 md:col-span-4 md:grid-cols-3">
          {stat("Payment Received Amount", money(snapshot?.paymentReceivedAmount || 0), <DollarSign className="h-4 w-4 text-emerald-600" />, <span className="text-xs">{delta(snapshot?.comparedToYesterday.paymentReceivedAmountDeltaPercent)} vs yesterday</span>)}
          {stat("Successful Wallet Withdrawals", money(snapshot?.walletWithdrawals || 0), <Wallet className="h-4 w-4 text-red-600" />)}
          {stat("Payments Received", number(snapshot?.paymentReceivedCount || 0), undefined, <span className="text-xs">{delta(snapshot?.comparedToYesterday.paymentReceivedCountDeltaPercent)} vs yesterday</span>)}
        </div>
      </div>
    </CardContent>
  </Card>;
}
