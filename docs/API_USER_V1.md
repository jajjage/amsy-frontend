# API user V1 in AMSY

API-only dashboard tools are shown to `api_user` accounts. Reseller accounts keep their reseller business tools, including bulk top-up, but do not see the API console or credential management. Existing keys are not revoked by this UI change.

## Getting started

1. Open Dashboard → Developer Tools → API Keys and create a Nexus API key. The full key is shown once; store it securely.
2. For an ADEX-compatible client that only accepts username/password, open ADEX Credentials and create a named integration. Copy the generated username and password immediately. The password is only displayed at creation or reset.
3. Configure the client with the tenant's API base URL and those ADEX credentials. Its connection test calls `POST /api/user`; purchases use the returned ADEX token according to the client's behavior.
4. Use V1 API Console to test `POST /api/data` or `POST /api/topup` directly with a Nexus API key. The purchase result is synchronous; a webhook is optional and supplementary.

## Payloads

Data request:

```json
{
  "network": 1,
  "phone": "234XXXXXXXXXX",
  "data_plan": 1,
  "bypass": false,
  "request-id": "Data_unique-reference"
}
```

Airtime request:

```json
{
  "network": 1,
  "phone": "234XXXXXXXXXX",
  "plan_type": "VTU",
  "amount": 100,
  "bypass": false,
  "request-id": "Airtime_unique-reference"
}
```

Requests use `Authorization: Token <Nexus API key>` and JSON content type. The network IDs and data plan numbers belong to the tenant's configuration; do not assume another tenant uses the same values. A response with HTTP 202 is still processing. Otherwise inspect the response body's `status` as well as the HTTP status.

The old reseller purchase console remains available to API users as **Legacy Purchase Console**. It continues to use `/api/v1/reseller/api/purchases`; the new V1 routes do not replace or alter it.
