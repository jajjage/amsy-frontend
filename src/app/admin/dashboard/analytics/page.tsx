"use client";

import {
  ProductAnalyticsSection,
  GmvOverviewCard,
  KeyMetricsCards,
  OperatorPerformanceCard,
  RevenueCard,
  TodaySnapshotCard,
  TopupPerformanceChart,
  TransactionOverviewCard,
  TransactionTypeChart,
  UserOverviewCard,
  UserSegmentsCard,
  WalletOverviewCard,
} from "@/components/features/admin/analytics";
import { BillPaymentAnalyticsSection } from "@/components/features/admin/bills/BillPaymentAnalyticsSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  DollarSign,
  ReceiptText,
  Users,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function AnalyticsPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [configLoading, setConfigLoading] = useState(true);
  useEffect(() => {
    authService.getSensitiveAnalyticsConfig()
      .then((response) => setUnlocked(response.data?.enabled !== true))
      .catch(() => setUnlocked(false))
      .finally(() => setConfigLoading(false));
  }, []);
  const unlock = async () => {
    setLoading(true); setError("");
    try { await authService.unlockSensitiveAnalytics(password); setUnlocked(true); setPassword(""); }
    catch { setError("Incorrect password or insufficient permission."); }
    finally { setLoading(false); }
  };
  return (
    <div className="flex flex-col gap-4 p-2 md:gap-6 md:p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Business intelligence and performance metrics
          </p>
        </div>
      </div>

      {/* Today's Snapshot - Hero Card */}
      <TodaySnapshotCard />
      <ProductAnalyticsSection />

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-4xl grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="wallet" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Wallet
          </TabsTrigger>

          <TabsTrigger value="bills" className="flex items-center gap-2">
            <ReceiptText className="h-4 w-4" />
            Bills
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Key Metrics Row */}
          <KeyMetricsCards />

          {/* Transaction Overview & Operator Performance */}
          {configLoading ? <Card><CardContent className="py-10 text-center text-muted-foreground">Loading analytics security settings…</CardContent></Card> : !unlocked ? (
            <Card><CardContent className="flex flex-col items-center gap-4 py-10 text-center">
              <h2 className="text-xl font-semibold">Sensitive analytics locked</h2>
              <p className="max-w-md text-sm text-muted-foreground">Re-enter your admin password to view transaction overview and the analytics below it. This unlock lasts 15 minutes.</p>
              <div className="flex w-full max-w-sm gap-2"><Input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && unlock()} placeholder="Admin password" /><Button onClick={unlock} disabled={!password || loading}>{loading ? "Unlocking…" : "Unlock"}</Button></div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </CardContent></Card>
          ) : <>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2"><TransactionOverviewCard /><OperatorPerformanceCard /></div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <TopupPerformanceChart />
            <TransactionTypeChart />
          </div>
          </>}
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <RevenueCard />
            <GmvOverviewCard />
          </div>

          {/* Operator Performance for revenue context */}
          <OperatorPerformanceCard />
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <UserOverviewCard />
            <UserSegmentsCard />
          </div>
        </TabsContent>

        {/* Wallet Tab */}
        <TabsContent value="wallet" className="mt-6 space-y-6">
          {/* Wallet Overview - Full Width */}
          <WalletOverviewCard />

          {/* GMV vs Transaction comparison */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <GmvOverviewCard />
            <TransactionOverviewCard />
          </div>

          {/* Additional visualizations */}
          <TopupPerformanceChart />
        </TabsContent>


        <TabsContent value="bills" className="mt-6 space-y-6">
          <BillPaymentAnalyticsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}

