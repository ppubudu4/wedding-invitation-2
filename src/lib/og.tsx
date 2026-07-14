import { ImageResponse } from "next/og";
import { wedding } from "./wedding";

export const OG_SIZE = { width: 1200, height: 630 };

const C = {
  bg: "#faf6f1",
  panel: "#ffffff",
  frame: "#e6d6cd",
  ink: "#4b3942",
  muted: "#96727d",
  rose: "#c76b7f",
  roseDeep: "#a24d61",
  sage: "#9db99f",
  gold: "#d8b16b",
  pink: "#e3a9b5",
};

type Pos = { top?: number; left?: number; right?: number; bottom?: number };

/** A small cluster of circles suggesting a rose + buds. No transforms. */
function Bloom(pos: Pos) {
  const dot = (x: number, y: number, r: number, color: string) => (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: r,
        height: r,
        borderRadius: 999,
        background: color,
      }}
    />
  );
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        width: 170,
        height: 170,
        ...pos,
      }}
    >
      {dot(44, 34, 50, C.rose)}
      {dot(86, 58, 44, C.roseDeep)}
      {dot(20, 74, 38, C.pink)}
      {dot(78, 104, 32, C.gold)}
      {dot(6, 34, 32, C.sage)}
      {dot(110, 20, 28, C.sage)}
    </div>
  );
}

/** Render the shareable Open Graph card (personalized when greeting is given). */
export async function renderOgCard(greeting?: string) {
  const { groom, bride, dateLabel, venue } = wedding;

  // Single font keeps the edge bundle under Vercel's 1 MB limit.
  const cardo = await fetch(
    new URL("./fonts/cardo-regular.ttf", import.meta.url)
  ).then((r) => r.arrayBuffer());

  const topLine = greeting
    ? `Dear ${greeting}, you're warmly invited`
    : "THE WEDDING OF";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: C.bg,
          position: "relative",
          fontFamily: "Cardo",
        }}
      >
        <Bloom top={-30} left={-30} />
        <Bloom top={-26} right={-26} />
        <Bloom bottom={-30} left={-26} />
        <Bloom bottom={-32} right={-30} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            width: 1010,
            height: 470,
            background: C.panel,
            border: `2px solid ${C.frame}`,
            borderRadius: 20,
            padding: 48,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: greeting ? 34 : 26,
              color: greeting ? C.roseDeep : C.rose,
              marginBottom: 12,
            }}
          >
            {topLine}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 116,
              color: C.ink,
              lineHeight: 1.05,
            }}
          >
            {groom.name} & {bride.name}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 24,
              marginBottom: 24,
            }}
          >
            <div style={{ display: "flex", width: 90, height: 2, background: C.frame }} />
            <div
              style={{
                display: "flex",
                width: 12,
                height: 12,
                borderRadius: 999,
                background: C.rose,
                marginLeft: 14,
                marginRight: 14,
              }}
            />
            <div style={{ display: "flex", width: 90, height: 2, background: C.frame }} />
          </div>

          <div style={{ display: "flex", fontSize: 34, color: C.ink }}>
            {dateLabel}
          </div>
          <div style={{ display: "flex", fontSize: 30, color: C.muted, marginTop: 8 }}>
            {venue.name}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [{ name: "Cardo", data: cardo, weight: 400, style: "normal" }],
    }
  );
}
