import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Aquari — 九尾系Vtuber 公式サイト";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const visual = await readFile(join(process.cwd(), "public/aquari-shrine.png"));
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#071627", color: "white", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: -90, top: -100, width: 700, height: 800, borderRadius: "50%", background: "#123a55", display: "flex" }} />
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "65px", width: 710 }}>
        <div style={{ color: "#83e3ed", fontSize: 22, letterSpacing: 5 }}>SIRIUS GAMING</div>
        <div style={{ fontSize: 126, fontWeight: 700, marginTop: 20, letterSpacing: -5 }}>Aquari</div>
        <div style={{ fontSize: 28, color: "#d7e9f6", letterSpacing: 3, marginTop: 6 }}>OFFICIAL WEBSITE</div>
        <div style={{ width: 72, height: 4, background: "#67e8f9", marginTop: 32, marginBottom: 28 }} />
        <div style={{ fontSize: 19, color: "#a4becf", letterSpacing: 2 }}>GAMES · TRAVEL · FOOTBALL</div>
        <div style={{ fontSize: 23, color: "#83e3ed", marginTop: 48 }}>aquari-vt.jp</div>
      </div>
      {/* ImageResponse renders an image directly; next/image is not supported here. */}
      <img src={`data:image/png;base64,${visual.toString("base64")}`} alt="" width={415} height={586} style={{ position: "absolute", right: 50, bottom: 0, objectFit: "contain" }} />
    </div>, size,
  );
}
