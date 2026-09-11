import { ImageResponse } from "next/og";

export const alt = "Rahul — Full Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "#000000",
          padding: "80px",
        }}
      >
        <div style={{ display: "flex", fontSize: 32, color: "#a1a1aa", letterSpacing: 2 }}>
          FULL STACK DEVELOPER
        </div>
        <div style={{ display: "flex", fontSize: 120, fontWeight: 700, color: "#ffffff", marginTop: 20 }}>
          Rahul
          <span style={{ color: "#facc15" }}>.dev</span>
        </div>
        <div style={{ display: "flex", fontSize: 34, color: "#71717a", marginTop: 24, maxWidth: 900 }}>
          Next.js · React · Node.js · PostgreSQL
        </div>
      </div>
    ),
    { ...size }
  );
}
