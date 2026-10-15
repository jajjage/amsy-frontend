"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buildPublicApiV1Payload } from "@/lib/public-api-v1";
import { AlertCircle, CheckCircle2, Copy, Loader2, Send, Terminal } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";

type V1Mode = "data" | "airtime";
type Result = { httpStatus: number; body: unknown };
const makeRequestId = (kind: V1Mode) => `${kind === "data" ? "Data" : "Airtime"}_${crypto.randomUUID()}`;

export function V1ApiConsole() {
  const [mode, setMode] = useState<V1Mode>("data");
  const [apiKey, setApiKey] = useState("");
  const [network, setNetwork] = useState("1");
  const [phone, setPhone] = useState("");
  const [dataPlan, setDataPlan] = useState("");
  const [amount, setAmount] = useState("");
  const [requestId, setRequestId] = useState(() => makeRequestId("data"));
  const [bypass, setBypass] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const switchMode = (next: string) => {
    const selected = next as V1Mode;
    setMode(selected);
    setRequestId(makeRequestId(selected));
    setResult(null);
    setError("");
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!apiKey.trim() || !network.trim() || !phone.trim() || !requestId.trim()) {
      setError("API key, network ID, phone number, and request ID are required.");
      return;
    }
    if (mode === "data" && !dataPlan.trim()) return setError("Data plan number is required.");
    if (mode === "airtime" && (!Number(amount) || Number(amount) <= 0)) return setError("Enter a valid airtime amount.");

    const payload = buildPublicApiV1Payload({ mode, network, phone, dataPlan, amount, bypass, requestId });

    setSending(true); setResult(null); setError("");
    try {
      const response = await fetch(`/api/${mode === "data" ? "data" : "topup"}`, {
        method: "POST",
        headers: { Authorization: `Token ${apiKey.trim()}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      });
      const text = await response.text();
      let body: unknown;
      try { body = text ? JSON.parse(text) : null; } catch { body = text; }
      setResult({ httpStatus: response.status, body });
      if (!response.ok) setError(`Request returned HTTP ${response.status}. Review the response below.`);
    } catch (requestError: any) {
      setError(requestError?.message || "Could not reach the API. Check the backend and local proxy configuration.");
    } finally { setSending(false); }
  };

  const copy = async (value: string) => { await navigator.clipboard.writeText(value); toast.success("Copied to clipboard"); };

  return <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
    <Card className="border-primary/15 shadow-sm">
      <CardHeader><div className="flex items-center gap-3"><span className="rounded-xl bg-primary/10 p-2 text-primary"><Terminal className="size-5" /></span><div><CardTitle>Live V1 request</CardTitle><CardDescription className="mt-1">The response is returned in this request. Webhooks are optional notifications, not the completion mechanism.</CardDescription></div></div></CardHeader>
      <CardContent>
        <Tabs value={mode} onValueChange={switchMode}>
          <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="data">Data</TabsTrigger><TabsTrigger value="airtime">Airtime</TabsTrigger></TabsList>
          <form onSubmit={(event) => void submit(event)} className="mt-5 space-y-4">
            <div className="space-y-2"><Label htmlFor="v1-api-key">Nexus API key</Label><Input id="v1-api-key" type="password" autoComplete="off" placeholder="Paste an API key created in API Keys" value={apiKey} onChange={(event) => setApiKey(event.target.value)} /><p className="text-xs text-muted-foreground">Sent as <code>Authorization: Token …</code>. This console does not save the key.</p></div>
            <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="v1-network">Network ID</Label><Input id="v1-network" inputMode="numeric" value={network} onChange={(event) => setNetwork(event.target.value)} placeholder="Network ID" /></div><div className="space-y-2"><Label htmlFor="v1-phone">Recipient phone</Label><Input id="v1-phone" inputMode="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="234XXXXXXXXXX" /></div></div>
            <TabsContent value="data" className="mt-0"><div className="space-y-2"><Label htmlFor="v1-data-plan">Data plan number</Label><Input id="v1-data-plan" inputMode="numeric" value={dataPlan} onChange={(event) => setDataPlan(event.target.value)} placeholder="data_plan from your tenant catalog" /></div></TabsContent>
            <TabsContent value="airtime" className="mt-0"><div className="space-y-2"><Label htmlFor="v1-amount">Airtime amount (₦)</Label><Input id="v1-amount" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="100" /></div><p className="mt-2 text-xs text-muted-foreground">Airtime uses <code>plan_type: VTU</code>.</p></TabsContent>
            <div className="space-y-2"><Label htmlFor="v1-request-id">Request ID</Label><div className="flex gap-2"><Input id="v1-request-id" value={requestId} onChange={(event) => setRequestId(event.target.value)} /><Button type="button" variant="outline" onClick={() => setRequestId(makeRequestId(mode))}>New ID</Button></div><p className="text-xs text-muted-foreground">Use a unique ID for every purchase. Reuse the same ID only to safely retry the same request.</p></div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={bypass} onChange={(event) => setBypass(event.target.checked)} className="size-4 accent-primary" />Bypass (false by default)</label>
            {error && <Alert variant="destructive"><AlertCircle className="size-4" /><AlertTitle>Request issue</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
            <Button type="submit" disabled={sending} className="w-full">{sending ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Send className="mr-2 size-4" />}{sending ? "Waiting for response…" : `Send ${mode} request`}</Button>
          </form>
        </Tabs>
      </CardContent>
    </Card>

    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2">{result ? result.httpStatus < 400 && (result.body as { status?: string } | null)?.status !== "fail" ? <CheckCircle2 className="size-5 text-emerald-600" /> : <AlertCircle className="size-5 text-destructive" /> : null}Response {result && <span className="text-sm font-normal text-muted-foreground">HTTP {result.httpStatus}</span>}</CardTitle><CardDescription>Check the response body's status too. HTTP 202 means the supplier is still processing.</CardDescription></CardHeader>
        <CardContent>{result ? <div className="relative"><pre className="max-h-[30rem] overflow-auto rounded-xl bg-zinc-950 p-4 text-xs leading-5 text-zinc-100">{JSON.stringify(result.body, null, 2)}</pre><Button className="absolute top-2 right-2" variant="secondary" size="icon" aria-label="Copy response" onClick={() => void copy(JSON.stringify(result.body, null, 2))}><Copy className="size-4" /></Button></div> : <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">Your API response will appear here.</div>}</CardContent>
      </Card>
      <Alert><AlertTitle>Network and plan IDs are tenant-specific</AlertTitle><AlertDescription>Use the numeric network IDs and <code>data_plan</code> values configured for your tenant’s product catalog. V1 data request format: <code>{'{ network, phone, data_plan, bypass, "request-id" }'}</code>.</AlertDescription></Alert>
    </div>
  </div>;
}
