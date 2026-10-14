import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const title = "Aquari｜九尾系Vtuber 公式サイト";
const description = "SIRIUS GAMING所属の九尾系Vtuber・Aquariの公式サイト。YouTube・Twitchの配信、最新動画・Shorts、週間スケジュール、衣装ビジュアルをお届けします。";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.aquari-vt.jp"),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: { title, description, url: "/", siteName: "Aquari Official Site", locale: "ja_JP", type: "website" },
  twitter: { card: "summary_large_image", title, description, creator: "@Aquari_Vt", images: ["/opengraph-image"] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        {children}

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WMFMXV0S86"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WMFMXV0S86');
          `}
        </Script>
      </body>
    </html>
  );
}
