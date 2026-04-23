import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export async function GET() {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            background:
              "linear-gradient(135deg, #f5fcfe 0%, #d6f3f8 50%, #b8eaf3 100%)",
            width: "1200px",
            height: "630px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            padding: "40px",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          {/* Logo/Shield Container */}
          <div
            style={{
              width: "200px",
              height: "200px",
              background: "#25b4d2",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 24px 60px rgba(37, 180, 210, 0.28)",
            }}
          >
            {/* A Text Logo */}
            <div
              style={{
                fontSize: "80px",
                fontWeight: "bold",
                color: "#000000",
                letterSpacing: "8px",
                position: "relative",
              }}
            >
              A
            </div>
          </div>

          {/* Main Title */}
          <div
            style={{
              fontSize: "56px",
              fontWeight: "bold",
              color: "#000000",
              textAlign: "center",
              marginBottom: "10px",
              lineHeight: "1.2",
            }}
          >
            AMSY
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: "38px",
              color: "rgba(0, 0, 0, 0.76)",
              textAlign: "center",
              fontWeight: "600",
              marginBottom: "20px",
            }}
          >
            DATA & AIRTIME
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: "24px",
              color: "rgba(0, 0, 0, 0.68)",
              textAlign: "center",
              maxWidth: "900px",
              marginTop: "10px",
            }}
          >
            Premium Data & Airtime Services
          </div>

          {/* Decorative bottom bar */}
          <div
            style={{
              position: "absolute",
              bottom: "0",
              left: "0",
              width: "100%",
              height: "8px",
              background: "linear-gradient(90deg, #1a8ca5 0%, #25b4d2 100%)",
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error("Error generating OG image:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
