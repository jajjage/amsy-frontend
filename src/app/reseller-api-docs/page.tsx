"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

export default function ResellerApiDocsPage() {
  const docsUrl = "/api/v1/docs/reseller/openapi.json";

  return (
    <div className="bg-muted/40 min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reseller API Documentation</h1>
          <p className="text-muted-foreground mt-2">
            OpenAPI reference for API key purchases, status polling, and webhook
            callbacks.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>OpenAPI Specification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Open the live JSON specification in your browser or import it into
              Postman, Insomnia, Swagger Editor, or your API client of choice.
            </p>
            <Button asChild>
              <a href={docsUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open OpenAPI JSON
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
