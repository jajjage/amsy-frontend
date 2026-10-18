import { Card, CardContent } from "@/components/ui/card";
import type { ReactNode } from "react";

interface SensitiveAnalyticsGateProps {
  loading: boolean;
  locked: boolean;
  children: ReactNode;
}

/** Prevent sensitive analytics components (and their queries) from mounting until unlocked. */
export function SensitiveAnalyticsGate({
  loading,
  locked,
  children,
}: SensitiveAnalyticsGateProps) {
  if (loading || locked) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          {loading
            ? "Loading analytics security settings…"
            : "Sensitive analytics are locked. Enter your admin password above to view this section."}
        </CardContent>
      </Card>
    );
  }

  return <div className="space-y-6">{children}</div>;
}
