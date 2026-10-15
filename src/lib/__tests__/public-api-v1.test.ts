import { describe, expect, it } from "vitest";
import { buildPublicApiV1Payload } from "@/lib/public-api-v1";

describe("buildPublicApiV1Payload", () => {
  it("builds the ADEX-compatible data payload with numeric network and plan ids", () => {
    expect(buildPublicApiV1Payload({
      mode: "data", network: "1", phone: " 07062723822 ", dataPlan: "543",
      bypass: false, requestId: " Data_local-1 ",
    })).toEqual({
      network: 1, phone: "07062723822", data_plan: 543, bypass: false,
      "request-id": "Data_local-1",
    });
  });

  it("always sends airtime as VTU with a numeric amount", () => {
    expect(buildPublicApiV1Payload({
      mode: "airtime", network: "2", phone: "08100000000", amount: "100.50",
      bypass: true, requestId: "Airtime_local-2",
    })).toEqual({
      network: 2, phone: "08100000000", plan_type: "VTU", amount: 100.5,
      bypass: true, "request-id": "Airtime_local-2",
    });
  });
});
