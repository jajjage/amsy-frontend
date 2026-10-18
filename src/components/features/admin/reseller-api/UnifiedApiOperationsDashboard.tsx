"use client";

import { useAdminUnifiedApiOperationsOverview } from "@/hooks/admin/useAdminResellerApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export function UnifiedApiOperationsDashboard() {
  const today = new Date().toISOString().slice(0, 10);
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 6);
  const [fromDate, setFromDate] = useState(weekStart.toISOString().slice(0, 10));
  const [toDate, setToDate] = useState(today);
  const [source, setSource] = useState("all");
  const { data, isLoading, isError } = useAdminUnifiedApiOperationsOverview({
    fromDate, toDate, source: source as "all" | "legacy_reseller" | "v1_api",
  });
  const report = data?.data;

  return <section className="space-y-4" aria-label="Unified API operations">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div><h2 className="text-xl font-semibold">API operations</h2><p className="text-sm text-muted-foreground">Legacy reseller and V1 API activity for this tenant.</p></div>
      <div className="flex flex-wrap gap-2">
        <label className="grid gap-1 text-xs text-muted-foreground">From<input aria-label="Operations from date" type="date" value={fromDate} max={toDate} onChange={e => setFromDate(e.target.value)} className="h-9 rounded-md border bg-background px-2 text-sm text-foreground" /></label>
        <label className="grid gap-1 text-xs text-muted-foreground">To<input aria-label="Operations to date" type="date" value={toDate} min={fromDate} max={today} onChange={e => setToDate(e.target.value)} className="h-9 rounded-md border bg-background px-2 text-sm text-foreground" /></label>
        <label className="grid gap-1 text-xs text-muted-foreground">API<select aria-label="API source" value={source} onChange={e => setSource(e.target.value)} className="h-9 rounded-md border bg-background px-2 text-sm text-foreground"><option value="all">All APIs</option><option value="v1_api">V1 API</option><option value="legacy_reseller">Legacy reseller</option></select></label>
      </div>
    </div>
    {isLoading && <p className="text-sm text-muted-foreground">Loading API operations…</p>}
    {isError && <p role="alert" className="text-sm text-destructive">Could not load API operations. Check access and try again.</p>}
    {report && <>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric title="Requests" value={report.totals.requests.toLocaleString()} />
        <Metric title="Purchase amount" value={`₦${report.totals.amount.toLocaleString()}`} />
        <Metric title="Success rate" value={report.totals.successRate} detail={`${report.totals.resolved} resolved`} />
        <Metric title="Supplier p95" value={`${(report.latency.p95Ms / 1000).toFixed(1)}s`} detail={`Average ${(report.latency.averageMs / 1000).toFixed(1)}s`} />
      </div>
      {report.alerts.length > 0 ? <div className="grid gap-2 md:grid-cols-2">{report.alerts.map(alert => <div role="status" key={alert.code} className={`rounded-md border p-3 text-sm ${alert.severity === "critical" ? "border-destructive/50 bg-destructive/5" : "border-amber-500/50 bg-amber-500/5"}`}><b className="capitalize">{alert.severity}: </b>{alert.message}</div>)}</div> : <p className="text-sm text-muted-foreground">No active API alerts for this period.</p>}
      <div className="grid gap-3 lg:grid-cols-3">
        <Card><CardHeader><CardTitle className="text-base">Request status</CardTitle></CardHeader><CardContent className="space-y-2 text-sm">{Object.entries(report.status).map(([key, value]) => <div className="flex justify-between" key={key}><span className="capitalize">{key}</span><span>{value}</span></div>)}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">By API</CardTitle></CardHeader><CardContent className="space-y-2 text-sm"><div className="flex justify-between"><span>V1 API</span><span>{report.bySource.v1_api ?? 0}</span></div><div className="flex justify-between"><span>Legacy reseller</span><span>{report.bySource.legacy_reseller ?? 0}</span></div><div className="flex justify-between"><span>Oldest pending</span><span>{report.latency.oldestPendingAt ? new Date(report.latency.oldestPendingAt).toLocaleString() : "None"}</span></div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">By network</CardTitle></CardHeader><CardContent className="space-y-2 text-sm">{Object.entries(report.byNetwork).length ? Object.entries(report.byNetwork).map(([network, stats]) => <div className="flex justify-between gap-2" key={network}><span>{network}</span><span>{stats.requests} requests · {stats.success} successful</span></div>) : <p className="text-muted-foreground">No network activity.</p>}</CardContent></Card>
      </div>
    </>}
  </section>;
}

function Metric({ title, value, detail }: { title: string; value: string; detail?: string }) {
  return <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold">{value}</p>{detail && <p className="mt-1 text-xs text-muted-foreground">{detail}</p>}</CardContent></Card>;
}
