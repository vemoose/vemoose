import { ImageResponse } from "next/og";

export const alt = "Vemoose — Independent product studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#080C0A",
          color: "#F5F7F5",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -80,
            top: 80,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(53,241,138,0.22) 0%, transparent 68%)",
          }}
        />
        <p style={{ fontSize: 18, letterSpacing: 6, color: "#798B80", textTransform: "uppercase" }}>
          Independent product studio
        </p>
        <div
          style={{
            fontSize: 86,
            fontWeight: 500,
            letterSpacing: -4,
            lineHeight: 0.98,
            display: "flex",
          }}
        >
          Ideas into <span style={{ color: "#35F18A" }}>existence.</span>
        </div>
        <p style={{ fontSize: 22, color: "#A4B2A8", maxWidth: 560 }}>
          Digital products, tools, and experiments born from curiosity.
        </p>
      </div>
    ),
    { ...size },
  );
}