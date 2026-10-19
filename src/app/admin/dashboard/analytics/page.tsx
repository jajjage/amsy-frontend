"use client";

import {
  KeyMetricsCards,
  OperatorPerformanceCard,
  SensitiveAnalyticsGate,
  TodaySnapshotCard,
  TopupPerformanceChart,
  TransactionOverviewCard,
  TransactionTypeChart,
  UserOverviewCard,
  UserSegmentsCard,
} from "@/components/features/admin/analytics";
import { BillPaymentAnalyticsSection } from "@/components/features/admin/bills/BillPaymentAnalyticsSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  ReceiptText,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function AnalyticsPage() {
  const [lockEnabled, setLockEnabled] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [configLoading, setConfigLoading] = useState(true);
  const unlockTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    authService.getSensitiveAnalyticsConfig()
      .then((response) => {
        const enabled = response.data?.enabled !== false;
        setLockEnabled(enabled);
        setUnlocked(!enabled);
      })
      .catch(() => {
        // Fail closed if the tenant's lock configuration cannot be confirmed.
        setLockEnabled(true);
        setUnlocked(false);
      })
      .finally(() => setConfigLoading(false));
  }, []);
  useEffect(
    () => () => {
      if (unlockTimeout.current) clearTimeout(unlockTimeout.current);
    },
    []
  );
  const unlock = async () => {
    setLoading(true); setError("");
    try {
      await authService.unlockSensitiveAnalytics(password);
      setUnlocked(true);
      setPassword("");
      if (unlockTimeout.current) clearTimeout(unlockTimeout.current);
      unlockTimeout.current = setTimeout(() => setUnlocked(false), 15 * 60 * 1000);
    }
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

      {/* Today's operational snapshot is intentionally available without re-authentication. */}
      <TodaySnapshotCard />

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-3xl grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="bills" className="flex items-center gap-2">
            <ReceiptText className="h-4 w-4" />
            Bills
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {configLoading || (lockEnabled && !unlocked) ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
                <h2 className="text-xl font-semibold">
                  {configLoading ? "Checking analytics security" : "Sensitive analytics locked"}
                </h2>
                {configLoading ? (
                  <p className="text-sm text-muted-foreground">Loading analytics security settings…</p>
                ) : (
                  <>
                    <p className="max-w-md text-sm text-muted-foreground">
                      Enter your admin password to view the Overview analytics. Today&apos;s Snapshot and the other analytics tabs remain available.
                    </p>
                    <div className="flex w-full max-w-sm gap-2">
                      <Input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        onKeyDown={(event) => event.key === "Enter" && unlock()}
                        placeholder="Admin password"
                        aria-label="Admin password for sensitive analytics"
                      />
                      <Button onClick={unlock} disabled={!password || loading}>
                        {loading ? "Unlocking…" : "Unlock analytics"}
                      </Button>
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                  </>
                )}
              </CardContent>
            </Card>
          ) : null}
          <SensitiveAnalyticsGate
            loading={configLoading}
            locked={lockEnabled && !unlocked}
          >
            <KeyMetricsCards />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2"><TransactionOverviewCard /><OperatorPerformanceCard /></div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <TopupPerformanceChart />
              <TransactionTypeChart />
            </div>
          </SensitiveAnalyticsGate>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <UserOverviewCard />
            <UserSegmentsCard />
          </div>
        </TabsContent>

        <TabsContent value="bills" className="mt-6 space-y-6">
          <BillPaymentAnalyticsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}

