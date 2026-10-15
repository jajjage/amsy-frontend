import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { V1ApiConsole } from "@/components/features/reseller/V1ApiConsole";

describe("V1ApiConsole", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({ status: "success", "request-id": "demo" }),
    });
    vi.stubGlobal("fetch", fetchMock);
  });

  it("sends the synchronous data payload and displays the direct response", async () => {
    const user = userEvent.setup();
    render(<V1ApiConsole />);
    await user.type(screen.getByLabelText("Nexus API key"), "nx_live_example");
    await user.type(screen.getByLabelText("Recipient phone"), "07062723822");
    await user.type(screen.getByLabelText("Data plan number"), "543");
    await user.click(screen.getByRole("button", { name: "Send data request" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/data",
      expect.objectContaining({
        method: "POST",
        headers: {
          Authorization: "Token nx_live_example",
          "Content-Type": "application/json",
        },
        body: expect.stringContaining('"data_plan":543'),
      })
    );
    expect(await screen.findByText(/"status": "success"/)).toBeInTheDocument();
  });

  it("sends airtime as VTU and preserves the immediate provider result", async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 202,
      text: async () =>
        JSON.stringify({ status: "pending", "request-id": "waiting" }),
    });
    render(<V1ApiConsole />);
    await user.click(screen.getByRole("tab", { name: "Airtime" }));
    await user.type(screen.getByLabelText("Nexus API key"), "nx_live_example");
    await user.type(screen.getByLabelText("Recipient phone"), "08100000000");
    await user.type(screen.getByLabelText("Airtime amount (₦)"), "100");
    fireEvent.click(
      screen.getByRole("button", { name: "Send airtime request" })
    );

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/topup",
      expect.objectContaining({
        body: expect.stringContaining('"plan_type":"VTU"'),
      })
    );
    expect((await screen.findAllByText(/HTTP 202/)).length).toBeGreaterThan(0);
    expect(await screen.findByText(/"status": "pending"/)).toBeInTheDocument();
  });
});
