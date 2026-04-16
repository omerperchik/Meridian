import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const runtime = "edge";
export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(94, 106, 210, 0.35), transparent 70%), #08090a",
          color: "#f7f8f8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#7170ff" strokeWidth="1.75" />
            <path d="M12 2v20M2 12h20" stroke="#7170ff" strokeWidth="1" strokeOpacity="0.5" />
            <circle cx="12" cy="12" r="2.5" fill="#7170ff" />
          </svg>
          <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: -0.5 }}>{SITE.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 600, letterSpacing: -2.5, lineHeight: 1.05 }}>
            The operating standard{"\n"}for AI agents.
          </div>
          <div style={{ fontSize: 26, color: "#b4bcd0", maxWidth: "85%" }}>
            Neutral behavioral standard. Live trust scores. Public incident record. Machine-readable.
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 18, color: "#8a8f98" }}>
          <span style={{ padding: "4px 10px", background: "rgba(94, 106, 210, 0.15)", borderRadius: 6, color: "#7170ff" }}>
            UAOP v{SITE.constitutionVersion}
          </span>
          <span>·</span>
          <span>{SITE.url.replace("https://", "")}</span>
        </div>
      </div>
    ),
    size,
  );
}
