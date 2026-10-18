import { render, screen } from "@testing-library/react";
import { SensitiveAnalyticsGate } from "@/components/features/admin/analytics/SensitiveAnalyticsGate";

describe("SensitiveAnalyticsGate", () => {
  it("does not mount sensitive content while locked", () => {
    render(
      <SensitiveAnalyticsGate loading={false} locked>
        <div>Private revenue figures</div>
      </SensitiveAnalyticsGate>
    );

    expect(screen.queryByText("Private revenue figures")).not.toBeInTheDocument();
    expect(screen.getByText(/Sensitive analytics are locked/i)).toBeInTheDocument();
  });

  it("does not mount sensitive content before the lock configuration loads", () => {
    render(
      <SensitiveAnalyticsGate loading locked={false}>
        <div>Private revenue figures</div>
      </SensitiveAnalyticsGate>
    );

    expect(screen.queryByText("Private revenue figures")).not.toBeInTheDocument();
    expect(screen.getByText(/Loading analytics security settings/i)).toBeInTheDocument();
  });

  it("mounts sensitive content after unlock or when the lock is disabled", () => {
    render(
      <SensitiveAnalyticsGate loading={false} locked={false}>
        <div>Private revenue figures</div>
      </SensitiveAnalyticsGate>
    );

    expect(screen.getByText("Private revenue figures")).toBeInTheDocument();
  });
});
