import { renderOgCard, OG_SIZE } from "@/lib/og";

export const runtime = "edge";
export const alt = "Pubudu & Chaya — Wedding Invitation";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgCard();
}
