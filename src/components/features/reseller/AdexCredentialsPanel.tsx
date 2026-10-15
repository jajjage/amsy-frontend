"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resellerService } from "@/services/reseller.service";
import type {
  AdexCredential,
  AdexCredentialSecret,
} from "@/types/reseller.types";
import {
  AlertTriangle,
  Check,
  Copy,
  KeyRound,
  Loader2,
  Plus,
  RefreshCw,
  ShieldOff,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

function apiErrorMessage(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<{ message?: string }>;
  return axiosError.response?.data?.message ?? fallback;
}

export function AdexCredentialsPanel() {
  const [credentials, setCredentials] = useState<AdexCredential[]>([]);
  const [name, setName] = useState("");
  const [secret, setSecret] = useState<AdexCredentialSecret | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await resellerService.getAdexCredentials();
      setCredentials(response.data?.credentials ?? []);
    } catch (error: unknown) {
      toast.error(apiErrorMessage(error, "Could not load ADEX credentials"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const create = async () => {
    if (!name.trim()) return toast.error("Enter a name for this integration");
    setBusy(true);
    try {
      const response = await resellerService.createAdexCredential(name.trim());
      if (!response.data?.password)
        throw new Error("The response did not include the one-time password");
      setSecret(response.data);
      setName("");
      await load();
    } catch (error: unknown) {
      toast.error(
        apiErrorMessage(
          error,
          error instanceof Error
            ? error.message
            : "Could not create ADEX credentials"
        )
      );
    } finally {
      setBusy(false);
    }
  };

  const reset = async (credential: AdexCredential) => {
    if (
      !window.confirm(
        `Reset the password for ${credential.name}? Existing integrations using it will stop authenticating.`
      )
    )
      return;
    setBusy(true);
    try {
      const response = await resellerService.resetAdexCredential(credential.id);
      if (!response.data?.password)
        throw new Error(
          "The response did not include the new one-time password"
        );
      setSecret(response.data);
      await load();
    } catch (error: unknown) {
      toast.error(
        apiErrorMessage(
          error,
          error instanceof Error ? error.message : "Could not reset password"
        )
      );
    } finally {
      setBusy(false);
    }
  };

  const revoke = async (credential: AdexCredential) => {
    if (!window.confirm(`Revoke ${credential.name}? This cannot be undone.`))
      return;
    setBusy(true);
    try {
      await resellerService.revokeAdexCredential(credential.id);
      toast.success("ADEX credential revoked");
      await load();
    } catch (error: unknown) {
      toast.error(apiErrorMessage(error, "Could not revoke credential"));
    } finally {
      setBusy(false);
    }
  };

  const copy = async (value: string) => {
    await navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/15 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="bg-primary/10 text-primary rounded-xl p-2">
              <KeyRound className="size-5" />
            </span>
            <div>
              <CardTitle>Create ADEX client credentials</CardTitle>
              <CardDescription className="mt-1">
                Use these in a client configured for ADEX-compatible
                authentication.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="adex-name">Integration name</Label>
            <Input
              id="adex-name"
              placeholder="e.g. My website supplier"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={80}
            />
          </div>
          <Button onClick={() => void create()} disabled={busy || !name.trim()}>
            <Plus className="mr-2 size-4" />
            Create credentials
          </Button>
        </CardContent>
      </Card>

      {secret && (
        <Alert className="border-amber-500/40 bg-amber-500/5">
          <AlertTriangle className="size-4 text-amber-600" />
          <AlertTitle>
            Save this password now — it will not be shown again
          </AlertTitle>
          <AlertDescription>
            <p className="mb-3">
              Enter your tenant&apos;s API base URL (the domain, without an
              endpoint path), then this username and password in the ADEX
              integration settings. The client calls <code>/api/user</code> to
              verify the connection.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              <SecretField
                label="Username"
                value={secret.username}
                onCopy={copy}
              />
              <SecretField
                label="Password"
                value={secret.password}
                onCopy={copy}
              />
            </div>
            <Button
              className="mt-3"
              variant="outline"
              size="sm"
              onClick={() => setSecret(null)}
            >
              <Check className="mr-2 size-4" />I saved it
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Configured integrations</CardTitle>
          <CardDescription>
            Passwords are never retrievable. Reset to create a new one-time
            password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <div className="text-muted-foreground flex items-center gap-2 py-6 text-sm">
              <Loader2 className="size-4 animate-spin" />
              Loading credentials…
            </div>
          ) : credentials.length === 0 ? (
            <p className="text-muted-foreground py-6 text-sm">
              No ADEX credentials yet. Create one above.
            </p>
          ) : (
            credentials.map((credential) => (
              <div
                key={credential.id}
                className="flex flex-col justify-between gap-4 rounded-xl border p-4 sm:flex-row sm:items-center"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{credential.name}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${credential.is_active ? "bg-emerald-500/10 text-emerald-700" : "bg-muted text-muted-foreground"}`}
                    >
                      {credential.is_active ? "Active" : "Revoked"}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-1 font-mono text-sm">
                    {credential.username}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {credential.last_used_at
                      ? `Last used ${new Date(credential.last_used_at).toLocaleString()}`
                      : "Not used yet"}
                  </p>
                </div>
                {credential.is_active && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={busy}
                      onClick={() => void reset(credential)}
                    >
                      <RefreshCw className="mr-2 size-4" />
                      Reset password
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={busy}
                      onClick={() => void revoke(credential)}
                      aria-label={`Revoke ${credential.name}`}
                    >
                      <ShieldOff className="size-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SecretField({
  label,
  value,
  onCopy,
}: {
  label: string;
  value: string;
  onCopy: (value: string) => void;
}) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input readOnly value={value} className="font-mono" />
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={`Copy ${label}`}
          onClick={() => void onCopy(value)}
        >
          <Copy className="size-4" />
        </Button>
      </div>
    </div>
  );
}
