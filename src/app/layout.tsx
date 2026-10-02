import type { Metadata, Viewport } from "next";
import { Figtree, JetBrains_Mono } from "next/font/google";
import { site } from "@/site.config";
import "./globals.css";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} · ${site.role}`, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: { type: "website", siteName: site.name },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8fd" },
    { media: "(prefers-color-scheme: dark)", color: "#10121d" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${jetbrains.variable}`}
    >
      <body>
        {children}
      </body>
    </html>
  );
}
