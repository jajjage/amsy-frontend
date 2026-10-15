export type PublicApiV1Mode = "data" | "airtime";

export type PublicApiV1Payload = {
  network: number;
  phone: string;
  bypass: boolean;
  "request-id": string;
} & ({ data_plan: number } | { plan_type: "VTU"; amount: number });

export function buildPublicApiV1Payload(input: {
  mode: PublicApiV1Mode;
  network: string;
  phone: string;
  dataPlan?: string;
  amount?: string;
  bypass: boolean;
  requestId: string;
}): PublicApiV1Payload {
  const common = {
    network: Number(input.network),
    phone: input.phone.trim(),
    bypass: input.bypass,
    "request-id": input.requestId.trim(),
  };

  return input.mode === "data"
    ? { ...common, data_plan: Number(input.dataPlan) }
    : { ...common, plan_type: "VTU", amount: Number(input.amount) };
}
