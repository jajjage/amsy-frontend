"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResetUserPasscode, useResetUserPin } from "@/hooks/admin/useAdminUsers";
import { KeyRound, Loader2 } from "lucide-react";
import { useState } from "react";

export function ResetSecurityCodes({ userId }: { userId: string }) {
  const [pin, setPin] = useState("");
  const [passcode, setPasscode] = useState("");
  const pinMutation = useResetUserPin();
  const passcodeMutation = useResetUserPasscode();
  return <div className="grid gap-3 sm:grid-cols-2">
    <div className="space-y-2 rounded-lg border p-3"><Label>Reset transaction PIN</Label><Input inputMode="numeric" maxLength={4} placeholder="4 digits" value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ""))} /><Button className="w-full" variant="outline" disabled={pin.length !== 4 || pinMutation.isPending} onClick={() => pinMutation.mutate({ userId, newPin: pin })}>{pinMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}<KeyRound className="mr-2 h-4 w-4" />Reset PIN</Button></div>
    <div className="space-y-2 rounded-lg border p-3"><Label>Reset app passcode</Label><Input inputMode="numeric" maxLength={6} placeholder="6 digits" value={passcode} onChange={e => setPasscode(e.target.value.replace(/\D/g, ""))} /><Button className="w-full" variant="outline" disabled={passcode.length !== 6 || passcodeMutation.isPending} onClick={() => passcodeMutation.mutate({ userId, newPasscode: passcode })}>{passcodeMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}<KeyRound className="mr-2 h-4 w-4" />Reset Passcode</Button></div>
  </div>;
}
